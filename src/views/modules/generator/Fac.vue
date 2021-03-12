<template>
  <div id="inStocks">
    <!-- 面包导航 -->
<!--    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">-->
<!--      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>-->
<!--      <el-breadcrumb-item>设备管理</el-breadcrumb-item>-->
<!--      <el-breadcrumb-item>新增设备</el-breadcrumb-item>-->
<!--    </el-breadcrumb>-->
    <!-- 卡片区域 -->
<!--    <el-card>-->
      <!-- 搜索部分 -->
      <el-form
        size="mini"
        :inline="true"
        :model="queryMap"
        class="demo-form-inline">

        <el-form-item label="类型">
          <el-select  clearable  v-model="queryMap.type" placeholder="请选择入库类型">
            <el-option label="采购" value="0"></el-option>
            <el-option label="捐赠" value="1"></el-option>
            <el-option label="借用" value="2"></el-option>
            <el-option label="下拨" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input clearable v-model="queryMap.name" class="input-with-select" placeholder="模糊查找"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryMap.status" placeholder="请选择状态">
            <el-option label="空闲" :value="0"></el-option>
            <el-option label="在借" :value="1"></el-option>
            <el-option label="维修" :value="2"></el-option>
            <el-option label="报废" :value="3"></el-option>
            <el-option v-if="isAuth('generator:pfac:audit')" label="预约待审核" :value="4"></el-option>
            <el-option v-if="isAuth('generator:pfac:audit')"label="维修待审核" :value="5"></el-option>
            <el-option v-if="isAuth('generator:pfac:audit')"label="维报废待审核" :value="6"></el-option>
            <el-option v-if="isAuth('generator:pfac:audit')"label="归还待审核" :value="7"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-cascader
            :change-on-select="true"
            @change="selectChange"
            v-model="categorykeys"
            :props="selectProps"
            :options="catetorys"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getDataList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh" type="warning" @click="clearTime">重置</el-button>
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-button v-if="isAuth('generator:pfac:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
<!--        </el-form-item>-->
        <el-form-item>
          <el-button type="button" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格区域 -->
      <el-table
        size="mini"
        v-loading="loading"
        :data="dataList"
        @selection-change="selectionChangeHandle"
        border
        style= "width: 100%;" height="430">

        <el-table-column type="selection" header-align="center" align="center" width="30"></el-table-column>
        <el-table-column prop="id" header-align="center" align="center" label="序号" width="50" ></el-table-column>
        <el-table-column prop="imageUrl" label="图片" align="center" width="145" padding="0px">
          <template slot-scope="scope">
            <el-popover placement="right" trigger="hover">
              <img :src="scope.row.imageUrl"
                   style="height: 220px;width: 320px"/>
              <img slot="reference" :src="scope.row.imageUrl"
                   :alt="scope.row.imgUrl" style="height: 100px;width: 130px;cursor: pointer">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="facNum" header-align="center" align="center" label="编号":show-overflow-tooltip='true' width="120"></el-table-column>
        <el-table-column prop="name" header-align="center" align="center" label="设备名称"  width="150"></el-table-column>
        <el-table-column prop="operator" header-align="center" align="center" label="操作员"></el-table-column>
        <el-table-column prop="model" header-align="center" align="center" label="规格型号"></el-table-column>
        <el-table-column prop="unit" header-align="center" align="center" label="单位"></el-table-column>
        <el-table-column prop="type" label="状态" :show-overflow-tooltip='true' width="110">
          <template slot-scope="scope">
            <el-tag  type="success" v-if="scope.row.status===0">空闲</el-tag>
            <el-tag  v-else-if="scope.row.status===1">在借</el-tag>
            <el-tag  type="danger" v-else-if="scope.row.status===2">维修</el-tag>
            <el-tag  type="warning" v-else-if="scope.row.status===3">报废</el-tag>
            <el-tag  type="warning" v-else-if="scope.row.status===4">预约审核中</el-tag>
            <el-tag  type="warning" v-else-if="scope.row.status===5">维修审核中</el-tag>
            <el-tag  type="warning" v-else-if="scope.row.status===6">报废审核中</el-tag>
            <el-tag  type="warning" v-else-if="scope.row.status===7">归还审核中</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template slot-scope="scope">
            <el-tag  type="success" v-if="scope.row.type===0">采购</el-tag>
            <el-tag  v-else-if="scope.row.type===1">捐赠</el-tag>
            <el-tag  type="danger" v-else-if="scope.row.type===2">借用</el-tag>
            <el-tag  type="danger" v-else-if="scope.row.type===3">下拨</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="kind" header-align="center" align="center" label="设备种类"></el-table-column>
        <el-table-column prop="brand" header-align="center" align="center" label="所属品牌"></el-table-column>
