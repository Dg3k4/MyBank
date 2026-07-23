import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import {Context, contextValues} from './context'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Context.Provider value={{userStore: contextValues.userStore}}>
            <App />
        </Context.Provider>
    </StrictMode>,
)
