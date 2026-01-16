/* ================== ROLES ================== */

export enum Role {
  system = "system",
  user = "user",
  assistant = "assistant",
}

/* ================== API (BACKEND) ================== */

export interface ApiMessage {
  role: Role
  content: string // ⚠️ SIEMPRE string
}

export interface ChatRequest {
  messages: ApiMessage[]
  temperature?: number
  max_tokens?: number
}

export interface ChatResponse {
  reply: string
  model: string
  usage?: Record<string, any> | null
}
