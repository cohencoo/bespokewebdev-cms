import toast from "react-hot-toast"
import { API_ROUTE } from "../../../App"
import { API, toastID } from "../../assets/utils"
import styles from "../Management.module.scss"

export function addTestimonials({
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
                    if (inputs.quote.current?.value.trim() && inputs.author.current?.value.trim()) {
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
