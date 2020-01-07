<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ConversationItem from "./ConversationItem.vue";

export default {
  components: { ConversationItem },
  data() {
    return {
      isCacheArr: []
    };
  },
  computed: {
    ...mapState("cs", ["conversation", "active"]),
    ...mapGetters(["userInfo"])
  },
  methods: {
    ...mapActions("cs", [
      "changeActive",
      "getSourceUrl",
      "getGroupMembers",
      "getMemberAvatarUrl"
    ]),
    async selectTarget(item) {
      if (
        this.active.activeIndex !== -1 &&
        Number(this.active.key) === Number(item.key)
      ) {
        return;
      }
      this.changeActive(item);
      // 判断是否已经缓存
      if (this.isCacheArr.indexOf(item.key) === -1) {
        this.isCacheArr.push(item.key);
        this.getSourceUrl(item);
        if (item.type === 4) {
          await this.getGroupMembers(item);
          this.getMemberAvatarUrl(item);
        }
      }
    }
  }
};
</script>

<template>
  <div class="chat-conversation-list">
    <div class="chat-conversation-item-container"
      v-for="item in conversation"
      @click="selectTarget(item)"
      :key="item.key"
    >
      <ConversationItem
        :owner="item.desc ? item.desc.split('#')[2] : ''"
        :name="item.name"
        :mtime="item.recentMsg ? item.recentMsg.ctime_ms : 0"
        :recent-msg="item.recentMsg"
              :class="{'chat-conversation-item': true, unreply: item.recentMsg&&item.recentMsg.content.from_id !== userInfo.userAccount && item.key !== active.key, active: active.activeIndex !== -1 && item.key === active.key}"

      ></ConversationItem>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-conversation-list {
  overflow: auto;
  height: 787px;
  .chat-conversation-item-container{
    border: 1px solid #ddd;
  }
  .chat-conversation-item {
    padding: 12px 15px;
    border: 8px;
    border-style: none solid;
    border-color: #06a55b;
    cursor: pointer;
    &.active {
      border: 8px;
      border-style: none solid;
      border-color: #579cdd;
    }
    &.unreply {
      border: 8px;
      border-style: none solid;
      border-color: #d6ab32;
    }
    &:hover {
      background-color: #f5f3f3;
    }
  }
}
</style>
