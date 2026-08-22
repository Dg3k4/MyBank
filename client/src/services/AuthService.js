import {$api, $authApi} from '../http/index.js'

export default class AuthService {
    static async login({email, password}) {
        return $authApi.post("user/login", {email, password})
    }

    static async registration({email, password, firstName, lastName, phoneNumber, middleName, birthDay}) {
        return $authApi.post("user/registration", {email, password, firstName, lastName, phoneNumber, middleName, birthDay})
    }

    static async logout() {
        return $authApi.post("user/logout")
    }

    static async pinCreate({pinCode}) {
        return $authApi.post("user/pin", {pinCode})
    }

    static async pinVerify({pinCode}) {
        return $authApi.post("user/pin/verify", {pinCode})
    }

    static async refresh() {
        return $authApi.post("user/refresh")
    }
}