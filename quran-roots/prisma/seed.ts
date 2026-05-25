import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const surah = await prisma.surah.upsert({
    where: { number: 1 },
    update: {
      nameAr: 'الفاتحة',
      transliteration: 'Al-Fatihah',
      englishName: 'The Opening',
      type: 'Meccan',
      revelationPlace: 'Meccan',
      ayahCount: 7,
    },
    create: {
      number: 1,
      nameAr: 'الفاتحة',
      transliteration: 'Al-Fatihah',
      englishName: 'The Opening',
      type: 'Meccan',
      revelationPlace: 'Meccan',
      ayahCount: 7,
    },
  });

  const ayah = await prisma.ayah.upsert({
    where: { verseKey: '1:1' },
    update: {
      textUthmani: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      textSimple: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      surahId: surah.id,
      number: 1,
      globalNumber: 1,
    },
    create: {
      surahId: surah.id,
      number: 1,
      globalNumber: 1,
      verseKey: '1:1',
      textUthmani: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      textSimple: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    },
  });

  await prisma.translationSource.upsert({
    where: { sourceKey: 'sahih_international' },
    update: {
      name: 'Sahih International',
      language: 'english',
    },
    create: {
      sourceKey: 'sahih_international',
      name: 'Sahih International',
      language: 'english',
    },
  });

  await prisma.translationEntry.upsert({
    where: { ayahId_sourceId: { ayahId: ayah.id, sourceId: 1 } },
    update: {
      text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    },
    create: {
      ayahId: ayah.id,
      sourceId: 1,
      text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    },
  });

  await prisma.tafsir.upsert({
    where: { id: 1 },
    update: {
      source: 'Ibn Kathir',
      language: 'en',
      author: 'Ibn Kathir',
      text: 'The first verse is the name of Allah and the beginning of every good deed.',
      ayahId: ayah.id,
    },
    create: {
      source: 'Ibn Kathir',
      language: 'en',
      author: 'Ibn Kathir',
      text: 'The first verse is the name of Allah and the beginning of every good deed.',
      ayahId: ayah.id,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
