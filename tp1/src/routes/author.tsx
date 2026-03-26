import { useEffect, useState } from "react";
import type { Author } from "../types";
import { useParams } from "react-router";
import { get_author } from "../api";

export default function Author() {
  const { author_id } = useParams();

  //return <h1>Author</h1>;
  const [author, setAuthor] = useState<Author | null>(null);
  async function loadAuthor() {
    if (!author_id) return;

    const data = await get_author(Number(author_id));
    setAuthor(data);
  }
  useEffect(() => {
    loadAuthor();
  }, [author_id]);
  if (!author) return <p>Loading...</p>;

  return (
    <h2>
      {author.firstname} {author.lastname}
    </h2>
  );
}
