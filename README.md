# Interface pour une API de gestion de livres

## Description

Ce projet est une application web développée avec React (Vite) permettant de gérer des livres, des auteurs et des tags via une API REST.

L'application permet :

* d’afficher des auteurs et des livres
* d’ajouter, supprimer et modifier des données
* de filtrer et paginer les résultats
* de naviguer entre auteurs, livres et tags

---

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd <nom-du-projet>
```

### 2. Installer les dépendances

```bash
bun install
```

### 3. Lancer l'api
```
cd booksAPI
bun run dev
```

### 3. Lancer le projet

```bash
cd BookWorldApp
bun run dev
```

---

## API

L'application communique avec une API REST (exemple : `http://localhost:3000`).

Assurez-vous que l’API est lancée avant de démarrer le client.

---

## Configuration CORS

Pour autoriser les requêtes entre le client et l’API, activer CORS côté serveur :

```js
import cors from 'cors';
app.use(cors());
```

Exposer également l’en-tête nécessaire à la pagination :

```js
res.header('Access-Control-Expose-Headers', 'X-Total-Count');
```

---

## Structure du projet

```
src/
 ├── api.ts           # appels HTTP vers l’API
 ├── types.ts         # types (Author, Book, Tag, etc.)
 ├── routes/
 │    ├── authors.tsx
 │    ├── author.tsx
 │    ├── books.tsx
 │    ├── book.tsx
 ├── utils/
 │    ├── pagination.tsx
 │    ├── editableText.tsx
```

---

## Fonctionnalités

### Auteurs

* affichage de la liste des auteurs
* ajout et suppression
* affichage du détail d’un auteur
* affichage des livres associés

### Livres

* liste paginée
* filtrage par titre
* affichage du détail d’un livre
* lien vers l’auteur

### Tags

* association de tags à un livre
* suppression de tags

### Pagination

* navigation entre pages
* gestion du nombre total avec l’en-tête `X-Total-Count`

### Filtrage

* recherche d’auteurs par nom
* recherche de livres par titre

### Modification

* édition inline avec le composant `EditableText`

### Gestion du chargement

* affichage d’un état "Loading..." pendant les requêtes

---

## Exemples

### Récupérer les auteurs

```ts
const authors = await get_authors();
```

### Ajouter un auteur

```ts
await add_author({ firstname: "John", lastname: "Doe" });
```

### Supprimer un auteur

```ts
await remove_author(1);
```

---

## Technologies utilisées

* React
* Vite
* TypeScript
* React Router
* Fetch API

---

## Améliorations possibles

* système de notes
* commentaires
* favoris (localStorage)
* amélioration de l’interface graphique

---

## Auteur

Projet réalisé dans le cadre d’un TP de développement web.
