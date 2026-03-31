let count = 0;

let counter = document.getElementById("counter");

//creer les elem
let p = document.createElement("p"); //paragraphe
let btnPlus = document.createElement("button");
let btnMoins = document.createElement("button");

btnPlus.textContent = "+";
btnMoins.textContent = "-";

function update() {
  p.textContent = "Valeur du compteur : " + count;
} //fct qui changera l'affichage au moment ou on l'appel

// appel de base
update();

// ajout les elem
counter.appendChild(p);
counter.appendChild(btnMoins);
counter.appendChild(btnPlus);

btnPlus.addEventListener("click", function () {
  count++;
  update();
});

btnMoins.addEventListener("click", function () {
  count--;
  update();
});
