<template>
  <div id="addStocks">
    <!-- 面包导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/inStocks' }">设备管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/inStocks' }">设备入库</el-breadcrumb-item>
      <el-breadcrumb-item >添加入库</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-row :gutter="20">
      <el-col :span="11">
        <div class="grid-content bg-purple">
          <el-card>
            <el-alert
              title="注意：请在右侧表格中选择设备的类别"
              type="warning"
              show-icon style="margin-bottom:20px;">
            </el-alert>

            <el-form
              size="mini"
              ref="dataForm" @keyup.enter.native="dataFormSubmit()"
              :rules="dataRule"
              :model="dataForm"
              label-width="80px"
            >

              <el-form-item label="入库类型" prop="type">
                <el-radio-group v-model="dataForm.type">
                  <el-radio  :size="'mini'" :label="0">采购</el-radio>
                  <el-radio  :size="'mini'" :label="1">捐赠</el-radio>
                  <el-radio  :size="'mini'" :label="2">借用</el-radio>
                  <el-radio  :size="'mini'" :label="3">下拨</el-radio>
                </el-radio-group>
              </el-form-item>
              <div >
                <el-form-item label="设备编号" prop="facNum">
                  <el-input v-model="dataForm.facNum" placeholder="编号"></el-input>
                </el-form-item>
                <el-form-item label="设备名称" prop="name">
                  <el-input v-model="dataForm.name" placeholder="设备名称"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                  <el-cascader
                    :change-on-select="true"
                    @change="selectChange"
                    v-model="categorykeys"
                    :props="selectProps"
                    :options="categorys"
                    clearable
                  ></el-cascader>
                </el-form-item>

                <el-form-item label="型号" prop="model">
                  <el-input v-model="dataForm.model" placeholder="规格型号"></el-input>
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                  <el-input v-model="dataForm.unit" placeholder="单位"></el-input>
                </el-form-item>
                <el-form-item label="所属品牌" prop="brand">
                  <el-input v-model="dataForm.brand" placeholder="所属品牌"></el-input>
                </el-form-item>
                <el-form-item label="放置地点" prop="address">
                  <el-input v-model="dataForm.address" placeholder="放置地点"></el-input>
                </el-form-item>
                <el-form-item label="产地" prop="madeIn">
                  <el-input v-model="dataForm.madeIn" placeholder="产地(国家)"></el-input>
                </el-form-item>
                <el-form-item label="出厂日期" prop="madeOutTime">
                  <el-date-picker
                    v-model="dataForm.madeOutTime"
                    type="datetime"
                    placeholder="选择日期" value-format=" yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="购买时间" prop="madeOutTime">
                  <el-date-picker
                    v-model="dataForm.buyTime"
                    type="datetime"
                    placeholder="选择日期" value-format=" yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="启用时间" prop="madeOutTime">
                  <el-date-picker
                    v-model="dataForm.enableTime"
                    type="datetime"
                    placeholder="选择日期" value-format=" yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
                <el-row>
                <el-col :span="12">
                <el-form-item label="购买价格" prop="price">
                  <el-input v-model="dataForm.price" placeholder="购买价格"></el-input>
                </el-form-item>
                </el-col>
                  <el-col :span="12">
                    <el-form-item label="排序" prop="sort">
                      <el-input-number v-model="dataForm.sort" :min="1" :max="10" label="排序"></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="备注" prop="remark">
                  <el-input type="textarea" :rows="2" v-model="dataForm.remark" placeholder="备注"></el-input>
                </el-form-item>
              </div>
              <el-form-item>
                <el-button v-if="isAuth('generator:pfac:save')" type="primary"  @click="dataFormSubmit()">提交</el-button>
                <el-button @click="reset">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-col>
      <el-col :span="13">
        <div class="grid-content bg-purple-light">
          <el-card>
            <el-form
              size="mini"
              ref="dataForm" @keyup.enter.native="dataFormSubmit()"
              :rules="dataRule"
              :model="dataForm"
              label-width="80px"
            >
              <el-form-item label="添加方式" >
                <el-col :span="24"><div class="grid-content bg-purple">
                  <el-radio border size="mini" @change="existenceChange(existence)"  v-model="existence" :label="0">已知来源</el-radio>
                  <el-radio border size="mini"  @change="existenceChange(existence)" v-model="existence"  :label="1">新增来源</el-radio>
                </div></el-col>
              </el-form-item>
              <el-form-item v-if="existence==0" label="生产厂家" prop="supplierId">
                <el-col :span="24">
                  <div class="grid-content bg-purple">
                    <el-select
                      v-if="existence==0"
                      style="width:100%;"
                      filterable
                      @change="supplerSelectChange(dataForm.supplierId)"
                      v-model="dataForm.supplierId"
                      placeholder="选择已存在厂家信息"
                    >
                      <el-option
                        v-for="item in suppliers"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-form-item>
              <div v-if="existence==0">
                <el-card class="box-card" style="margin-bottom: 30px;">
                  <div  class="text item" style="font-size: 12px;padding: 5px;">
                    厂家名称: <span style="margin-left: 200px;color: #999">
                    <el-tag size="mini" type="info">{{supplierInfo.name}}</el-tag>
                  </span>
                  </div>
                  <div  class="text item" style="font-size: 12px;padding: 5px;">
                    厂家地址: <span style="margin-left: 200px;color: #999">
                    <el-tag size="mini" type="info">{{supplierInfo.address}}
                    </el-tag></span>
                  </div>
                  <div  class="text item" style="font-size: 12px;padding: 5px;">
                    联系方式: <span style="margin-left: 200px;color: #999">
                    <el-tag size="mini" type="info">{{supplierInfo.phone}}
                    </el-tag></span>
                  </div>
                  <div  class="text item" style="font-size: 12px;padding: 5px;">
                    备注: <span style="margin-left: 200px;color: #999">
                    <el-tag size="mini" type="info">{{supplierInfo.remark}}
                    </el-tag></span>
                  </div>
                </el-card>
              </div>

              <div v-if="existence==1">
