import React, {useRef, useState} from 'react';
import PinInput from "./PinInput.jsx";
import "./pin.scss"
import PinAttention from "./PinAttention.jsx";

const PinCreate = ({greeting, formRef, pinRef, userStore, resetForm, setResetForm}) => {
    const [step, setStep] = useState("FIRST_PIN")
    const [nonFailure, setNonFailure] = useState(true)
    const firstPinRef = useRef("");

    const createPinMessage = () => {
        switch (step) {
            case "RE_FIRST_PIN":
                return "PIN-коды не совпадают. Попробуйте снова"
            case "COMPARE_PIN":
                return "Теперь повторите PIN-код ещё раз"
            case "SERVER_ERROR":
                return "При обработке запроса произошла ошибка. Перезагрузите страницу и попробуйте снова, либо попробуйте позже"
            default:
                return "Создайте личный PIN-код для входа. Просто введите его ниже"
        }
    }
    const attentionMessage = createPinMessage()

    const submitHandler = async (ev) => {
        ev.preventDefault()
        if (step === "FIRST_PIN" || step === "RE_FIRST_PIN") {
            firstPinRef.current = pinRef.current
            setStep("COMPARE_PIN")
            setTimeout(() => {
                setNonFailure(false)
            }, 250)
            setNonFailure(false)
            setResetForm(prev => prev + 1)
            return;
        }
        if (step === "COMPARE_PIN") {
            if (firstPinRef.current !== pinRef.current) {
                firstPinRef.current = ""
                setStep("RE_FIRST_PIN")
                setResetForm(prev => prev + 1)
                return;
            }
            try {
                console.log(pinRef)
                await userStore.pinCreate({pinCode: pinRef.current})
            } catch (e) {
                setStep("SERVER_ERROR")
            }
        }
    }

    return (
        <div className="pin__container">
            <div className="pin__panel">
                <div className="pin__label">
                    <span className="pin__label-name">{userStore.user.firstName}</span>
                    <span className="pin__label-greet">{greeting}</span>
                </div>
                <PinAttention show={true} animationKey={step}>
                    {attentionMessage}
                </PinAttention>
                <form className="pin__main" ref={formRef} onSubmit={submitHandler}>
                    <PinInput onComplete={() => formRef.current?.requestSubmit()} pinRef={pinRef} reset={resetForm} nonFailure={nonFailure}/>
                </form>
                <div className="pin__forgot">
                    <a href="#moc">Не помню код</a>
                </div>
            </div>
        </div>
    );
};

export default PinCreate;