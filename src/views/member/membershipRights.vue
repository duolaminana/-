<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form label-width="100px" inline size="small">
        <el-form-item :label="$t('member.rights.interests')">
          <el-input v-model.trim="postData.cnRightName" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('system.role.status')">
          <el-select v-model="postData.rightStatus" :placeholder="$t('system.role.all')" clearable style="width: 150px">
            <!--<el-option-->
              <!--v-for="(item, index) in areaList"-->
              <!--:label="item.label"-->
              <!--:value="item.id"-->
              <!--:key="index"-->
            <!--&gt;</el-option>-->
            <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('system.role.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('system.role.add')}}</el-button>
      <el-button
        type="primary"
        size="small"
        @click="deleteBatchMethod()"
      >{{$t('system.role.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="exportExcelByEasypoiFun">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="$t('system.userManage.lodding')"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column
        :label="$t('member.rights.interests')"
        :prop="language === 'zh' ? 'cnRightName' : 'enRightName'"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('member.rights.description')"
        :prop="language === 'zh' ? 'cnRightDescription' : 'enRightDescription'"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('system.agreement.signer')"
        prop="updateUserName"
        show-overflow-tooltip
        align="center"
        width="100px"
      />
      <el-table-column
        align="center"
        show-overflow-tooltip
        :label="$t('system.userManage.editTime')"
        prop="updateTime"
        width="120px"
      >
      <template slot-scope="scope">
        {{scope.row.updateTime | timeFmt}}
      </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="80"
        :label="$t('system.role.status')"
        prop="levelStatus"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.rightStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.rightStatus === 1 ? $t('system.role.active') : $t('system.role.inactive') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        :label="$t('system.role.operation')"
        :width="isZh ? '190px' : '200px'"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="mini"
            class="export"
            @click="detailDialog(row)"
          >{{$t('system.role.view')}}</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="openDialog('edit', row)"
          >{{$t('system.userManage.editUser')}}</el-button>
          <el-button
            :type="row.rightStatus === 1 ? 'info' : 'danger'"
            size="mini"
            @click="changeMethod(row)"
          >{{row.rightStatus === 1 ? $t('system.role.disable') : $t('system.role.enable')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="postData.total"
      :page.sync="postData.pageNum"
      :limit.sync="postData.pageSize"
      @pagination="getDataList"
    ></Pagination>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='add'? $t('member.rights.addRights'):$t('member.rights.editRights')"
      center
      width="500px"
      @closed="clearForm"
    >
      <el-form :model="ruleForm" v-if="dialogVisible" status-icon ref="ruleForm" label-width="120px" class="demo-ruleForm" :rules="rules">
        <el-form-item :label="$t('member.rights.cninterests')" prop="cnRightName">
          <el-input v-model="ruleForm.cnRightName" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.rights.eninterests')" prop="enRightName">
          <el-input v-model="ruleForm.enRightName" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.rights.cndescription')" prop="cnRightDescription">
          <el-input
            type="textarea"
            placeholder="500字内"
            maxlength="500"
            show-word-limit
            style="width:300px"
            v-model="ruleForm.cnRightDescription"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('member.rights.endescription')" prop="enRightDescription">
          <el-input
            type="textarea"
            placeholder="500字内"
            maxlength="500"
            show-word-limit
            style="width:300px"
            v-model="ruleForm.enRightDescription"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="addLoading" @click="addMethod('ruleForm')">{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
    <!--详情-->
    <el-dialog
      :visible.sync="overDetails"
      :title="$t('member.rights.viewRights')"
      center
      width="500px"
    >
      <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item :label="$t('member.rights.cninterests')" prop="cnRightName">
          <el-input v-model="ruleForm.cnRightName" style="width:300px" readonly></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.rights.eninterests')" prop="enRightName">
          <el-input v-model="ruleForm.enRightName" style="width:300px" readonly></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.rights.cndescription')" prop="cnRightDescription">
          <el-input
            readonly
            type="textarea"
            maxlength="500"
            style="width:300px"
            show-word-limit
            v-model="ruleForm.cnRightDescription"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('member.rights.endescription')" prop="enRightDescription">
          <el-input
            readonly
            type="textarea"
            maxlength="500"
            style="width:300px"
            show-word-limit
            v-model="ruleForm.enRightDescription">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button type="primary" size="small" :loading="addLoading" @click="addMethod('ruleForm')">保存</el-button>-->
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('member.rights.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { parseTime } from '@/utils/index'
import {
  addSaveMemberRight,
  pagephMemberRight,
  dedleteByIds,
  updateMemberRight,
  rightExportEasypoi,
  rightUpdateStatus
} from "@/api/member";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      textarea: '',
      dialogType: '',
      ruleForm: {
        enRightName: '',
        cnRightName: '',
        cnRightDescription: '',
        enRightDescription: '',
        id: ''
      },
      overDetails: false,
      listLoading: true,
      addLoading: false,
      dialogVisible: false,
      selectList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        cnRightDescription: "",
        cnRightName: "",
        enRightDescription: "",
        enRightName: "",
        rightStatus: ""
      },
      areaList: [
        {
          labelZh: '全部',
          label: 'All',
          inquiryStatus: ''
        },
        {
          label: 'Enabled',
          labelZh: '使用中',
          inquiryStatus: 1
        },
        {
          label: 'Disabled',
          labelZh: '已禁用',
          inquiryStatus: 0
        }
      ],
      list: [],
      rules: {
        cnRightName: [
          { required: true, message: this.$t('member.rights.inputRight'), trigger: "blur" }
        ],
        enRightName: [
          { required: true, message: this.$t('member.rights.inputRight'), trigger: "blur" }
        ],
        cnRightDescription: [
          { required: true, message: this.$t('member.rights.inputdetail'), trigger: "blur" }
        ],
        enRightDescription: [
          { required: true, message: this.$t('member.rights.inputdetail'), trigger: "blur" }
        ]
      }
    }
  },
  watch: {
    isZh() {
      this.rules = {
        cnRightName: [
          { required: true, message: this.$t('member.rights.inputRight'), trigger: "blur" }
        ],
        enRightName: [
          { required: true, message: this.$t('member.rights.inputRight'), trigger: "blur" }
        ],
        cnRightDescription: [
          { required: true, message: this.$t('member.rights.inputdetail'), trigger: "blur" }
        ],
        enRightDescription: [
          { required: true, message: this.$t('member.rights.inputdetail'), trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    clearForm() {
      this.addLoading = false
    },
    // 搜索
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList();
    },
    // 获取数据列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== "") {
          obj[key] = this.postData[key];
        }
      }
      pagephMemberRight(obj)
        .then(res => {
          this.list = res.data.list || [];
          this.postData.total = res.data.total;
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
          this.$message.error(err.message);
        });
    },
    // 详情模块
    detailDialog(row) {
      this.overDetails = true;
      this.ruleForm.cnRightName = row.cnRightName;
      this.ruleForm.cnRightDescription = row.cnRightDescription;
      this.ruleForm.enRightName = row.enRightName;
      this.ruleForm.enRightDescription = row.enRightDescription
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === "edit") {
        this.ruleForm.cnRightName = row.cnRightName;
        this.ruleForm.cnRightDescription = row.cnRightDescription;
        this.ruleForm.enRightName = row.enRightName;
        this.ruleForm.enRightDescription = row.enRightDescription;
        this.ruleForm.id = row.id
      } else {
        this.ruleForm.cnRightName = "";
        this.ruleForm.cnRightDescription = "";
        this.ruleForm.enRightName = "";
        this.ruleForm.enRightDescription = "";
        this.ruleForm.id = ""
      }
      this.dialogVisible = true;
    },
    closOPenDialog() {
      this.overDetails = false;
      this.dialogVisible = false
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 禁用或启用
    changeMethod(row) {
      let obj = {
        // levelStatus: row.levelStatus === 0 ? 1 : 0,
        id: row.id
      }
      rightUpdateStatus(obj)
        .then(res => {
          this.$message.success(this.$t("system.userManage.handle"));
          this.searchData();
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 具体添加方法
    addMethod(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addLoading = true
          if (this.ruleForm.id) {
            updateMemberRight(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t("system.userManage.updata"));
                this.postData.pageNum = 1;
                this.dialogVisible = false;
                this.addLoading = false
                this.getDataList();
                this.closOPenDialog();
                this.$refs[formName].resetFields();
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          } else {
            this.ruleForm.rightStatus = 1
            addSaveMemberRight(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t("system.userManage.addSuccess"));
                this.postData.pageIndex = 1;
                this.dialogVisible = false;
                this.addLoading = false
                this.getDataList();
                this.closOPenDialog();
                this.$refs[formName].resetFields()
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          }
        } else {
          this.$message.error(this.$t("system.userManage.check"));
        }
      });
    },
    deleteBatchMethod() {
      if (!this.selectList.length) {
        return this.$message(this.$t("system.userManage.option"));
      }
      this.$confirm(
        this.$t("system.userManage.whether"),
        this.$t("system.userManage.hint"),
        {
          confirmButtonClass: 'el-button-confirmClass',
          cancelButtonClass: 'el-button-cancelClass',
          confirmButtonText: this.$t("system.role.affirm"),
          cancelButtonText: this.$t("system.role.return"),
          type: "warning",
          center: true
        }
      )
        .then(() => {
          this.deleteIdsForm = this.selectList
            .map(e => {
              return e.id;
            }).join(",");
          let formData = new FormData();
          formData.append("ids", this.deleteIdsForm);
          dedleteByIds(formData)
            .then(res => {
              if (res.status === 200) {
                this.$message.success(this.$t("system.userManage.handle"));
              }
              this.getDataList();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("system.userManage.cancel")
          });
        });
    },
    // 导出操作
    exportExcelByEasypoiFun() {
      let obj = {
        pageNum: '',
        pageSize: '',
        cnRightDescription: this.postData.cnRightDescription,
        cnRightName: this.postData.cnRightName,
        enRightDescription: this.postData.enRightDescription,
        enRightName: this.postData.enRightName,
        rightStatus: this.postData.rightStatus
      };
      rightExportEasypoi(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'MembershipRights.xls');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    },
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.roleManagement {
  .search-box {
    margin-bottom: 15px;
    border-bottom: 1px solid $border-light-color;
  }

  .topBtns {
    margin-bottom: 10px;
    text-align: right;

    button {
      margin: 0 10px;
    }
  }

  .avatar {
    width: 60%;

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
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      height: 150px;
      line-height: 150px;
      text-align: center;
      border: 1px solid $border-light-color;
    }

    .avatar {
      width: 150px;
      height: 150px;
      display: block;
    }
  }

  .dialogClass {
    .el-dialog {
      width: 500px;
    }
  }
}
</style>
