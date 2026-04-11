// ============================================
// 📦 КАТАЛОГ ТОВАРОВ PASHE
// ============================================
// 📁 СТРУКТУРА ПАПОК ДЛЯ ИЗОБРАЖЕНИЙ:
//
// public/
//   images/
//     hero/
//       slide-1.jpg          ← Фото для карусели на главной (1920x1080)
//       slide-2.jpg
//       slide-3.jpg
//     categories/
//       tshirts.jpg          ← Фото категории (600x800)
//       outerwear.jpg
//       shirts.jpg
//       pants.jpg
//       jeans.jpg
//       shorts.jpg
//       sweatshirts.jpg
//       polo.jpg
//       shoes.jpg
//       accessories.jpg
//       caps.jpg
//       suits.jpg
//     products/
//       tshirts/
//         tshirt-1/
//           black/
//             front.jpg      ← Фото спереди (800x1000)
//             side.jpg       ← Фото сбоку
//             back.jpg       ← Фото сзади
//           white/
//             front.jpg
//             side.jpg
//             back.jpg
//           gray/
//             front.jpg
//             side.jpg
//             back.jpg
//         tshirt-2/
//           ...
//       jeans/
//         jeans-1/
//           blue/
//             front.jpg
//             side.jpg
//             back.jpg
//           ...
//   videos/
//     hero-video.mp4         ← Видео для второго блока
//     video-poster.jpg       ← Постер для видео (1920x1080)
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
  // 🎨 Изображения для каждого цвета: { "Чёрный": [front], ... }
  colorImages: Record<string, string[]>;
  // Изображения по умолчанию (первый цвет)
  images: string[];
  sizes: { name: string; available: boolean }[];
  colors: { name: string; hex: string }[];
  isNew?: boolean;
  isSale?: boolean;
}

// ============================================
// 🔧 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

// Генерация путей к фото товара (один ракурс на цвет)
// 📁 Формат: /images/products/{категория}/{id}/{цвет}/front.jpg
const pi = (cat: string, id: string, colorFolder: string): string[] => [
  `/images/products/${cat}/${id}/${colorFolder}/front.jpg`,
];

// Генерация colorImages из массива цветов
type CEntry = { name: string; hex: string; folder: string };
const ci = (cat: string, id: string, colors: CEntry[]): Record<string, string[]> =>
  Object.fromEntries(colors.map(c => [c.name, pi(cat, id, c.folder)]));

// ============================================
// 🎨 ЦВЕТОВЫЕ НАБОРЫ
// ============================================
const C = {
  black: { name: "Чёрный", hex: "#1A1A1A", folder: "black" } as CEntry,
  white: { name: "Белый", hex: "#FFFFFF", folder: "white" } as CEntry,
  gray: { name: "Серый", hex: "#6B7280", folder: "gray" } as CEntry,
  navy: { name: "Тёмно-синий", hex: "#1E3A5F", folder: "navy" } as CEntry,
  khaki: { name: "Хаки", hex: "#5B5B3E", folder: "khaki" } as CEntry,
  beige: { name: "Бежевый", hex: "#C4A77D", folder: "beige" } as CEntry,
  blue: { name: "Синий", hex: "#4169E1", folder: "blue" } as CEntry,
  lightBlue: { name: "Голубой", hex: "#87CEEB", folder: "light-blue" } as CEntry,
  brown: { name: "Коричневый", hex: "#8B4513", folder: "brown" } as CEntry,
  burgundy: { name: "Бордовый", hex: "#800020", folder: "burgundy" } as CEntry,
  red: { name: "Красный", hex: "#CC2936", folder: "red" } as CEntry,
  olive: { name: "Оливковый", hex: "#556B2F", folder: "olive" } as CEntry,
  terracotta: { name: "Терракотовый", hex: "#C4622D", folder: "terracotta" } as CEntry,
  sage: { name: "Шалфей", hex: "#9CAF88", folder: "sage" } as CEntry,
  charcoal: { name: "Антрацит", hex: "#36454F", folder: "charcoal" } as CEntry,
  cream: { name: "Кремовый", hex: "#FFFDD0", folder: "cream" } as CEntry,
  camel: { name: "Кэмел", hex: "#C19A6B", folder: "camel" } as CEntry,
  wine: { name: "Винный", hex: "#722F37", folder: "wine" } as CEntry,
};

// Наборы цветов для категорий — РАЗНООБРАЗНЫЕ
const COLOR_SETS = {
  tshirts: [C.white, C.navy, C.terracotta],
  outerwear: [C.navy, C.red, C.camel],
  shirts: [C.white, C.lightBlue, C.sage],
  pants: [C.charcoal, C.beige, C.olive],
  jeans: [C.blue, C.black, C.lightBlue],
  shorts: [C.beige, C.navy, C.olive],
  sweatshirts: [C.charcoal, C.cream, C.burgundy],
  polo: [C.white, C.navy, C.terracotta],
  shoes: [C.black, C.white, C.brown],
  accessories: [C.black, C.brown, C.navy],
  caps: [C.black, C.cream, C.navy],
  suits: [C.charcoal, C.navy, C.camel],
};

const toColors = (entries: CEntry[]) => entries.map(({ name, hex }) => ({ name, hex }));

