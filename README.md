# W42 - Programmation web côté client

Bienvenue dans ce module de programmation web côté client :-)

Vous trouverez dans ce dépôt les ressources nécessaires pour la réalisation des TP.

## Tuto Git

En premier lieu, faites un **fork** de ce dépôt de sorte à en avoir une copie à vous dans laquelle vous pourrez ajouter vos réalisations.
Une fois ce **fork** réalisé, changez son niveau de visibilité en "Privé" puis partagez-le avec votre enseignant en allant dans la section "Members" de votre dépôt et en l'ajoutant en tant que "Reporter".

---

Vous pouvez maintenant **cloner** votre dépôt sur votre machine de travail afin de disposer d'un espace de travail local.
Pour pouvoir interagir avec le serveur Gitlab depuis votre machine de travail, il faut ajouter la clé ssh de votre machine à votre profil utilisateur.
Toutes les informations nécessaires se trouvent dans la section "SSH keys" de votre profil.

Une fois cela fait, vous pouvez **cloner** votre dépôt :
```sh
git clone git@git.unistra.fr:[votre login]/w42.git
```
Vous vous retrouvez alors devant un dossier w42 qui contient une copie locale de votre dépôt.

---

De nouvelles ressources seront ajoutés au fur et à mesure par les enseignants sur le dépôt de référence depuis lequel vous avez forké votre dépôt.
De manière à pouvoir les récupérer, vous pouvez ajouter une nouvelle remote à la configuration de votre dépôt local :
```sh
git remote add upstream git@git.unistra.fr:w412/w42.git
```
*upstream* est le nom que l'on choisit ici de donner à cette nouvelle **remote** (on aurait pu choisir un autre nom).
C'est en général comme cela que l'on appelle le dépôt de référence depuis lequel on a forké son dépôt.
Vous pouvez constater qu'il a bien été ajouté en exécutant cette commande (qui liste les remotes connues) :
```sh
git remote -v
```
Pour récupérer les commits ajoutés par vos enseignants sur le dépôt de référence, vous pouvez dorénavant faire :
```sh
git pull upstream main
```
*main* est ici le nom de la **branche** dans laquelle vous travaillez, mais cela, c'est une autre histoire dont on n'a pas forcément besoin pour le moment..
