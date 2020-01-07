<template>
  <div class="app-container purchase-order-inquiry">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <div>
          <el-form-item label="询价单编码">
            <el-input v-model="postData.inquiryCode" clearable placeholder="请输入询价单编码" style="width: 200px" />
          </el-form-item>
          <el-form-item label="询价单名称">
            <el-input v-model="postData.inquiryName" clearable placeholder="请输入询价单名称" style="width: 200px" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="状态">
            <el-select v-model="postData.inquiryStatus" clearable placeholder="请选择状态" style="width: 200px">
              <el-option v-for="(item, index) in statusList" :label="item.label" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="询价日期">
            <el-date-picker
              v-model="postData.rangeTime"
              type="datetimerange"
              unlink-panels
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="getRangeTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="queryWaitFor">待采购询价查询</el-button>
      <el-button type="primary" size="small" @click="goRouter(1, {})">新增</el-button>
      <el-button type="primary" size="small" @click="deleteMenu">删除</el-button>
      <el-button type="primary" size="small" @click="outportData" class="export">导出excel</el-button>
    </div>
    <el-table
      ref="listTable"
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="正在查询中。。。"
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

      <el-table-column label="询价单单号" width="160" prop="inquiryCode" show-overflow-tooltip/>

      <el-table-column label="询价单名称" prop="inquiryName" show-overflow-tooltip/>

      <el-table-column align="center" label="询价商品数" width="100" prop="skuNumber">
        <template slot-scope="scope">
          {{scope.row.skuNumber || 0}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="140" label="供应商数/回执数">
        <template slot-scope="scope">
          {{scope.row.supplierNumber || 0}}/{{scope.row.receiptNumber || 0}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建人" width="100" prop="createBy" show-overflow-tooltip/>

      <el-table-column align="center" width="150" label="询价日期" prop="inquiryTime">
        <template slot-scope="scope">
          {{scope.row.inquiryTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" label="状态" prop="inquiryStatus">
        <template slot-scope="{row}">
          {{row.inquiryStatus | statusName}}
        </template>
      </el-table-column>

      <el-table-column header-align="center" width="180" label="状态" prop="inquiryStatus">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="goRouter(0, scope.row)">查看</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" v-if="!scope.row.inquiryStatus" @click="goRouter(1, scope.row)">编辑</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" v-if="scope.row.inquiryStatus === 1" @click="stopInquiry(scope.row)">停止询价</el-button>
          <!--开始报价这个按钮到时候需要去掉-->
          <!--<el-button type="primary" size="mini" class="table-btn-width" v-if="scope.row.inquiryStatus === 1" @click="Quote(scope.row.bid)">开始报价</el-button>-->
          <el-button type="primary" size="mini" class="table-btn-width" v-if="scope.row.inquiryStatus === 2" @click="goRouter(1, scope.row)">优选</el-button>
          <!--<el-button type="primary" size="mini" class="table-btn-width" v-if="scope.row.inquiryStatus === 3" @click="goRouter(1, scope.row)">优选汇总</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getPurchaseInquiryList, deletePurchaseInquiry, stopPurchaseInquiry, exportPisExcelList } from '@/api/order'
import { parseTime } from '@/utils/index'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      dataList: [],
      selectList: [],
      listLoading: true,
      dialogVisible: false,
      postData: {
        inquiryCode: '',
        inquiryName: '',
        inquiryStatus: '',
        startTime: '',
        endTime: '',
        rangeTime: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      statusList: [
        {
          label: '编辑中',
          id: 0
        },
        {
          label: '询价中',
          id: 1
        },
        {
          label: '优选中',
          id: 2
        },
        {
          label: '已完成',
          id: 3
        }
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    queryWaitFor() {
      this.$router.push({
        path: '/order/purchaseInquiry/queryPurchase'
      })
    },
    goRouter(type, row) {
      let path = '';
      if (!type) {
        // path = '/order/purchaseInquiryDetail'
        path = '/order/purchaseInquiry/inquirySummary'
      } else {
        if (!row.inquiryStatus) {
          path = '/order/purchaseInquiry/editPurchaseInquiry'
        } else if (row.inquiryStatus === 2) {
          path = '/order/purchaseInquiry/preferencePurchaseInquiry'
        }
      }
      this.$router.push({
        path: path,
        query: {
          id: row ? row.bid : null
        }
      })
    },
    goRouter1(type, row) {
      this.$router.push({
        path: '/order/purchaseInquiry/inquirySummary',
        query: {
          id: row ? row.bid : null
        }
      })
    },
    getRangeTime(arr) {
      if (arr && arr.length) {
        this.postData.startTime = arr[0];
        this.postData.endTime = arr[1];
      } else {
        this.postData.startTime = '';
        this.postData.endTime = '';
      }
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportPisExcelList(obj).then(res => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', '采购询价详情管理列表.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    stopInquiry(row) {
      stopPurchaseInquiry({ bid: row.bid, inquiryStatus: 2 }).then(res => {
        this.$message.success('已停止询价');
        this.getDataList()
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 开始报价这个按钮到时候需要去掉
    Quote(id) {
      this.$router.push({
        path: '/order/purchaseInquiry/supplierQuote',
        query: {
          id: id
        }
      });
    },
    searchData() {
      this.postData.pageIndex = 1;
      this.getDataList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      getPurchaseInquiryList(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    getSelect(selects) {
      this.selectList = selects;
    },
    deleteMenu() {
      if (!this.selectList.length) {
        return this.$message('请选择数据');
      }
      this.$confirm('此操作将删除该询价单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let ids = this.selectList.map(e => e.id).join(',');
        deletePurchaseInquiry({ ids: ids }).then(res => {
          this.getDataList();
          this.$message.success('删除成功');
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
      });
    }
  },
  filters: {
    statusName(status) {
      const statusMap = ['编辑', '询价中', '优选中', '已完成'];
      return statusMap[status]
    },
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables.scss';
  .purchase-order-inquiry {
    .search-box {
      margin-bottom: 15px;
      border-bottom: 1px solid $border-light-color;
    }
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      .export {
        background: green;
        border: green;
      }
      button {
        margin: 0 10px;
      }
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
    .menuDialog {
      .el-dialog {
        width: 500px;
      }
    }
  }
</style>
