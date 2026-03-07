import { Outlet } from 'react-router';

export default function Root() {
  return (<>
    <header>
      <ul>
        <li>Lien 1</li>
        <li>Lien 2</li>
      </ul>
    </header>
    <main>
      <Outlet />
    </main>
    <footer>
      <em>Made with React & React Router</em>
    </footer>
  </>);
}
