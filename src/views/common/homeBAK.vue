<template>
  <div class="mod-home">


    <el-row :gutter="15">
      <!-- 左边部分 -->
      <el-col :span="13">
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
        <el-row style="margin-top:10px;" :gutter="10">
          <el-card style="height:200px;">
            <div slot="header" class="clearfix">
              <span>数据概览</span>
            </div>
            <el-col :span="6">
              <div class="home-card1">
              <div class="home-card2" >
                <router-link to="/generator-Fac" style="color:white;">
                  {{ statusList.s }}
                </router-link>
              </div>
                <div class="home-card3">总数</div>
              </div>
            </el-col>
            <el-col v-if="isAuth('generator:pfac:audit')" :span="6">
              <div class="home-card1" style="background-color: #8bc34a">
                <div class="home-card2">
                  <router-link to="/generator-pfacfix" style="color:white;">
                  {{ statusList.wx }}
                  </router-link>
                </div>
                <div class="home-card3">维修设备数</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="home-card1" style="background-color: #1d89cf">
                <div class="home-card2">
                  <router-link to="/generator-pfacout" style="color:white;">
                  {{ statusList.zj }}
                  </router-link>
                </div>
                <div class="home-card3">在借</div>
              </div>
            </el-col>
            <el-col v-if="isAuth('generator:pfac:audit')" :span="6">
              <div  class="home-card1" style="background-color: #a767dd">
                <div class="home-card2">
                  <router-link to="/generator-Fac" style="color:white;">
                  {{ statusList.ysh }}
                  </router-link>
                </div>
                <div class="home-card3">预约审核</div>
              </div>
            </el-col>
          </el-card>
        </el-row>
        <el-row v-if="isAuth('generator:pfac:audit')" style="margin-top:5px;" :gutter="10">
          <el-card style="height:140px;">
            <el-col :span="6">
              <div class="home-card1" style="background-color: #DAA520">
                <div class="home-card2">
                  <router-link to="/generator-Fac" style="color:white;">
                  {{ statusList.wsh }}
                  </router-link>
                </div>
                <div class="home-card3">维修审核</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="home-card1" style="background-color: #a767dd">
                <div class="home-card2">
                  <router-link to="/generator-Fac" style="color:white;">
                  {{ statusList.bsh }}
                  </router-link>
                </div>
                <div class="home-card3">报废审核</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="home-card1" style="background-color: #CD5C5C">
                <div class="home-card2">
                  <router-link to="/generator-Fac" style="color:white;">
                  {{ statusList.gsh }}
                  </router-link>
                </div>
                <div class="home-card3">归还审核</div>
              </div>
            </el-col>
            <el-col :span="6">
<!--              <div class="home-card1" style="background-color: #a767dd">-->
<!--                <div class="home-card2">  </div>-->
<!--                <div class="home-card3"></div>-->
<!--              </div>-->
            </el-col>
          </el-card>
        </el-row>
      </el-col>
      <!-- 右边部分 -->
      <el-col :span="11">
        <div class="grid-content bg-purple">
          <el-card style="min-height:530px; line-height: 530px;text-align: center;font-size: 30px;font-weight: 500px">
            loading...

          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px;" :gutter="10">
      <el-col>
        <el-card >
          <!-- 用户登入报表 -->

          <div class="mod-demo-echarts"style="color: white">
            <div id="J_chartBarBox" class="chart-box"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <panel-group :statusList="statusList"  />
  </div>
</template>

<script>
import echarts from 'echarts'
import PanelGroup from './component/PanelGroup'
  export default {
  components:{
    PanelGroup
  },
    data () {
      return {
        userInfo: {},
        tableInfo: [],
        chartBar: null,
        statusList:{
          s:'',
          wx:'',
          zj:'',
          bf:'',
          ysh:'',
          wsh:'',
          bsh:'',
          gsh:''
        },

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
          url: this.$http.adornUrl('/generator/pfac/allstatuslist'),
          method: 'get',
        }).then(({data}) => {
          this.statusList  = data[0]
        })
        }else{
          // 普通用户显示自己的在借设备数
          this.$http({
            url: this.$http.adornUrl('/generator/pfac/statuslist'),
            method: 'get',
            params: this.$http.adornParams({
              'user': this.$store.state.user.name
            })
          }).then(({data}) => {
            this.statusList  = data
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

