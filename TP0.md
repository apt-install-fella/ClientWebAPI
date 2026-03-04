Sujet 0
=======

Dans ce permier sujet, on va mettre en oeuvre une petite page HTML qui affiche un compteur qui peut être incrémenté ou décrémenté à l'aide de boutons.

L'objectif est de réaliser cela simplement en Javascript avec l'API standard du navigateur, sans utiliser de bibliothèque ou de framework.

Mise en place
---

- Créer un nouveau dossier `tp0` et y créer un fichier `index.html` contenant la structure de base d'une page HTML.
- Ajouter un élément `<script>` à la fin du `body` qui importe un fichier `main.js` que vous allez créer également.
- Ouvrir ce fichier dans un browser.

Un compteur
---

- Dans le fichier `index.html` :
  - ajouter un élément `<div id="counter"></div>` vide.

- Dans le fichier `main.js` :
  - déclarer une variable `count` initialisée à `0`
  - récupérer l'élément d'id `counter`
  - y insérer un paragraphe qui indique la valeur courante du compteur, ainsi que deux boutons "-" et "+" permettant respectivement d'incrémenter et de décrémenter ce compteur
  - attacher des gestionnaires d'événements `click` à ces boutons pour mettre à jour la valeur du compteur et le texte affiché à l'écran en conséquence.

> Est-il possible de créer plusieurs compteurs indépendants sur la même page avec ce code ?
> Est-ce facile ?

> Peut-on encapsuler la logique de création d'un compteur dans une fonction que l'on peut appeler plusieurs fois pour créer plusieurs compteurs indépendants ?
