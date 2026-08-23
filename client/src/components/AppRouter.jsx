import React, {useContext} from "react"
import {Navigate, Route, Routes} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {publicRoutes, authRoutes, pinRoutes} from "../routes.js";
import {Context} from "../context.js";
import {PIN_ROUTE, LANDING_ROUTE, DASHBOARD_ROUTE} from "../utils/consts.js"

const AppRouter = () => {
    const {userStore} = useContext(Context)

    return (
        <main>
            <Routes>
                {!userStore.isAuth && publicRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} element={<Component/>}/>
                )}
                {userStore.isAuth && !userStore.isPinVerified && authRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} element={<Component/>}/>
                )}
                {userStore.isAuth && userStore.isPinVerified && pinRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} element={<Component/>}/>
                )}
                <Route path="*" replace element={<Navigate to={!userStore.isAuth? LANDING_ROUTE :
                    !userStore.isPinVerified ? PIN_ROUTE :
                        DASHBOARD_ROUTE}/>
                }/>
            </Routes>
        </main>
    );
};

export default observer(AppRouter);