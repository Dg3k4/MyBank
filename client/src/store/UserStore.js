import {makeAutoObservable} from "mobx"
import AuthService from "../services/AuthService"

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._isPinVerified = false
        this._themeInfo = localStorage.getItem("theme") || "light"
        this._isLoading = false
        this._isInitialized = false
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
    setIsLoading(bool) {
        this._isLoading = bool
    }
    setIsInitializing(bool) {
        this._isInitialized = bool
    }

    get isAuth() { // Это КОМПЬЮТЕД ФУНКЦИИ, они вызываются только тогда, когда переменная которая используется внутри была изменена
        return this._isAuth
    }
    get user() {
        return this._user
    }
    get isPinVerified() {
        return this._isPinVerified
    }
    get themeInfo() {
        return this._themeInfo
    }
    get isLoading() {
        return this._isLoading
    }
    get isInitializing() {
        return this._isInitialized
    }

    toggleTheme() {
        this.setThemeInfo(
            this._themeInfo === "light" ? "dark" : "light"
        )
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async login({email, password}) {
        this.setIsLoading(true)
        try {
            const response = await AuthService.login({email, password})
            localStorage.setItem("token", response.data.accessToken)
            this.setIsAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e.response?.data?.message)
            throw e.response
        } finally {
            this.setIsLoading(false)
        }
    }

    async registration({email, password, firstName, lastName, middleName, birthDay, phoneNumber}) {
        this.setIsLoading(true)
        try {
            const response = await AuthService.registration({email, password, firstName, lastName, middleName, birthDay, phoneNumber})
            localStorage.setItem("token", response.data.accessToken) // Сделай редирект на дэшборд, после подтверждения почты
            this.setIsAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e.response?.data?.message)
            throw e.response
        } finally {
            this.setIsLoading(false)
        }
    }

    async checkAuth() {
        this.setIsInitializing(true)
        try {
            const response = await AuthService.refresh()
            localStorage.setItem("token", response.data.accessToken)
            this.setIsAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e.response?.data?.message)
            throw e.response
        } finally {
            await this.sleep(300)
            this.setIsInitializing(false)
        }
    }

    async logout() {
        try {
            await AuthService.logout()
            localStorage.removeItem("token")
            this.setIsAuth(false)
            this.setUser({})
        } catch (e) {
            console.log(e.response?.data?.message)
            throw e.response
        }
    }

    async pinCreate({pinCode}) {
        this.setIsInitializing(true)
        try {
            await AuthService.pinCreate({pinCode})
            this.setIsPinVerified(true)
        } catch (e) {
            console.log(e.response?.data?.message)
            throw e.response
        } finally {
            await this.sleep(300)
            this.setIsInitializing(false)
        }
    }

    async pinVerify({pinCode}) {
        try {
            await AuthService.pinVerify({pinCode})
            this.setIsInitializing(true)
            this.setIsPinVerified(true)
            await this.sleep(300)
        } catch (e) {
            console.log(e.response?.data?.message)
            throw e.response
        } finally {
            this.setIsInitializing(false)
        }
    }
}