import React, { useState } from "react"
import Management from "./components/Management/Management"
import Login from "./components/Login/Login"
import { Toaster } from "react-hot-toast"
import Modal from "./components/Modal/Modal"

export const API_ROUTE = "https://visioneerlist.herokuapp.com/bwd"
export const toastStyles: any = {
    borderRadius: "10px",
    background: "#eee",
    color: "#000",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    pointerEvents: "none",
}

export const toastSchema = (id: string): any => {
    return {
        id: id,
        duration: 4000,
        position: "top-right",
        style: toastStyles,
    }
}
export interface Credentials {
    domain: string
    password: string
    authenticated: boolean
}

function App() {
    const [credentials, setCredentials] = useState<Credentials>()
    const [showModal, setShowModal] = useState(false)
    const [modalContent, setModalContent] = useState<any>()
    const [modalTitle, setModalTitle] = useState<string>()

    const closeModal = () => setShowModal(false)
    const openModal = (content: JSX.Element | string, title?: string) => {
        setModalContent(content)
        setShowModal(true)
        title && setModalTitle(title)
    }

    return (
        <>
            <Toaster />
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                content={modalContent}
                title={modalTitle}
            />
            {credentials?.authenticated ? (
                <Management
                    openModal={openModal}
                    closeModal={closeModal}
                    credentials={credentials}
                    setCredentials={setCredentials}
                />
            ) : (
                <Login credentials={credentials} setCredentials={setCredentials} />
            )}
        </>
    )
}

export default App
