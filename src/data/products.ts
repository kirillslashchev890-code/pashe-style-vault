// ============================================
// 📦 КАТАЛОГ ТОВАРОВ
// Здесь вы можете заменить данные товаров на свои
// ============================================

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  season?: string;
  brand: string;
  description: string;
  composition: string;
  care: string;
  country: string;
  images: string[]; // Массив изображений (минимум 3 фото с разных ракурсов)
  sizes: { name: string; available: boolean }[];
  colors: { name: string; hex: string }[]; // Цвета с HEX кодами
  isNew?: boolean;
  isSale?: boolean;
}

// ============================================
// 🖼️ ЗАМЕНИТЕ URL ИЗОБРАЖЕНИЙ НА СВОИ
// Рекомендуемый размер: 800x1000px
// Формат: [фронт, сбоку, сзади, деталь]
// ============================================

// Mock products data - 20+ per category
export const products: Product[] = [
  // ============================================
  // 👕 ФУТБОЛКИ (tshirts)
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `tshirt-${i + 1}`,
    name: `Футболка ${["базовая", "с принтом", "оверсайз", "slim fit", "premium"][i % 5]} ${i + 1}`,
    price: 1990 + (i % 5) * 500,
    originalPrice: i % 3 === 0 ? 2990 + (i % 5) * 500 : undefined,
    category: "tshirts",
    subcategory: ["basic-tshirts", "print-tshirts", "oversized-tshirts"][i % 3],
    season: ["summer", "spring", "autumn"][i % 3],
    brand: ["PASHE Original", "Premium Line", "Urban Style"][i % 3],
    description: "Качественная футболка из хлопка. Удобный крой, мягкая ткань. Подходит для повседневной носки.",
    composition: "100% хлопок",
    care: "Машинная стирка при 30°C",
    country: "Турция",
    // 🖼️ ЗАМЕНИТЕ ИЗОБРАЖЕНИЯ НИЖЕ НА СВОИ (3-4 фото с разных ракурсов)
    images: [
      `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop`, // Фронт
      `https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop`, // Сбоку
      `https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop`, // Сзади
    ],
    sizes: [
      { name: "XS", available: i % 4 !== 0 },
      { name: "S", available: true },
      { name: "M", available: true },
      { name: "L", available: i % 3 !== 0 },
      { name: "XL", available: i % 5 !== 0 },
      { name: "XXL", available: i % 2 === 0 },
    ],
    // 🎨 ЦВЕТА ТОВАРА (name - название, hex - код цвета)
    colors: [
      { name: "Белый", hex: "#FFFFFF" },
      { name: "Чёрный", hex: "#1A1A1A" },
      { name: "Серый", hex: "#6B7280" },
    ],
    isNew: i < 5,
    isSale: i % 3 === 0,
  })),

  // ============================================
  // 🧥 ВЕРХНЯЯ ОДЕЖДА (outerwear)
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `outerwear-${i + 1}`,
    name: `${["Куртка", "Пальто", "Пуховик", "Бомбер", "Парка"][i % 5]} ${i + 1}`,
    price: 12990 + (i % 5) * 2000,
    originalPrice: i % 4 === 0 ? 18990 + (i % 5) * 2000 : undefined,
    category: "outerwear",
    subcategory: ["jackets-winter", "coats", "down-jackets", "jackets-autumn", "jackets-summer"][i % 5],
    season: ["winter", "autumn", "winter", "autumn", "summer"][i % 5],
    brand: ["PASHE Original", "Premium Line", "Classic Edition"][i % 3],
    description: "Стильная верхняя одежда для любой погоды. Качественные материалы, продуманный крой.",
    composition: "Внешний материал: 100% полиэстер, Подкладка: 100% полиэстер, Утеплитель: 80% пух 20% перо",
    care: "Сухая чистка",
    country: "Италия",
    // 🖼️ ЗАМЕНИТЕ ИЗОБРАЖЕНИЯ НИЖЕ НА СВОИ
    images: [
      `https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1544923246-77307dd628b1?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=1000&fit=crop`,
    ],
    sizes: [
      { name: "S", available: i % 3 !== 0 },
      { name: "M", available: true },
      { name: "L", available: true },
      { name: "XL", available: i % 4 !== 0 },
      { name: "XXL", available: i % 2 === 0 },
    ],
    colors: [
      { name: "Чёрный", hex: "#1A1A1A" },
      { name: "Тёмно-синий", hex: "#1E3A5F" },
      { name: "Хаки", hex: "#5B5B3E" },
    ],
    isNew: i < 4,
    isSale: i % 4 === 0,
  })),

  // ============================================
  // 👔 РУБАШКИ (shirts)
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `shirt-${i + 1}`,
    name: `Рубашка ${["классическая", "casual", "льняная", "slim fit", "oxford"][i % 5]} ${i + 1}`,
    price: 3990 + (i % 5) * 500,
    originalPrice: i % 3 === 0 ? 5490 + (i % 5) * 500 : undefined,
    category: "shirts",
    subcategory: ["classic-shirts", "casual-shirts", "linen-shirts"][i % 3],
    season: ["spring", "summer", "autumn"][i % 3],
    brand: ["PASHE Original", "Classic Edition", "Premium Line"][i % 3],
    description: "Элегантная рубашка для офиса и повседневной носки. Качественная ткань, безупречный крой.",
    composition: i % 3 === 2 ? "100% лён" : "100% хлопок",
    care: "Машинная стирка при 40°C, гладить при средней температуре",
    country: "Португалия",
    // 🖼️ ЗАМЕНИТЕ ИЗОБРАЖЕНИЯ НИЖЕ НА СВОИ
    images: [
      `https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&h=1000&fit=crop`,
    ],
    sizes: [
      { name: "S", available: true },
      { name: "M", available: true },
      { name: "L", available: i % 2 === 0 },
      { name: "XL", available: i % 3 !== 0 },
      { name: "XXL", available: i % 4 === 0 },
    ],
    colors: [
      { name: "Белый", hex: "#FFFFFF" },
      { name: "Голубой", hex: "#87CEEB" },
      { name: "Розовый", hex: "#FFB6C1" },
    ],
    isNew: i < 3,
    isSale: i % 3 === 0,
  })),

  // ============================================
  // 👖 БРЮКИ (pants)
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `pants-${i + 1}`,
    name: `${["Брюки классические", "Чиносы", "Джоггеры", "Брюки cargo", "Брюки slim"][i % 5]} ${i + 1}`,
    price: 4990 + (i % 5) * 500,
    originalPrice: i % 4 === 0 ? 6990 + (i % 5) * 500 : undefined,
    category: "pants",
    subcategory: ["classic-pants", "chinos", "joggers"][i % 3],
    season: ["spring", "autumn", "winter"][i % 3],
    brand: ["PASHE Original", "Urban Style", "Classic Edition"][i % 3],
    description: "Удобные брюки на каждый день. Качественная ткань, современный крой.",
    composition: "98% хлопок, 2% эластан",
    care: "Машинная стирка при 30°C",
    country: "Турция",
    // 🖼️ ЗАМЕНИТЕ ИЗОБРАЖЕНИЯ НИЖЕ НА СВОИ
    images: [
      `https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=1000&fit=crop`,
    ],
    sizes: [
      { name: "28", available: i % 3 !== 0 },
      { name: "30", available: true },
      { name: "32", available: true },
      { name: "34", available: i % 2 === 0 },
      { name: "36", available: i % 4 !== 0 },
    ],
    colors: [
      { name: "Чёрный", hex: "#1A1A1A" },
      { name: "Бежевый", hex: "#C4A77D" },
      { name: "Хаки", hex: "#5B5B3E" },
    ],
    isNew: i < 4,
    isSale: i % 4 === 0,
  })),

  // ============================================
  // 👖 ДЖИНСЫ (jeans)
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `jeans-${i + 1}`,
    name: `Джинсы ${["slim fit", "straight", "relaxed", "skinny", "regular"][i % 5]} ${i + 1}`,
    price: 5990 + (i % 5) * 500,
    originalPrice: i % 3 === 0 ? 7990 + (i % 5) * 500 : undefined,
    category: "jeans",
    subcategory: ["slim-jeans", "straight-jeans", "relaxed-jeans"][i % 3],
    season: "all",
    brand: ["PASHE Original", "Urban Style", "Premium Line"][i % 3],
    description: "Классические джинсы из качественного денима. Удобная посадка, долговечность.",
    composition: "99% хлопок, 1% эластан",
    care: "Машинная стирка при 30°C, вывернуть наизнанку",
    country: "Турция",
    // 🖼️ ЗАМЕНИТЕ ИЗОБРАЖЕНИЯ НИЖЕ НА СВОИ
    images: [
      `https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&h=1000&fit=crop`,
    ],
    sizes: [
      { name: "28", available: i % 4 !== 0 },
      { name: "30", available: true },
      { name: "32", available: true },
      { name: "34", available: i % 3 === 0 },
      { name: "36", available: i % 2 === 0 },
    ],
    colors: [
      { name: "Синий", hex: "#4169E1" },
      { name: "Тёмно-синий", hex: "#191970" },
      { name: "Чёрный", hex: "#1A1A1A" },
      { name: "Белый", hex: "#FFFFFF" },
    ],
    isNew: i < 3,
    isSale: i % 3 === 0,
  })),

  // ============================================
  // 🩳 ШОРТЫ (shorts)
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `shorts-${i + 1}`,
    name: `Шорты ${["casual", "спортивные", "джинсовые", "cargo", "пляжные"][i % 5]} ${i + 1}`,
    price: 2490 + (i % 5) * 300,
    originalPrice: i % 4 === 0 ? 3490 + (i % 5) * 300 : undefined,
    category: "shorts",
    subcategory: ["casual-shorts", "sport-shorts", "denim-shorts"][i % 3],
    season: "summer",
    brand: ["PASHE Original", "Sport Collection", "Urban Style"][i % 3],
    description: "Удобные шорты для лета. Лёгкая ткань, комфортная посадка.",
    composition: "100% хлопок",
    care: "Машинная стирка при 30°C",
    country: "Турция",
    // 🖼️ ЗАМЕНИТЕ ИЗОБРАЖЕНИЯ НИЖЕ НА СВОИ
    images: [
      `https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=1000&fit=crop`,
    ],
    sizes: [
      { name: "S", available: true },
      { name: "M", available: true },
      { name: "L", available: i % 2 === 0 },
      { name: "XL", available: i % 3 !== 0 },
    ],
    colors: [
      { name: "Бежевый", hex: "#C4A77D" },
      { name: "Синий", hex: "#4169E1" },
      { name: "Хаки", hex: "#5B5B3E" },
    ],
    isNew: i < 5,
    isSale: i % 4 === 0,
  })),

  // ============================================
  // 🧥 СВИТШОТЫ (sweatshirts)
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `sweatshirt-${i + 1}`,
    name: `Свитшот ${["базовый", "с принтом", "оверсайз", "premium", "vintage"][i % 5]} ${i + 1}`,
    price: 3990 + (i % 5) * 500,
    originalPrice: i % 3 === 0 ? 5490 + (i % 5) * 500 : undefined,
    category: "sweatshirts",
    subcategory: ["basic-sweatshirts", "print-sweatshirts"][i % 2],
    season: ["autumn", "winter", "spring"][i % 3],
    brand: ["PASHE Original", "Urban Style", "Premium Line"][i % 3],
    description: "Мягкий свитшот из хлопкового трикотажа. Комфортный крой для повседневной носки.",
    composition: "80% хлопок, 20% полиэстер",
    care: "Машинная стирка при 30°C",
    country: "Португалия",
    // 🖼️ ЗАМЕНИТЕ ИЗОБРАЖЕНИЯ НИЖЕ НА СВОИ
    images: [
      `https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1614975059251-992f11792b9f?w=800&h=1000&fit=crop`,
    ],
    sizes: [
      { name: "S", available: i % 3 !== 0 },
      { name: "M", available: true },
      { name: "L", available: true },
      { name: "XL", available: i % 2 === 0 },
      { name: "XXL", available: i % 4 !== 0 },
    ],
    colors: [
      { name: "Чёрный", hex: "#1A1A1A" },
      { name: "Серый", hex: "#6B7280" },
      { name: "Бежевый", hex: "#C4A77D" },
    ],
    isNew: i < 4,
    isSale: i % 3 === 0,
  })),

  // ============================================
  // 👕 ПОЛО (polo)
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `polo-${i + 1}`,
    name: `Поло ${["классическое", "спортивное", "premium", "slim fit", "oversized"][i % 5]} ${i + 1}`,
    price: 2990 + (i % 5) * 400,
    originalPrice: i % 4 === 0 ? 4490 + (i % 5) * 400 : undefined,
    category: "polo",
    subcategory: ["classic-polo", "sport-polo"][i % 2],
    season: ["summer", "spring"][i % 2],
    brand: ["PASHE Original", "Sport Collection", "Classic Edition"][i % 3],
    description: "Элегантное поло из хлопка пике. Классический воротник, качественное исполнение.",
    composition: "100% хлопок пике",
    care: "Машинная стирка при 30°C",
    country: "Турция",
    // 🖼️ ЗАМЕНИТЕ ИЗОБРАЖЕНИЯ НИЖЕ НА СВОИ
    images: [
      `https://images.unsplash.com/photo-1625910513413-5fc41ef81b18?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&h=1000&fit=crop`,
    ],
    sizes: [
      { name: "S", available: true },
      { name: "M", available: true },
      { name: "L", available: i % 2 === 0 },
      { name: "XL", available: i % 3 !== 0 },
      { name: "XXL", available: i % 4 === 0 },
    ],
    colors: [
      { name: "Белый", hex: "#FFFFFF" },
      { name: "Тёмно-синий", hex: "#191970" },
      { name: "Бордовый", hex: "#800020" },
    ],
    isNew: i < 3,
    isSale: i % 4 === 0,
  })),

  // ============================================
  // 👟 ОБУВЬ (shoes)
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `shoes-${i + 1}`,
    name: `${["Кроссовки", "Ботинки", "Лоферы", "Кеды", "Мокасины"][i % 5]} ${i + 1}`,
    price: 7990 + (i % 5) * 1000,
    originalPrice: i % 3 === 0 ? 10990 + (i % 5) * 1000 : undefined,
    category: "shoes",
    subcategory: ["sneakers", "boots", "loafers", "sneakers", "loafers"][i % 5],
    season: ["all", "winter", "summer", "all", "summer"][i % 5],
    brand: ["PASHE Original", "Premium Line", "Urban Style"][i % 3],
    description: "Стильная обувь из качественных материалов. Удобная колодка, долговечность.",
    composition: "Верх: натуральная кожа, Подошва: резина",
    care: "Чистить влажной тканью, использовать крем для обуви",
    country: "Италия",
    // 🖼️ ЗАМЕНИТЕ ИЗОБРАЖЕНИЯ НИЖЕ НА СВОИ
    images: [
      `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop`,
    ],
    sizes: [
      { name: "40", available: i % 3 !== 0 },
      { name: "41", available: true },
      { name: "42", available: true },
      { name: "43", available: i % 2 === 0 },
      { name: "44", available: i % 4 !== 0 },
      { name: "45", available: i % 3 === 0 },
    ],
    colors: [
      { name: "Чёрный", hex: "#1A1A1A" },
      { name: "Белый", hex: "#FFFFFF" },
      { name: "Коричневый", hex: "#8B4513" },
    ],
    isNew: i < 4,
    isSale: i % 3 === 0,
  })),

  // ============================================
  // 🎒 АКСЕССУАРЫ (accessories)
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `accessory-${i + 1}`,
    name: `${["Ремень", "Сумка", "Кошелёк", "Шарф", "Очки"][i % 5]} ${i + 1}`,
    price: 1990 + (i % 5) * 500,
    originalPrice: i % 4 === 0 ? 2990 + (i % 5) * 500 : undefined,
    category: "accessories",
    subcategory: ["belts", "bags", "wallets", "scarves", "sunglasses"][i % 5],
    season: "all",
    brand: ["PASHE Original", "Premium Line", "Classic Edition"][i % 3],
    description: "Стильный аксессуар из качественных материалов. Дополнит любой образ.",
    composition: "Натуральная кожа",
    care: "Избегать попадания влаги",
    country: "Италия",
    // 🖼️ ЗАМЕНИТЕ ИЗОБРАЖЕНИЯ НИЖЕ НА СВОИ
    images: [
      `https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1606503825008-909a67e63c9d?w=800&h=1000&fit=crop`,
    ],
    sizes: [
      { name: "ONE SIZE", available: true },
    ],
    colors: [
      { name: "Чёрный", hex: "#1A1A1A" },
      { name: "Коричневый", hex: "#8B4513" },
      { name: "Тёмно-синий", hex: "#191970" },
    ],
    isNew: i < 5,
    isSale: i % 4 === 0,
  })),

  // ============================================
  // 🧢 КЕПКИ (caps)
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `cap-${i + 1}`,
    name: `${["Бейсболка", "Шапка", "Панама", "Кепка", "Берет"][i % 5]} ${i + 1}`,
    price: 1490 + (i % 5) * 300,
    originalPrice: i % 3 === 0 ? 1990 + (i % 5) * 300 : undefined,
    category: "caps",
    subcategory: ["baseball-caps", "beanies", "panama-hats"][i % 3],
    season: ["summer", "winter", "summer"][i % 3],
    brand: ["PASHE Original", "Urban Style", "Sport Collection"][i % 3],
    description: "Стильный головной убор для завершения образа.",
    composition: "100% хлопок",
    care: "Ручная стирка",
    country: "Турция",
    // 🖼️ ЗАМЕНИТЕ ИЗОБРАЖЕНИЯ НИЖЕ НА СВОИ
    images: [
      `https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&h=1000&fit=crop`,
    ],
    sizes: [
      { name: "S/M", available: true },
      { name: "L/XL", available: i % 2 === 0 },
    ],
    colors: [
      { name: "Чёрный", hex: "#1A1A1A" },
      { name: "Белый", hex: "#FFFFFF" },
      { name: "Бежевый", hex: "#C4A77D" },
    ],
    isNew: i < 4,
    isSale: i % 3 === 0,
  })),

  // ============================================
  // 🤵 КОСТЮМЫ (suits)
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `suit-${i + 1}`,
    name: `Костюм ${["деловой", "повседневный", "свадебный", "premium", "slim fit"][i % 5]} ${i + 1}`,
    price: 19990 + (i % 5) * 3000,
    originalPrice: i % 4 === 0 ? 29990 + (i % 5) * 3000 : undefined,
    category: "suits",
    subcategory: ["business-suits", "casual-suits", "wedding-suits"][i % 3],
    season: "all",
    brand: ["PASHE Original", "Premium Line", "Classic Edition"][i % 3],
    description: "Элегантный костюм из качественной ткани. Безупречный крой, современный силуэт.",
    composition: "70% шерсть, 30% полиэстер",
    care: "Сухая чистка",
    country: "Италия",
    // 🖼️ ЗАМЕНИТЕ ИЗОБРАЖЕНИЯ НИЖЕ НА СВОИ
    images: [
      `https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop`,
      `https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&h=1000&fit=crop`,
    ],
    sizes: [
      { name: "46", available: i % 3 !== 0 },
      { name: "48", available: true },
      { name: "50", available: true },
      { name: "52", available: i % 2 === 0 },
      { name: "54", available: i % 4 !== 0 },
    ],
    colors: [
      { name: "Чёрный", hex: "#1A1A1A" },
      { name: "Тёмно-синий", hex: "#191970" },
      { name: "Серый", hex: "#6B7280" },
    ],
    isNew: i < 3,
    isSale: i % 4 === 0,
  })),
];

// ============================================
// 🔍 ФУНКЦИИ ПОИСКА И ФИЛЬТРАЦИИ
// ============================================

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((p) => p.category === category || p.subcategory === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((p) => p.isNew).slice(0, 8);
};

export const getSaleProducts = (): Product[] => {
  return products.filter((p) => p.isSale);
};

// Функция поиска товаров
export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return [];
  
  return products.filter((p) => 
    p.name.toLowerCase().includes(searchTerm) ||
    p.brand.toLowerCase().includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm) ||
    p.colors.some(c => c.name.toLowerCase().includes(searchTerm))
  );
};
