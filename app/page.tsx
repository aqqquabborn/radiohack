"use client"

import { useState, useEffect } from "react"
import { Container, Box, Typography, Paper, Button } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import CircularProgress from "@mui/material/CircularProgress"
import { Table2 } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

import { SignsProvider } from "@/context/signs-context"
import { theme } from "@/lib/theme"
const MapView = dynamic(() => import("@/components/map-view"), { ssr: false })
import FilterPanel from "@/components/filter-panel"
import RefreshButton from "@/components/refresh-button"
import SearchBar from "@/components/search-bar"
import ApiConfig from "@/components/api-config"
import ErrorDisplay from "@/components/error-display"

// Create a separate component for the main content that uses the useSigns hook
function HomeContent() {
  // This component will be rendered inside the SignsProvider
  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Система мониторинга дорожных знаков
        </Typography>
        <Link href="/table" passHref>
          <Button startIcon={<Table2 size={16} />} variant="outlined">
            Перейти к таблице
          </Button>
        </Link>
      </Box>

      <div id="api-config">
        <ApiConfig />
      </div>

      <ErrorDisplay />

      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <SearchBar />
        <RefreshButton />
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
        <Paper sx={{ flex: 1, p: 2, mb: 2 }}>
          <FilterPanel />
        </Paper>

        <Paper sx={{ flex: 2, height: "500px", mb: 2 }}>
          <MapView />
        </Paper>
      </Box>
    </Container>
  )
}

// Main Home component that doesn't use useSigns directly
export default function Home() {
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
        <HomeContent />
      </SignsProvider>
    </ThemeProvider>
  )
}