<!--                新增-->
                <el-form
                  size="mini"
                  :model="BindataForm"
                  :rules="BindataRule"
                  ref="BindataForm"
                  label-width="80px">
                  <el-form-item label="厂家名称" prop="name">
                    <el-input v-model="BindataForm.name" placeholder="厂家名称"></el-input>
                  </el-form-item>
                  <el-form-item label="厂家地址" prop="address">
                    <el-input v-model="BindataForm.address" placeholder="厂家地址"></el-input>
                  </el-form-item>
                  <el-form-item label="公司网站" prop="imageUrl">
                    <el-input v-model="BindataForm.imageUrl" placeholder="http://"></el-input>
                  </el-form-item>
                  <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="BindataForm.phone" placeholder="联系电话"></el-input>
                  </el-form-item>
                  <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" :rows="2" v-model="BindataForm.remark" placeholder="备注"></el-input>
                  </el-form-item>
                </el-form>
                <el-row>
                <el-col :span="20">
                  &nbsp
                </el-col>
                <el-col :span="4">
              <el-button size="small" type="success" @click="saveBin()">保存</el-button>
                </el-col>
                </el-row>
<!--                新增-->
              </div>

              <el-form-item label="图片" prop="imageUrl">
                <el-col :span="12">
                  <el-input   :disabled="true" v-model="dataForm.imageUrl"></el-input></el-col>
                <el-col :span="12">
                  <el-button type="primary" @click="uploadHandle()">上传图片</el-button>
                </el-col>
              </el-form-item>

              <el-form-item label="说明书" prop="guide">
                <el-col :span="12">
                  <el-input   :disabled="true" v-model="dataForm.guide"></el-input></el-col>
                <el-col :span="12">
                  <el-button type="primary" @click="uploadHandle2()">上传文档</el-button>
                </el-col>
              </el-form-item>


            </el-form>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <!-- 弹窗, 上传文件 -->
    <upload v-if="uploadVisible" ref="upload" @func="getMsgFormSon"></upload>
    <!-- 弹窗, 上传文件 -->
    <upload v-if="uploadVisible2" ref="upload" @func="getMsgFormSon2"></upload>
  </div>
