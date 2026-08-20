"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { Button } from "@/components/detail/Button";
import { Text } from "@/components/detail/Text";

interface ProfileImageCropModalProps {
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (area: Area) => void;
  title: string;
  confirmLabel: string;
  cancelLabel: string;
}

export function ProfileImageCropModal({
  imageSrc,
  onCancel,
  onConfirm,
  title,
  confirmLabel,
  cancelLabel,
}: ProfileImageCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
    null,
  );

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black p-4">
      <Text variant="headline2Medium" className="mb-3 text-white">
        {title}
      </Text>
      <div className="relative min-h-0 flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>
      <input
        type="range"
        min={1}
        max={3}
        step={0.01}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        aria-label="zoom"
        className="mt-4 w-full accent-point-500"
      />
      <div className="mt-4 flex gap-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          {cancelLabel}
        </Button>
        <Button
          onClick={() => croppedAreaPixels && onConfirm(croppedAreaPixels)}
          className={
            croppedAreaPixels ? "flex-1" : "pointer-events-none flex-1 opacity-50"
          }
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
