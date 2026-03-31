import type { Author } from "./types";
import type { Book } from "./types";
import type { AuthorCreationData } from "./types";
import type { BookCreationData } from "./types";

//toutes nos fonctions sont ici
const apiBasename = "http://localhost:3000";

type GetSomethingParams = {
  //entete retournee par l'api
  //info pagination
  page?: number;
  pageSize?: number;
  lastname?: string;
  year?: number;
  authorId?: number;
};

export async function get_authors(params: GetSomethingParams = {}) {
  //ALL AUTHORS

  const { page, pageSize, lastname } = params;
  const queryParams = new URLSearchParams();

  if (page !== undefined && pageSize !== undefined) {
    queryParams.set("skip", String((page - 1) * pageSize));
    queryParams.set("take", String(pageSize));
  }
  if (lastname) {
    queryParams.set("lastname", lastname);
  }

  const url = `${apiBasename}/authors?${queryParams.toString()}`; // URL construite

  const res = await fetch(url); //appel de cette route
  if (!res.ok) {
    //si on a PAS une rep bien
    const msg = await res.text(); //on recup le message d'erreur
    throw new Error(msg); //on retourne une erreure
  }
  const authors: Author[] = await res.json(); //on stock la rep format json dans un tab
  const total = Number(res.headers.get("X-Total-Count"));
  return { authors, total }; //pn retourne le tab et le nb page
}

export async function get_books(params: GetSomethingParams = {}) {
  //ALL BOOKS

  const { page, pageSize, year, authorId } = params;
  const queryParams = new URLSearchParams();

  if (page !== undefined && pageSize !== undefined) {
    queryParams.set("skip", String((page - 1) * pageSize));
    queryParams.set("take", String(pageSize));
  }
  if (year) {
    queryParams.set("year", String(year));
  }

  let url = `${apiBasename}/books?${queryParams.toString()}`; // URL construite

  if (authorId !== undefined) {
    url = `${apiBasename}/authors/${authorId}/books?${queryParams.toString()}`;
  }

  const res = await fetch(url); //appel de cette route
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }
  const books: Book[] = await res.json();
  const total = Number(res.headers.get("X-Total-Count"));
  return { books, total };
}

export async function add_author(data: AuthorCreationData) {
  const res = await fetch(`${apiBasename}/authors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }
}

export async function remove_author(id: number) {
  const res = await fetch(`${apiBasename}/authors/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }
}

export async function add_Book(data: BookCreationData) {
  const { authorId, ...bodyData } = data;
  const res = await fetch(`${apiBasename}/authors/${authorId}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyData),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }
}

export async function remove_book(id: number) {
  const res = await fetch(`${apiBasename}/books/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }
}

export async function get_author(id: number) {
  const res = await fetch(`${apiBasename}/authors/${id}`);

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }

  const author: Author = await res.json();
  return author;
}

export async function get_book(id: number) {
  const res = await fetch(`${apiBasename}/book/${id}`);

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }

  const Book: Book = await res.json();
  return Book;
}

export async function get_books_of_author(authorId: number) {
  const res = await fetch(`${apiBasename}/authors/${authorId}/books`);
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }
  const books: Book[] = await res.json();
  return books;
}

export async function add_book_to_author(
  authorId: number,
  data: { title: string; publication_year: number },
) {
  const res = await fetch(`${apiBasename}/authors/${authorId}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }
}



//TAGSSSS
export async function get_tags_of_book(bookId: number) {
  const res = await fetch(`${apiBasename}/books/${bookId}/tags`);
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }
  return res.json();
}


export async function get_all_tags() {
  const res = await fetch(`${apiBasename}/tags`);
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }
  return res.json();
}


export async function add_tag_to_book(bookId: number, tagId: number) {
  const res = await fetch(`${apiBasename}/books/${bookId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tagId }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }
}


export async function remove_tag_from_book(bookId: number, tagId: number) {
  const res = await fetch(`${apiBasename}/books/${bookId}/tags/${tagId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }
}

