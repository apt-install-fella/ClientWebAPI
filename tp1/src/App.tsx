import { useState } from "react";

export function ItemsApp() {
  const [items, setItems] = useState<string[]>([]);

  function addItem(newItem: string) {
    setItems([...items, newItem]); //new items at the end of the array
  }

  function removeItem(index: number) {
    setItems(items.filter((item, i) => i != index));
  }

  return (
    <div>
      <AddItemForm addItem={addItem} />
      <ItemsList items={items} removeItem={removeItem} />
    </div>
  );
}

type ItemsListProps = {
  items: string[];
  removeItem: (index: number) => void;
};

export function ItemsList({ items, removeItem }: ItemsListProps) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {item}
          <button className="small danger" onClick={() => removeItem(index)}>
            Supprimer
          </button>
        </li>
      ))}
    </ul>
  );
}

type AddItemFormProps = {
  addItem: (item: string) => void;
};

function AddItemForm({ addItem }: AddItemFormProps) {
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = function (event) {
    //Tu crées une fonction handleSubmit-> appeler a chaque envoie du form
    event.preventDefault();
    //Empêche le comportement normal du formulaire->pas de rechargement de la page
    const form = event.currentTarget; //le form html
    addItem(form.item.value); //recup text tapé et donne a addItem
    form.reset(); //vide form
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="item" type="text" />
      {/* Tu affiches un formulaire onSubmit= {handleSubmit} → quand on envoie →
      appelle la fonction */}
      <button type="submit">Ajouter</button>
    </form>
  );
}

export default function App() {
  return (
    <div>
      <ItemsApp />
    </div>
  );
}
