import React, {useContext, useRef, useState} from 'react';
import PinInput from "./PinInput.jsx";
import "./pin.scss"
import AuthService from "../../services/AuthService.js";
import {Context} from "../../context.js";

const PinVerify = () => {
    const [resetForm, setResetForm] = useState(0)
    const formRef = useRef(null)
    const pinRef = useRef("")
    const {userStore} = useContext(Context)

    const hourNow = new Date().getHours()
    const greeting = hourNow < 6 ? "Добрый вечер" : hourNow < 12 ? "Доброе утро" : hourNow < 18 ?"Добрый день" : "Добрый вечер"

    const submitHandler = async (e) => {
        e.preventDefault()
        const response = await AuthService.pinVerify({pinCode: pinRef})
        if (!response) {
            setResetForm(prev => prev + 1)
            console.log(resetForm)
        }
        console.log(userStore.user.firstName)
    }

    return (
        <div className="pin">
            <div className="pin__container">
                <div className="pin__panel">
                    <div className="pin__label">
                        <span className="pin__label-name">{userStore.user.firstName}</span>
                        <span className="pin__label-greet">{greeting}</span>
                    </div>
                    <form className="pin__main" ref={formRef} onSubmit={submitHandler}>
                        <PinInput onComplete={() => formRef.current?.requestSubmit()} pinRef={pinRef} reset={resetForm} setReset={setResetForm}/>
                    </form>
                    <div className="pin__forgot">
                        <a href="#moc">Не помню код</a>
                    </div>
                </div>

            </div>
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

export default PinVerify;