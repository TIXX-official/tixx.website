"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import { Text } from "@/components/detail/Text";
import { ProfileImageCropModal } from "@/components/event-rsvp/ProfileImageCropModal";
import {
  requestProfileImageUpload,
  uploadToPresignedUrl,
} from "@/lib/api/rsvp";
import { cropImageToBlob } from "@/lib/rsvp/cropProfileImage";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

interface ProfileImageFieldProps {
  /** mediaUrl of the last successful upload, or null if none yet. */
  value: string | null;
  onChange: (mediaUrl: string) => void;
  disabled?: boolean;
  label: string;
  uploadingLabel: string;
  invalidTypeMessage: string;
  tooLargeMessage: string;
  uploadFailedMessage: string;
  cropTitle: string;
  cropConfirmLabel: string;
  cropCancelLabel: string;
}

export function ProfileImageField({
  value,
  onChange,
  disabled,
  label,
  uploadingLabel,
  invalidTypeMessage,
  tooLargeMessage,
  uploadFailedMessage,
  cropTitle,
  cropConfirmLabel,
  cropCancelLabel,
}: ProfileImageFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Object URL for the file currently being cropped — non-null while the
  // crop modal is open.
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Object URLs aren't reclaimed by GC — revoke on unmount in case the
  // modal is dismissed by navigating away rather than cancel/confirm.
  useEffect(() => {
    return () => {
      if (pendingImageSrc) URL.revokeObjectURL(pendingImageSrc);
    };
  }, [pendingImageSrc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError(invalidTypeMessage);
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(tooLargeMessage);
      return;
    }

    setError(null);
    setPendingImageSrc(URL.createObjectURL(file));
  };

  const closeCropModal = () => {
    if (pendingImageSrc) URL.revokeObjectURL(pendingImageSrc);
    setPendingImageSrc(null);
  };

  const handleCropConfirm = async (area: Area) => {
    if (!pendingImageSrc) return;
    const imageSrc = pendingImageSrc;
    setPendingImageSrc(null);
    setIsUploading(true);
    try {
      // Crops to the user-selected 500x500 area and re-encodes it,
      // matching the mobile app's profile image pipeline (interactive 1:1
      // crop + compression — see lib/rsvp/cropProfileImage.ts).
      const { blob, mimetype } = await cropImageToBlob(imageSrc, area);
      // Generated in the browser, not derived from the (not-yet-known) user
      // id — guide §7 "프로필 이미지 업로드".
      const uploadId = `rsvp-${crypto.randomUUID()}`;
      const { presignedUrl, mediaUrl } = await requestProfileImageUpload(
        uploadId,
        mimetype,
      );
      await uploadToPresignedUrl(presignedUrl, blob);
      onChange(mediaUrl);
    } catch {
      setError(uploadFailedMessage);
    } finally {
      URL.revokeObjectURL(imageSrc);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Text variant="body3Regular" className="text-grayscale-300">
        {label}
      </Text>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || isUploading}
        aria-label={label}
        className="relative h-24 w-24 shrink-0 rounded-full disabled:opacity-50"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote R2 URL, no next/image domain config for it
          <img
            src={value}
            alt=""
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-grayscale-800">
            <Camera className="h-8 w-8 text-grayscale-400" />
          </div>
        )}
        <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-grayscale-700">
          <Camera className="h-3.5 w-3.5 text-grayscale-200" />
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_MIME_TYPES.join(",")}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />
      {isUploading && (
        <Text variant="caption1Regular" className="text-grayscale-400">
          {uploadingLabel}
        </Text>
      )}
      {error && (
        <Text
          variant="caption1Regular"
          className="text-red-400"
          aria-live="polite"
        >
          {error}
        </Text>
      )}
      {pendingImageSrc && (
        <ProfileImageCropModal
          imageSrc={pendingImageSrc}
          onCancel={closeCropModal}
          onConfirm={(area) => void handleCropConfirm(area)}
          title={cropTitle}
          confirmLabel={cropConfirmLabel}
          cancelLabel={cropCancelLabel}
        />
      )}
    </div>
  );
}
