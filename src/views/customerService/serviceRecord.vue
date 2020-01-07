<template>
  <div class="app-container">
    <div class="search-form-box">
      <el-form
        inline
        :model="searchForm"
        ref="searchForm"
        :rules="searchFormRules"
        class="demo-form-inline"
        label-position="left"
      >
        <div>
          <el-form-item label="Acount" label-width="120px" prop="csAccount">
            <el-input v-model="searchForm.csAccount " style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="Name" label-width="120px" prop="userName">
            <el-input v-model="searchForm.userName " style="width: 200px;"></el-input>
          </el-form-item>
        </div>
        <!-- <div>
          <el-form-item label="Start Time" label-width="120px" prop="beginTime">
            <el-date-picker
              v-model="searchForm.beginTime"
              type="datetime"
              style="max-width: 200px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="End Time" label-width="120px" prop="endTime">
            <el-date-picker v-model="searchForm.endTime " type="datetime" style="max-width: 200px;"></el-date-picker>
          </el-form-item>
        </div>-->
        <div>
          <el-form-item label="Status" prop="onlineStatus" label-width="120px">
            <el-select v-model="searchForm.onlineStatus " style="width: 200px;">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="option-button-box">
      <el-button type="primary" class="export" @click="search">Search</el-button>
      <el-button type="primary" class="export">Export to Excel</el-button>
    </div>

    <div class="content-box">
      <el-table
        :data="tableData"
        empty-text="The queried results is not exist."
        style="width: 100%;margin-bottom: 20px;"
        size="mini"
        row-key="id"
        border
        default-expand-all
        :header-cell-style="{background: '#a7bfee'}"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="csAccount" label="Member Account" width="200"></el-table-column>
        <el-table-column prop="userName" label="Member Name" width="180"></el-table-column>
        <el-table-column prop="groupName" label="Group"></el-table-column>
        <el-table-column prop="chatStatus" label="Status" width="100" align="center" :formatter="tableDataStatusFormatter"></el-table-column>
        <el-table-column prop="operation" align="center" label="Operation" width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              class="export"
              @click="handleDialog(true, 'online', scope.row)"
            >Online Status Record</el-button>
            <el-button
              size="mini"
              type="primary"
              class="export"
              @click="handleDialog(true, 'service', scope.row)"
            >Service Record</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pager-foot-box">
      <div class="pager-foot-box">
        <Pagination
          :page.sync="searchForm.pageNum"
          :limit.sync="searchForm.pageSize"
          :total="searchForm.total"
          @pagination="getTableData"
        ></Pagination>
      </div>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      @close="clearDialogData"
      :width="opType == 'online' ? '800px' : '90%'"
      center
    >
      <div slot="title">{{opType == 'online' ? 'Online Status Record' : 'Service Record'}}</div>
      <div>
        <div class="dialog-base-info">
          <el-row :gutter="20">
            <el-col :span="12">
              <div>
                <span class="dialog-base-info-title">Log Account</span>
                {{dialogInfo.csAccount}}
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <span class="dialog-base-info-title">Name</span>
                {{dialogInfo.userName}}
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;" :gutter="20">
            <el-col :span="12">
              <div>
                <span class="dialog-base-info-title">Group</span>
                {{dialogInfo.groupName}}
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <span class="dialog-base-info-title">Group Type</span>
                {{dialogInfo.groupType}}
              </div>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-table
            :data="onlineData"
            empty-text="The queried results is not exist."
            style="width: 100%"
            :header-cell-style="{background: '#cecaca'}"
            :hidden="opType == 'service'"
          >
            <el-table-column
              prop="onlineOnTime"
              label="Up Time"
              :formatter="serviceDataDateFormatter"
            ></el-table-column>
            <el-table-column
              prop="onlineDownTime"
              label="Off Time"
              :formatter="serviceDataDateFormatter"
            ></el-table-column>
            <el-table-column prop="diffTime" label="On Time" :formatter="onlineDataOnTimeFormatter"></el-table-column>
            <el-table-column prop="diffNmu" label="Served Client Quantity"></el-table-column>
          </el-table>
          <el-table
            :data="serviceData"
            empty-text="The queried results is not exist."
            style="width: 100%"
            :header-cell-style="{background: '#cecaca'}"
            :hidden="opType == 'online'"
          >
            <el-table-column prop="userName" label="Name"></el-table-column>
            <el-table-column prop="userAccount" label="Account"></el-table-column>
            <el-table-column prop="phone" label="Contact No"></el-table-column>
            <el-table-column prop="companyName" label="Company"></el-table-column>
            <el-table-column
              prop="chatStart"
              label="Start Time"
              :formatter="serviceDataDateFormatter"
            ></el-table-column>
            <el-table-column prop="chatEnd" label="End Time" :formatter="serviceDataDateFormatter"></el-table-column>
            <el-table-column label="Operation">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  class="export"
                  @click="gotoChatRecord(scope.row)"
                >Chat Record</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pager-foot-box">
            <div class="pager-foot-box">
              <Pagination
                :hidden="opType == 'online'"
                :page.sync="dialogSearchForm.pageNum"
                :limit.sync="dialogSearchForm.pageSize"
                :total="dialogSearchForm.total"
                @pagination="getServiceData"
              ></Pagination>
              <Pagination
                :hidden="opType == 'service'"
                :page.sync="dialogSearchForm.pageNum"
                :limit.sync="dialogSearchForm.pageSize"
                :total="dialogSearchForm.total"
                @pagination="getOnlineData"
              ></Pagination>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" class="export">Export to Excel</el-button>
        <el-button type="danger" @click="dialogVisible = false">Cancel</el-button>
      </div>
    </el-dialog>

    <ChatRecord :chat-record-b-id="chatRecordBId" :visible.sync="chatRecordDialogVisble"></ChatRecord>
  </div>