// ============================================
// 👕 НАЗВАНИЯ ТОВАРОВ
// ============================================

const NAMES = {
  tshirts: [
    "Футболка Essential Crew", "Футболка Urban Oversized", "Футболка Midnight Graphic",
    "Футболка Street Logo", "Футболка Classic V-Neck", "Футболка Sport Active",
    "Футболка Premium Pima", "Футболка Vintage Wash", "Футболка Henley Ribbed",
    "Футболка Relaxed Basic", "Футболка Nautical Stripe", "Футболка Color Block",
    "Футболка Raw Edge", "Футболка Longline Base", "Футболка Pocket Crew",
    "Футболка Acid Wash", "Футболка Embroidered Logo", "Футболка Slim Ribbed",
    "Футболка French Terry", "Футболка Heavyweight Classic",
  ],
  outerwear: [
    "Пуховик Alpine Down", "Бомбер Urban Classic", "Тренч Classic London",
    "Ветровка Tech Shield", "Пальто Wool Overcoat", "Жилет Quilted Comfort",
    "Куртка Leather Biker", "Парка Explorer Pro", "Куртка Sherpa Lined",
    "Куртка Field Military", "Бомбер Varsity Sport", "Куртка Rain Shell",
    "Пуховик Cropped Puffer", "Куртка Denim Trucker", "Куртка Cargo Utility",
    "Блейзер Casual Cotton", "Куртка Nylon Track", "Куртка Suede Aviator",
    "Бушлат Peacoat Navy", "Куртка Softshell Sport",
  ],
  shirts: [
    "Рубашка Oxford Classic", "Рубашка Linen Breeze", "Рубашка Denim Western",
    "Рубашка Poplin Fitted", "Рубашка Flannel Check", "Рубашка Chambray Casual",
    "Рубашка Mandarin Collar", "Рубашка Button-Down Stripe", "Рубашка Twill Cargo",
    "Рубашка Slim Fit White", "Рубашка Hawaiian Print", "Рубашка Corduroy Vintage",
    "Рубашка Brushed Cotton", "Рубашка Micro Check", "Рубашка Band Collar",
    "Рубашка Camp Collar", "Рубашка Stretch Comfort", "Рубашка Herringbone",
    "Рубашка Dobby Texture", "Рубашка French Cuff",
  ],
  pants: [
    "Брюки Classic Chinos", "Брюки Slim Tailored", "Брюки Cargo Utility",
    "Джоггеры Premium Fit", "Брюки Pleated Wide", "Брюки Tech Stretch",
    "Брюки Linen Summer", "Брюки Corduroy Vintage", "Брюки Wool Blend",
    "Брюки Drawstring Relaxed", "Брюки Cropped Ankle", "Брюки Track Sport",
    "Брюки Paper Bag Waist", "Брюки Military Cargo", "Брюки Twill Regular",
    "Брюки Slim Straight", "Брюки Elastic Waist", "Брюки Jersey Comfort",
    "Брюки Patch Pocket", "Брюки Tapered Modern",
  ],
  jeans: [
    "Джинсы Slim Dark Indigo", "Джинсы Straight Classic", "Джинсы Relaxed Vintage",
    "Джинсы Skinny Black", "Джинсы Regular Comfort", "Джинсы Bootcut Western",
    "Джинсы Tapered Modern", "Джинсы Wide Leg", "Джинсы Cropped Ankle",
    "Джинсы Destroyed Wash", "Джинсы Raw Denim", "Джинсы Stretch Flex",
    "Джинсы Carpenter Work", "Джинсы Baggy Street", "Джинсы High Rise",
    "Джинсы Button Fly", "Джинсы Selvedge Premium", "Джинсы Acid Washed",
    "Джинсы Patchwork", "Джинсы Ultra Slim",
  ],
  shorts: [
    "Шорты Casual Chino", "Шорты Sport Active", "Шорты Denim Classic",
    "Шорты Cargo Utility", "Шорты Board Beach", "Шорты Swim Trunk",
    "Шорты Linen Breeze", "Шорты Fleece Comfort", "Шорты Running Pro",
    "Шорты Tailored Smart", "Шорты Drawstring Easy", "Шорты Bermuda Long",
    "Шорты Tech Stretch", "Шорты Plaid Check", "Шорты Camo Print",
    "Шорты Sweat Casual", "Шорты Nylon Quick-Dry", "Шорты Oxford Preppy",
    "Шорты Twill Heavy", "Шорты Jersey Knit",
  ],
  sweatshirts: [
    "Свитшот Classic Crew", "Свитшот Graphic Print", "Свитшот Oversized Drop",
    "Свитшот Premium Fleece", "Свитшот Vintage Washed", "Свитшот Zip-Up Mock",
    "Свитшот Color Block", "Свитшот Acid Wash", "Свитшот Embroidered Logo",
    "Свитшот French Terry", "Свитшот Tie-Dye", "Свитшот Kangaroo Pocket",
    "Свитшот Distressed Edge", "Свитшот Striped Retro", "Свитшот Quarter Zip",
    "Свитшот Raglan Sleeve", "Свитшот Heavy Fleece", "Свитшот Minimal Logo",
    "Свитшот Cropped Fit", "Свитшот Athletic Ribbed",
  ],
  polo: [
    "Поло Classic Pique", "Поло Sport Performance", "Поло Slim Fit Essential",
    "Поло Contrast Collar", "Поло Long Sleeve", "Поло Stretch Cotton",
    "Поло Mercerized Premium", "Поло Knitted Textured", "Поло Oxford Collar",
    "Поло Tipped Detail", "Поло Jersey Soft", "Поло Button-Down",
    "Поло Moisture-Wicking", "Поло Block Stripe", "Поло Zip Neck",
    "Поло French Terry", "Поло Pima Cotton", "Поло Rugby Stripe",
    "Поло Luxury Blend", "Поло Tech Dry",
  ],
  shoes: [
    "Кроссовки Classic Runner", "Ботинки Chelsea Suede", "Лоферы Penny Classic",
    "Кроссовки Sport Elite", "Ботинки Desert Sand", "Кеды Canvas Low-Top",
    "Дерби Leather Oxford", "Ботинки Hiking Trail", "Слипоны Casual Knit",
    "Кеды High-Top Urban", "Броги Oxford Wing", "Мокасины Suede Driver",
    "Кроссовки Chunky Platform", "Кроссовки Minimalist White", "Ботинки Combat Heavy",
    "Эспадрильи Summer Linen", "Монки Double Strap", "Кроссовки Athletic Cross",
    "Мокасины Driving Leather", "Ботинки Winter Insulated",
  ],
  accessories: [
    "Ремень Leather Classic", "Сумка Crossbody Urban", "Кошелёк Bifold Premium",
    "Шарф Cashmere Soft", "Очки Aviator Gold", "Сумка Canvas Tote",
    "Картхолдер Slim Leather", "Шарф Wool Winter", "Очки Wayfarer Dark",
    "Сумка Messenger Business", "Зажим для денег Silver", "Галстук Silk Classic",
    "Рюкзак Urban Daily", "Портмоне Travel Premium", "Очки Round Retro",
    "Сумка Laptop Professional", "Ремень Braided Leather", "Платок Pocket Square",
    "Сумка Weekender Travel", "Запонки Classic Set",
  ],
  caps: [
    "Бейсболка Classic Logo", "Шапка Wool Beanie", "Панама Summer Breeze",
    "Снепбек Urban Street", "Панама Bucket Classic", "Кепка Flat Vintage",
    "Бейсболка Trucker Mesh", "Козырёк Sport Visor", "Кепка Docker Sailor",
    "Кепка Newsboy Tweed", "Шапка Trapper Winter", "Кепка Camp Five-Panel",
    "Шляпа Fedora Felt", "Кепка Sun Protect UV", "Шапка Watch Knit",
    "Кепка Five Panel Nylon", "Бейсболка Dad Hat", "Кепка Athletic Dry",
    "Шляпа Straw Summer", "Шапка Ear Flap Winter",
  ],
  suits: [
    "Костюм Classic Business", "Костюм Slim Modern", "Костюм Double-Breasted",
    "Костюм Linen Summer", "Костюм Wedding Formal", "Костюм Pinstripe Executive",
    "Костюм Casual Unstructured", "Костюм Three-Piece", "Смокинг Evening Black",
    "Костюм Wool Flannel", "Костюм Check Pattern", "Костюм Stretch Comfort",
    "Костюм Italian Fit", "Костюм Peak Lapel", "Костюм Notch Lapel",
    "Костюм Windowpane", "Костюм Velvet Evening", "Костюм Cotton Summer",
    "Костюм Houndstooth", "Костюм Travel Wrinkle-Free",
  ],
};

