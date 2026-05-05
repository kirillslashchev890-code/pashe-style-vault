import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-semibold mb-3">{title}</h2>
    <div className="text-muted-foreground space-y-3 leading-relaxed">{children}</div>
  </section>
);

const Terms = () => (
  <Layout>
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Условия использования</h1>
        <p className="text-muted-foreground mb-12">Пользуясь сайтом PASHE, вы соглашаетесь с настоящими условиями.</p>

        <Section title="1. Предмет соглашения">
          <p>Настоящие условия регулируют отношения между PASHE и пользователями сайта при заказе товаров.</p>
        </Section>
        <Section title="2. Регистрация и аккаунт">
          <p>Пользователь обязуется предоставлять достоверные данные и несёт ответственность за сохранность пароля.</p>
        </Section>
        <Section title="3. Заказ и оплата">
          <p>Заказ считается принятым после подтверждения оплаты или согласования с менеджером. Цены указаны в рублях и включают НДС.</p>
        </Section>
        <Section title="4. Доставка">
          <p>Подробные условия описаны в разделе «Доставка». Сроки могут изменяться по объективным причинам (погода, праздники).</p>
        </Section>
        <Section title="5. Возврат и обмен">
          <p>Возврат осуществляется в течение 14 дней согласно Закону «О защите прав потребителей».</p>
        </Section>
        <Section title="6. Интеллектуальная собственность">
          <p>Все материалы сайта (тексты, фото, логотипы) принадлежат PASHE. Копирование без согласия запрещено.</p>
        </Section>
        <Section title="7. Ограничение ответственности">
          <p>PASHE не несёт ответственности за временные сбои в работе сайта и действия третьих лиц (банк, курьер).</p>
        </Section>
        <Section title="8. Изменения">
          <p>Мы вправе изменять условия. Актуальная редакция всегда доступна на этой странице.</p>
        </Section>
      </motion.div>
    </div>
  </Layout>
);

export default Terms;
