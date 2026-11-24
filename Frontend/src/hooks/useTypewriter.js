import { useState, useEffect } from 'react'

export const useTypewriter = (text, speed = 40, delay = 0) => {
    const [displayedText, setDisplayedText] = useState('')
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        let timeout
        let i = 0
        setDisplayedText('')
        setIsComplete(false)

        const startTyping = () => {
            const interval = setInterval(() => {
                if (i < text.length) {
                    setDisplayedText(text.slice(0, i + 1))
                    i++
                } else {
                    clearInterval(interval)
                    setIsComplete(true)
                }
            }, speed)
            return interval
        }

        if (delay > 0) {
            timeout = setTimeout(() => {
                startTyping()
            }, delay)
        } else {
            timeout = startTyping()
        }

        return () => {
            clearTimeout(timeout)
            clearInterval(timeout)
        }
    }, [text, speed, delay])

    return { displayedText, isComplete }
}
