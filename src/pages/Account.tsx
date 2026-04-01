import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User, Package, Heart, LogOut, Settings, Mail, Lock, Eye, EyeOff, AlertCircle, Trash2, Camera, Shield, RotateCcw } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { useOrders } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User, Package, Heart, LogOut, Settings, Mail, Lock, Eye, EyeOff, AlertCircle, Trash2, Camera, Shield } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { useOrders } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type TabType = "profile" | "orders" | "wishlist" | "settings";
type AuthMode = "login" | "register";

const emailSchema = z.string().trim().email({ message: "Введите корректный email (нужен символ @)" }).max(255, { message: "Email слишком длинный" });
const passwordSchema = z.string().min(6, { message: "Пароль должен содержать минимум 6 символов" }).max(72, { message: "Пароль слишком длинный" });
const nameSchema = z.string().trim().min(2, { message: "Имя должно содержать минимум 2 символа" }).max(60, { message: "Имя слишком длинное" });

const Account = () => {
  const { user, isLoading: authLoading, signIn, signUp, signOut, resetPassword } = useAuth();
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { orders, statusLabels } = useOrders();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileCity, setProfileCity] = useState("");
  const [profileStreet, setProfileStreet] = useState("");
  const [profileApartment, setProfileApartment] = useState("");
  const [profileZip, setProfileZip] = useState("");
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordChanging, setPasswordChanging] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const tabs = [
    { id: "profile" as TabType, label: "Профиль", icon: User },
    { id: "orders" as TabType, label: "Заказы", icon: Package },
    { id: "wishlist" as TabType, label: "Избранное", icon: Heart },
    { id: "settings" as TabType, label: "Настройки", icon: Settings },
  ];

  useEffect(() => {
    if (!user) return;
    setProfileName(user.user_metadata?.full_name || "");
    const loadProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
        setProfilePhone((data as any).phone || "");
        if ((data as any).full_name) setProfileName((data as any).full_name);
        setProfileCity((data as any).address_city || "");
        setProfileStreet((data as any).address_street || "");
        setProfileApartment((data as any).address_apartment || "");
        setProfileZip((data as any).address_zip || "");
        setProfileAvatar((data as any).avatar_url || null);
      }
    };
    loadProfile();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    const loadRole = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!data);
    };

    loadRole();
  }, [user]);

  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    setProfilePhone(digits);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { toast.error("Ошибка загрузки аватарки"); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = urlData.publicUrl + "?t=" + Date.now();
    await supabase.from("profiles").update({ avatar_url: avatarUrl } as any).eq("user_id", user.id);
    setProfileAvatar(avatarUrl);
    toast.success("Аватарка обновлена");
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (profilePhone && profilePhone.length !== 11) { toast.error("Номер телефона должен содержать 11 цифр"); return; }
    setProfileSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profileName, phone: profilePhone,
      address_city: profileCity, address_street: profileStreet,
      address_apartment: profileApartment, address_zip: profileZip,
    } as any).eq("user_id", user.id);
    setProfileSaving(false);
    if (error) { toast.error("Ошибка при сохранении"); return; }
    toast.success("Данные сохранены");
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) { toast.error("Пароль должен содержать минимум 6 символов"); return; }
    if (newPassword !== newPasswordConfirm) { toast.error("Пароли не совпадают"); return; }
    setPasswordChanging(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordChanging(false);
    if (error) { toast.error("Ошибка при смене пароля: " + error.message); return; }
    toast.success("Пароль успешно изменён");
    setNewPassword("");
    setNewPasswordConfirm("");
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0 }).format(price);
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  const validateEmail = (v: string) => { const r = emailSchema.safeParse(v); if (!r.success) { setEmailError(r.error.errors[0].message); return false; } setEmailError(""); return true; };
  const validatePassword = (v: string) => { const r = passwordSchema.safeParse(v); if (!r.success) { setPasswordError(r.error.errors[0].message); return false; } setPasswordError(""); return true; };
  const validateName = (v: string) => { const r = nameSchema.safeParse(v); if (!r.success) { setNameError(r.error.errors[0].message); return false; } setNameError(""); return true; };
  const validateConfirmPassword = (v: string) => { if (v !== password) { setConfirmPasswordError("Пароли не совпадают"); return false; } setConfirmPasswordError(""); return true; };

  const resetForm = () => { setEmail(""); setPassword(""); setConfirmPassword(""); setName(""); setEmailError(""); setPasswordError(""); setConfirmPasswordError(""); setNameError(""); setGeneralError(""); };
  const switchAuthMode = (m: AuthMode) => { resetForm(); setAuthMode(m); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    let isValid = isEmailValid && isPasswordValid;
    if (authMode === "register") {
      isValid = isValid && validateName(name) && validateConfirmPassword(confirmPassword);
    }
    if (!isValid) return;

    setIsLoading(true);
    if (authMode === "register") {
      const { error } = await signUp(email, password, name);
      setIsLoading(false);
      if (error) { setGeneralError(error); return; }
      resetForm();
      return;
    }
    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) { setGeneralError(error); return; }

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === "admin1@gmail.com") {
      const { data: currentUserData } = await supabase.auth.getUser();
      const signedInUser = currentUserData.user;
      if (signedInUser) {
        const { data: adminRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", signedInUser.id)
          .eq("role", "admin")
          .maybeSingle();

        if (adminRole) {
          navigate("/admin");
        }
      }
    }

    resetForm();
  };

  if (authLoading) {
    return <Layout><div className="container mx-auto px-4 py-16 md:py-24 text-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div></Layout>;
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {authMode === "login" ? "Вход" : "Регистрация"}
              </h1>
              <p className="text-muted-foreground">
                {authMode === "login" ? "Войдите в свой аккаунт" : "Создайте аккаунт для покупок"}
              </p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6">
              {generalError && <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm"><AlertCircle size={16} className="shrink-0" />{generalError}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === "register" && (
                  <div>
                    <Label htmlFor="name">Имя</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                      <Input id="name" type="text" placeholder="Ваше имя" className={`pl-10 h-12 ${nameError ? "border-destructive" : ""}`}
                        value={name} maxLength={60} onChange={(e) => { setName(e.target.value); if (nameError) validateName(e.target.value); }}
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
                      value={email} maxLength={255} onChange={(e) => { setEmail(e.target.value.trim()); if (emailError) validateEmail(e.target.value); }}
                      onBlur={() => email && validateEmail(email)} />
                  </div>
                  {emailError && <p className="text-destructive text-sm mt-1">{emailError}</p>}
                </div>
                <div>
                  <Label htmlFor="password">Пароль</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                      className={`pl-10 pr-10 h-12 ${passwordError ? "border-destructive" : ""}`}
                      value={password} maxLength={72} onChange={(e) => { setPassword(e.target.value); if (passwordError) validatePassword(e.target.value); }}
                      onBlur={() => password && validatePassword(password)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordError && <p className="text-destructive text-sm mt-1">{passwordError}</p>}
                </div>
                {authMode === "register" && (
                  <div>
                    <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                      <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••"
                        className={`pl-10 h-12 ${confirmPasswordError ? "border-destructive" : ""}`}
                        value={confirmPassword} maxLength={72} onChange={(e) => { setConfirmPassword(e.target.value); if (confirmPasswordError) validateConfirmPassword(e.target.value); }}
                        onBlur={() => confirmPassword && validateConfirmPassword(confirmPassword)} />
                    </div>
                    {confirmPasswordError && <p className="text-destructive text-sm mt-1">{confirmPasswordError}</p>}
                  </div>
                )}
                <Button type="submit" className="w-full btn-gold h-12" disabled={isLoading}>
                  {isLoading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />Загрузка...</span>
                    : authMode === "login" ? "Войти" : "Зарегистрироваться"}
                </Button>
              </form>
              <div className="mt-4 text-center space-y-2">
                {authMode === "login" && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!email) { setGeneralError("Введите email для восстановления"); return; }
                      const { error } = await resetPassword(email);
                      if (error) { setGeneralError(error); return; }
                      setGeneralError("");
                      toast.success("Ссылка для сброса пароля отправлена на почту");
                    }}
                    className="text-primary text-sm hover:underline"
                  >
                    Забыли пароль?
                  </button>
                )}
                <p className="text-muted-foreground text-sm">
                  {authMode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
                  <button onClick={() => switchAuthMode(authMode === "login" ? "register" : "login")} className="text-primary hover:underline">
                    {authMode === "login" ? "Зарегистрируйтесь" : "Войдите"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

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
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg overflow-hidden cursor-pointer relative"
                  onClick={() => avatarRef.current?.click()}>
                  {profileAvatar ? <img src={profileAvatar} alt="avatar" className="w-full h-full object-cover" /> : displayName.charAt(0).toUpperCase()}
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><Camera size={16} /></div>
                </div>
                <div>
                  <p className="font-medium">{displayName}</p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
                <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"}`}>
                    <tab.icon size={18} /> {tab.label}
                    {tab.id === "wishlist" && wishlistItems.length > 0 && (
                      <span className="ml-auto bg-primary/20 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">{wishlistItems.length}</span>
                    )}
                  </button>
                ))}
                {isAdmin && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Shield size={18} /> Админ-панель
                  </button>
                )}
                <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors">
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
                  <form onSubmit={saveProfile} className="space-y-4 max-w-lg">
                    <div><Label>Имя</Label><Input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="mt-1.5 h-12" /></div>
                    <div><Label>Email</Label><Input type="email" defaultValue={user.email || ""} className="mt-1.5 h-12" disabled /></div>
                    <div>
                      <Label>Телефон</Label>
                      <Input value={profilePhone} onChange={(e) => handlePhoneChange(e.target.value)} className="mt-1.5 h-12" placeholder="89627923580" maxLength={11} />
                      <p className="text-xs text-muted-foreground mt-1">11 цифр, начиная с 8</p>
                    </div>
                    <div className="border-t border-border pt-4 mt-4">
                      <h3 className="font-medium mb-3">Адрес доставки</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><Label>Город</Label><Input value={profileCity} onChange={(e) => setProfileCity(e.target.value)} className="mt-1.5 h-12" placeholder="Москва" /></div>
                        <div><Label>Индекс</Label><Input value={profileZip} onChange={(e) => setProfileZip(e.target.value.replace(/\D/g, "").slice(0, 6))} className="mt-1.5 h-12" placeholder="101000" /></div>
                        <div className="sm:col-span-2"><Label>Улица, дом</Label><Input value={profileStreet} onChange={(e) => setProfileStreet(e.target.value)} className="mt-1.5 h-12" placeholder="ул. Тверская, д. 1" /></div>
                        <div><Label>Квартира</Label><Input value={profileApartment} onChange={(e) => setProfileApartment(e.target.value)} className="mt-1.5 h-12" placeholder="кв. 10" /></div>
                      </div>
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
                              order.status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                            }`}>{statusLabels[order.status] || order.status}</span>
                          </div>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.product_name} • {item.size}{item.color_name ? ` • ${item.color_name}` : ""} × {item.quantity}</span>
                                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                          {order.shipping_address?.deliveryType === "delivery" && (
                            <div className="mt-3 text-xs text-muted-foreground space-y-1 border-t border-border pt-3">
                              <p>Куда едет: {[order.shipping_address.region, order.shipping_address.city, order.shipping_address.street].filter(Boolean).join(", ")}</p>
                              <p>Срок: {order.shipping_address.delivery_days || "—"}</p>
                              {order.shipping_address.eta_date && (
                                <p>Ожидаемая дата: {new Date(order.shipping_address.eta_date).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}</p>
                              )}
                            </div>
                          )}
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
                            {item.product_old_price && <p className="text-muted-foreground text-sm line-through">{formatPrice(item.product_old_price)}</p>}
                          </div>
                          <button onClick={() => removeFromWishlist(item.product_id)} className="text-muted-foreground hover:text-destructive transition-colors self-start">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                          <Label>Новый пароль</Label>
                          <Input type="password" className="mt-1.5 h-12" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Минимум 6 символов" />
                        </div>
                        <div>
                          <Label>Подтвердите новый пароль</Label>
                          <Input type="password" className="mt-1.5 h-12" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} placeholder="Повторите пароль" />
                        </div>
                        <Button className="btn-gold" onClick={handlePasswordChange} disabled={passwordChanging}>
                          {passwordChanging ? "Смена пароля..." : "Сменить пароль"}
                        </Button>
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
