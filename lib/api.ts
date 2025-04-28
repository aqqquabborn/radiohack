// Имитация API для получения данных о дорожных знаках
// В реальном приложении здесь будет запрос к серверу

import { mockSignsData } from "./mock-data"

export async function fetchSignsData() {
  // Имитация задержки сетевого запроса
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSignsData)
    }, 800)
  }).then(() => mockSignsData)

  // Реальный запрос к API будет выглядеть примерно так:
  // const response = await fetch('/api/signs');
  // if (!response.ok) {
  //   throw new Error('Ошибка при загрузке данных');
  // }
  // return response.json();
}
