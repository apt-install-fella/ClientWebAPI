import { Request, Response } from "express";
import { prisma } from "../db";

import { assert } from "superstruct";
import { BookCreationData } from "../validation/book";
import { BookUpdateData } from "../validation/book";

import { object, optional, string, number, enums } from "superstruct";

import { expressjwt, Request as AuthRequest } from "express-jwt";

export async function get_all_of_book(req: Request, res: Response) {
  const book = await prisma.book.findUnique({
    where: { id: Number(req.params.book_id) },
    include: { ratings: true },
  });

  if (!book) return res.status(404).json({ message: "Book not found" });

  res.json(book.ratings);
}

export async function update_one(req: Request, res: Response) {
  const updateRate = await prisma.rating.update({
    where: { id: Number(req.params.rating_id) },
    data: {
      value: req.body,
    },
  });

  res.json({ updateRate });
}

export async function create_one(req: Request, res: Response) {
  const book_id = Number(req.params.book_id);
  const user_id = (req as any).auth.id;

  // création du rating
  const rate = await prisma.rating.create({
    data: {
      userId: user_id,
      bookId: book_id,
      value: req.body.content,
    },
  });
  // Met à jour le livre en ajoutant le comment
  const updatedBook = await prisma.book.update({
    where: { id: book_id },
    data: {
      ratings: {
        connect: { id: rate.id },
      },
    },
  });

  // Met à jour le user en ajoutant le comment
  const updatedUser = await prisma.user.update({
    where: { id: user_id },
    data: {
      ratings: {
        connect: { id: rate.id },
      },
    },
  });

  res.json({ updatedBook, updatedUser, rate });
}

export async function delete_one(req: Request, res: Response) {
  const deletedRate = await prisma.rating.delete({
    where: { id: Number(req.params.rating_id) },
  });

  res.status(200).json({ message: "Rating deleted" });
}

export async function get_average(req: Request, res: Response) {
  const aggregations = await prisma.rating.aggregate({
    where: {
      bookId: Number(req.params.book_id),
    },

    _avg: { value: true },
  });

  res.json({ average: aggregations._avg.value });
}
