# React-router

[React-router](https://reactrouter.com/home)

Utiliser la bibliothèque `React Router` pour réaliser une application dont l'interface peut être dans des ***états*** différents en fonction de la ***route client***.

Dans le cadre de ce module, on va utiliser `React Router` dans sa version "_Library_".

Mise en place
---

Initialiser un nouveau dossier `tp4` avec `vite`.
Puis :
- Écraser le contenu du fichier `src/index.css` par le contenu du fichier du même nom situé dans le dossier `ressources`.
- Supprimer le fichier `src/App.css`.
- Supprimer le fichier `src/App.tsx`.

Installer le paquet `react-router` :
```
bun install react-router
```

Contrairement aux sujets précédents, on va commencer ici à travailler dans le fichier `src/main.tsx`.

Déclaration des routes
---

Dans le fichier `src/main.tsx`, importer les symboles `BrowserRouter`, `Routes` et `Route` depuis le module `react-router`.

- Créer un dossier `routes` au sein du dossier `src`.
- Copier le module `root.tsx` depuis le dossier `ressources` dans le dossier `routes`.
- Dans le module `main.tsx`, importer le composant exporté par ce module.
- Déclarer la première structure de route suivante :

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Root />} />
  </Routes>
</BrowserRouter>
```

Lisez les bases de la configuration de routes dans la documentation :
https://reactrouter.com/start/declarative/routing

> Essayez notamment de comprendre les notions d'`<Outlet>`, d'_imbrication_ de routes, d'_index_ et de _segments dynamiques_.

- Déclarer deux nouvelles sous-routes : `"items"` et `"grocery"`.
- Récupérer les composants `ItemsApp` et `GroceryApp` (ainsi que les autres composants qui vont avec), et les exporter respectivement depuis des modules `items.tsx` et `grocery.tsx` stockés dans le dossier `routes`.
- Importer ces composants dans le module `main.tsx` et les associer en tant qu'élément dans leur route respective.

Vous pouvez déjà essayer de changer de route en modifiant directement cette dernière dans la barre d'adresse de votre navigateur.

Navigation
---

La documentation concernant les bases de la _navigation_ : https://reactrouter.com/start/declarative/navigating

Afin de permettre à l'utilisateur de changer de route interactivement, on peut utiliser l'élément `<Link>` fourni par `React Router` :
- Dans le `<header>` du composant `Root`, ajouter dans la liste des liens vers les routes `"/items"` et `"/grocery"`.

> À chaque changement de route, `React Router` déclenche une réévaluation de l'interface de l'application.
> 
> Constater que l'on peut bien changer de route en cliquant sur ces liens.

- Remplacer ces liens par des éléments `<NavLink>`. `React Router` donne automatiquement la classe CSS `"active"` (pour laquelle du CSS est déjà prévu dans le fichier `index.css`) aux liens dont le chemin correspond à la route courante.

Si la persistance des données dans le `localStorage` du navigateur n'est pas réalisée, on constate que les données sont réinitialisées à chaque fois que les composants intègrent à nouveau l'interface.

Index
---

Quand une route dispose de routes filles, son élément contient un `<Outlet>` dans lequel sera rendu l'élément associé à la route fille matchée par la route courante.

Quand la route courante s'arrête *exactement* au chemin de la route mère, aucune de ses filles ne matche et l'`<Outlet>` reste vide.

La définition d'une route fille `index` permet de définir un élément à rendre dans l'`<Outlet>` dans ce cas là :

> Ajouter une route fille `index` dans laquelle on rend un composant `<Home>` qui affiche un message de bienvenue.
