import React, { useState } from "react"
import Management from "./components/Management/Management"
import Login from "./components/Login/Login"
import { Toaster } from "react-hot-toast"
import Modal from "./components/Modal/Modal"
import Register from "./components/Register/Register"

export const API_ROUTE = "https://visioneerlist.herokuapp.com/bwd"
export interface Credentials {
    domain: string
    password: string
    authenticated: boolean
    claimed: boolean
    timestamp?: number
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
            ) : new URLSearchParams(window.location.search).get("proceed") ? (
                <Register
                    setCredentials={setCredentials}
                    openModal={openModal}
                    closeModal={closeModal}
                />
            ) : (
                <Login credentials={credentials} setCredentials={setCredentials} />
            )}
        </>
    )
}

export default App
