import React from 'react';
import PinInput from "./PinInput.jsx";
import "./pin.scss"

const PinCreate = ({greeting, formRef, pinRef, userStore}) => {

    return (
        <div className="pin__container">
            <div className="pin__panel">
                <div className="pin__label">
                    <span className="pin__label-name">{userStore.user.firstName}</span>
                    <span className="pin__label-greet">{greeting}</span>
                </div>
                <form className="pin__main" ref={formRef}>
                    <PinInput onComplete={() => formRef.current?.requestSubmit()} pinRef={pinRef} reset={resetForm} setReset={setResetForm}/>
                </form>
                <div className="pin__forgot">
                    <a href="#moc">Не помню код</a>
                </div>
            </div>
        </div>
    );
};

export default PinCreate;