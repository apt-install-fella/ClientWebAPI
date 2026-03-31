import { Request, Response } from "express";
import { prisma } from "../db";
import { assert } from "superstruct";

// GET /tags
export async function get_all(req: Request, res: Response) {
  const tags = await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
  });
  res.json(tags);
}

// GET /tags/:tag_id
export async function get_one(req: Request, res: Response) {
  const tag = await prisma.tag.findUnique({
    where: { id: Number(req.params.tag_id) },
  });

  if (!tag) return res.status(404).json({ message: "Tag not found" });

  res.json(tag);
}

// PATCH /tags/:tag_id
export async function update_one(req: Request, res: Response) {
  const tag = await prisma.tag.update({
    where: { id: Number(req.params.tag_id) },
    data: req.body,
  });

  res.json(tag);
}

// DELETE /tags/:tag_id
export async function delete_one(req: Request, res: Response) {
  await prisma.tag.delete({
    where: { id: Number(req.params.tag_id) },
  });

  res.sendStatus(204);
}

// POST /tags
export async function create_one(req: Request, res: Response) {
  const tag = await prisma.tag.create({
    data: req.body,
  });

  res.status(201).json(tag);
}

//GET /books/:book_id/tags : retourne la liste des tags associés au livre dont l'identifiant est :book_id
export async function get_all_of_book(req: Request, res: Response) {
  const book = await prisma.book.findUnique({
    where: { id: Number(req.params.book_id) },
    include: { tags: true },
  });

  if (!book) return res.status(404).json({ message: "Book not found" });

  res.json(book.tags);
}

// POST /books/:book_id/tags/:tag_id : associe le tag au livre
export async function give_book_one_tag(req: Request, res: Response) {
  const bookId = Number(req.params.book_id);
  const tagId = Number(req.params.tag_id);

  // verif tag existe
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
  });
  if (!tag) {
    return res.status(404).json({ error: "Tag not found" });
  }

  // Met à jour le livre en ajoutant le tag
  const updatedBook = await prisma.book.update({
    where: { id: bookId },
    data: {
      tags: {
        connect: { id: tagId },
      },
    },
  });

  res.json(updatedBook);
}

// POST /books/:book_id/tags
export async function add_tag_to_book(req: Request, res: Response) {
  const bookId = Number(req.params.book_id);
  const { tagId } = req.body;

  // verif que le tag existe
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
  });
  if (!tag) {
    return res.status(404).json({ error: "Tag not found" });
  }

  // Associer le tag au livre
  await prisma.book.update({
    where: { id: bookId },
    data: {
      tags: {
        connect: { id: tagId },
      },
    },
  });

  res.sendStatus(204);
}

// DELETE /books/:book_id/tags/:tag_id
export async function remove_tag_from_book(req: Request, res: Response) {
  const bookId = Number(req.params.book_id);
  const tagId = Number(req.params.tag_id);

  await prisma.book.update({
    where: { id: bookId },
    data: {
      tags: {
        disconnect: { id: tagId },
      },
    },
  });

  res.sendStatus(204);
}
