import { useState, useEffect, useRef } from "react"
import { Menu, X } from "lucide-react"

import { Header } from "./components/Header"
import { Sidebar } from "./components/Sidebar"
import { ChatArea } from "./components/ChatArea"
import type { Message } from "./components/ChatArea"
import { MessageInput } from "./components/MessageInput"

import { sendChatMessage } from "../services/chat_service"
import { Role, type ApiMessage } from "../types/chat"

/* ================== TYPES ================== */

interface Conversation {
  id: string
  title: string
  date: string
}

/* ================== APP ================== */

export default function App() {
  const [isDark, setIsDark] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", title: "Introducción a Algoritmos", date: "Hace 2 horas" },
    { id: "2", title: "Bases de Datos Relacionales", date: "Ayer" },
  ])

  const [activeConversationId, setActiveConversationId] = useState("1")
  const chatEndRef = useRef<HTMLDivElement>(null)

  /* ================== UTILS ================== */

  const nowTime = () =>
    new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })

  /* ================== EFFECTS ================== */

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  /* ================== HANDLERS ================== */

  const handleToggleTheme = () => setIsDark((p) => !p)

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "Nueva conversación",
      date: "Ahora",
    }
    setConversations((prev) => [newConversation, ...prev])
    setActiveConversationId(newConversation.id)
    setMessages([])
    setIsSidebarOpen(false)
  }

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id)
    setIsSidebarOpen(false)
    setMessages([]) // luego historial real
  }

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
  }

  /* ======================================================
     🔥 ENVÍO DE MENSAJES
     - Texto → backend chat
     - Imagen → solo frontend (preview)
     ====================================================== */
  const handleSendMessage = async (
    content: string,
    image?: string // data_url
  ) => {
    if (!content.trim() && !image) return

    /* ---------- 1️⃣ MENSAJE UI USUARIO ---------- */
    const userUiMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim() || undefined,
      image,
      timestamp: nowTime(),
    }

    const nextUiMessages = [...messages, userUiMessage]
    setMessages(nextUiMessages)

    // ⚠️ solo imagen → no llamar backend
    if (!content.trim()) return

    setIsTyping(true)

    try {
      /* ---------- 2️⃣ UI → API (SOLO TEXTO) ---------- */
      const apiMessages: ApiMessage[] = [
        {
          role: Role.system,
          content: "Eres el Asistente Académico UCACUE.",
        },
        ...nextUiMessages
          .filter(
            (m): m is Message & { content: string } =>
              typeof m.content === "string"
          )
          .map((m) => ({
            role: m.role === "user" ? Role.user : Role.assistant,
            content: m.content,
          })),
      ]

      /* ---------- 3️⃣ BACKEND CHAT ---------- */
      const res = await sendChatMessage({
        messages: apiMessages,
        temperature: 0.5,
        max_tokens: 512,
      })

      /* ---------- 4️⃣ MENSAJE UI BOT ---------- */
      const botUiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.reply,
        timestamp: nowTime(),
      }

      setMessages((prev) => [...prev, botUiMessage])

      /* ---------- 5️⃣ TÍTULO CONVERSACIÓN ---------- */
      if (messages.length === 0) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId
              ? {
                  ...c,
                  title:
                    content.slice(0, 40) +
                    (content.length > 40 ? "..." : ""),
                }
              : c
          )
        )
      }
    } catch (error) {
      console.error(error)

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content:
            "❌ Error al conectar con el servidor. Verifica que FastAPI esté activo.",
          timestamp: nowTime(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  /* ================== UI ================== */

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground">
      <Header isDark={isDark} onToggleTheme={handleToggleTheme} />

      <div className="flex-1 flex overflow-hidden relative">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed left-4 top-20 z-50 p-2 bg-card border rounded-lg"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>

        <div className={`${isSidebarOpen ? "fixed z-50" : "hidden md:block"}`}>
          <Sidebar
            isOpen={isSidebarOpen}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatArea messages={messages} isTyping={isTyping} />
          <div ref={chatEndRef} />
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isTyping}
          />
        </div>
      </div>
    </div>
  )
}