</template>
<script>
import Upload from '../oss/oss-upload'
export default {
  data() {
    return {
      uploadVisible: false,
      uploadVisible2: false,
      selectedIndex:'',
      currentRow:'',
      dataForm: {
        id: 0,
        facNum: '',
        name: '',
        imageUrl: '',
        guide:'',
        type: '',
        operator: '',
        model: '',
        unit: '',
        sort: '',
        kind: '',
        brand: '',
        user: '',
        address: '',
        made: '',
        madeIn: '',
        madeOutTime: '',
        buyTime: '',
        price: '',
        enableTime: '',
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
        // imageUrl: [
        //   { required: true, message: '图片不能为空', trigger: 'blur' }
        // ],
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ],
        supplierId: [
          { required: true, message: '厂家不能为空', trigger: 'blur' }
        ],
        Pid: [
          { required: true, message: '父分类不能为空', trigger: 'blur' }
        ],
        operator: [
          { required: true, message: '操作员不能为空', trigger: 'blur' }
        ],
        model: [
          { required: true, message: '规格型号不能为空', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '单位不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ],
        kind: [
          { required: true, message: '设备种类不能为空', trigger: 'blur' }
        ],
        brand: [
          { required: true, message: '所属品牌不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '放置地点不能为空', trigger: 'blur' }
        ],
        made: [
          { required: true, message: '生产厂家不能为空', trigger: 'blur' }
        ],
        madeIn: [
          { required: true, message: '产地不能为空', trigger: 'blur' }
        ],
        madeOutTime: [
          { required: true, message: '出厂日期不能为空', trigger: 'blur' }
        ],
        buyTime: [
          { required: true, message: '购买时间不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '购买价格不能为空', trigger: 'blur' }
        ],
        enableTime: [
          { required: true, message: '启用时间不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ]
      },
      supplierInfo:{name:"选择后显示具体信息",address:"选择后显示地址信息",contact:"选择后显示联系人信息",
        phone:"选择后显示联系方式",remark:"选择后显示备注信息"},//卡片展示
      existence:0,
      itemNum: 0,
      suppliers: [],
      selectProps: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        children: "children"
      }, //级联选择器配置项
      categorys: [],
      drawer: false,
      total: 0,
      queryMap: {
        pageNum: 1,
        pageSize: 6,
        status:0,
      },
      categorykeys: [],
      tableData: [],
      products: [],
      Pid:"",
      BindataForm: {
        id: 0,
        num: '',
        name: '',
        imageUrl: '',
        address: '',
        status: '',
        phone: '',
        remark: ''
      },
      BindataRule: {
        num: [
          { required: true, message: '编号不能为空', trigger: 'blur' }
        ],
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
    };
  },
  components: {
    Upload
  },
  methods: {
    /**加载来源数据
     */
    async getSuppliers() {
      this.$http({
        url: this.$http.adornUrl('/generator/pbins/list'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.suppliers = data.page.list;
        }
      })
    },
    //重置信息
    reset(){
      this.dataForm={type: 1};
       this.$refs.dataForm.clearValidate();
      this.supplierInfo={name:"选择后显示具体信息",address:"选择后显示地址信息",contact:"选择后显示联系人信息",
        phone:"选择后显示联系方式",remark:"选择后显示邮箱信息"};
    },
    //改变来源选择
    supplerSelectChange(supplierId){
      var obj=this.suppliers.find(function (x) {
        return x.id === supplierId;
      });
      this.supplierInfo=obj;
    },
    /**
     * 创建入库单
     */
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
              'guide': this.dataForm.guide,
              'type': this.dataForm.type,
              'operator': this.$store.state.user.name,
              'model': this.dataForm.model,
              'unit': this.dataForm.unit,
              'sort': this.dataForm.sort,
              'kind': 999,
              'brand': this.dataForm.brand,
              'user': this.dataForm.user,
              'address': this.dataForm.address,
              'made':  this.dataForm.supplierId,
              'madeIn': this.dataForm.madeIn,
              'madeOutTime': this.dataForm.madeOutTime,
              'buyTime': this.dataForm.buyTime,
              'price': this.dataForm.price,
              'enableTime': this.dataForm.enableTime,
              'oneCategoryId': this.categorykeys[0],
              'twoCategoryId': this.categorykeys[1],
              'threeCategoryId': this.categorykeys[2],
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
    },
    /**
     * 加载商品列表(可入库)
     */
    async loadTableData() {
      this.$http({
        url: this.$http.adornUrl('/generator/pfac/findFacList'),
        method: 'get',
        params: this.queryMap
      }).then(({data}) => {
        if (data && data.code === 0) {
            this.total = 10;
            this.tableData = data.page.records;
        }
      })
    },
    /**
     * 分类搜索改变时
     */
    selectChange() {
      var str = "";
      for (var i = 0; i < this.categorykeys.length; i++) {
        str += this.categorykeys[i] + ",";
      }
      str = str.substring(0, str.length - 1);
      this.queryMap.categorys = str;
    },

    /**
     * 加载商品类别
     */
    async getCategorys() {
      this.$http({
        url: this.$http.adornUrl("/generator/pfaccategory/list/tree"),
        method: "get"
      })
        .then(({ data }) => {   //{ data } 解构
          this.categorys = data.data;
        })
        .catch(() => {});
    },
    /**
     * 搜索
     */
    search() {
      this.queryMap.pageNum = 1;
      this.loadTableData();
    },
    /**
     *  指定一个key标识这一行的数据
     */
    getRowKey(row) {
      return row.id;
    },
    /**
     * val表示选中的表格行数据
     */
    handleSelectionChange(val) {
      console.log(val[0].id)
      this.Pid = val[0].id;
    },
    /**
     * 改变页码
     */
    handleSizeChange(newSize) {
      this.queryMap.pageSize = newSize;
      this.loadTableData();
    },
    /**
     * 点击分页
     */
    handleCurrentChange(current) {
      this.queryMap.pageNum = current;
      this.loadTableData();
    },
    /**
     * 清空所有
     */
    removeAllItem(){
      this.products.forEach(row => {
        this.$refs.dataTable.toggleRowSelection(row, false);
      });
      this.products=[];
    },
    /**
     * 改变来源
     */
    existenceChange(existence){
      //选择已经存在的来源
      if(existence===1){
      }else if(existence===0){
        this.addRuleForm.supplierId='';
      }
      this.$refs.addRuleFormRef.clearValidate();
      this.supplierInfo={name:"选择后显示具体信息",address:"选择后显示地址信息",contact:"选择后显示联系人信息",
        phone:"选择后显示联系方式",email:"选择后显示邮箱信息"};
    },

    /**
     * 移除item从抽屉中
     */
    removeItem(val) {
      this.products.forEach(row => {
        if (row.id == val) {
          this.$refs.dataTable.toggleRowSelection(row, false);
        }
      });
      this.products = this.products.filter(item => item.id !== val);
    },
    getPId(id){
      this.Pid = id;
    },
    handleCurrentChange2(val) {
      this.currentRow = val;
      this.selectedIndex=val.index;
      this.Pid = val.id;
    },
    rowClass({row, rowIndex}){
      if((this.selectedIndex) === rowIndex){
        // return { "background-color": "rgba(185, 221, 249, 0.75)" }
        return { "border": "solid 1px #3dffef","background-color": "rgba(185, 221, 249, 0.75)" }
        console.log(rowIndex)
      }
    },
    tableRowClassName({row, rowIndex}){
      row.index=rowIndex;
    },
    // 上传文件
    uploadHandle () {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.upload.init()
      })
    },
    // 上传文件
    uploadHandle2 () {
      this.uploadVisible2 = true
      this.$nextTick(() => {
        this.$refs.upload.init()
      })
    },
    getMsgFormSon(data){
      this.dataForm.imageUrl = data
    },
    getMsgFormSon2(data){
      this.dataForm.guide = data
    },
    saveBin () {
      this.$refs['BindataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/generator/pbins/save`),
            method: 'post',
            data: this.$http.adornData({
              'name': this.BindataForm.name,
              'imageUrl': this.BindataForm.imageUrl,
              'address': this.BindataForm.address,
              'status': 0,
              'phone': this.BindataForm.phone,
              'remark': this.BindataForm.remark
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
              })
              this.existence=0
              this.getSuppliers()
              this.BindataForm=""

            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  },
  created() {
    // this._getJsonData();
    this.loadTableData();
    this.getCategorys();
    this.getSuppliers();
  },
  watch: {
    dataForm2(val) {
      this.dataForm.imageUrl==val;
    },
    dataForm(val) {
      this.dataForm.guide==val;
    }
  }
};
</script>
