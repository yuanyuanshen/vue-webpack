<template>
  <div class="dailog-steps">
    <el-steps :space="200"
              :active="3"
              finish-status="success">
      <el-step title="吃完饭"></el-step>
      <el-step title="开始写作业"></el-step>
      <el-step title="学数学"></el-step>
      <el-step title="学语文"></el-step>
      <el-step title="学英语"></el-step>
      <el-step title="开始睡觉"></el-step>
    </el-steps>
    <br />
    <line-chart :seriesName="seriesName"
                :seriesData="seriesData"
                titleText="内存使用率（%）"
                v-if="showGraph"
                titleSubText="纯属虚构"
                :unit="unit">
    </line-chart>
    <geo-map style="margin: 40px 40px;"
             width="46%" />
  </div>
</template>

<script>
import lodash from 'lodash';

export default {
  methods: {
    formatDate (nTimestamp) {
      /**
       * 前置补充0
       * @param {Number} num 数值
       * @param {Number} fill 最终长度
       * @return {String} fill为2时 1 => 01
       */
      const preZeroFill = (num, fill = 2) => {
        // 当前数字位数
        const nLen = ('' + num).length
        // 缺少的位数的长度
        const sPreLen = fill > nLen ? fill - nLen : 0
        return (
          Array(sPreLen)
            .fill(0)
            .join('') + num
        )
      }
      const date = new Date(nTimestamp)
      const sYear = date.getFullYear()
      const sMonth = preZeroFill(date.getMonth() + 1)
      const sDay = preZeroFill(date.getDate())
      const sHour = preZeroFill(date.getHours())
      const sMunite = preZeroFill(date.getMinutes())
      const sSecond = preZeroFill(date.getSeconds())
      return `${sYear}-${sMonth}-${sDay} ${sHour}:${sMunite}:${sSecond}`
    }
  },
  created () {
    this.seriesData = this.fakeResponse2.result.metricDatas[0].data
    this.seriesData.forEach(element => {
      element.times = this.formatDate(element.times)
    })
    this.seriesName = this.fakeResponse2.result.metricDatas[0].metric.metricName
    this.unit = this.fakeResponse2.result.metricDatas[0].metric.calculateUnit
    this.showGraph = true
  },

  data () {
    const fakeResponse2 = {
      requestId: 'bjeew6c04iukcvgfmu9vpk587we50k9s',
      result: {
        metricDatas: [
          {
            data: [
              { times: 1557980400000, value: ['0.0000'] },
              { times: 1557980460000, value: ['0.0000'] },
              { times: 1557980520000, value: ['0.0000'] },
              { times: 1557980580000, value: ['1.3333'] },
              { times: 1557980640000, value: ['0.0000'] },
              { times: 1557980700000, value: ['0.0000'] },
              { times: 1557980760000, value: ['0.0000'] },
              { times: 1557980820000, value: ['0.0000'] },
              { times: 1557980880000, value: ['1.1667'] },
              { times: 1557980940000, value: ['0.0000'] },
              { times: 1557981000000, value: ['0.0000'] },
              { times: 1557981060000, value: ['0.0000'] },
              { times: 1557981120000, value: ['0.0000'] },
              { times: 1557981180000, value: ['0.3333'] },
              { times: 1557981240000, value: ['0.0000'] },
              { times: 1557981300000, value: ['0.1667'] },
              { times: 1557981360000, value: ['0.0000'] },
              { times: 1557981420000, value: ['0.0000'] },
              { times: 1557981480000, value: ['0.1667'] },
              { times: 1557981540000, value: ['0.0000'] },
              { times: 1557981600000, value: ['0.0000'] },
              { times: 1557981660000, value: ['0.0000'] },
              { times: 1557981720000, value: ['0.0000'] },
              { times: 1557981780000, value: ['0.0000'] },
              { times: 1557981840000, value: ['0.0000'] },
              { times: 1557981900000, value: ['0.0000'] },
              { times: 1557981960000, value: ['0.0000'] },
              { times: 1557982020000, value: ['0.0000'] },
              { times: 1557982080000, value: ['0.3333'] },
              { times: 1557982140000, value: ['0.0000'] },
              { times: 1557982200000, value: ['0.0000'] },
              { times: 1557982260000, value: ['0.0000'] },
              { times: 1557982320000, value: ['0.0000'] },
              { times: 1557982380000, value: ['0.3333'] },
              { times: 1557982440000, value: ['0.0000'] },
              { times: 1557982500000, value: ['0.0000'] },
              { times: 1557982560000, value: ['0.0000'] },
              { times: 1557982620000, value: ['0.0000'] },
              { times: 1557982680000, value: ['0.6667'] },
              { times: 1557982740000, value: ['0.1667'] },
              { times: 1557982800000, value: ['0.0000'] },
              { times: 1557982860000, value: ['0.3333'] },
              { times: 1557982920000, value: ['0.0000'] },
              { times: 1557982980000, value: ['0.8333'] },
              { times: 1557983040000, value: ['0.0000'] },
              { times: 1557983100000, value: ['0.0000'] }
            ],
            metric: {
              calculateUnit: '%',
              metric: 'cpu_util',
              metricName: ['内存使用率'],
              aggregator: 'avg',
              period: '1min'
            }
          }
        ]
      },
      responseObj: {
        size: 0,
        timeout: 0,
        nonce: '219345f4-d2345fe-43456-923455-a23456'
      }
    }

    const fakeResponse1 = {
      requestId: 'bjeew6c04iukcvgfmu9vpk587we50k9s',
      result: {
        metricDatas: [
          {
            data: [
              { times: 1557979560000, value: ['0.0000', '0.1000'] },
              { times: 1557979620000, value: ['0.0000', '0.1667'] },
              { times: 1557979680000, value: ['0.0000', '0.1667'] },
              { times: 1557979740000, value: ['0.0000', '0.8333'] },
              { times: 1557979800000, value: ['0.0000', '0.3333'] },
              { times: 1557979860000, value: ['0.0000', '0.1667'] },
              { times: 1557979920000, value: ['0.1667', '0.3333'] },
              { times: 1557979980000, value: ['0.0000', '0.1667'] },
              { times: 1557980040000, value: ['0.0000', '0.3333'] },
              { times: 1557980100000, value: ['0.0000', '0.3333'] },
              { times: 1557980160000, value: ['0.0000', '1.5000'] },
              { times: 1557980220000, value: ['1.5000', '0.6667'] },
              { times: 1557980280000, value: ['0.0000', '0.3333'] },
              { times: 1557980340000, value: ['0.0000', '0.6667'] },
              { times: 1557980400000, value: ['0.0000', '0.6667'] },
              { times: 1557980460000, value: ['0.0000', '0.1667'] },
              { times: 1557980520000, value: ['0.0000', '0.3333'] },
              { times: 1557980580000, value: ['1.3333', '0.8333'] },
              { times: 1557980640000, value: ['0.0000', '0.0000'] },
              { times: 1557980700000, value: ['0.0000', '1.6667'] },
              { times: 1557980760000, value: ['0.0000', '0.3333'] },
              { times: 1557980820000, value: ['0.0000', '0.6667'] },
              { times: 1557980880000, value: ['1.1667', '0.0000'] },
              { times: 1557980940000, value: ['0.0000', '1.0000'] },
              { times: 1557981000000, value: ['0.0000', '0.3333'] },
              { times: 1557981060000, value: ['0.0000', '2.0000'] },
              { times: 1557981120000, value: ['0.0000', '0.6667'] },
              { times: 1557981180000, value: ['0.3333', '1.0000'] },
              { times: 1557981240000, value: ['0.0000', '0.1667'] },
              { times: 1557981300000, value: ['0.1667', '0.3333'] },
              { times: 1557981360000, value: ['0.0000', '0.6667'] },
              { times: 1557981420000, value: ['0.0000', '0.1667'] },
              { times: 1557981480000, value: ['0.1667', '0.1667'] },
              { times: 1557981540000, value: ['0.0000', '0.1667'] },
              { times: 1557981600000, value: ['0.0000', '1.0000'] },
              { times: 1557981660000, value: ['0.0000', '0.1667'] },
              { times: 1557981720000, value: ['0.0000', '0.5670'] },
              { times: 1557981780000, value: ['0.0000', '0.1000'] }
            ],
            metric: {
              calculateUnit: '%',
              metric: 'cpu_util',
              metricName: ['内存使用率', '覆盖率'],
              aggregator: 'avg',
              period: '1min'
            }
          }
        ]
      },
      responseObj: {
        size: 0,
        timeout: 0,
        nonce: '219345f4-d2345fe-43456-923455-a23456'
      }
    };
    return {
      seriesName: [],
      seriesData: [],
      unit: '',
      fakeResponse2,
      fakeResponse1,
      showGraph: false
    }
  }
}
</script>

<style lang="scss" scoped>
.dailog-steps {
  margin: auto;
}
</style>
