// Matches react-native-image-crop-picker's crop box in
// apps/mobile/src/components/users/ProfileImagePicker.tsx (`width: 500,
// height: 500, cropping: true`) — output is always exactly 500x500.
const OUTPUT_SIZE = 500;
// Matches react-native-compressor's `quality: 0.8` in
// apps/mobile/src/hooks/users/useProfileImageUpload.ts.
const JPEG_QUALITY = 0.8;

export interface PixelCropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CroppedProfileImage {
  blob: Blob;
  mimetype: string;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = src;
  });
}

/**
 * Extracts the user-selected crop area (from react-easy-crop's
 * onCropComplete pixel area) and re-encodes it as a 500x500 JPEG at quality
 * 0.8 — the same output shape as the mobile app's profile image pipeline
 * (react-native-image-crop-picker's interactive 1:1 crop, then
 * react-native-compressor).
 */
export async function cropImageToBlob(
  imageSrc: string,
  area: PixelCropArea,
): Promise<CroppedProfileImage> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");
  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error("Canvas toBlob failed")),
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
  return { blob, mimetype: "image/jpeg" };
}
