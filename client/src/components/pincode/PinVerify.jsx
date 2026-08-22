import {useState} from 'react';
import PinInput from "./PinInput.jsx";
import "./pin.scss"
import PinAttention from "./PinAttention.jsx";

const PinVerify = ({greeting, formRef, pinRef, userStore, resetForm, setResetForm}) => {
    const [attemptsLeft, setAttemptsLeft] = useState(0);
    const [blockState, setBlockState] = useState(false);

    const submitHandler = async (ev) => {
        ev.preventDefault()
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
                        ? "Ввод PIN-кода временно заблокирован" // Пока делай компонент для создания пинкода и как сделаешь, прикручивай действительно ответ сервера
                        : attemptsLeft > 0 ? `Введён неверный PIN-код. У вас осталось ${attemptsLeft} попыток` : ""}
                </PinAttention>
                <form className="pin__main" ref={formRef} onSubmit={submitHandler}>
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