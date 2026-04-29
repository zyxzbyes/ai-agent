<template>
  <main class="home-shell">
    <section class="home-hero">
      <p class="eyebrow">AI 应用中心</p>
      <h1>选择一个应用开始对话</h1>
      <p class="home-copy">两个应用共用流式聊天室体验，消息会实时展示在当前会话中。</p>
    </section>

    <section class="app-grid" aria-label="应用列表">
      <RouterLink class="app-tile love-tile" to="/love">
        <span class="tile-mark">Love</span>
        <strong>AI 恋爱大师</strong>
        <span>分析聊天、关系推进、约会建议和情绪回应。</span>
      </RouterLink>

      <RouterLink class="app-tile manus-tile" to="/manus">
        <span class="tile-mark">Agent</span>
        <strong>AI 超级智能体</strong>
        <span>处理开放式任务，流式返回执行思路和结果。</span>
      </RouterLink>
    </section>
  </main>
</template>
