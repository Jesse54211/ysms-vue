<template>
  <el-dialog
    title="设备报废"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" size="mini" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="编号" prop="facNum">
      <el-input v-model="dataForm.facNum" placeholder="编号"></el-input>
    </el-form-item>
    <el-form-item label="设备名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="设备名称"></el-input>
    </el-form-item>
    <el-form-item label="图片" prop="imageUrl">
      <el-input v-model="dataForm.imageUrl" placeholder="图片"></el-input>
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

    <el-form-item label="购买部门" prop="buyDep">
      <el-input v-model="dataForm.buyDep" placeholder="购买部门"></el-input>
    </el-form-item>

    <el-form-item label="报废原因" prop="resn">
      <el-input v-model="dataForm.resn" placeholder="报废原因"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
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
          imageUrl: '',
          operator: '',
          model: '',
          unit: '',
          kind: '',
          status: '',
          createTime: '',
          modifiedTime: '',
          buyDep: '',
          dpcdTime: '',
          resn: '',
          remark: ''
        },
        dataRule: {
          facNum: [
            { required: true, message: '编号不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '设备名称不能为空', trigger: 'blur' }
          ],
          imageUrl: [
            { required: true, message: '图片不能为空', trigger: 'blur' }
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

          buyDep: [
            { required: true, message: '购买部门不能为空', trigger: 'blur' }
          ],

          resn: [
            { required: true, message: '报废原因不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/generator/pfac/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.facNum = data.pFac.facNum
                this.dataForm.name = data.pFac.name
                this.dataForm.imageUrl = data.pFac.imageUrl
                this.dataForm.model = data.pFac.model
                this.dataForm.unit = data.pFac.unit
                this.dataForm.kind = data.pFac.kind
                this.dataForm.status = data.pFac.status
                this.dataForm.buyDep = data.pFac.buyDep
                this.dataForm.dpcdTime = data.pFac.dpcdTime
                this.dataForm.remark = data.pFac.remark
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
              url: this.$http.adornUrl(`/generator/pfacdpcd/save`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'facNum': this.dataForm.facNum,
                'name': this.dataForm.name,
                'imageUrl': this.dataForm.imageUrl,
                'operator': this.$store.state.user.name,
                'model': this.dataForm.model,
                'unit': this.dataForm.unit,
                'kind': this.dataForm.kind,
                'status': 3,
                'buyDep': this.dataForm.buyDep,
                'resn': this.dataForm.resn,
                'remark': this.dataForm.remark
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
