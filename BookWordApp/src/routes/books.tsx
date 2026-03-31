import { useEffect, useState } from "react";
import type { Book } from "../types";
import { add_Book, get_books, remove_book } from "../api";
import BookTags from "./bookTags";
import { NavLink, Outlet } from "react-router";
import Pagination from "../utils/pagination";

export default function Books() {
  //pagination
  const [page, setPage] = useState(1); //par defaut 1 page
  const [total, setTotal] = useState(0); //par defaut 0 autheur
  const pageSize = 4;
  const [books, setBooks] = useState<Book[]>([]);

  const [authId, setAuthId] = useState(""); //filre

  const [error, setError] = useState("");

  async function loadBooks(authorFilter = authId) {
    const data = await get_books({
      page,
      pageSize,
      authorId: authorFilter ? Number(authorFilter) : undefined,
    });

    setBooks(data.books);
    setTotal(data.total);

    const totalPages = Math.ceil(data.total / pageSize);
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }

  async function addBook(data: {
    title: string;
    publication_year: number;
    authorId: number;
  }) {
    try {
      await add_Book(data);
      await loadBooks();
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function removeBook(id: number) {
    try {
      await remove_book(id);
      await loadBooks();
    } catch (err: any) {
      setError(err.message);
    }
  }

  function handleRemove(id: number) {
    removeBook(id);
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    await addBook({
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      publication_year: Number(
        (form.elements.namedItem("publication_year") as HTMLInputElement).value,
      ),
      authorId: Number(
        (form.elements.namedItem("authorId") as HTMLInputElement).value,
      ),
    });
    form.reset();
  }

  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const value = (
      form.elements.namedItem("filter_author_id") as HTMLInputElement
    ).value;

    setAuthId(value);
    setPage(1);
    loadBooks(value);
  }

  useEffect(() => {
    loadBooks();
  }, [page]);

  return (
    <>
      <div id="sidebar">
        <form
          onSubmit={handleAdd} //formulaire
        >
          {" "}
          <input name="title" placeholder="titre" />
          <input name="publication_year" placeholder="annee publication" />
          <input name="authorId" placeholder="id auteur" />{" "}
          <button type="submit">Ajouter</button>
        </form>
        <form onSubmit={handleFilter}>
          <input name="filter_author_id" placeholder="Filtrer par id auteur" />
          <button type="submit">Filtrer</button>
        </form>
        {error !== "" && <p className="error">{error}</p>}
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <NavLink to={String(book.id)}>
                {book.title} {book.publication_year} Auteur : {book.authorId}
              </NavLink>

              <button
                className="small danger"
                onClick={() => handleRemove(book.id)}
              >
                X
              </button>
            </li>
          ))}
        </ul>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
      <div id="info">
        <Outlet />
      </div>
    </>
  );
}
