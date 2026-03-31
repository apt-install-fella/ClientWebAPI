import express from "express";
import type { Request, Response, NextFunction } from "express";
import { HttpError } from "./errors/error";

import * as author from "./requestHandlers/author";
import * as book from "./requestHandlers/book";
import * as tag from "./requestHandlers/tag";

import * as user from "./requestHandlers/user";
import * as comment from "./requestHandlers/comment";
import * as rating from "./requestHandlers/rating";

import { StructError } from "superstruct";

import { object, optional, refine, string } from "superstruct";
import { isInt } from "validator";

import { assert } from "superstruct";
import { expressjwt, Request as AuthRequest } from "express-jwt";
import { prisma } from "./db";

import cors from "cors";

const app = express();
const port = 3000;
app.use(cors()); // premier middleware

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Expose-Headers", "X-Total-Count");
  next();
});

export const auth_client = [
  expressjwt({
    secret: process.env.JWT_SECRET as string,
    algorithms: ["HS256"],
  }),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.auth?.id) },
    });
    if (user) {
      req.auth = user;
      next();
    } else {
      res.status(401).send("Invalid token");
    }
  },
];

const validateParams = (req: Request, res: Response, next: NextFunction) => {
  assert(req.params, ReqParams);
  next();
};

// ROUTES AUTHORS
app.get("/authors", author.get_all);
app.post("/authors", author.create_one);

app
  .route("/authors/:author_id")
  .all(validateParams)
  .get(author.get_one)
  .patch(author.update_one)
  .delete(author.delete_one);

app.all("/authors/:author_id/books", validateParams);
app.get("/authors/:author_id/books", author.get_all_of_author);
app.post("/authors/:author_id/books", book.create_one_of_author);

// ROUTES BOOKS
app.get("/books", book.get_all);
app.all("/book/:book_id", validateParams);
app.get("/book/:book_id", book.get_one);
app.patch("/books/:book_id", book.update_one);
app.delete("/books/:book_id", book.delete_one);

//ROUTE TAGS
app
  .route("/tags/tag_id")
  .get(tag.get_one)
  .patch(tag.update_one)
  .delete(tag.delete_one);

app.get("/books/:book_id/tags", tag.get_all_of_book);
app.post("/books/:book_id/tags", tag.add_tag_to_book);
app.delete("/books/:book_id/tags/:tag_id", tag.remove_tag_from_book);


app.get("/tags", tag.get_all);
app.get("books/:book_id/tags", tag.get_all_of_book);
app.post("/tags", tag.create_one);
app.post("/books/:book_id/:tags/:tag_id", tag.give_book_one_tag);

//ROUTE USERS
app.post("/signup", user.signup);
app.post("/signin", user.signin);

//ROUTE COMMENTS
app.get("/books/:book_id/comments", comment.get_all_of_book);
app.post("/books/:book_id/comments", auth_client, comment.create_one);
app.patch("/comments/:comment_id", comment.update_one);
app.delete("/comments/:comment_id", comment.delete_one);

//ROUTE RATINGS
app.get("/books/:book_id/ratings", rating.get_all_of_book);
app.post("/books/:book_id/rating", auth_client, rating.create_one);
app.patch("/ratings/:rating_id", rating.update_one);
app.delete("/ratings/:rating_id", rating.delete_one);
app.get("/books/:book_id/ratings/average", rating.get_average);

// ERRORS
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status ?? 500).send(err.message);

  if (err instanceof StructError) {
    err.status = 400;
    err.message = `Bad value for field ${err.key}`;
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

export const ReqParams = object({
  author_id: optional(refine(string(), "int", (value) => isInt(value))),
  book_id: optional(refine(string(), "int", (value) => isInt(value))),
});
