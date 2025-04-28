"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { fetchSignsData, updateSignsData, type FrontendSign } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

// Типы для фильтров
interface Filters {
  source: "all" | "gibdd" | "commerce" | "both"
  status: string[]
  searchQuery: string
}

interface SignsContextType {
  signs: FrontendSign[]
  filters: Filters
  updateFilters: (newFilters: Partial<Filters>) => void
  fetchSigns: () => Promise<void>
  updateSigns: () => Promise<void>
  loading: boolean
  error: string | null
}

// Создание контекста
const SignsContext = createContext<SignsContextType | undefined>(undefined)

// Провайдер контекста
export function SignsProvider({ children }: { children: ReactNode }) {
  const [signs, setSigns] = useState<FrontendSign[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [filters, setFilters] = useState<Filters>({
    source: "all",
    status: [],
    searchQuery: "",
  })

  // Add error state to the context
  const [error, setError] = useState<string | null>(null)

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
    setLoading(true)
    try {
      const data = await fetchSignsData()
      setSigns(data)
      // If we successfully loaded data, clear any previous error
      setError(null)
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error)

      // Check if we're using mock data
      const useMockData = typeof window !== "undefined" && localStorage.getItem("useMockData") !== "false"

      if (useMockData) {
        // If using mock data, don't show error toast
        setError(null)
      } else {
        setError("Не удалось загрузить данные с API. Проверьте настройки подключения.")
        toast({
          title: "Ошибка загрузки",
          description:
            "Не удалось загрузить данные с API. Проверьте настройки подключения или включите тестовые данные.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Функция для обновления данных
  const updateSigns = async () => {
    setLoading(true)
    try {
      const result = await updateSignsData()

      toast({
        title: "Успешно",
        description: result.message,
        variant: "default",
      })

      // Перезагружаем данные после успешного обновления
      await fetchSigns()
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error)

      // Check if we're using mock data
      const useMockData = typeof window !== "undefined" && localStorage.getItem("useMockData") !== "false"

      if (!useMockData) {
        toast({
          title: "Ошибка обновления",
          description: "Не удалось обновить данные. Проверьте настройки подключения или включите тестовые данные.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <SignsContext.Provider value={{ signs, filters, updateFilters, fetchSigns, updateSigns, loading, error }}>
      {children}
    </SignsContext.Provider>
  )
}

// Хук для использования контекста
export function useSigns() {
  const context = useContext(SignsContext)
  if (context === undefined) {
    throw new Error("useSigns must be used within a SignsProvider")
  }
  return context
}