// ============================================
// 📦 ГЕНЕРАЦИЯ ТОВАРОВ
// ============================================

export const products: Product[] = [
  // ============================================
  // 👕 ФУТБОЛКИ (tshirts) — 20 товаров
  // 🖼️ Фото: public/images/products/tshirts/tshirt-{N}/{color}/front|side|back.jpg
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => {
    const id = `tshirt-${i + 1}`;
    const colors = COLOR_SETS.tshirts;
    return {
      id,
      name: NAMES.tshirts[i],
      price: [1990, 2490, 2990, 3490, 3990, 2190, 4490, 2790, 3190, 1790, 2690, 3290, 2390, 1990, 2590, 3690, 4190, 2890, 3390, 4990][i],
      originalPrice: i % 3 === 0 ? [1990, 2490, 2990, 3490, 3990, 2190, 4490, 2790, 3190, 1790, 2690, 3290, 2390, 1990, 2590, 3690, 4190, 2890, 3390, 4990][i] + 1000 : undefined,
      category: "tshirts",
      subcategory: ["basic-tshirts", "print-tshirts", "oversized-tshirts"][i % 3],
      season: ["summer", "spring", "autumn"][i % 3] as string,
      brand: ["PASHE Original", "Premium Line", "Urban Style"][i % 3],
      description: "Качественная футболка из мягкого хлопка. Комфортный крой для повседневной носки.",
      composition: "100% хлопок",
      care: "Машинная стирка при 30°C",
      country: "Турция",
      colorImages: ci("tshirts", id, colors),
      images: pi("tshirts", id, colors[0].folder),
      sizes: [
        { name: "XS", available: i % 4 !== 0 },
        { name: "S", available: true },
        { name: "M", available: true },
        { name: "L", available: i % 3 !== 0 },
        { name: "XL", available: i % 5 !== 0 },
        { name: "XXL", available: i % 2 === 0 },
      ],
      colors: toColors(colors),
      isNew: i < 5,
      isSale: i % 3 === 0,
    } as Product;
  }),

  // ============================================
  // 🧥 ВЕРХНЯЯ ОДЕЖДА (outerwear) — 20 товаров
  // 🖼️ Фото: public/images/products/outerwear/outerwear-{N}/{color}/front|side|back.jpg
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => {
    const id = `outerwear-${i + 1}`;
    const colors = COLOR_SETS.outerwear;
    return {
      id,
      name: NAMES.outerwear[i],
      price: [12990, 9990, 15990, 7990, 19990, 6990, 24990, 14990, 11990, 8990, 10990, 5990, 13990, 8490, 9490, 11490, 7490, 21990, 16990, 6490][i],
      originalPrice: i % 4 === 0 ? [12990, 9990, 15990, 7990, 19990, 6990, 24990, 14990, 11990, 8990, 10990, 5990, 13990, 8490, 9490, 11490, 7490, 21990, 16990, 6490][i] + 5000 : undefined,
      category: "outerwear",
      subcategory: ["jackets-winter", "jackets-autumn", "jackets-summer", "coats", "down-jackets"][i % 5],
      season: ["winter", "autumn", "summer", "autumn", "winter"][i % 5] as string,
      brand: ["PASHE Original", "Premium Line", "Classic Edition"][i % 3],
      description: "Стильная верхняя одежда для любой погоды. Качественные материалы, продуманный крой.",
      composition: "Внешний материал: 100% полиэстер, Подкладка: 100% полиэстер",
      care: "Сухая чистка",
      country: "Италия",
      colorImages: ci("outerwear", id, colors),
      images: pi("outerwear", id, colors[0].folder),
      sizes: [
        { name: "S", available: i % 3 !== 0 },
        { name: "M", available: true },
        { name: "L", available: true },
        { name: "XL", available: i % 4 !== 0 },
        { name: "XXL", available: i % 2 === 0 },
      ],
      colors: toColors(colors),
      isNew: i < 4,
      isSale: i % 4 === 0,
    } as Product;
  }),

  // ============================================
  // 👔 РУБАШКИ (shirts) — 20 товаров
  // 🖼️ Фото: public/images/products/shirts/shirt-{N}/{color}/front|side|back.jpg
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => {
    const id = `shirt-${i + 1}`;
    const colors = COLOR_SETS.shirts;
    return {
      id,
      name: NAMES.shirts[i],
      price: [3990, 4490, 4990, 3690, 5490, 4190, 3490, 5990, 4290, 3890, 5190, 4690, 3590, 4390, 3790, 5790, 4090, 6490, 4890, 5290][i],
      originalPrice: i % 3 === 0 ? [3990, 4490, 4990, 3690, 5490, 4190, 3490, 5990, 4290, 3890, 5190, 4690, 3590, 4390, 3790, 5790, 4090, 6490, 4890, 5290][i] + 1500 : undefined,
      category: "shirts",
      subcategory: ["classic-shirts", "casual-shirts", "linen-shirts"][i % 3],
      season: ["spring", "summer", "autumn"][i % 3] as string,
      brand: ["PASHE Original", "Classic Edition", "Premium Line"][i % 3],
      description: "Элегантная рубашка для офиса и повседневной носки. Качественная ткань, безупречный крой.",
      composition: i % 3 === 2 ? "100% лён" : "100% хлопок",
      care: "Машинная стирка при 40°C, гладить при средней температуре",
      country: "Португалия",
      colorImages: ci("shirts", id, colors),
      images: pi("shirts", id, colors[0].folder),
      sizes: [
        { name: "S", available: true },
        { name: "M", available: true },
        { name: "L", available: i % 2 === 0 },
        { name: "XL", available: i % 3 !== 0 },
        { name: "XXL", available: i % 4 === 0 },
      ],
      colors: toColors(colors),
      isNew: i < 3,
      isSale: i % 3 === 0,
    } as Product;
  }),

  // ============================================
  // 👖 БРЮКИ (pants) — 20 товаров
  // 🖼️ Фото: public/images/products/pants/pants-{N}/{color}/front|side|back.jpg
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => {
    const id = `pants-${i + 1}`;
    const colors = COLOR_SETS.pants;
    return {
      id,
      name: NAMES.pants[i],
      price: [4990, 5490, 5990, 4690, 6490, 4190, 3990, 7490, 8990, 4290, 5190, 3690, 6190, 5790, 4590, 5390, 3890, 4790, 6790, 5090][i],
      originalPrice: i % 4 === 0 ? [4990, 5490, 5990, 4690, 6490, 4190, 3990, 7490, 8990, 4290, 5190, 3690, 6190, 5790, 4590, 5390, 3890, 4790, 6790, 5090][i] + 2000 : undefined,
      category: "pants",
      subcategory: ["classic-pants", "chinos", "joggers"][i % 3],
      season: ["spring", "autumn", "winter"][i % 3] as string,
      brand: ["PASHE Original", "Urban Style", "Classic Edition"][i % 3],
      description: "Удобные брюки на каждый день. Качественная ткань, современный крой.",
      composition: "98% хлопок, 2% эластан",
      care: "Машинная стирка при 30°C",
      country: "Турция",
      colorImages: ci("pants", id, colors),
      images: pi("pants", id, colors[0].folder),
      sizes: [
        { name: "28", available: i % 3 !== 0 },
        { name: "30", available: true },
        { name: "32", available: true },
        { name: "34", available: i % 2 === 0 },
        { name: "36", available: i % 4 !== 0 },
      ],
      colors: toColors(colors),
      isNew: i < 4,
      isSale: i % 4 === 0,
    } as Product;
  }),

  // ============================================
  // 👖 ДЖИНСЫ (jeans) — 20 товаров
  // 🖼️ Фото: public/images/products/jeans/jeans-{N}/{color}/front|side|back.jpg
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => {
    const id = `jeans-${i + 1}`;
    const colors = COLOR_SETS.jeans;
    return {
      id,
      name: NAMES.jeans[i],
      price: [5990, 6490, 7490, 5490, 6990, 8490, 7990, 9990, 5790, 6290, 11990, 6790, 5190, 7290, 8990, 6190, 14990, 7790, 8490, 5390][i],
      originalPrice: i % 3 === 0 ? [5990, 6490, 7490, 5490, 6990, 8490, 7990, 9990, 5790, 6290, 11990, 6790, 5190, 7290, 8990, 6190, 14990, 7790, 8490, 5390][i] + 2000 : undefined,
      category: "jeans",
      subcategory: ["slim-jeans", "straight-jeans", "relaxed-jeans"][i % 3],
      season: "all" as string,
      brand: ["PASHE Original", "Urban Style", "Premium Line"][i % 3],
      description: "Классические джинсы из качественного денима. Удобная посадка, долговечность.",
      composition: "99% хлопок, 1% эластан",
      care: "Машинная стирка при 30°C, вывернуть наизнанку",
      country: "Турция",
      colorImages: ci("jeans", id, colors),
      images: pi("jeans", id, colors[0].folder),
      sizes: [
        { name: "28", available: i % 4 !== 0 },
        { name: "30", available: true },
        { name: "32", available: true },
        { name: "34", available: i % 3 === 0 },
        { name: "36", available: i % 2 === 0 },
      ],
      colors: toColors(colors),
      isNew: i < 3,
      isSale: i % 3 === 0,
    } as Product;
  }),

  // ============================================
  // 🩳 ШОРТЫ (shorts) — 20 товаров
  // 🖼️ Фото: public/images/products/shorts/shorts-{N}/{color}/front|side|back.jpg
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => {
    const id = `shorts-${i + 1}`;
    const colors = COLOR_SETS.shorts;
    return {
      id,
      name: NAMES.shorts[i],
      price: [2490, 2990, 3490, 3990, 2790, 2190, 3290, 1990, 3790, 4490, 2390, 3190, 2690, 2890, 3090, 1890, 2590, 3390, 3690, 2090][i],
      originalPrice: i % 4 === 0 ? [2490, 2990, 3490, 3990, 2790, 2190, 3290, 1990, 3790, 4490, 2390, 3190, 2690, 2890, 3090, 1890, 2590, 3390, 3690, 2090][i] + 1000 : undefined,
      category: "shorts",
      subcategory: ["casual-shorts", "sport-shorts", "denim-shorts"][i % 3],
      season: "summer" as string,
      brand: ["PASHE Original", "Sport Collection", "Urban Style"][i % 3],
      description: "Удобные шорты для лета. Лёгкая ткань, комфортная посадка.",
      composition: "100% хлопок",
      care: "Машинная стирка при 30°C",
      country: "Турция",
      colorImages: ci("shorts", id, colors),
      images: pi("shorts", id, colors[0].folder),
      sizes: [
        { name: "S", available: true },
        { name: "M", available: true },
        { name: "L", available: i % 2 === 0 },
        { name: "XL", available: i % 3 !== 0 },
      ],
      colors: toColors(colors),
      isNew: i < 5,
      isSale: i % 4 === 0,
    } as Product;
  }),

  // ============================================
  // 🧥 СВИТШОТЫ (sweatshirts) — 20 товаров
  // 🖼️ Фото: public/images/products/sweatshirts/sweatshirt-{N}/{color}/front|side|back.jpg
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => {
    const id = `sweatshirt-${i + 1}`;
    const colors = COLOR_SETS.sweatshirts;
    return {
      id,
      name: NAMES.sweatshirts[i],
      price: [3990, 4490, 4990, 5490, 3690, 5990, 4190, 3490, 4790, 4290, 3890, 3290, 5190, 4690, 5790, 3590, 6490, 4090, 4390, 5090][i],
      originalPrice: i % 3 === 0 ? [3990, 4490, 4990, 5490, 3690, 5990, 4190, 3490, 4790, 4290, 3890, 3290, 5190, 4690, 5790, 3590, 6490, 4090, 4390, 5090][i] + 1500 : undefined,
      category: "sweatshirts",
      subcategory: ["basic-sweatshirts", "print-sweatshirts"][i % 2],
      season: ["autumn", "winter", "spring"][i % 3] as string,
      brand: ["PASHE Original", "Urban Style", "Premium Line"][i % 3],
      description: "Мягкий свитшот из хлопкового трикотажа. Комфортный крой для повседневной носки.",
      composition: "80% хлопок, 20% полиэстер",
      care: "Машинная стирка при 30°C",
      country: "Португалия",
      colorImages: ci("sweatshirts", id, colors),
      images: pi("sweatshirts", id, colors[0].folder),
      sizes: [
        { name: "S", available: i % 3 !== 0 },
        { name: "M", available: true },
        { name: "L", available: true },
        { name: "XL", available: i % 2 === 0 },
        { name: "XXL", available: i % 4 !== 0 },
      ],
      colors: toColors(colors),
      isNew: i < 4,
      isSale: i % 3 === 0,
    } as Product;
  }),

  // ============================================
  // 👕 ПОЛО (polo) — 20 товаров
  // 🖼️ Фото: public/images/products/polo/polo-{N}/{color}/front|side|back.jpg
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => {
    const id = `polo-${i + 1}`;
    const colors = COLOR_SETS.polo;
    return {
      id,
      name: NAMES.polo[i],
      price: [2990, 3490, 2790, 3990, 3290, 3190, 4490, 3690, 2890, 3890, 2590, 3090, 4190, 3590, 4790, 2690, 4990, 3790, 5490, 3390][i],
      originalPrice: i % 4 === 0 ? [2990, 3490, 2790, 3990, 3290, 3190, 4490, 3690, 2890, 3890, 2590, 3090, 4190, 3590, 4790, 2690, 4990, 3790, 5490, 3390][i] + 1000 : undefined,
      category: "polo",
      subcategory: ["classic-polo", "sport-polo"][i % 2],
      season: ["summer", "spring"][i % 2] as string,
      brand: ["PASHE Original", "Sport Collection", "Classic Edition"][i % 3],
      description: "Элегантное поло из хлопка пике. Классический воротник, качественное исполнение.",
      composition: "100% хлопок пике",
      care: "Машинная стирка при 30°C",
      country: "Турция",
      colorImages: ci("polo", id, colors),
      images: pi("polo", id, colors[0].folder),
      sizes: [
        { name: "S", available: true },
        { name: "M", available: true },
        { name: "L", available: i % 2 === 0 },
        { name: "XL", available: i % 3 !== 0 },
        { name: "XXL", available: i % 4 === 0 },
      ],
      colors: toColors(colors),
      isNew: i < 3,
      isSale: i % 4 === 0,
    } as Product;
  }),

  // ============================================
  // 👟 ОБУВЬ (shoes) — 20 товаров
  // 🖼️ Фото: public/images/products/shoes/shoes-{N}/{color}/front|side|back.jpg
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => {
    const id = `shoes-${i + 1}`;
    const colors = COLOR_SETS.shoes;
    return {
      id,
      name: NAMES.shoes[i],
      price: [7990, 12990, 9990, 6990, 11990, 4990, 14990, 13990, 5990, 8990, 16990, 7490, 9490, 5490, 15990, 3990, 19990, 8490, 10990, 17990][i],
      originalPrice: i % 3 === 0 ? [7990, 12990, 9990, 6990, 11990, 4990, 14990, 13990, 5990, 8990, 16990, 7490, 9490, 5490, 15990, 3990, 19990, 8490, 10990, 17990][i] + 3000 : undefined,
      category: "shoes",
      subcategory: ["sneakers", "boots", "loafers", "sneakers", "boots"][i % 5],
      season: ["all", "winter", "summer", "all", "winter"][i % 5] as string,
      brand: ["PASHE Original", "Premium Line", "Urban Style"][i % 3],
      description: "Стильная обувь из качественных материалов. Удобная колодка, долговечность.",
      composition: "Верх: натуральная кожа, Подошва: резина",
      care: "Чистить влажной тканью, использовать крем для обуви",
      country: "Италия",
      colorImages: ci("shoes", id, colors),
      images: pi("shoes", id, colors[0].folder),
      sizes: [
        { name: "40", available: i % 3 !== 0 },
        { name: "41", available: true },
        { name: "42", available: true },
        { name: "43", available: i % 2 === 0 },
        { name: "44", available: i % 4 !== 0 },
        { name: "45", available: i % 3 === 0 },
      ],
      colors: toColors(colors),
      isNew: i < 4,
      isSale: i % 3 === 0,
    } as Product;
  }),

  // ============================================
  // 🎒 АКСЕССУАРЫ (accessories) — 20 товаров
  // 🖼️ Фото: public/images/products/accessories/accessory-{N}/{color}/front|side|back.jpg
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => {
    const id = `accessory-${i + 1}`;
    const colors = COLOR_SETS.accessories;
    return {
      id,
      name: NAMES.accessories[i],
      price: [1990, 4990, 2990, 3490, 5990, 3990, 1490, 2490, 7990, 6990, 1290, 3290, 5490, 4490, 6490, 8990, 2790, 1790, 9990, 4290][i],
      originalPrice: i % 4 === 0 ? [1990, 4990, 2990, 3490, 5990, 3990, 1490, 2490, 7990, 6990, 1290, 3290, 5490, 4490, 6490, 8990, 2790, 1790, 9990, 4290][i] + 1000 : undefined,
      category: "accessories",
      subcategory: ["belts", "bags", "wallets", "scarves", "sunglasses"][i % 5],
      season: "all" as string,
      brand: ["PASHE Original", "Premium Line", "Classic Edition"][i % 3],
      description: "Стильный аксессуар из качественных материалов. Дополнит любой образ.",
      composition: "Натуральная кожа",
      care: "Избегать попадания влаги",
      country: "Италия",
      colorImages: ci("accessories", id, colors),
      images: pi("accessories", id, colors[0].folder),
      sizes: [{ name: "ONE SIZE", available: true }],
      colors: toColors(colors),
      isNew: i < 5,
      isSale: i % 4 === 0,
    } as Product;
  }),

  // ============================================
  // 🧢 КЕПКИ (caps) — 20 товаров
  // 🖼️ Фото: public/images/products/caps/cap-{N}/{color}/front|side|back.jpg
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => {
    const id = `cap-${i + 1}`;
    const colors = COLOR_SETS.caps;
    return {
      id,
      name: NAMES.caps[i],
      price: [1490, 1990, 2490, 1790, 2290, 2990, 1690, 1290, 1590, 2790, 2190, 1890, 3490, 1390, 1690, 1990, 1490, 2090, 2690, 2390][i],
      originalPrice: i % 3 === 0 ? [1490, 1990, 2490, 1790, 2290, 2990, 1690, 1290, 1590, 2790, 2190, 1890, 3490, 1390, 1690, 1990, 1490, 2090, 2690, 2390][i] + 500 : undefined,
      category: "caps",
      subcategory: ["baseball-caps", "beanies", "panama-hats"][i % 3],
      season: ["summer", "winter", "summer"][i % 3] as string,
      brand: ["PASHE Original", "Urban Style", "Sport Collection"][i % 3],
      description: "Стильный головной убор для завершения образа.",
      composition: "100% хлопок",
      care: "Ручная стирка",
      country: "Турция",
      colorImages: ci("caps", id, colors),
      images: pi("caps", id, colors[0].folder),
      sizes: [
        { name: "S/M", available: true },
        { name: "L/XL", available: i % 2 === 0 },
      ],
      colors: toColors(colors),
      isNew: i < 4,
      isSale: i % 3 === 0,
    } as Product;
  }),

  // ============================================
  // 🤵 КОСТЮМЫ (suits) — 20 товаров
  // 🖼️ Фото: public/images/products/suits/suit-{N}/{color}/front|side|back.jpg
  // ============================================
  ...Array.from({ length: 20 }, (_, i) => {
    const id = `suit-${i + 1}`;
    const colors = COLOR_SETS.suits;
    return {
      id,
      name: NAMES.suits[i],
      price: [19990, 24990, 29990, 14990, 34990, 22990, 17990, 39990, 44990, 27990, 21990, 18990, 32990, 26990, 23990, 28990, 49990, 15990, 25990, 21490][i],
      originalPrice: i % 4 === 0 ? [19990, 24990, 29990, 14990, 34990, 22990, 17990, 39990, 44990, 27990, 21990, 18990, 32990, 26990, 23990, 28990, 49990, 15990, 25990, 21490][i] + 10000 : undefined,
      category: "suits",
      subcategory: ["business-suits", "casual-suits", "wedding-suits"][i % 3],
      season: "all" as string,
      brand: ["PASHE Original", "Premium Line", "Classic Edition"][i % 3],
      description: "Элегантный костюм из качественной ткани. Безупречный крой, современный силуэт.",
      composition: "70% шерсть, 30% полиэстер",
      care: "Сухая чистка",
      country: "Италия",
      colorImages: ci("suits", id, colors),
      images: pi("suits", id, colors[0].folder),
      sizes: [
        { name: "46", available: i % 3 !== 0 },
        { name: "48", available: true },
        { name: "50", available: true },
        { name: "52", available: i % 2 === 0 },
        { name: "54", available: i % 4 !== 0 },
      ],
      colors: toColors(colors),
      isNew: i < 3,
      isSale: i % 4 === 0,
    } as Product;
  }),
];

