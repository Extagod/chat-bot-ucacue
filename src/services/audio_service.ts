// src/services/audio_service.ts
import { api } from "../services/http" // tu instancia axios

/**
 * Envía un archivo de audio al backend para transcribir
 * @param file Archivo de audio
 */
export async function sendAudio(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  try {
    // Usamos tu instancia api con baseURL y timeout configurados
    const { data } = await api.post("/audio/transcribe", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  } catch (err: any) {
    console.error("Error enviando audio:", err)
    throw new Error("Error al enviar audio")
  }
}
