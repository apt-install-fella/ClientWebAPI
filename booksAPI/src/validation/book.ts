import { number, optional } from "superstruct";
import { object, string, size } from "superstruct";

export const BookCreationData = object({
  title: size(string(), 1, 100),
  publication_year: optional(number()),
});

export const BookUpdateData = object({
  title: optional(size(string(), 1, 100)),
  publication_year: optional(number()),
});
