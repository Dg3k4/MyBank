import {useEffect, useState} from 'react';
import PinInput from "./PinInput.jsx";
import "./pin.scss"

const PinVerify = ({greeting, formRef, pinRef, userStore, resetForm, setResetForm}) => {
    const [attemptsLeft, setAttemptsLeft] = useState(0);
    const [blockState, setBlockState] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            await userStore.pinVerify({pinCode: pinRef.current})
        } catch (e) {
            setResetForm(prev => prev + 1)
            const error = e.data?.errors?.[0]
            if (error?.code === "PIN_BLOCKED") {
                setBlockState(true)
            }
            setAttemptsLeft(error?.attemptsLeft)
        }
        console.log(userStore.user.firstName)
    }

    const temp = () => {
        if (!blockState) {
            setAttemptsLeft(prev => prev + 1)
        }
        if (attemptsLeft >= 5) {
            setBlockState(true)
        }
    }

    return (
        <div className="pin__container">
            <div className="pin__panel">
                <div className="pin__label">
                    <span className="pin__label-name">{userStore.user.firstName}</span>
                    <span className="pin__label-greet">{greeting}</span>
                </div>
                <div className={`pin__attention${attemptsLeft > 0 || blockState ? "" : " hidden"}`}>
                    <div className="pin__attention-pop">
                        {blockState || attemptsLeft === 0 ? "Ввод PIN-кода временно заблокирован" : attemptsLeft > 0 ? `Введён неверный PIN-код. У вас осталось ${5 - attemptsLeft} попыток` : ""}
                    </div>
                </div>
                <form className="pin__main" ref={formRef} onSubmit={submitHandler}>
                    <PinInput onComplete={() => formRef.current?.requestSubmit()} pinRef={pinRef} reset={resetForm} setReset={setResetForm}/>
                </form>
                <div className="pin__forgot">
                    <a href="#moc" onClick={temp}>Не помню код</a>
                </div>
            </div>
        </div>
    );
};

export default PinVerify;