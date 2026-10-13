export type Setor = "parrilla" | "cozinha" | "bar" | "copa";

export type Option = { id: string; name: string; extra: number };
export type Group = {
  id: string;
  name: string;
  mode: "single" | "multi";
  required: boolean;
  max: number;
  options: Option[];
};

export type Product = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  per100g?: number;
  minGrams?: number;
  setor: Setor;
  image?: string;
  featured?: boolean;
  groups: Group[];
};

export const MESAS: Record<string, number> = {
  "m1-a7k3": 1,
  "m2-b8p1": 2,
  "m5-x9a2": 5,
  "m8-q4r7": 8,
  "m12-z3m9": 12,
};

const ponto: Group = {
  id: "ponto",
  name: "Ponto da carne",
  mode: "single",
  required: true,
  max: 1,
  options: [
    { id: "mp", name: "Mal passado", extra: 0 },
    { id: "apm", name: "Ao ponto para mal", extra: 0 },
    { id: "ap", name: "Ao ponto", extra: 0 },
    { id: "apb", name: "Ao ponto para bem", extra: 0 },
    { id: "bp", name: "Bem passado", extra: 0 },
  ],
};

const acomp: Group = {
  id: "acomp",
  name: "Acompanhamentos",
  mode: "multi",
  required: false,
  max: 3,
  options: [
    { id: "arroz", name: "Arroz de alho", extra: 0 },
    { id: "baiao", name: "Baião cremoso do Zé", extra: 8 },
    { id: "fritas", name: "Batata frita", extra: 0 },
    { id: "macaxeira", name: "Macaxeira frita", extra: 0 },
    { id: "farofa", name: "Farofa mediterrânea", extra: 0 },
    { id: "legumes", name: "Legumes assados", extra: 0 },
  ],
};

export const CATEGORIES = [
  { id: "entradas", name: "Entradas" },
  { id: "cortes", name: "Cortes nobres" },
  { id: "executivos", name: "Executivos" },
  { id: "drinks", name: "Drinks" },
  { id: "bebidas", name: "Bebidas" },
  { id: "doces", name: "Sobremesas" },
] as const;

export const PRODUCTS: Product[] = [
  {
    id: "chorizo",
    category: "entradas",
    name: "Chorizo argentino",
    description: "Linguiça artesanal na parrilla, casca crocante e miolo suculento.",
    price: 42,
    setor: "parrilla",
    image: "/menu/chorizo.jpg",
    featured: true,
    groups: [],
  },
  {
    id: "pao",
    category: "entradas",
    name: "Pão de alho artesanal",
    description: "Pão na brasa com manteiga de alho da casa.",
    price: 28,
    setor: "cozinha",
    groups: [],
  },
  {
    id: "coracao",
    category: "entradas",
    name: "Coração de frango",
    description: "Espeto grelhado, tempero leve de limão e sal grosso.",
    price: 36,
    setor: "parrilla",
    groups: [],
  },
  {
    id: "picanha",
    category: "cortes",
    name: "Picanha Angus",
    description: "Capa de gordura selada. Preço por 100 g, mínimo 300 g.",
    price: 0,
    per100g: 18.9,
    minGrams: 300,
    setor: "parrilla",
    image: "/menu/picanha.jpg",
    featured: true,
    groups: [ponto, acomp],
  },
  {
    id: "ancho",
    category: "cortes",
    name: "Beef ancho",
    description: "Corte premium da costela, marmoreio marcado.",
    price: 0,
    per100g: 22.5,
    minGrams: 300,
    setor: "parrilla",
    featured: true,
    groups: [ponto, acomp],
  },
  {
    id: "maminha",
    category: "cortes",
    name: "Maminha argentina",
    description: "Fibra curta, suculenta, ponto da casa.",
    price: 0,
    per100g: 16.9,
    minGrams: 300,
    setor: "parrilla",
    groups: [ponto, acomp],
  },
  {
    id: "tomahawk",
    category: "cortes",
    name: "Tomahawk",
    description: "Peça de cerca de 1 kg, para dividir à mesa.",
    price: 289,
    setor: "parrilla",
    image: "/menu/tomahawk.jpg",
    featured: true,
    groups: [ponto, acomp],
  },
  {
    id: "medalhao",
    category: "executivos",
    name: "Medalhão de filé mignon",
    description: "Com arroz de alho e legumes grelhados.",
    price: 79.9,
    setor: "cozinha",
    groups: [ponto],
  },
  {
    id: "fettuccine",
    category: "executivos",
    name: "Fettuccine ao alho e óleo",
    description: "Massa fresca, azeite, alho laminado e parmesão.",
    price: 48,
    setor: "cozinha",
    groups: [],
  },
  {
    id: "negroni",
    category: "drinks",
    name: "Negroni do Zé",
    description: "Gin, bitter e vermute, casca de laranja.",
    price: 38,
    setor: "bar",
    image: "/menu/negroni.jpg",
    featured: true,
    groups: [],
  },
  {
    id: "gin",
    category: "drinks",
    name: "Gin tônica",
    description: "Gin selecionado e tônica gelada.",
    price: 32,
    setor: "bar",
    groups: [],
  },
  {
    id: "agua",
    category: "bebidas",
    name: "Água com gás",
    description: "Garrafa 500 ml.",
    price: 9,
    setor: "copa",
    groups: [],
  },
  {
    id: "refri",
    category: "bebidas",
    name: "Refrigerante lata",
    description: "Cola, guaraná ou cítrico.",
    price: 8,
    setor: "copa",
    groups: [
      {
        id: "sabor",
        name: "Sabor",
        mode: "single",
        required: true,
        max: 1,
        options: [
          { id: "cola", name: "Cola", extra: 0 },
          { id: "guarana", name: "Guaraná", extra: 0 },
          { id: "citrico", name: "Cítrico", extra: 0 },
        ],
      },
    ],
  },
  {
    id: "pudim",
    category: "doces",
    name: "Pudim de leite",
    description: "Cremoso, calda de caramelo queimado.",
    price: 24,
    setor: "copa",
    image: "/menu/pudim.jpg",
    groups: [],
  },
];

export function money(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function priceLabel(p: Product) {
  return p.per100g ? `${money(p.per100g)} / 100 g` : money(p.price);
}

export function unitPrice(p: Product, grams: number) {
  if (p.per100g) return (p.per100g * grams) / 100;
  return p.price;
}

export const SETOR_LABEL: Record<Setor, string> = {
  parrilla: "Parrilla",
  cozinha: "Cozinha",
  bar: "Bar",
  copa: "Copa",
};
