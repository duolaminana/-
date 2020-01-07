<template>
  <div class="user-item">
    <img class="user-item-avatar" :src="fullUrl(avatarUrl)">
    <p>{{status==='1'? 'Online' : 'Offline'}}</p>
    <p>{{username}}</p>
  </div>
</template>
<script>
export default {
  props: {
    avatarUrl: { type: String, default: "" },
    status: {
      type: String,
      default: "0"
    },
    username: { type: String, default: "" }
  }
};
</script>
<style lang="scss" scoped>
.user-item {
  width: 180px;
  .user-item-avatar {
    height: 35px;
    width: 35px;
    float: left;
    margin-right: 10px;
  }
  p {
    // font-size: 12px;
    overflow: hidden;
    margin: 2px 0px;
  }
}
</style>
