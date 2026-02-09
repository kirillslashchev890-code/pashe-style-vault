import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User, Package, Heart, LogOut, Settings, MapPin, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle, Trash2 } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { useOrders } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type TabType = "profile" | "orders" | "wishlist" | "addresses" | "settings";
type AuthMode = "login" | "register" | "forgot";

const emailSchema = z.string().trim().email({ message: "Введите корректный email" });
const passwordSchema = z.string().min(6, { message: "Пароль должен содержать минимум 6 символов" });
const nameSchema = z.string().trim().min(2, { message: "Имя должно содержать минимум 2 символа" });

const Account = () => {
  const { user, isLoading: authLoading, signIn, signUp, signOut, resetPassword } = useAuth();
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { orders, statusLabels } = useOrders();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  // Profile fields
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const tabs = [
    { id: "profile" as TabType, label: "Профиль", icon: User },
    { id: "orders" as TabType, label: "Заказы", icon: Package },
    { id: "wishlist" as TabType, label: "Избранное", icon: Heart },
    { id: "addresses" as TabType, label: "Адреса", icon: MapPin },
    { id: "settings" as TabType, label: "Настройки", icon: Settings },
  ];

  // Load profile data
  useEffect(() => {
    if (!user) return;
    setProfileName(user.user_metadata?.full_name || "");
    
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("phone, full_name")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setProfilePhone(data.phone || "");
        if (data.full_name) setProfileName(data.full_name);
      }
    };
    loadProfile();
  }, [user]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: profileName, phone: profilePhone })
      .eq("user_id", user.id);

    setProfileSaving(false);
    if (error) {
      toast.error("Ошибка при сохранении");
      return;
    }
    toast.success("Данные сохранены");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
    setGeneralError(""); setSuccessMessage("");
  };

  const switchAuthMode = (newMode: AuthMode) => { resetForm(); setAuthMode(newMode); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");

    if (authMode === "forgot") {
      if (!validateEmail(email)) return;
      setIsLoading(true);
      const { error } = await resetPassword(email);
      setIsLoading(false);
      if (error) { setGeneralError(error); return; }
      setSuccessMessage("Инструкции по восстановлению пароля отправлены на вашу почту");
      setTimeout(() => switchAuthMode("login"), 3000);
      return;
    }

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    let isValid = isEmailValid && isPasswordValid;

    if (authMode === "register") {
      const isNameValid = validateName(name);
      const isConfirmValid = validateConfirmPassword(confirmPassword);
      isValid = isValid && isNameValid && isConfirmValid;
    }
    if (!isValid) return;

    setIsLoading(true);

    if (authMode === "register") {
      const { error } = await signUp(email, password, name);
      setIsLoading(false);
      if (error) { setGeneralError(error); return; }
      setSuccessMessage("Регистрация успешна! Проверьте почту для подтверждения email.");
      return;
    }

    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) { setGeneralError(error); return; }
    resetForm();
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
            <div className="text-center mb-8">
              {authMode === "forgot" && (
                <button onClick={() => switchAuthMode("login")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mx-auto mb-4">
                  <ArrowLeft size={18} /> Назад
                </button>
              )}
              <h1 className="text-3xl font-bold mb-2">
                {authMode === "login" ? "Вход" : authMode === "register" ? "Регистрация" : "Восстановление пароля"}
              </h1>
              <p className="text-muted-foreground">
                {authMode === "login" ? "Войдите в свой аккаунт" : authMode === "register" ? "Создайте аккаунт для покупок" : "Введите email для восстановления пароля"}
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              {successMessage && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm">
                  <CheckCircle size={16} className="shrink-0" /> {successMessage}
                </div>
              )}
              {generalError && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  <AlertCircle size={16} className="shrink-0" /> {generalError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === "register" && (
                  <div>
                    <Label htmlFor="name">Имя</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                      <Input id="name" type="text" placeholder="Ваше имя" className={`pl-10 h-12 ${nameError ? "border-destructive" : ""}`}
                        value={name} onChange={(e) => { setName(e.target.value); if (nameError) validateName(e.target.value); }}
                        onBlur={() => name && validateName(name)} />
                    </div>
                    {nameError && <p className="text-destructive text-sm mt-1">{nameError}</p>}
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                    <Input id="email" type="email" placeholder="email@example.com" className={`pl-10 h-12 ${emailError ? "border-destructive" : ""}`}
                      value={email} onChange={(e) => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value); }}
                      onBlur={() => email && validateEmail(email)} />
                  </div>
                  {emailError && <p className="text-destructive text-sm mt-1">{emailError}</p>}
                </div>

                {authMode !== "forgot" && (
                  <div>
                    <Label htmlFor="password">Пароль</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                        className={`pl-10 pr-10 h-12 ${passwordError ? "border-destructive" : ""}`}
                        value={password} onChange={(e) => { setPassword(e.target.value); if (passwordError) validatePassword(e.target.value); }}
                        onBlur={() => password && validatePassword(password)} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordError && <p className="text-destructive text-sm mt-1">{passwordError}</p>}
                  </div>
                )}

                {authMode === "register" && (
                  <div>
                    <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                      <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••"
                        className={`pl-10 h-12 ${confirmPasswordError ? "border-destructive" : ""}`}
                        value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); if (confirmPasswordError) validateConfirmPassword(e.target.value); }}
                        onBlur={() => confirmPassword && validateConfirmPassword(confirmPassword)} />
                    </div>
                    {confirmPasswordError && <p className="text-destructive text-sm mt-1">{confirmPasswordError}</p>}
                  </div>
                )}

                {authMode === "login" && (
                  <div className="text-right">
                    <button type="button" onClick={() => switchAuthMode("forgot")} className="text-primary text-sm hover:underline">Забыли пароль?</button>
                  </div>
                )}

                <Button type="submit" className="w-full btn-gold h-12" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Загрузка...
                    </span>
                  ) : authMode === "forgot" ? "Отправить инструкции" : authMode === "login" ? "Войти" : "Зарегистрироваться"}
                </Button>
              </form>

              {authMode !== "forgot" && (
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    {authMode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
                    <button onClick={() => switchAuthMode(authMode === "login" ? "register" : "login")} className="text-primary hover:underline">
                      {authMode === "login" ? "Зарегистрируйтесь" : "Войдите"}
                    </button>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Logged in view
  const displayName = profileName || user.user_metadata?.full_name || user.email?.split("@")[0] || "Пользователь";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold mb-8">
          Личный кабинет
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-3 p-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{displayName}</p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                    }`}>
                    <tab.icon size={18} /> {tab.label}
                    {tab.id === "wishlist" && wishlistItems.length > 0 && (
                      <span className="ml-auto bg-primary/20 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                        {wishlistItems.length}
                      </span>
                    )}
                  </button>
                ))}
                <button onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut size={18} /> Выйти
                </button>
              </nav>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
            <div className="bg-card rounded-2xl border border-border p-6">
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Мои данные</h2>
                  <form onSubmit={saveProfile} className="space-y-4 max-w-md">
                    <div>
                      <Label htmlFor="profileName">Имя</Label>
                      <Input 
                        id="profileName" 
                        value={profileName} 
                        onChange={(e) => setProfileName(e.target.value)}
                        className="mt-1.5 h-12" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="profileEmail">Email</Label>
                      <Input id="profileEmail" type="email" defaultValue={user.email || ""} className="mt-1.5 h-12" disabled />
                    </div>
                    <div>
                      <Label htmlFor="profilePhone">Телефон</Label>
                      <Input 
                        id="profilePhone" 
                        className="mt-1.5 h-12" 
                        placeholder="+7 (___) ___-__-__"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="btn-gold" disabled={profileSaving}>
                      {profileSaving ? "Сохранение..." : "Сохранить изменения"}
                    </Button>
                  </form>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Мои заказы</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">У вас пока нет заказов</p>
                      <Link to="/catalog"><Button className="mt-4 btn-gold">Перейти в каталог</Button></Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-border rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-medium">Заказ от {formatDate(order.created_at)}</p>
                              <p className="text-muted-foreground text-sm">#{order.id.slice(0, 8)}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "delivered" ? "bg-green-500/10 text-green-500" :
                              order.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                              "bg-primary/10 text-primary"
                            }`}>
                              {statusLabels[order.status] || order.status}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.product_name} • {item.size}{item.color_name ? ` • ${item.color_name}` : ""} × {item.quantity}</span>
                                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-border mt-3 pt-3 flex justify-between font-semibold">
                            <span>Итого</span>
                            <span>{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Избранное</h2>
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Список избранного пуст</p>
                      <Link to="/catalog"><Button className="mt-4 btn-gold">Перейти в каталог</Button></Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 border border-border rounded-xl">
                          <Link to={`/product/${item.product_id}`} className="shrink-0">
                            <img src={item.product_image} alt={item.product_name} className="w-20 h-24 object-cover rounded-lg bg-secondary" />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${item.product_id}`}>
                              <h3 className="font-medium hover:text-primary transition-colors text-sm line-clamp-2">{item.product_name}</h3>
                            </Link>
                            <p className="font-semibold mt-1">{formatPrice(item.product_price)}</p>
                            {item.product_old_price && (
                              <p className="text-muted-foreground text-sm line-through">{formatPrice(item.product_old_price)}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromWishlist(item.product_id)}
                            className="text-muted-foreground hover:text-destructive transition-colors self-start"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                      <h3 className="font-medium mb-3">Сменить пароль</h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="currentPassword">Текущий пароль</Label>
                          <Input id="currentPassword" type="password" className="mt-1.5 h-12" />
                        </div>
                        <div>
                          <Label htmlFor="newPassword">Новый пароль</Label>
                          <Input id="newPassword" type="password" className="mt-1.5 h-12" />
                        </div>
                        <Button className="btn-gold">Сменить пароль</Button>
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
