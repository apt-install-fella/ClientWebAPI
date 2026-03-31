//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Root from "./routes/root.tsx";
import Authors from "./routes/authors.tsx";
import Author from "./routes/author.tsx";
import Books from "./routes/books.tsx";
import Book from "./routes/book.tsx";
import { BrowserRouter, Routes, Route } from "react-router";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Root />}>
        <Route path="authors" element={<Authors />}>
          {/* Route index */}
          <Route index element={<p>Sélectionnez un auteur dans la liste.</p>} />

          {/* Route dynamique */}
          <Route path=":author_id" element={<Author />} />
        </Route>

        <Route path="books" element={<Books />}>
          <Route index element={<p>Sélectionnez un livre dans la liste.</p>} />

          {/* Route dynamique */}
          <Route path=":book_id" element={<Book />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>,
);
