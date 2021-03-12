<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="编号" prop="facNum">
      <el-input v-model="dataForm.facNum" placeholder="编号"></el-input>
    </el-form-item>
    <el-form-item label="设备名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="设备名称"></el-input>
    </el-form-item>
    <el-form-item label="使用人" prop="user">
      <el-input v-model="dataForm.user" placeholder="使用人"></el-input>
    </el-form-item>
    <el-form-item label="使用所属部门" prop="dep">
      <el-input v-model="dataForm.dep" placeholder="使用所属部门"></el-input>
    </el-form-item>
    <el-form-item label="使用开始时间" prop="outTime">
      <el-input v-model="dataForm.outTime" placeholder="使用开始时间"></el-input>
    </el-form-item>
    <el-form-item label="归还时间" prop="retnTime">
      <el-input v-model="dataForm.retnTime" placeholder="归还时间"></el-input>
    </el-form-item>
    <el-form-item label="时间1" prop="nextTime1">
      <el-input v-model="dataForm.nextTime1" placeholder="时间1"></el-input>
    </el-form-item>
    <el-form-item label="时间2" prop="nextTime2">
      <el-input v-model="dataForm.nextTime2" placeholder="时间2"></el-input>
    </el-form-item>
    <el-form-item label="时间3" prop="nextTime3">
      <el-input v-model="dataForm.nextTime3" placeholder="时间3"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
    </el-form-item>
    <el-form-item label="规格型号" prop="model">
      <el-input v-model="dataForm.model" placeholder="规格型号"></el-input>
    </el-form-item>
    <el-form-item label="单位" prop="unit">
      <el-input v-model="dataForm.unit" placeholder="单位"></el-input>
    </el-form-item>
    <el-form-item label="设备种类" prop="kind">
      <el-input v-model="dataForm.kind" placeholder="设备种类"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-input v-model="dataForm.status" placeholder="状态"></el-input>
    </el-form-item>
    </el-form>
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
        },
        dataRule: {
          facNum: [
            { required: true, message: '编号不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '设备名称不能为空', trigger: 'blur' }
          ],
          user: [
            { required: true, message: '使用人不能为空', trigger: 'blur' }
          ],
          dep: [
            { required: true, message: '使用所属部门不能为空', trigger: 'blur' }
          ],
          outTime: [
            { required: true, message: '使用开始时间不能为空', trigger: 'blur' }
          ],
          retnTime: [
            { required: true, message: '归还时间不能为空', trigger: 'blur' }
          ],
          nextTime1: [
            { required: true, message: '时间1不能为空', trigger: 'blur' }
          ],
          nextTime2: [
            { required: true, message: '时间2不能为空', trigger: 'blur' }
          ],
          nextTime3: [
            { required: true, message: '时间3不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ],
          model: [
            { required: true, message: '规格型号不能为空', trigger: 'blur' }
          ],
          unit: [
            { required: true, message: '单位不能为空', trigger: 'blur' }
          ],
          kind: [
            { required: true, message: '设备种类不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/generator/pfacout/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.facNum = data.pFacOut.facNum
                this.dataForm.name = data.pFacOut.name
                this.dataForm.user = data.pFacOut.user
                this.dataForm.dep = data.pFacOut.dep
                this.dataForm.outTime = data.pFacOut.outTime
                this.dataForm.retnTime = data.pFacOut.retnTime
                this.dataForm.nextTime1 = data.pFacOut.nextTime1
                this.dataForm.nextTime2 = data.pFacOut.nextTime2
                this.dataForm.nextTime3 = data.pFacOut.nextTime3
                this.dataForm.remark = data.pFacOut.remark
                this.dataForm.model = data.pFacOut.model
                this.dataForm.unit = data.pFacOut.unit
                this.dataForm.kind = data.pFacOut.kind
                this.dataForm.status = data.pFacOut.status
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
              url: this.$http.adornUrl(`/generator/pfacout/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'facNum': this.dataForm.facNum,
                'name': this.dataForm.name,
                'user': this.dataForm.user,
                'dep': this.dataForm.dep,
                'outTime': this.dataForm.outTime,
                'retnTime': this.dataForm.retnTime,
                'nextTime1': this.dataForm.nextTime1,
                'nextTime2': this.dataForm.nextTime2,
                'nextTime3': this.dataForm.nextTime3,
                'remark': this.dataForm.remark,
                'model': this.dataForm.model,
                'unit': this.dataForm.unit,
                'kind': this.dataForm.kind,
                'status': this.dataForm.status
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
