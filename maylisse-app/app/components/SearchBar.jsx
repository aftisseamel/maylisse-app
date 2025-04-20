"use client";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = () => {
    const articles = ["moule_bleu", "moule_rouge", "papier_spécial5","papier_spécial4","papier_spécial3"];

    const [activeSearch, setActiveSearch] = useState([]);
    const handleSearch = (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query === "") {
            setActiveSearch([]);
            return;
        }
        setActiveSearch(
            articles.filter((article) => article.toLowerCase().includes(query)).slice(0, 8)
        );
    };

    return (
        <form className="w-[500px] relative">
            <div className="relative">
                <input
                    type="search"
                    placeholder="Type here"
                    className="w-full p-2 rounded-full bg-white"
                    onChange={handleSearch}
                />
                <button
                    type="button"
                    className="absolute right-0 top-0 bottom-0 bg-black text-white rounded-full px-3 py-2"
                >
                    <AiOutlineSearch />
                </button>
            </div>

            {activeSearch.length > 0 && (
                <div className="absolute top-20 p-4 bg-slate-700 text-white w-fit rounded-xl left-15 -translate-x-1/2 flex flex-col gap-2">
                    {activeSearch.map((article, index) => (
                        <span key={index}>{article}</span>
                    ))}
                </div>
            )}
        </form>
    );
};

export default SearchBar;