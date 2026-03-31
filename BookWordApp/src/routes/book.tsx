import { useEffect, useState } from "react";
import type { Book } from "../types";
import { useParams } from "react-router";
import { get_book, update_book } from "../api";
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

  async function updateField(
    field: "title" | "publication_year",
    value: string,
  ) {
    if (!book) return;

    const updatedField = {
      [field]: field === "publication_year" ? Number(value) : value,
    };

    await update_book(book.id, updatedField);

    setBook({
      ...book,
      ...updatedField,
    });
  }


  return (
    <div>
      <h2>
        <EditableText
          value={book.title}
          onSave={(val) => updateField("title", val)}
        />
      </h2>

      <div>
        Publié en{" "}
        <EditableText
          value={String(book.publication_year)}
          onSave={(val) => updateField("publication_year", val)}
        />
      </div>

      <BookTags bookId={book.id} />
    </div>
  );
}
