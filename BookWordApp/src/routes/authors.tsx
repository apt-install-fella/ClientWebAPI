import { useEffect, useState } from "react";
import type { Author } from "../types";
import { add_author, get_authors, remove_author } from "../api";
import { NavLink, Outlet } from "react-router";
import Pagination from "../utils/pagination";

export default function Authors() {
  //pagination
  const [page, setPage] = useState(1); //par defaut 1 page
  const [total, setTotal] = useState(0); //par defaut 0 autheur
  const pageSize = 4; //nb auteurs par page

  const [lastname, setLastname] = useState(""); //filre

  const [authors, setAuthors] = useState<Author[]>([]);
  const [error, setError] = useState("");

  async function loadAuthors(lastnameFilter = lastname) {
    const data = await get_authors({
      page,
      pageSize,
      lastname: lastnameFilter,
    });
    setAuthors(data.authors);
    setTotal(data.total);
    const totalPages = Math.ceil(data.total / pageSize);
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
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
  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const value = (
      form.elements.namedItem("filter_lastname") as HTMLInputElement
    ).value;
    setLastname(value);
    loadAuthors(value); // on passe la valeur directement
  }

  useEffect(() => {
    loadAuthors();
  }, [page, lastname]);

  return (
    <>
      <div
        id="sidebar" //dans la section sidebar
      >
        {" "}
        creation:
        <form
          onSubmit={handleAdd} //formulaire
        >
          {" "}
          <input name="firstname" placeholder="Prénom" />
          <input name="lastname" placeholder="Nom" />
          <br></br>
          <button type="submit">Ajouter</button>
        </form>
        ______________________________________________________ filtre:
        <form onSubmit={handleFilter}>
          <input name="filter_lastname" placeholder="Filtrer par nom" />
          <button type="submit">Filtrer</button>
        </form>
        {error !== "" && <p className="error">{error}</p>}
        ______________________________________________________
        <ul>
          {authors.map(
            (
              author, //affcihe chaque autheur sous forme liste
            ) => (
              <li key={author.id}>
                <NavLink key={author.id} to={String(author.id)}>
                  {author.firstname} {author.lastname}
                  &nbsp;
                </NavLink>

                <button //devant chaque auteur on a un btn pour le degager
                  className="small danger"
                  onClick={() => handleRemove(author.id)}
                >
                  x
                </button>
                <br></br>
              </li>
            ),
          )}
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
