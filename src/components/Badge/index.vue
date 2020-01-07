<template>
  <div v-if="badgeCount" class="badgeCount">
    <el-badge :value="badgeCount" class="item">
      <svg-icon icon-class="xiaoxi" @click.native="click" />
    </el-badge>
  </div>
</template>

<script>
export default {
  name: 'Screenfull',
  data() {
    return {
    }
  },
  computed: {
    badgeCount() {
      return this.$store.state.user.badgeCount
    }
  },
  methods: {
    click() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
.badgeCount {
  margin-right: 20px;
  .el-badge__content.is-fixed {
    position: absolute;
    top: 30%;
    -webkit-transform: translateY(-50%) translateX(100%);
    transform: translateY(-50%) translateX(100%);
  }
  .el-badge__content {
    height: 16px;
    line-height: 16px;
  }
}
</style>
