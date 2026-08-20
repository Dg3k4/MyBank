import axios from "axios"
import {REACT_APP_API_URL} from "../utils/consts.js"

const $api = axios.create({
    baseURL: REACT_APP_API_URL
})

const $authApi = axios.create({
    withCredentials: true,
    baseURL: REACT_APP_API_URL
})

$authApi.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    return config;
})

export {
    $api,
    $authApi
}