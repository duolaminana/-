<template>
  <div class="app-container editOrder">
    <!--<div class="edit-title">销售订单</div>-->
    <el-form ref="editForm" :model="editForm" label-width="170px" size="small" class="edit-form">
      <el-row>
        <el-col :span="14">
          <el-form-item :label="$t('order.sale.orderNo')">
            {{editForm.orderNo ? editForm.orderNo : 'Null'}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('order.sale.orderDate')">
            {{(editForm.createTime || new Date()) | timeFmt}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item :label="$t('order.sale.clientName')">
            {{editForm.buyerName}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('order.sale.country')">
            {{editForm.buyerCountryCode | countryFmt(countryList)}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="margin-top: 16px">
        <el-col>
          <el-form-item :label="$t('order.sale.fileType')">
            <el-checkbox-group v-model="fileTypeCheck" disabled>
              <el-checkbox v-for="(item, index) in fileTypeList" :label="item.value" :key="index">
                <span v-if="item.value !== '8'">{{isZh?item.label:item.labelEn}}</span>
                <span v-else>{{newFileType}}</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="divright">
        <el-button type="primary" size="small" @click="addPayment(editForm.bid)">{{$t('common.add')}}</el-button>
        <el-button type="primary" size="small" @click="deleteListByIds()">{{$t('common.delete')}}</el-button>
      </div>
      <el-table
        :data="attachmentsList"
        border
        fit
        style="margin: 10px 0"
        size="small"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSelect">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center" width="55" type="index" />

        <el-table-column align="center" :label="$t('order.sale.attachmentType')" prop="attachmentRelevantType">
          <template slot-scope="scope">
            {{scope.row.attachmentRelevantType | attachmentTypeFmt(fileTypeList, isZh)}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('order.sale.uploadTime')" prop="attachmentUploadTime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.attachmentUploadTime | timeFmt}}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('order.sale.voucher')" prop="attachmentName" show-overflow-tooltip/>

        <el-table-column align="center" :label="$t('common.table.actions')" width="180">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" class="export" @click="exportPactFile(row)">{{$t('common.download')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form-item style="text-align: center;margin-top: 20px">
        <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="addModel" :title="$t('order.sale.relatedFileUpload')" width="600px" :close-on-click-modal="false" center @closed="clearData">
      <el-form ref="addAttachments" :model="attachmentsForm" label-width="130px" label-position="right" inline size="small"
               :rules="attachmentsRules">
        <el-form-item :label="$t('order.sale.attachmentType')" prop="attachmentRelevantType">
          <!--<el-input v-model="attachmentsForm.attachmentRelevantType" clearable placeholder="请输入附件类型" class="form-dialog-width"/>-->
          <el-select v-model="attachmentsForm.attachmentRelevantType" clearable placeholder="attachment type" class="form-dialog-width" >
            <el-option v-for="(item, index) in selectFileTypeList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index" style="width: 250px" >
              <span v-if="item.value !== '8'">{{isZh?item.label:item.labelEn}}</span>
              <span v-else>{{newFileType}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('order.sale.fileUpload')">
          <el-upload
            class="upload-demo"
            ref="upload"
            :limit="1"
            :on-exceed="handleExceed"
            :action="uploadActionUrl"
            :data="{type: 2}"
            :headers="upLoadHeaders"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :file-list="filesList">
            <el-button size="small" type="primary">{{$t('common.upload')}}</el-button>
            <div slot="tip" class="el-upload__tip">{{$t('order.sale.uploadTips')}}</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="addLoading" @click="addPaymentModel('addAttachments')">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="danger" size="small" @click="addModel=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination'
import { selectgetDictionaryBykeyApi, selectSysOrderParameterApi, selectCountryListApi } from '@/api/system'
import { listCustomerInfoContactApi } from '@/api/customer'
import { parseTime } from '@/utils/index'
import { uploadActionUrl } from '@/api/common'
import { transferOrderDetail } from '@/api/transitrade'
import { saleOrderDetail, listOrderRelatFilesApi, deleteOrderRelatFilesByIdsApi, saveOrderRelatFilesApi } from '@/api/order'
export default {
  data() {
    return {
      idsForm: {
        ids: ''
      },
      uploadActionUrl,
      filesList: [],
      countryList: [],
      addModel: false,
      addLoading: false,
      attachmentsList: [],
      customerInfoList: [],
      fileTypeList: [],
      selectList: [],
      fileTypeCheck: [],
      selectFileTypeList: [],
      newFileType: '',
      editForm: {
        customerBId: '',
        toleranceNumber: '',
        choosedAttachment: '',
        orderNo: '',
        createTime: '',
        buyerName: '',
        buyerCountryCode: ''
      },
      attachmentsForm: {
        salesOrderBId: '',
        attachmentName: '',
        attachmentRelevantType: '',
        attachmentPath: '',
        attachmentUploadTime: '',
        attachmentSource: ''
      },
      attachmentsRules: {
        attachmentRelevantType: [
          { required: true, message: 'Please select the file type', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    countryFmt(val, arr) {
      let objArr = arr.filter(e => e.countryCode === val);
      if (objArr.length) {
        return objArr[0].chEnName
      } else {
        return val
      }
    },
    attachmentTypeFmt(val, arr, isZh) {
      let objArr = arr.filter(e => e.value === String(val));
      if (objArr.length) {
        return isZh ? objArr[0].label : objArr[0].labelEn
      } else {
        return val
      }
    }
  },
  computed: {
    activeRoute() {
      let visitedViews = this.$store.state.tagsView.visitedViews;
      let activePath = visitedViews.filter(e => {
        return e.path === this.$route.path
      })[0];
      return activePath
    }
  },
  created() {
    this.getCountryList()
    this.getFileTypeList(); // 获取附件
    this.getCustomerInfoListFun(); // 客户列表
    this.getSaleOrderDetail(); // 获取销售订单详情
    this.getListOrderRelatFilesFun(); // 根据销售bid和附件类型(5)查看相关文件列表
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/order/saleOrder'
        })
      })
    },
    // 根据销售bid和附件类型(5)查看相关文件列表
    getListOrderRelatFilesFun() {
      let data = {
        salesOrderBId: this.$route.query.id,
        attachmentType: 5
      };
      listOrderRelatFilesApi(data).then(res => {
        this.attachmentsList = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 获取销售订单详情
    getSaleOrderDetail() {
      let api = Number(this.$route.query.saleType === 1) ? transferOrderDetail : saleOrderDetail;
      api({ orderBid: this.$route.query.id }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        if (this.editForm.choosedAttachment) {
          this.fileTypeCheck = this.editForm.choosedAttachment.split(',');
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 客户列表
    getCustomerInfoListFun() {
      listCustomerInfoContactApi().then(res => {
        this.customerInfoList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取附件
    getFileTypeList() {
      selectgetDictionaryBykeyApi({ key: 'allowable attachment' }).then(res => {
        this.getSaleSetting(res.data);
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 获取系统参数
    getSaleSetting(fileTypeList) {
      selectSysOrderParameterApi({ orderParameterType: Number(this.$route.query.saleType) === 1 ? 3 : 2 }).then(res => {
        if (res.data) {
          this.editForm.toleranceNumber = res.data.toleranceNumber
        }
        let saleFileType = res.data.sysOrderParameterAnnexList.filter(e => {
          if (e.dictCode === '8' && e.isAllow) {
            this.newFileType = e.customizeName;
          }
          return e.isAllow
        }).map(t => {
          return t.dictCode
        });
        this.fileTypeList = fileTypeList.filter(e => {
          return saleFileType.includes(e.value)
        });
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 通过销售bid来新增附件类型
    addPayment(bid) {
      this.selectFileTypeList = this.fileTypeList.filter(e => {
        return this.fileTypeCheck.includes(e.value)
      });
      this.attachmentsForm.salesOrderBId = bid;
      this.attachmentsForm.attachmentType = 5; // 相关文件类型为5
      this.attachmentsForm.attachmentSource = 1; // 附件来源（"1-后台管理人员上传 2-前台用户上传）
      this.addModel = true;
    },
    // 进行保存操作
    addPaymentModel(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.attachmentsForm.attachmentPath === '') {
            return this.$message.warning(this.language === 'zh' ? '请上传附件' : 'Please upload the attachment')
          }
          saveOrderRelatFilesApi(this.attachmentsForm).then(res => {
            this.$message.success(res.message);
            this.$refs[formName].resetFields();
            this.addModel = false;
            this.getListOrderRelatFilesFun();
          }).catch(err => {
            this.$message.error(err.message);
            this.addModel = false;
          });
        } else {
          return false;
        }
      });
    },
    // 清空数据
    clearData() {
      this.attachmentsForm.attachmentRelevantType = '';
      this.filesList = [];
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 查询获取国家
    getCountryList() {
      selectCountryListApi().then(res => {
        this.countryList = res.data || [];
      })
    },
    // 批量删除凭证
    deleteListByIds() {
      if (!this.selectList.length) {
        return this.$message(this.$t('order.sale.deleteTips'));
      }
      this.$confirm(this.$t('common.tip.isDeleteMsg'), 'Tips', {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        this.idsForm.ids = this.selectList.map(e => {
          return e.id;
        }).join(',');
        let formData = new FormData();
        formData.append("ids", this.idsForm.ids);
        deleteOrderRelatFilesByIdsApi(formData).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t('common.tip.deleteTip'));
          }
          this.getListOrderRelatFilesFun();
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
    // 下载协议
    exportPactFile(row) {
      this.downFile(row.attachmentPath)
    },
    // 上传文件删除
    handleRemove(file, filesList) {
      this.attachmentsForm.attachmentName = '';
      this.attachmentsForm.attachmentPath = '';
    },
    handleExceed(files, fileList) {
      this.$message.warning(`at most 1 files can be upload`);
    },
    // 上传成功
    handleSuccess(res, file, filename) {
      this.attachmentsForm.attachmentName = file.name;
      this.attachmentsForm.attachmentPath = res.data.filePath;
    },
    // 上传之前限制
    beforeUpload(file) {
      for (let i = 0; i < this.filesList.length; i++) {
        if (this.filesList[i].attachmentName === file.name) {
          this.$message.error('Cannot upload the same file repeatedly');
          return false
        }
      }
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension = testmsg === 'PDF';
      const extension2 = testmsg === 'pdf';
      const extension3 = testmsg === 'doc';
      const extension4 = testmsg === 'docx';
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension && !extension2 && !extension3 && !extension4) {
        this.$message.warning(this.$t('common.tip.uploadFmt'));
      }
      if (!isLt2M) {
        this.$message.warning(this.$t('common.tip.uploadFmt') + '10MB!');
      }
      return (extension || extension2 || extension3 || extension4) && isLt2M
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .editOrder {
    width: 70%;
    margin: 0 auto;
    border: 1px solid $border-light-color;
    .edit-title {
      position: relative;
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid $border-light-color;
    }
    .edit-form {
      margin-top: 20px;
    }
    .edit-form-width {
      width: 300px;
    }
    .row-item {
      margin-bottom: 20px;
    }
    .tableSet {
      text-align: center;
      width: 680px !important;
      thead {
        tr {
          th {
            padding: 3px;
            border-right: 1px solid $border-light-color;
            border-top: 1px solid $border-light-color;
            border-bottom: 1px solid $border-light-color;
          }
          th:first-child {
            border-left: 1px solid $border-light-color;
          }
        }
      }
      tr {
        td {
          padding: 3px;
          border-right: 1px solid $border-light-color;
          border-bottom: 1px solid $border-light-color;
        }
        td:first-child {
          border-left: 1px solid $border-light-color;
        }
      }
    }
    .table-top {
      line-height: 1.5rem;
      padding: 5px;
      width: 100%;
      display: flex;
      display: -webkit-flex;
      .top-title {
        width: 50%;
        text-align: left;
      }
      .top-btns {
        width: 50%;
        text-align: right;
      }
      button {
        margin: 0 10px;
      }
    }
    .table-goods {
      display: flex;
      display: -webkit-flex;
      .goods-img {
        width: 90px;
        height: 90px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .goods-text {
        margin-left: 10px;
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: space-around;
        text-align: left;
        >div {
          font-size: 12px;
        }
      }
    }
    .order-record {
      font-size: 16px;
      font-weight: bold;
      color: #3f51b5;
      text-decoration: underline;
    }
    .divright {
      margin: 100px 0px 10px 0px;
      text-align: right;
    }
  }
</style>
