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
  </div>
</template>

<script>
import lodash from 'lodash';

export default {
  methods: {
  },

  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.dailog-steps {
  margin: auto;
}
</style>
