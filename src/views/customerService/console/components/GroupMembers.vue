<template>
  <div class="group-member-panel">
    <div class="group-member-head">CS Staff - Engaged</div>
    <div class="group-member-content">
      <div v-for="i in groupMembers" :key="i.uid">
        <div v-if="i.keep_silence === false" class="group-member-item">
          <img class="group-member-avatar" :src="fullUrl(i.avatarUrl)" >
          <p>{{i.chatStatus === '1' ? 'Online' : 'Offline'}}</p>
          <p>{{i.username}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  computed: {
    ...mapGetters("cs", ["memberList"]),
    ...mapState("cs", ["onlineList"]),
    groupMembers() {
      const gpList = this.memberList;
      for (let i in gpList) {
        Object.assign(
          gpList[i],
          this.onlineList.find(item => {
            return item.csAccount === gpList[i].username;
          })
        );
      }
      return gpList;
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.group-member-panel {
  .group-member-head {
    background: #a7bfee;
    height: 50px;
    width: 100%;
    padding: 17px;
    text-align: center;
  }
  .group-member-content {
    height: 140px;
    overflow: auto;
  }
  .group-member-item {
    padding: 10px 0 0 10px;
    .group-member-avatar {
      height: 35px;
      width: 35px;
      float: left;
      margin-right: 10px;
    }
    p {
      overflow: hidden;
      margin: 2px 0px;
    }
  }
}
</style>