// ============================================
// 🔍 ФУНКЦИИ ПОИСКА И ФИЛЬТРАЦИИ + УПРАВЛЕНИЕ ИЗ АДМИНКИ
// ============================================

export interface ProductAdminOverride {
  price?: number;
  originalPrice?: number | null;
  isNew?: boolean;
  discountUntil?: string | null;
}

// ---------- In-memory cache (loaded from DB) ----------

let _overridesCache: Record<string, ProductAdminOverride> = {};
let _customProductsCache: Product[] = [];
let _cacheLoaded = false;

const normalizeProductState = (product: Product): Product => {
  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price;
  return { ...product, isSale: hasDiscount };
};

const applyOverride = (product: Product, override?: ProductAdminOverride): Product => {
  if (!override) return normalizeProductState(product);
  const next: Product = { ...product };
  if (typeof override.price === "number" && Number.isFinite(override.price) && override.price > 0) next.price = Math.round(override.price);
  if (override.originalPrice === null) { delete next.originalPrice; }
  else if (typeof override.originalPrice === "number" && Number.isFinite(override.originalPrice) && override.originalPrice > 0) next.originalPrice = Math.round(override.originalPrice);
  if (typeof override.isNew === "boolean") next.isNew = override.isNew;
  const isDiscountExpired = !!override.discountUntil && Number.isFinite(new Date(override.discountUntil).getTime()) && new Date(override.discountUntil).getTime() < Date.now();
  if (isDiscountExpired) delete next.originalPrice;
  return normalizeProductState(next);
};

