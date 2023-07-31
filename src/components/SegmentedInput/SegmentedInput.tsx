import React, { useRef, useState } from "react"
import styles from "./SegmentedInput.module.scss"

interface SegmentedInputInterface {
    onChange: any
    maxLength?: number
}

const SegmentedInput: React.FC<SegmentedInputInterface> = ({ onChange, maxLength }) => {
    const [input, setInput] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    return (
        <div
            onClick={() => inputRef.current && inputRef.current.focus()}
            className={styles.SegmentedInput}>
            <input
                type="text"
                ref={inputRef}
                maxLength={maxLength}
                onChange={(e: any) => {
                    onChange(e.target.value)
                    setInput(e.target.value)
                }}
            />

            {Array(maxLength)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={i}
                        className={styles.segment}
                        style={{
                            backgroundColor:
                                i < input.length ? "rgba(255, 255, 255, 0.08)" : undefined,
                        }}>
                        {input[i]}
                    </div>
                ))}
        </div>
    )
}

export default SegmentedInput
