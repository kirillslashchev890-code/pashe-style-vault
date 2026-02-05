import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User, Package, Heart, LogOut, Settings, MapPin, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { z } from "zod";

type TabType = "profile" | "orders" | "wishlist" | "addresses" | "settings";

// Validation schemas
const emailSchema = z.string().trim().email({ message: "Введите корректный email" });
const passwordSchema = z.string().min(6, { message: "Пароль должен содержать минимум 6 символов" });
const nameSchema = z.string().trim().min(2, { message: "Имя должно содержать минимум 2 символа" });

const Account = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  
  // Error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Mock данные пользователя
  const user = {
    name: "Александр",
    email: "alex@example.com",
    phone: "+7 (999) 123-45-67",
  };

  const tabs = [
    { id: "profile" as TabType, label: "Профиль", icon: User },
    { id: "orders" as TabType, label: "Заказы", icon: Package },
    { id: "wishlist" as TabType, label: "Избранное", icon: Heart },
    { id: "addresses" as TabType, label: "Адреса", icon: MapPin },
    { id: "settings" as TabType, label: "Настройки", icon: Settings },
  ];

  const validateEmail = (value: string) => {
    const result = emailSchema.safeParse(value);
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value: string) => {
    const result = passwordSchema.safeParse(value);
    if (!result.success) {
      setPasswordError(result.error.errors[0].message);
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateName = (value: string) => {
    const result = nameSchema.safeParse(value);
    if (!result.success) {
      setNameError(result.error.errors[0].message);
      return false;
    }
    setNameError("");
    return true;
  };

  const validateConfirmPassword = (value: string) => {
    if (value !== password) {
      setConfirmPasswordError("Пароли не совпадают");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    let isValid = isEmailValid && isPasswordValid;

    if (!isLogin) {
      const isNameValid = validateName(name);
      const isConfirmValid = validateConfirmPassword(confirmPassword);
      isValid = isValid && isNameValid && isConfirmValid;
    }

    if (!isValid) return;

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // For demo purposes - in real app this would be an API call
      setIsLoggedIn(true);
    } catch (error) {
      setGeneralError("Произошла ошибка. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setNameError("");
    setGeneralError("");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {isLogin ? "Вход" : "Регистрация"}
              </h1>
              <p className="text-muted-foreground">
                {isLogin
                  ? "Войдите в свой аккаунт"
                  : "Создайте аккаунт для покупок"}
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              {generalError && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  <AlertCircle size={16} />
                  {generalError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <Label htmlFor="name">Имя</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Ваше имя"
                        className={`pl-10 ${nameError ? "border-destructive" : ""}`}
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (nameError) validateName(e.target.value);
                        }}
                        onBlur={() => name && validateName(name)}
                      />
                    </div>
                    {nameError && (
                      <p className="text-destructive text-sm mt-1">{nameError}</p>
                    )}
                  </div>
                )}
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className={`pl-10 ${emailError ? "border-destructive" : ""}`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) validateEmail(e.target.value);
                      }}
                      onBlur={() => email && validateEmail(email)}
                    />
                  </div>
                  {emailError && (
                    <p className="text-destructive text-sm mt-1">{emailError}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="password">Пароль</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 ${passwordError ? "border-destructive" : ""}`}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) validatePassword(e.target.value);
                      }}
                      onBlur={() => password && validatePassword(password)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-destructive text-sm mt-1">{passwordError}</p>
                  )}
                </div>
                
                {!isLogin && (
                  <div>
                    <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`pl-10 ${confirmPasswordError ? "border-destructive" : ""}`}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (confirmPasswordError) validateConfirmPassword(e.target.value);
                        }}
                        onBlur={() => confirmPassword && validateConfirmPassword(confirmPassword)}
                      />
                    </div>
                    {confirmPasswordError && (
                      <p className="text-destructive text-sm mt-1">{confirmPasswordError}</p>
                    )}
                  </div>
                )}

                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-primary text-sm hover:underline"
                    >
                      Забыли пароль?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full btn-gold py-5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Загрузка...
                    </span>
                  ) : (
                    isLogin ? "Войти" : "Зарегистрироваться"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
                  <button
                    onClick={toggleMode}
                    className="text-primary hover:underline"
                  >
                    {isLogin ? "Зарегистрируйтесь" : "Войдите"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-8"
        >
          Личный кабинет
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-3 p-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={18} />
                  Выйти
                </button>
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-card rounded-2xl border border-border p-6">
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Мои данные</h2>
                  <form className="space-y-4 max-w-md">
                    <div>
                      <Label htmlFor="profileName">Имя</Label>
                      <Input
                        id="profileName"
                        defaultValue={user.name}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profileEmail">Email</Label>
                      <Input
                        id="profileEmail"
                        type="email"
                        defaultValue={user.email}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profilePhone">Телефон</Label>
                      <Input
                        id="profilePhone"
                        defaultValue={user.phone}
                        className="mt-1"
                      />
                    </div>
                    <Button className="btn-gold">Сохранить изменения</Button>
                  </form>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Мои заказы</h2>
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">У вас пока нет заказов</p>
                    <Link to="/catalog">
                      <Button className="mt-4 btn-gold">Перейти в каталог</Button>
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Избранное</h2>
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Список избранного пуст</p>
                    <Link to="/catalog">
                      <Button className="mt-4 btn-gold">Перейти в каталог</Button>
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === "addresses" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Адреса доставки</h2>
                  <div className="text-center py-12">
                    <MapPin size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Нет сохранённых адресов</p>
                    <Button className="mt-4 btn-gold">Добавить адрес</Button>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Настройки</h2>
                  <div className="space-y-6 max-w-md">
                    <div>
                      <h3 className="font-medium mb-3">Уведомления</h3>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-border"
                          defaultChecked
                        />
                        <span className="text-sm">Email-уведомления о заказах</span>
                      </label>
                    </div>
                    <div>
                      <h3 className="font-medium mb-3">Изменить пароль</h3>
                      <div className="space-y-3">
                        <Input type="password" placeholder="Текущий пароль" />
                        <Input type="password" placeholder="Новый пароль" />
                        <Input type="password" placeholder="Подтвердите новый пароль" />
                        <Button className="btn-gold">Изменить пароль</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