// ---------- DB helpers (import supabase lazily) ----------

const getSupabase = async () => {
  const { supabase } = await import("@/integrations/supabase/client");
  return supabase;
};

export const loadOverridesFromDB = async (): Promise<Record<string, ProductAdminOverride>> => {
  const supabase = await getSupabase();
  const { data } = await supabase.from("product_overrides").select("*");
  const map: Record<string, ProductAdminOverride> = {};
  (data || []).forEach((row: any) => {
    map[row.product_id] = {
      price: row.price ? Number(row.price) : undefined,
      originalPrice: row.original_price !== null && row.original_price !== undefined ? Number(row.original_price) : null,
      isNew: row.is_new ?? undefined,
      discountUntil: row.discount_until || null,
    };
  });
  _overridesCache = map;
  return map;
};

export const loadCustomProductsFromDB = async (): Promise<Product[]> => {
  const supabase = await getSupabase();
  const { data } = await supabase.from("custom_products").select("*");
  const list: Product[] = (data || []).map((row: any) => normalizeProductState({
    id: row.product_key,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory || row.category,
    season: "all",
    brand: row.brand,
    description: row.description || "",
    composition: row.composition || "",
    care: row.care || "",
    country: row.country || "",
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    isNew: row.is_new ?? false,
    colors: row.colors || [],
    colorImages: row.color_images || {},
    images: row.images || [],
    sizes: row.sizes || [],
  }));
  _customProductsCache = list;
  return list;
};

