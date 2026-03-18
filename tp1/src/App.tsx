import { useState } from "react";

type GroceryItem = {
  id: number;
  name: string;
  cost: number;
  quantity: number;
};

type Changes = {
  name: string;
  cost: number;
  quantity: number;
};

type ChangesPreview = Omit<Changes, "name" | "cost" | "quantity">;

export function GroceryApp() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [nextId, setNextId] = useState(1);

  function addItem(nom: string) {
    const newItem: GroceryItem = {
      id: nextId,
      name: nom,
      cost: 1,
      quantity: 1,
    };
    setItems([...items, newItem]); //new items at the end of the array
    setNextId(nextId + 1);
  }

  function removeItem(id: number) {
    setItems(items.filter((item) => item.id != id));
  }

  function updateItem(id: number, changes: Changes) {
    setItems(
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }
        return { ...item, ...changes };
      }),
    );
  }

  return (
    <div>
      <div>
        <AddItemForm addItem={addItem} />
        <ItemsList
          items={items}
          removeItem={removeItem}
          updateItem={updateItem}
        />
        <p>
          Coût total :{" "}
          {items.reduce((total, item) => total + item.cost * item.quantity, 0)}
        </p>
      </div>
    </div>
  );
}

type ItemsListProps = {
  items: GroceryItem[];
  removeItem: (id: number) => void;
  updateItem: (id: number, changes: Changes) => void;
};

export function ItemsList({ items, removeItem, updateItem }: ItemsListProps) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <UpdateItem
            item={item}
            updateItem={(changes) => updateItem(item.id, changes)}
          />
          <button className="small danger" onClick={() => removeItem(item.id)}>
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
      <GroceryApp />
    </div>
  );
}

type ItemProps = {
  item: GroceryItem;
  updateItem: (changes: Changes) => void;
};

function UpdateItem({ item, updateItem }: ItemProps) {
  const [shouldUpdate, setShouldUpdate] = useState(false); //prop uniquement pour modif

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = function (event) {
    event.preventDefault();
    const form = event.currentTarget;
    updateItem({
      name: form.nom.value,
      cost: Number(form.prix.value),
      quantity: Number(form.qtt.value),
    });
    setShouldUpdate(false);
  };

  return (
    <form onSubmit={handleSubmit} onChange={() => setShouldUpdate(true)}>
      <label>name</label>
      <input name="nom" type="text" defaultValue={item.name} />

      <label>cost</label>
      <input name="prix" type="number" defaultValue={item.cost} />

      <label>quantity</label>
      <input name="qtt" type="number" defaultValue={item.quantity} />

      <button type="submit" disabled={!shouldUpdate}>
        Modifier
      </button>
    </form>
  );
}
