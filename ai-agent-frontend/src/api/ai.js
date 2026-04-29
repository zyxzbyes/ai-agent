import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const aiRequest = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
})

export function createChatStreamUrl(mode, message, chatId) {
  const url = mode === 'love' ? '/ai/love_app/chat/sse' : '/ai/manus/chat'
  const params = mode === 'love' ? { message, chatId } : { message }

  return aiRequest.getUri({
    url,
    params
  })
}
