import { useState } from 'react'
import axios from 'axios'

export const useSubscription = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const onSubscribe = async () => {
    setIsProcessing(true)
    try {
      const response = await axios.get('/api/payment')
      if (response.data.status === 200) {
        return (window.location.href = `${response.data.session_url}`)
      }
      setIsProcessing(false)
    } catch (error) {
      console.log(error, '🔴')
    }
  }
  return { onSubscribe, isProcessing }
}

// 🔹 Key Benefits of Axios
// ✔ Easy to Use – Cleaner syntax than fetch()
// ✔ Promise-Based – Supports async/await for better readability
// ✔ Automatic JSON Handling – Parses JSON responses automatically
// ✔ Request & Response Interceptors – Modify requests or responses globally
// ✔ Error Handling – Provides better error messages than fetch()
// ✔ Supports Timeout & Cancellation – Helps manage network requests efficiently
// ✔ Works in Browser & Node.js – Can be used in frontend & backend