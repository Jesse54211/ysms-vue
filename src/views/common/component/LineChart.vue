<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('./macarons.js')
import resize from './mixins/resize'

export default {

  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      rowdata:['0','0','0','0','0','0','0','0']
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      let aData = new Date()
      this.rowdata=[ (aData.getMonth() + 1) + "-" + (aData.getDate()-7),
         (aData.getMonth() + 1) + "-" + (aData.getDate()-6),
         (aData.getMonth() + 1) + "-" + (aData.getDate()-5),
         (aData.getMonth() + 1) + "-" + (aData.getDate()-4),
         (aData.getMonth() + 1) + "-" + (aData.getDate()-3),
         (aData.getMonth() + 1) + "-" + (aData.getDate()-2),
         (aData.getMonth() + 1) + "-" + (aData.getDate()-1),
         '',
      ]
      this.setOptions(this.chartData)
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: this.rowdata,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['借用数', '维修数']
        },
        series: [
          {
            name: '维修数',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
                ,
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: actualData,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
          name: '借用数', itemStyle: {
            normal: {

                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }
        ]
      })
    }
  }
}
</script>
