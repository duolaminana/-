<template>
  <div>
    <span class="conversation-time">{{ mtime === 0 ? '' : parsedTime}}</span>
    <span class="conversation-name">name: {{owner}}</span>
    <span class="conversation-name">Ltd: {{name}}</span>
    <span
      class="conversation-recentMsg"
      v-if="Object.getOwnPropertyNames(recentMsg)!==0"
    >{{recentMsg.content.msg_type==='text'? recentMsg.content.msg_body.text : recentMsg.content.msg_type==='image'? "[图片]" : recentMsg.content.msg_type==='image'? "[文件]" : ""}}</span>
  </div>
</template>

<script>
import { parseTime } from "@/utils/index";

export default {
  data() {
    return {};
  },
  props: {
    owner: { type: String, default: "" },
    name: { type: String, default: "" },
    mtime: { type: Number, default: 0 },
    recentMsg: {
      type: Object,
      default: function() {
        return { content: { msg_type: "", msg_body: { text: "" }}};
      }
    }
  },
  computed: {
    parsedTime() {
      return parseTime(this.mtime, "{h}:{i}");
    }
  }
};
</script>

<style scoped lang="scss">
.conversation-name {
  display: block;
  line-height: 22px;
  margin-bottom: 2px;
  color: #2c2c2c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.conversation-time {
  float: right;
  color: #c8c8c8;
}

.conversation-recentMsg {
  color: #999;
  line-height: 18px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 170px;
  height: 18px;
  display: block;
  text-align: left;
}
</style>
