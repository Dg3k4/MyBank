import axios from "axios"
import {REACT_APP_API_URL} from "../utils/consts.js"

const $api = axios.create({
    baseURL: REACT_APP_API_URL
})

const $refreshApi = axios.create({
    withCredentials: true,
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

$authApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest["_retry"]) {
            originalRequest["_retry"] = true
            try {
                const response = await $refreshApi.post("/user/refresh")
                const accessToken = response.data.accessToken
                localStorage.setItem("token", accessToken)
                originalRequest.headers.Authorization = `Bearer ${accessToken}`

                return $authApi.request(originalRequest)
            } catch (e) {
                localStorage.removeItem("token")
                throw e
            }
        }
        throw error
    }
)

export {
    $api,
    $authApi,
    $refreshApi
}