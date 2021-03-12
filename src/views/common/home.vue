<template>
  <div class="mod-home" style="background-color: #f0f2f5;">
    <el-row :gutter="10">
      <el-card >
        <div slot="header" class="clearfix">
          <span>数据概览</span>
        </div>
      <el-col :span="24">
        <panel-group :statusList="statusList"  />
      </el-col>
      </el-card>
    </el-row>
    <el-card style="margin-top:10px;">
    <div slot="header" class="clearfix">
      <span>近一周设备状态</span>
    </div>
    <el-row >
      <line-chart :chart-data="lineChartData" />
    </el-row>
    </el-card>
    <el-row style="margin-top:10px;" :gutter="10">
      <el-col>
        <el-card >
          <div class="mod-demo-echarts"style="color: white">
            <div id="J_chartBarBox" class="chart-box"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px;" :gutter="10">
      <el-col>
                <el-col :span="24"  style="margin-top:10px;" :gutter="10">
                  <!-- 用户信息表格 -->
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>用户信息</span>
                    </div>
                    <el-table
                      size="mini"
                      :data="tableInfo"
                      border
                      style= "width: 100%;" height="80">
                      <el-table-column prop="username" header-align="center" align="center" label="账号" :show-overflow-tooltip='true'></el-table-column>
                      <el-table-column prop="email" header-align="center" align="center" label="邮箱" :show-overflow-tooltip='true'></el-table-column>
                      <el-table-column prop="mobile" header-align="center" align="center" label="电话" :show-overflow-tooltip='true'></el-table-column>
                      <el-table-column prop="status" header-align="center" align="center" label="状态">
                        <template slot-scope="scope">
                          <el-tag  type="success" v-if="scope.row.status===1">正常</el-tag>
                          <el-tag  v-else-if="scope.row.status!=1">异常</el-tag>
                        </template>
                      </el-table-column>
                    </el-table>

                  </el-card>
                  <!-- 功能列表 -->
                </el-col>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import echarts from 'echarts'
import PanelGroup from './component/PanelGroup'
import LineChart from './component/LineChart'
  export default {
  components:{
    PanelGroup,
    LineChart
  },
    data () {
      return {
        userInfo: {},
        tableInfo: [],
        chartBar: null,
        statusList:{
          s:'0',
          wx:'0',
          zj:'0',
          bf:'0',
          ysh:'0',
          wsh:'0',
          bsh:'0',
          gsh:'0'
        },
        lineChartData: {
          expectedData: [0, 0, 0, 0, 0, 0, 0],
          actualData: [0, 0, 0, 0, 0, 0, 0]
        }

      }
    },
    methods:{
      initChartBar () {
        var option = {
          'title': {
            'text': '各学院设备数'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // type: 'shadow'
            }
          },
          legend: {
            data: ['联盟广告']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['土木学院', '资环学院', '机械学院',
                '电气与信息工程学院', '理学院', '大数据学院', '交通工程学院',
                '矿业工程学院','航空航天工程学院','工程训练中心','体育学院','分析测试研究中心'
              ]
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              // name: '联盟广告',
              type: 'bar',
              // stack: '广告',
              data: [191, 234, 290, 330, 310,100,45,45,450,100,89,160],
              barWidth: 30,
              itemStyle:{
                normal:{
                  color:'#61a0a8'
                }
              },
            }
          ]
        }
        this.chartBar = echarts.init(document.getElementById('J_chartBarBox'))
        this.chartBar.setOption(option)
        window.addEventListener('resize', () => {
          this.chartBar.resize()
        })
      },
      getDataList () {
        // 有审核权限的管理员展示全部
        if(this.isAuth('generator:pfac:audit')){
        this.$http({
          url: this.$http.adornUrl('/generator/home/allstatuslist'),
          method: 'get',
        }).then(({data}) => {
          this.statusList  = data[0][0]
          this.lineChartData.expectedData=JSON.parse(data[1].replace(/^\"|\"$/g,''))
          this.lineChartData.actualData=JSON.parse(data[2].replace(/^\"|\"$/g,''))
        })
        }else{
          // 普通用户显示自己的在借设备数
          this.$http({
            url: this.$http.adornUrl('/generator/home/statuslist'),
            method: 'get',
            params: this.$http.adornParams({
              'user': this.$store.state.user.name
            })
          }).then(({data}) => {
            this.statusList  = data[0]
          })
        }
      }
    },
    created () {
      this.userInfo = this.$store.state.userInfo;
      this.tableInfo.push({
        username: this.userInfo.username,
        email: this.userInfo.email,
        mobile: this.userInfo.mobile,
        status: this.userInfo.status
      });
      setTimeout(() => {
      }, 1000);
      this.getDataList();
    },
    mounted () {
      this.initChartBar()
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.chartBar) {
        this.chartBar.resize()
      }
    },
  }
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }

</style>
<style lang="scss">
.mod-demo-echarts {
  > .el-alert {
    margin-bottom: 10px;
  }
  > .el-row {
    margin-top: -10px;
    margin-bottom: -10px;
    .el-col {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
  .chart-box {
    min-height: 400px;
  }
}
</style>

