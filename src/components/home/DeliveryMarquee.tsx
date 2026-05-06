const items = [
  "Бесплатная доставка от 10 000 ₽",
  "Доставка по Москве — от 1 дня",
  "Курьер по всей России — 2–7 дней",
  "Самовывоз бесплатно из шоурума",
  "Возврат в течение 14 дней",
  "Оплата картой, СБП или при получении",
];

const DeliveryMarquee = () => {
  const row = [...items, ...items];
  return (
    <div className="bg-card border-y border-border overflow-hidden py-3">
      <div className="flex whitespace-nowrap animate-marquee">
        {row.map((text, i) => (
          <span key={i} className="mx-8 text-sm text-foreground/80 inline-flex items-center gap-8">
            <span>{text}</span>
            <span className="text-primary">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default DeliveryMarquee;
