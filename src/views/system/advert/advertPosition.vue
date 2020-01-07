<template>
  <div class="app-container form-test">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '110px'" inline size="small">
        <el-form-item :label="$t('system.ad.positionName')">
          <el-input v-model.trim="postData.positionName" clearable :placeholder="$t('system.ad.positionName')" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('common.status')">
          <el-select v-model="postData.positionStatus" clearable :placeholder="$t('common.status')" style="width: 150px">
            <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.positionStatus" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="disableClick()">{{$t('common.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="outportData">{{$t('system.role.export')}}</el-button>
    </div>
        <el-table
          v-loading="listLoading"
          :data="dataList"
          element-loading-text="loading。。。"
          border
          fit
          size="mini"
          :header-cell-style="{background: '#a7bfee'}"
          @selection-change="getSelect">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column :label="$t('system.ad.positionName')" prop="positionName" show-overflow-tooltip />

          <el-table-column :label="$t('system.ad.medium')" width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.pcMedium ==="1" ? 'PC;' : ''}}{{scope.row.appMedium ==="1" ? 'APP;': '' }}{{scope.row.h5Medium ==="1" ? 'H5' : ''}}
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('common.table.updateBy')" width="100px" prop="updateUserIdName" show-overflow-tooltip />

          <el-table-column align="center" :label="$t('system.ad.updateTime')" width="160px" prop="updateTime" >
            <template slot-scope="scope">
              {{scope.row.updateTime | timeFmt}}
            </template>
          </el-table-column>

          <el-table-column align="center" width="100" :label="$t('common.table.status')" prop="positionStatus">
            <template slot-scope="{row}">
              <el-tag :type="row.positionStatus === 1 ? 'primary' : 'danger' " size="mini">
                {{ row.positionStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('common.table.actions')" width="200" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('common.table.view')}}</el-button>
              <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
              <el-button :type="row.positionStatus === 1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">
                {{row.positionStatus === 1 ? $t('common.table.disable') : $t('common.table.enable')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

        <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'? $t('system.ad.addPosition'): $t('system.ad.editPosition')"
                   center width="800px" @closed="clearData">
          <el-form ref="addCompany" :model="adsPosition" v-if="dialogVisible" label-width="130px" label-position="right" size="small" :rules="adsPositionRules" class="form-padding">
            <el-form-item :label="$t('system.ad.positionName')" prop="positionName">
              <el-input v-model="adsPosition.positionName" clearable maxlength="30" :placeholder="$t('system.ad.positionName')" class="form-dialog-width" />
            </el-form-item>
            <el-form-item :label="$t('common.table.status')" prop="positionStatus">
              {{ adsPosition.positionStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
            </el-form-item>
            <el-form-item label="PC">
              <el-checkbox v-model="adsPosition.pcMedium"></el-checkbox>
              <el-row :gutter="24" class="item-label">
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgH')">
                    <el-input v-model="adsPosition.pcImgHigh" clearable :disabled="!adsPosition.pcMedium" ><template slot="append">px</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgW')">
                    <el-input v-model="adsPosition.pcImgWidth" clearable :disabled="!adsPosition.pcMedium"><template slot="append">px</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgM')">
                    <el-input type="number" :min="0" v-model="adsPosition.pcMaximum" clearable :disabled="!adsPosition.pcMedium" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgS')">
                    <el-input type="number" :min="0" v-model="adsPosition.pcFileSize" clearable :disabled="!adsPosition.pcMedium"><template slot="append">kb</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item :label="$t('system.ad.imgF')">
                    <el-input v-model="adsPosition.pcFileFormat" clearable :disabled="!adsPosition.pcMedium" placeholder=""/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="APP">
              <el-checkbox v-model="adsPosition.appMedium"></el-checkbox>
              <el-row :gutter="24" class="item-label">
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgH')">
                    <el-input v-model="adsPosition.appImgHigh" clearable :disabled="!adsPosition.appMedium"><template slot="append">px</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgW')">
                    <el-input v-model="adsPosition.appImgWidth" clearable :disabled="!adsPosition.appMedium"><template slot="append">px</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgM')">
                    <el-input type="number" :min="0" v-model="adsPosition.appMaximum" clearable :disabled="!adsPosition.appMedium" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgS')">
                    <el-input type="number" :min="0" v-model="adsPosition.appFileSize" clearable :disabled="!adsPosition.appMedium"><template slot="append">kb</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item :label="$t('system.ad.imgF')">
                    <el-input v-model="adsPosition.appFileFormat" clearable :disabled="!adsPosition.appMedium" placeholder=""/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="H5">
              <el-checkbox v-model="adsPosition.h5Medium"></el-checkbox>
              <el-row :gutter="24" class="item-label">
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgH')">
                    <el-input v-model="adsPosition.h5ImgHigh" clearable :disabled="!adsPosition.h5Medium"><template slot="append">px</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgW')">
                    <el-input v-model="adsPosition.h5ImgWidth" clearable :disabled="!adsPosition.h5Medium"><template slot="append">px</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgM')">
                    <el-input type="number" v-model="adsPosition.h5Maximum" :min="0" clearable :disabled="!adsPosition.h5Medium"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgS')">
                    <el-input type="number" :min="0" v-model="adsPosition.h5FileSize" clearable :disabled="!adsPosition.h5Medium"><template slot="append">px</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item :label="$t('system.ad.imgF')">
                    <el-input v-model="adsPosition.h5FileFormat" clearable :disabled="!adsPosition.h5Medium" placeholder=""/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="confirmAdd('addCompany', dialogType === 'add' ? 1 : 2)">{{$t('common.buttonText.confirm')}}</el-button>
            <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
          </div>
        </el-dialog>

        <el-dialog :visible.sync="detailModal" :title="$t('system.ad.positionDetail')" center width="800px" @closed="clearData">
          <el-form ref="addCompany" :model="adsPosition" label-width="130px" label-position="right" size="small" class="form-padding">
            <el-form-item :label="$t('system.ad.positionName')" prop="positionName">
              <el-input v-model="adsPosition.positionName" clearable class="form-dialog-width" readonly/>
            </el-form-item>
            <el-form-item :label="$t('common.status')" prop="positionStatus">
              {{ adsPosition.positionStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
            </el-form-item>
            <el-form-item label="PC">
              <el-checkbox v-model="adsPosition.pcMedium" disabled></el-checkbox>
              <el-row :gutter="24" class="item-label">
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgH')">
                    <el-input v-model="adsPosition.pcImgHigh" readonly clearable ><template slot="append">px</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgW')">
                    <el-input v-model="adsPosition.pcImgWidth" readonly clearable ><template slot="append">px</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgM')">
                    <el-input v-model="adsPosition.pcMaximum" readonly clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgS')">
                    <el-input v-model="adsPosition.pcFileSize" readonly clearable ><template slot="append">kb</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item :label="$t('system.ad.imgF')">
                    <el-input v-model="adsPosition.pcFileFormat" readonly clearable placeholder=""/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="APP">
              <el-checkbox v-model="adsPosition.appMedium " readonly disabled></el-checkbox>
              <el-row :gutter="24" class="item-label">
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgH')">
                    <el-input v-model="adsPosition.appImgHigh" readonly clearable ><template slot="append">px</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgW')">
                    <el-input v-model="adsPosition.appImgWidth" readonly clearable ><template slot="append">px</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgM')">
                    <el-input v-model="adsPosition.appMaximum" readonly clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgS')">
                    <el-input v-model="adsPosition.appFileSize" readonly clearable ><template slot="append">kb</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item :label="$t('system.ad.imgF')">
                    <el-input v-model="adsPosition.appFileFormat" readonly clearable placeholder=""/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="H5">
              <el-checkbox v-model="adsPosition.h5Medium" disabled></el-checkbox>
              <el-row :gutter="24" class="item-label">
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgH')">
                    <el-input v-model="adsPosition.h5ImgHigh" readonly clearable ><template slot="append">px</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgW')">
                    <el-input v-model="adsPosition.h5ImgWidth" readonly clearable ><template slot="append">px</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgM')">
                    <el-input v-model="adsPosition.h5Maximum" readonly clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('system.ad.imgS')">
                    <el-input v-model="adsPosition.h5FileSize" readonly clearable ><template slot="append">px</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item :label="$t('system.ad.imgF')">
                    <el-input v-model="adsPosition.h5FileFormat" readonly clearable placeholder=""/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" size="small" @click="detailModal=false">{{$t('common.buttonText.close')}}</el-button>
          </div>
        </el-dialog>
  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
import { selectAdvertPositionListApi, saveAdvertPositionApi, updateAdvertPositionApi, updatePositionStatusApi, delectPositionByIdApi, exportBySysAdPositionExcel } from '@/api/system';
import { deepClone } from '@/utils/index'
import { parseTime } from '@/utils/index'
export default {
  components: {
    Pagination
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  },
  data() {
    return {
      dataList: [],
      list: null,
      listLoading: true,
      dialogVisible: false,
      detailModal: false,
      dialogType: '',
      indent: 20,
      selectList: [],
      reviewForm: {
        positionIds: ''
      },
      expandArr: [1036013, 1036014],
      adsPosition: {
        positionName: '',
        positionStatus: 1,
        pcMedium: '',
        pcImgHigh: '',
        pcImgWidth: '',
        pcMaximum: '',
        pcFileSize: '',
        pcFileFormat: '',
        appMedium: '',
        appImgHigh: '',
        appImgWidth: '',
        appMaximum: '',
        appFileSize: '',
        appFileFormat: '',
        h5Medium: '',
        h5ImgHigh: '',
        h5ImgWidth: '',
        h5Maximum: '',
        h5FileSize: '',
        h5FileFormat: ''
      },
      adsPositionRules: {
        positionName: [
          { required: true, message: this.$t('system.ad.positionNameHint'), trigger: 'blur' }
        ],
        pcMedium: [
          { required: true, message: this.$t('system.ad.pcMediumHint'), trigger: 'change' }
        ],
        appMedium: [
          { required: true, message: this.$t('system.ad.appMediumHint'), trigger: 'change' }
        ],
        h5Medium: [
          { required: true, message: this.$t('system.ad.h5MediumHint'), trigger: 'change' }
        ]
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        positionName: '',
        positionStatus: ''
      },
      areaList: [
        {
          labelZh: '全部',
          label: 'All',
          positionStatus: ''
        },
        {
          labelZh: '使用中',
          label: 'Enabled',
          positionStatus: 1
        },
        {
          labelZh: '已禁用',
          label: 'Disabled',
          positionStatus: 0
        }
      ]
    }
  },
  watch: {
    isZh() {
      this.adsPositionRules = {
        positionName: [
          { required: true, message: this.$t('system.ad.positionNameHint'), trigger: 'blur' }
        ],
        pcMedium: [
          { required: true, message: this.$t('system.ad.pcMediumHint'), trigger: 'change' }
        ],
        appMedium: [
          { required: true, message: this.$t('system.ad.appMediumHint'), trigger: 'change' }
        ],
        h5Medium: [
          { required: true, message: this.$t('system.ad.h5MediumHint'), trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    clearData() {
      this.adsPosition.positionName = '';
      this.adsPosition.pcMedium = '';
      this.adsPosition.appMedium = '';
      this.adsPosition.h5Medium = '';
      this.adsPosition.pcImgHigh = '';
      this.adsPosition.pcImgWidth = '';
      this.adsPosition.pcMaximum = '';
      this.adsPosition.pcFileSize = '';
      this.adsPosition.pcFileFormat = '';
      this.adsPosition.appImgHigh = '';
      this.adsPosition.appImgWidth = '';
      this.adsPosition.appMaximum = '';
      this.adsPosition.appFileSize = '';
      this.adsPosition.appFileFormat = '';
      this.adsPosition.h5ImgHigh = '';
      this.adsPosition.h5ImgWidth = '';
      this.adsPosition.h5Maximum = '';
      this.adsPosition.h5FileSize = '';
      this.adsPosition.h5FileFormat = '';
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      selectAdvertPositionListApi(this.postData).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message({ message: err.message });
      });
      this.listLoading = false;
    },
    openDetail(row) {
      this.adsPosition = deepClone(row);
      this.adsPosition.pcMedium = this.adsPosition.pcMedium === "1";
      this.adsPosition.appMedium = this.adsPosition.appMedium === "1";
      this.adsPosition.h5Medium = this.adsPosition.h5Medium === "1";
      this.detailModal = true;
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.adsPosition = deepClone(row);
        this.adsPosition.pcMedium = this.adsPosition.pcMedium === "1";
        this.adsPosition.appMedium = this.adsPosition.appMedium === "1";
        this.adsPosition.h5Medium = this.adsPosition.h5Medium === "1";
      }
      this.dialogVisible = true;
    },
    confirmAdd(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type === 1) {
            saveAdvertPositionApi(this.adsPosition).then(res => {
              this.$message.success(this.$t("system.userManage.addSuccess"));
              this.$refs[formName].resetFields();
              this.getDataList();
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          } else {
            updateAdvertPositionApi(this.adsPosition).then(res => {
              this.$message.success(this.$t("system.userManage.updata"));
              this.$refs[formName].resetFields();
              this.getDataList();
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          }
        } else {
          this.$message.warning(this.$t('common.tip.isdataFill'));
          return false;
        }
      });
    },
    changeStatus(row) {
      let obj = {
        positionStatus: row.positionStatus === 1 ? 0 : 1,
        id: row.id
      };
      updatePositionStatusApi(obj).then(res => {
        this.$message.success(res.message);
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 批量删除接口
    disableClick() {
      if (!this.selectList.length) {
        return this.$message(this.$t('query.formMessage.PleaseSelectData'));
      }
      this.$confirm(this.$t('query.formMessage.isDelete'), this.$t('system.userManage.hint'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        this.reviewForm.positionIds = this.selectList.map(e => {
          return e.id;
        }).join(',');
        delectPositionByIdApi(this.reviewForm).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t('common.tip.deleteTip'));
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("system.userManage.cancel")
        });
      });
    },
    // 导出操作
    outportData() {
      let obj = {
        pageNum: '',
        pageSize: '',
        positionName: this.postData.positionName,
        positionStatus: this.postData.positionStatus
      };
      exportBySysAdPositionExcel(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'SysAdPosition.xls');
        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .form-test {
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      button {
        margin: 0 10px;
      }
    }
    .menuDialog {
      .el-dialog {
        width: 500px;
      }
    }
    .item-label {
      margin-left: -80px !important;
      .el-form-item__label {
        width: 130px !important;
      }
    }
    .form-padding {
      padding-right: 85px;
    }
  }
</style>

