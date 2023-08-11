import toast from "react-hot-toast"
import { API_ROUTE } from "../../../App"
import { API, toastID } from "../../assets/utils"
import styles from "../Management.module.scss"

export function changePassword({
    openModal,
    closeModal,
    inputs,
    credentials,
    setCredentials,
}: {
    openModal: any
    closeModal: any
    inputs: any
    credentials: any
    setCredentials: any
}) {
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
                        toast.error("Your new PINs do not match.", toastID("change-password-error"))
                    }
                }}>
                Update
                <span className="material-symbols-rounded">share_windows</span>
            </button>
        </div>,
        "Enter and confirm your new 4-digit password"
    )
}
