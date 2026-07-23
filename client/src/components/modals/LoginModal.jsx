import React, {useEffect} from 'react';
import {createPortal} from 'react-dom';
import {NavLink} from 'react-router-dom';
import "./loginModal.scss"
import CrossIcon from "../../utils/icons/CrossIcon.jsx";
import MyInput from "../inputs/MyInput.jsx";
import MyButton from "../buttons/MyButton.jsx";
import LogoIcon from "../../utils/icons/LogoIcon.jsx";
import {REGISTRATION_ROUTE} from "../../utils/consts.js";

const LoginModal = ({close}) => {
    useEffect(() => {
        document.body.classList.toggle("modal-open")
        return () => {
            document.body.classList.remove("modal-open")
        }
    }, [])

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
                        <MyInput type="email" idName="email" label="Введите почту" required={true}/>
                        <MyInput type="password" idName="password" label="Введите пароль" required={true}/>
                        <MyButton buttonContent="Подтвердить" type="submit"/>
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