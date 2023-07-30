import React from "react"
import "./Login.css"
import logo from "./rounded.png"
import { API_ROUTE, Credentials } from "../App"

interface LoginInterface {
    credentials: Credentials | undefined
    setCredentials: any
}

const Login: React.FC<LoginInterface> = ({ credentials, setCredentials }) => {
    async function authenticate(domain: string, password: string) {
        try {
            const response = await fetch(`${API_ROUTE}/auth-domain`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    domain: domain,
                    password: password,
                }),
            })

            if (!response.ok) {
                if (response.status === 404) {
                    alert(`Bespoke Web Dev CMS is not set up for ${domain}`)
                } else if (response.status === 400) {
                    alert("Please enter your login details")
                } else {
                    alert("We weren't able to log you in. Please contact us.")
                }
                return
            }

            setCredentials({
                ...credentials,
                authenticated: true,
            })
        } catch (error) {
            alert("An error occurred. Please try again later.")
            console.error(error)
        }
    }
    return (
        <div className="Login">
            <div className="container">
                <div className="flex">
                    <img src={logo} className="logo" alt="BWD" />
                    <div>
                        <h1>Bespoke Web Dev</h1>
                        <h3>Content Management</h3>
                    </div>
                </div>

                <p className="text">
                    Hello! Let's get you signed in, so you can start editing your website in no
                    time.
                </p>
                <label htmlFor="website">Your Web Domain</label>
                <input
                    onChange={(e: any) => {
                        const domain = e.target.value.replace(/(^\w+:|^)\/\//, "")
                        setCredentials({
                            ...credentials,
                            domain,
                        })
                    }}
                    type="text"
                    placeholder="example.com"
                    name="website"
                />
                <label htmlFor="token">Client No.</label>
                <input
                    onChange={(e: any) => {
                        setCredentials({
                            ...credentials,
                            password: e.target.value,
                        })
                    }}
                    type="text"
                    placeholder="4 digit pin"
                    name="token"
                />
                <button onClick={() => authenticate(credentials?.domain!, credentials?.password!)}>
                    Login
                </button>

                <p className="text">
                    Sign in from your computer to make the most of your editing experience.
                </p>
                <a target="_blank" href="//bespokewebdev.com" rel="noreferrer">
                    bespokewebdev.com
                </a>
            </div>
        </div>
    )
}

export default Login
