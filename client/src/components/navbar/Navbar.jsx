import React, {useState, useEffect, useContext} from 'react';
import {NavLink, useLocation, useNavigate, matchPath} from 'react-router-dom';
import './navbar.scss'
import {LANDING_ROUTE} from "../../utils/consts.js";
import MyButton from "../buttons/MyButton.jsx"
import MoonIcon from "../../utils/icons/MoonIcon.jsx";
import SunIcon from "../../utils/icons/SunIcon.jsx";
import LogoIcon from "../../utils/icons/LogoIcon.jsx";
import {Context} from "../../context.js"
import {observer} from "mobx-react-lite";
import LoginModal from "../modals/LoginModal.jsx";
import {authRoutes, pinRoutes} from "../../routes.js"

const Navbar = () => {
    const {userStore} = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation().pathname;

    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoginClicked, setIsLoginClicked] = useState(false);

    const isBankRoute = [...authRoutes, ...pinRoutes].some(({path}) => matchPath(path, location));

    const changeTheme = () => {
        userStore.toggleTheme();
    }
    const openCloseLogin = () => {
        setIsLoginClicked(prevIsLoginClicked => !prevIsLoginClicked);
    }

    useEffect(() => {
        const scrollHandler = () => {
            setIsScrolled(window.scrollY > 0);
        }
        window.addEventListener("scroll", scrollHandler);

        return () => {
            window.removeEventListener("scroll", scrollHandler);
        }
    }, [])
    useEffect(() => {
        document.documentElement.dataset.theme = userStore.themeInfo === "dark" ? "dark" : "";
    }, [userStore.themeInfo]);

    return (
        <nav className={`navbar${isScrolled ? ' scrolled' : ''}${isBankRoute ? " bank" : ""}`}>
            <div className="navbar__content">
                <NavLink to={LANDING_ROUTE} className="navbar__logo">
                    <LogoIcon className={"navbar__logo__pin"}/>
                    <div className="navbar__logo__name">MyBank</div>
                </NavLink>
                <div style={location === "/registration" ? {visibility: "hidden"} : {}} className="navbar__nav">
                    <a href="#cards" className="navbar__nav__item">Карты</a>
                    <a href="#features" className="navbar__nav__item">Возможности</a>
                    <a href="#about" className="navbar__nav__item">О банке</a>
                </div>
                <div className="navbar__actions">
                    <div onClick={changeTheme} className="navbar__actions__theme">
                        {userStore.themeInfo !== "light" ? <MoonIcon className={"navbar__actions__theme__icon"}/> : <SunIcon className={"navbar__actions__theme__icon"}/>}
                    </div>
                    {userStore.isAuth
                        ? <MyButton buttonContent="В банк" onClickFunction={() => navigate("/dashboard")}/>
                        : <MyButton buttonContent="Войти" onClickFunction={openCloseLogin}/>
                    }
                </div>
            </div>
            {isLoginClicked &&
                <LoginModal close={openCloseLogin}/>
            }
        </nav>
    );
};

export default observer(Navbar);