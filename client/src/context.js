import {createContext} from "react"
import UserStore from "./store/UserStore.js"

export const contextValues = {
    userStore: new UserStore()
}

export const Context = createContext({
    userStore: contextValues.userStore,
})