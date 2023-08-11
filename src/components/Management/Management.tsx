import React, { useEffect, useRef, useState } from "react"
import styles from "./Management.module.scss"
import { Credentials } from "../../App"
import { capitalize, encrypt, generateSitemap } from "../assets/utils"
import { changePassword } from "./helpers/changePassword"
import { addTestimonials } from "./helpers/addTestimonials"

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
                        <button
                            onClick={() =>
                                changePassword({
                                    openModal,
                                    closeModal,
                                    inputs,
                                    credentials,
                                    setCredentials,
                                })
                            }
                            className={styles.modalButton}>
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
                        <select
                            name="subPage"
                            onChange={(e) => {
                                setLoaded(false)
                                setSubpage(e.target.value)
                            }}>
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
                            onClick={() =>
                                window.open(
                                    `${window.location.href}?proceed=ready`,
                                    "_blank",
                                    "width=600,height=600"
                                )
                            }>
                            Add Domain to CMS
                            <span className="material-symbols-rounded">add</span>
                        </button>
                    )}

                    {credentials?.domain === "cleoscandles.com" && (
                        <button
                            className={styles.button}
                            onClick={() =>
                                addTestimonials({
                                    inputs,
                                    credentials,
                                    setCredentials,
                                    openModal,
                                    closeModal,
                                })
                            }>
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
                            ? `${subpage}?token=${encrypt(credentials?.password)}`
                            : `https://${credentials?.domain}?token=${encrypt(
                                  credentials?.password
                              )}`
                    }></iframe>
            </div>
        </div>
    )
}

export default Management
