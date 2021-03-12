<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" size="mini" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="设备编号" prop="facNum">
            <el-input :disabled="true" v-model="dataForm.facNum" placeholder="编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="设备名称" prop="name">
            <el-input :disabled="true" v-model="dataForm.name" placeholder="设备名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="规格型号" prop="model">
            <el-input :disabled="true" v-model="dataForm.model" placeholder="规格型号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="维修人" prop="fixUser">
            <el-input v-model="dataForm.fixUser" placeholder="维修人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="维修工时" prop="fixTime">
            <el-input v-model="dataForm.fixTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="维修费用" prop="price">
            <el-input v-model="dataForm.price" placeholder="维修费用"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="故障原因" prop="fixResn">
        <el-input type="textarea" :rows="2" v-model="dataForm.fixResn" ></el-input>
      </el-form-item>
      <el-alert
        :title="dataForm.remark"
        type="warning"
        show-icon style="margin-bottom:20px;">
      </el-alert>
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
          model: '',
          unit: '',
          kind: '',
          status: '',
          fixUser: '',
          fixTime: '',
          price: '',
          fixResn: '',
          fixOutTime: '',
          fixInTime: '',
          remark: ''
        },
        dataRule: {
          facNum: [
            { required: true, message: '编号不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '设备名称不能为空', trigger: 'blur' }
          ],

          model: [
            { required: true, message: '规格型号不能为空', trigger: 'blur' }
          ],

          fixUser: [
            { required: true, message: '维修人不能为空', trigger: 'blur' }
          ],
          fixTime: [
            { required: true, message: '维修工时不能为空', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '维修费用不能为空', trigger: 'blur' }
          ],
          fixResn: [
            { required: true, message: '故障原因不能为空', trigger: 'blur' }
          ],
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
              url: this.$http.adornUrl(`/generator/pfacfix/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.facNum = data.pFacFix.facNum
                this.dataForm.name = data.pFacFix.name
                this.dataForm.imageUrl = data.pFacFix.imageUrl
                this.dataForm.model = data.pFacFix.model
                this.dataForm.unit = data.pFacFix.unit
                this.dataForm.kind = data.pFacFix.kind
                this.dataForm.status = data.pFacFix.status
                this.dataForm.fixUser = data.pFacFix.fixUser
                this.dataForm.fixTime = data.pFacFix.fixTime
                this.dataForm.price = data.pFacFix.price
                this.dataForm.fixResn = data.pFacFix.fixResn
                this.dataForm.fixOutTime = data.pFacFix.fixOutTime
                this.dataForm.fixInTime = data.pFacFix.fixInTime
                this.dataForm.remark = data.pFacFix.remark
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
              url: this.$http.adornUrl(`/generator/pfacfix/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'facNum': this.dataForm.facNum,
                'name': this.dataForm.name,
                'imageUrl': this.dataForm.imageUrl,
                'model': this.dataForm.model,
                'unit': this.dataForm.unit,
                'kind': this.dataForm.kind,
                'status': 5,
                'fixUser': this.dataForm.fixUser,
                'fixTime': this.dataForm.fixTime,
                'price': this.dataForm.price,
                'fixResn': this.dataForm.fixResn,
                'fixOutTime': this.dataForm.fixOutTime,
                'fixInTime': this.dataForm.fixInTime,
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
