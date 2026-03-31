import { object, string, size } from "superstruct";
import { number, optional } from "superstruct";

export const AuthorCreationData = object({
  firstname: size(string(), 1, 50),
  lastname: size(string(), 1, 50),
});

export const AuthorUpdateData = object({
  firstname: optional(size(string(), 1, 50)),
  lastname: optional(size(string(), 1, 50)),
});
