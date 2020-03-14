<template>
  <div class="list-page">
    <el-button type="primary" size="medium" icon="el-icon-edit" @click="goTo">添加课程</el-button>
    <el-table
      ref="table"
      v-loading="listLoading"
      :data="list"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{ textAlign: 'center' }"
      element-loading-text="Loading"
      border
      @row-click="toggle"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form inline class="demo-table-expand" label-position="left">
            <el-form-item label="课程id">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="课程名称">
              <span>{{ props.row.coursename }}</span>
            </el-form-item>
            <el-form-item label="课程图片">
              <el-image :src="props.row.courseavater" style="width: 180px; height: 105px" alt="" />
            </el-form-item>
            <el-form-item label="课程详情">
              <div v-html="props.row.coursedetail" />
            </el-form-item>
            <el-form-item label="学习人数">
              <span>{{ props.row.joinnumber }}</span>
            </el-form-item>
            <el-form-item label="课程评分">
              <span>{{ props.row.rate }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.createtime }}</span>
            </el-form-item>
            <el-form-item label="修改时间">
              <span>{{ props.row.replacetime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(header, index) in headers"
        :key="index"
        :prop="header.prop"
        :label="header.label"
        :sortable="header.prop === 'createtime' || header.prop === 'id' || header.prop === 'replacetime'"
        :width="getWidth(header)"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click.stop="goTo(scope.row.id)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click.stop="handleDelete(scope.$index, scope.row.id)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-sizes="[9, 12, 15]"
      :page-size="limit"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total"
      hide-on-single-page
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { deleteCourses, getCourses } from '../../api/course'

export default {
  data() {
    return {
      headers: [
        {
          label: 'id',
          prop: 'id'
        }, {
          label: '课程名称',
          prop: 'coursename'
        }, {
          label: '课程评分',
          prop: 'rate'
        }, {
          label: '学习人数',
          prop: 'joinnumber'
        }, {
          label: '课程时间 / 分',
          prop: 'coursetime'
        }, {
          label: '创建时间',
          prop: 'createtime'
        }, {
          label: '修改时间',
          prop: 'replacetime'
        }
      ],
      list: [],
      listLoading: true,
      page: 1,
      limit: Number(localStorage.courseLimit) || 12,
      total: 0
    }
  },
  created() {
    this.getCourse()
  },
  methods: {
    toggle(row) {
      this.$refs.table.toggleRowExpansion(row)
    },
    getWidth(header) {
      const label = header.label
      if (label === 'id' || label === '课程评分') {
        return 80
      } else if (label === '学习人数' || label === '课程时间 / 分') {
        return 120
      }
    },
    handleDelete(row, id) {
      this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCourses(id).then((res) => {
          if (res.errCode === 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.list.splice(row, 1)
          } else {
            this.$message({
              type: 'error',
              message: res.errMsg
            })
          }
        }).catch(e => {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        })
      })
    },
    handleSizeChange(size) {
      this.limit = size
      localStorage.courseLimit = size
      this.getCourse()
    },
    handleCurrentChange(page) {
      this.page = page
      this.getCourse()
    },
    goTo(id) {
      if (typeof id === 'number') {
        this.$router.push(`/course/edit?id=${id}`)
      } else {
        this.$router.push('/course/add')
      }
    },
    getCourse() {
      this.listLoading = true
      getCourses({
        pages: this.page,
        size: this.limit
      }).then((res) => {
        this.list = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .list-page {
    width: 100%;

    .el-table {
      margin-top: 20px;

      .demo-table-expand {
        font-size: 0;

        label {
          width: 90px;
          color: #99a9bf;
        }

        .el-form-item {
          margin-right: 0;
          margin-bottom: 0;
          width: 50%;
        }
      }
    }

    .el-pagination {
      margin-top: 10px;
      text-align: right;
    }
  }
</style>

