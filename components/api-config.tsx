"use client"

import { useState, useEffect } from "react"
import { Box, TextField, Button, Typography, Paper, Alert, Switch, FormControlLabel } from "@mui/material"
import { Save, RefreshCw } from "lucide-react"

export default function ApiConfig() {
  const [apiUrl, setApiUrl] = useState("")
  const [useMockData, setUseMockData] = useState(true)
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Load saved settings on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedApiUrl = localStorage.getItem("apiUrl") || ""
      const savedUseMockData = localStorage.getItem("useMockData") !== "false" // Default to true if not set

      setApiUrl(savedApiUrl)
      setUseMockData(savedUseMockData)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("apiUrl", apiUrl)
    localStorage.setItem("useMockData", String(useMockData))

    // Force reload to apply new settings
    window.location.reload()
  }

  const testApiConnection = async () => {
    setTestStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch(`${apiUrl}/united-signs/`)

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        setErrorMessage(
          `Получен неверный формат ответа: ${contentType || "неизвестный"}\nПервые 100 символов: ${text.substring(0, 100)}...`,
        )
        setTestStatus("error")
        return
      }

      await response.json() // Try to parse JSON
      setTestStatus("success")
    } catch (error) {
      setErrorMessage(`Ошибка подключения: ${error instanceof Error ? error.message : String(error)}`)
      setTestStatus("error")
    }
  }

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Настройка API
      </Typography>

      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Switch checked={useMockData} onChange={(e) => setUseMockData(e.target.checked)} color="primary" />}
          label="Использовать тестовые данные"
        />
        <Typography variant="caption" display="block" color="text.secondary">
          Включите эту опцию, если API недоступен или вы хотите работать с тестовыми данными
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", flexDirection: { xs: "column", sm: "row" } }}>
        <TextField
          label="URL API"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="Например: http://localhost:8000/api"
          fullWidth
          disabled={useMockData}
          helperText="Укажите базовый URL API без завершающего слеша"
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={testApiConnection}
            disabled={!apiUrl || useMockData}
            startIcon={<RefreshCw size={16} />}
          >
            Проверить
          </Button>

          <Button variant="contained" onClick={handleSave} startIcon={<Save size={16} />}>
            Сохранить
          </Button>
        </Box>
      </Box>

      {testStatus === "loading" && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Проверка подключения...
        </Alert>
      )}

      {testStatus === "success" && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Подключение успешно! API доступен.
        </Alert>
      )}

      {testStatus === "error" && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="body2">Ошибка подключения к API:</Typography>
          <Typography variant="caption" component="pre" sx={{ whiteSpace: "pre-wrap", mt: 1 }}>
            {errorMessage}
          </Typography>
        </Alert>
      )}
    </Paper>
  )
}
