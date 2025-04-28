// API service for fetching and updating road signs data

// Define the backend sign structure
export interface BackendSign {
  id: number
  gibdd_unical_id: string | null
  commerce_internal_id: string | null
  name: string
  latitude: string
  longitude: string
  gibdd_description: string | null
  commerce_description: string | null
  source: "gibdd" | "commerce" | "both"
  status: "new" | "updated" | "conflict" | "removed" | null
}

// Define the frontend sign structure (used in the app)
export interface FrontendSign {
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
  mergedStatus: "new" | "updated" | "conflict" | "removed" | null
  gibdd_unical_id?: string | null
  commerce_internal_id?: string | null
}

// Transform backend sign data to frontend format
function transformSignData(backendSign: BackendSign): FrontendSign {
  return {
    id: backendSign.id,
    name: backendSign.name,
    latitude: Number.parseFloat(backendSign.latitude) || 0,
    longitude: Number.parseFloat(backendSign.longitude) || 0,
    descriptionGibdd: backendSign.gibdd_description,
    descriptionCommerce: backendSign.commerce_description,
    sourceGibdd: backendSign.source === "gibdd" || backendSign.source === "both",
    sourceCommerce: backendSign.source === "commerce" || backendSign.source === "both",
    // Since we don't have last update timestamps in the backend data,
    // we'll use current date as a placeholder
    lastUpdateGibdd: new Date().toISOString(),
    lastUpdateCommerce: new Date().toISOString(),
    mergedStatus: backendSign.status,
    gibdd_unical_id: backendSign.gibdd_unical_id,
    commerce_internal_id: backendSign.commerce_internal_id,
  }
}

// Get API configuration
function getApiConfig() {
  if (typeof window === "undefined") {
    return {
      apiUrl: "/api",
      useMockData: true,
    }
  }

  return {
    apiUrl: localStorage.getItem("apiUrl") || "/api",
    useMockData: localStorage.getItem("useMockData") !== "false", // Default to true if not set
  }
}

// Fetch all signs
export async function fetchSignsData(): Promise<FrontendSign[]> {
  const { apiUrl, useMockData } = getApiConfig()

  // If mock data is enabled, return mock data immediately
  if (useMockData) {
    console.log("Using mock data (configured by user)")
    return mockSignsData
  }

  try {
    console.log(`Fetching signs from: ${apiUrl}/united-signs/`)
    const response = await fetch(`${apiUrl}/united-signs/`)

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`)
      // Log the response body for debugging
      const text = await response.text()
      console.error(`Response body: ${text.substring(0, 200)}...`)
      throw new Error(`Error fetching signs: ${response.status} ${response.statusText}`)
    }

    // Check content type to ensure we're getting JSON
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Expected JSON but got ${contentType}`)
      const text = await response.text()
      console.error(`Response body: ${text.substring(0, 200)}...`)
      throw new Error(`API returned non-JSON response: ${contentType || "unknown"}`)
    }

    const data: BackendSign[] = await response.json()
    return data.map(transformSignData)
  } catch (error) {
    console.error("Failed to fetch signs:", error)
    throw error
  }
}

// Update signs data with better error handling
export async function updateSignsData(): Promise<{ message: string; success: boolean }> {
  const { apiUrl, useMockData } = getApiConfig()

  // If mock data is enabled, simulate successful update
  if (useMockData) {
    console.log("Using mock data for update (configured by user)")
    return {
      message: "Имитация обновления данных (используются тестовые данные)",
      success: true,
    }
  }

  try {
    console.log(`Updating signs via: ${apiUrl}/update-signs/`)
    const response = await fetch(`${apiUrl}/update-signs/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Check if response is JSON
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Expected JSON but got ${contentType}`)
      const text = await response.text()
      console.error(`Response body: ${text.substring(0, 200)}...`)
      throw new Error(`API returned non-JSON response: ${contentType || "unknown"}`)
    }

    const data = await response.json()

    if (response.status === 201) {
      return { message: data.detail || "Созданы новые знаки", success: true }
    } else if (response.status === 200) {
      return { message: data.detail || "Знаки обновлены", success: true }
    } else {
      throw new Error(data.detail || "Ошибка при обновлении данных")
    }
  } catch (error) {
    console.error("Failed to update signs:", error)
    throw error
  }
}

