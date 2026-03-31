import { useEffect, useState } from "react";
import type { Author, Book } from "../types";
import { useParams } from "react-router";

import {
  get_author,
  get_books_of_author,
  add_book_to_author,
  remove_book,
} from "../api";

export default function Author() {
  const { author_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState<Author | null>(null);

  async function loadAuthor() {
    if (!author_id) return;

    setLoading(true);

    const data = await get_author(Number(author_id));

    setAuthor(data);

    setLoading(false);
  }

  useEffect(() => {
    loadAuthor();
  }, [author_id]);
  if (!author) return <p>no such author</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>
        {author.firstname} {author.lastname}
      </h2>
      <AuthorBooks />
    </div>
  );
}

function AuthorBooks() {
  const { author_id } = useParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");

  async function loadBooks() {
    if (!author_id) return;
    const data = await get_books_of_author(Number(author_id));
    setBooks(data);
  }

  async function addBook(data: { title: string; publication_year: number }) {
    if (!author_id) return;
    try {
      await add_book_to_author(Number(author_id), data);
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
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    //quand on submit le formulaire
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const publication_year = Number(
      (form.elements.namedItem("publication_year") as HTMLInputElement).value,
    );

    await addBook({ title, publication_year });
    form.reset();
  }

  function handleRemove(id: number) {
    removeBook(id);
  }

  useEffect(() => {
    loadBooks();
  }, [author_id]);

  return (
    <div>
      <h3>Livres</h3>
      <form onSubmit={handleAdd}>
        <input name="title" placeholder="Titre du livre" />
        <input name="publication_year" placeholder="Annee de publication" />
        <button type="submit">Ajouter</button>
      </form>
      {error !== "" && <p>{error}</p>}
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} ({book.publication_year})

            <button
              className="small danger"
              onClick={() => handleRemove(book.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
