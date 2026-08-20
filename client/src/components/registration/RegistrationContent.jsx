import React, {useContext, useRef} from 'react';
import LogoIcon from "../../utils/icons/LogoIcon.jsx";
import "./registrationContent.scss"
import MyInput from "../inputs/MyInput.jsx";
import InfoIcon from "../../utils/icons/InfoIcon.jsx";
import MyButton from "../buttons/MyButton.jsx";
import {Context} from "../../context.js"
import {useNavigate} from "react-router-dom";

const RegistrationContent = () => {
    const {userStore} = useContext(Context)
    const navigate = useNavigate()
    const formRef = useRef({
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        password: "",
        repeatPassword: "",
        phone: "",
        birthday: ""
    })

    const registrationHandler = async (event) => {
        event.preventDefault()
        let {birthday} = formRef.current
        try {
            if (formRef.current.password !== formRef.current.repeatPassword || !formRef.current.password) {
                return "Passwords do not match" // Сделай полную проверку и отображение ошибок пользователю в будущем
            }
            if (birthday) {
                const [day, month, year] = birthday.split(".")
                birthday = `${year}-${month}-${day}`
            }
            await userStore.registration({
                email: formRef.current.email, password: formRef.current.password, firstName: formRef.current.firstName,
                lastName: formRef.current.lastName, middleName: formRef.current.middleName, birthDay: birthday,
                phoneNumber: Number(formRef.current.phone)
            })

            navigate("/pin")
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="registration">
            <div className="registration__container">
                <div className="registration__header">
                    <div className="registration-title">
                        <span>Начните пользоваться</span>
                        <LogoIcon />
                        <span className="registration-title__brand">MyBank</span>
                    </div>
                    <div className="registration-subtitle">Создайте аккаунт, чтобы управлять финансами онлайн</div>
                </div>
                <form className="registration__form">
                    <div className="registration__form-fullname">
                        <MyInput idName="first-name" label="Фамилия" onChange={e => formRef.current.lastName = e.currentTarget.value}/>
                        <MyInput idName="last-name" label="Имя" onChange={e => formRef.current.firstName = e.currentTarget.value}/>
                        <MyInput idName="middle-name" label="Отчество" onChange={e => formRef.current.middleName = e.currentTarget.value}/>
                    </div>
                    <MyInput idName="email" label="Email" onChange={e => formRef.current.email = e.currentTarget.value}/>
                    <div className="registration__form-password">
                        <MyInput idName="password" label="Пароль" type="password" onChange={e => formRef.current.password = e.currentTarget.value}/>
                        <MyInput idName="repeat-password" label="Повторите пароль" type="password" onChange={e => formRef.current.repeatPassword = e.currentTarget.value}/>
                    </div>
                    <div className="registration__form-personal">
                        <MyInput className="phone-field" idName="phone" label="Номер телефона" onChange={e => formRef.current.phone = e.currentTarget.value}/>
                        <MyInput idName="birthday" label="Дата рождения" onChange={e => formRef.current.birthday = e.currentTarget.value}/>
                    </div>
                    <div className="registration__form-submit">
                        <MyButton buttonContent="Подтвердить" onClickFunction={registrationHandler}/>
                        <InfoIcon radius="17"/>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationContent;