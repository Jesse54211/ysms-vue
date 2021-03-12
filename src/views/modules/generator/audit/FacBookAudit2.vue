<template>
  <el-dialog
    title="审核预约"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%"
  >

    <el-form
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
      size="mini"
    >

      <el-row>
        <el-alert
          show-icon
          title="请审核..."
          type="warning">
        </el-alert>

        <el-col :span="6">
          <el-form-item label="名称">
            {{ dataForm.name }}
          </el-form-item>
        </el-col>


      </el-row>
    </el-form>

    <el-table
      :data="dataList"
      border
      style="width: 100%;">

      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="facNum"
        header-align="center"
        align="center"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="设备名称">
      </el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="passAudit(scope.row.id)">通过</el-button>
          <el-button type="text" size="small" @click="refusAudit(scope.row.id)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    {{dataList}}


    <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>

  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataList: [],
      dataForm: {
        id: 0,
        facNum: '',
        name: '',
        user: '',
        dep: '',
        outTime: '',
        retnTime: '',
        nextTime1: '',
        nextTime2: '',
        nextTime3: '',
        remark: '',
        model: '',
        unit: '',
        kind: '',
        status: ''
      }
    }
  },
  methods: {
    init (id) {
      console.log(id+"......")
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/generator/pfac/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.facNum = data.pFac.facNum
              this.dataForm.name = data.pFac.name

              this.$http({
                url: this.$http.adornUrl('/generator/pfacout/list'),
                method: 'get',
                params: this.$http.adornParams({
                  'page': this.pageIndex,
                  'limit': this.pageSize,
                  'key': this.dataForm.facNum,
                  'status': 2
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataList = data.page.list
                  console.log(data+"00.0.")
                  this.dataList = data.page.list
                  // this.totalPage = data.page.totalCount
                } else {
                  // this.dataList = []
                  // this.totalPage = 0
                }
              })
            }
          })
        }
        //再拿fac的num查facout的信息

      })
    },
    // 表单提交
    refusAudit(id){
      this.$http({
        url: this.$http.adornUrl(`/generator/pfac/refusaudit/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams({
          'facNum': this.dataForm.facNum,
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }
      })
    },
    passAudit(id){
      this.$http({
        url: this.$http.adornUrl(`/generator/pfac/passaudit/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams({
          'facout': this.dataList[0].id,
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }
      })
    },
  }
}
</script>
