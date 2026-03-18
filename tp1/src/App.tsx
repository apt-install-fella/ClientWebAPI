import { useState, useEffect } from "react";

type MessageProps = {
  msg: string;
};

function Message({ msg }: MessageProps) {
  return <p>{msg}</p>;
}

type ToggleProps = {
  onToggle?: (value: boolean) => void;
};

function Toggle({ onToggle }: ToggleProps) {
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    onToggle?.(toggle);
  }, [toggle]);

  return (
    <div>
      <h2>toggle is {toggle ? "ON" : "OFF"}</h2>
      <button type="button" onClick={() => setToggle(!toggle)}>
        change
      </button>
    </div>
  );
}

let messages = [
  "Hello, world!",
  "Bonjour, monde!",
  "Hola, mundo!",
  "Hallo, Welt!",
  "Ciao, mondo!",
];

export default function App() {
  const [countTrue, setCountTrue] = useState(0);

  const toggleChanged = (value: boolean) => {
    if (value) setCountTrue((prev) => prev + 1); // increm que si TRUE
  };

  return (
    <div>
      <Message msg="Fella" />
      <Message msg="fella" />
      <Message msg="FELLA" />

      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>

      {/* Afficher le compteur */}
      <p>Le Toggle est passé à true {countTrue} fois</p>

      {/**appel de toggle avec la fct */}
      <Toggle onToggle={toggleChanged} />
    </div>
  );
}
