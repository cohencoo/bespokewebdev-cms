import React, { useEffect, useRef, useState } from "react"
import styles from "./Register.module.scss"
import logo from "../assets/logo.svg"
import { API_ROUTE } from "../../App"
import { API, toastID } from "../assets/utils"
import toast from "react-hot-toast"
import Button from "../Button/Button"

const Register: React.FC<{ setCredentials: any; closeModal: any; openModal: any }> = ({
    setCredentials,
    closeModal,
    openModal,
}) => {
    const [verifying, setVerifying] = useState<boolean>(false)
    const domainRef = useRef<HTMLInputElement>(null)

    const validateAndSetDomain = (input: string) => {
        if (!input) return false
        const strip = input
            ?.replace(/^(https?:\/\/)?/i, "")
            .replace(/^www\./i, "")
            .split("/")[0]

        const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (domainRegex.test(strip)) return true
        else return false
    }

    useEffect(() => {
        toast.success("You're all set. Thanks for your order!", toastID("awesome"))
    }, [])

    async function addDomain() {
        if (domainRef.current?.value.trim() && validateAndSetDomain(domainRef.current?.value)) {
            API(
                API_ROUTE,
                "/add-domain",
                {
                    domain: domainRef.current?.value.replace(/(^\w+:|^)\/\//, ""),
                },
                (data: any) => {
                    setVerifying(true)
                    openModal(
                        <>
                            <p>
                                These credentials will be used to login and manage your website's
                                content. Please store them somewhere safe. You'll be able to change
                                your PIN next.
                            </p>
                            <p className={styles.RegisterField}>
                                <strong>Domain:</strong> {data.domain}
                            </p>
                            <p className={styles.RegisterField}>
                                <strong>Client Pin:</strong> {data.password}
                            </p>
                            <button
                                className={styles.RegisterButton}
                                onClick={() =>
                                    setCredentials({
                                        domain: data.domain,
                                        password: data.password,
                                        authenticated: true,
                                        claimed: false,
                                    })
                                }>
                                I have stored these details
                            </button>
                        </>,
                        `${data.domain} is now registered.`
                    )
                },
                (error: any) => {
                    setVerifying(false)
                    if (error.status === 409) {
                        toast.error(
                            `${domainRef.current?.value} is already setup for CMS.`,
                            toastID("domain-exists")
                        )
                    } else {
                        toast.error("Something went wrong.", toastID("create-failed"))
                    }
                }
            )

            closeModal()
        } else {
            setVerifying(false)
            toast.error("Please enter a domain", toastID("domain-empty"))
        }
    }

    return (
        <div className={styles.Register}>
            <div className={styles.container}>
                <div className={styles.flex}>
                    <img src={logo} className={styles.logo} alt="BWD" />
                    <div>
                        <h1>Add your domain</h1>
                    </div>
                </div>

                <p className={styles.text}>
                    Almost There! –– Please enter your domain (eg. example.com), so you can manage
                    it's content.
                </p>

                <label htmlFor="domain">
                    <span className="material-symbols-rounded">domain</span>
                    Your Web Domain
                </label>

                <input type="text" name="domain" ref={domainRef} placeholder="example.com" />

                <Button
                    message={["Add Domain", "Verifying..."]}
                    icon={"share_windows"}
                    verifying={verifying}
                    action={() => {
                        setVerifying(true)
                        addDomain()
                    }}
                />
            </div>
        </div>
    )
}

export default Register