export const loadAllFromDB = async () => {
  await Promise.all([loadOverridesFromDB(), loadCustomProductsFromDB()]);
  _cacheLoaded = true;
};

export const upsertProductOverrideDB = async (productId: string, override: ProductAdminOverride) => {
  const supabase = await getSupabase();
  const row: any = { product_id: productId, updated_at: new Date().toISOString() };
  if (override.price !== undefined) row.price = override.price;
  if (override.originalPrice !== undefined) row.original_price = override.originalPrice;
  if (override.isNew !== undefined) row.is_new = override.isNew;
  if (override.discountUntil !== undefined) row.discount_until = override.discountUntil;
  await supabase.from("product_overrides").upsert(row, { onConflict: "product_id" });
  // Update cache
  _overridesCache[productId] = { ..._overridesCache[productId], ...override };
};

export const saveCustomProductDB = async (product: Product) => {
  const supabase = await getSupabase();
  await supabase.from("custom_products").upsert({
    product_key: product.id,
    name: product.name,
    category: product.category,
    subcategory: product.subcategory || product.category,
    brand: product.brand,
    description: product.description,
    composition: product.composition,
    care: product.care,
    country: product.country,
    price: product.price,
    original_price: product.originalPrice || null,
    is_new: product.isNew || false,
    colors: product.colors,
    color_images: product.colorImages,
    images: product.images,
    sizes: product.sizes,
  } as any, { onConflict: "product_key" });
  _customProductsCache = [..._customProductsCache.filter(p => p.id !== product.id), normalizeProductState(product)];
};

