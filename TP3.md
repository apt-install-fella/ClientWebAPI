# Liste de courses

On souhaite étendre la gestion de liste d'items pour gérer une liste de courses.

Mise en place
---

Initialiser un nouveau dossier `tp3` avec `vite`, comme dans le TP précédent.
Puis à nouveau :
- Écraser le contenu du fichier `src/index.css` par le contenu du fichier du même nom situé dans le dossier `ressources`.
- Supprimer le fichier `src/App.css`.
- Reprendre le fichier `src/App.tsx` du TP précédent.

Composant `GroceryApp` (anciennement `ItemsApp`)
---

Chaque item de la liste n'est plus simplement une chaîne de caractères, mais un objet avec les propriétés suivantes :
 - `id`
 - `name`
 - `cost`
 - `quantity`

> Déclarer le type de cet objet `GroceryItem`.

La fonction `addItem` ne reçoit toujours en entrée que le nom de l'item à ajouter. Quand on ajoute un item, son coût et sa quantité sont initialisés à 1.

Pour l'identifiant (`id`), le composant principal (`GroceryApp`) maintient un nouveau `state` nommé `nextId`, dont la valeur initiale est 1. La valeur courante de ce nombre est utilisé en tant qu'`id` lors de l'ajout d'un item. Sa valeur est incrémentée après chaque ajout.

La fonction `removeItem` ne reçoit plus en entrée l'index dans le tableau de l'élément à supprimer, mais son `id`.

Écrire une nouvelle fonction `updateItem`, qui reçoit en entrée l'`id` de l'élément à modifier, ainsi qu'un objet `changes` qui contient une ou plusieurs des propriétés d'un item avec leurs nouvelles valeurs.

> Définir le type de l'objet `changes`.
> Ce dernier contient toutes les propriétés de l'objet `GroceryItem` sauf `id` (qu'on ne souhaite pas pouvoir modifier). Toutes ces propriétés sont optionnelles.
> 
> On peut utiliser des utilitaires de manipulation de types fournis par TypeScript pour générer ce type. Notamment :
> - `Omit<Type, Keys>` : permet de générer un type qui contient toutes les propriétés de `Type` sauf celles listées dans `Keys` : https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys
> - `Partial<Type>` : permet de générer un type qui contient toutes les propriétés de `Type` mais qui les rend optionnelles : https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype

La fonction `updateItem` remplace le tableau `items` par un nouveau tableau de même taille (on pourra utiliser la fonction standard `map`) contenant tous les anciens items; l'item dont l'identifiant correspond à l'`id` reçu est remplacé par un nouvel objet fabriqué en combinant toutes les propriétés de l'ancien item avec celles contenues dans l'objet `changes`. En cas de redéfinition d'une propriété, c'est la valeur contenue dans l'objet `changes` qui doit être conservée.

> On utilisera ici le `spread operator` pour combiner les propriétés de l'ancien item avec celles de l'objet `changes` : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals

Composant `ItemsList`
---

En plus du tableau d'`items` et de la fonction `removeItem`, ce composant reçoit maintenant également en `props` la fonction `updateItem`.

> Écrire le type des `props` attendues par le composant `ItemsList`.

On utilise désormais l'`id` de chaque item comme valeur pour la propriété `key` des `<li>` qui constituent la liste d'items.

La gestion de l'affichage de chaque item est déléguée à un nouveau composant `Item` décrit ci-après.

Nouveau composant `Item`
---

Ce composant attend les `props` suivantes :
- `item` : l'objet qui décrit l'item.
- `updateItem` : une fonction qui attend un objet `changes` en entrée et qui déclenche la mise à jour de l'item correspondant.

> Écrire le type des `props` attendues par le composant `Item`.