<!--        <el-table-column prop="user" header-align="center" align="center" label="在使用人"></el-table-column>-->
        <el-table-column prop="address" header-align="center" align="center" label="放置地点" :show-overflow-tooltip='true' width="150">
        </el-table-column>
        <el-table-column prop="useCount" header-align="center" align="center" label="使用次数"></el-table-column>
        <el-table-column   label="说明书">
          <template slot-scope="scope">
            <a :href="scope.row.guide">下载</a>
          </template>
        </el-table-column>

        <el-table-column prop="buyDep" header-align="center" align="center" label="购买部门"></el-table-column>
        <el-table-column prop="made" header-align="center" align="center" label="生产厂家"></el-table-column>
        <el-table-column prop="madeIn" header-align="center" align="center" label="产地"></el-table-column>
        <el-table-column prop="createTime" header-align="center" align="center" label="入库日期" :show-overflow-tooltip='true' width="150"></el-table-column>
        <el-table-column prop="madeOutTime" header-align="center" align="center" label="出厂日期" :show-overflow-tooltip='true' width="150"></el-table-column>
        <el-table-column prop="expTime" header-align="center" align="center" label="到期时间" :show-overflow-tooltip='true' width="150"></el-table-column>
        <el-table-column prop="price" header-align="center" align="center" label="购买价格"></el-table-column>
        <el-table-column prop="enableTime" header-align="center" align="center" label="启用时间" :show-overflow-tooltip='true' width="150"></el-table-column>
        <el-table-column prop="remark" header-align="center" align="center" label="备注" :show-overflow-tooltip='true'></el-table-column>

        <el-table-column label="操作" fixed="right" width="250">
          <template slot-scope="scope">
<!--            <el-button icon="el-icon-view"  @click="detail(scope.row.id)" type="text" size="small">资料</el-button>-->
            <el-row>
              <el-col :span="24">
            <el-button  v-if="isAuth('generator:pfacout:save')" :disabled="scope.row.status > 0" type="success" size="small" @click="book(scope.row.id)">预约</el-button>
            <el-button  v-if="isAuth('generator:pfac:update')"  type="info" size="small" @click="addOrUpdateHandle(scope.row.id)">维护</el-button>
                <el-button  v-if="scope.row.status===0 && isAuth('generator:pfacfix:save')"  type="danger"size="small" @click="addOrUpdateHandledpcd(scope.row.id)">报废</el-button>

                <!--            <el-button  v-if="isAuth('generator:pfac:delete')"  type="danger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>-->
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="padding-top: 10px">
            <el-button  v-if="scope.row.status===4 && isAuth('generator:pfac:audit')" type="warning" size="small" @click="bookAudit(scope.row.id)">预约审核</el-button>
            <el-button  v-if="scope.row.status===5 && isAuth('generator:pfacfix:audit')"  size="small" @click="fixAudit(scope.row.id)">维修审核</el-button>
            <el-button  v-if="scope.row.status===6 && isAuth('generator:pfac:audit')" type="warning" size="small" @click="b(scope.row.id)">报废审核</el-button>
              </el-col>
            </el-row>
            <el-button  v-if="scope.row.status===7 && isAuth('generator:pfac:audit')" type="warning" size="small" @click="retAudit(scope.row.id)">归还审核</el-button>
            <el-button  v-if="scope.row.status===0 && isAuth('generator:pfacfix:save')"  type="warning"size="small" @click="addOrUpdateHandlefix(scope.row.id)">维修</el-button>


          </template>
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination
        style="margin-top:10px;"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
        ></el-pagination>
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      <fac-out @refreshDataList="getDataList" v-if="bookDialogVisible" ref="FacOut"></fac-out>
      <fac-book-audit @refreshDataList="getDataList" v-if="bookAuditDialogVisible" ref="FacBookAudit"></fac-book-audit>
      <fac-rtn-audit  @refreshDataList="getDataList" v-if="bookRtnAuditDialogVisible" ref="FacRtnAudit"></fac-rtn-audit>
      <fac-fix-audit @refreshDataList="getDataList" v-if="fixAuditDialogVisible" ref="FacFixAudit"></fac-fix-audit>
      <!--新增维修单-->
      <add-or-updatefix @refreshDataList="getDataList" v-if="addOrUpdateVisiblefix" ref="AddOrUpdatefix"></add-or-updatefix>
    <!--新增报废单-->
    <add-or-updatedpcd @refreshDataList="getDataList" v-if="addOrUpdateVisibledpcd" ref="AddOrUpdatedpcd"></add-or-updatedpcd>

      <!-- 设备详情 -->
      <el-dialog title="设备详情" :visible.sync="dialogVisible" @close="closeDetail" width="60%">
        <span>
          <template>
            222
          </template>
        </span>
      </el-dialog>
