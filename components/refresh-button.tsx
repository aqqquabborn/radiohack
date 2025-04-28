"use client"

import { useState } from "react"
import { Button, CircularProgress } from "@mui/material"
import { RefreshCw } from "lucide-react"
import { useSigns } from "@/context/signs-context"

export default function RefreshButton() {
  const { fetchSigns } = useSigns()
  const [loading, setLoading] = useState(false)

  // Обработчик обновления данных
  const handleRefresh = async () => {
    setLoading(true)
    try {
      await fetchSigns()
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outlined"
      startIcon={loading ? <CircularProgress size={20} /> : <RefreshCw size={20} />}
      onClick={handleRefresh}
      disabled={loading}
    >
      {loading ? "Обновление..." : "Обновить данные"}
    </Button>
  )
}
