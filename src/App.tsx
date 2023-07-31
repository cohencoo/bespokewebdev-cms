import React, { useState } from "react"
import Management from "./components/Management/Management"
import Login from "./components/Login/Login"
import { Toaster } from "react-hot-toast"

export const API_ROUTE = "https://visioneerlist.herokuapp.com/bwd"
export const toastStyles: any = {
    borderRadius: "10px",
    background: "#222",
    color: "#fff",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    pointerEvents: "none",
}

export const toastSchema = (id: string): any => {
    return {
        id: id,
        duration: 4000,
        position: "top-right",
        style: toastStyles,
    }
}
export interface Credentials {
    domain: string
    password: string
    authenticated: boolean
}

function App() {
    const [credentials, setCredentials] = useState<Credentials>()
    return (
        <>
            <Toaster />
            {credentials?.authenticated ? (
                <Management credentials={credentials} setCredentials={setCredentials} />
            ) : (
                <Login credentials={credentials} setCredentials={setCredentials} />
            )}
        </>
    )
}

export default App
