import { api } from "./http"
import type { VisionResponse } from "../types/vision"

export async function sendVisionUpload(
  file: File
): Promise<VisionResponse> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const { data } = await api.post<VisionResponse>(
      "/vision/analyze-upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    return data
  } catch (error: any) {
    console.error("Vision API error:", error)

    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }

    throw new Error("Error al analizar la imagen")
  }
}
