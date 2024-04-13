import { createRouter, createWebHistory } from 'vue-router'
//createRouter 创建路由实例
//1.history模式：createWebHistory
//2.hash模式：createwebHashHistory
const router = createRouter({
  history: createWebHistory('yjy'),
  routes: []
})

export default router
