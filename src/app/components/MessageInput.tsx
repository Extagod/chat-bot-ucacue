// src/components/chat/MessageInput.tsx
import { Send, Paperclip, Mic, StopCircle } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { sendVisionUpload } from "../../services/vision_service"
import { sendAudio } from "../../services/audio_service"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [isSendingAudio, setIsSendingAudio] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // ===== Auto-resize textarea =====
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  // ===== Enviar texto =====
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || disabled || isUploadingImage || isSendingAudio) return
    onSendMessage(message.trim())
    setMessage("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // ===== Subir imágenes =====
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
        onSendMessage(response.result.description ?? "No se pudo analizar la imagen.")
      } catch (err) {
        console.error("Error analizando imagen:", err)
        onSendMessage("❌ Error al analizar la imagen.")
      } finally {
        setIsUploadingImage(false)
      }
    }
    input.click()
  }

  // ===== Grabación de audio =====
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        audioChunksRef.current = []

        mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data)

        mediaRecorder.onstop = async () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
          const url = URL.createObjectURL(blob)
          setAudioURL(url)

          // Enviar audio al backend para transcripción
          await sendRecordedAudio(blob)
        }

        mediaRecorder.start()
        mediaRecorderRef.current = mediaRecorder
        setIsRecording(true)
        console.log("Recording started")
      } catch (err) {
        console.error("No se pudo acceder al micrófono:", err)
      }
    }
  }

  const sendRecordedAudio = async (audioBlob: Blob) => {
    setIsSendingAudio(true)
    try {
      const file = new File([audioBlob], "voice.webm", { type: "audio/webm" })
      const data = await sendAudio(file) // Usamos el servicio simplificado de transcripción
      onSendMessage(data.text ?? data.transcription ?? "No se pudo procesar el audio.")
    } catch (err) {
      console.error("Error enviando audio:", err)
      onSendMessage("❌ Error al procesar el audio.")
    } finally {
      setIsSendingAudio(false)
    }
  }

  const playAudio = () => {
    if (!audioURL) return
    const audio = new Audio(audioURL)
    audio.play()
  }

  return (
    <div className="border-t border-border bg-background px-4 py-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2 bg-input-background border border-border rounded-2xl p-2 focus-within:border-primary/50 transition-colors">
            
            {/* Attach Image */}
            <button
              type="button"
              onClick={handleFileUpload}
              disabled={disabled || isUploadingImage || isSendingAudio}
              className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
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
              disabled={disabled || isUploadingImage || isSendingAudio}
            />

            {/* Voice Recording */}
            <button
              type="button"
              onClick={toggleRecording}
              disabled={disabled || isUploadingImage || isSendingAudio}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                isRecording
                  ? "bg-destructive/10 hover:bg-destructive/20"
                  : "hover:bg-secondary"
              }`}
            >
              {isRecording ? <StopCircle className="h-5 w-5 text-destructive animate-pulse" /> : <Mic className="h-5 w-5 text-muted-foreground" />}
            </button>

            {/* Play recorded audio */}
            {audioURL && !isRecording && (
              <button
                type="button"
                onClick={playAudio}
                className="p-2 rounded-lg hover:bg-secondary flex-shrink-0"
              >
                🎵
              </button>
            )}

            {/* Send Text */}
            <button
              type="submit"
              disabled={!message.trim() || disabled || isUploadingImage || isSendingAudio}
              className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                message.trim() && !disabled && !isUploadingImage && !isSendingAudio
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
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
                : isSendingAudio
                ? "Procesando audio…"
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