// Mock data for development when API is not available
export const mockSignsData: FrontendSign[] = [
  {
    id: 1,
    name: "Знак 'Главная дорога' на перекрестке ул. Ленина",
    latitude: 55.751244,
    longitude: 37.618423,
    descriptionGibdd: "Знак 2.1 'Главная дорога'. Установлен на перекрестке ул. Ленина и ул. Пушкина.",
    descriptionCommerce: "Знак приоритета 2.1, металлический, светоотражающая пленка тип B, состояние хорошее.",
    sourceGibdd: true,
    sourceCommerce: true,
    lastUpdateGibdd: "2024-03-15T00:00:00Z",
    lastUpdateCommerce: "2024-04-01T00:00:00Z",
    mergedStatus: "updated",
    gibdd_unical_id: "G12345",
    commerce_internal_id: "C67890",
  },
  {
    id: 2,
    name: "Знак 'Уступи дорогу' на ул. Гагарина",
    latitude: 55.755814,
    longitude: 37.617635,
    descriptionGibdd: "Знак 2.4 'Уступи дорогу'. Установлен на пересечении с ул. Советской.",
    descriptionCommerce: null,
    sourceGibdd: true,
    sourceCommerce: false,
    lastUpdateGibdd: "2024-02-10T00:00:00Z",
    lastUpdateCommerce: "",
    mergedStatus: "new",
    gibdd_unical_id: "G23456",
    commerce_internal_id: null,
  },
  {
    id: 3,
    name: "Знак 'Пешеходный переход' возле школы №5",
    latitude: 55.753215,
    longitude: 37.622504,
    descriptionGibdd: null,
    descriptionCommerce: "Знак 5.19.1 'Пешеходный переход', двусторонний, на желтом фоне, требуется замена.",
    sourceGibdd: false,
    sourceCommerce: true,
    lastUpdateGibdd: "",
    lastUpdateCommerce: "2024-03-20T00:00:00Z",
    mergedStatus: "conflict",
    gibdd_unical_id: null,
    commerce_internal_id: "C78901",
  },
  {
    id: 4,
    name: "Знак 'Остановка запрещена' на пр. Мира",
    latitude: 55.761665,
    longitude: 37.632324,
    descriptionGibdd: "Знак 3.27 'Остановка запрещена'. Действует по рабочим дням.",
    descriptionCommerce: "Знак 3.27, односторонний, состояние удовлетворительное, требуется очистка.",
    sourceGibdd: true,
    sourceCommerce: true,
    lastUpdateGibdd: "2024-01-25T00:00:00Z",
    lastUpdateCommerce: "2024-04-05T00:00:00Z",
    mergedStatus: "conflict",
    gibdd_unical_id: "G34567",
    commerce_internal_id: "C89012",
  },
  {
    id: 5,
    name: "Знак 'Ограничение скорости 40' на ул. Строителей",
    latitude: 55.758582,
    longitude: 37.642455,
    descriptionGibdd: "Знак 3.24 'Ограничение максимальной скорости' 40 км/ч.",
    descriptionCommerce: "Знак ограничения скорости до 40 км/ч, установлен на опоре освещения.",
    sourceGibdd: true,
    sourceCommerce: true,
    lastUpdateGibdd: "2024-03-01T00:00:00Z",
    lastUpdateCommerce: "2024-03-05T00:00:00Z",
    mergedStatus: "updated",
    gibdd_unical_id: "G45678",
    commerce_internal_id: "C90123",
  },
  {
    id: 6,
    name: "Знак 'Движение без остановки запрещено' на ул. Космонавтов",
    latitude: 55.764976,
    longitude: 37.638575,
    descriptionGibdd: null,
    descriptionCommerce: "Знак 2.5 'Движение без остановки запрещено', требуется замена.",
    sourceGibdd: false,
    sourceCommerce: true,
    lastUpdateGibdd: "",
    lastUpdateCommerce: "2024-02-15T00:00:00Z",
    mergedStatus: "new",
    gibdd_unical_id: null,
    commerce_internal_id: "C01234",
  },
  {
    id: 7,
    name: "Знак 'Въезд запрещен' на ул. Парковой",
    latitude: 55.769768,
    longitude: 37.644772,
    descriptionGibdd: "Знак 3.1 'Въезд запрещен'. Кирпич.",
    descriptionCommerce: null,
    sourceGibdd: true,
    sourceCommerce: false,
    lastUpdateGibdd: "2023-12-10T00:00:00Z",
    lastUpdateCommerce: "",
    mergedStatus: "removed",
    gibdd_unical_id: "G56789",
    commerce_internal_id: null,
  },
  {
    id: 8,
    name: "Знак 'Парковка' у торгового центра",
    latitude: 55.753559,
    longitude: 37.609218,
    descriptionGibdd: "Знак 6.4 'Парковка (парковочное место)'.",
    descriptionCommerce: "Знак 6.4 'Место стоянки', с дополнительной информацией о режиме работы.",
    sourceGibdd: true,
    sourceCommerce: true,
    lastUpdateGibdd: "2024-01-15T00:00:00Z",
    lastUpdateCommerce: "2024-04-10T00:00:00Z",
    mergedStatus: "updated",
    gibdd_unical_id: "G67890",
    commerce_internal_id: "C12345",
  },
  {
    id: 9,
    name: "Знак 'Обгон запрещен' на Садовом кольце",
    latitude: 55.757539,
    longitude: 37.626904,
    descriptionGibdd: "Знак 3.20 'Обгон запрещен'.",
    descriptionCommerce: "Знак 3.20, состояние хорошее.",
    sourceGibdd: true,
    sourceCommerce: true,
    lastUpdateGibdd: "2024-02-20T00:00:00Z",
    lastUpdateCommerce: "2024-02-25T00:00:00Z",
    mergedStatus: "updated",
    gibdd_unical_id: "G78901",
    commerce_internal_id: "C23456",
  },
  {
    id: 10,
    name: "Знак 'Тупик' на ул. Заречной",
    latitude: 55.748215,
    longitude: 37.631294,
    descriptionGibdd: null,
    descriptionCommerce: "Знак 6.8.1 'Тупик', требуется обновление.",
    sourceGibdd: false,
    sourceCommerce: true,
    lastUpdateGibdd: "",
    lastUpdateCommerce: "2024-03-15T00:00:00Z",
    mergedStatus: "new",
    gibdd_unical_id: null,
    commerce_internal_id: "C34567",
  },
]
