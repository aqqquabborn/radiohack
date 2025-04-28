"use client"

import { Box, Alert, Button } from "@mui/material"
import { Settings } from "lucide-react"
import { useSigns } from "@/context/signs-context"

export default function ErrorDisplay() {
  const { error } = useSigns()

  if (!error) return null

  const scrollToApiConfig = () => {
    const apiConfigElement = document.getElementById("api-config")
    if (apiConfigElement) {
      apiConfigElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" startIcon={<Settings size={16} />} onClick={scrollToApiConfig}>
            Настройки API
          </Button>
        }
      >
        {error}
      </Alert>
    </Box>
  )
}
