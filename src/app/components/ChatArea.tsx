import { Bot, User, Copy, CheckCheck } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"


export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
}

export function ChatArea({ messages, isTyping }: ChatAreaProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <MessageBubble
                message={message}
                onCopy={handleCopy}
                isCopied={copiedId === message.id}
              />
            </motion.div>
          ))
        )}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TypingIndicator />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onCopy,
  isCopied,
}: {
  message: Message;
  onCopy: (content: string, id: string) => void;
  isCopied: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
      )}

      <div
        className={`group max-w-[80%] md:max-w-[70%] ${
          isUser ? "order-first" : ""
        }`}
      >
        <div
  className={`px-4 py-3 rounded-2xl ${
    isUser
      ? "bg-primary text-primary-foreground"
      : "bg-card border border-border"
  }`}
>
  {isUser ? (
    <p className="whitespace-pre-wrap break-words">
      {message.content}
    </p>
  ) : (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {message.content}
      </ReactMarkdown>
    </div>
  )}
</div>

        <div className="flex items-center gap-2 mt-1 px-2">
          <span className="text-xs text-muted-foreground">
            {message.timestamp}
          </span>
          {!isUser && (
            <button
              onClick={() => onCopy(message.content, message.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-secondary rounded transition-all"
              aria-label="Copy message"
            >
              {isCopied ? (
                <CheckCheck className="h-3 w-3 text-accent" />
              ) : (
                <Copy className="h-3 w-3 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </div>

      {isUser && (
        <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <User className="h-5 w-5 text-accent-foreground" />
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <Bot className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="px-4 py-3 rounded-2xl bg-card border border-border">
        <div className="flex gap-1">
          <motion.div
            className="h-2 w-2 bg-muted-foreground rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="h-2 w-2 bg-muted-foreground rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
          <motion.div
            className="h-2 w-2 bg-muted-foreground rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  const suggestions = [
    {
      icon: "📚",
      title: "Resúmenes",
      description: "Resume capítulos o artículos académicos",
    },
    {
      icon: "💻",
      title: "Programación",
      description: "Ayuda con código y algoritmos",
    },
    {
      icon: "🧮",
      title: "Matemáticas",
      description: "Resolución de problemas y explicaciones",
    },
    {
      icon: "🗄️",
      title: "Bases de Datos",
      description: "Consultas SQL y diseño de esquemas",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mb-2">¡Hola! Soy tu Asistente Académico UCACUE</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Estoy aquí para ayudarte con tus estudios. Puedo asistirte con tareas,
          explicaciones, programación y mucho más.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-card/80 transition-all text-left"
          >
            <span className="text-2xl">{suggestion.icon}</span>
            <div>
              <h3 className="font-medium mb-1">{suggestion.title}</h3>
              <p className="text-sm text-muted-foreground">
                {suggestion.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
