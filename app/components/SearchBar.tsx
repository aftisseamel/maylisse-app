"use client";

import { Tables } from "@/database.types";
import React, { ChangeEvent, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar =  ({articles}:{articles : Tables<"article"> []}) => {


    const [activeSearch, setActiveSearch] = useState<Tables<"article"> []>([]);
    const handleSearch = (e : ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.trim().toLowerCase();
        if (query === "") {
            setActiveSearch([]);
            return;
        }
        setActiveSearch(
            articles.filter((article) => article.name.toLowerCase().includes(query)).slice(0, 8)
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
                <div className="absolute top-20 p-4 bg-slate-700 text-white w-fit rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2">
                    {activeSearch.map((article, index) => (
                        <div key={index} className="flex flex-col gap-2"> 
                        <span >{article.name} QUANTITY {article.quantity}</span>
                        <span >{}</span>
                        </div>
                    ))}
                </div>
            )}
        </form>
    );
};

export default SearchBar;