import React, { useState } from "react"
import styles from "./Login.module.scss"
import logo from "../../assets/logo.svg"
import { API_ROUTE, Credentials, toastSchema } from "../../App"
import Button from "../Button/Button"
import { toast } from "react-hot-toast"
import cn from "clsx"
import SegmentedInput from "../SegmentedInput/SegmentedInput"

interface LoginInterface {
    credentials: Credentials | undefined
    setCredentials: any
}

const Login: React.FC<LoginInterface> = ({ credentials, setCredentials }) => {
    const [verifying, setVerifying] = useState(false)
    async function authenticate(domain: string, password: string) {
        setVerifying(true)
        try {
            const response = await fetch(`${API_ROUTE}/auth-domain`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domain: domain, password: password }),
            })

            if (!response.ok) {
                setVerifying(false)
                if (response.status === 404)
                    toast.error(
                        `It looks like Bespoke Web Dev CMS hasn't been setup for ${domain}. Please reach out to us.`,
                        toastSchema("not-found")
                    )
                else if (response.status === 400)
                    toast.error("Please enter your login details", toastSchema("no-credentials"))
                else
                    toast.error(
                        "Something went wrong, and we couldn't log you in. Please reach out to us.",
                        toastSchema("login-failed")
                    )
                return
            }

            setVerifying(false)
            setCredentials({
                ...credentials,
                authenticated: true,
            })
        } catch (error) {
            setVerifying(false)
            toast.error(
                "Something went wrong, and we couldn't log you in. Please reach out to us.",
                toastSchema("login-failed-1")
            )
        }
    }
    return (
        <div className={styles.Login}>
            <div className={styles.container}>
                <div className={styles.flex}>
                    <img src={logo} className={styles.logo} alt="BWD" />
                    <div>
                        <h1>Bespoke Web Dev</h1>
                        <h3>Content Management</h3>
                    </div>
                </div>

                <p className={styles.text}>
                    Hello! Let's get you signed in, so you can start editing your website in no
                    time.
                </p>

                <label htmlFor="domain">
                    <span className="material-symbols-rounded">domain</span>
                    Your Web Domain
                </label>

                <input
                    onChange={(e: any) => {
                        const domain = e.target.value.replace(/(^\w+:|^)\/\//, "")
                        setCredentials({ ...credentials, domain })
                    }}
                    type="domain"
                    name="domain"
                    placeholder="example.com"
                />

                <label>
                    <span className="material-symbols-rounded">account_circle</span>
                    Client Pin (4-digits)
                </label>

                <SegmentedInput
                    maxLength={4}
                    secret={true}
                    onChange={(value: any) => setCredentials({ ...credentials, password: value })}
                    onFilled={() => document.getElementById("signIn")?.click()}
                />

                <Button
                    id={"signIn"}
                    message={["Login", "Verifying..."]}
                    icon="login"
                    verifying={verifying}
                    action={() => authenticate(credentials?.domain!, credentials?.password!)}
                />

                <hr />

                <p className={cn([styles.text, styles.notice])}>
                    <span className="material-symbols-rounded">info</span>
                    Sign in from your computer to make the most of your editing experience.
                </p>
            </div>
        </div>
    )
}

export default Login
