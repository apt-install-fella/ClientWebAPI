import { useEffect, useState } from "react";
import type { Book } from "../types";
import { useParams } from "react-router";
import { get_book } from "../api";
import BookTags from "./bookTags";
import EditableText from "../utils/EditableText";

export default function Book() {
  const { book_id } = useParams();

  const [book, setBook] = useState<Book | null>(null);
  async function loadAuthor() {
    if (!book_id) return;

    const data = await get_book(Number(book_id));
    setBook(data);
  }
  useEffect(() => {
    loadAuthor();
  }, [book_id]);
  if (!book) return <p>no info...</p>;

  return (
    <div>
      <h2>{book.title}</h2>
      <p>Publié en {book.publication_year}</p>
      <BookTags bookId={book.id} />
      <EditableText
        value="Ceci est un test"
        onUpdate={async (newValue) => {
          console.log("NOUVELLE VALEUR :", newValue);
          return Promise.resolve();
        }}
      />
    </div>
  );
}
