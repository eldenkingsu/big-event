<!-- 点击添加分类弹出框 -->
<script setup>
import { artEditChannelsService, artAddChannelsService } from '@/api/article'

import { ref } from 'vue'
const dialogVisible = ref(false)

const emit = defineEmits(['success'])
const formRef = ref()
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
//组件对外暴露方法
//open({})=>表单无需渲染
//open({id,cate_name})=>表单需要渲染
const open = (row) => {
  dialogVisible.value = true
  formModel.value = { ...row }
}

const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须一到10位非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^\S[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1到15位的字母或数字',
      trigger: 'blur'
    }
  ]
}
//向外暴露方法
defineExpose({
  open
})

//点击提交修改
const onSubmit = async () => {
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    await artEditChannelsService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelsService(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  emit('success')
}
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form ref="formRef" :model="formModel" :rules="rules">
      <el-form-item prop="cate_name" label="分类名称">
        <el-input
          v-model="formModel.cate_name"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item prop="cate_alias" label="分类别名">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="请输入分类别名"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
