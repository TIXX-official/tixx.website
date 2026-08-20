"use client";

import { type CSSProperties, useRef, useState } from "react";
import { Text } from "@/components/detail/Text";
import {
  requestProfileImageUpload,
  uploadToPresignedUrl,
} from "@/lib/api/rsvp";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const inputStyle: CSSProperties = { color: "var(--rsvp-answer-color)" };

interface ProfileImageFieldProps {
  /** mediaUrl of the last successful upload, or null if none yet. */
  value: string | null;
  onChange: (mediaUrl: string) => void;
  disabled?: boolean;
  label: string;
  uploadingLabel: string;
  changeLabel: string;
  invalidTypeMessage: string;
  tooLargeMessage: string;
  uploadFailedMessage: string;
}

export function ProfileImageField({
  value,
  onChange,
  disabled,
  label,
  uploadingLabel,
  changeLabel,
  invalidTypeMessage,
  tooLargeMessage,
  uploadFailedMessage,
}: ProfileImageFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
    setIsUploading(true);
    try {
      // Generated in the browser, not derived from the (not-yet-known) user
      // id — guide §7 "프로필 이미지 업로드".
      const uploadId = `rsvp-${crypto.randomUUID()}`;
      const { presignedUrl, mediaUrl } = await requestProfileImageUpload(
        uploadId,
        file.type,
      );
      await uploadToPresignedUrl(presignedUrl, file);
      onChange(mediaUrl);
    } catch {
      setError(uploadFailedMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Text variant="body3Regular" className="text-grayscale-300">
        {label}
      </Text>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element -- remote R2 URL, no next/image domain config for it
        <img
          src={value}
          alt=""
          className="h-24 w-24 rounded-full object-cover"
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_MIME_TYPES.join(",")}
        onChange={(e) => void handleFileChange(e)}
        disabled={disabled || isUploading}
        className="w-full border-b border-current bg-transparent px-2 py-2 outline-none disabled:opacity-50"
        style={inputStyle}
      />
      {isUploading && (
        <Text variant="caption1Regular" className="text-grayscale-400">
          {uploadingLabel}
        </Text>
      )}
      {!isUploading && value && (
        <Text variant="caption1Regular" className="text-grayscale-400">
          {changeLabel}
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
    </div>
  );
}
