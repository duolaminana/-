<template>
  <div class="app-container">
    <div class="search-form-box">
      <el-form inline :model="searchForm" class="demo-form-inline" label-position="left">
        <div>
          <el-form-item label="Language" label-width="120px">
            <el-select v-model="searchForm.languages" style="width: 200px;">
              <el-option
                v-for="item in searchLanguageOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="No." label-width="120px">
            <el-input v-model="searchForm.preferedLanguageId" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="search">Search</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="option-button-box">
      <el-button type="primary" @click="handleDialog(true, 'Add')">Add</el-button>
      <el-button type="primary" @click="handleDelete">Delete</el-button>
      <el-button type="primary" class="export">Export to Excel</el-button>
    </div>

    <div class="content-box">
      <el-table
        :data="tableData"
        empty-text="The queried results is not exist."
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        size="mini"
        border
        default-expand-all
        :header-cell-style="{background: '#a7bfee'}"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" label="Select All" width="55"></el-table-column>
        <el-table-column prop="languages" label="Language" width="180"></el-table-column>
        <el-table-column prop="preferedLanguageId" label="No." width="180"></el-table-column>
        <el-table-column prop="preferedLanguageContent" label="Content"></el-table-column>
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
            >Edit</el-button>
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

    <el-dialog :visible.sync="dialogVisible" @close="clearOperateForm" center>
      <div slot="title">Edit Preferred Language</div>
      <div>
        <el-form
          ref="operateForm"
          :rules="operateRules"
          :model="operateForm"
          class="demo-form-inline"
          label-position="left"
        >
          <div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Language" prop="languages" label-width="100px">
                  <el-select
                    v-model="operateForm.languages"
                    @change="handleLanguageChange"
                    :disabled="opType != 'Add'"
                  >
                    <el-option
                      v-for="item in languageOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="No." label-width="50px">
                  <el-input disabled v-model="operateForm.preferedLanguageId"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item prop="preferedLanguageContent">
              Content
              <el-input
                type="textarea"
                size="medium"
                :rows="2"
                v-model="operateForm.preferedLanguageContent"
                :disabled="opType == 'View'"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div slot="footer">
        <span :hidden="opType == 'View'">
          <span :hidden="opType != 'Add'">
            <el-button type="primary" @click="addLanguage">Save</el-button>
          </span>
          <span :hidden="opType != 'Edit'">
            <el-button type="primary" @click="updateLanguage">Save</el-button>
          </span>
        </span>
        <el-button type="danger" @click="dialogVisible = false">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCsPreferedLanguageList,
  addLanguage,
  getLanguageNum,
  updateLanguage,
  updateStatusToDel,
  getLanguageById
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
      searchLanguageOptions: [
        {
          value: "",
          label: "ALL"
        },
        {
          value: "en",
          label: "en"
        },
        {
          value: "cn",
          label: "cn"
        }
      ],
      languageOptions: [
        {
          value: "en",
          label: "en"
        },
        {
          value: "cn",
          label: "cn"
        }
      ],
      operateForm: {
        languages: "",
        preferedLanguageId: null,
        preferedLanguageContent: ""
      },
      operateRules: {
        languages: [
          {
            required: true,
            message: "Language can not be None",
            trigger: "blur"
          }
        ],
        preferedLanguageContent: [
          {
            required: true,
            message: "Prefered Language can not be None",
            trigger: "blur"
          }
        ]
      },
      searchForm: {
        languages: "",
        preferedLanguageId: "",
        preferedLanguageContent: "",
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableSelectedData: []
    };
  },
  created() {
    this.search();
  },
  methods: {
    clearOperateForm() {
      this.operateForm.languages = "";
      this.operateForm.preferedLanguageId = null;
      this.operateForm.preferedLanguageContent = "";
    },
    search() {
      this.getTableData();
    },
    getTableData() {
      let obj = {};
      for (let key in this.searchForm) {
        if (this.searchForm[key] !== "") {
          obj[key] = this.searchForm[key];
        }
      }
      getCsPreferedLanguageList(obj)
        .then(res => {
          if (res.status === 200) {
            this.tableData = res.data.records;
            this.searchForm.total = res.data.total;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    setLanguageNum(language) {
      var that = this;
      getLanguageNum({ language: language })
        .then(res => {
          if (typeof res.data === "number") {
            that.operateForm.preferedLanguageId = res.data;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    addLanguage() {
      var that = this;
      this.$refs["operateForm"].validate(valid => {
        if (valid) {
          addLanguage({ ...this.operateForm })
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

    updateLanguage() {
      var that = this;
      this.$refs["operateForm"].validate(valid => {
        if (valid) {
          updateLanguage({
            id: this.operateForm.id,
            preferedLanguageContent: this.operateForm.preferedLanguageContent
          })
            .then(res => {
              if (res.status === 200) {
                that.$message.success("uptade completed");
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

    doDelete(id) {
      var that = this;
      updateStatusToDel({
        id: id
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

    setDetail(id) {
      var that = this;
      getLanguageById({
        id: id
      })
        .then(res => {
          if (res.status === 200) {
            that.operateForm = { ...res.data };
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
          "Please select the preferred language that needs to be operated."
        );
        return;
      }

      this.$confirm(
        "Are you sure to delete " + this.tableSelectedData.length + " records?",
        "Warning",
        {
          confirmButtonText: "confirm",
          cancelButtonText: "cancel",
          type: "warning"
        }
      )
        .then(() => {
          that.tableSelectedData.forEach(function(item) {
            that.doDelete(item.id);
          });
        })
        .catch(() => {});
    },

    handleDialog(visable, opType, data) {
      if (this.$refs["operateForm"]) this.$refs["operateForm"].clearValidate();

      this.dialogVisible = visable;
      this.opType = opType;

      if (opType !== "Add") {
        this.setDetail(data.id);
      }
    },

    handleLanguageChange(chooseValue) {
      this.setLanguageNum(chooseValue);
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
