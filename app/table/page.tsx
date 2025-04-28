"use client"

import { useState, useEffect } from "react"
import { Container, Box, Typography, Paper, Button } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import CircularProgress from "@mui/material/CircularProgress"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

import { SignsProvider } from "@/context/signs-context"
import { theme } from "@/lib/theme"
import RefreshButton from "@/components/refresh-button"
import SearchBar from "@/components/search-bar"
import ApiConfig from "@/components/api-config"
import ErrorDisplay from "@/components/error-display"

const FilterPanel = dynamic(() => import("@/components/filter-panel"), { ssr: false })
const EnhancedSignsTable = dynamic(() => import("@/components/enhanced-signs-table"), { ssr: false })

// Create a separate component for the table content that uses the useSigns hook
function TableContent() {
  // This component will be rendered inside the SignsProvider
  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Link href="/" passHref>
          <Button startIcon={<ArrowLeft size={16} />} variant="outlined" sx={{ mr: 2 }}>
            Вернуться на карту
          </Button>
        </Link>
        <Typography variant="h4" component="h1">
          Таблица дорожных знаков
        </Typography>
      </Box>

      <div id="api-config">
        <ApiConfig />
      </div>

      <ErrorDisplay />

      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <SearchBar />
        <RefreshButton />
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <FilterPanel />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <EnhancedSignsTable />
      </Paper>
    </Container>
  )
}

// Main TablePage component that doesn't use useSigns directly
export default function TablePage() {
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    // Имитация загрузки данных при первом рендере
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (initialLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SignsProvider>
        <TableContent />
      </SignsProvider>
    </ThemeProvider>
  )
}
