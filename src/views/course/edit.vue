<template>
  <div class="course-edit-page">
    <el-form label-width="100px">
      <div class="course-file">
        <el-form-item label="实验图片" style="width: 50%">
          <el-image :src="imageUrl" style="width: 200px; height: 120px" :auto-upload="false" />
          <el-upload action="#" :http-request="readImage" class="avatar-uploader" :show-file-list="false">
            <i class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="实验文件">
          <el-upload action="#" class="file-upload" drag :http-request="readFile" show-file-list :file-list="fileList" :on-remove="removeFile">
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传包含ipynb的tar文件</div>
          </el-upload>
          <el-input v-model="course.coursefile" style="display: none" />
        </el-form-item>
      </div>
      <el-form-item label="实验名称">
        <el-input v-model="course.coursename" size="small" style="width: 50%" />
      </el-form-item>
      <el-form-item label="实验时间">
        <el-input-number v-model="course.coursetime" size="small" />
      </el-form-item>
      <el-form-item label="实验详情">
        <markdown-editor ref="markdown" v-model="course.coursedetail" :height="height" />
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCourseById, editCourse, uploadImage, updateCourseToDocker } from '../../api/course'
import MarkdownEditor from '@/components/MarkdownEditor'
import 'tui-editor/dist/tui-editor-contents.css'

export default {
  name: 'Edit',
  components: { MarkdownEditor },
  data() {
    return {
      course: {},
      content: '',
      height: '300px',
      imageUrl: '',
      imageFile: null,
      courseFile: null,
      fileList: []
    }
  },
  mounted() {
    this.height = document.body.clientHeight - 470 + 'px'
  },
  created() {
    getCourseById(this.$route.query.id).then((res) => {
      this.course = res.data.course
      this.course.courseId = res.data.course.id
      this.imageUrl = res.data.course.courseavater
    })
  },
  methods: {
    readImage(data) {
      const isJPG = data.file.type === 'image/jpeg' || data.file.type === 'image/png'
      const isLt2M = data.file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
        return isJPG && isLt2M
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
        return isJPG && isLt2M
      }

      const rd = new FileReader() // 创建文件读取对象
      rd.readAsDataURL(data.file) // 文件读取装换为base64类型
      rd.onloadend = () => {
        this.imageUrl = rd.result // this指向当前方法onloadend的作用域
      }
      this.imageFile = data.file
    },
    readFile(data) {
      if (data.file.type !== 'application/x-tar') {
        this.fileList = []
        this.$message.error('上传实验文件只能是 tar 格式!')
      } else {
        this.courseFile = data.file
      }
    },
    removeFile() {
      this.courseFile = null
    },
    async saveEdit() {
      try {
        if (this.imageFile) {
          const form = new FormData()
          form.append('file', this.imageFile)
          const { data } = await uploadImage(form)
          this.course.courseavater = data
        }
        if (this.courseFile) {
          const form = new FormData()
          form.append('file', this.courseFile)
          form.append('token', new Date().getTime().toString())
          await updateCourseToDocker(this.course.courseId, form)
        }
        const res = await editCourse(this.course)
        if (res.errCode === 200) {
          this.$message.success('修改成功')
        } else {
          this.$message.error(res.errMsg)
        }
      } catch (e) {
        this.$message.error('修改失败')
      }
    }
  }
}
</script>

<style lang="scss">
.course-edit-page {
  width: 100%;
  height: 100%;
  .course-file {
    display: flex;
  }
  .avatar-uploader {
    display: inline-block;
    margin-left: 10px;
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover{
        border-color: #409EFF;
      }
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
  }
  .file-upload {
    .el-upload {
      width: 200px;
      height: 120px;
      .el-upload-dragger {
        width: 100%;
        height: 100%;
      }

      .el-icon-upload {
        font-size: 50px;
        color: #c0c4cc;
        margin-top: 20px
      }
      .el-upload__text {
        color: #606266;
        font-size: 12px;
        text-align: center;
        margin-top: -18px;
        em {
          color: #409eff;
          font-style: normal;
        }
      }
    }
    .el-upload__tip {
      display: inline-block;
      line-height: 20px;
      margin-left: 10px;
    }
  }
}
</style>