</template>

<script>
import {
  getCstaffInfoForRecord,
  getCsOnlineRecord,
  getServiceRecord
} from "@/api/customerService";
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
      currentPage: 1,
      dialogVisible: false,
      chatRecordDialogVisble: false,
      chatRecordBId: "",
      opType: "Add",
      activeName: "basic",
      statusOptions: [
        {
          value: "",
          label: "ALL"
        },
        {
          value: 0,
          label: "offline"
        },
        {
          value: 1,
          label: "online"
        }
      ],
      groupTypeOptions: [
        {
          value: "",
          label: "All"
        },
        {
          value: 0,
          label: "CS"
        },
        {
          value: 1,
          label: "TS"
        },
        {
          value: 2,
          label: "BS"
        }
      ],
      searchForm: {
        csAccount: "",
        userName: "",
        onlineStatus: "",
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      dialogSearchForm: {
        csAccount: "",
        staffId: "",
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      searchFormRules: {},
      tableData: [],
      serviceData: [],
      onlineData: [],
      dialogInfo: {
        csAccount: "",
        userName: "",
        groupName: "",
        groupType: ""
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    clearDialogData() {
      this.serviceData = [];
      this.onlineData = [];
      this.dialogSearchForm = {
        csAccount: "",
        staffId: "",
        pageNum: 1,
        pageSize: 10,
        total: 0
      };
    },

    search() {
      this.getTableData();
    },

    getTableData() {
      var that = this;
      let obj = {};
      for (let key in that.searchForm) {
        if (that.searchForm[key] !== "") {
          obj[key] = that.searchForm[key];
        }
      }

      getCstaffInfoForRecord(obj)
        .then(res => {
          if (res.status === 200) {
            that.tableData = res.data.records;
            that.searchForm.total = res.data.total;
          }
        })
        .catch(err => {
          that.$message.error(err.message);
        });
    },

    formatDateTimeZone(date) {
      var timeZoneOffset = date.getTimezoneOffset() / 60;
      var symbol = timeZoneOffset < 0 ? "-" : "+";
      var timeZoneOffsetStr = Math.abs(timeZoneOffset).toString();
      var ms = date.getMilliseconds().toString();
      while (timeZoneOffsetStr.length < 4) {
        timeZoneOffsetStr = "0" + timeZoneOffsetStr;
      }
      while (ms.length < 3) {
        ms = "0" + ms;
      }
      timeZoneOffsetStr = symbol + timeZoneOffsetStr;
      return (
        parseTime(date, "{y}-{m}-{d}T{h}:{i}:{s}") +
        "." +
        ms +
        timeZoneOffsetStr
      );
    },

    getServiceData() {
      var that = this;
      getServiceRecord(this.dialogSearchForm)
        .then(res => {
          if (res.status === 200) {
            that.serviceData = res.data.csServiceRecordVOIPage.records;
            that.dialogSearchForm.total = res.data.csServiceRecordVOIPage.total;
            that.dialogInfo.csAccount = res.data.csAccount;
            that.dialogInfo.groupName = res.data.groupName;
            that.dialogInfo.userName = res.data.userName;
            that.dialogInfo.groupType = that.dialogInfoGroupTypeFormatter(
              res.data.groupType
            );
          }
        })
        .catch(err => {
          that.$message.error(err.message);
        });
    },

    getOnlineData() {
      var that = this;
      getCsOnlineRecord(this.dialogSearchForm)
        .then(res => {
          if (res.status === 200) {
            that.onlineData = res.data.csDiffTimeVOList.records;
            that.dialogSearchForm.total = res.data.csDiffTimeVOList.total;
            that.dialogInfo.csAccount = res.data.csAccount;
            that.dialogInfo.groupName = res.data.groupName;
            that.dialogInfo.userName = res.data.userName;
            that.dialogInfo.groupType = that.dialogInfoGroupTypeFormatter(
              res.data.groupType
            );
          }
        })
        .catch(err => {
          that.$message.error(err.message);
        });
    },

    handleDialog(visable, opType, data) {
      this.dialogVisible = visable;
      this.opType = opType;

      this.dialogSearchForm.csAccount = data.csAccount;
      this.dialogSearchForm.staffId = data.staffId;
      if (opType === "online") {
        this.getOnlineData();
      } else {
        this.getServiceData();
      }
    },

    gotoChatRecord(row) {
      this.chatRecordBId = row.chatRecordBid;
      this.chatRecordDialogVisble = true;
    },

    dialogInfoGroupTypeFormatter(value) {
      var arr = [];
      if (value) {
        value.split(",").forEach(item => {
          arr.push(
            this.tableDataOptionsFormatter(
              parseInt(item),
              this.groupTypeOptions
            )
          );
        });
      }
      return arr.length > 0 ? arr.join(",") : "";
    },

    tableDataStatusFormatter(row, column, cellValue, index) {
      return this.tableDataOptionsFormatter(cellValue, this.statusOptions);
    },

    tableDataOptionsFormatter(cellValue, options) {
      var result = "";
      options.forEach(function(item) {
        if (cellValue === item.value) result = item.label;
      });

      return result;
    },

    serviceDataDateFormatter(row, column, cellValue, index) {
      return cellValue ? parseTime(cellValue) : "";
    },

    onlineDataOnTimeFormatter(row, column, cellValue, index) {
      var result = "";

      if (cellValue) {
        var arr = cellValue.split(":");
        if (parseInt(arr[0]) > 24) {
          var d = Math.floor(parseInt(arr[0]) / 24);
          var h = parseInt(arr[0] % 24);
          result = d + " Days " + h + " Hours ";
        } else if (parseInt(arr[0]) <= 24 && parseInt(arr[0]) > 0) {
          result = arr[0] + " Hours ";
        }

        if (parseInt(arr[1]) > 0) {
          result += arr[1] + " Minutes ";
        }

        result += arr[2] + " Seconds";
      }

      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.search-form-box {
  border-bottom: 1px solid $border-light-color;
  margin-bottom: 10px;
}
.option-button-box {
  float: right;
  margin-bottom: 10px;
}
.pager-foot-box {
  text-align: right;
}
.dialog-base-info {
  margin-bottom: 30px;
  font-size: 14px;
}
.dialog-base-info-title {
  margin-right: 20px;
}
</style>
