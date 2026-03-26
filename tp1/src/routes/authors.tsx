import { useEffect, useState } from "react";
import type { Author } from "../types";
import { add_author, get_authors, remove_author } from "../api";
import { NavLink, Outlet } from "react-router";


export default function Authors() {
  //return <h1>Authors</h1>;
  const [authors, setAuthors] = useState<Author[]>([]);
  const [error, setError] = useState("");

  async function loadAuthors() {
    const data = await get_authors();
    setAuthors(data);
  }

  ///add et supp author
  async function addAuthor(data: { firstname: string; lastname: string }) {
    try {
      await add_author(data);
      await loadAuthors();
      setError("");
    } catch (err: any) {
      setError(err.message); // erreur API
    }
  }

  async function removeAuthor(id: number) {
    try {
      await remove_author(id);
      await loadAuthors();
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  function handleRemove(id: number) {
    removeAuthor(id);
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    await addAuthor({
      firstname: (form.elements.namedItem("firstname") as HTMLInputElement)
        .value,
      lastname: (form.elements.namedItem("lastname") as HTMLInputElement).value,
    });
    form.reset();
  }
  //////

  useEffect(() => {
    loadAuthors();
  }, []);

  return (
    <>
      <div
        id="sidebar" //dans la section sidebar
      >
        {" "}
        <form
          onSubmit={handleAdd} //formulaire
        >
          {" "}
          <input name="firstname" placeholder="Prénom" />
          <input name="lastname" placeholder="Nom" />
          <button type="submit">Ajouter</button>
        </form>
        {error !== "" && <p className="error">{error}</p>}
        <ul>
          {authors.map(
            (
              author, //affcihe chaque autheur sous forme liste
            ) => (
              <NavLink to={String(author.id)}>
                {author.firstname} {author.lastname}
                &nbsp;
                <button //devant chaque auteur on a un btn pour le degager
                  className="small danger"
                  onClick={() => handleRemove(author.id)}
                >
                  X
                </button>
                <br></br>
              </NavLink>
            ),
          )}
        </ul>
      </div>
      <div id="info">
        <Outlet />
      </div>
    </>
  );
}
