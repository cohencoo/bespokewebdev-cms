import React, { useEffect, useState } from "react"
import styles from "./Login.module.scss"
import logo from "../../assets/logo.svg"
import { API_ROUTE, Credentials } from "../../App"
import Button from "../Button/Button"
import { toast } from "react-hot-toast"
import cn from "clsx"
import SegmentedInput from "../SegmentedInput/SegmentedInput"
import { API, toastID } from "../../assets/utils"

interface LoginInterface {
    credentials: Credentials | undefined
    setCredentials: any
}

const Login: React.FC<LoginInterface> = ({ credentials, setCredentials }) => {
    const [verifying, setVerifying] = useState(false)
    const [attempts, setAttempts] = useState(0)

    useEffect(() => {
        const intervalId = setInterval(() => setAttempts(0), 60000)
        return () => clearInterval(intervalId)
    }, [])

    const validateAndSetDomain = (input: string) => {
        if (!input) return false
        const strip = input
            ?.replace(/^(https?:\/\/)?/i, "")
            .replace(/^www\./i, "")
            .split("/")[0]

        const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (domainRegex.test(strip)) {
            setCredentials({ ...credentials, domain: strip })
            return true
        } else return false
    }

    async function authenticate(domain: string, password: string) {
        if (!validateAndSetDomain(domain)) {
            toast.error("Please enter a valid domain", toastID("invalid-domain"))
            return
        }
        if (attempts >= 5) {
            toast.error(
                `Too many failed attempts. Please try again soon.`,
                toastID("too-many-attempts")
            )
            return
        }
        setAttempts(attempts + 1)
        setVerifying(true)

        API(
            API_ROUTE,
            "/auth-domain",
            {
                domain,
                password,
            },
            (data: any) => {
                setVerifying(false)
                setCredentials({
                    ...credentials,
                    authenticated: true,
                    claimed: data.claimed,
                    timestamp: data.timestamp,
                })
            },
            (error: any) => {
                console.warn(error)
                setVerifying(false)

                switch (error.status) {
                    case 404:
                        toast.error(
                            `It looks like Bespoke Web Dev CMS hasn't been setup for ${domain}. Please reach out to us.`,
                            toastID("domain-not-found")
                        )
                        break
                    default:
                        toast.error(
                            "Something went wrong, and we couldn't log you in. Please reach out to us.",
                            toastID("login-failed")
                        )
                }
            }
        )
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
                    onChange={(e: any) => validateAndSetDomain(e.target.value.trim())}
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