import {BrowserRouter} from "react-router-dom"
import AppRouter from './components/AppRouter.jsx'
import Navbar from "./components/navbar/Navbar.jsx";
import "./app.scss"
import "./styles.css"
import {useContext, useEffect} from "react";
import {Context} from "./context.js";
import {observer} from "mobx-react-lite";
import PatternBackground from "./components/background/PatternBackground.jsx";

function App() {
    const {userStore} = useContext(Context)
    document.documentElement.dataset.theme = userStore.themeInfo === "dark" ? "dark" : "";

    return (
        <BrowserRouter>
            <Navbar />
            <AppRouter />
        </BrowserRouter>
    )
}

export default observer(App)
