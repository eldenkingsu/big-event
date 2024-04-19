<script setup>
import { artGetChannelsService } from '@/api/article.js'
import { ref } from 'vue'
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})
const emit = defineEmits(['update:modelValue'])
const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  //console.log(res)
  channelList.value = res.data.data
}
getChannelList()
</script>
<template>
  <el-form-item label="图片分类:">
    <el-select
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      :style="{ width }"
      style="width: 240px"
    >
      <!-- label展示给用户看，value提交给后台 -->
      <el-option
        v-for="item in channelList"
        :label="item.cate_name"
        :value="item.id"
        :key="item.id"
      >
      </el-option>
      <!-- <el-option label="农业遥感图片" value="100"> </el-option> -->
    </el-select>
  </el-form-item>
</template>