Il affiche les données de l'item sous la forme d'un formulaire qui contient :
- pour chaque propriété : un `<label>` (qui indique le nom de la propriété) et un `<input>` (type `"text"` pour le texte et type `"number"` pour les valeurs numériques). Chaque `<input>` a une propriété `name` qui permettra d'en récupérer facilement la valeur à la soumission du formulaire. On affecte la valeur initiale de chaque `<input>` (propriété  `defaultValue`) avec la valeur de la propriété correspondante de l'item.
- un bouton de soumission. Les classes CSS `"small"` et `"action"` peuvent être affectées à ce bouton.

À la soumission du formulaire (événement `onSubmit`), on appelle une fonction qui annule le comportement standard du navigateur lors de la soumission d'un formulaire (`preventDefault`) puis appelle `updateItem` avec un objet dont les valeurs sont issues du formulaire.

> _Indications_ :
> - les valeurs contenues dans les différents `<input>` nommés du formulaire soumis peuvent être récupérés dans l'objet `event.currentTarget` (qui pointe vers le formulaire). Cet objet contient une propriété pour chaque élément nommé du formulaire, et on peut accéder à la valeur de chaque élément grâce à sa propriété `value`.
> - il faut éviter de nommer un `<input>` avec un nom qui est déjà une propriété de l'objet `event.currentTarget` (comme `name` par exemple) car cela écraserait la propriété de l'objet.

Afin d'indiquer clairement à l'utilisateur quand il doit valider les modifications faites en soumettant le formulaire, le composant stocke un booléen `shouldUpdate` dans son `state`, dont la valeur initiale est `false`. 

En plus de l'événement `onSubmit`, le formulaire peut réagir à l'événement `onChange`. Ce dernier est déclenché quand l'*un* de ses éléments est modifié.  Ici, on ne cherche pas à savoir ce qui a été modifié, mais juste que quelque chose a été modifié. Ainsi, dans la fonction associée à l'événement `onChange` du formulaire, on va simplement passer le booléen `shouldUpdate` à `true`. Ce booléen sera remis à `false` à chaque soumission du formulaire.

Afin de refléter l'état de ce booléen dans l'interface, on va désactiver le bouton de soumission du formulaire tant que le booléen `shouldUpdate` vaut `false`. Pour cela, utiliser la propriété `disabled` sur ce bouton.

Coût total
---

Le composant principal (`GroceryApp`) calcule et affiche le coût total de l'ensemble des éléments de la liste (toujours à jour) en-dessous de la liste.

Constater que le coût total affiché est bien à jour après la validation de la modification du coût ou de la quantité d'un élément de la liste.

(Option) Persistance des données en local
---

L'API `localStorage` exposée par les navigateurs permet de stocker des données (des couples clé / valeur sous forme de texte) associées à un domaine. L'interface de programmation est la suivante :
 - `localStorage.getItem(key)` : retourne la valeur associée à la clé `key`, ou `null` si la clé ne correspond à aucune entrée.
 - `localStorage.setItem(key, value)` : stocke la valeur `value` associée à la clé `key`.

 Utiliser cette API afin de persister les données du composant `GroceryApp` dans le navigateur. Au chargement du composant, les données seront chargées si elles existent. À chaque modification des données, elles seront sauvegardées.

 _Indications_ :
 - le hook `useState` peut recevoir une fonction en paramètre plutôt qu'une valeur initiale. Cette fonction doit retourner la valeur utilisée en tant que valeur initiale. Elle est exécutée par `react` uniquement lors de l'arrivée du composant dans l'interface.
 - le hook `useEffect` permet de déclencher l'exécution d'une fonction après un rendu quand une valeur a changé par rapport au rendu précédent.
 - les fonctions `JSON.stringify(obj)` et `JSON.parse(string)` permettent respectivement de transformer un objet Javascript en chaîne de caractère au format JSON et de transformer une chaîne de caractère au format JSON en objet Javascript.

 La dernière étape est de sortir la logique de sauvegarde du composant et d'écrire un `"custom hook"` générique qui offre cette fonctionnalité.
