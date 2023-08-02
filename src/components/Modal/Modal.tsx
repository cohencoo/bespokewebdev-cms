import React, { useRef } from "react"
import styles from "./Modal.module.scss"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    content: JSX.Element | string
    title?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, content, title }) => {
    const modalPopupRef = useRef<HTMLDivElement>(null)
    modalPopupRef.current?.classList.toggle(styles.active, isOpen)

    return (
        <>
            {isOpen && <div onClick={() => onClose()} className={styles.Modal}></div>}
            <div ref={modalPopupRef} className={styles.modalPopup}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <span className={styles.close} onClick={onClose}>
                            &times;
                        </span>
                        <span className={styles.title}>{title}</span>
                        <span></span>
                    </div>
                    {content}
                </div>
            </div>
        </>
    )
}

export default Modal