<!--    </el-card>-->
  </div>
</template>

<script>
import AddOrUpdate from './pfac-add-or-update'
import FacOut from './fac-out'
import FacBookAudit from './audit/FacBookAudit'
import FacRtnAudit from './audit/FacRtnAudit'
import FacFixAudit from './audit/FacFixAudit'
import AddOrUpdatefix from './pfacfix-add-or-updatefix'
import AddOrUpdatedpcd from './pfacdpcd-add-or-updatedpcd'

export default {
  data() {
    return {
      pageNum:1,
      loading: true,
      dialogVisible: false,
      bookDialogVisible: false,
      bookAuditDialogVisible: false,
      bookRtnAuditDialogVisible: false,
      addOrUpdateVisiblefix: false,
      fixAuditDialogVisible: false,
      addOrUpdateVisibledpcd:false,
      total: 0,
      queryMap: {name:"",type:"",status:"",
        pageNum: 1,
        pageSize: 10,
        categorys: '',
      },
      pStatus:'',//步骤flag
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      selectProps: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        children: "children"
      }, //级联选择器配置项
      catetorys: [],
      categorykeys: [],
    };
  },
  components: {
    AddOrUpdate,
    FacOut,
    FacBookAudit,
    FacRtnAudit,
    AddOrUpdatefix,
    FacFixAudit,
    AddOrUpdatedpcd
  },
  activated () {
    this.getDataList()
  },
  methods: {
    clearTime(){
      this.queryMap= {name:"",type:"",status:""};
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/generator/pfac/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'name': this.queryMap.name,
          'type':this.queryMap.type,
          'status':this.queryMap.status,
          'categorys':this.queryMap.categorys

        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    //预约
    book(id) {
      this.bookDialogVisible = true
      this.$nextTick(() => {
        this.$refs.FacOut.init(id)
      })
    },
    bookAudit(id){
      this.bookAuditDialogVisible = true
      this.$nextTick(() => {
        this.$refs.FacBookAudit.init(id)
      })
    },
    fixAudit(id){
      this.fixAuditDialogVisible = true
      this.$nextTick(() => {
        this.$refs.FacFixAudit.init(id)
      })
    },
    retAudit(id){
      this.bookRtnAuditDialogVisible = true
      this.$nextTick(() => {
        this.$refs.FacRtnAudit.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/generator/pfac/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    /**
     * 查看入库单明细
     */
    async detail(id) {
      this.dialogVisible = true;
    },
    /**
     * 关闭明细
     */
    closeDetail(){
      this.pageNum=1;
    },
    bookDDetail(){
      this.pageNum=1;
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
      console.log(this.queryMap.categorys)
    },
    /**
     * 加载商品类别
     */
    async getCatetorys() {
      this.$http({
        url: this.$http.adornUrl("/generator/pfaccategory/list/tree"),
        method: "get"
      })
        .then(({ data }) => {   //{ data } 解构
          this.catetorys = data.data;
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
    async loadTableData() {
      this.$http({
        url: this.$http.adornUrl('/generator/pfac/findFacList'),
        method: 'get',
        params: this.queryMap
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.page.records
          this.totalPage = data.page.total
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandlefix (id) {
      this.addOrUpdateVisiblefix = true
      this.$nextTick(() => {
        this.$refs.AddOrUpdatefix.init(id)
      })
    },
    // 新增 / 修改
    addOrUpdateHandledpcd (id) {
      this.addOrUpdateVisibledpcd = true
      this.$nextTick(() => {
        this.$refs.AddOrUpdatedpcd.init(id)
      })
    }
  },
  created() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    this.getCatetorys();
  }
};
</script>
