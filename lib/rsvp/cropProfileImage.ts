const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.8;

export interface CroppedProfileImage {
  blob: Blob;
  mimetype: string;
}

/**
 * Center-crops to a square and re-encodes as JPEG, matching the output shape
 * of the mobile app's profile image pipeline (react-native-image-crop-picker's
 * 1:1 crop + react-native-compressor's `maxWidth/maxHeight: 1024, quality:
 * 0.8` — apps/mobile/src/hooks/users/useProfileImageUpload.ts). Unlike
 * mobile, this doesn't let the caller reposition/zoom before cropping — it's
 * always a plain center crop.
 */
export async function centerCropAndCompress(
  file: File,
): Promise<CroppedProfileImage> {
  const bitmap = await createImageBitmap(file);
  try {
    const side = Math.min(bitmap.width, bitmap.height);
    const sx = (bitmap.width - side) / 2;
    const sy = (bitmap.height - side) / 2;
    const targetSize = Math.min(side, MAX_DIMENSION);

    const canvas = document.createElement("canvas");
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas context unavailable");
    ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, targetSize, targetSize);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) =>
          result ? resolve(result) : reject(new Error("Canvas toBlob failed")),
        "image/jpeg",
        JPEG_QUALITY,
      );
    });
    return { blob, mimetype: "image/jpeg" };
  } finally {
    bitmap.close();
  }
}
