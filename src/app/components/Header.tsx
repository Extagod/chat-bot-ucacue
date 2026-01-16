import { Moon, Sun, User } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header({ isDark, onToggleTheme }: HeaderProps) {
  const [selectedModel, setSelectedModel] = useState("GPT-4 Turbo");

  return (
    <header className="border-b border-border bg-card h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm text-muted-foreground">Conectado</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Model Selector */}
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="px-3 py-1.5 bg-secondary text-foreground rounded-lg border border-border outline-none hover:bg-secondary/80 transition-colors cursor-pointer"
        >
          <option value="GPT-4 Turbo">GPT-4 Turbo</option>
          <option value="GPT-3.5">GPT-3.5</option>
          <option value="Claude 3">Claude 3</option>
          <option value="Llama 2">Llama 2</option>
        </select>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-foreground" />
          ) : (
            <Moon className="h-5 w-5 text-foreground" />
          )}
        </button>

        {/* User Profile */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
          aria-label="User profile"
        >
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="hidden md:block text-sm">Estudiante</span>
        </button>
      </div>
    </header>
  );
}
