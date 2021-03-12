<template>
  <el-dialog
    title="设备维护"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <el-card>
      <el-form :model="dataForm" size="mini" :rules="dataRule" ref="dataForm" label-width="80px">
        <el-row>
          <el-col :span="12">

            <el-row>
              <el-col :span="12">
                <el-form-item label="编号" prop="facNum">
                  <el-input :disabled="true" v-model="dataForm.facNum" placeholder="编号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="规格型号" prop="model">
                  <el-input v-model="dataForm.model" placeholder="规格型号"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="设备名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="设备名称"></el-input>
            </el-form-item>


            <el-form-item label="类型" prop="type">
              <el-radio-group v-model="dataForm.type">
                <el-radio :size="'mini'" :label="0">采购</el-radio>
                <el-radio :size="'mini'" :label="1">捐赠</el-radio>
                <el-radio :size="'mini'" :label="2">借用</el-radio>
                <el-radio :size="'mini'" :label="3">下拨</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="单位" prop="unit">
                  <el-input v-model="dataForm.unit" placeholder="单位"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="排序" prop="sort">
                  <el-input-number v-model="dataForm.sort" :min="1" :max="10" label="排序"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="图片" prop="imageUrl">
              <!--      <el-input v-model="dataForm.imageUrl" placeholder="图片"></el-input>-->
              <img :src="dataForm.imageUrl" style="height: 110px;width: 130px"/>
            </el-form-item>
            <el-form-item label="修改图片" prop="name">
              <!-- 图片上传部分 -->
              <el-upload
                :action="uploadApi"
                :class="{ disabled: uploadDisabled }"
                list-type="picture-card"
                :limit="limitcount"
                :on-change="handleChangeimg"
                :on-remove="handleRemoveimg"
                accept="image/*"
                :on-success="handleSuccess"
                ref="upload"
                :on-preview="handlePictureCardPreview"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>

          </el-col>
          <el-col :span="12">


            <!--    <el-form-item label="操作员" prop="operator"><el-input v-model="dataForm.operator" placeholder="操作员"></el-input></el-form-item>-->

            <el-row>
              <el-col :span="12">
                <el-form-item label="所属品牌" prop="brand">
                  <el-input v-model="dataForm.brand" placeholder="所属品牌"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
<!--                <el-form-item label="购买部门" prop="buyDep">-->
<!--                  <el-input v-model="dataForm.buyDep" placeholder="购买部门"></el-input>-->
<!--                </el-form-item>-->
              </el-col>
            </el-row>
            <!--    <el-form-item label="在使用人" prop="user"><el-input v-model="dataForm.user" placeholder="在使用人"></el-input></el-form-item>-->
            <el-form-item label="放置地点" prop="address">
              <el-input v-model="dataForm.address" placeholder="放置地点"></el-input>
            </el-form-item>
            <!--    <el-form-item label="使用次数" prop="useCount"><el-input v-model="dataForm.useCount" placeholder="使用次数"></el-input></el-form-item>-->
            <!--    <el-form-item label="创建时间" prop="createTime"><el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input></el-form-item>-->
            <!--    <el-form-item label="修改时间" prop="modifiedTime"><el-input v-model="dataForm.modifiedTime" placeholder="修改时间"></el-input></el-form-item>-->
            <el-row>
              <el-col :span="12">
                <el-form-item label="生产厂家" prop="made">
                  <el-input v-model="dataForm.made" placeholder="生产厂家"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产地" prop="madeIn">
                  <el-input v-model="dataForm.madeIn" placeholder="产地"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!--    <el-form-item label="出厂日期" prop="madeOutTime"><el-input v-model="dataForm.madeOutTime" placeholder="出厂日期"></el-input></el-form-item>-->
            <!--    <el-form-item label="购买时间" prop="buyTime"><el-input v-model="dataForm.buyTime" placeholder="购买时间"></el-input></el-form-item>-->
            <el-row>
              <el-col :span="24">
                <el-form-item label="购买价格" prop="price">
                  <el-input v-model="dataForm.price" placeholder="购买价格"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="状态" prop="price">
              <el-tag type="success" v-if="dataForm.status===0">空闲</el-tag>
              <el-tag v-else-if="dataForm.status===1">在借中</el-tag>
              <el-tag type="danger" v-else-if="dataForm.status===2">维修中</el-tag>
              <el-tag type="danger" v-else-if="dataForm.status===3">已报废</el-tag>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" :rows="2" v-model="dataForm.remark" placeholder="备注"></el-input>
            </el-form-item>
            <el-form-item label="说明书" prop="price">
              <a :href="dataForm.guide">下载</a>
            </el-form-item>

            <el-upload
              drag
              :action="guideurl"
              :before-upload="beforeUploadHandle"
              :on-success="successHandle"
              multiple
              :file-list="fileListguide"
              style="text-align: center;">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <!--            <div class="el-upload__tip" slot="tip">只支持jpg、png、gif格式的图片！</div>-->
            </el-upload>

            <!--          <el-form-item label="状态" prop="status"><el-input v-model="dataForm.status" placeholder="0空闲 1在借 2维修 3报废"></el-input></el-form-item>-->

            <!--    <el-form-item label="启用时间" prop="enableTime"><el-input v-model="dataForm.enableTime" placeholder="启用时间"></el-input></el-form-item>-->

          </el-col>
        </el-row>
      </el-form>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt/>
      </el-dialog>
      <el-row>
        <el-col :span="18">&nbsp</el-col>

        <el-col :span="6">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </el-col>
      </el-row>
    </el-card>

  </el-dialog>
  <!-- 图片预览 -->

