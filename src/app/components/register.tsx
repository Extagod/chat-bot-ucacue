import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Moon, Sun, User, CreditCard, ArrowLeft, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import logoUC from "../../assets/Logo-UC-2019.png";





interface RegisterProps {
  onRegister: (userData: {
    nombres: string;
    apellidos: string;
    cedula: string;
    email: string;
    password: string;
  }) => void;
  onBackToLogin: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Register({ onRegister, onBackToLogin, isDark, onToggleTheme }: RegisterProps) {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [cedula, setCedula] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    return email.endsWith("@est.ucacue.edu.ec");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validar que el correo sea institucional
    if (!validateEmail(email)) {
      setError("Solo estudiantes de la Universidad Católica de Cuenca pueden registrarse. Debe usar su correo institucional @est.ucacue.edu.ec");
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    // Validar cédula (10 dígitos para Ecuador)
    if (cedula.length !== 10 || !/^\d+$/.test(cedula)) {
      setError("La cédula debe contener 10 dígitos");
      return;
    }

    setIsLoading(true);

    // Simulate registration delay
    setTimeout(() => {
      onRegister({
        nombres,
        apellidos,
        cedula,
        email,
        password,
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-secondary p-4 relative">
      {/* Theme Toggle Button */}
      <button
        onClick={onToggleTheme}
        className="absolute top-6 right-6 p-3 rounded-lg bg-card border border-border hover:bg-secondary transition-colors shadow-lg"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-foreground" />
        ) : (
          <Moon className="h-5 w-5 text-foreground" />
        )}
      </button>

      {/* Back to Login Button */}
      <button
        onClick={onBackToLogin}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:bg-secondary transition-colors shadow-lg text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Volver al Login</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl flex-1 flex items-center"
      >
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center w-full">
          {/* Left Side - Logo and Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left md:pr-12"
          >
            <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
              <div className="h-28 w-28 rounded-3xl bg-white dark:bg-card flex items-center justify-center shadow-xl border border-border">
  <img
    src={logoUC}
    alt="UCACUE Logo"
    className="h-20 w-20 object-contain"
  />
</div>


              <div>
                <h1 className="text-4xl font-semibold mb-1">UCACUE AI</h1>
                <p className="text-lg text-muted-foreground">Academic Assistant</p>
              </div>
            </div>
            
            <div className="hidden md:block space-y-6 mt-12">
              <p className="text-lg text-foreground font-medium">
                Únete a la comunidad académica
              </p>
              <p className="text-muted-foreground">
                Registra tu cuenta con tu correo institucional y obtén acceso a:
              </p>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Asistente IA disponible 24/7
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Ayuda personalizada en tus materias
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Historial de conversaciones guardado
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Recursos académicos exclusivos
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right Side - Register Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg font-semibold mb-5 text-center">
              Crear Cuenta
            </h2>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-2.5 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2"
              >
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-xs text-destructive">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Nombres */}
              <div className="space-y-1.5">
                <label htmlFor="nombres" className="text-xs text-foreground">
                  Nombres
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="nombres"
                    type="text"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    placeholder="Ej: Juan Carlos"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Apellidos */}
              <div className="space-y-1.5">
                <label htmlFor="apellidos" className="text-xs text-foreground">
                  Apellidos
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="apellidos"
                    type="text"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    placeholder="Ej: Pérez García"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Cédula */}
              <div className="space-y-1.5">
                <label htmlFor="cedula" className="text-xs text-foreground">
                  Cédula de Identidad
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="cedula"
                    type="text"
                    value={cedula}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) {
                        setCedula(value);
                      }
                    }}
                    placeholder="1234567890"
                    required
                    maxLength={10}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Email Institucional */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs text-foreground">
                  Correo Institucional
                </label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="nombre.apellido@est.ucacue.edu.ec"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Debe usar su correo @est.ucacue.edu.ec
                </p>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    className="w-full pl-9 pr-10 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs text-foreground">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita su contraseña"
                    required
                    className="w-full pl-9 pr-10 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  required
                  className="w-3.5 h-3.5 mt-0.5 rounded border-border text-primary focus:ring-primary focus:ring-2"
                />
                <label className="text-[10px] text-muted-foreground leading-tight">
                  Acepto los términos y condiciones de uso del asistente académico UCACUE AI
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Creando cuenta...</span>
                  </div>
                ) : (
                  "Crear Cuenta"
                )}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-4 text-center text-xs">
              <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
              <button
                onClick={onBackToLogin}
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Inicia Sesión
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-auto pb-6 text-center text-sm text-muted-foreground"
      >
        <p>Universidad Católica de Cuenca</p>
        <p className="mt-1">© 2026 UCACUE - Todos los derechos reservados</p>
      </motion.div>
    </div>
  );
}