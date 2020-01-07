<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import TagsView from './components/TagsView'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  data () {
    return {
      webSock: null
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    userInfo() {
      return this.$store.state.settings.userInfo
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    },
    initWebSocket() { // 初始化weosocket
      const wsUri = `ws://192.168.18.169:8059/websocket/${this.userInfo.accountBId}`;
      this.webSock = new WebSocket(wsUri);
      this.webSock.onmessage = this.websocketonmessage;
      this.webSock.onopen = this.websocketonopen;
      this.webSock.onerror = this.websocketonerror;
      this.webSock.onclose = this.websocketclose;
    },
    websocketonopen() { // 连接建立之后执行send方法发送数据
      this.websocketsend(this.user)
    },
    websocketonerror() { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage(e) {
      console.log(e)
    },
    websocketsend(Data) { // 数据发送
      this.webSock.send(Data)
    },
    websocketclose(e) { // 关闭
      console.log('断开webSocket连接', e)
    }
  },
  destroyed() {
    this.websocketclose()
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
