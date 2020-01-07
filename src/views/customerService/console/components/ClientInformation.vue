<template>
  <div class="client-info">
    <div class="client-info-header">
      <span>Client Information</span>
    </div>
    <div class="client-info-body">
      <p>Country: {{clientInfo.countryEnName}}</p>
      <p>Company: {{clientInfo.companyName}}</p>
      <p>Category: {{clientInfo.userType}}</p>
      <p>Level:</p>
      <p>Address: {{clientInfo.contactAddress}}</p>
      <p>RegisteredDate: {{clientInfo.registerTime | time}}</p>
      <p>ContactNo: {{clientInfo.officePhone}}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getUserFrontendByUserAccount } from "./../cs1.js";
import { parseTime } from "@/utils/index";

export default {
  computed: {
    ...mapState("cs", ["active"]),
    customerId() {
      return this.active.desc.split("#")[2];
    }
  },
  data() {
    return {
      clientInfo: {
        companyName: "",
        countryEnName: "",
        countryChName: "",
        registerTime: "",
        officePhone: "",
        contactAddress: "",
        userType: ""
      }
    };
  },
  methods: {
    getClientInfo() {
      getUserFrontendByUserAccount({ userAccount: this.customerId })
        .then(res => {
          if (res.status === 200 && !res.message) {
            this.clientInfo = { ...res.data };
          }
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    }
  },
  watch: {
    customerId(val) {
      if (val) {
        this.getClientInfo();
      } else {
        this.clientInfo = {};
      }
    }
  },
  filters: {
    time(mtime) {
      if (mtime) {
        return parseTime(mtime);
      } else {
        return "";
      }
    }
  },
  created() {
    if (this.customerId) {
      this.getClientInfo();
    }
  }
};
</script>

<style lang="scss" scoped>
.client-info {
  .client-info-body {
    p {
      margin: 0;
      line-height: 25px;
      border-bottom: 1px solid #ddd;
      padding-left: 5px;
      word-wrap: break-word;
      word-break: normal;
    }
  }
}
.client-info-header {
  background: #a7bfee;
  height: 50px;
  width: 100%;
  padding: 17px;
  text-align: center;
}
</style>
