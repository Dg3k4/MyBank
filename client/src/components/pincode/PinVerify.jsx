import {useState} from 'react';
import PinInput from "./PinInput.jsx";
import "./pin.scss"
import PinAttention from "./PinAttention.jsx";
import {useNavigate} from "react-router-dom";

const PinVerify = ({greeting, formRef, pinRef, userStore, resetForm, setResetForm}) => {
    const [attemptsLeft, setAttemptsLeft] = useState(0);
    const [blockState, setBlockState] = useState(false);
    const [isChecking, setIsChecking] = useState(false)
    const navigate = useNavigate();

    const triesMessage = attemptsLeft === 5 ? "попыток" : attemptsLeft !== 1 ? "попытки" : "попытка"

    const submitHandler = async (ev) => {
        ev.preventDefault()
        if (isChecking) {return;}
        document.activeElement.blur()
        setIsChecking(true)
        try {
            await userStore.pinVerify({pinCode: pinRef.current})
            navigate("/dashboard")
        } catch (e) {
            setResetForm(prev => prev + 1)
            const error = e.data?.errors?.[0]
            if (error?.code === "PIN_BLOCKED") {
                setBlockState(true)
            }
            setAttemptsLeft(error?.attemptsLeft)
        } finally {
            setIsChecking(false)
        }
    }

    return (
        <div className="pin__container">
            <div className="pin__panel">
                <div className="pin__label">
                    <span className="pin__label-name">{userStore.user.firstName}</span>
                    <span className="pin__label-greet">{greeting}</span>
                </div>
                <PinAttention show={attemptsLeft > 0 || blockState} animationKey={`${attemptsLeft}`}>
                    {blockState || attemptsLeft === 0
                        ? "Ввод PIN-кода временно заблокирован"
                        : attemptsLeft > 0 ? `Введён неверный PIN-код. У вас осталось ${attemptsLeft} ${triesMessage}` : ""}
                </PinAttention>
                <form className={`pin__main${isChecking ? " checking" : ""}`} ref={formRef} onSubmit={submitHandler}>
                    <PinInput onComplete={() => formRef.current?.requestSubmit()} pinRef={pinRef} reset={resetForm}/>
                </form>
                <div className="pin__forgot">
                    <a href="#moc">Не помню код</a>
                </div>
            </div>
        </div>
    );
};

export default PinVerify;