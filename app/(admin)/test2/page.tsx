"use client"
import { useEffect, useState } from "react";
import data_articles from "../../data_articles";

export default function Page() {
  const [message, setMessage] = useState("Chargement...");
  const [tableau, setTableau] = useState<number[]>([]);
  const [number, setNumber] = useState(0);
  const [text, setText] = useState("");
  

  const handleReset = () => {
    setNumber(0);
  }

  const handleResetTableau = () => {
    setTableau([]);
  }

  const handleIncrement = () => {
    const newNumber = number + Number(text) * 20000;
    setNumber(newNumber);
    if (newNumber > 2000) {
      setMessage("STOCK indisponible");
    }
    setTableau([...tableau, newNumber]);
  }

  const handleDecrement = () => {
    const newNumber = number + (-Number(text) * 20000);
    setNumber(newNumber);
    if (newNumber < 0) {
      setMessage("problème");
    }
    setTableau([...tableau, newNumber]);
  }

  return (
    <div>
      <h1>{message} et le nombre : {number}</h1>

      <input type="text" value={text} onChange={(e) => 
        setText(e.target.value)} placeholder="Entrez une valeur"/> <p></p>

      <button onClick={handleReset}>RESET</button> <p></p>

      <button onClick={handleIncrement}>➕</button><p></p>
      
      <button onClick={handleDecrement}>➖</button>

      <button onClick={handleResetTableau}>RESET TABLEAU</button>
      
      <ul>
        {tableau.map((item, index) => (
          <li key={index}>Valeur {index + 1}: {item}</li>
        ))}
      </ul>
    </div>
  );
}
