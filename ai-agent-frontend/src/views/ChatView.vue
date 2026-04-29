<template>
  <main class="chat-shell">
    <header class="chat-header">
      <RouterLink class="back-link" to="/" aria-label="返回主页">←</RouterLink>
      <div>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>
      <span class="session-badge">会话 {{ chatId }}</span>
    </header>

    <section ref="messageListRef" class="message-list" aria-live="polite">
      <div v-for="message in messages" :key="message.id" :class="['message-row', message.role]">
        <article class="message-bubble">
          <span class="message-author">{{ message.role === 'user' ? '你' : 'AI' }}</span>
          <p>{{ message.content }}</p>
        </article>
      </div>
    </section>

    <form class="composer" @submit.prevent="sendMessage">
      <textarea
        v-model="inputText"
        :disabled="isStreaming"
        rows="1"
        placeholder="输入消息，按 Enter 发送，Shift + Enter 换行"
        @keydown.enter.exact.prevent="sendMessage"
      />
      <button type="submit" :disabled="!canSend">
        {{ isStreaming ? '回复中' : '发送' }}
      </button>
    </form>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { createChatStreamUrl } from '../api/ai'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    required: true,
    validator: (value) => ['love', 'manus'].includes(value)
  }
})

const chatId = ref(createChatId())
const inputText = ref('')
const isStreaming = ref(false)
const messages = ref([
  {
    id: crypto.randomUUID(),
    role: 'assistant',
    content:
      props.mode === 'love'
        ? '你好，我是 AI 恋爱大师。把你的情感问题或聊天上下文发给我吧。'
        : '你好，我是 AI 超级智能体。告诉我你要完成的任务，我会实时输出处理过程。'
  }
])
const messageListRef = ref(null)
let eventSource = null

const canSend = computed(() => inputText.value.trim().length > 0 && !isStreaming.value)

function createChatId() {
  return `chat-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

async function scrollToBottom() {
  await nextTick()
  const element = messageListRef.value
  if (element) {
    element.scrollTop = element.scrollHeight
  }
}

function appendAssistantChunk(messageId, chunk) {
  const target = messages.value.find((message) => message.id === messageId)
  if (!target) return

  target.content += chunk
  scrollToBottom()
}

function closeStream() {
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
  isStreaming.value = false
}

function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isStreaming.value) return

  closeStream()

  messages.value.push({
    id: crypto.randomUUID(),
    role: 'user',
    content: text
  })

  const assistantMessageId = crypto.randomUUID()
  messages.value.push({
    id: assistantMessageId,
    role: 'assistant',
    content: ''
  })

  inputText.value = ''
  isStreaming.value = true
  scrollToBottom()

  const streamUrl = createChatStreamUrl(props.mode, text, chatId.value)
  eventSource = new EventSource(streamUrl)

  eventSource.onmessage = (event) => {
    if (event.data === '[DONE]') {
      closeStream()
      return
    }
    appendAssistantChunk(assistantMessageId, event.data)
  }

  eventSource.onerror = () => {
    appendAssistantChunk(assistantMessageId, '\n\n连接中断，请稍后重试。')
    closeStream()
  }
}

onBeforeUnmount(() => {
  closeStream()
})
</script>
