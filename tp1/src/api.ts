import type { Author } from "./types";
import type { Book } from "./types";
import type { AuthorCreationData } from "./types";
import type { BookCreationData } from "./types";

//toutes nos fonctions sont ici
const apiBasename = "http://localhost:3000";

export async function get_authors() {
  //ALL AUTHORS
  const res = await fetch(`${apiBasename}/authors`); //appel de cette route
  if (!res.ok) {
    //si on a PAS une rep bien
    const msg = await res.text(); //on recup le message d'erreur
    throw new Error(msg); //on retourne une erreure
  }
  const authors: Author[] = await res.json(); //on stock la rep format json dans un tab
  return authors; //pn retourne le tab
}

export async function get_books() {
  //ALL BOOKS
  const res = await fetch(`${apiBasename}/books`); //la meme chose que all authors
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }
  const books: Book[] = await res.json();
  return books;
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
