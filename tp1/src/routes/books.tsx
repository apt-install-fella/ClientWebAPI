import { useEffect, useState } from "react";
import type { Book } from "../types";
import { add_Book, get_books, remove_book } from "../api";
import { NavLink, Outlet } from "react-router";

export default function Books() {
  //return <h1>Books</h1>;
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");

  async function loadBooks() {
    const data = await get_books();
    setBooks(data);
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

  useEffect(() => {
    loadBooks();
  }, []);

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
      </div>
      <div id="info">
        <Outlet />
      </div>
    </>
  );
}
