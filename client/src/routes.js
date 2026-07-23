import {Accounts, Admin, Auth, Card, Dashboard, Landing, PinCode, Profile, Transactions, Transfer, Transaction} from "./pages/index.jsx";
import {
    ADMIN_ROUTE,
    LANDING_ROUTE,
    LOGIN_ROUTE,
    REGISTRATION_ROUTE,
    PROFILE_ROUTE,
    PIN_ROUTE,
    DASHBOARD_ROUTE,
    ACCOUNTS_ROUTE,
    TRANSFER_ROUTE,
    TRANSACTIONS_ROUTE,
    CARD_ROUTE
} from "./utils/consts.js";

export const authRoutes = [
    {
        path: PIN_ROUTE,
        Component: PinCode
    },
]

export const pinRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: CARD_ROUTE + "/:cardId",
        Component: Card
    },
    {
        path: DASHBOARD_ROUTE,
        Component: Dashboard
    },
    {
        path: ACCOUNTS_ROUTE,
        Component: Accounts
    },
    {
        path: TRANSFER_ROUTE + "/:cardId",
        Component: Transfer
    },
    {
        path: TRANSACTIONS_ROUTE,
        Component: Transactions
    },
    {
        path: TRANSACTIONS_ROUTE + "/:transactionId",
        Component: Transaction
    },
]

export const publicRoutes = [
    {
        path: LANDING_ROUTE,
        Component: Landing
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
]
