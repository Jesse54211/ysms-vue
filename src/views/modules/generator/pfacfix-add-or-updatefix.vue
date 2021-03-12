<template>
  <el-dialog
    title="新增维修工单"
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
        <el-col :span="8">
    <el-form-item label="状态" prop="status">
      <el-tag  type="success" v-if="dataForm.status===0">空闲</el-tag>
      <el-tag  v-else-if="dataForm.status===1">在借</el-tag>
      <el-tag  type="danger" v-else-if="dataForm.status===2">维修</el-tag>
      <el-tag  type="warning" v-else-if="dataForm.status===3">报废</el-tag>
      <el-tag  type="warning" v-else-if="dataForm.status===4">预约审核中</el-tag>
      <el-tag  type="warning" v-else-if="dataForm.status===5">维修审核中</el-tag>
      <el-tag  type="warning" v-else-if="dataForm.status===6">报废审核中</el-tag>
      <el-tag  type="warning" v-else-if="dataForm.status===7">归还审核中</el-tag>
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
    <el-form-item label="预计工时" prop="fixTime">
      <el-input v-model="dataForm.fixTime"></el-input>
    </el-form-item>
        </el-col>
      </el-row>
<!--    <el-form-item label="维修费用" prop="price">-->
<!--      <el-input v-model="dataForm.fixprice" placeholder="维修费用"></el-input>-->
<!--    </el-form-item>-->
    <el-form-item label="故障描述" prop="fixResn">
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
          fixprice: '',
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
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ],
          fixUser: [
            { required: true, message: '维修人不能为空', trigger: 'blur' }
          ],
          fixTime: [
            { required: true, message: '维修工时不能为空', trigger: 'blur' }
          ],
          fixResn: [
            { required: true, message: '故障原因不能为空', trigger: 'blur' }
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
                this.dataForm.fixUser = data.pFac.fixUser
                this.dataForm.fixTime = data.pFac.fixTime
                this.dataForm.fixResn = data.pFac.fixResn
                this.dataForm.fixOutTime = data.pFac.fixOutTime
                this.dataForm.fixInTime = data.pFac.fixInTime
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
              url: this.$http.adornUrl(`/generator/pfacfix/save`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'facNum': this.dataForm.facNum,
                'name': this.dataForm.name,
                'imageUrl': this.dataForm.imageUrl,
                'model': this.dataForm.model,
                'unit': this.dataForm.unit,
                'kind': this.dataForm.kind,
                'status': 2,
                'fixUser': this.dataForm.fixUser,
                'fixTime': this.dataForm.fixTime,
                'price': this.dataForm.fixprice,
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
