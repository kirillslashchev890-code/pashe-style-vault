import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const emailSchema = z.string().trim().email({ message: "Введите корректный email" }).max(255, { message: "Email слишком длинный" });
const passwordSchema = z.string().min(6, { message: "Пароль должен содержать минимум 6 символов" }).max(72, { message: "Пароль слишком длинный" });
const nameSchema = z.string().trim().min(2, { message: "Имя должно содержать минимум 2 символа" }).max(60, { message: "Имя слишком длинное" });

type AuthMode = "login" | "register";

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const validateEmail = (value: string) => {
    const result = emailSchema.safeParse(value);
    if (!result.success) { setEmailError(result.error.errors[0].message); return false; }
    setEmailError(""); return true;
  };
  const validatePassword = (value: string) => {
    const result = passwordSchema.safeParse(value);
    if (!result.success) { setPasswordError(result.error.errors[0].message); return false; }
    setPasswordError(""); return true;
  };
  const validateName = (value: string) => {
    const result = nameSchema.safeParse(value);
    if (!result.success) { setNameError(result.error.errors[0].message); return false; }
    setNameError(""); return true;
  };
  const validateConfirmPassword = (value: string) => {
    if (value !== password) { setConfirmPasswordError("Пароли не совпадают"); return false; }
    setConfirmPasswordError(""); return true;
  };

  const resetForm = () => {
    setEmail(""); setPassword(""); setConfirmPassword(""); setName("");
    setEmailError(""); setPasswordError(""); setConfirmPasswordError(""); setNameError("");
    setGeneralError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    let isValid = isEmailValid && isPasswordValid;

    if (mode === "register") {
      const isNameValid = validateName(name);
      const isConfirmValid = validateConfirmPassword(confirmPassword);
      isValid = isValid && isNameValid && isConfirmValid;
    }
    if (!isValid) return;

    setIsLoading(true);

    if (mode === "register") {
      const { error } = await signUp(email, password, name);
      setIsLoading(false);
      if (error) { setGeneralError(error); return; }
      onSuccess?.();
      onClose();
      resetForm();
      return;
    }

    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) { setGeneralError(error); return; }
    onSuccess?.();
    onClose();
    resetForm();
  };

  const switchMode = (newMode: AuthMode) => { resetForm(); setMode(newMode); };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-2xl border border-border p-6 w-full max-w-md shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {mode === "login" ? "Вход в аккаунт" : "Регистрация"}
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={20} />
            </button>
          </div>

          {generalError && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <Label htmlFor="modal-name">Имя</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                  <Input id="modal-name" type="text" placeholder="Ваше имя" className={`pl-10 h-12 ${nameError ? "border-destructive" : ""}`}
                    value={name} maxLength={60} onChange={(e) => { setName(e.target.value); if (nameError) validateName(e.target.value); }}
                    onBlur={() => name && validateName(name)} />
                </div>
                {nameError && <p className="text-destructive text-sm mt-1">{nameError}</p>}
              </div>
            )}

            <div>
              <Label htmlFor="modal-email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                <Input id="modal-email" type="email" placeholder="email@example.com" className={`pl-10 h-12 ${emailError ? "border-destructive" : ""}`}
                  value={email} maxLength={255} onChange={(e) => { setEmail(e.target.value.trim()); if (emailError) validateEmail(e.target.value); }}
                  onBlur={() => email && validateEmail(email)} />
              </div>
              {emailError && <p className="text-destructive text-sm mt-1">{emailError}</p>}
            </div>

            <div>
              <Label htmlFor="modal-password">Пароль</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                <Input id="modal-password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                  className={`pl-10 pr-10 h-12 ${passwordError ? "border-destructive" : ""}`}
                  value={password} maxLength={72} onChange={(e) => { setPassword(e.target.value); if (passwordError) validatePassword(e.target.value); }}
                  onBlur={() => password && validatePassword(password)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && <p className="text-destructive text-sm mt-1">{passwordError}</p>}
            </div>

            {mode === "register" && (
              <div>
                <Label htmlFor="modal-confirm">Подтвердите пароль</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                  <Input id="modal-confirm" type={showPassword ? "text" : "password"} placeholder="••••••••"
                    className={`pl-10 h-12 ${confirmPasswordError ? "border-destructive" : ""}`}
                    value={confirmPassword} maxLength={72} onChange={(e) => { setConfirmPassword(e.target.value); if (confirmPasswordError) validateConfirmPassword(e.target.value); }}
                    onBlur={() => confirmPassword && validateConfirmPassword(confirmPassword)} />
                </div>
                {confirmPasswordError && <p className="text-destructive text-sm mt-1">{confirmPasswordError}</p>}
              </div>
            )}

            <Button type="submit" className="w-full btn-gold h-12" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Загрузка...
                </span>
              ) : mode === "login" ? "Войти" : "Зарегистрироваться"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
              <button onClick={() => switchMode(mode === "login" ? "register" : "login")} className="text-primary hover:underline">
                {mode === "login" ? "Зарегистрируйтесь" : "Войдите"}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
