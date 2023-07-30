import React from "react"
import "./Button.css"

interface ButtonProps {
    message: string[]
    verifying: boolean
    icon: any
    action: () => void
}

const Button: React.FC<ButtonProps> = ({ message, icon, verifying, action }) => {
    const [defaultText, activeText] = message
    return (
        <button
            className="Button"
            onClick={() => (!verifying ? action() : null)}
            style={{ background: verifying ? "#99601010" : undefined }}>
            {verifying ? (
                <div className="verifying">
                    <div className="loader"></div>
                    {activeText}
                </div>
            ) : (
                <>
                    {icon && <span className="material-symbols-rounded">{icon}</span>}
                    {defaultText}
                </>
            )}
        </button>
    )
}

export default Button
