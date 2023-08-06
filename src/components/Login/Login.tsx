import React, { useEffect, useState } from "react"
import styles from "./Login.module.scss"
import logo from "../assets/logo.svg"
import { API_ROUTE, Credentials } from "../../App"
import Button from "../Button/Button"
import { toast } from "react-hot-toast"
import cn from "clsx"
import SegmentedInput from "../SegmentedInput/SegmentedInput"
import { API, toastID } from "../assets/utils"

interface LoginInterface {
    credentials: Credentials | undefined
    setCredentials: any
}

const Login: React.FC<LoginInterface> = ({ credentials, setCredentials }) => {
    const [verifying, setVerifying] = useState(false)
    const [attempts, setAttempts] = useState(0)
    const [page, setPage] = useState(0)

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
        if (!password) {
            toast.error("Please enter a valid PIN", toastID("invalid-pin"))
            return
        }
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

                {page === 1 && (
                    <div className={styles.org}>
                        <span className="material-symbols-rounded">language</span>
                        {credentials?.domain}
                    </div>
                )}

                <p className={styles.text}>
                    {page === 0
                        ? "Hello! Let's get you signed in, so you can start editing your website in no time."
                        : "Almost there –– Please enter your client PIN that was provided to you. If in doubt, please reach out to us."}
                </p>

                <div style={{ display: page === 0 ? "block" : "none" }}>
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
                </div>

                <div style={{ display: page === 0 ? "none" : "block" }}>
                    <label>
                        <span className="material-symbols-rounded">account_circle</span>
                        Client Pin (4-digits)
                    </label>

                    <SegmentedInput
                        maxLength={4}
                        secret={true}
                        onChange={(value: any) =>
                            setCredentials({ ...credentials, password: value })
                        }
                        onFilled={() => document.getElementById("signIn")?.click()}
                    />
                </div>

                <Button
                    id={"signIn"}
                    message={[page === 0 ? "Next" : "Login", "Verifying..."]}
                    icon={page === 0 ? "start" : "login"}
                    verifying={verifying}
                    action={() => {
                        if (page === 0 && validateAndSetDomain(credentials?.domain!)) setPage(1)
                        else {
                            if (attempts >= 5) {
                                toast.error(
                                    `Too many failed attempts. Please try again soon.`,
                                    toastID("too-many-attempts")
                                )
                                return
                            }
                            setAttempts(attempts + 1)
                            authenticate(credentials?.domain!, credentials?.password!)
                        }
                    }}
                />
                {window.innerWidth < 1024 && (
                    <>
                        <hr />
                        <p className={cn([styles.text, styles.notice])}>
                            <span className="material-symbols-rounded">info</span>
                            Sign in from your computer to make the most of your editing experience.
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export default Login
