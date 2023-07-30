import React, { useState } from "react"
import Management from "./Management/Management"
import Login from "./Login/Login"

export interface Credentials {
    domain: string
    password: string
    authenticated: boolean
}

export const API_ROUTE = "http://localhost:8000/bwd"

function App() {
    const [credentials, setCredentials] = useState<Credentials>()
    return (
        <>
            {credentials?.authenticated ? (
                <Management credentials={credentials} setCredentials={setCredentials} />
            ) : (
                <Login credentials={credentials} setCredentials={setCredentials} />
            )}
        </>
    )
}

export default App
