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
    <el-form-item label="图片" prop="imageUrl">
      <el-input v-model="dataForm.imageUrl" placeholder="图片"></el-input>
    </el-form-item>
    <el-form-item label="单位" prop="unit">
      <el-input v-model="dataForm.unit" placeholder="单位"></el-input>
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input v-model="dataForm.sort" placeholder="排序"></el-input>
    </el-form-item>
    <el-form-item label="设备分类" prop="kind">
      <div class="block">
        <!--        <span class="demonstration">hover 触发子菜单</span>-->
        <el-cascader
          v-model="value9"
          :options="options9"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"></el-cascader>
      </div>
    </el-form-item>
    <el-form-item label="数量" prop="num">
      <el-input v-model="dataForm.num" placeholder="数量"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-input v-model="dataForm.status" placeholder="状态"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime" >
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="修改时间" prop="modifiedTime">
      <el-input v-model="dataForm.modifiedTime" placeholder="修改时间"></el-input>
    </el-form-item>
    <el-form-item label="1级分类" prop="oneCategoryId">
      <el-input v-model="dataForm.oneCategoryId" placeholder="1级分类"></el-input>
    </el-form-item>
    <el-form-item label="2级分类" prop="twoCategoryId">
      <el-input v-model="dataForm.twoCategoryId" placeholder="2级分类"></el-input>
    </el-form-item>
    <el-form-item label="3级分类" prop="threeCategoryId">
      <el-input v-model="dataForm.threeCategoryId" placeholder="3级分类"></el-input>
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
          unit: '',
          sort: '',
          kind: '',
          num: '',
          status: '',
          createTime: '',
          modifiedTime: '',
          oneCategoryId: '',
          twoCategoryId: '',
          threeCategoryId: '',
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
          unit: [
            { required: true, message: '单位不能为空', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ],
          kind: [
            { required: false, message: '设备种类不能为空', trigger: 'blur' }
          ],
          num: [
            { required: true, message: '数量不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ],
          oneCategoryId: [
            { required: true, message: '1级分类不能为空', trigger: 'blur' }
          ],
          twoCategoryId: [
            { required: true, message: '2级分类不能为空', trigger: 'blur' }
          ],
          threeCategoryId: [
            { required: true, message: '3级分类不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ]
        },
        value9: [],
        options9: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }]
          }]
        }]

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
              url: this.$http.adornUrl(`/generator/pfacinfo/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.facNum = data.pFacInfo.facNum
                this.dataForm.name = data.pFacInfo.name
                this.dataForm.imageUrl = data.pFacInfo.imageUrl
                this.dataForm.unit = data.pFacInfo.unit
                this.dataForm.sort = data.pFacInfo.sort
                this.dataForm.kind = data.pFacInfo.kind
                this.dataForm.num = data.pFacInfo.num
                this.dataForm.status = data.pFacInfo.status
                this.dataForm.createTime = data.pFacInfo.createTime
                this.dataForm.modifiedTime = data.pFacInfo.modifiedTime
                this.dataForm.oneCategoryId = data.pFacInfo.oneCategoryId
                this.dataForm.twoCategoryId = data.pFacInfo.twoCategoryId
                this.dataForm.threeCategoryId = data.pFacInfo.threeCategoryId
                this.dataForm.remark = data.pFacInfo.remark
              }
            })
          }
        })
      },
      handleChange(value9) {
        console.log(value9);
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/pfacinfo/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'facNum': this.dataForm.facNum,
                'name': this.dataForm.name,
                'imageUrl': this.dataForm.imageUrl,
                'unit': this.dataForm.unit,
                'sort': this.dataForm.sort,
                'kind': this.dataForm.kind,
                'num': this.dataForm.num,
                'status': this.dataForm.status,
                'createTime': this.dataForm.createTime,
                'modifiedTime': this.dataForm.modifiedTime,
                'oneCategoryId': this.dataForm.oneCategoryId,
                'twoCategoryId': this.dataForm.twoCategoryId,
                'threeCategoryId': this.dataForm.threeCategoryId,
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
