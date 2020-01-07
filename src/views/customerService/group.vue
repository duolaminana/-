<template>
  <div class="app-container">
    <div class="search-form-box">
      <el-form inline :model="searchForm" class="demo-form-inline" label-position="left">
        <div>
          <el-form-item label="Group Name" label-width="120px">
            <el-input v-model="searchForm.groupName" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="Group Member" label-width="120px">
            <el-input v-model="searchForm.csAccount" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="search">Search</el-button>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="Group Type" label-width="120px">
            <el-select v-model="searchForm.groupType" style="width: 200px;">
              <el-option
                v-for="item in searchGroupTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Status" label-width="120px">
            <el-select v-model="searchForm.groupStatus" style="width: 200px;">
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
      <el-button type="primary" size="small" @click="handleDialog(true, 'Add')">Add</el-button>
      <el-button type="primary" size="small" @click="handleDelete">Delete</el-button>
      <el-button type="primary" size="small" class="export">Export to Excel</el-button>
    </div>

    <div class="content-box">
      <el-table
        :data="tableData"
        size="mini"
        empty-text="The queried results is not exist."
        @selection-change="handleSelectionChange"
        :header-cell-style="{background: '#a7bfee'}"
        :row-class-name="getRowClassName"
        style="width: 100%;margin-bottom: 20px;"
      >
        <el-table-column type="selection" label="Select All" width="55"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.groupMemberVOList" style="width: 100%" :show-header="false">
              <el-table-column type="selection" label="Select All" width="55"></el-table-column>
              <el-table-column prop="csAccount" label width="180"></el-table-column>
              <el-table-column prop="csName" label width="180"></el-table-column>
              <el-table-column prop="csPhone" label></el-table-column>
              <el-table-column prop="departMent" label></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="groupName" label="Group Name" width="180"></el-table-column>
        <el-table-column prop="groupId" label="Group Code" width="100"></el-table-column>
        <el-table-column
          prop="groupType"
          label="Group Type"
          width="100"
          :formatter="tableDataTypeFormatter"
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          label="Modified Time"
          width="180"
          :formatter="tableDataUpdateTimeFormatter"
        ></el-table-column>
        <el-table-column prop="memNum" label="Number of Member"></el-table-column>
        <el-table-column prop="status" label="Status" width="100" align="center" :formatter="tableDataStatusFormatter"></el-table-column>
        <el-table-column align="center" prop="operation" label="Operation" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              class="export"
              @click="handleDialog(true, 'View', scope.row)"
            >View</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleDialog(true, 'Edit', scope.row)"
              :disabled=" scope.row.status == 2 "
            >Edit</el-button>
            <el-button
              size="mini"
              :type="scope.row.status === 0 ? 'info' : 'danger'"
              @click="handleDisable(scope.$index, scope.row)"
              :disabled=" (scope.row.status == 0 && scope.row.memNum > 0) || scope.row.status == 2 "
            >{{scope.row.status == 0 ? 'Disable' : 'Enable'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pager-foot-box">
      <Pagination
        :page.sync="searchForm.pageNum"
        :limit.sync="searchForm.pageSize"
        :total="searchForm.total"
        @pagination="getTableData"
      ></Pagination>
    </div>

    <el-dialog :visible.sync="dialogVisible" @close="clearOperateFrom" center>
      <div slot="title">{{opType + ' CS Group'}}</div>
      <div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="Basic infomation" name="basic">
            <el-form
              ref="operateForm"
              :rules="operateRules"
              :model="operateForm"
              label-width="200px"
              label-position="left"
              :inline-message="true"
            >
              <el-form-item label="Group Code" prop="groupId">
                <el-input v-model="operateForm.groupId" :disabled="opType != 'Add'"></el-input>
              </el-form-item>
              <el-form-item label="Group Name" prop="groupName">
                <el-input v-model="operateForm.groupName" :disabled="opType == 'View'"></el-input>
              </el-form-item>
              <el-form-item label="Group Type">
                <el-select v-model="operateForm.groupType" placeholder :disabled="opType == 'View'">
                  <el-option
                    v-for="item in groupTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Status" :hidden="opType == 'Add'">
                <el-select v-model="operateForm.status" disabled placeholder style="width: 200px;">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Number of Member" :hidden="opType == 'Add'">
                <el-input v-model="operateForm.memNum" disabled></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="Group Member" name="member">
            <el-table
              :data="groupMemberData"
              style="width: 100%"
              :header-cell-style="{background: '#cecaca'}"
            >
              <el-table-column label="No" type="index"></el-table-column>
              <el-table-column prop="csAccount" label="Account" width="180"></el-table-column>
              <el-table-column prop="csName" label="Name"></el-table-column>
              <el-table-column prop="csPhone" label="ContactNo"></el-table-column>
              <el-table-column prop="departMent" label="Department"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer">
        <span :hidden="opType == 'View'">
          <span :hidden="opType != 'Add'">
            <el-button type="primary" @click="creatGroup">Save</el-button>
          </span>
          <span :hidden="opType != 'Edit'">
            <el-button type="primary" @click="updateGroup">Save</el-button>
          </span>
        </span>
        <el-button type="danger" @click="dialogVisible = false">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGroupInfoFullVO,
  creatGroup,
  getGroupInfoFullGroupBID,
  getAccountBidListByGroupBID,
  updateGroupStatus,
  updateGroup
} from "@/api/customerService";
import { parseTime } from "@/utils/index";
import Pagination from "@/components/Pagination";

export default {
  components: {
    Pagination
  },
  data() {
    return {
      currentPage: 1,
      dialogVisible: false,
      opType: "Add",
      activeName: "basic",
      searchGroupTypeOptions: [
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
      groupTypeOptions: [
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
      statusOptions: [
        {
          value: "",
          label: "All"
        },
        {
          value: 0,
          label: "Active"
        },
        {
          value: 1,
          label: "Inactive"
        },
        {
          value: 2,
          label: "Deleted"
        }
      ],
      operateForm: {
        bId: "",
        groupId: "",
        groupName: "",
        groupType: 0,
        status: 0,
        memNum: 0
      },
      operateRules: {
        groupId: [
          {
            required: true,
            message: "Group Code can not be None",
            trigger: "blur"
          },
          {
            max: 32,
            message: "Length cannot be greatger than 32",
            trigger: "blur"
          }
        ],
        groupName: [
          {
            required: true,
            message: "Group Name can not be None",
            trigger: "blur"
          },
          {
            max: 50,
            message: "Length cannot be greatger than 50",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "Group Type can not be None",
            trigger: "blur"
          }
        ]
      },
      searchForm: {
        csAccount: "",
        groupName: "",
        groupStatus: "",
        groupType: "",
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableSelectedData: [],
      groupMemberData: []
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    clearOperateFrom() {
      this.operateForm.bId = "";
      this.operateForm.groupId = "";
      this.operateForm.groupName = "";
      this.operateForm.groupType = 0;
      this.operateForm.status = 0;
      this.operateForm.memNum = 0;

      this.groupMemberData = [];
      this.activeName = "basic";
    },
    getTableData() {
      let obj = {};
      for (let key in this.searchForm) {
        if (this.searchForm[key] !== "") {
          obj[key] = this.searchForm[key];
        }
      }
      getGroupInfoFullVO(obj)
        .then(res => {
          this.tableData = res.data.records;
          this.searchForm.total = res.data.total;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    search() {
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = 10;
      this.getTableData();
    },

    handleDisable(index, row) {
      this.updateGroupStatus(row.bid, row.status === 0 ? 1 : 0);
    },

    handleDialog(visable, opType, data) {
      if (this.$refs["operateForm"]) this.$refs["operateForm"].clearValidate();

      this.dialogVisible = visable;
      this.opType = opType;
      if (opType === "Add") {
        console.log("add");
      } else {
        this.getGroupInfoFullGroupBID(data.bid);
        this.getAccountBidListByGroupBID(data.bid);
      }
    },
    creatGroup() {
      var that = this;
      this.$refs["operateForm"].validate(valid => {
        if (valid) {
          creatGroup({ ...this.operateForm })
            .then(res => {
              if (res.status === 200) {
                that.$message.success("added successfully");
                that.search();
                that.dialogVisible = false;
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        } else {
          return false;
        }
      });
    },

    updateGroup() {
      var that = this;
      this.$refs["operateForm"].validate(valid => {
        if (valid) {
          updateGroup({ ...this.operateForm })
            .then(res => {
              if (res.status === 200) {
                that.$message.success("update completed");
                that.search();
                that.dialogVisible = false;
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        } else {
          return false;
        }
      });
    },

    updateGroupStatus(bid, status) {
      var that = this;
      updateGroupStatus({
        bId: bid,
        status: status
      })
        .then(res => {
          if (res.status === 200) {
            this.$message.success("Success");
            that.search();
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    handleSelectionChange(val) {
      this.tableSelectedData = val;
    },

    handleDelete() {
      var that = this;
      if (this.tableSelectedData.length <= 0) {
        this.$message.error(
          "Please select the CS group that needs to be operated."
        );
        return;
      } else {
        for (var i in this.tableSelectedData) {
          if (this.tableSelectedData[i].memNum > 0) {
            this.$message.error(
              "The selected CS group status has CS staff, cannot be disabled."
            );
            return;
          }
        }

        this.$confirm(
          "Are you sure to delete " +
            this.tableSelectedData.length +
            " records?",
          "Warning",
          {
            confirmButtonText: "confirm",
            cancelButtonText: "cancel",
            type: "warning"
          }
        )
          .then(() => {
            that.tableSelectedData.forEach(function(item) {
              that.updateGroupStatus(item.bid, 2);
            });
          })
          .catch(() => {});
      }
    },

    getAccountBidListByGroupBID(bid) {
      var that = this;
      getAccountBidListByGroupBID({
        bId: bid
      })
        .then(res => {
          that.groupMemberData = res.data;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    getGroupInfoFullGroupBID(bid) {
      var that = this;
      getGroupInfoFullGroupBID({
        bId: bid
      })
        .then(res => {
          if (res.status === 200 && res.data) {
            Object.keys(that.operateForm).forEach(function(key) {
              if (res.data[key]) that.operateForm[key] = res.data[key];
            });
            that.operateForm.bId = res.data.bid;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    tableDataUpdateTimeFormatter(row, column, cellValue, index) {
      if (cellValue) return parseTime(cellValue);

      return "";
    },

    tableDataTypeFormatter(row, column, cellValue, index) {
      return this.tableDataOptionsFormatter(cellValue, this.groupTypeOptions);
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

    getRowClassName({ row, rowIndex }) {
      if (!row.memNum || row.memNum === 0) {
        return "row-expand-cover";
      }
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
</style>
<style>
.el-table__expanded-cell {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  border-bottom-width: 0 !important;
}
.row-expand-cover .el-table__expand-icon {
  visibility: hidden !important;
}
</style>
