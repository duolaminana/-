<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '135px'" inline size="small">
        <el-form-item :label="$t('system.workflowNode.nodeName')">
          <el-input v-model.trim="postData.nodeName" clearable :placeholder="$t('system.workflowNode.nodeName')" style="width: 200px"/>
        </el-form-item>
        <el-form-item :label="$t('system.workflowNode.nodeType')">
          <el-select v-model="postData.nodeType" clearable :placeholder="$t('system.workflowNode.nodeType')" style="width: 200px">
            <el-option v-for="(item, index) in nodeTypeList" :label="language === 'zh' ? item.labelZh :item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openADJNode()">{{$t('common.adjNode')}}</el-button>
      <!--<el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.addNode')}}</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="loading。。。"
      border
      fit
      size="small"
      :header-cell-style="{background: '#a7bfee'}" @selection-change="getSelect">
      <el-table-column :label="$t('system.workflowNode.sequence')" align="center" prop="sequence" width="80" show-overflow-tooltip/>

      <el-table-column :label="$t('system.workflowNode.nodeName')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.nodeNameCh : scope.row.nodeName}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('system.workflowNode.nodeType')" prop="nodeType" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ row.nodeType | nodeTypeName }}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="175" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="table-btn-width" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
          <el-button :type="row.nodeStatus === 1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">
            {{row.nodeStatus === 0 ? $t('common.table.close') : $t('common.table.open')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="workflowProcessVisible" :title="$t('system.workflowNode.orderAdjust')" center width="900px">
      <el-form label-width="90px" inline size="small">
        <div>
          <el-form-item :label="$t('system.workflowNode.orderBId')">
            <el-input v-model.trim="workflowProcessDate.orderNo" clearable :placeholder="$t('system.workflowNode.orderBId')" style="width: 380px" />
          </el-form-item>
          <el-form-item :label="$t('system.workflowNode.operateTime')">
            <el-date-picker
              v-model="orderTime"
              type="daterange"
              align="right"
              unlink-panels
              clearable
              range-separator="~"
              start-placeholder="start date"
              end-placeholder="end date"
              style="width: 380px"
              @change="getSearchTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="processSearchData">{{$t('common.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-table
        :data="workflowProcessList"
        border
        v-loading="orderNodeListLoading"
        fit
        size="small"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column
          align="center"
          type="index"
          width="55">
        </el-table-column>
        <el-table-column align="left" :label="$t('system.workflowNode.orderBId')" prop="orderNo" show-overflow-tooltip/>
        <el-table-column align="left" :label="$t('system.workflowNode.operateTime')" prop="orderTime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.orderTime | timeFmt}}
          </template>
        </el-table-column>
        <el-table-column align="left" :label="$t('system.workflowNode.workflowNodeBId')" prop="id" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-select clearable v-model="scope.row.cloneId" @change="changeOrderNode(scope.row.cloneId, scope.row.workflowProcessChildList)">
              <el-option v-for="(item, index) in scope.row.workflowProcessChildList" :label="isZh ? item.nodeNameCh : item.nodeName" :value="item.id" :key="index"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" label="当前" prop="nodeName" show-overflow-tooltip>-->
          <!--<el-select clearable placeholder="请选择节点上级" style="width: 150px">-->
            <!--<el-option v-for="(item, index) in dataList" :label="item.nodeName" :value="item.bid" :key="index" >-->
              <!--{{item.nodeName}}-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-table-column>-->
      </el-table>
      <Pagination :total="workflowProcessDate.total" :page.sync="workflowProcessDate.pageNum" :limit.sync="workflowProcessDate.pageSize" @pagination="selectWorkflowProcessListFun"></Pagination>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'? $t('system.workflowNode.addTriggerPoint'):$t('system.workflowNode.editTriggerPoint')" center width="600px" @closed="clearData">
      <el-form :model="entity" ref="ruleForm" v-if="dialogVisible" label-width="135px" label-position="left" size="small" :rules="dictionaryDataRules">
        <el-form-item :label="$t('system.workflowNode.nodeNameEN')" prop="nodeName">
          <el-input v-model="entity.nodeName" :disabled="Boolean(entity.id)" clearable :placeholder="$t('system.workflowNode.nodeNameEN')" style="width: 350px"/>
        </el-form-item>
        <el-form-item :label="$t('system.workflowNode.nodeNameCh')" prop="nodeNameCh">
          <el-input v-model="entity.nodeNameCh" :disabled="Boolean(entity.id)" clearable :placeholder="$t('system.workflowNode.nodeNameCh')" style="width: 350px"/>
        </el-form-item>
        <el-form-item :label="$t('system.workflowNode.triggerPointCode')" prop="triggerPointCode">
          <el-input v-model="entity.triggerPointCode" :disabled="Boolean(entity.id)" clearable :placeholder="$t('system.workflowNode.explain')" style="width: 350px"/>
        </el-form-item>
        <el-form-item :label="$t('system.workflowNode.nodeType')" prop="nodeType">
          <el-select v-model="entity.nodeType" clearable :placeholder="$t('system.workflowNode.nodeType')" style="width: 350px">
            <el-option v-for="(item, index) in nodeTypeList" :label="language === 'zh' ? item.labelZh :item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.workflowNode.nodeRequestUrl')" prop="nodeRequestUrl">
          <el-input v-model="entity.nodeRequestUrl" clearable :placeholder="$t('system.workflowNode.nodeRequestUrl')" style="width: 350px"/>
        </el-form-item>
        <el-form-item :label="$t('system.workflowNode.parentNodeBId')">
          <el-select :disabled="Boolean(entity.id)" v-model="entity.parentNodeBId" clearable :placeholder="$t('system.workflowNode.parentNodeBId')" style="width: 350px">
            <el-option v-for="(item, index) in dataList" :label="item.nodeName" :value="item.bid" :key="index" >
              {{item.nodeName}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.workflowNode.mandatoryFlag')">
          <el-radio-group v-model="entity.mandatoryFlag">
            <el-radio :label="1">{{$t('system.workflowNode.yes')}}</el-radio>
            <el-radio :label="0">{{$t('system.workflowNode.no')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('common.table.status')">
          {{ entity.nodeStatus === 0 ? $t('common.table.open') : $t('common.table.close') }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="addLoading" @click="addMethod('ruleForm')">{{$t('common.buttonText.confirm')}}</el-button>
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectWorkflowNodeListApi,
  updateNodeStatusApi,
  saveWorkflowNodeApi,
  updateWorkflowNodeApi
} from '@/api/system'
import { selectWorkflowProcessListApi, updateCurrentNodeApi } from '@/api/order'
import treeMenu from '@/mixin/treeMenu'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import { deepClone } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    nodeTypeName(val) {
      switch (val) {
        // 节点类型( 1-orderFlow-订单流 2-cashFlow-资金流 3-logisticsFlow-物流)
        case 1: return 'Order Flow';
        case 2: return 'Cash Flow';
        case 3: return 'Logistics Flow';
        default:
          return '';
      }
    }
  },
  mixins: [treeMenu],
  data() {
    return {
      pageList: [],
      firstList: '',
      listLoading: true,
      orderNodeListLoading: true,
      addLoading: false,
      workflowProcessVisible: false,
      dialogVisible: false,
      selectList: [],
      dialogType: '',
      indent: 20,
      entity: {
        id: '',
        nodeName: '',
        nodeNameCh: '',
        triggerPointCode: '',
        nodeType: 1,
        mandatoryFlag: 0,
        nodeStatus: 0,
        nodeRequestUrl: '',
        parentNodeBId: ''
      },
      postData: {
        nodeName: '',
        nodeType: ''
      },
      workflowProcessDate: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        orderBId: '',
        startTime: '',
        endTime: ''
      },
      orderTime: [],
      workflowProcessList: [],
      nodeTypeList: [
        // 节点类型( 1-orderFlow-订单流 2-cashFlow-资金流 3-logisticsFlow-物流)
        {
          labelZh: '订单流',
          label: 'Order Flow',
          id: 1
        },
        {
          labelZh: '资金流',
          label: 'Cash Flow',
          id: 2
        },
        {
          labelZh: '物流',
          label: 'Logistics Flow',
          id: 3
        }
      ],
      dataList: [],
      departmentList: [],
      dictionaryDataRules: {
        nodeName: [
          { required: true, message: this.$t('system.workflowNode.nodeNameHint'), trigger: 'blur' }
        ],
        nodeNameCh: [
          { required: true, message: this.$t('system.workflowNode.nodeNameChHint'), trigger: 'blur' }
        ],
        triggerPointCode: [
          { required: true, message: this.$t('system.workflowNode.triggerPointCodeHint'), trigger: 'blur' }
        ],
        nodeType: [
          { required: true, message: this.$t('system.workflowNode.nodeTypeHint'), trigger: 'blur' }
        ]
      },
      workflowProcessChildList: [],
      childList: ''
    }
  },
  watch: {
    isZh() {
      this.dictionaryDataRules = {
        nodeName: [
          { required: true, message: this.$t('system.workflowNode.nodeNameHint'), trigger: 'blur' }
        ],
        nodeNameCh: [
          { required: true, message: this.$t('system.workflowNode.nodeNameChHint'), trigger: 'blur' }
        ],
        triggerPointCode: [
          { required: true, message: this.$t('system.workflowNode.triggerPointCodeHint'), trigger: 'blur' }
        ],
        nodeType: [
          { required: true, message: this.$t('system.workflowNode.nodeTypeHint'), trigger: 'blur' }
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
      this.entity.id = '';
      this.entity.nodeName = '';
      this.entity.nodeNameCh = '';
      this.entity.triggerPointCode = '';
      this.entity.nodeType = 1;
      this.entity.nodeRequestUrl = '';
      this.entity.parentNodeBId = '';
      this.entity.mandatoryFlag = 0;
      this.entity.nodeStatus = 0;
    },
    // 搜索
    searchData() {
      this.getDataList()
    },
    processSearchData() {
      this.selectWorkflowProcessListFun();
    },
    // 获取数据列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      selectWorkflowNodeListApi(obj).then(res => {
        this.dataList = res.data || [];
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    // 编辑和新增模块
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.entity = deepClone(row);
      }
      this.dialogVisible = true;
    },
    changeOrderNode(val, arr) {
      let selectObj = arr.filter(e => e.id === val)[0];
      let obj = { id: selectObj.id, orderBId: selectObj.orderBId };
      updateCurrentNodeApi(obj).then(res => {
        this.selectWorkflowProcessListFun();
        this.$message.success(this.$t('common.tip.updateTip'))
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 节点调整
    openADJNode() {
      this.selectWorkflowProcessListFun();
      this.workflowProcessVisible = true;
    },
    // 分页查询-订单节点信息列表数据
    selectWorkflowProcessListFun() {
      let obj = {};
      for (let key in this.workflowProcessDate) {
        if (this.workflowProcessDate[key] !== '') {
          obj[key] = this.workflowProcessDate[key]
        }
      }
      this.orderNodeListLoading = true;
      selectWorkflowProcessListApi(obj).then(res => {
        this.workflowProcessList = res.data.list.map(e => {
          e.cloneId = e.id;
          return { ...e }
        });
        this.workflowProcessDate.total = res.data.total;
        this.orderNodeListLoading = false;
      }).catch(err => {
        this.orderNodeListLoading = false;
        this.$message.error(err.message)
      });
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.workflowProcessDate.startTime = date[0];
        this.workflowProcessDate.endTime = date[1]
      } else {
        this.workflowProcessDate.startTime = '';
        this.workflowProcessDate.endTime = ''
      }
    },
    // 控制开关
    changeStatus(row) {
      let obj = {
        nodeStatus: row.nodeStatus === 1 ? 0 : 1,
        id: row.id
      };
      updateNodeStatusApi(obj).then(res => {
        this.$message.success(res.message);
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    closOPenDialog() {
      this.dialogVisible = false;
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 具体添加方法
    addMethod(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.entity.id) {
            updateWorkflowNodeApi(this.entity).then(res => {
              this.$message.success(this.$t("system.userManage.updata"));
              this.dialogVisible = false;
              this.getDataList();
              this.closOPenDialog()
            }).catch(err => {
              this.$message.error(err.message)
            });
          } else {
            saveWorkflowNodeApi(this.entity).then(res => {
              this.$message.success('Save Success');
              this.dialogVisible = false;
              this.getDataList();
              this.closOPenDialog()
            }).catch(err => {
              this.$message.error(err.message)
            });
          }
        } else {
          this.$message.error(this.$t('common.tip.isdataFill'));
        }
      });
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
