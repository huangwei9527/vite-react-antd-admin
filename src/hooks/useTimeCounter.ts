import { useState, useEffect } from 'react'

export default function () {
  const initialCounter = 60
  const [counter, setCounter] = useState(initialCounter)
  const [timerId, setTimerId] = useState(null)

  function startTimer() {
    const timerId = setInterval(() => {
      setCounter(counter => counter - 1)
    }, 1000)
    setTimerId(timerId)
  }
  useEffect(() => {
    if (counter <= 0) {
      timerId && clearInterval(timerId)

      setCounter(() => initialCounter)
      setTimerId(() => null)
    }
  }, [counter])

  return {
    counter,
    timerId,
    startTimer
  }
}
