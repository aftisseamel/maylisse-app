'use client'
import { useEffect, useState } from "react";

export default function Page() {

    const [inputUser, setInputUser] = useState("");
    const [inputUserValidate, setInputUserValidate] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => 
        {
        setInputUser(e.target.value);
    }

    const handleSubmit = () => {
        setInputUserValidate(inputUser);
    }
    return (
        <div>
            <textarea onChange={handleInputChange}></textarea>

            <button onClick={handleSubmit}>valider</button>

            <h1> voici les articles : </h1>
            voici ce que le user a introduit : {inputUserValidate}

        </div>
    );
}
