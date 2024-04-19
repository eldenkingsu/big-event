<!-- 抽屉组件 -->
<script setup>
import ChannelSelect from './ChannelSelect.vue'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishListService,
  artGetDetailService,
  artEditService
} from '@/api/article'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import axios from 'axios'
const visibileDrawer = ref(false)
//控制抽屉显示与隐藏
const editorRef = ref()
const open = async (row) => {
  visibileDrawer.value = true //显示抽屉
  //console.log(row)
  if (row.id) {
    // 需要基于row.id发送请求，获取编辑对应详情数据
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    //图片需要单独回显
    imgUrl.value = baseURL + formModel.value.cover_img
    const file = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    formModel.value = { ...defaultForm } //基于默认数据重制form数据
    imgUrl.value = ''
    // editorRef.value.setHTML('')
  }
}
//// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}

//向外暴露open方法调节抽屉的显示与隐藏
defineExpose({
  open
})
//默认数据
const defaultForm = {
  title: '', //标题
  cate_id: '', //分类id
  cover_img: '', //封面图片
  content: '', //string内容
  state: '' //状态
}
//准备数据
const formModel = ref({
  ...defaultForm
})
//图片上传
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}

//提交
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  formModel.value.state = state //将状态赋值为草稿或者已上传
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  //发请求
  if (formModel.value.id) {
    //编辑操作
    artEditService(fd)
    setTimeout(() => {
      ElMessage.success('修改成功')
      visibileDrawer.value = false
      emit('success', 'add')
    }, 500)
  } else {
    await artPublishListService(fd)
    ElMessage.success('添加成功')
    visibileDrawer.value = false
    emit('success', 'add')
  }
}
</script>

<template>
  <el-drawer
    v-model="visibileDrawer"
    :title="formModel.id ? '编辑图片' : '添加图片'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <channel-select v-model="formModel.cate_id" width="100%"></channel-select>

      <el-form-item label="图片内容" prop="cover_img">
        <!-- 此处需要关闭element-plus的自动上传 -->
        <el-upload
          v-model="formModel.cover_img"
          class="avatar-uploader"
          :show-file-list="false"
          auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="内容概述" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
