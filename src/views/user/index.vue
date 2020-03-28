<template>
  <div class="app-container">
    <el-table
      ref="table"
      v-loading="listLoading"
      :data="list"
      :expand-row-keys="expands"
      row-key="id"
      border
    >
      <el-table-column
        v-for="(header, index) in headers"
        :key="index"
        :prop="header.prop"
        :label="header.label"
        :sortable="header.prop === 'time' || header.prop === 'id'"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1">
        <template slot-scope="props">
          <el-form inline class="demo-table-expand">
            <el-form-item label="头像">
              <img :src="props.row.avatar" width="60" height="60" alt="">
            </el-form-item>
            <el-form-item label="账号名">
              <span>{{ props.row.account }}</span>
            </el-form-item>
            <el-form-item label="昵称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.sex }}</span>
            </el-form-item>
            <el-form-item label="手机号">
              <span>{{ props.row.phone }}</span>
            </el-form-item>
            <el-form-item label="邮箱">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="加入时间">
              <span>{{ props.row.time }}</span>
            </el-form-item>
            <el-form-item label="账号状态">
              <el-select v-model="formData.status" size="mini">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="formData.roleId" size="mini">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click.native="saveEdit">保存</el-button>
            </el-form-item>
          </el-form>
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
import { getUsers, editUser, deleteUser } from '../../api/user'

export default {
  data() {
    return {
      list: [{
        id: -1
      }],
      totalList: null,
      listLoading: true,
      headers: [
        {
          label: 'id',
          prop: 'id'
        }, {
          label: '账号名',
          prop: 'account'
        }, {
          label: '昵称',
          prop: 'name'
        }, {
          label: '性别',
          prop: 'sex'
        }, {
          label: '账号状态',
          prop: 'status'
        }, {
          label: '角色',
          prop: 'role'
        }, {
          label: '创建时间',
          prop: 'time'
        }],
      page: 1,
      limit: Number(localStorage.userLimit) || 12,
      total: 0,
      statusOptions: [
        {
          label: '已激活',
          value: 1
        }, {
          label: '冻结中',
          value: 2
        }],
      roleOptions: [
        {
          label: '管理员',
          value: 1
        }, {
          label: '广告员',
          value: 2
        }, {
          label: '学生',
          value: 3
        }],
      formData: {
        userId: -1,
        status: 0,
        roleId: 0
      },
      expands: [],
      row: -1,
      roles: ['', '管理员', '广告员', '学生'],
      statuses: ['', '已激活', '冻结中']
    }
  },
  watch: {
    list: {
      handler() {
      },
      deep: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const { data } = await getUsers({
        pages: this.page,
        size: this.limit
      })
      this.list = data.records.map((item) => {
        return {
          id: item.id,
          avatar: item.avatar,
          account: item.account,
          name: item.name,
          sex: item.sex === 1 ? '男' : '女',
          time: item.createtime,
          status: this.statuses[item.status],
          role: this.roles[item.roleid],
          phone: item.phone,
          email: item.email
        }
      })
      this.total = data.total
      this.listLoading = false
    },
    handleEdit(index, row) {
      if (row.id === this.expands[0]) {
        this.expands = []
        return
      }
      this.row = index
      let role = -1
      this.formData.userId = row.id
      this.formData.status = this.list[this.row].status === '已激活' ? 1 : 2
      if (this.list[this.row].role === '管理员') {
        role = 1
      } else if (this.list[this.row].role === '广告员') {
        role = 2
      } else if (this.list[this.row].role === '学生') {
        role = 3
      }
      this.formData.roleId = role
      this.expands = [row.id]
    },
    saveEdit() {
      editUser(this.formData).then((res) => {
        if (res.errCode === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.list[this.row].status = this.formData.status === 1 ? '已激活' : '冻结中'
          let role = ''
          switch (this.formData.roleId) {
            case 1:
              role = '管理员'
              break
            case 2:
              role = '广告员'
              break
            case 3:
              role = '学生'
              break
          }
          this.list[this.row].role = role
        } else {
          this.$message({
            message: res.errMsg,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$message({
          message: '修改失败',
          type: 'error'
        })
      })
    },
    handleDelete(row, user) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(user.id).then((res) => {
          if (res.errCode === 200) {
            this.list.splice(row, 1)
            this.$message({
              type: 'success',
              message: res.errMsg
            })
          } else {
            this.$message({
              type: 'error',
              message: res.errMsg
            })
          }
        }).catch((e) => {
          this.$message({
            type: 'error',
            message: e
          })
        })
      })
    },
    handleSizeChange(size) {
      this.limit = size
      localStorage.userLimit = size
      this.fetchData()
    },
    handleCurrentChange(page) {
      this.page = page
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    margin: -20px;
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

    .el-pagination {
      margin-top: 10px;
      text-align: right;
    }
  }
</style>