</template>

<script>
import AddOrUpdatefix from './pfacfix-add-or-updatefix'

export default {
  data () {
    return {
      uploadApi: this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`),
      btnLoading: false,
      btnDisabled: false,
      loading: true,
      // headerObject: {
      //   Authorization: window.localStorage.getItem("JWT_TOKEN")
      // }, //图片上传请求头
      limitcount: 1,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadDisabled: false,
      //---
      guideurl: this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`),

      fileListguide: [],
      addOrUpdateVisiblefix: false,
      visible: false,
      dataForm: {
        id: 0,
        facNum: '',
        name: '',
        imageUrl: '',
        type: '',
        operator: '',
        model: '',
        unit: '',
        sort: '',
        guide: '',
        kind: '',
        brand: '',
        user: '',
        address: '',
        useCount: '',
        status: '',
        createTime: '',
        modifiedTime: '',
        buyDep: '',
        made: '',
        madeIn: '',
        madeOutTime: '',
        buyTime: '',
        price: '',
        enableTime: '',
        remark: ''
      },
      dataRule: {
        facNum: [
          {required: true, message: '编号不能为空', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '设备名称不能为空', trigger: 'blur'}
        ],
        imageUrl: [
          {required: true, message: '图片不能为空', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '类型:1采购，2捐赠不能为空', trigger: 'blur'}
        ],
        operator: [
          {required: true, message: '操作员不能为空', trigger: 'blur'}
        ],
        model: [
          {required: true, message: '规格型号不能为空', trigger: 'blur'}
        ],
        unit: [
          {required: true, message: '单位不能为空', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '排序不能为空', trigger: 'blur'}
        ],
        kind: [
          {required: false, message: '设备种类不能为空', trigger: 'blur'}
        ],
        brand: [
          {required: true, message: '所属品牌不能为空', trigger: 'blur'}
        ],
        user: [
          {required: true, message: '在使用人不能为空', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '放置地点不能为空', trigger: 'blur'}
        ],
        useCount: [
          {required: true, message: '使用次数不能为空', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '状态 0空闲 1在借 2维修 3报废不能为空', trigger: 'blur'}
        ],
        // buyDep: [
        //   {required: true, message: '购买部门不能为空', trigger: 'blur'}
        // ],
        made: [
          {required: true, message: '生产厂家不能为空', trigger: 'blur'}
        ],
        madeIn: [
          {required: true, message: '产地不能为空', trigger: 'blur'}
        ],
        madeOutTime: [
          {required: true, message: '出厂日期不能为空', trigger: 'blur'}
        ],
        buyTime: [
          {required: true, message: '购买时间不能为空', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '购买价格不能为空', trigger: 'blur'}
        ],
        enableTime: [
          {required: true, message: '启用时间不能为空', trigger: 'blur'}
        ],
        remark: [
          {required: true, message: '备注不能为空', trigger: 'blur'}
        ]
      },

    }
  },
  components: {
    AddOrUpdatefix
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.fileListguide = []
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
              this.dataForm.type = data.pFac.type
              this.dataForm.operator = data.pFac.operator
              this.dataForm.model = data.pFac.model
              this.dataForm.unit = data.pFac.unit
              this.dataForm.sort = data.pFac.sort
              this.dataForm.kind = data.pFac.kind
              this.dataForm.brand = data.pFac.brand
              this.dataForm.user = data.pFac.user
              this.dataForm.address = data.pFac.address
              this.dataForm.useCount = data.pFac.useCount
              this.dataForm.status = data.pFac.status
              this.dataForm.createTime = data.pFac.createTime
              this.dataForm.modifiedTime = data.pFac.modifiedTime
              this.dataForm.buyDep = data.pFac.buyDep
              this.dataForm.made = data.pFac.made
              this.dataForm.madeIn = data.pFac.madeIn
              this.dataForm.madeOutTime = data.pFac.madeOutTime
              this.dataForm.buyTime = data.pFac.buyTime
              this.dataForm.price = data.pFac.price
              this.dataForm.enableTime = data.pFac.enableTime
              this.dataForm.remark = data.pFac.remark
              this.dataForm.guide = data.pFac.guide
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
            url: this.$http.adornUrl(`/generator/pfac/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'facNum': this.dataForm.facNum,
              'name': this.dataForm.name,
              'imageUrl': this.dataForm.imageUrl,
              'type': this.dataForm.type,
              'operator': this.dataForm.operator,
              'model': this.dataForm.model,
              'unit': this.dataForm.unit,
              'sort': this.dataForm.sort,
              'kind': this.dataForm.kind,
              'brand': this.dataForm.brand,
              'user': this.dataForm.user,
              'address': this.dataForm.address,
              'useCount': this.dataForm.useCount,
              'status': this.dataForm.status,
              'createTime': this.dataForm.createTime,
              'modifiedTime': this.dataForm.modifiedTime,
             // 'buyDep': this.dataForm.buyDep,
              'made': this.dataForm.made,
              'madeIn': this.dataForm.madeIn,
              'madeOutTime': this.dataForm.madeOutTime,
              'buyTime': this.dataForm.buyTime,
              'price': this.dataForm.price,
              'enableTime': this.dataForm.enableTime,
              'remark': this.dataForm.remark,
              'guide': this.dataForm.guide
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
    },
    //------------------------------------
    handleChangeimg (file, fileList) {
      this.uploadDisabled = fileList.length >= this.limitcount
    },
    handleRemoveimg (file, fileList) {
      this.uploadDisabled = fileList.length >= this.limitcount
      this.dataForm.imageUrl = ''
    },
    handleSuccess (response, file, fileList) {
      var jsonData = JSON.stringify(response)// 转成JSON格式
      var result = JSON.parse(jsonData)// 转成JSON对象
      this.dataForm.imageUrl = result.url
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    editHandleSuccess (response, file, fileList) {
      this.dataForm.imageUrl = response.msg
    },
    // 上传之前
    beforeUploadHandle (file) {
      if (file.type !== 'image/jpg' && file.type !== 'image/jpeg'
        && file.type !== 'image/png' && file.type !== 'image/gif'
        && file.type !== 'image/gif'
        && file.type !== 'application/msword'
        && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        && file.type !== 'application/pdf'
        && file.type !== 'text/plain'
      ) {
        this.$message.error('只支持jpg、png、gif、doc、docx、pdf、txt格式的文件！')
        console.log(file.type)
        return false
      }
      this.num++
    },
    // 上传成功
    successHandle (response, file, fileListguide) {
      this.fileListguide = fileListguide
      this.successNum++
      if (response && response.code === 0) {
        this.dataForm.guide = response.url
        if (this.num === this.successNum) {
          this.$confirm('操作成功, 是否继续操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(() => {
            this.visible = false
          })
        }
      } else {
        this.$message.error(response.msg)
      }
    },
    // 新增 / 修改
    addOrUpdateHandlefix (id) {
      this.addOrUpdateVisiblefix = true
      this.$nextTick(() => {
        this.$refs.AddOrUpdatefix.init(id)
      })
    },

  }
}
</script>
