import {makeAutoObservable} from "mobx"

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._isPinVerified = false
        this._themeInfo = localStorage.getItem("theme") || "light";
        makeAutoObservable(this)
    }

    setIsAuth(bool) { // Это ЭКШН - что-то, что как-то меняет состояние
        this._isAuth = bool
    }
    setUser(user) {
        this._user = user
    }
    setIsPinVerified(bool) {
        this._isPinVerified = bool
    }
    setThemeInfo(theme) {
        this._themeInfo = theme
        localStorage.setItem("theme", theme);
    }

    get isAuth() { // Это КОМПЬЮТЕД ФУНКЦИИ, они вызываются только тогда, когда переменная которая используется внутри была изменена
        return this._isAuth;
    }
    get user() {
        return this._user;
    }
    get isPinVerified() {
        return this._isPinVerified;
    }
    get themeInfo() {
        return this._themeInfo;
    }

    toggleTheme() {
        this.setThemeInfo(
            this._themeInfo === "light" ? "dark" : "light"
        )
    }
}