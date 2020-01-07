<template>
  <el-dropdown @command="changeStatus">
    <el-button size="medium">
      {{onlineStatus === 0 ? 'Offline' : 'Online'}}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        :command="onlineStatus === 0 ? 1 : 0"
      >{{onlineStatus === 0 ? 'Online' : 'Offline'}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters(["userInfo"]),
    ...mapState("cs", ["onlineStatus"])
  },
  methods: {
    ...mapActions("cs", ["setOnlineStatus"]),
    changeStatus(chatStatus) {
      this.setOnlineStatus(chatStatus)
        .then((res) => {
          this.$message.success(
            `${chatStatus === 1 ? "Online" : "Offline"} Successful!`
          );
        })
        .catch(err => {
          this.$message.error('Online Failed: ' + err.message);
        });
    }
  }
};
</script>
