<template>
        <el-dialog
          title="预约设备"
          :close-on-click-modal="false"
          :visible.sync="visible"
          width="60%"
        >

                        <el-alert
                          show-icon
                          title="友情提示:  设备价格昂贵，请轻拿轻放，避免损坏"
                          type="warning">
                        </el-alert>
          <el-steps style="margin-bottom: 20px;" :active="1" simple>
            <el-step title="填写申请" icon="el-icon-edit"></el-step>
            <el-step title="等待审核" icon="el-icon-postcard"></el-step>
            <el-step title="预约成功" icon="el-icon-set-up"></el-step>
          </el-steps>
<!--          <br/>-->
          <el-row>
            <el-col :span="12" >
              <el-card class="facdetails" >
                  <img :src="dataList.imageUrl" width="100%"/>
              </el-card>
            </el-col>
            <el-col :span="12" >
              <el-card class="facdetails" >
                <p><span>编号：</span>{{ dataForm.facNum }}</p>
                <p><span>名称：</span>{{ dataForm.name }}</p>
                <p><span>存放地址：</span>{{ dataList.address }}</p>
                <p><span>联系人：</span>{{ dataList.operator }}</p>
                <p><span>联系电话：</span>{{ dataList.phone }}</p>
                <p><span>说明：</span>{{ dataList.remark }}</p>
              </el-card>
            </el-col>
          </el-row>
          <br/>


          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit()"
            label-width="80px"
            size="mini"
          >
            <el-row>
              <el-col :span="24">
              </el-col>

              <el-col :span="12">

              </el-col>
            </el-row>

              <el-col :span="12">
                <el-form-item label="使用日期" prop="outTime">
                  <el-date-picker
                    v-model="dataForm.outTime"
                    type="datetime"
                    placeholder="选择日期" value-format=" yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>

              </el-col>

              <el-col :span="12">
                <el-form-item label="归还时间" prop="nextTime1">
                  <el-date-picker
                    v-model="dataForm.nextTime1"
                    type="datetime"
                    placeholder="选择日期" value-format=" yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>

              </el-col>

              <el-col :span="24">
              <el-form-item label="用途" prop="remark">
                <el-input type="textarea" :rows="2" v-model="dataForm.remark" placeholder="请填写用途"></el-input>
              </el-form-item>
               </el-col>



          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button v-if="isAuth('generator:pfacout:save')" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>

        </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        facNum: '',
        name: '',
        user: '',
        dep: '',
        imageUrl:'',
        outTime: '',
        nextTime1: '',
        remark: '',
        model: '',
        unit: '',
        kind: '',
        status: ''
      },
      dataList:[],
      orgId:'',
      dataRule: {
        facNum: [
          { required: true, message: '编号不能为空', trigger: 'blur' }],
        remark: [
          {required: true, message:'用途不能为空',trigger:'blur'}],
        outTime: [
          {required: true, message:'时间不能为空',trigger:'blur'}],
        nextTime1: [
          {required: true, message:'预计归还时间不能为空',trigger:'blur'}]

      }
    }
  },
  methods: {
    init (id) {
      this.orgId = id
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.orgId) {
          this.$http({
            url: this.$http.adornUrl(`/generator/pfac/info/${this.orgId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.pFac
              this.dataForm.name=data.pFac.name
              this.dataForm.facNum=data.pFac.facNum
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/generator/pfacout/save'),
            method: 'post',
            data: this.$http.adornData({
              'facNum': this.dataForm.facNum,
              'name': this.dataForm.name,
              'imageUrl':this.dataList.imageUrl,
              'user': this.$store.state.user.name,
              'outTime': this.dataForm.outTime,  //开始使用时间
              'nextTime1': this.dataForm.nextTime1, //预计归还时间
              'remark': this.dataForm.remark,
              'model':this.dataList.model,
              'unit':this.dataList.unit,

              'status': 2
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
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
