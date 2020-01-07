<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '130px'" inline size="small">
        <el-form-item :label="$t('system.notice.noticeTitle')">
          <el-input v-model.trim="postData.noticeTitle" clearable :placeholder="$t('system.notice.noticeTitle')" style="width: 200px"/>
        </el-form-item>
        <el-form-item :label="$t('system.notice.triggerStatus')">
          <el-select v-model="postData.readStatus" clearable :placeholder="$t('system.notice.triggerStatus')" style="width: 150px">
            <el-option v-for="(item, index) in noticeReadStatusList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <!--<el-button type="primary" class="export" @click="outportData">{{$t('common.export')}}</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="loading。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('system.notice.noticeTitle')" width="200" prop="noticeTitle" show-overflow-tooltip/>

      <el-table-column :label="$t('system.notice.noticeContent')" prop="noticeContent" show-overflow-tooltip/>

      <el-table-column align="center" width="160" :label="$t('system.notice.triggerTime')" prop="triggerTime">
        <template slot-scope="scope">
          {{scope.row.triggerTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('system.notice.readStatus')" prop="readStatus">
        <template slot-scope="scope">
          {{ scope.row.readStatus === '0' ? $t('system.notice.unread') : $t('system.notice.read') }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('common.table.actions')" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="readNotice(row)">
            {{$t('common.buttonText.read')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  noticeList,
  readMyNotice
} from '@/api/system'
import treeMenu from '@/mixin/treeMenu'
import { parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  mixins: [treeMenu],
  data() {
    return {
      listLoading: true,
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        readStatus: '',
        noticeTitle: ''
      },
      noticeReadStatusList: [
        {
          labelZh: '全部',
          label: 'All',
          id: ''
        },
        {
          labelZh: '已阅',
          label: 'Read',
          id: '1'
        },
        {
          labelZh: '未阅',
          label: 'Not Read',
          id: '0'
        }
      ],
      list: []
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    // 搜索
    searchData() {
      this.postData.pageIndex = 1;
      this.getDataList()
    },
    // 获取数据列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      noticeList(obj).then(res => {
        this.list = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    readNotice(row) {
      let obj = {
        id: row.id
      };
      readMyNotice(obj).then(res => {
        this.getDataList();
        this.$message.success(this.$t('common.tip.operation'))
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  },
  filters: {
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

  .dialogClass {
    .el-dialog {
      width: 500px;
    }
  }
}
</style>
