import React, {useState} from 'react';
import "./initLoader.scss"
import GooLoader from "../../utils/spinners/GooLoader.jsx";

const InitLoader = ({hide}) => {
    return (
        <div className={`loader${hide ? " hide" : ""}`}>
            <GooLoader scale={1}/>
        </div>
    );
};

export default InitLoader;