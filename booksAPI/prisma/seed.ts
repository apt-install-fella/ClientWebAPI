import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  /////////////////////////////////////
  // AUTHORS
  /////////////////////////////////////
  const authors = [
    { firstname: "J. R. R.", lastname: "Tolkien" },
    { firstname: "H. P.", lastname: "Lovecraft" },
  ];

  for (const author of authors) {
    await prisma.author.create({ data: author });
  }

  // author pour les autres livres
  const author = await prisma.author.create({
    data: { firstname: "paris", lastname: "france" },
  });

  /////////////////////////////////////
  // TAGS
  /////////////////////////////////////
  const tagAction = await prisma.tag.create({
    data: { name: "action" },
  });

  /////////////////////////////////////
  // BOOKS
  /////////////////////////////////////
  const book = await prisma.book.create({
    data: {
      title: "Quatrieme livre",
      publication_year: 2025,
      authorId: author.id,
      tags: { connect: [{ id: tagAction.id }] },
    },
  });

  await prisma.book.create({
    data: {
      title: "premier livre",
      publication_year: 2006,
      authorId: author.id,
    },
  });

  await prisma.book.create({
    data: {
      title: "deuxieme livre",
      publication_year: 2036,
      authorId: author.id,
    },
  });

  await prisma.book.create({
    data: {
      title: "troisieme livre",
      publication_year: 3000,
      authorId: author.id,
    },
  });

  /////////////////////////////////////
  // TAGS CONNECT
  /////////////////////////////////////
  const book1 = await prisma.book.findUnique({ where: { id: 1 } });
  const book2 = await prisma.book.findUnique({ where: { id: 2 } });
  const book3 = await prisma.book.findUnique({ where: { id: 3 } });

  await prisma.tag.create({
    data: {
      name: "fiction",
      books: {
        connect: [{ id: book1!.id }, { id: book2!.id }],
      },
    },
  });

  await prisma.tag.create({
    data: {
      name: "romance",
      books: {
        connect: [{ id: book3!.id }, { id: book2!.id }],
      },
    },
  });

  /////////////////////////////////////
  // USERS
  /////////////////////////////////////
  const jonathan = await prisma.user.create({
    data: {
      email: "jonathan@example.com",
      username: "Toki",
      password: "$2b$10$H1oTuGJ19w/9DdntJxtelOtx3MXc9uG6iTMS1YBVBPwQXoxEqf4Ne", // user123
    },
  });

  const fella = await prisma.user.create({
    data: {
      email: "fella@example.com",
      username: "laQueen",
      password: "$2b$10$L0jMrzGlZ8wE7FVwDnOmm.Vgxm2gkGUSMhKk63XF8lUAgNUEiFszC", // admin123
    },
  });

  const capucine = await prisma.user.create({
    data: {
      email: "capucine@example.com",
      username: "fireFeather",
      password: "$2b$10$L0jMrzGlZ8wE7FVwDnOmm.Vgxm2gkGUSMhKk63XF8lUAgNUEiFszC", // admin123
    },
  });

  /////////////////////////////////////
  // COMMENTS
  /////////////////////////////////////
  await prisma.comment.create({
    data: {
      content: "nul comme livre.",
      user: {
        connect: { id: fella.id },
      },
      book: {
        connect: { id: book1!.id }, //! pour dire que la valeur est a 100% pas null
      },
    },
  });
  await prisma.comment.create({
    data: {
      content: "bla bla bla.",
      user: {
        connect: { id: jonathan.id },
      },
      book: {
        connect: { id: book1!.id },
      },
    },
  });

  /////////////////////////////////////
  // RATINGS
  /////////////////////////////////////
  await prisma.rating.create({
    data: {
      value: 5,
      bookId: book1!.id,
      userId: capucine.id,
    },
  });

  await prisma.rating.create({
    data: {
      value: 3,
      bookId: book2!.id,
      userId: fella.id,
    },
  });
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
