<template>
  <div class="app-container">
    <div class="search-form-box">
      <el-form inline :model="searchForm" class="demo-form-inline" label-position="left">
        <div>
          <el-form-item label="Group Name" label-width="120px">
            <el-input v-model="searchForm.groupName" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="Status" label-width="120px">
            <el-select v-model="searchForm.csStatus" style="width: 200px;">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="searchTableData" class="export">Search</el-button>
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
        empty-text="The queried results is not exist."
        size="mini"
        row-key="id"
        border
        default-expand-all
        :header-cell-style="{background: '#a7bfee'}"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" label="Select All" width="55"></el-table-column>
        <el-table-column prop="csAccount" label="Account" width="200"></el-table-column>
        <el-table-column prop="userName" label="Name" width="100"></el-table-column>
        <el-table-column prop="officePhone" label="Contact No"></el-table-column>
        <el-table-column prop="groupName" label="Group Name"></el-table-column>
        <el-table-column prop="csStatus" :formatter="tableDataStatusFormatter" label="Status" width="100" align="center"></el-table-column>
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
              :disabled="scope.row.csStatus != 0"
            >Edit</el-button>
            <el-button
              size="mini"
              :type="scope.row.csStatus === 0 ? 'info' : 'danger'"
              @click="handleDisable(scope.$index, scope.row)"
              :disabled="scope.row.csStatus == 2"
            >{{scope.row.csStatus == 0 ? 'Disable' : 'Enable'}}</el-button>
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

    <el-dialog :visible.sync="dialogVisible" @close="clearOperateForm" width="800px" top="10vh">
      <div slot="title" style="text-align: center;">{{opType + ' CS Group'}}</div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleDialogTabClick">
          <el-tab-pane label="Basic infomation" name="basic">
            <el-form
              ref="operateForm"
              :rules="operateRules"
              :model="operateForm"
              label-width="200px"
              label-position="left"
            >
              <div class="form-upper-box">
                <div class="form-upper-left-box">
                  <el-form-item label="Account" prop="csAccount">
                    <el-select v-model="operateForm.csAccount" @change="accountChange" filterable :disabled="opType != 'Add'">
                      <el-option
                        v-for="item in userAccountsOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="Name" :hidden="opType != 'View'">
                    <el-input :value="operateForm.lastName + operateForm.firstName" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="First Name" :hidden="opType == 'View'">
                    <el-input v-model="operateForm.firstName" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="Last Name" :hidden="opType == 'View'">
                    <el-input v-model="operateForm.lastName" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="Gender">
                    <el-select v-model="operateForm.userSex" style="width: 150px;" disabled>
                      <el-option label="男" :value="1"></el-option>
                      <el-option label="女" :value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-upper-right-box">
                  <!-- <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >-->
                  <img v-if="operateForm.photoPath" :src="fullUrl(operateForm.photoPath)" class="avatar">
                  <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                  <!-- </el-upload> -->
                </div>
              </div>
              <el-form-item style="clear: both;" label="Email">
                <el-input v-model="operateForm.emailAddress" disabled></el-input>
              </el-form-item>
              <el-form-item label="Address">
                <el-input v-model="operateForm.contactAddress" disabled></el-input>
              </el-form-item>
              <el-form-item label="Contact No">
                <el-input v-model="operateForm.mobilePhone" disabled></el-input>
              </el-form-item>
              <div>
                <el-form-item style="float: left;" label="Preferred Language">
                  <el-select v-model="operateForm.usedLanguage" style="width: 150px;" disabled>
                    <el-option label="Chinese" value="1"></el-option>
                    <el-option label="English" value="2"></el-option>
                    <el-option label="Malay Language" value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Other Language" label-width="130px" style="float: right;">
                  <!-- <el-input v-model="operateForm.preferedLanguage" style="width: 200px;" disabled></el-input> -->
                  <el-select v-model="operateForm.preferedLanguage" style="width: 150px;" disabled>
                    <el-option label="Chinese" value="1"></el-option>
                    <el-option label="English" value="2"></el-option>
                    <el-option label="Malay Language" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item label="specialties" prop="specialties">
                <el-input v-model="operateForm.specialties" :disabled="opType == 'View'"></el-input>
              </el-form-item>
              <el-form-item label="Service Level">
                <el-select
                  v-model="operateForm.serviceLevel"
                  :disabled="opType == 'View'"
                  style="width: 200px;"
                >
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option label="4" :value="4"></el-option>
                  <el-option label="5" :value="5"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Group" prop="groupList">
                <el-select
                  v-model="operateForm.groupList"
                  multiple
                  style="width: 100%;"
                  :disabled="opType == 'View'"
                >
                  <el-option
                    v-for="item in groupChooseList"
                    :key="item.bid"
                    :label="item.groupName"
                    :value="item.bid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Status">
                <el-select v-model="operateForm.status" style="width: 200px;" disabled>
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="Served Client List" name="client">
            <el-table
              :data="clientListData"
              style="width: 100%"
              :header-cell-style="{background: '#cecaca'}"
            >
              <el-table-column label="No" type="index" width="180"></el-table-column>
              <el-table-column prop="companyName" label="Company Name" width="180"></el-table-column>
              <el-table-column prop="shortName" label="Abbreviation"></el-table-column>
              <el-table-column prop="customerCode" label="Client Code"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" style="text-align: center;">
        <span :hidden="opType == 'View'">
          <span :hidden="opType != 'Add'">
            <el-button type="primary" @click="saveStaff">Save</el-button>
          </span>
          <span :hidden="opType != 'Edit'">
            <el-button type="primary" @click="updateStaff">Save</el-button>
          </span>
        </span>
        <el-button type="danger" @click="dialogVisible = false">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPageCstaffInfo,
  getUserBackendAccountByUserAccount,
  queryGroupChooseList,
  getCompanyInfoByCsAccountBid,
  getCsStaffInfoByBidAndCsAccount,
  creatCstaffInfoAndGroup,
  updateStatus,
  updateCstaffInfoAndGroup,
  getUserAccountLike
} from "@/api/customerService";
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
      imageUrl: "",
      options: [
        {
          value: "All",
          label: "All"
        }
      ],
      userBackendAccount: {},
      groupChooseList: [],
      activeName: "basic",
      operateForm: {
        bid: "",
        userBackendInfoBId: "",
        csAccount: "",
        firstName: "",
        lastName: "",
        userSex: "",
        emailAddress: "",
        contactAddress: "",
        mobilePhone: "",
        usedLanguage: "",
        preferedLanguage: "",
        otherLanguage: "",
        specialties: "",
        serviceLevel: "",
        groupList: [],
        status: 0,
        photoPath: ""
      },
      operateRules: {
        groupList: [
          {
            required: true,
            message: "Group can not be None",
            trigger: "blur"
          }
        ],
        csAccount: [
          {
            required: true,
            message: "Account can not be None",
            trigger: "blur"
          }
        ],
        specialties: [
          {
            required: true,
            message: "Specialties can not be None",
            trigger: "blur"
          },
          {
            max: 100,
            message: "Length cannot be greatger than 100",
            trigger: "blur"
          }
        ]
      },
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        groupName: "",
        csStatus: ""
      },
      tableData: [],
      tableSelectedData: [],
      clientListData: [],
      userAccountsOptions: [],
      statusOptions: [
        {
          value: "",
          label: "ALL"
        },
        {
          value: 0,
          label: "active"
        },
        {
          value: 1,
          label: "inactive"
        },
        {
          value: 2,
          label: "deleted"
        }
      ]
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    clearOperateForm() {
      this.operateForm.bid = "";
      this.operateForm.userBackendInfoBId = "";
      this.operateForm.csAccount = "";
      this.operateForm.firstName = "";
      this.operateForm.lastName = "";
      this.operateForm.userSex = "";
      this.operateForm.emailAddress = "";
      this.operateForm.contactAddress = "";
      this.operateForm.mobilePhone = "";
      this.operateForm.preferedLanguage = "";
      this.operateForm.usedLanguage = "";
      this.operateForm.otherLanguage = "";
      this.operateForm.specialties = "";
      this.operateForm.serviceLevel = "";
      this.operateForm.groupList = [];
      this.operateForm.status = 0;
      this.operateForm.photoPath = "";

      this.clientListData = [];
      this.activeName = "basic";
    },

    searchTableData() {
      this.searchForm.pageNum = 1;
      this.getTableData();
    },
    getTableData() {
      let obj = {};
      for (let key in this.searchForm) {
        if (this.searchForm[key] !== "") {
          obj[key] = this.searchForm[key];
        }
      }
      getPageCstaffInfo(obj)
        .then(res => {
          this.listLoading = false;
          this.tableData = res.data.records;
          this.searchForm.total = res.data.total;
        })
        .catch(err => {
          this.$message.error(err.message);
          this.listLoading = false;
        });
    },

    tableDataStatusFormatter(row, column, cellValue, index) {
      var result = "";
      this.statusOptions.forEach(function(item) {
        if (cellValue === item.value) result = item.label;
      });

      return result;
    },

    getCsStaffInfo({ bid, account }) {
      var that = this;
      getCsStaffInfoByBidAndCsAccount({
        StaffBid: bid,
        csAccount: account
      })
        .then(res => {
          Object.keys(that.operateForm).forEach(function(key) {
            if (res.data[key]) that.operateForm[key] = res.data[key];
          });
          that.operateForm.bid = bid;
          if (res.data.groupId) {
            that.operateForm.groupList = res.data.groupId.split(",");
          }

          that.userBackendAccount = { ...res.data };
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    getUserAccounts() {
      var that = this;
      getUserAccountLike({ key: this.operateForm.csAccount })
        .then(res => {
          if (res.status === 200 && res.data) {
            that.userAccountsOptions = [];
            res.data.forEach(function(item) {
              that.userAccountsOptions.push({
                label: item,
                value: item
              })
            })
          }
        })
        .catch(err => {
          this.$message.error(err.message);
          this.listLoading = false;
        });
    },

    getClientListData() {
      if (
        this.userBackendAccount.userBackendInfoBId ||
        this.userBackendAccount.accountBId
      ) {
        var that = this;
        getCompanyInfoByCsAccountBid({
          csAccountBid:
            this.userBackendAccount.userBackendInfoBId ||
            this.userBackendAccount.accountBId
        })
          .then(res => {
            that.clientListData = res.data;
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    },

    accountChange(r) {
      this.operateForm.csAccount = r;
      this.setUserInfoByAcount();
    },

    setUserInfoByAcount() {
      var that = this;
      getUserBackendAccountByUserAccount({
        userAccount: this.operateForm.csAccount
      })
        .then(res => {
          if (res.data) {
            that.userBackendAccount = { ...res.data };
            that.operateForm.userBackendInfoBId = res.data.accountBId;
            Object.keys(that.operateForm).forEach(function(key) {
              if (
                key !== "csAccount" &&
                key !== "groupList" &&
                key !== "userBackendInfoBId"
              ) {
                that.operateForm[key] = res.data[key] ? res.data[key] : "";
              }
            });
          } else {
            this.$message.error(
              'not found the account: " ' + that.operateForm.csAccount + "."
            );
            that.clearOperateForm();
          }
        })
        .catch(err => {
          this.$message.error(err.message);
          this.listLoading = false;
        });
    },

    queryGroupChooseList() {
      var that = this;
      queryGroupChooseList({})
        .then(res => {
          that.groupChooseList = res.data;
        })
        .catch(err => {
          this.$message.error(err.message);
          this.listLoading = false;
        });
    },

    saveStaff() {
      var that = this;
      this.$refs["operateForm"].validate(valid => {
        if (valid) {
          creatCstaffInfoAndGroup({ ...this.operateForm })
            .then(res => {
              if (res.status === 200) {
                that.$message.success("add successful");
                that.searchTableData();
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

    updateStaff() {
      var that = this;
      this.$refs["operateForm"].validate(valid => {
        if (valid) {
          updateCstaffInfoAndGroup({ ...this.operateForm })
            .then(res => {
              if (res.status === 200) {
                that.$message.success("update completed");
                that.searchTableData();
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

    updateStatus(bid, status) {
      var that = this;
      updateStatus({
        StaffBid: bid,
        status: status
      })
        .then(res => {
          if (res.status === 200) {
            this.$message.success("Success");
            that.searchTableData();
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    handleDisable(index, row) {
      this.updateStatus(row.bid, row.csStatus === 0 ? 1 : 0);
    },

    handleDelete() {
      var that = this;
      if (this.tableSelectedData.length <= 0) {
        this.$message.error("Please select the CS that needs to be operated.");
        return;
      } else {
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
              that.updateStatus(item.bid, 2);
            });
          })
          .catch(() => {});
      }
    },

    handleSelectionChange(val) {
      this.tableSelectedData = val;
    },

    handleDialog(visable, opType, data) {
      if (this.$refs["operateForm"]) this.$refs["operateForm"].clearValidate();
      this.dialogVisible = visable;
      this.opType = opType;
      this.queryGroupChooseList();

      if (opType === "Add") {
        this.getUserAccounts();
      } else {
        this.getCsStaffInfo({ bid: data.bid, account: data.csAccount });
      }
    },

    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },

    handleDialogTabClick(tab, event) {
      if (tab.name === "client") {
        this.getClientListData();
      }
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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
.form-upper-box {
}
.form-upper-left-box {
  width: 70%;
  float: left;
  padding: 5px 5px 5px 0;
}
.form-upper-right-box {
  width: 30%;
  float: right;
  padding: 5px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 70px;
  color: #8c939d;
  width: 178px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
