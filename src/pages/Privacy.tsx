import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-semibold mb-3">{title}</h2>
    <div className="text-muted-foreground space-y-3 leading-relaxed">{children}</div>
  </section>
);

const Privacy = () => (
  <Layout>
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Политика конфиденциальности</h1>
        <p className="text-muted-foreground mb-12">Действует с 1 января 2025 года.</p>

        <Section title="1. Общие положения">
          <p>Настоящая Политика регулирует обработку персональных данных пользователей сайта PASHE в соответствии с ФЗ № 152-ФЗ «О персональных данных».</p>
        </Section>
        <Section title="2. Какие данные мы собираем">
          <p>Имя, e-mail, телефон, адрес доставки, история заказов и технические данные (IP-адрес, cookies, тип устройства).</p>
        </Section>
        <Section title="3. Цели обработки">
          <p>Оформление и доставка заказов, обратная связь, маркетинговые рассылки (по согласию), улучшение качества сервиса.</p>
        </Section>
        <Section title="4. Передача третьим лицам">
          <p>Мы не передаём данные третьим лицам, кроме случаев доставки заказа (курьерская служба) и обработки платежей (банк-эквайер).</p>
        </Section>
        <Section title="5. Хранение и защита">
          <p>Данные хранятся на защищённых серверах. Мы используем шифрование TLS и ограничиваем внутренний доступ.</p>
        </Section>
        <Section title="6. Ваши права">
          <p>Вы можете запросить, изменить или удалить свои данные, написав на info@pashe.ru.</p>
        </Section>
        <Section title="7. Cookies">
          <p>Сайт использует cookies для корректной работы и аналитики. Вы можете отключить их в настройках браузера.</p>
        </Section>
      </motion.div>
    </div>
  </Layout>
);

export default Privacy;
