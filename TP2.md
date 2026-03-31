# Items List

L'objectif est d'écrire une application dans laquelle :
 - On visualise une liste d'items (texte).
 - Chaque item peut être supprimé grâce à un bouton.
 - Un formulaire permet de rajouter un nouvel item.

Mise en place
---

Initialiser un nouveau dossier `tp2` avec `vite`, comme dans le sujet précédent.
Puis, à nouveau :
- Écraser le contenu du fichier `src/index.css` par le contenu du fichier du même nom situé dans le dossier `ressources`.
- Supprimer le fichier `src/App.css`.
- Modifier le fichier `src/App.tsx` de manière à ce qu'il ne contienne plus que les lignes suivantes :
```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <h1>Hello from W4!</h1>
    </div>
  );
}
```

Composants
---

Ecrire les composants suivants :

- `ItemsApp` :
  - possède dans son `state` un tableau de chaînes `items`.

> _Indication_ : la fonction `useState` peut inférer seule le type du state à partir de la valeur initiale. Cependant, la valeur initiale ne contient pas forcément suffisamment d'informations et le type inféré peut être trop restrictif. Il est donc parfois nécessaire de typer explicitement le state en passant un type générique à la fonction `useState`. Par exemple, pour typer un state contenant un tableau de chaînes de caractères, initialisé avec un tableau vide, on peut écrire :
> ```ts
> const [items, setItems] = useState<string[]>([]);
> ```

-
  - dispose d'une fonction `addItem` qui reçoit une chaîne et remplace le tableau `items` par un nouveau tableau contenant le nouvel item en plus de tous les anciens items (=> spread operator `...` : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals).
  - dispose d'une fonction `removeItem` qui reçoit un nombre et remplace le tableau `items` par un nouveau tableau contenant tous les anciens items sauf celui dont l'index correspond au nombre reçu (=> méthode standard `filter` : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).
  - retourne une description de l'interface composée d'un `AddItemForm` et d'une `ItemsList` : ces deux composants vont être écrits dans la suite. Le composant `AddItemForm` reçoit une prop nommée `addItem` à laquelle on affecte la fonction locale `addItem`; le composant `ItemsList` reçoit une prop nommée `items` à laquelle on affecte le tableau `items` du state, et une prop nommée `removeItem` à laquelle on affecte la fonction locale `removeItem`.

---

- `ItemsList` :
  - props : tableau `items` (tableau de chaînes de caractères), fonction `removeItem` (déclarer le type des `props` attendues par le composant).
  - retourne une description de l'interface composée d'une liste d'éléments (`<ul>`); pour chaque item, on affiche un élément de liste (`<li>`) avec son texte ainsi qu'un bouton. L'événement `onClick` de ce bouton appelle la fonction `removeItem` en lui passant l'index de l'élément dans le tableau. Les classes CSS `"small"` et `"danger"` peuvent être affectées à ce bouton.

> _Indications_ : les `children` d'un composant peuvent être un tableau d'éléments. Afin de construire un tableau d'éléments `<li>` à partir du tableau de chaînes reçu, on peut utiliser la méthode standard `map` : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map.

---

- `AddItemForm` :
  - props : fonction `addItem` (déclarer le type des `props` attendues par le composant).
  - retourne une description de l'interface composée d'un formulaire contenant un input et un bouton de soumission; à la soumission du formulaire (`onSubmit`), la fonction `addItem` est appelée en lui passant la valeur de l'input, puis ce dernier est vidé.

> _Indications_ :
> - Le type de la fonction affectée à la gestion de l'événement `onSubmit` est `SubmitEventHandler<HTMLFormElement>` (importé depuis le module `react`).
> On peut la déclarer comme suit :
> ```ts
> const handleSubmit: SubmitEventHandler<HTMLFormElement> = function (event) {
>   // ...
> };
> ```
> Cette fonction reçoit un objet `event` en paramètre (vous pouvez voir son type au survol dans votre éditeur de code). Dans cet objet, on trouve notamment la fonction `preventDefault` dont l'appel permet d'annuler le comportement par défaut du navigateur lors de la soumission d'un formulaire (qui serait une navigation vers l'`action` du formulaire).
> - Cet objet contient également une propriété `currentTarget` qui pointe vers l'élément qui a déclenché l'événement, en l'occurence ici le formulaire lui-même.
> - Un objet formulaire contient autant de propriétés que d'éléments nommés avec la propriété `name` au sein du formulaire. Le nom de la propriété dans l'objet formulaire correspond à la valeur donnée à la propriété `name` de chaque élément. On accède à la valeur d'un élement grâce à sa propriété `value`.
> - L'objet formulaire contient également une fonction `reset` qui permet de réinitialiser les valeurs des éléments du formulaire (ce que l'on peut faire ici après un ajout).
