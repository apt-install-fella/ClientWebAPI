import { password } from "bun";
import { object, string, size } from "superstruct";
import { number, optional } from "superstruct";

export const UserCreationData = object({
  email: size(string(), 1, 50),
  password: size(string(), 8,50),
});

export const AuthorUpdateData = object({
  firstname: optional(size(string(), 1, 50)),
  lastname: optional(size(string(), 1, 50)),
});
