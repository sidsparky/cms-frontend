import { useState } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null) // { message, type: 'success' | 'error' }

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  return { toast, showToast }
}