<script setup>
//在vue3compositionApi中
//1.获取路由对象 router useRouter
//const router= useRouter()
//2.获取路由参数 route useRouter
//const route =useRoute

import { useRoute, useRouter } from 'vue-router'
import { useUserStore, useCountStore } from '@/stores/index'
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const counterStore = useCountStore()
const goList = () => {
  console.log(router, route)
  router.push('/list')
}
</script>

<template>
  <div>
    我是app
    <el-button @click="$router.push('/home')">跳首页</el-button>
    <el-button @click="goList">跳页表页</el-button>
    <p>{{ userStore.token }}</p>
    <el-button @click="userStore.setToken('yjy到此一游')">登录</el-button>
    <el-button @click="userStore.removeToken">退处</el-button>
    <hr />
    {{ counterStore.count }}
    <el-button @click="counterStore.add">加一baby</el-button>
  </div>
</template>

<style scoped></style>
