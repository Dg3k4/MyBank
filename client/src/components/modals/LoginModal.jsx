import React, {useEffect, useContext, useRef} from 'react'
import {createPortal} from 'react-dom'
import {NavLink, useNavigate} from 'react-router-dom'
import "./loginModal.scss"
import CrossIcon from "../../utils/icons/CrossIcon.jsx"
import MyInput from "../inputs/MyInput.jsx"
import MyButton from "../buttons/MyButton.jsx"
import LogoIcon from "../../utils/icons/LogoIcon.jsx"
import {REGISTRATION_ROUTE} from "../../utils/consts.js"
import {Context} from "../../context.js"

const LoginModal = ({close}) => {
    const emailRef = useRef("")
    const passwordRef = useRef("")
    const {userStore} = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        document.body.classList.toggle("modal-open")
        return () => {
            document.body.classList.remove("modal-open")
        }
    }, [])

    const loginHandler = async (event) => {
        event.preventDefault()
        try {
            await userStore.login({email: emailRef.current, password: passwordRef.current})
            close()

            navigate("/pin")
        } catch (e) {
            console.log(e)
        }
    }

    return createPortal(
        <div className="auth">
            <div className="auth__modal">
                <button className="auth__modal__close" onClick={close}>
                    <CrossIcon/>
                </button>
                <div className="auth__modal__content">
                    <div className="auth__modal__content__label">
                        <span>Вход в </span>
                        <LogoIcon/>
                        <span className="logo">MyBank</span>
                    </div>
                    <form className="auth__modal__content__form">
                        <MyInput onChange={e => emailRef.current = e.target.value} type="email" idName="email" label="Введите email" required={true}/>
                        <MyInput onChange={e => passwordRef.current = e.target.value} type="password" idName="password" label="Введите пароль" required={true}/>
                        <MyButton onClickFunction={loginHandler} buttonContent="Подтвердить" type="submit"/>
                    </form>
                </div>
                <div className="auth__modal__content__no-acc">
                    <span>Отсутствует аккаунт? </span>
                    <NavLink onClick={close} to={REGISTRATION_ROUTE} className="create-acc">Создайте его здесь.</NavLink>
                </div>
            </div>
        </div>,
        document.body
    );
};


export default LoginModal;