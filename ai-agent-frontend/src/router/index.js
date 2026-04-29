import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatView from '../views/ChatView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/love',
    name: 'love',
    component: ChatView,
    props: {
      title: 'AI 恋爱大师',
      description: '细腻分析情感困惑，给出自然可执行的沟通建议',
      mode: 'love'
    }
  },
  {
    path: '/manus',
    name: 'manus',
    component: ChatView,
    props: {
      title: 'AI 超级智能体',
      description: '面向复杂任务的实时智能体助手',
      mode: 'manus'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
