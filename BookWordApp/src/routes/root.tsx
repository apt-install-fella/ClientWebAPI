import { Outlet, NavLink } from "react-router";

export default function Root() {
  return (
    <>
      <header>
        <ul>
          <li>
            <NavLink to="/authors">Authors</NavLink>
          </li>
          <li>
            <NavLink to="/books">Books</NavLink>
          </li>
        </ul>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <em>Made with React & React Router</em>
      </footer>
    </>
  );
}
