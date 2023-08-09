import React, { useEffect, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import styles from "./Management.module.scss"
import { API_ROUTE, Credentials } from "../../App"
import { API, capitalize, generateSitemap, toastID } from "../assets/utils"

interface ManagementInterface {
    credentials: Credentials
    setCredentials: any
    openModal: any
    closeModal: any
}

const Management: React.FC<ManagementInterface> = ({
    credentials,
    setCredentials,
    openModal,
    closeModal,
}) => {
    const [loaded, setLoaded] = useState(false)
    const [subpage, setSubpage] = useState("")
    const [sitemap, setSitemap] = useState([]) as any[]
    const inputs = {
        domain: useRef<HTMLInputElement>(null),
        newPassword: useRef<HTMLInputElement>(null),
        confirmNewPassword: useRef<HTMLInputElement>(null),
        quote: useRef<HTMLInputElement>(null),
        author: useRef<HTMLInputElement>(null),
    }

    async function addTestimonials() {
        openModal(
            <div style={{ flexDirection: "column" }} className={styles.modal}>
                <input
                    className={styles.modalInput}
                    type="text"
                    name="quote"
                    ref={inputs.quote}
                    placeholder="Quote"
                />
                <input
                    className={styles.modalInput}
                    type="text"
                    name="author"
                    ref={inputs.author}
                    placeholder="Name of Author"
                />
                <button
                    className={styles.modalButton}
                    onClick={() => {
                        if (
                            inputs.quote.current?.value.trim() &&
                            inputs.author.current?.value.trim()
                        ) {
                            API(
                                API_ROUTE,
                                "/update-domain",
                                {
                                    domain: credentials.domain,
                                    password: credentials.password,
                                    path: "/",
                                    modifications: {},
                                    addToDynamic: {
                                        ["carousel-" + Date.now().toString()]: [
                                            inputs.quote.current?.value,
                                            inputs.author.current?.value,
                                        ],
                                    },
                                },
                                () =>
                                    toast.success(
                                        "Quote has been added! Click on your website in the top left corner to see updates.",
                                        toastID("added-quote")
                                    ),
                                () => toast.error("Something went wrong.", toastID("failed-quote"))
                            )

                            inputs.quote.current!.value = ""
                            inputs.author.current!.value = ""
                            closeModal()
                        } else {
                            toast.error("Please enter a quote to add", toastID("quote-empty"))
                        }
                    }}>
                    Submit
                    <span className="material-symbols-rounded">share_windows</span>
                </button>
            </div>,
            "Enter new Quote"
        )
    }

    function changePassword() {
        openModal(
            <div style={{ flexDirection: "column" }} className={styles.modal}>
                <div>
                    <input
                        className={styles.modalInput}
                        type="password"
                        name="new-password"
                        maxLength={4}
                        ref={inputs.newPassword}
                        style={{ marginBottom: "10px" }}
                        placeholder="Enter New PIN"
                    />
                    <input
                        className={styles.modalInput}
                        type="password"
                        name="confirm-new-password"
                        maxLength={4}
                        ref={inputs.confirmNewPassword}
                        placeholder="Re-Enter New PIN"
                    />
                </div>
                <button
                    className={styles.modalButton}
                    onClick={() => {
                        if (inputs.newPassword.current?.value.trim().length !== 4) {
                            toast.error(
                                "Your new PIN must be 4 digits.",
                                toastID("change-password-error")
                            )
                            return
                        }
                        if (
                            inputs.newPassword.current?.value ===
                            inputs.confirmNewPassword.current?.value
                        ) {
                            toast.loading(
                                `Updating your password...`,
                                toastID("change-password-loading")
                            )
                            API(
                                API_ROUTE,
                                "/update-domain-password",
                                {
                                    domain: credentials.domain,
                                    password: credentials.password,
                                    newPassword: inputs.newPassword.current?.value,
                                },
                                () => {
                                    toast.dismiss("change-password-loading")
                                    toast.success(
                                        `Your password has been updated!`,
                                        toastID("change-password-success")
                                    )
                                    setCredentials({
                                        ...credentials,
                                        password: inputs.newPassword.current?.value,
                                    })
                                    closeModal()
                                },
                                () => {
                                    toast.error(
                                        `There was an error updating your password. Please try again later.`,
                                        toastID("change-password-error")
                                    )
                                }
                            )
                        } else {
                            toast.error(
                                "Your new PINs do not match.",
                                toastID("change-password-error")
                            )
                        }
                    }}>
                    Update
                    <span className="material-symbols-rounded">share_windows</span>
                </button>
            </div>,
            "Enter and confirm your new 4-digit password"
        )
    }

    useEffect(() => {
        generateSitemap(`https://${credentials?.domain}`).then((sitemap) =>
            setSitemap([...new Set(sitemap)])
        )

        if (!credentials.claimed)
            openModal(
                <div className={styles.modal}>
                    <div>
                        <ul>
                            <li>
                                Clicking on text outlined with a{" "}
                                <span style={{ border: "0.5px dotted red" }}>red border</span> can
                                be modified as needed. <i>Your edits are automatically saved.</i>
                            </li>
                            <li>
                                For those managing multiple pages, click on the dropdown at the top
                                center of your screen where you can navigate through subpages.
                            </li>
                            <li>
                                We strongly recommend updating the default password that was
                                auto-generated for you.
                            </li>
                        </ul>
                        <button onClick={() => changePassword()} className={styles.modalButton}>
                            <span className="material-symbols-rounded">vpn_key</span>
                            Change Password
                        </button>
                    </div>
                </div>,
                `Welcome aboard! Here's a quick tour.`
            )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={styles.Management}>
            <div className={styles.header}>
                <a
                    href={subpage ? `${subpage}` : `//${credentials?.domain}`}
                    className={styles.managing}
                    target="_blank"
                    rel="noreferrer">
                    <span style={{ fontSize: "2rem" }} className="material-symbols-rounded">
                        domain
                    </span>
                    <span className={styles.title}>Managing {credentials?.domain}</span>
                    <span style={{ color: "var(--theme)" }} className="material-symbols-rounded">
                        open_in_new
                    </span>
                </a>

                {sitemap.length > 0 && (
                    <div className={styles.switchPage}>
                        <label htmlFor="subPage">
                            <span className="material-symbols-rounded">browse</span>
                            Switch Page
                        </label>
                        <select name="subPage" onChange={(e) => setSubpage(e.target.value)}>
                            <option value="">Landing Page (Home)</option>
                            {sitemap.map((page: string, index: number) => {
                                return (
                                    <option key={index} value={page}>
                                        {capitalize(
                                            page
                                                .split("/")
                                                .slice(-1)[0]
                                                .slice(0, -5)
                                                .replaceAll("-", " ")
                                        )}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                )}

                <div className={styles.toolbar}>
                    {credentials?.domain === "bespokewebdev.com" && (
                        <button
                            className={styles.button}
                            onClick={() => (window.location.href = "?proceed=ready")}>
                            Add Domain to CMS
                            <span className="material-symbols-rounded">add</span>
                        </button>
                    )}

                    {credentials?.domain === "cleoscandles.com" && (
                        <button className={styles.button} onClick={() => addTestimonials()}>
                            Add Quotes
                            <span className="material-symbols-rounded">add</span>
                        </button>
                    )}

                    <button className={styles.button} onClick={() => setCredentials(undefined)}>
                        Logout
                        <span className="material-symbols-rounded">logout</span>
                    </button>
                </div>
            </div>

            <div style={{ height: "100%" }}>
                <div className={styles.notice}>
                    <span className="material-symbols-rounded">info</span>
                    You are in Edit Mode - Edit text by clicking on it.
                </div>

                {!loaded && (
                    <div className={styles.iframeLoader}>
                        <div className={styles.loader}></div>
                        <span>Loading Resources...</span>
                    </div>
                )}
                <iframe
                    onLoad={() => setLoaded(true)}
                    style={{ display: loaded ? "block" : "none" }}
                    title="editor"
                    src={
                        subpage
                            ? `${subpage}?token=${credentials?.password}`
                            : `https://${credentials?.domain}?token=${credentials?.password}`
                    }></iframe>
            </div>
        </div>
    )
}

export default Management
