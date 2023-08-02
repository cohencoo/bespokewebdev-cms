import React, { useEffect, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import styles from "./Management.module.scss"
import { API_ROUTE, Credentials, toastSchema } from "../../App"
import { capitalize, generateSitemap } from "../../assets/utils"

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
    const addDomainInput = useRef<HTMLInputElement>(null)
    const handleIFrameLoad = () => setLoaded(true)

    useEffect(() => {
        generateSitemap(`https://${credentials?.domain}`).then((sitemap) =>
            setSitemap([...new Set(sitemap)])
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function addDomain() {
        async function addDomainToCMS(domain: string) {
            try {
                const response = await fetch(`${API_ROUTE}/add-domain`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ domain }),
                })

                if (!response.ok) {
                    if (response.status === 409) {
                        toast.error(
                            `${domain} is already setup for CMS.`,
                            toastSchema("already-in-use")
                        )
                    } else {
                        toast.error("Something went wrong.", toastSchema("domain-failed"))
                    }
                    return
                }

                const data = await response.json()
                openModal(
                    <>
                        <p>
                            Please ensure Bespoke Web Dev's CMS script is added to {data.domain}'s
                            website. To login with this domain, please store and use these
                            credentials.
                        </p>
                        <p className={styles.modalData}>
                            <strong>Domain:</strong> {data.domain}
                        </p>
                        <p className={styles.modalData}>
                            <strong>Client Pin:</strong> {data.password}
                        </p>
                    </>,
                    `${domain} is now registered.`
                )
            } catch (error) {
                toast.error("Something went wrong.", toastSchema("add-failed"))
            }
        }

        openModal(
            <div className={styles.modal}>
                <input
                    className={styles.modalInput}
                    type="text"
                    name="domain"
                    ref={addDomainInput}
                    placeholder="example.com"
                />
                <button
                    className={styles.modalButton}
                    onClick={() => {
                        if (addDomainInput.current?.value) {
                            addDomainToCMS(
                                addDomainInput.current?.value.replace(/(^\w+:|^)\/\//, "")
                            )
                            closeModal()
                        } else {
                            toast.error("Something went wrong.", toastSchema("create-failed"))
                        }
                    }}>
                    Submit
                    <span className="material-symbols-rounded">share_windows</span>
                </button>
            </div>,
            "Enter domain origin"
        )
    }

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
                    Managing {credentials?.domain}
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
                        <button className={styles.button} onClick={() => addDomain()}>
                            Add Domain to CMS
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
                    onLoad={handleIFrameLoad}
                    style={{ display: loaded ? "block" : "none" }}
                    title="editor"
                    src={
                        subpage
                            ? `${subpage}?q=${credentials?.domain}&token=${credentials?.password}`
                            : `//${credentials?.domain}?q=${credentials?.domain}&token=${credentials?.password}`
                    }></iframe>
            </div>
        </div>
    )
}

export default Management
