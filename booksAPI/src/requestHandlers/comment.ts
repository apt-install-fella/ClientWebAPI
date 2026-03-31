import { prisma } from "../db";

import { assert } from "superstruct";
import { BookCreationData } from "../validation/book";
import { BookUpdateData } from "../validation/book";

import { object, optional, string, number, enums } from "superstruct";

import { Request, Response, NextFunction } from "express";
import { expressjwt, Request as AuthRequest } from "express-jwt";

export async function get_all_of_book(req: Request, res: Response) {
  const book = await prisma.book.findUnique({
    where: { id: Number(req.params.book_id) },
    include: { comments: true },
  });

  if (!book) return res.status(404).json({ message: "Book not found" });

  res.json(book.comments);
}

export async function create_one(req: Request, res: Response) {
  const book_id = Number(req.params.book_id);
  const user_id = (req as any).auth.id;

  // création du commentaire
  const comm = await prisma.comment.create({
    data: {
      userName: user_id,
      about: book_id,
      content: req.body.content,
    },
  });
  // Met à jour le livre en ajoutant le comment
  const updatedBook = await prisma.book.update({
    where: { id: book_id },
    data: {
      comments: {
        connect: { id: comm.id },
      },
    },
  });

  // Met à jour le user en ajoutant le comment
  const updatedUser = await prisma.user.update({
    where: { id: user_id },
    data: {
      comments: {
        connect: { id: comm.id },
      },
    },
  });

  res.json({ updatedBook, updatedUser, comm });
}

export async function update_one(req: Request, res: Response) {
  const updateComment = await prisma.comment.update({
    where: { id: Number(req.params.tag_id) },
    data: {
      content: req.body,
    },
  });

  res.json({ updateComment });
}

export async function delete_one(req: Request, res: Response) {
  const deletedComment = await prisma.comment.delete({
    where: { id: Number(req.params.comment_id) },
  });

  res.status(201);
}
