<template>
  <div class="app-container">
    <div class="search-box">
      <el-form label-width="80px" label-position="left" inline>
        <div>
          <el-form-item label="Acount">
            <el-input v-model.trim="searchForm.csAccount " style="width: 220px;"></el-input>
          </el-form-item>
          <el-form-item label="Name">
            <el-input v-model.trim="searchForm.userName " style="width: 220px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="Start Time">
            <el-date-picker v-model="searchForm.beginTime" type="datetime" placeholder="From"></el-date-picker>
          </el-form-item>
          <el-form-item label="End Time">
            <el-date-picker
              v-model="searchForm.endTime"
              type="datetime"
              placeholder="To"
              default-time="23:59:59"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="Client">
            <el-input v-model.trim="searchForm.companyName" style="width: 220px;"></el-input>
          </el-form-item>
          <div class="search-box-buttons">
            <el-button type="primary" class="export" @click="search">Search</el-button>
            <el-button type="primary" class="export">Export to Excel</el-button>
          </div>
        </div>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      empty-text="No search results found"
      :header-cell-style="{background: '#a7bfee'}"
      row-key="id"
      size="mini"
      fit
      border
    >
      <el-table-column prop="csAccount" label="Member Account"></el-table-column>
      <el-table-column prop="csUserName" label="Member Name"></el-table-column>
      <el-table-column prop="groupName" label="Group"></el-table-column>
      <el-table-column prop="companyName" label="Client"></el-table-column>
      <el-table-column prop="chatStart" label="Time" :formatter="timeFormatter"></el-table-column>
      <el-table-column
        align="center"
        label="Operation"
        width="220"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="()=>{$router.push({path: '/customerService/console'})}"
            :disabled="scope.row.chatEnd ? true : false"
          >Join</el-button>
          <el-button
            size="mini"
            type="primary"
            class="export"
            @click="showChatRecordDialog(scope.row)"
          >Chat Record</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :page.sync="searchForm.pageNum"
      :limit.sync="searchForm.pageSize"
      :total="searchForm.total"
      @pagination="getTableData"
    ></Pagination>
    <ChatRecord :chat-record-b-id="chatRecordBId" :visible.sync="chatRecordDialogVisble"></ChatRecord>
  </div>
</template>

<script>
import { getCsChatRecordForMonitor } from "./console/cs1.js";
import { parseTime } from "@/utils/index";
import Pagination from "@/components/Pagination";
import ChatRecord from "./console/components/ChatRecord";
export default {
  components: {
    Pagination,
    ChatRecord
  },
  data() {
    return {
      listLoading: true,
      currentPage: 1,
      chatRecordDialogVisble: false,
      chatRecordBId: "",
      searchForm: {
        csAccount: "",
        csUserName: "",
        companyName: "",
        beginTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: []
    };
  },
  methods: {
    search() {
      this.listLoading = true;
      this.getTableData();
    },
    getTableData() {
      let obj = {};
      for (let key in this.searchForm) {
        if (this.searchForm[key] !== "") {
          obj[key] = this.searchForm[key];
        }
      }
      getCsChatRecordForMonitor(obj)
        .then(res => {
          if (res.status === 200 && !res.message) {
            this.tableData = res.data.records;
            this.searchForm.total = res.data.total;
          } else {
            this.$message.error(res.message);
          }
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
          this.$message.error(err.message);
        });
    },
    showChatRecordDialog(row) {
      this.chatRecordBId = row.bid;
      this.chatRecordDialogVisble = true;
    },
    timeFormatter(row) {
      return row.chatStart ? parseTime(row.chatStart) : "";
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.search-box {
  border-bottom: 1px solid $border-light-color;
  padding: 5px;
  margin: 10px;
}
.search-box-buttons {
  float: right;
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>
