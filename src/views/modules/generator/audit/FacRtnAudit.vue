<template>
  <el-dialog
    title="确认归还"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%"
  >
    <el-alert
      show-icon
      title="鼠标悬停图片用于查看详情..."
      type="warning">
    </el-alert>

    <br/>
    <el-row>
      <el-col :span="12" >
        <el-card class="facdetails" >
          <el-popover placement="right" trigger="hover">

            <p>{{dataForm}}</p>

            <img slot="reference" :src="dataForm.imageUrl"
                 :alt="dataForm.imageUrl" style="height: 100%;width: 100%;cursor: pointer">
          </el-popover>
        </el-card>
      </el-col>

      <el-col :span="12" >
        <el-card class="facdetails" >
          <p><span>编号：</span>{{ dataList[0].facNum }}</p>
          <p><span>名称：</span>{{ dataList[0].name }}</p>
          <span>外借人：</span>{{ dataList[0].user }}

          <p><span>使用日期：</span>{{ dataList[0].outTime }} - {{ dataList[0].nextTime1 }}</p>
          <p><span>用途：</span>{{ dataList[0].remark }}</p>
          <p><span>实际归还时间：</span>{{ dataList[0].retnTime }}</p>

          <el-popover placement="right" trigger="click">
            <p slot="reference"  style="cursor: pointer">
              <el-button type="text"> 详细信息 </el-button>
            </p>
            <p>{{dataForm.name}}</p>
            <p>{{dataForm.facNum}}</p>
          </el-popover>



        </el-card>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
   <el-button style="color: white" type="primary"  @click="passAudit(dataList[0].id)">通过</el-button>
    </span>
    <br/>




    {{ dataList }}
    ==================================
    {{dataForm}}



    <br/>
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
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/generator/pfac/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm = data.pFac
              this.$http({
                url: this.$http.adornUrl('/generator/pfacout/list'),
                method: 'get',
                params: this.$http.adornParams({
                  'page': this.pageIndex,
                  'limit': this.pageSize,
                  'key': this.dataForm.facNum,
                  'status': 4
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataList = data.page.list
                }
              })
            }
          })
        }
        //再拿fac的num查facout的信息

      })
    },
    // 表单提交
    passAudit(id){
      this.$http({
        url: this.$http.adornUrl(`/generator/pfac/passRtnAudit/${this.dataForm.id}`),
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
