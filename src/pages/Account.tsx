import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User, Package, Heart, LogOut, Settings, MapPin, CreditCard } from "lucide-react";

type TabType = "profile" | "orders" | "wishlist" | "addresses" | "settings";

const Account = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isLogin, setIsLogin] = useState(true);

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
              <form className="space-y-4">
                {!isLogin && (
                  <div>
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ваше имя"
                      className="mt-1"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="mt-1"
                  />
                </div>
                {!isLogin && (
                  <div>
                    <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="mt-1"
                    />
                  </div>
                )}

                <Button
                  type="button"
                  className="w-full btn-gold py-5"
                  onClick={() => setIsLoggedIn(true)}
                >
                  {isLogin ? "Войти" : "Зарегистрироваться"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
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