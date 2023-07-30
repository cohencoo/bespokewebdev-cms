import React from "react"
import "./Management.css"
import { Credentials } from "../App"

interface ManagementInterface {
    credentials: Credentials | undefined
    setCredentials: any
}

const Management: React.FC<ManagementInterface> = ({ credentials, setCredentials }) => {
    return (
        <div className="Management">
            <div className="header">
                <h1>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    Managing {credentials?.domain}
                </h1>
                <a
                    className="button"
                    href={"//" + credentials?.domain}
                    target="_blank"
                    rel="noreferrer">
                    Visit Site
                </a>
            </div>

            <div style={{ height: "100%" }}>
                <div className="notice">You are in Edit Mode - Edit text by clicking on it.</div>
                <iframe
                    title="management"
                    src={`http://localhost:5500/website/index.html?q=${credentials?.domain}&token=${credentials?.password}`}></iframe>
            </div>
        </div>
    )
}

export default Management