// ---------- Sync getters (use cached data) ----------

export const getProductOverrides = (): Record<string, ProductAdminOverride> => _overridesCache;

export const upsertProductOverride = (productId: string, override: ProductAdminOverride) => {
  _overridesCache[productId] = { ..._overridesCache[productId], ...override };
  // Fire-and-forget DB save
  upsertProductOverrideDB(productId, override).catch(console.error);
};

export const getCustomProducts = (): Product[] => _customProductsCache;

export const saveCustomProduct = (product: Product) => {
  _customProductsCache = [..._customProductsCache.filter(p => p.id !== product.id), normalizeProductState(product)];
  saveCustomProductDB(product).catch(console.error);
};

export const removeCustomProduct = (productId: string) => {
  _customProductsCache = _customProductsCache.filter(p => p.id !== productId);
  getSupabase().then(s => s.from("custom_products").delete().eq("product_key", productId)).catch(console.error);
};

export const getManagedProducts = (): Product[] => {
  const overrides = _overridesCache;
  const managedBase = products.map((p) => applyOverride(p, overrides[p.id]));
  return [...managedBase, ...getCustomProducts()];
};

export const getProductById = (id: string): Product | undefined => {
  return getManagedProducts().find((p) => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return getManagedProducts().filter((p) => p.category === category || p.subcategory === category);
};

export const getFeaturedProducts = (): Product[] => {
  return getManagedProducts().filter((p) => p.isNew).slice(0, 8);
};

export const getSaleProducts = (): Product[] => {
  return getManagedProducts().filter((p) => p.isSale);
};

export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return [];
  return getManagedProducts().filter((p) =>
    p.name.toLowerCase().includes(searchTerm) ||
    p.brand.toLowerCase().includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm) ||
    p.colors.some((c) => c.name.toLowerCase().includes(searchTerm))
  );
};

export const isCacheLoaded = () => _cacheLoaded;
