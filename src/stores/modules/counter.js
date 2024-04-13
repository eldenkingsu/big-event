import { defineStore } from 'pinia'
import { ref } from 'vue'

//数字技术其模块
export const useCountStore = defineStore(
  'big-count',
  () => {
    const count = ref('100')
    const add = () => {
      count.value++
    }
    return {
      count,
      add
    }
  },
  {
    persist: 'true'
  }
)
