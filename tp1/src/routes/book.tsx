import { useEffect, useState } from "react";
import type { Book } from "../types";
import { useParams } from "react-router";
import { get_book } from "../api";

export default function Book() {
  const { book_id } = useParams();

  //return <h1>Author</h1>;
  const [book, setBook] = useState<Book | null>(null);
  async function loadAuthor() {
    if (!book_id) return;

    const data = await get_book(Number(book_id));
    setBook(data);
  }
  useEffect(() => {
    loadAuthor();
  }, [book_id]);
  if (!book) return <p>Loading...</p>;

  return (
    <h2>
      {book.title} {book.publication_year}
    </h2>
  );
}
