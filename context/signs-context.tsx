"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { fetchSignsData } from "@/lib/api"

// Типы для знаков и фильтров
interface Sign {
  id: number
  name: string
  latitude: number
  longitude: number
  descriptionGibdd: string | null
  descriptionCommerce: string | null
  sourceGibdd: boolean
  sourceCommerce: boolean
  lastUpdateGibdd: string
  lastUpdateCommerce: string
  mergedStatus: "new" | "updated" | "conflict" | "removed"
}

interface Filters {
  source: "all" | "gibdd" | "commerce" | "both"
  status: string[]
  searchQuery: string
}

interface SignsContextType {
  signs: Sign[]
  filters: Filters
  updateFilters: (newFilters: Partial<Filters>) => void
  fetchSigns: () => Promise<void>
}

// Создание контекста
const SignsContext = createContext<SignsContextType | undefined>(undefined)

// Провайдер контекста
export function SignsProvider({ children }: { children: ReactNode }) {
  const [signs, setSigns] = useState<Sign[]>([])
  const [filters, setFilters] = useState<Filters>({
    source: "all",
    status: [],
    searchQuery: "",
  })

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchSigns()
  }, [])

  // Функция для обновления фильтров
  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  // Функция для загрузки данных с сервера
  const fetchSigns = async () => {
    try {
      const data = await fetchSignsData()
      setSigns(data)
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error)
      throw error
    }
  }

  return <SignsContext.Provider value={{ signs, filters, updateFilters, fetchSigns }}>{children}</SignsContext.Provider>
}

// Хук для использования контекста
export function useSigns() {
  const context = useContext(SignsContext)
  if (context === undefined) {
    throw new Error("useSigns must be used within a SignsProvider")
  }
  return context
}
