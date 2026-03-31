import { Request, Response } from "express";
import { prisma } from "../db";
import { assert } from "superstruct";
import { AuthorCreationData } from "../validation/author";
import { AuthorUpdateData } from "../validation/author";
import { object, optional, string, number, enums, coerce } from "superstruct";

import { Prisma } from "../generated/prisma/client";
const assoc: Prisma.AuthorInclude = {};

export const AuthorsQuerySchema = object({
  skip: optional(coerce(number(), string(), (val) => Number(val))),
  take: optional(coerce(number(), string(), (val) => Number(val))),
  lastname: optional(string()),
  include: optional(enums(["books"])),
});

// GET /authors
export async function get_all(req: Request, res: Response) {
  //validation query
  const query = AuthorsQuerySchema.create(req.query);

  // récupère le paramètre de query, ou "" si non fourni
  const lastnameFilter = query.lastname ? query.lastname.toString() : ""; //recup le filtre si jamais on veut que les lastname qui ont une chaine de caractere presice

  const includeBooks = query.include === "books"; //true or false

  const skip = Number(query.skip) || 0; //Si l’utilisateur donne une valeur, on utilise sa valeur
  const take = Number(query.take) || 10; //Si l’utilisateur ne donne rien, on utilise la valeur après ||

  const where = lastnameFilter
    ? { lastname: { contains: lastnameFilter } }
    : {}; //utilisation de la consition

  const total = await prisma.author.count({
    where: where,
  }); //compte le nombres d'auteursobtenu par la suite de la requette

  const authors = await prisma.author.findMany({
    where: where,
    include: includeBooks ? { books: true } : undefined, //si true, cherche livre, si non: ne defini pas les livres
    orderBy: { lastname: "asc" },
    skip,
    take,
  }); //chervhe le resultat

  res.set("X-Total-Count", total.toString());
  res.json(authors);
}

// POST /authors
export async function create_one(req: Request, res: Response) {
  assert(req.body, AuthorCreationData);
  const author = await prisma.author.create({
    data: req.body,
  });

  res.status(201).json(author);
}

// GET /authors/:author_id
export async function get_one(req: Request, res: Response) {
  const author = await prisma.author.findUnique({
    where: { id: Number(req.params.author_id) },
    include: {
      books: {
        select: { title: true },
        orderBy: {
          title: "asc",
        },
      },
    },
  });

  if (!author) return res.status(404).json({ message: "Author not found" });

  res.json(author);
}

// PATCH /authors/:author_id
export async function update_one(req: Request, res: Response) {
  assert(req.body, AuthorUpdateData);

  const author = await prisma.author.update({
    where: { id: Number(req.params.author_id) },
    data: req.body,
  });

  res.json(author);
}

// DELETE /authors/:author_id
export async function delete_one(req: Request, res: Response) {
  await prisma.author.delete({
    where: { id: Number(req.params.author_id) },
  });

  res.sendStatus(204);
}

// GET /authors/:author_id/books
/*app.get("/authors/:author_id/books", async (req, res) => {
  const books = await prisma.book.findMany({
    where: {
      authorId: Number(req.params.author_id),
    },
  });

  res.json(books);
});*/
export async function get_all_of_author(req: Request, res: Response) {
  const authorId = Number(req.params.author_id); //recup le id que le user veut

  const author = await prisma.author.findUnique({
    where: { id: authorId },
    include: { books: true },
  }); //cherche l'aiteur avec cet id

  const skip = Number(req.query.skip) || 0; //recup skip et take
  const take = Number(req.query.take) || 10;

  if (!author) return res.status(404).json({ message: "Author not found" }); //si l'auteur exite pas on continu pas

  const total = await prisma.book.count({
    where: { authorId: authorId },
  }); //on compte le nb de livre qui ont l'id auteur voulu

  const books = await prisma.book.findMany({
    where: { authorId },
    skip,
    take,
  }); //la requete

  res.set("X-Total-Count", total.toString());
  res.json(books);
}
