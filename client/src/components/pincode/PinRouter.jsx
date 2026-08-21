import React, {useContext, useRef, useState} from 'react';
import PinVerify from "./PinVerify.jsx";
import "./pin.scss"
import PinCreate from "./PinCreate.jsx";
import {Context} from "../../context.js";

const PinRouter = () => {
    const [resetForm, setResetForm] = useState(0)
    const formRef = useRef(null)
    const pinRef = useRef("")
    const {userStore} = useContext(Context)

    const create = false

    const hourNow = new Date().getHours()
    const greeting = hourNow < 6 ? "Добрый вечер" : hourNow < 12 ? "Доброе утро" : hourNow < 18 ?"Добрый день" : "Добрый вечер"

    return (
        <div className="pin">
            {create
                ? <PinCreate/>
                : <PinVerify pinRef={pinRef} formRef={formRef} greeting={greeting}
                             userStore={userStore} resetForm={resetForm} setResetForm={setResetForm}/>
            }
            <div className="pin__footer">
                <span>© 2026 MyBank. Не является реальным банком.</span>
                <div>
                    <span> Made with ❤ by </span>
                    <a href="https://github.com/Dg3k4" target="_blank" rel="noopener noreferrer">Dg3k4</a>
                </div>
            </div>
        </div>
    );
};

export default PinRouter;