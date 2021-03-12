<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" size="mini" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="编号"  prop="num">
      <el-input :disabled="true" v-model="dataForm.num" placeholder="编号"></el-input>
    </el-form-item>
    <el-form-item label="厂家名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="厂家名称"></el-input>
    </el-form-item>
    <el-form-item label="图片" prop="imageUrl">
      <el-input v-model="dataForm.imageUrl" placeholder="图片"></el-input>
    </el-form-item>
    <el-form-item label="厂家地址" prop="address">
      <el-input v-model="dataForm.address" placeholder="厂家地址"></el-input>
    </el-form-item>

    <el-form-item label="联系电话" prop="phone">
      <el-input v-model="dataForm.phone" placeholder="联系电话"></el-input>
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
          num: '',
          name: '',
          imageUrl: '',
          address: '',
          status: '',
          phone: '',
          remark: ''
        },
        dataRule: {

          name: [
            { required: true, message: '厂家名称不能为空', trigger: 'blur' }
          ],
          imageUrl: [
            { required: true, message: '图片不能为空', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '厂家地址不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态 0空闲 1在借 2维修 3报废不能为空', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '联系电话不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/generator/pbins/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.num = data.pBins.num
                this.dataForm.name = data.pBins.name
                this.dataForm.imageUrl = data.pBins.imageUrl
                this.dataForm.address = data.pBins.address
                this.dataForm.status = 0
                this.dataForm.phone = data.pBins.phone
                this.dataForm.remark = data.pBins.remark
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
              url: this.$http.adornUrl(`/generator/pbins/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'num': this.dataForm.num,
                'name': this.dataForm.name,
                'imageUrl': this.dataForm.imageUrl,
                'address': this.dataForm.address,
                'status': this.dataForm.status,
                'phone': this.dataForm.phone,
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
