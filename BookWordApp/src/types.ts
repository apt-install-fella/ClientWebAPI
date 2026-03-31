//la meme structure que la base de donnee, pour pouvoir contenir les rep renvoyer apres appel api

export type Author = {
  id: number;
  firstname: string;
  lastname: string;
  books?: Book[];
};

export type AuthorCreationData = {
  firstname: string;
  lastname: string;
};

export type Book = {
  id: number;
  title: string;
  publication_year: number;
  description: string;

  tags?: Tag[];

  author: Author;
  authorId: number;
};

export type BookCreationData = {
  title: string;
  publication_year: number;
  authorId: number;
};

export type Tag = {
  id: number;
  name: string;
  books: Book[];
};
