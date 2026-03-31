import { prisma } from "../db";

import { assert } from "superstruct";
import { BookCreationData } from "../validation/book";
import { BookUpdateData } from "../validation/book";

import { object, optional, string, number, enums } from "superstruct";
import validator from "validator";
import bcrypt from "bcryptjs";

import { Request, Response, NextFunction } from "express";
import express from "express";
const app = express();

app.use(express.json());

var jwt = require("jsonwebtoken");

export async function signup(req: Request, res: Response) {
  const { email, username, password } = req.body;

  //VALIDATION EMAIL
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Email invalide" });
  }

  //VALIDATION PASSWORD
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Le mot de passe doit faire au moins 8 caractères" });
  }

  // HASH PASSWORD
  const hashed = await bcrypt.hash(password, 10);

  // CREATE USER
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashed,
    },
  });

  // Select good infos of user
  const user2 = await prisma.user.findUnique({
    where: { username: username },
    select: { email: true, username: true },
  });
  res.status(201).json({ message: "Utilisateur créé", user2 });
}

export async function signin(req: Request, res: Response) {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!user) return res.status(404).json({ message: "user not found" });

  const goodpw = await bcrypt.compare(password, user.password);

  if (!goodpw) return res.status(400).json({ message: "wrong login/pasword" });

  const user2 = await prisma.user.findUnique({
    where: { username: username },
    select: { email: true, username: true },
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
  return res.json({ user2, token });
}
