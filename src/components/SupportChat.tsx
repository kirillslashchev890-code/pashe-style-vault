import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "@/components/auth/AuthModal";

interface Message {
  id: string;
  role: "user" | "bot" | "admin";
  content: string;
  created_at: string;
}

const FAQ: Record<string, string> = {
  "доставка": "🚚 Доставка осуществляется по всей России. Стоимость от 500 до 2000₽ в зависимости от региона. Бесплатная доставка при заказе от 15 000₽. Срок доставки 2-7 дней.",
  "возврат": "↩️ Возврат товара возможен в течение 14 дней с момента получения. Товар должен быть в оригинальной упаковке, без следов носки. Для оформления возврата перейдите в «Личный кабинет → Заказы» и нажмите «Оформить возврат».",
  "оплата": "💳 Мы принимаем оплату онлайн (банковская карта), наличными или картой при получении курьеру, а также при самовывозе.",
  "размер": "📏 Таблица размеров доступна на странице каждого товара. Нажмите на «Таблица размеров» под выбором размера.",
  "самовывоз": "🏪 Самовывоз доступен по адресу: Москва, ул. Тверская, 1. Хранение заказа — 3 дня, после чего заказ автоматически отменяется.",
  "скидка": "🏷️ Скидка 10% на первый заказ применяется автоматически при оформлении. Бесплатная доставка при заказе от 15 000₽.",
  "статус": "📦 Статус заказа можно отслеживать в «Личном кабинете → Заказы». После подтверждения администратором заказ будет в статусе «В пути».",
  "контакт": "📧 Свяжитесь с нами: support@pashe.ru. Вы также можете написать в этот чат, и оператор ответит вам.",
  "обмен": "🔄 Обмен товара на другой размер/цвет возможен в течение 14 дней. Оформите возврат текущего товара и закажите новый.",
  "гарантия": "🛡️ Гарантия на все товары — 30 дней. Если товар оказался бракованным, мы заменим его бесплатно.",
  "время": "🕐 Время работы поддержки: пн-пт 9:00-18:00, сб 10:00-16:00. Воскресенье — выходной.",
  "акция": "🔥 Следите за акциями на главной странице. Подпишитесь на рассылку, чтобы не пропустить скидки.",
};

const HELP_TEXT = `📋 **ПОМОЩЬ — доступные команды:**

Напишите одно из ключевых слов, и я отвечу:
• **доставка** — информация о доставке и сроках
• **возврат** — как оформить возврат товара
• **оплата** — способы оплаты
• **размер** — таблица размеров
• **самовывоз** — условия самовывоза
• **скидка** — действующие скидки
• **статус** — отслеживание заказа
• **контакт** — связаться с нами
• **обмен** — обмен товара
• **гарантия** — гарантийные условия
• **время** — часы работы
• **акция** — текущие акции
• **оператор** — связаться с живым оператором

Если ваш вопрос не входит в список — просто напишите его, и мы передадим его оператору.`;

const findFaqAnswer = (text: string): string | null => {
  const lower = text.toLowerCase();
  if (lower === "помощь" || lower === "help" || lower === "/help" || lower === "команды") {
    return HELP_TEXT;
  }
  for (const [keyword, answer] of Object.entries(FAQ)) {
    if (lower.includes(keyword)) return answer;
  }
  return null;
};

const SupportChat = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const [loadedReplyIds, setLoadedReplyIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        id: "welcome",
        role: "bot",
        content: "👋 Здравствуйте! Я бот-помощник PASHE. Напишите «помощь» для списка доступных команд, или задайте вопрос напрямую.",
        created_at: new Date().toISOString(),
      }]);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Poll for admin replies - ONLY for this user's conversation
  const pollReplies = useCallback(async () => {
    if (!user || !open) return;
    const { data } = await supabase
      .from("support_messages")
      .select("id, admin_reply, created_at")
      .eq("user_id", user.id)
      .eq("conversation_id", conversationId)
      .not("admin_reply", "is", null)
      .order("created_at", { ascending: true });

    if (!data) return;

    setLoadedReplyIds(prev => {
      const newIds = new Set(prev);
      const newMessages: Message[] = [];
      data.forEach((msg: any) => {
        const replyId = `admin-${msg.id}`;
        if (!newIds.has(replyId)) {
          newIds.add(replyId);
          newMessages.push({
            id: replyId,
            role: "admin",
            content: `👨‍💼 Оператор: ${msg.admin_reply}`,
            created_at: msg.created_at,
          });
        }
      });
      if (newMessages.length > 0) {
        setMessages(p => [...p, ...newMessages]);
      }
      return newIds;
    });
  }, [user, open, conversationId]);

  useEffect(() => {
    if (!user || !open) return;
    const interval = setInterval(pollReplies, 5000);
    return () => clearInterval(interval);
  }, [user, open, pollReplies]);

  const send = async () => {
    if (!input.trim()) return;
    if (!user) { setAuthOpen(true); return; }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    const text = input.trim();
    setInput("");

    // Check for operator request
    if (text.toLowerCase().includes("оператор") || text.toLowerCase().includes("человек") || text.toLowerCase().includes("менеджер")) {
      await supabase.from("support_messages").insert({
        user_id: user.id,
        conversation_id: conversationId,
        role: "user",
        content: text,
        needs_admin: true,
      });
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: "bot",
        content: "📨 Ваш запрос передан оператору. Ожидайте ответа, мы свяжемся с вами в ближайшее время.",
        created_at: new Date().toISOString(),
      }]);
      return;
    }

    // Check FAQ
    const faqAnswer = findFaqAnswer(text);
    if (faqAnswer) {
      await supabase.from("support_messages").insert({
        user_id: user.id,
        conversation_id: conversationId,
        role: "user",
        content: text,
        needs_admin: false,
      });
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: "bot",
        content: faqAnswer,
        created_at: new Date().toISOString(),
      }]);
      return;
    }

    // No FAQ match — escalate to admin
    await supabase.from("support_messages").insert({
      user_id: user.id,
      conversation_id: conversationId,
      role: "user",
      content: text,
      needs_admin: true,
    });
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      role: "bot",
      content: "🤔 Я не смог найти ответ на ваш вопрос. Сообщение передано оператору — ожидайте ответа. Напишите «помощь» для списка доступных команд.",
      created_at: new Date().toISOString(),
    }]);
  };

  return (
    <>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-2xl">
            <span className="font-semibold">Поддержка PASHE</span>
            <button onClick={() => setOpen(false)}><X size={20} /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : msg.role === "admin"
                      ? "bg-accent text-accent-foreground border border-primary/30"
                      : "bg-secondary text-foreground"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Напишите «помощь» или вопрос..."
              className="flex-1 h-10 px-3 bg-background border border-border rounded-lg text-sm"
            />
            <Button size="icon" className="h-10 w-10 shrink-0" onClick={send}>
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportChat;
