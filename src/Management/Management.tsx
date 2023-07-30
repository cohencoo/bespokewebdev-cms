import React, { useState } from "react"
import "./Management.css"
import { Credentials } from "../App"

interface ManagementInterface {
    credentials: Credentials | undefined
    setCredentials: any
}

const Management: React.FC<ManagementInterface> = ({ credentials, setCredentials }) => {
    const [loaded, setLoaded] = useState(false)

    const handleIFrameLoad = () => {
        setLoaded(true)
    }

    return (
        <div className="Management">
            <div className="header">
                <h1>
                    <span
                        style={{ fontWeight: "300", fontSize: "2rem" }}
                        className="material-symbols-rounded">
                        domain
                    </span>
                    Managing {credentials?.domain}
                </h1>
                <a
                    className="button"
                    href={"//" + credentials?.domain}
                    target="_blank"
                    rel="noreferrer">
                    Visit Site
                    <span className="material-symbols-rounded">arrow_right_alt</span>
                </a>
            </div>

            <div style={{ height: "100%" }}>
                <div className="notice">
                    <span className="material-symbols-rounded">info</span>
                    You are in Edit Mode - Edit text by clicking on it.
                </div>

                {!loaded && (
                    <div className="iframe-loader">
                        <div className="loader"></div>
                        <span>Loading Resources...</span>
                    </div>
                )}
                <iframe
                    onLoad={handleIFrameLoad}
                    style={{ display: loaded ? "block" : "none" }}
                    title="management"
                    src={`//${credentials?.domain}?q=${credentials?.domain}&token=${credentials?.password}`}></iframe>
            </div>
        </div>
    )
}

export default Management
