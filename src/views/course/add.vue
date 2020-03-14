<template>
  <div class="course-add-page">
    <el-form ref="form" label-width="100px" :model="course" :rules="formRule">
      <div class="course-file">
        <el-form-item label="课程图片" prop="courseavater" style="width: 50%">
          <el-image :src="course.courseavater" style="width: 200px; height: 120px" :auto-upload="false">
            <div slot="error" class="el-image__error" v-html="errorTips" />
          </el-image>
          <el-upload action="#" :http-request="readImage" class="avatar-uploader" :show-file-list="false">
            <i class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <el-input v-model="course.courseavater" style="display: none" />
        </el-form-item>
        <el-form-item label="课程文件" prop="coursefile">
          <el-upload action="#" class="file-upload" drag :http-request="readFile" :on-remove="removeFile" show-file-list :file-list="fileList">
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传包含ipynb的tar文件</div>
          </el-upload>
          <el-input v-model="course.coursefile" style="display: none" />
        </el-form-item>
      </div>
      <el-form-item label="课程名称" prop="coursename">
        <el-input v-model="course.coursename" size="small" style="width: 50%" />
      </el-form-item>
      <el-form-item label="课程类别" prop="catalogId">
        <el-select v-model="course.catalogId" placeholder="请选择分类" size="small">
          <el-option
            v-for="item in catalogs"
            :key="item.id"
            :label="item.catlogname"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课程时间" prop="coursetime">
        <el-input-number v-model="course.coursetime" size="small" :min="0" />
      </el-form-item>
      <el-form-item label="课程详情" prop="coursedetail">
        <markdown-editor ref="markdown" v-model="course.coursedetail" :height="height" />
        <el-input v-model="course.coursedetail" style="display: none" />
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addCourse, getCatalogs, updateCourseToDocker, uploadImage } from '../../api/course'
import MarkdownEditor from '@/components/MarkdownEditor'

export default {
  name: 'Add',
  components: { MarkdownEditor },
  data() {
    const validateTime = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('课程时间必须大于0'))
      } else {
        callback()
      }
    }
    const validateImage = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请上传图片'))
      } else if (value === 'error') {
        callback(new Error('非法图片上传'))
      } else {
        callback()
      }
    }
    const validateFile = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请上传课程文件'))
      } else if (value === 'error') {
        callback(new Error('非法文件上传'))
      } else {
        callback()
      }
    }
    return {
      course: {
        catalogId: '',
        catlogList: [],
        coursename: '',
        coursedetail: '',
        courseavater: '',
        createuserid: null,
        coursetime: 0,
        coursefile: ''
      },
      catalogs: [],
      imageFile: null,
      courseFile: null,
      height: '300px',
      formRule: {
        catalogId: { required: true, message: '请选择课程分类', trigger: 'change' },
        courseavater: { required: true, validator: validateImage, trigger: 'change' },
        coursename: { required: true, message: '请输入课程名称', trigger: 'blur' },
        coursedetail: { required: true, message: '请输入课程详情', trigger: 'change' },
        coursetime: { required: true, validator: validateTime, trigger: 'change', type: 'number' },
        coursefile: { required: true, validator: validateFile, trigger: 'change' }
      },
      fileList: []
    }
  },
  computed: {
    errorTips() {
      if (this.course.courseavater.length === 0) {
        return '请上传png或jpg图片'
      } else {
        return '<i class="el-icon-picture-outline"></i>'
      }
    },
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    getCatalogs().then((res) => {
      this.catalogs = res.data.records
    })
  },
  mounted() {
    this.height = document.body.clientHeight - 535 + 'px'
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
        this.course.courseavater = rd.result // this指向当前方法onloadend的作用域
        this.$refs.upload.clearValidate()
      }
      this.imageFile = data.file
    },
    readFile(data) {
      if (data.file.type !== 'application/x-tar') {
        this.course.coursefile = 'error'
        this.fileList = []
      } else {
        this.course.coursefile = 'file'
        this.courseFile = data.file
      }
    },
    removeFile() {
      this.courseFile = null
      this.course.coursefile = ''
    },
    async saveEdit() {
      if (this.imageFile) {
        const form = new FormData()
        form.append('file', this.imageFile)
        const { data } = await uploadImage(form)
        if (data === '上传失败，文件内容不符合要求') {
          this.course.courseavater = 'error'
          return false
        }
        this.course.courseavater = data
      }
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          try {
            this.course.createuserid = this.userInfo.id
            const index = this.catalogs.findIndex((item) => item.id === this.course.catalogId)
            this.course.catlogList[0] = Object.assign(this.catalogs[index], { createtime: '', replacetime: '' })
            const res = await addCourse(this.course)
            const { courseId, token } = res.data
            const form = new FormData()
            form.append('token', token)
            form.append('file', this.courseFile)
            updateCourseToDocker(courseId, form).then(() => {
              this.$message.success('添加成功')
            })
          } catch (e) {
            this.$message.error(e.toString().replace('Error: ', ''))
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .course-add-page {
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
    .el-image {
      .el-icon-picture-outline {
        color: #5a5e66;
        font-size: 40px;
      }
    }
  }
</style>
