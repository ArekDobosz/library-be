import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const booksCount = 100;

const prisma = new PrismaClient();

async function main() {
  let counter = 0;
  while (counter < booksCount) {
    const authorFullName = faker.person.fullName();
    await prisma.author.upsert({
      where: { name: authorFullName, id: faker.string.uuid() },
      update: {},
      create: {
        name: authorFullName,
        books: {
          create: {
            title: faker.lorem.text(),
            isbn: faker.number
              .int({ min: 10000000000, max: 90000000000 })
              .toString(),
            pages: faker.number.int({ min: 100, max: 1000 }),
            rating: faker.number.float({ min: 1, max: 5, multipleOf: 0.5 }),
          },
        },
      },
    });
    counter++;
  }
  console.log('Database seeded');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
