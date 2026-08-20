import {BrowserRouter} from "react-router-dom"
import AppRouter from './components/AppRouter.jsx'
import Navbar from "./components/navbar/Navbar.jsx";
import "./app.scss"
import "./styles.css"
import {useContext, useEffect, useState} from "react";
import {Context} from "./context.js";
import {observer} from "mobx-react-lite";
import PatternBackground from "./components/background/PatternBackground.jsx";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import InitLoader from "./components/loaders/InitLoader.jsx";

function App() {
    const {userStore} = useContext(Context)
    const [hideLoader, setHideLoader] = useState(false);
    const [showLoader, setShowLoader] = useState(true);

    document.documentElement.dataset.theme = userStore.themeInfo === "dark" ? "dark" : "";

    useEffect(() => {
         userStore.checkAuth()
    }, [])
    useEffect(() => {
        if (!userStore.isInitializing) {
            setHideLoader(true);
            console.log("Анимация должна быть") // Вынеси всю логику загрузки при инициализации
            setTimeout(() => {
                setShowLoader(false)
            }, 400)
        }
    }, [userStore.isInitializing])

    return (
        <BrowserRouter>
            {showLoader && <InitLoader hide={hideLoader}/>}
            <Navbar />
            <SimpleBar className="app-scroll" style={{height: "calc(100vh - 101px)"}}>
                <AppRouter />
            </SimpleBar>
        </BrowserRouter>
    )
}

export default observer(App)
