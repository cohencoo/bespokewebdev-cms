import React, { useEffect, useRef, useState } from "react"
import styles from "./SegmentedInput.module.scss"

interface SegmentedInputInterface {
    onChange: any
    maxLength?: number
    secret?: boolean
    onFilled?: any
}

const SegmentedInput: React.FC<SegmentedInputInterface> = ({
    onChange,
    maxLength,
    secret,
    onFilled,
}) => {
    const [input, setInput] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const [highlightFirst, setHighlightFirst] = useState(false)

    useEffect(() => {
        if (input.length === maxLength && onFilled) {
            onFilled()
            setTimeout(() => {
                setInput("")
                if (inputRef.current) {
                    inputRef.current.focus()
                    setHighlightFirst(false)
                }
            }, 400)
        }
    }, [input, maxLength, onFilled])

    return (
        <div
            onClick={() => {
                inputRef.current && inputRef.current.focus()
                setHighlightFirst(true)
            }}
            className={styles.SegmentedInput}>
            <input
                type="text"
                ref={inputRef}
                maxLength={maxLength}
                value={input}
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
                            background:
                                (highlightFirst && i === 0) || i < input.length
                                    ? "rgba(255, 255, 255, 0.06)"
                                    : undefined,
                        }}>
                        {secret && input[i] ? "•" : input[i]}
                    </div>
                ))}
        </div>
    )
}

export default SegmentedInput
