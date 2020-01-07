<template>
  <div class="online-member-panel">
    <header class="online-member-head">CS Staff - Availabe</header>
    <el-tabs v-model="activeName" type="card" stretch>
      <el-tab-pane class="online-member-tab" label="CS" name="first">
        <div v-for="i in csList" :key="i.csAccount">
          <div class="online-member-item">
            <UserItem :avatar-url="i.photo" :status="i.chatStatus" :username="i.csAccount" />
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              circle
              :disabled="!activeMsgList || activeMsgList.hasOwnProperty('memberList') && activeMsgList.memberList.findIndex(j=>j.username === i.csAccount) !== -1"
              @click="addGroupMember(i)"
            ></el-button>
          </div>
          <div v-if="i.groupName">
            <span v-for="j in i.groupName.split(',')" :key="j">
              <el-tag type="info" size="mini">{{j}}</el-tag>
            </span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane class="online-member-tab" label="Leader" name="second">
        <div class="online-member-item" v-for="i in leaderList" :key="i.csAccount">
          <UserItem :avatar-url="i.photo" :status="i.chatStatus" :username="i.csAccount" />
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            circle
            :disabled="!activeMsgList || activeMsgList.hasOwnProperty('memberList') && activeMsgList.memberList.findIndex(j=>j.username === i.csAccount && !j.keep_silence ) !== -1"
            @click="addGroupMember(i)"
          ></el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import UserItem from "./UserItem";
import { addGroupMember } from "./../cs1.js";
import { defaultPayload } from "./../cs.config.js";

export default {
  components: {
    UserItem
  },
  computed: {
    ...mapState("cs", ["onlineList"]),
    ...mapGetters("cs", ["activeMsgList"]),
    csList() {
      return this.onlineList.filter(i => i.isLead === "0");
    },
    leaderList() {
      return this.onlineList.filter(i => i.isLead === "1");
    }
  },
  data() {
    return {
      activeName: "first"
    };
  },
  methods: {
    ...mapActions("cs", ["getOnlineList"]),
    addGroupMember(user) {
      this.$confirm(`Confirm to invite ${user.csAccount}`, "Tip", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          addGroupMember({
            groupId: this.activeMsgList.key,
            isBack: defaultPayload.platForm,
            userName: user.csAccount
          })
            .then(res => {
              if (res.status === 200 && !res.$message) {
                this.$message.success("Successful operation!");
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Operation Canceled"
          });
        });
    }
  },
  created() {
    this.getOnlineList();
  }
};
</script>
<style lang="scss" scoped>
.online-member-panel {
  width: 248px;
  >>> .is-active {
    border-bottom: 2px solid #a7bfee !important;
  }
  .online-member-head {
    background: #a7bfee;
    height: 50px;
    width: 100%;
    padding: 17px;
    text-align: center;
  }
  .online-member-tab {
    overflow: auto;
    height: 350px;
  }
  .online-member-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    >>> .el-button--primary {
      background-color: #409eff;
      border-color: #409eff;
      &:hover {
        background-color: #66b1ff;
        border-color: #66b1ff;
      }
    }
    >>> .is-disabled {
      // color: #fff;
      background-color: #a0cfff;
      border-color: #a0cfff;
      &:hover {
        background-color: #a0cfff;
        border-color: #a0cfff;
        cursor: not-allowed;
      }
    }
  }
}
</style>
