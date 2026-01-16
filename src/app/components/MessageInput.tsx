import { Send, Paperclip, Mic, StopCircle } from "lucide-react"
import { useState, useRef, useEffect } from "react"

import { fileToDataUrl } from "../../utils/file"
import { sendVisionUpload } from "../../services/vision_service"
import { validateVisionImages } from "../../validators/vision"
import type { VisionRequest } from "../../types/vision"


interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || disabled || isUploadingImage) return

    onSendMessage(message.trim())
    setMessage("")

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileUpload = () => {
  const input = document.createElement("input")
  input.type = "file"
  input.accept = "image/*"

  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    setIsUploadingImage(true)

    try {
      const response = await sendVisionUpload(file)

      onSendMessage(
        response.result.description ??
          "No se pudo analizar la imagen."
      )
    } catch (error) {
      console.error("Error analizando imagen:", error)
      onSendMessage("❌ Error al analizar la imagen.")
    } finally {
      setIsUploadingImage(false)
    }
  }

  input.click()
}

  const toggleRecording = () => {
    setIsRecording((prev) => !prev)

    if (!isRecording) {
      console.log("Recording started")
    } else {
      console.log("Recording stopped")
    }
  }

  return (
    <div className="border-t border-border bg-background px-4 py-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2 bg-input-background border border-border rounded-2xl p-2 focus-within:border-primary/50 transition-colors">
            {/* Attach Image Button */}
            <button
              type="button"
              onClick={handleFileUpload}
              disabled={disabled || isUploadingImage}
              className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
              aria-label="Attach image"
            >
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu consulta académica..."
              className="flex-1 bg-transparent resize-none outline-none py-2 px-2 max-h-32 min-h-[24px]"
              rows={1}
              disabled={disabled || isUploadingImage}
            />

            {/* Voice Recording Button */}
            <button
              type="button"
              onClick={toggleRecording}
              disabled={disabled || isUploadingImage}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                isRecording
                  ? "bg-destructive/10 hover:bg-destructive/20"
                  : "hover:bg-secondary"
              }`}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? (
                <StopCircle className="h-5 w-5 text-destructive animate-pulse" />
              ) : (
                <Mic className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!message.trim() || disabled || isUploadingImage}
              className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                message.trim() && !disabled && !isUploadingImage
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          {/* Helper Text */}
          <div className="flex items-center justify-between mt-2 px-2">
            <p className="text-xs text-muted-foreground">
              Enter para enviar · Shift + Enter para nueva línea
            </p>
            <p className="text-xs text-muted-foreground">
              {isUploadingImage
                ? "Analizando imagen…"
                : message.length > 0
                ? `${message.length} caracteres`
                : ""}
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
