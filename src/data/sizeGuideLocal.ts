// Локальная таблица размеров для каждой категории (без БД)

export interface SizeRow {
  size: string;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  length?: number;
  foot?: number;
}

export const sizeGuideByCategory: Record<string, SizeRow[]> = {
  tshirts: [
    { size: "XS", chest: 86, waist: 72, shoulder: 42, length: 66 },
    { size: "S", chest: 90, waist: 76, shoulder: 44, length: 68 },
    { size: "M", chest: 96, waist: 82, shoulder: 46, length: 70 },
    { size: "L", chest: 102, waist: 88, shoulder: 48, length: 72 },
    { size: "XL", chest: 108, waist: 94, shoulder: 50, length: 74 },
    { size: "XXL", chest: 114, waist: 100, shoulder: 52, length: 76 },
  ],
  outerwear: [
    { size: "S", chest: 92, waist: 78, shoulder: 44, length: 68 },
    { size: "M", chest: 98, waist: 84, shoulder: 46, length: 70 },
    { size: "L", chest: 104, waist: 90, shoulder: 48, length: 72 },
    { size: "XL", chest: 110, waist: 96, shoulder: 50, length: 74 },
    { size: "XXL", chest: 116, waist: 102, shoulder: 52, length: 76 },
  ],
  shirts: [
    { size: "S", chest: 90, waist: 76, shoulder: 43, length: 72 },
    { size: "M", chest: 96, waist: 82, shoulder: 45, length: 74 },
    { size: "L", chest: 102, waist: 88, shoulder: 47, length: 76 },
    { size: "XL", chest: 108, waist: 94, shoulder: 49, length: 78 },
    { size: "XXL", chest: 114, waist: 100, shoulder: 51, length: 80 },
  ],
  pants: [
    { size: "28", waist: 72, hips: 92, length: 100 },
    { size: "30", waist: 76, hips: 96, length: 102 },
    { size: "32", waist: 82, hips: 100, length: 104 },
    { size: "34", waist: 88, hips: 104, length: 106 },
    { size: "36", waist: 94, hips: 108, length: 108 },
  ],
  jeans: [
    { size: "28", waist: 72, hips: 92, length: 100 },
    { size: "30", waist: 76, hips: 96, length: 102 },
    { size: "32", waist: 82, hips: 100, length: 104 },
    { size: "34", waist: 88, hips: 104, length: 106 },
    { size: "36", waist: 94, hips: 108, length: 108 },
  ],
  shorts: [
    { size: "S", waist: 76, hips: 96, length: 42 },
    { size: "M", waist: 82, hips: 100, length: 44 },
    { size: "L", waist: 88, hips: 104, length: 46 },
    { size: "XL", waist: 94, hips: 108, length: 48 },
  ],
  sweatshirts: [
    { size: "S", chest: 94, waist: 80, shoulder: 45, length: 66 },
    { size: "M", chest: 100, waist: 86, shoulder: 47, length: 68 },
    { size: "L", chest: 106, waist: 92, shoulder: 49, length: 70 },
    { size: "XL", chest: 112, waist: 98, shoulder: 51, length: 72 },
    { size: "XXL", chest: 118, waist: 104, shoulder: 53, length: 74 },
  ],
  polo: [
    { size: "S", chest: 90, waist: 76, shoulder: 43, length: 68 },
    { size: "M", chest: 96, waist: 82, shoulder: 45, length: 70 },
    { size: "L", chest: 102, waist: 88, shoulder: 47, length: 72 },
    { size: "XL", chest: 108, waist: 94, shoulder: 49, length: 74 },
    { size: "XXL", chest: 114, waist: 100, shoulder: 51, length: 76 },
  ],
  shoes: [
    { size: "40", foot: 25.5 },
    { size: "41", foot: 26.0 },
    { size: "42", foot: 27.0 },
    { size: "43", foot: 27.5 },
    { size: "44", foot: 28.5 },
    { size: "45", foot: 29.0 },
  ],
  accessories: [
    { size: "ONE SIZE" },
  ],
  caps: [
    { size: "S/M", chest: undefined },
    { size: "L/XL", chest: undefined },
  ],
  suits: [
    { size: "46", chest: 92, waist: 78, shoulder: 44, length: 74 },
    { size: "48", chest: 96, waist: 82, shoulder: 46, length: 76 },
    { size: "50", chest: 100, waist: 86, shoulder: 48, length: 78 },
    { size: "52", chest: 104, waist: 90, shoulder: 50, length: 80 },
    { size: "54", chest: 108, waist: 94, shoulder: 52, length: 82 },
  ],
};
