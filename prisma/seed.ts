import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// allowMultiple: можно ли в одном луке несколько вещей этой зоны сразу.
// Одежда/обувь/сумка - один слот на образ. Украшения - можно комбинировать.
const zones = [
  { code: "HEAD", displayName: "Голова", allowMultiple: false, sortOrder: 1 },
  { code: "FACE", displayName: "Лицо", allowMultiple: false, sortOrder: 2 },
  { code: "NECK", displayName: "Шея", allowMultiple: true, sortOrder: 3 },
  { code: "EARS", displayName: "Уши", allowMultiple: true, sortOrder: 4 },
  {
    code: "TORSO_INNER",
    displayName: "Верх (внутренний слой)",
    allowMultiple: false,
    sortOrder: 5,
  },
  {
    code: "TORSO_OUTER",
    displayName: "Верх (наружный слой)",
    allowMultiple: false,
    sortOrder: 6,
  },
  { code: "WRIST", displayName: "Запястье", allowMultiple: true, sortOrder: 7 },
  { code: "FINGER", displayName: "Палец", allowMultiple: true, sortOrder: 8 },
  { code: "WAIST", displayName: "Талия", allowMultiple: false, sortOrder: 9 },
  {
    code: "LEGS_INNER",
    displayName: "Низ (внутренний слой)",
    allowMultiple: false,
    sortOrder: 10,
  },
  {
    code: "LEGS_OUTER",
    displayName: "Низ (наружный слой)",
    allowMultiple: false,
    sortOrder: 11,
  },
  { code: "FEET", displayName: "Обувь", allowMultiple: false, sortOrder: 12 },
  {
    code: "HAND",
    displayName: "Рука (сумка)",
    allowMultiple: false,
    sortOrder: 13,
  },
  {
    code: "FULL_BODY",
    displayName: "Цельная вещь",
    allowMultiple: false,
    sortOrder: 14,
  },
];

const categories: { name: string; zoneCode: string; sortOrder: number }[] = [
  { name: "Шапка", zoneCode: "HEAD", sortOrder: 1 },
  { name: "Кепка", zoneCode: "HEAD", sortOrder: 2 },
  { name: "Шляпа", zoneCode: "HEAD", sortOrder: 3 },
  { name: "Футболка", zoneCode: "TORSO_INNER", sortOrder: 4 },
  { name: "Блузка", zoneCode: "TORSO_INNER", sortOrder: 5 },
  { name: "Водолазка", zoneCode: "TORSO_INNER", sortOrder: 6 },
  { name: "Свитер", zoneCode: "TORSO_OUTER", sortOrder: 7 },
  { name: "Пиджак", zoneCode: "TORSO_OUTER", sortOrder: 8 },
  { name: "Куртка", zoneCode: "TORSO_OUTER", sortOrder: 9 },
  { name: "Пальто", zoneCode: "TORSO_OUTER", sortOrder: 10 },
  { name: "Леггинсы", zoneCode: "LEGS_INNER", sortOrder: 11 },
  { name: "Джинсы", zoneCode: "LEGS_OUTER", sortOrder: 12 },
  { name: "Брюки", zoneCode: "LEGS_OUTER", sortOrder: 13 },
  { name: "Юбка", zoneCode: "LEGS_OUTER", sortOrder: 14 },
  { name: "Шорты", zoneCode: "LEGS_OUTER", sortOrder: 15 },
  { name: "Платье", zoneCode: "FULL_BODY", sortOrder: 16 },
  { name: "Комбинезон", zoneCode: "FULL_BODY", sortOrder: 17 },
  { name: "Кроссовки", zoneCode: "FEET", sortOrder: 18 },
  { name: "Ботинки", zoneCode: "FEET", sortOrder: 19 },
  { name: "Туфли", zoneCode: "FEET", sortOrder: 20 },
  { name: "Сандалии", zoneCode: "FEET", sortOrder: 21 },
  { name: "Сумка", zoneCode: "HAND", sortOrder: 22 },
  { name: "Шарф", zoneCode: "NECK", sortOrder: 23 },
  { name: "Ремень", zoneCode: "WAIST", sortOrder: 24 },
  { name: "Очки", zoneCode: "FACE", sortOrder: 25 },
  { name: "Браслет", zoneCode: "WRIST", sortOrder: 26 },
  { name: "Колье", zoneCode: "NECK", sortOrder: 27 },
  { name: "Серьги", zoneCode: "EARS", sortOrder: 28 },
  { name: "Кольцо", zoneCode: "FINGER", sortOrder: 29 },
];

async function main() {
  // сначала зоны - категории на них ссылаются через connect по code
  for (const zone of zones) {
    await prisma.bodyZone.upsert({
      where: { code: zone.code },
      update: {
        displayName: zone.displayName,
        allowMultiple: zone.allowMultiple,
        sortOrder: zone.sortOrder,
      },
      create: zone,
    });
  }
  console.log(`Засеяно зон: ${zones.length}`);

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {
        sortOrder: category.sortOrder,
        zone: { connect: { code: category.zoneCode } },
      },
      create: {
        name: category.name,
        sortOrder: category.sortOrder,
        zone: { connect: { code: category.zoneCode } },
      },
    });
  }
  console.log(`Засеяно категорий: ${categories.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });