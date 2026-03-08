Démarrage
===

La doc de React est devenue assez incroyable.
Il y a des explications très progressives avec beaucoup d'exemples et des démos interactives.

Utilisez-la comme une référence pour répondre à des questions ou en apprendre plus sur les concepts que l'on va aborder.

https://react.dev/learn

---

Afin d'initialiser un dossier `tp1` contenant l'ensemble des outils nécessaires, on utilise le module `vite` (https://vitejs.dev/) :
```
bun create vite@latest tp1
```

Lorsque cela vous est demandé, choisir `React` puis `Typescript`.

Dites non quand il vous est proposé d'installer directement les dépendances et de lancer le serveur de développement.

Afin que la commande `vite` utilise effectivement `bun`, dans le fichier `package.json` du projet, ajouter `bunx --bun` devant les commandes `vite` dans les scripts `dev`, `build` et `preview` :
```json
"scripts": {
  "dev": "bunx --bun vite",
  "build": "tsc -b && bunx --bun vite build",
  "lint": "eslint .",
  "preview": "bunx --bun vite preview"
},
```

Ensuite, comme indiqué par la CLI, allez dans le dossier `tp1`, puis lancez la commande d'installation des dépendances et démarrez le serveur de développement :
```
cd tp1
bun install
bun run dev
```

Le serveur de dev local sera normalement accessible à l'adresse http://localhost:5173.

Ouvrir maintenant le dossier `tp1` (ou tout votre dossier `w42`) dans un éditeur de code.

- Écraser le contenu du fichier `src/index.css` par le contenu du fichier du même nom situé dans le dossier `ressources`.
- Supprimer le fichier `src/App.css`.
- Modifier le fichier `src/App.tsx` de manière à ce qu'il ne contienne plus que les lignes suivantes :
```js
import { useState, useEffect } from 'react';

export default function App() {
  return (
    <div>
      <h1>Hello from W4!</h1>
    </div>
  );
}
```

---

Message
===

- Écrire un composant `Message` qui affiche un paragraphe de texte dans l'interface.
- Ajouter plusieurs instances de ce composant dans l'interface.
- Faire en sorte que le composant reçoive en `props` le texte à afficher.

Pour cela, il faut déclarer le type de l'objet `props` attendu par le composant.
Dans notre cas, on peut le déclarer ainsi :
```ts
type MessageProps = {
  msg: string
}
```

On peut ensuite utiliser ce type pour typer les `props` du composant :
```ts
function Message({ msg }: MessageProps) {
  // ...
}
```

- Constater que chaque instance de `Message` est indépendante.
- Regarder le résultat produit dans le DOM lors de l'évaluation de cette interface.

> ***Les données ne font que descendre dans l'arborescence des composants.***

Déclarer un tableau de messages dans le composant `App`.
Par exemple :
```ts
let messages = [
  'Hello, world!',
  'Bonjour, monde!',
  'Hola, mundo!',
  'Hallo, Welt!',
  'Ciao, mondo!'
];
```

Dans l'interface du composant `App`, ajouter une instance de `Message` pour chaque élément du tableau `messages`.

> _Indications_ :
> - en JSX, on utilise des accolades `{}` pour insérer des expressions TypeScript à évaluer dans le résultat.
> - on peut utiliser la méthode `map` sur un tableau pour transformer ses éléments en un autre type de données. Dans notre cas, on va vouloir transformer un tableau de chaînes de caractères en un tableau de composants `Message`.

Toutes les instances de `Message` ainsi créées sont "frères" dans l'arborescence des composants.
À chaque fois que ce cas de figure arrive (des éléments de même type partageant un parent commun dans la hiérarchie), React impose la déclaration d'une clé unique pour distinguer chacun de ces éléments.
Cette clé n'a pas besoin d'être unique globalement, mais doit l'être parmi ces éléments frères.

> Classiquement, on utilise un identifiant issu d'une base de données pour cela.
> Dans notre cas très simple, on va utiliser l'index de l'élément dans le tableau.

---

Toggle
===

- Écrire un composant `Toggle` qui stocke une valeur boolénne dans son `state` (=> `useState`) dont la valeur initiale vaut : `false`.
- Afficher la valeur courante sous la forme d'une chaîne valant "Toggle is ON" ou "Toggle is OFF" selon les cas.
- Ajouter une instance de ce composant dans l'application.
- Ajouter un bouton dans l'interface de ce composant dont le texte vaut "Turn ON" ou "Turn OFF" selon les cas.
- Au clic sur le bouton (`onClick`), modifier la valeur contenue dans le `state`. Pour cela, passer une fonction en paramètre à la fonction de modification de `state` : cette dernière est appelée avec la valeur actuelle du `state` et retourne la nouvelle valeur.
- Constater que l'interface est automatiquement réévaluée et le document mis à jour en conséquence.

---

Accès aux données d'un composant ?
===

Comment faire depuis l'extérieur d'un composant `Toggle` pour, par exemple, compter et afficher le nombre de fois que la valeur du `Toggle` est passée à `true` ?

> ***Les composants sont des fonctions appelées par React pour générer un "snapshot" de l'interface à un instant donné. Ils ne sont pas des objets sur lesquels on aurait une référence et dans lesquels on pourrait lire des valeurs à tout moment.***

- Passer au composant `Toggle` une `prop` de type `function` nommée par exemple `onToggle`. Cette fonction attend un booléen en paramètre et ne retourne rien.
- Déclarer le type des `props` du composant `Toggle` et l'utiliser pour typer les `props` du composant.

> _Indication_ : le type d'une fonction qui prend un booléen nommé `value` en paramètre et ne retourne rien se déclare de la manière suivante :
> ```ts
> (value: boolean) => void
> ```

- Dans le composant `Toggle`, faire en sorte d'appeler cette fonction avec la nouvelle valeur du booléen contenu en `state` à chaque fois que cette valeur a changé
  - soit manuellement au même endroit que le code qui modifie la valeur du `state` du `Toggle` (attention au fait que la variable qui contient la valeur du `state` contient la valeur avant modification, et pas la nouvelle valeur)
  - soit en déclarant un `useEffect`, déclenché lors d'un rendu pendant lequel la valeur du `state` du `Toggle` est différente de sa valeur précédente
- Dans le composant `App`, déclarer un élément de `state` dans lequel on stockera le nombre de fois que le `Toggle` est passé à `true`, et afficher la valeur de ce nombre dans l'interface.
- Écrire une fonction `toggleChanged`, qui attend en paramètre un booléen, et qui incrémente le nombre stocké en `state` uniquement si ce booléen vaut `true`.
- Passer cette fonction comme valeur pour la `prop` `onToggle` de l'instance de `Toggle`.

> ***Les données ne font toujours que descendre dans l'arborescence des composants. Afin de faire "remonter" des informations, on fait descendre une fonction. Le composant qui la reçoit peut alors l'appeler en passant des valeurs. Ces valeurs sont alors rendues accessibles dans le contexte du composant parent qui a fourni la fonction.***

---

Counter
===

- Écrire un composant `Counter` qui stocke une valeur entière dans son `state` de valeur initiale `0`.
- Écrire une fonction `add` et une fonction `sub` qui modifient la valeur contenue dans le `state` respectivement en l'incrémentant et en la décrémentant (on passe toujours une fonction à la fonction de modification de `state`).
- Afficher la valeur courante ainsi qu'un bouton permettant de l'incrémenter et un bouton permettant de le décrémenter.
- Au clic sur un de ces bouton, appeler la fonction correspondante afin de modifier la valeur stockée en `state`.
- Constater que l'interface est automatiquement réévaluée et le document mis à jour en conséquence.
- Ajouter des `props` à ce composant afin de lui passer de manière optionnelle une valeur initiale ainsi que des valeurs minimale et maximale à ne pas dépasser.

> _Indication_ : On peut donner une valeur par défaut à une variable issue du destructuring d'un objet en utilisant la syntaxe suivante :
> ```ts
> const { a = 0, b } = obj; // si a n'est pas défini dans obj, il vaudra 0
> ```

- Modifier le composant afin de tenir compte de ces `props` (restreindre la valeur initiale à l'intervalle `[min, max]`, et ne pas permettre de décrémenter la valeur en dessous de `min` ou d'incrémenter la valeur au-dessus de `max`).

---

Box
===

- Écrire un composant `Box` qui rend les éléments enfants (`children`) qu'il reçoit à l'intérieur d'une boîte (dessinée à l'aide de propriétés CSS).

> _Indication_ : On peut passer des propriétés CSS à un élément en utilisant la syntaxe suivante :
> ```ts
> const style = {
>   backgroundColor: 'red',
>   // ...
> };
> <div style={style}> ... </div>
> ```

> _Autre indication_ : le type de la propriété `children` est `ReactNode` (importé depuis le module `react`).

- Déclarer un composant `Box` dans l'interface, et y inclure d'autres composants (des morceaux de l'interface précédemment écrite par exemple).
- Constater que si l'on n'intègre pas explicitement les `children` dans le résultat de l'évaluation du composant, ces derniers ne font tout simplement pas partie du résultat (comme n'importe quel paramètre qui serait ignoré par une fonction).
- Faire en sorte que ce composant `Box` reçoive, de manière optionelle, la couleur et l'épaisseur de la boîte en entrée dans ses `props`.
- Juste parce qu'on peut le faire et pour voir ce que ça donne, au niveau du composant `App`, passer une valeur de `state` déjà existante, comme le nombre de fois où le `Toggle` est passé à vrai, en tant que valeur de l'épaisseur de la `Box`.

---

Clock
===

- Écrire un composant `Clock` qui affiche l'heure (hh:mm:ss) courante, et en ajouter une instance dans l'interface.
- Sans logique supplémentaire, ce composant ne fait qu'afficher l'heure au moment de son évaluation, sans la mettre à jour à chaque seconde.
- Constater que lorsqu'un composant "plus haut" dans la hiérarchie est réévalué (le composant `App` lors d'une modification de l'un de ses éléments de `state` par exemple), notre instance de `Clock` est réévaluée, et rafrachit donc l'heure affichée dans le document.

Pour pouvoir demander à React de réévaluer le composant, il faut commencer par stocker la date courante en `state`, et utiliser cette valeur dans le rendu du composant. Ainsi, à chaque fois que ce `state` sera modifié, React réévaluera l'interface retournée par notre composant.

Pour déclencher une modification de ce `state` à intervalle régulier, on peut utiliser le fonction standard `setInterval`.
La question à se poser est où mettre en place cet intervalle ?
On ne peut pas le faire directemenet dans le corps du composant, car ce dernier est évalué à chaque fois que quelque chose est modifié "au-dessus" de lui, et on ne veut pas mettre en place *plusieurs* intervalles.

La réponse est un `effect` !

- Déclarer un `effect` qui met en place l'exécution d'une fonction qui met à jour la date stockée en `state` toutes les 1000ms.
- Faire un `console.log` dans cet `effect` et constater la manière dont il est appelé.
- Faire en sorte que cet `effect` ne soit exécuté que lorsque le composant `Clock` intègre l'interface, et plus lors des réévaluations suivantes de cette instance de composant.
- Constater que les choses sont conformes à ce qui est attendu.

Ajouter une checkbox dans le composant `App` indiquant si oui ou non le composant `Clock` doit être rendu dans l'interface.

Que se passe-t-il au moment où la `Clock` quitte l'interface ?

Corriger le problème en renvoyant une fonction de "nettoyage" dans l'`effect` de mise en place de l'intervalle du composant `Clock`.
