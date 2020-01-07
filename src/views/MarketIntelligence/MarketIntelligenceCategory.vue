<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '192px'" inline size="small">
        <el-form-item :label="$t('consult.classify.category')">
          <el-input v-model.trim="postData.categoryName" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('system.role.status')">
          <el-select
            v-model="postData.categoryStatus"
            :placeholder="$t('system.role.all')"
            clearable
            style="width: 150px"
          >
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
      <el-button type="primary" size="small" class="export" @click="outportData">{{$t('system.role.export')}}</el-button>
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
        :label="$t('consult.classify.category')"
        prop="categoryName"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('consult.classify.modifier')"
        prop="updateUserIdName"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        align="center"
        show-overflow-tooltip
        :label="$t('system.userManage.editTime')"
        prop="updateTime"
        width="160px"
      >
        <template slot-scope="scope">{{scope.row.updateTime | timeFmt}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        width="80"
        :label="$t('system.role.status')"
        prop="categoryStatus"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.categoryStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.categoryStatus === 1 ? $t('consult.classify.active') : $t('consult.classify.inactive') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('system.role.operation')"
        width="210"
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
            size="mini"
            type="primary"
            @click="openDialog('edit', row)"
          >{{$t('system.userManage.editUser')}}</el-button>
          <el-button
            :type="row.categoryStatus === 1 ? 'info' : 'danger'"
            size="mini"
            @click="changeMethod(row)"
          >{{row.categoryStatus === 1 ? $t('system.role.disable') : $t('system.role.enable')}}</el-button>
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
      :title="dialogType==='add'? $t('consult.classify.addCategory'):$t('consult.classify.editCategory')"
      center
      width="600px"
      @closed="clearData"
    >
      <el-form
        :rules="rules"
        :model="ruleForm"
        status-icon
        v-if="dialogVisible"
        ref="ruleForm"
        label-width="200px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('consult.classify.category')" prop="categoryName">
          <el-input v-model="ruleForm.categoryName" :maxlength="20" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" v-model="ruleForm.categoryStatus">
            {{ ruleForm.categoryStatus === 1 ? $t('consult.classify.active') : $t('consult.classify.inactive') }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          :loading="addLoading"
          @click="addMethod('ruleForm')"
        >{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
    <!--详情-->
    <el-dialog
      :visible.sync="overDetails"
      :title="$t('consult.classify.categoryDetail')"
      center
      width="600px"
      @closed="clearData"
    >
      <el-form
        :model="detailForm"
        status-icon
        label-width="200px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('consult.classify.category')" >
          <el-input v-model="detailForm.categoryName" style="width:300px" readonly></el-input>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" v-model="detailForm.categoryStatus">
          {{ detailForm.categoryStatus === 1 ? $t('consult.classify.active') : $t('consult.classify.inactive') }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { parseTime } from "@/utils/index";
import {
  selectNewsCategoryByPageHelper,
  saveNewsCategory,
  updateNewsCategoryStatus,
  deleteNewsCategoryByIds,
  updateNewsCategory,
  exportByNewsCategoryExcel
} from "@/api/news";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      dialogType: '',
      ruleForm: {
        categoryName: '',
        id: '',
        categoryStatus: 1
      },
      detailForm: [],
      overDetails: false,
      listLoading: true,
      addLoading: false,
      dialogVisible: false,
      selectList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        categoryName: '',
        categoryStatus: ''
      },
      areaList: [
        // 资讯类别状态( 0已禁用、1有效)
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
        categoryName: [
          { required: true, message: this.$t('consult.classify.veirfyName'), trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    isZh() {
      this.rules = {
        categoryName: [
          { required: true, message: this.$t('consult.classify.veirfyName'), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    // 清空数据
    clearData() {
      this.ruleForm.categoryName = '';
      this.ruleForm.id = '';
      this.ruleForm.categoryStatus = 1;
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
      selectNewsCategoryByPageHelper(obj)
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
    // 启用禁用
    changeMethod(row) {
      let obj = {
        categoryStatus: row.categoryStatus === 0 ? 1 : 0,
        id: row.id
      };
      updateNewsCategoryStatus(obj).then(res => {
        this.$message.success(res.message);
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 详情模块
    detailDialog(row) {
      this.overDetails = true;
      this.detailForm = row;
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === "edit") {
        this.ruleForm = row;
        this.getDataList()
      }
      this.dialogVisible = true;
    },
    closOPenDialog() {
      this.overDetails = false;
      this.dialogVisible = false;
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 具体添加方法
    addMethod(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addLoading = true
          if (this.ruleForm.id) {
            updateNewsCategory(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t("system.userManage.updata"));
                this.postData.pageNum = 1;
                this.dialogVisible = false;
                this.addLoading = false;
                this.getDataList();
                this.closOPenDialog();
                this.$refs[formName].resetFields();
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          } else {
            saveNewsCategory(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t("system.userManage.addSuccess"));
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
            })
            .join(",");
          let formData = new FormData();
          formData.append("ids", this.deleteIdsForm);
          deleteNewsCategoryByIds(formData)
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
    outportData() {
      let obj = {
        pageNum: '',
        pageSize: '',
        categoryName: this.postData.categoryName,
        categoryStatus: this.postData.categoryStatus
      };
      exportByNewsCategoryExcel(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'newsCategory.xls');
        document.body.appendChild(link)
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
        return parseTime(val);
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
