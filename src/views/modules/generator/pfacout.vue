<template>
  <div class="mod-config">
    <el-form
      size="mini"
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('generator:pfacout:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('generator:pfacout:delete')" type="danger" @click="deleteRecordHandle()" :disabled="dataListSelections.length <= 0">批量删除使用记录</el-button>
      </el-form-item>
    </el-form>
    <el-table
      size="mini"
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;" height="420">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="序号"
        width="50">
      </el-table-column>
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
      <el-table-column
        prop="facNum"
        header-align="center"
        align="center"
        label="编号"
        :show-overflow-tooltip='true' width="100">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="设备名称"
        :show-overflow-tooltip='true' width="150">
      </el-table-column>
      <el-table-column
        prop="user"
        header-align="center"
        align="center"
        label="使用人">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="dep"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="使用所属部门">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="outTime"
        header-align="center"
        align="center"
        label="预约时间"
        :show-overflow-tooltip='true' width="150">
      </el-table-column>
      <el-table-column
        prop="nextTime1"
        header-align="center"
        align="center"
        label="预计归还时间"
        :show-overflow-tooltip='true' width="150">
      </el-table-column>
      <el-table-column
        prop="retnTime"
        header-align="center"
        align="center"
        label="归还时间"
        :show-overflow-tooltip='true' width="150">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="nextTime2"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="时间2"-->
<!--        :show-overflow-tooltip='true' width="150">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="nextTime3"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="时间3"-->
<!--        :show-overflow-tooltip='true' width="150">-->
<!--      </el-table-column>-->
      <el-table-column prop="status" label="状态" width="110">
        <template slot-scope="scope">
          <el-tag  type="success" v-if="scope.row.status===0">已归还</el-tag>
          <el-tag   v-else-if="scope.row.status===1">在借中</el-tag>
          <el-tag  v-else-if="scope.row.status===2">待审核</el-tag>
          <el-tag  type="danger" v-else-if="scope.row.status===3">未通过审核</el-tag>
          <el-tag  type="danger" v-else-if="scope.row.status===4">归还待审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"
        :show-overflow-tooltip='true' width="150">
      </el-table-column>
      <el-table-column
        prop="model"
        header-align="center"
        align="center"
        label="规格型号">
      </el-table-column>
      <el-table-column
        prop="unit"
        header-align="center"
        align="center"
        label="单位">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="kind"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="设备种类">-->
<!--      </el-table-column>-->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="250"
        label="操作"  >
        <template slot-scope="scope" >
          <el-button v-if="isAuth('generator:pfacout:update')" type="info" size="small" :disabled="scope.row.status != 1"  @click="addOrUpdateHandle(scope.row.id)">续借</el-button>
          <el-button v-if="isAuth('generator:pfacout:update')" type="success" size="small" :disabled="scope.row.status != 1"  @click="ReturnHandle(scope.row.id)">归还</el-button>
          <el-button  type="warning" size="small" :disabled="scope.row.status != 2"   @click="UndoHandle(scope.row.id)">撤销申请</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:10px;"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './pfacout-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        if (this.isAuth('generator:pfac:audit')){
        this.$http({
          url: this.$http.adornUrl('/generator/pfacout/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
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
      }else{
          this.$http({
            url: this.$http.adornUrl('/generator/pfacout/a_list'),
            method: 'get',
            params: this.$http.adornParams({
              'page': this.pageIndex,
              'limit': this.pageSize,
              'key': this.dataForm.key,
              'user': this.$store.state.user.name
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

        }
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
      // 撤销申请
      UndoHandle(id){
        this.$confirm(`确定撤销此申请${id}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/pfacout/undofac'),
            method: 'post',
            data: this.$http.adornData(id, false)
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
      // 归还
      ReturnHandle (id) {
        // console.log(facNum+"1111"),
        this.$confirm(`确定对${id}进行归还吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/pfacout/rentfac'),
            method: 'post',
            data: this.$http.adornData(id, false)
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
      //删除
      // ReturnHandle (id) {
      //   var ids = id ? [id] : this.dataListSelections.map(item => {
      //     return item.id
      //   })
      //   this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.$http({
      //       url: this.$http.adornUrl('/generator/pfacout/delete'),
      //       method: 'post',
      //       data: this.$http.adornData(ids, false)
      //     }).then(({data}) => {
      //       if (data && data.code === 0) {
      //         this.$message({
      //           message: '操作成功',
      //           type: 'success',
      //           duration: 1500,
      //           onClose: () => {
      //             this.getDataList()
      //           }
      //         })
      //       } else {
      //         this.$message.error(data.msg)
      //       }
      //     })
      //   })
      // }
    }
  }
</script>
