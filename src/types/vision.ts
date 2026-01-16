// ==== Tipos base ====

export type VisionTask =
  | "describe"
  | "objects"
  | "ocr"
  | "tags"
  | "safety"
  | "all"

// ==== Input de imagen ====
// Debes enviar EXACTAMENTE uno: url o data_url
export interface VisionImageInput {
  url?: string            // HttpUrl en backend
  data_url?: string       // "data:image/png;base64,..."
}

// ==== Request principal ====

export interface VisionRequest {
  task?: VisionTask                // default "all"
  question?: string                // default "Describe la imagen."
  images: VisionImageInput[]       // min 1, max 4

  // Controles del modelo
  temperature?: number             // 0.0 – 1.5
  max_completion_tokens?: number   // 64 – 2048
  top_p?: number                   // 0.1 – 1.0

  // Modo estricto
  strict_json?: boolean            // default true
}

// ==== Resultado del modelo ====

export interface VisionResult {
  description?: string
  objects?: string[]
  ocr_text?: string
  tags?: string[]
  safety?: Record<string, any>
  raw?: string
}

// ==== Response del backend ====

export interface VisionResponse {
  model: string
  result: VisionResult
}
