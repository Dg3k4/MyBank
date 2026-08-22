import React, {useEffect, useRef, useState} from 'react';

const PinInput = ({onComplete, pinRef, reset, nonFailure}) => {
    const [failure, setFailure] = useState(false);
    const inputsRef = useRef([]);

    const changeHandler = (e, i) => {
        const value = e.target.value.replace(/\D/g, "")
        console.log(e.target.value)
        pinRef.current = inputsRef.current.reduce((acc, p) => acc + p?.value, "")
        if (!value) return null
        e.target.value = value.at(-1)
        if (i !== 5) {
            inputsRef.current[i + 1]?.focus();
        }
        if (i === 5) {
            onComplete()
        }
    }
    const keyDownHandler = (e, i) => {
        if (e.key === "Backspace" && !e.currentTarget.value && i > 0) {
            inputsRef.current[i - 1]?.focus()
        }
    }

    const focusHandler = () => {
        const focusOrder = inputsRef.current.map(i => Boolean(i?.value)).filter(i => i === true).length
        if (focusOrder === 0) {
            inputsRef.current[0].focus()
        } else {
            inputsRef.current[focusOrder].focus()
        }
        console.log(focusOrder)
    }

    useEffect(() => {
        if (!nonFailure) {
            setFailure(true)
        }
        setTimeout(() => {
            setFailure(false)
            inputsRef.current.forEach(i => i.value = "")
            inputsRef.current[0]?.focus()
        }, !nonFailure ? 250 : 0)
    }, [reset])

    return (
        <div className="pin-input" onClick={focusHandler}>
            {Array.from({length: 6}).map((a, i) => (
                <input key={i} maxLength={1} inputMode="numeric" type="password"
                       ref={el => {inputsRef.current[i] = el}}
                       onChange={el => changeHandler(el, i)}
                       onKeyDown={el => keyDownHandler(el, i)}
                       className={`pin-input__field${failure ? " fail" : ""}`}
                />
            ))}
        </div>
    );
};

export default PinInput;