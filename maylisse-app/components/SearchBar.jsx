import React from "react";

import {AiOutlineSearch} from 'react-icons/ai';

const SearchBar = () => {

    return (
        <form className = 'w-[500px] relative'> 
            <div className="relative">
                <input type="search" placeholder='Type here' className="w-full p-2 rounded-full bg-white"/>
                <button className="absolute right-0 top-0 bottom-0 bg-black text-white rounded-full px-3 py-2">
                    <AiOutlineSearch/>
                </button> 
            </div>
        </form>
    )
}
export default SearchBar;