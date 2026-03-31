import { Request, Response } from "express";
import { prisma } from "../db";

import { assert } from "superstruct";
import { BookCreationData } from "../validation/book";
import { BookUpdateData } from "../validation/book";

import { object, optional, string, number, enums, coerce } from "superstruct";

export const BooksQuerySchema = object({
  skip: optional(coerce(number(), string(), (val) => Number(val))),
  take: optional(coerce(number(), string(), (val) => Number(val))),
  title: optional(string()),
  include: optional(enums(["author"])), // si on veut inclure l'auteur
});
// GET /books
export async function get_all(req: Request, res: Response) {
  const query = BooksQuerySchema.create(req.query);

  const skip = Number(query.skip) || 0;
  const take = Number(query.take) || 10;

  const includeAuthor = query.include === "author"; //true or false

  const total = await prisma.book.count({});
  const books = await prisma.book.findMany({
    include: includeAuthor ? { author: true } : undefined, //si true, cherche livre, si non: ne defini pas les livres

    orderBy: {
      title: "asc",
    },
    skip,
    take,
  });
  res.set("X-Total-Count", total.toString());
  res.json(books);
}

// GET /book/:book_id
export async function get_one(req: Request, res: Response) {
  const book = await prisma.book.findUnique({
    where: { id: Number(req.params.book_id) },
  });

  if (!book) return res.status(404).json({ message: "Book not found" });

  res.json(book);
}

// PATCH /books/:book_id
export async function update_one(req: Request, res: Response) {
  assert(req.body, BookUpdateData);

  const book = await prisma.book.update({
    where: { id: Number(req.params.book_id) },
    data: req.body,
  });

  res.json(book);
}

// DELETE /books/:book_id
export async function delete_one(req: Request, res: Response) {
  await prisma.book.delete({
    where: { id: Number(req.params.book_id) },
  });

  res.sendStatus(204);
}

// POST /authors/:author_id/books
export async function create_one_of_author(req: Request, res: Response) {
  assert(req.body, BookCreationData);

  const authorId = Number(req.params.author_id);
  const { title, publication_year } = req.body;

  const book = await prisma.book.create({
    data: {
      title,
      publication_year,
      author: { connect: { id: authorId } },
    },
  });

  res.status(201).json(book);
}
