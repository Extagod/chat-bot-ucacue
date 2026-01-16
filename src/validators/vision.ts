import type { VisionImageInput } from "../types/vision"

export function validateVisionImages(images: VisionImageInput[]): void {
  if (images.length < 1 || images.length > 4) {
    throw new Error("Debes enviar entre 1 y 4 imágenes")
  }

  for (const img of images) {
    const hasUrl = Boolean(img.url)
    const hasDataUrl = Boolean(img.data_url)

    if (hasUrl === hasDataUrl) {
      throw new Error(
        "Cada imagen debe tener exactamente uno: 'url' o 'data_url'"
      )
    }
  }
}
