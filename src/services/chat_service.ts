import type { ChatRequest, ChatResponse } from "../types/chat"
import { api } from "./http"

export async function sendChatMessage(
  payload: ChatRequest
): Promise<ChatResponse> {
  console.group("📡 sendChatMessage")
  console.log("➡️ Payload:", payload)

  try {
    // ✅ según tu Swagger: POST /chat/api/chat
    const response = await api.post<ChatResponse>("/chat", payload)

    console.log("📥 Response:", response.data)
    console.groupEnd()
    return response.data
  } catch (error) {
    console.error("❌ Error in sendChatMessage:", error)
    console.groupEnd()
    throw error
  }
}
