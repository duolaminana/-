<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '100px'" inline size="small">
        <el-form-item :label="$t('member.category.catagoryName')">
          <el-input v-model.trim="postData.cnCategoryName" style="width: 200px" :placeholder="$t('member.category.catagoryName')"/>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')">
          <el-select v-model="postData.categoryStatus" clearable style="width: 150px" :placeholder="$t('system.role.status')">
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
        <!--<el-form-item label="有下属时不允许删除" label-width="500px"></el-form-item>-->
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="memberSort">{{$t('member.level.sequence')}}</el-button>
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteBatchMethod()">{{$t('system.role.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="exportExcelByEasypoiFun">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      ref="listTable"
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      v-loading="listLoading"
      default-expand-all
      fit
      size="mini"
      @selection-change="getSelect"
      @select="setChildSelect"
      :element-loading-text="$t('system.userManage.lodding')"
      :header-cell-style="{background: '#a7bfee'}"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column
        :prop="language === 'zh' ? 'cnCategoryName' : 'enCategoryName'"
        :label="$t('member.category.catagoryName')"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="categoryCode"
        :label="$t('member.category.categoryCode')"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="updateUserName" show-overflow-tooltip align="center" width="100px" :label="$t('system.role.modifier')"/>
      <el-table-column prop="updateTime" align="center" width="110px" :label="$t('system.userManage.editTime')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="80"
        :label="$t('system.role.status')"
        prop="categoryStatus"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.categoryStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.categoryStatus === 1 ? $t('system.role.active') : $t('system.role.inactive') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" :label="$t('system.role.operation')" :width="isZh ? '190px' : '220px'" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="detailDialog(row)">{{$t('system.role.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit',row)"
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
      :title="dialogType==='add'? $t('member.category.addCategory'):$t('member.category.editCategory')"
      center
      width="500px"
      @closed="clearData"
    >
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="135px"
        class="demo-ruleForm"
        :inline="true"
        :rules="rules"
        v-if="dialogVisible"
      >
        <el-form-item :label="$t('member.category.parentCategory')" prop="parentCategoryBId">
          <el-cascader
            class="form-dialog-width"
            v-model="ruleForm.parentsName"
            :options="disabledList"
            :props="{value: 'bid', label: language === 'zh' ? 'cnCategoryName' : 'enCategoryName', children: 'children'}"
            filterable
            clearable
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('member.category.categoryCode')" prop="categoryCode">
          <el-input v-model="ruleForm.categoryCode" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.category.cncategoryName')" prop="cnCategoryName">
          <el-input v-model="ruleForm.cnCategoryName" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.category.encategoryName')" prop="enCategoryName">
          <el-input v-model="ruleForm.enCategoryName" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" prop="status">
          <!--<el-select v-model="ruleForm.categoryStatus" class="form-dialog-width2">-->
            <!--<el-option-->
              <!--v-for="(item, index) in areaList"-->
              <!--:label="item.label"-->
              <!--:value="item.id"-->
              <!--:key="index"-->
            <!--&gt;</el-option>-->
            <!--<el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>-->
          <!--</el-select>-->
          {{ruleForm.categoryStatus === 1 ? $t('consult.classify.active') : $t('consult.classify.inactive')}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          :loading="addLoading"
          @click="addMethod('ruleForm')"
        >{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
    <!--详情-->
    <el-dialog :visible.sync="overDetails" :title="$t('member.category.categoryDetail')" center width="500px">
      <el-form
        :model="detailForm"
        status-icon
        ref="ruleForm"
        label-width="135px"
        class="demo-ruleForm"
        :inline="true"
      >
        <el-form-item :label="$t('member.category.parentCategory')" prop="parentCategoryBId">
          <el-cascader
            disabled
            class="form-dialog-width"
            v-model="detailForm.parentsName"
            :options="addDataList"
            :props="{value: 'bid', label: language === 'zh' ? 'cnCategoryName' : 'enCategoryName', children: 'children'}"
            filterable
            clearable
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('member.category.categoryCode')" prop="categoryCode">
          <el-input v-model="detailForm.categoryCode" style="width:300px" readonly></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.category.cncategoryName')" prop="cnCategoryName">
          <el-input v-model="detailForm.cnCategoryName" style="width:300px" readonly></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.category.encategoryName')" prop="enCategoryName">
          <el-input v-model="detailForm.enCategoryName" readonly style="width:300px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" prop="categoryStatus">
          {{detailForm.categoryStatus === 1 ? $t('consult.classify.active') : $t('consult.classify.inactive') }}
          <!--<el-select v-model="detailForm.categoryStatus" class="form-dialog-width2" disabled>-->
            <!--&lt;!&ndash;<el-option&ndash;&gt;-->
              <!--&lt;!&ndash;v-for="(item, index) in areaList"&ndash;&gt;-->
            <!--&lt;!&ndash;:label="item.label"&ndash;&gt;-->
            <!--&lt;!&ndash;:value="item.id"&ndash;&gt;-->
            <!--&lt;!&ndash;:key="index"&ndash;&gt;-->
            <!--&lt;!&ndash;&gt;</el-option>&ndash;&gt;-->
            <!--<el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>-->
          <!--</el-select>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('member.rights.close')}}</el-button>
      </div>
    </el-dialog>
    <!--排序-->
    <el-dialog :visible.sync="editMembership" :title="$t('member.category.editCategoryOrder')" center width="700px">
      <el-table
        :data="list"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        v-loading="listLoading"
        default-expand-all
        fit
        size="mini"
        @selection-change="getSelect"
        :element-loading-text="$t('system.userManage.lodding')"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <!--<el-table-column align="center" type="selection" width="55"></el-table-column>-->
        <el-table-column :prop="language === 'zh' ? 'cnCategoryName' : 'enCategoryName'" :label="$t('member.category.categoryCode')" show-overflow-tooltip></el-table-column>
        <el-table-column
          align="center"
          :label="$t('member.level.sequence')"
          show-overflow-tooltip
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button size="mini" type="text" @click="stick(row)">
              <svg-icon class-name="svgClass" icon-class="shuangjiantoushang" size="18" />
              </el-button>
            <el-button size="mini" type="text" @click="shiftUp(row)">
              <svg-icon class-name="svgClass" icon-class="jiantoushang" size="18" />
              </el-button>
            <el-button size="mini" type="text" @click="moveDown(row)">
              <svg-icon class-name="svgClass" icon-class="jiantouxia" size="18" />
              </el-button>
            <el-button size="mini" type="text" @click="profileMode(row)">
              <svg-icon class-name="svgClass" icon-class="shuangjiantouxia" size="18" />
              </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<Pagination-->
        <!--:total="postData.total"-->
        <!--:page.sync="postData.pageNum"-->
        <!--:limit.sync="postData.pageSize"-->
        <!--@pagination="getDataList"-->
      <!--&gt;</Pagination>-->
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { uploadActionUrl } from "@/api/common";
import { parseTime, deepClone } from '@/utils/index'
import {
  pagephMemberCategory,
  saveMemberCategory,
  updateMemberCategory,
  updateStatusCatagory,
  deleteClassByIds,
  updateSortIndexByType,
  categoryExportEasypoi
} from "@/api/member";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      addDataList: [],
      disabledList: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      sortForm: {},
      detailForm: {
        parentCategoryBIds: "",
        categoryCode: "",
        enCategoryName: "",
        cnCategoryName: "",
        categoryStatus: "",
        parentCategoryBId: "",
        parentsName: []
      },
      uploadActionUrl,
      ruleForm: {
        parentCategoryBIds: "",
        categoryCode: "",
        categoryStatus: 1,
        parentCategoryBId: "",
        parentsName: [],
        enCategoryName: "",
        cnCategoryName: ""
      },
      editMembership: false,
      overDetails: false,
      fileList: [],
      listLoading: true,
      addLoading: false,
      detialModel: false,
      dialogVisible: false,
      detailModal: false,
      selectList: [],
      dialogType: "",
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        categoryCode: "",
        cnCategoryName: "",
        enCategoryName: "",
        parentCategoryBId: "",
        categoryStatus: ""
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
        categoryCode: [
          { required: true, message: this.$t('member.category.classifyCode'), trigger: "blur" }
        ],
        cnCategoryName: [
          { required: true, message: this.$t('member.category.classifyName'), trigger: "blur" }
        ],
        enCategoryName: [
          { required: true, message: this.$t('member.category.classifyName'), trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    isZh() {
      this.rules = {
        categoryCode: [
          { required: true, message: this.$t('member.category.classifyCode'), trigger: "blur" }
        ],
        cnCategoryName: [
          { required: true, message: this.$t('member.category.classifyName'), trigger: "blur" }
        ],
        enCategoryName: [
          { required: true, message: this.$t('member.category.classifyName'), trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    clearData() {
      this.ruleForm.categoryCode = "";
      this.ruleForm.enCategoryName = "";
      this.ruleForm.cnCategoryName = "";
      this.ruleForm.parentsName = [];
      this.addLoading = false;
      // this.ruleForm.categoryStatus = 1
      this.getAllDataList()
    },
    stick(row) {
      updateSortIndexByType({
        bId: row.bid,
        type: 1
      }).then(res => {
        this.getDataList();
      });
    },
    shiftUp(row) {
      updateSortIndexByType({
        bId: row.bid,
        type: 2
      }).then(res => {
        this.getDataList();
      });
    },
    moveDown(row) {
      updateSortIndexByType({
        bId: row.bid,
        type: 3
      }).then(res => {
        this.getDataList();
      });
    },
    profileMode(row) {
      updateSortIndexByType({
        bId: row.bid,
        type: 4
      }).then(res => {
        this.getDataList();
      });
    },
    memberSort() {
      this.editMembership = true;
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
      pagephMemberCategory(obj)
        .then(res => {
          if (res.data) {
            this.list = res.data.list || [];
            this.postData.total = res.data.total;
          }
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
          this.$message.error(err.message);
        });
    },
    getAllDataList() {
      pagephMemberCategory({ pageSize: 999, pageNum: 1, sortStatus: 1 }).then(res => {
        this.addDataList = res.data.list;
      })
    },
    getParentId(arr) {
      if (arr.length) {
        this.ruleForm.parentCategoryBId = arr[arr.length - 1];
        this.ruleForm.parentCategoryBIds = arr.join(',')
      } else {
        this.ruleForm.parentCategoryBId = '';
        this.ruleForm.parentCategoryBIds = ''
      }
    },
    // 关闭详情模块
    detailDialogClos() {
      this.overDetails = false;
    },
    // 详情模块
    detailDialog(row) {
      this.getAllDataList()
      this.overDetails = true;
      this.detailForm = row;
      // 回显上级
      if (row.parentCategoryBIds) {
        this.detailForm.parentsName = this.detailForm.parentCategoryBIds.split(',').map(e => {
          return e;
        })
      } else {
        this.detailForm.parentsName = []
      }
    },
    // 编辑和新增模块
    openDialog(type, row) {
      this.getDataList()
      this.dialogType = type;
      if (type === "edit") {
        this.ruleForm = row;
        if (row.parentCategoryBIds) {
          this.ruleForm.parentsName = this.ruleForm.parentCategoryBIds.split(',').map(e => {
            return e;
          })
        } else {
          this.ruleForm.parentsName = []
        }
        let cloneArr = deepClone(this.list);
        this.disabledList = this.setDisabledList(cloneArr, row.bid);
      } else {
        // this.disabledList = deepClone(this.list)
        pagephMemberCategory({ pageSize: 999, pageNum: 1, sortStatus: 1 }).then(res => {
          this.disabledList = res.data.list;
        });
        this.ruleForm.categoryStatus = 1;
        this.ruleForm.id = '';
        this.ruleForm.bid = ''
      }
      this.dialogVisible = true;
    },
    setDisabledList(arr, bId) {
      arr.forEach(e => {
        if (e.bid === bId) {
          e.disabled = true
        } else if (e.children && e.children.length) {
          this.setDisabledList(e.children, bId)
        } else if (e.children && !e.children.length) {
          e.children = null
        }
      });
      return arr
    },
    closOPenDialog() {
      this.dialogVisible = false;
      this.overDetails = false;
      this.editMembership = false;
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
            updateMemberCategory(this.ruleForm)
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
            saveMemberCategory(this.ruleForm)
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
      } else {
        for (let i = 0; i < this.selectList.length; i++) {
          if (this.selectList[i].categoryStatus === 1) {
            return this.$message.warning(this.language === 'zh' ? '正在使用中,无法删除' : 'In use and cannot be removed')
          }
        }
      }
      let row = this.selectList[0];
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
          this.sub = row.sub;
          let formData = new FormData();
          formData.append("ids", this.deleteIdsForm);
          if (this.sub === 0 && this.sub !== '') {
            deleteClassByIds(formData)
              .then(res => {
                if (res.status === 200) {
                  this.$message.success(this.$t("system.userManage.handle"));
                }
                this.getDataList();
              })
              .catch(err => {
                this.$message.error(err.message);
              })
          } else {
            this.$message.error(this.$t('member.category.subordinate'))
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("system.userManage.cancel")
          });
        });
    },
    // 禁用或启用
    changeMethod(row) {
      let obj = {
        id: row.id
      };
      updateStatusCatagory(obj)
        .then(res => {
          this.$message.success(this.$t("system.userManage.handle"));
          this.searchData();
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    handleAvatarSuccess(res, file) {
      this.sysUserForm.photoPath = res.data.filePath;
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error(this.$t("system.userManage.uplode1"));
      }
      if (!isLt3M) {
        this.$message.error(this.$t("system.userManage.uplode2"));
      }
      return isJPG && isLt3M;
    },
    setChildSelect(section, row) {
      if (section.indexOf(row) > -1) {
        this.setCheckTable([row], true)
      } else {
        this.setCheckTable([row], false)
      }
    },
    setCheckTable(arr = [], flag) {
      arr.forEach(e => {
        if (e.children && e.children.length) {
          e.children.forEach(e => {
            this.$refs.listTable.toggleRowSelection(e, flag);
          });
          this.setCheckTable(e.children, flag)
        }
      })
    },
    // 导出操作
    exportExcelByEasypoiFun() {
      let obj = {
        pageNum: '',
        pageSize: '',
        categoryCode: this.postData.categoryCode,
        cnCategoryName: this.postData.cnCategoryName,
        enCategoryName: this.postData.enCategoryName,
        parentCategoryBId: this.postData.parentCategoryBId,
        categoryStatus: this.postData.categoryStatus
      };
      categoryExportEasypoi(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'MemberCategory.xls');
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
