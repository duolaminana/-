<template>
  <div class="app-container questionnaire">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '150px'" inline size="small">
        <div>
          <el-form-item :label="$t('finance.financeService.start')">
            <el-date-picker
              v-model="postData.beginTime"
              :picker-options="pickerOptionsStart1"
              type="datetime"
              style="width: 200px">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('finance.financeService.end')">
            <el-date-picker
              v-model="postData.endTime"
              :picker-options="pickerOptionsEnd1"
              type="datetime"
              style="width: 200px">
            </el-date-picker>
          </el-form-item>

          <el-form-item :label="$t('common.status')">
            <el-select v-model="postData.questionnaireStatus" clearable :placeholder="$t('common.status')" style="width: 150px">
              <el-option v-for="(item, index) in statusList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('newProduct.questionnaire.name')">
            <el-input v-model.trim="postData.questionnaireName" clearable :placeholder="$t('newProduct.questionnaire.name')" style="width: 200px" />
          </el-form-item>

          <el-form-item :label="$t('product.product.productName')">
            <el-input v-model.trim="postData.productName" clearable :placeholder="$t('product.product.productName')" style="width: 200px" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteModal">{{$t('common.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="exportExcelByEasypoiFun">{{$t('system.role.export')}}</el-button>
      <!--<el-button type="primary" size="small" @click="outportData" class="export">{{$t('common.export')}}</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="Loading。。。"
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
      <el-table-column label="No." min-width="150" prop="questionnaireCode" show-overflow-tooltip/>

      <el-table-column :label="$t('newProduct.questionnaire.name')" prop="questionnaireName" show-overflow-tooltip/>

      <el-table-column :label="$t('product.product.productName')" prop="productName" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh?scope.row.productCnName:scope.row.productEnName}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('newProduct.questionnaire.beginTime')" align="center" width="160px">
        <template slot-scope="scope">
          {{scope.row.beginTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('newProduct.questionnaire.endTime')" align="center" width="160px">
        <template slot-scope="scope">
          {{scope.row.endTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.status')" align="center" width="80px">
        <template slot-scope="scope">
          {{scope.row.questionnaireStatus | statusFilter(language === 'zh')}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="280" :label="$t('common.table.actions')" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="goDetail(row.bid, 1)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
          <el-button :disabled="row.questionnaireStatus === 3" :type="row.questionnaireStatus === 1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">
            {{row.questionnaireStatus === 1 ? $t('common.table.enable') : $t('common.table.disable')}}
          </el-button>
          <el-button type="primary" size="mini" class="export" @click="goDetail(row.bid, 2)">{{$t('newProduct.questionnaire.total')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?$t('newProduct.questionnaire.add'):$t('newProduct.questionnaire.edit')"
               width="840px" center :close-on-click-modal="false" @close="clearData">
      <el-form ref="dialogForm" :model="dialogForm" v-if="dialogVisible" label-width="150px" label-position="left" size="small" :rules="dialogFormRules">
        <div class="fieldset">{{$t('newProduct.questionnaire.basic')}}</div>
        <el-form-item :label="$t('newProduct.questionnaire.name')" prop="questionnaireName">
          <el-input v-model="dialogForm.questionnaireName" maxlength="30" clearable :placeholder="$t('newProduct.questionnaire.name')" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('product.product.productName')" prop="productNewBId">
          <el-select filterable v-model="dialogForm.productNewBId" clearable :placeholder="$t('newProduct.questionnaire.searchNewProduct')" class="form-dialog-width" @change="getProductName">
            <el-option v-for="(item, index) in productList" :label="isZh ? item.cnProductName : item.enProductName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('newProduct.questionnaire.beginTime')" prop="startTime">
          <el-date-picker
            v-model="dialogForm.beginTime"
            type="datetime"
            class="form-dialog-width"
            style="width: 300px"
            :picker-options="pickerOptionsStart"
            :placeholder="$t('newProduct.questionnaire.beginTime')">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('newProduct.questionnaire.endTime')" prop="endTime">
          <el-date-picker
            v-model="dialogForm.endTime"
            type="datetime"
            style="width: 300px"
            class="form-dialog-width"
            :picker-options="pickerOptionsEnd"
            :placeholder="$t('newProduct.questionnaire.endTime')">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('common.status')" style="border-bottom: 1px solid #eee" prop="questionnaireStatus">
          {{ dialogForm.questionnaireStatus | statusFilter(language === 'zh') }}
        </el-form-item>

        <el-steps :active="active" align-center class="order-step">
          <el-step :title="$t('newProduct.questionnaire.leaflet')"></el-step>
          <el-step :title="$t('newProduct.questionnaire.info')"></el-step>
        </el-steps>

        <div v-show="active === 0">
          <div class="fieldset">{{$t('newProduct.questionnaire.questionLeaflet')}}</div>
          <el-form-item :label="$t('newProduct.questionnaire.img')" prop="imagePath" required>
            <el-upload
              class="avatar-uploader"
              :action="uploadActionUrl"
              :headers="upLoadHeaders"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="dialogForm.imagePath" :src="fullUrl(dialogForm.imagePath)" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="tips">{{$t('newProduct.questionnaire.imgSizeTip')}}</span>
          </el-form-item>
          <el-form-item :label="$t('newProduct.questionnaire.incentive')" prop="incentiveText">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              :placeholder="$t('newProduct.questionnaire.writeData')"
              maxlength="300"
              v-model="dialogForm.incentiveText">
            </el-input>
          </el-form-item>
        </div>

        <div v-show="active === 1">
          <div class="fieldset">{{$t('newProduct.questionnaire.infoData')}}</div>
          <div class="question-set">
            <el-radio-group v-model="questionType">
              <el-radio :label="1">{{$t('product.categoryTemplate.radio')}}</el-radio>
              <el-radio :label="2">{{$t('product.categoryTemplate.multipleSelection')}}</el-radio>
              <el-radio :label="3">{{$t('product.categoryTemplate.textbox')}}</el-radio>
            </el-radio-group>
            <el-button type="primary" size="mini" style="margin-left: 20px" icon="el-icon-plus" circle @click="openInnerDialog(1)"></el-button>
          </div>
          <div class="question" v-if="questionList.length" style="overflow: auto;max-height: 400px;font-size: 12px">
            <div v-for="(item,index) in questionList" :key="index">
              <div class="question-item" v-show="item.operatingState !== 3">
                <div class="question-item-box">
                  <div><svg-icon class-name="svgClass" icon-class="jiantoushang" size="18" @click.native="moveOne(questionList,index,1)" /></div>
                  <div><svg-icon class-name="svgClass" icon-class="jiantouxia" size="18" @click.native="moveOne(questionList,index,-1)"/></div>
                </div>
                <div class="question-item-box">{{index+1}}、</div>
                <div class="question-item-label">{{item.questionContent}}</div>
                <div class="question-item-content">
                  <el-radio-group size="medium" value="" v-if="Number(item.questionType) === 1" disabled style="width: 100%">
                    <el-radio :label="item1.optionNo" v-for="(item1,index1) in item.questionnaireAnswerList" :key="index1">{{item1.optionNo}}、{{item1.options}}</el-radio>
                  </el-radio-group>
                  <el-checkbox-group size="medium" value="" v-if="Number(item.questionType) === 2" disabled>
                    <el-checkbox :label="item1.optionNo" v-for="(item1,index1) in item.questionnaireAnswerList" :key="index1">{{item1.optionNo}}、{{item1.options}}</el-checkbox>
                  </el-checkbox-group>
                  <el-input
                    v-if="Number(item.questionType) === 3"
                    type="textarea"
                    disabled
                    :autosize="{ minRows: 4, maxRows: 6}"
                    :placeholder="$t('newProduct.questionnaire.writeMaxLength')">
                  </el-input>
                </div>
                <div class="question-item-action">
                  <el-button type="primary" size="mini" @click="openInnerDialog(2, item)">{{$t('common.table.edit')}}</el-button>
                  <el-button type="danger" size="mini" @click.prevent="deleteQuestion(item, index)">{{$t('common.delete')}}</el-button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="question no-data">{{$t('common.noData')}}</div>
        </div>
      </el-form>

      <el-dialog
        width="800px"
        :title="$t('newProduct.questionnaire.questionDetail')"
        center
        :visible.sync="innerVisible"
        :close-on-click-modal="false"
        @close="clearInnerData"
        append-to-body>
        <div class="question">
          <el-form ref="innerForm" label-width="140px" label-position="left" :model="innerForm" :rules="innerFormRules" class="inner-dialog">
            <el-form-item :label="$t('newProduct.questionnaire.questionData')" prop="questionContent">
              <el-input v-model="innerForm.questionContent"></el-input>
            </el-form-item>

            <span v-if="innerForm.questionType !== 3">
              <el-form-item :label="$t('newProduct.questionnaire.answerOptions')" required>
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addAnswer">{{$t('common.addTo')}}</el-button>
              </el-form-item>
              <div class="answer">
                <div class="answer-item" v-for="(item, index) in innerForm.questionnaireAnswerList" :key="index">
                  <div style="min-width: 115px;line-height: 32px;text-align: right">{{$t('newProduct.questionnaire.selectData')}}{{item.optionNo}}：</div>
                  <el-input v-model="item.options" />
                  <el-button type="danger" size="mini" class="del-btn" @click="deleteAnswer(index)">{{$t('common.delete')}}</el-button>
                </div>
                <div v-if="!innerForm.questionnaireAnswerList.length" class="no-data">{{$t('common.noData')}}</div>
              </div>
            </span>
          </el-form>
        </div>
        <div slot="footer">
          <el-button type="primary" size="small" @click="addQuestion('innerForm')">
            {{$t('common.buttonText.confirm')}}
          </el-button>
          <el-button type="danger" size="small" @click="innerVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" v-show="active === 1" @click="active--">{{$t('newProduct.questionnaire.backTip')}}</el-button>
        <el-button type="primary" size="small" v-show="active === 0" @click="active++">{{$t('newProduct.questionnaire.nextTip')}}</el-button>
        <el-button type="primary" size="small" v-show="active===1" :loading="confirmLoading"
                   @click="confirmAdd('dialogForm', dialogType === 'add' ? 1 : 2)">
          {{$t('common.buttonText.save')}}
        </el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="detailVisible" :title="$t('newProduct.questionnaire.detail')" width="840px" center :close-on-click-modal="false">
      <el-form :model="detailForm" label-width="145px" label-position="left" size="small">
        <div class="fieldset">{{$t('newProduct.questionnaire.basic')}}</div>
        <el-form-item :label="$t('newProduct.questionnaire.name')" prop="questionnaireName">
          <el-input v-model="detailForm.questionnaireName" disabled placeholder="name" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('product.product.productName')" prop="productNewBId">
          <el-select v-model="detailForm.productNewBId" disabled placeholder="search new product" class="form-dialog-width">
            <el-option v-for="(item, index) in productList" :label="isZh?item.cnProductName:item.enProductName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('newProduct.questionnaire.beginTime')" prop="startTime">
          <el-date-picker
            v-model="detailForm.beginTime"
            type="datetime"
            disabled
            class="form-dialog-width"
            placeholder="start date">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('newProduct.questionnaire.endTime')" prop="endTime">
          <el-date-picker
            v-model="detailForm.endTime"
            type="datetime"
            disabled
            class="form-dialog-width"
            placeholder="end date">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('common.status')" style="border-bottom: 1px solid #eee" prop="questionnaireStatus">
          {{ detailForm.questionnaireStatus | statusFilter(language === 'zh') }}
        </el-form-item>

        <div class="fieldset">{{$t('newProduct.questionnaire.infoData')}}</div>
        <div class="question-set">
          {{$t('newProduct.questionnaire.viewImgTip')}}
          <svg-icon class-name="svgClass" style="margin: 0 20px" icon-class="view" size="26" @click.native="openPreview" />
        </div>
        <div class="question" v-if="questionList1.length" style="overflow: auto;max-height: 400px">
          <div class="question-item" v-for="(item,index) in questionList1" :key="index">
            <div class="question-item-box">{{index+1}}、</div>
            <div class="question-item-label">{{item.questionContent}}</div>
            <div class="question-item-content">
              <el-radio-group size="medium" value="" v-if="Number(item.questionType) === 1" disabled style="width: 100%;">
                <el-radio :label="item1.optionNo" v-for="(item1,index1) in item.questionnaireAnswerList" :key="index1">{{item1.optionNo}}、{{item1.options}}</el-radio>
              </el-radio-group>
              <el-checkbox-group size="medium" value="" v-if="Number(item.questionType) === 2" disabled>
                <el-checkbox :label="item1.optionNo" v-for="(item1,index1) in item.questionnaireAnswerList" :key="index1">{{item1.optionNo}}、{{item1.options}}</el-checkbox>
              </el-checkbox-group>
              <el-input
                v-if="Number(item.questionType) === 3"
                type="textarea"
                disabled
                :autosize="{ minRows: 4, maxRows: 6}"
                :placeholder="$t('newProduct.questionnaire.writeMaxLength')">
              </el-input>
            </div>
          </div>
        </div>
        <div v-else class="question no-data">{{$t('common.noData')}}</div>
      </el-form>

      <el-dialog
        width="60%"
        style="margin-top: -8vh"
        :title="$t('newProduct.questionnaire.reviewData')"
        center
        :close-on-click-modal="false"
        :visible.sync="previewVisible"
        append-to-body>
        <div style="text-align: center">
          <el-radio-group v-model="tabName" class="tab-btn">
            <el-radio-button label="PC">PC</el-radio-button>
            <el-radio-button label="APP">APP</el-radio-button>
          </el-radio-group>
        </div>
        <div class="preview-content">
          <div class="pc-preview" v-show="tabName === 'PC'">
            <div class="preview-image" v-if="detailForm.imagePath"><img :src="fullUrl(detailForm.imagePath)" alt=""></div>
            <div class="preview-box">
              <p>{{detailForm.incentiveText}}</p>
              <div class="preview-title">{{$t('newProduct.questionnaire.infoData')}}</div>
              <div class="question">
                <div class="question-item" v-for="(item,index) in questionList1" :key="index">
                  <div class="question-item-box">{{index+1}}、</div>
                  <div class="question-item-label">{{item.questionContent}}:</div>
                  <div class="question-item-content">
                    <el-radio-group size="medium" value="" v-if="Number(item.questionType) === 1" disabled style="width: 100%;">
                      <el-radio :label="item1.optionNo" v-for="(item1,index1) in item.questionnaireAnswerList" :key="index1">{{item1.optionNo}}、{{item1.options}}</el-radio>
                    </el-radio-group>
                    <el-checkbox-group size="medium" value="" v-if="Number(item.questionType) === 2" disabled>
                      <el-checkbox :label="item1.optionNo" v-for="(item1,index1) in item.questionnaireAnswerList" :key="index1">{{item1.optionNo}}、{{item1.options}}</el-checkbox>
                    </el-checkbox-group>
                    <el-input
                      v-if="Number(item.questionType) === 3"
                      type="textarea"
                      disabled
                      :autosize="{ minRows: 4, maxRows: 6}"
                      :placeholder="$t('newProduct.questionnaire.writeMaxLength')">
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="app-preview" v-show="tabName === 'APP'">
            <div class="preview-image" v-if="detailForm.imagePath"><img :src="fullUrl(detailForm.imagePath)" alt=""></div>
            <div class="preview-box">
              <p>{{detailForm.incentiveText}}</p>
              <div class="preview-title">{{$t('newProduct.questionnaire.infoData')}}</div>
              <div class="question" v-for="(item,index) in questionList1" :key="index">
                <div class="question-item">
                  <div class="question-item-box">{{index+1}}、</div>
                  <div class="question-item-app-label">{{item.questionContent}}:</div>
                </div>
                <div class="question-item-app-content">
                  <el-radio-group size="medium" value="" v-if="Number(item.questionType) === 1" disabled style="width: 100%;">
                    <el-radio :label="item1.optionNo" v-for="(item1,index1) in item.questionnaireAnswerList" :key="index1">{{item1.optionNo}}、{{item1.options}}</el-radio>
                  </el-radio-group>
                  <el-checkbox-group size="medium" value="" v-if="Number(item.questionType) === 2" disabled>
                    <el-checkbox :label="item1.optionNo" v-for="(item1,index1) in item.questionnaireAnswerList" :key="index1">{{item1.optionNo}}、{{item1.options}}</el-checkbox>
                  </el-checkbox-group>
                  <el-input
                    v-if="Number(item.questionType) === 3"
                    type="textarea"
                    disabled
                    :autosize="{ minRows: 4, maxRows: 6}"
                    :placeholder="$t('newProduct.questionnaire.writeMaxLength')">
                  </el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <el-button type="danger" size="small" @click="previewVisible=false">{{$t('common.buttonText.close')}}</el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="totalVisible" :title="$t('newProduct.questionnaire.questionTotal')" width="840px" center :close-on-click-modal="false">
      <el-form :model="detailForm" label-width="145px" label-position="left" size="small">
        <div class="fieldset">{{$t('newProduct.questionnaire.basic')}}</div>
        <el-form-item :label="$t('newProduct.questionnaire.name')" prop="questionnaireName">
          <el-input v-model="detailForm.questionnaireName" disabled class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('product.product.productName')" prop="productNewBId">
          <el-select v-model="detailForm.productNewBId" disabled class="form-dialog-width">
            <el-option v-for="(item, index) in productList" :label="isZh?item.cnProductName:item.enProductName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('newProduct.questionnaire.beginTime')" prop="startTime">
          <el-date-picker
            v-model="detailForm.beginTime"
            type="datetime"
            disabled
            class="form-dialog-width"
            placeholder="start date">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('newProduct.questionnaire.endTime')" prop="endTime">
          <el-date-picker
            v-model="detailForm.endTime"
            type="datetime"
            disabled
            class="form-dialog-width"
            placeholder="end date">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('common.status')" style="border-bottom: 1px solid #eee" prop="questionnaireStatus">
          {{ detailForm.questionnaireStatus | statusFilter(language === 'zh') }}
        </el-form-item>

        <div class="fieldset">{{$t('newProduct.questionnaire.questionResult')}}</div>
        <div class="question-set">
            <el-radio-group v-model="tabTotal" class="tab-btn">
              <el-radio-button label="1">{{$t('newProduct.questionnaire.chart')}}</el-radio-button>
              <el-radio-button label="2">{{$t('newProduct.questionnaire.table')}}</el-radio-button>
            </el-radio-group>
        </div>
        <div class="total-result">
          <div class="chart-total" v-show="tabTotal === '1'">
            <div>
              {{$t('newProduct.questionnaire.selectQuestion')}}：
              <el-select v-model="questionBId" placeholder="select question" @change="getQuestion">
                <el-option v-for="(item, index) in questionList1" :label="item.questionContent" :value="item.bid" :key="index"></el-option>
              </el-select>
            </div>
            <div class="chart-box">
              <pie-chart :chart-data="chartData" />
            </div>
          </div>
          <div class="table-total" v-show="tabTotal === '2'">
            <el-table
              type="expand"
              border
              fit
              size="mini"
              :span-method="arraySpanMethod"
              :data="questionList1"
              :header-cell-style="{background: '#a7bfee'}">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <div class="table-expand" v-for="(item, childIndex) in props.row.questionnaireAnswerList" :key="childIndex">
                    <div class="expand-box"></div>
                    <div class="table-flex">
                      <div></div>
                      <div>{{item.options}}</div>
                      <div>{{item.choicesNum}}</div>
                      <div>{{item.proportion}}%</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('newProduct.questionnaire.questionData')" prop="questionContent">
              </el-table-column>
              <el-table-column
                align="center"
                :label="$t('newProduct.questionnaire.answerOptions')"
                prop="answerContent">
              </el-table-column>
              <el-table-column
                align="center"
                :label="$t('newProduct.questionnaire.quantity')"
                prop="choicesNum">
              </el-table-column>
              <el-table-column
                align="center"
                :label="$t('newProduct.questionnaire.proportion')"
                prop="proportion">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="totalVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import PieChart from './components/PieChart'
import { parseTime, deepClone } from '@/utils/index'
import { uploadActionUrl } from '@/api/common'
import {
  getQuestionnaireList,
  deleteBatchQuestionnaire,
  addQuestionnaire,
  updateQuestionnaire,
  getQuestionnaireDetail,
  getNewProductList,
  changeQuestionnaireStatus,
  exportEasypoi
} from '@/api/newProduct'
export default {
  components: {
    Pagination,
    PieChart
  },
  data() {
    return {
      uploadActionUrl,
      listLoading: true,
      dialogVisible: false,
      innerVisible: false,
      detailVisible: false,
      totalVisible: false,
      previewVisible: false,
      confirmLoading: false,
      rangeTime: [],
      active: 0,
      tabName: 'PC',
      tabTotal: '1',
      dialogType: '',
      questionType: 1,
      questionBId: '',
      chartData: {
        questionData: [],
        choiceData: []
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        productName: '',
        questionnaireName: '',
        questionnaireStatus: '',
        beginTime: '',
        emdTime: ''
      },
      selectList: [],
      productList: [],
      questionList: [],
      questionList1: [],
      delQuestionList: [],
      dataList: [],
      detailForm: {},
      dialogForm: {
        productName: '',
        questionnaireName: '',
        questionnaireStatus: 1,
        beginTime: '',
        endTime: '',
        imagePath: '',
        imageUuid: '',
        imgeName: '',
        incentiveText: '',
        productNewBId: '',
        productEnName: '',
        productCnName: ''
      },
      dialogFormRules: {
        questionnaireName: [{ required: true, message: this.$t('newProduct.questionnaire.nameTip'), trigger: 'blur' }],
        productNewBId: [{ required: true, message: this.$t('newProduct.questionnaire.productTip'), trigger: 'change' }],
        beginTime: [{ required: true, message: this.$t('newProduct.questionnaire.startDateTip'), trigger: 'change' }],
        endTime: [{ required: true, message: this.$t('newProduct.questionnaire.endDateTip'), trigger: 'change' }],
        incentiveText: [{ required: true, message: this.$t('newProduct.questionnaire.incentiveTip'), trigger: 'blur' }]
      },
      letter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      innerForm: {
        questionType: 1,
        questionContent: '',
        operatingState: 1,
        questionSort: null,
        questionnaireAnswerList: []
      },
      innerFormRules: {
        questionContent: [{ required: true, message: this.$t('newProduct.questionnaire.titleTip'), trigger: 'blur' }]
      },
      statusList: [
        // 问卷状态 (1- 不可用, 2 -可用 , 3 - 完成)
        {
          labelZh: '全部',
          label: 'All',
          id: ''
        },
        {
          labelZh: '禁用中',
          label: 'Disabled',
          id: 1
        },
        {
          labelZh: '使用中',
          label: 'Enabled',
          id: 2
        },
        {
          labelZh: '完成',
          label: 'Finished',
          id: 3
        }
      ],
      pickerOptionsStart1: {
        disabledDate: (time) => {
          if (this.postData.endTime) {
            return time.getTime() > this.postData.endTime;
          }
        }
      },
      pickerOptionsEnd1: {
        disabledDate: (time) => {
          if (this.postData.beginTime) {
            return time.getTime() < this.postData.beginTime
          }
        }
      },
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.dialogForm.endTime) {
            return time.getTime() > this.dialogForm.endTime;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.dialogForm.beginTime) {
            return time.getTime() < this.dialogForm.beginTime
          }
        }
      }
    }
  },
  watch: {
    isZh() {
      this.innerFormRules = {
        questionContent: [{ required: true, message: this.$t('newProduct.questionnaire.titleTip'), trigger: 'blur' }]
      };
      this.dialogFormRules = {
        questionnaireName: [{ required: true, message: this.$t('newProduct.questionnaire.nameTip'), trigger: 'blur' }],
        productNewBId: [{ required: true, message: this.$t('newProduct.questionnaire.productTip'), trigger: 'change' }],
        beginTime: [{ required: true, message: this.$t('newProduct.questionnaire.startDateTip'), trigger: 'change' }],
        endTime: [{ required: true, message: this.$t('newProduct.questionnaire.endDateTip'), trigger: 'change' }],
        incentiveText: [{ required: true, message: this.$t('newProduct.questionnaire.incentiveTip'), trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getDataList();
    this.getNewProductList()
  },
  methods: {
    // 导出操作
    exportExcelByEasypoiFun() {
      let obj = {
        pageNum: '',
        pageSize: '',
        productName: this.postData.productName,
        questionnaireName: this.postData.questionnaireName,
        questionnaireStatus: this.postData.questionnaireStatus,
        beginTime: this.postData.beginTime,
        emdTime: this.postData.emdTime
      };
      exportEasypoi(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        if (this.isZh) {
          link.setAttribute('download', '调查问卷管理.xlsx')
        } else {
          link.setAttribute('download', 'QuestionnaireBasic.xlsx')
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    clearData() {
      if (this.dialogType === 'edit') {
        this.dialogForm = {
          productName: '',
          questionnaireName: '',
          questionnaireStatus: 1,
          beginTime: '',
          endTime: '',
          imagePath: '',
          imageUuid: '',
          imgeName: '',
          incentiveText: '',
          productNewBId: ''
        };
        this.questionList = []
      }
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.beginTime = date[0];
        this.postData.endTime = date[1]
      } else {
        this.postData.beginTime = '';
        this.postData.endTime = ''
      }
    },
    openDialog(type, row) {
      this.active = 0;
      this.dialogType = type;
      if (type === 'edit') {
        getQuestionnaireDetail({ questionBId: row.bid, type: 1 }).then(res => {
          this.dialogForm = Object.assign(this.dialogForm, res.data);
          this.questionList = res.data.questionnaireQuestionVoList.map((e, index) => {
            e.operatingState = 0;
            e.questionSort = index + 1;
            return { ...e }
          });
          this.dialogVisible = true;
        }).catch(err => {
          this.$message.error(err.message)
        });
      } else {
        this.dialogVisible = true;
      }
    },
    goDetail(id, type) {
      this.delQuestionList = [];
      getQuestionnaireDetail({ questionBId: id, type: type }).then(res => {
        this.detailForm = Object.assign(this.detailForm, res.data);
        if (type === 1) {
          this.detailVisible = true;
          this.questionList1 = res.data.questionnaireQuestionVoList.map(e => e);
        } else {
          this.totalVisible = true;
          this.questionList1 = res.data.questionnaireQuestionVoList.filter(e => e.questionType !== 3).map(e => {
            return { ...e }
          });
          if (this.questionList1.length) {
            this.setChartData(this.questionList1[0]);
            this.questionBId = this.questionList1[0].bid
          }
        }
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getQuestion(val) {
      if (val) {
        let obj = this.questionList1.filter(e => e.bid === val)[0];
        this.setChartData(obj)
      }
    },
    setChartData(data) {
      this.chartData.questionData = data.questionContent;
      this.chartData.choiceData = data.questionnaireAnswerList.map(e => {
        return {
          value: e.choicesNum,
          name: e.options,
          optionNo: e.optionNo
        }
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return [1, 4];
      } else if (columnIndex > 1 && columnIndex < 4) {
        return [0, 0]
      }
    },
    openInnerDialog(type, item) {
      if (type === 1) {
        this.innerForm.questionType = this.questionType;
        this.innerForm.questionSort = Math.max.apply(null, this.questionList.map(e => Number(e.questionSort)));
      } else {
        this.innerForm = deepClone(item);
        this.innerForm.operatingState = this.innerForm.operatingState === 1 ? this.innerForm.operatingState : type;
      }
      this.innerVisible = true;
    },
    // 新增答案
    addAnswer() {
      this.innerForm.questionnaireAnswerList.push({ optionNo: '', options: '', answerContent: '', questionType: this.questionType });
      this.innerForm.questionnaireAnswerList.map((e, index) => {
        e.optionNo = this.letter[index];
        return { ...e }
      })
    },
    deleteAnswer(index) {
      this.innerForm.questionnaireAnswerList.splice(index, 1);
      this.innerForm.questionnaireAnswerList.map((e, index) => {
        e.optionNo = this.letter[index];
        return { ...e }
      })
    },
    addQuestion(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.innerForm.questionnaireAnswerList.length < 2 && this.innerForm.questionType !== 3) {
            return this.$message.warning(this.$t('newProduct.questionnaire.answerTip'))
          }
          let len = this.innerForm.questionnaireAnswerList.length;
          for (let i = 0; i < len; i++) {
            if (!this.innerForm.questionnaireAnswerList[i].options) {
              return this.$message.warning(this.$t('newProduct.questionnaire.optionTip'))
            }
          }
          if (this.innerForm.id) {
            let index = this.questionList.findIndex(e => e.id === this.innerForm.id);
            this.questionList.splice(index, 1, this.innerForm)
          } else {
            this.questionList.push(deepClone(this.innerForm));
          }
          this.innerVisible = false;
        }
      })
    },
    deleteQuestion(item, index) {
      let obj = this.questionList.splice(index, 1)[0];
      if (obj.operatingState !== 1) {
        obj.operatingState = 3;
        this.delQuestionList.push(obj);
      }
    },
    clearInnerData() {
      this.innerForm = {
        questionType: 1,
        operatingState: 1,
        questionContent: '',
        questionnaireAnswerList: []
      };
    },
    openPreview() {
      this.previewVisible = true
    },
    getProductName(val) {
      if (val) {
        let obj = this.productList.filter(e => e.bid === val)[0];
        this.dialogForm.productCnName = obj.cnProductName;
        this.dialogForm.productEnName = obj.enProductName
      } else {
        this.dialogForm.productCnName = '';
        this.dialogForm.productEnName = ''
      }
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      getQuestionnaireList(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    getNewProductList() {
      getNewProductList().then(res => {
        this.productList = res.data || []
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    changeStatus(row) {
      changeQuestionnaireStatus({ id: row.id }).then(res => {
        this.$message.success(this.$t('common.tip.operation'));
        this.getDataList()
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    deleteModal() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t('common.tip.selectDataTip'));
      } else {
        for (let i = 0; i < this.selectList.length; i++) {
          if (this.selectList[i].questionnaireStatus === 2) {
            return this.$message.warning(this.language === 'zh' ? '正在使用中,无法删除' : 'In use and cannot be removed')
          }
        }
      }
      this.$confirm(this.$t('common.tip.deletData'), this.$t('common.tip.tip'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        let obj = {
          ids: this.selectList.map(e => e.id).join(',')
        };
        deleteBatchQuestionnaire(obj).then(res => {
          this.getDataList();
          this.$message.success(this.$t('common.tip.deleteTip'));
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("system.userManage.cancel")
        });
      });
    },
    moveOne(arr, index, move) {
      if (index === 0 && move === 1) {
        return false
      } else if (index === arr.length - 1 && move === -1) {
        return false
      } else {
        arr[index].questionSort = arr[index - move].questionSort;
        arr[index - move].questionSort = arr[index].questionSort;
        arr[index].operatingState = arr[index].operatingState !== 1 ? 2 : 1;
        arr[index - move].operatingState = arr[index - move].operatingState !== 1 ? 2 : 1;
        arr[index] = deepClone(arr.splice(index - move, 1, arr[index])[0]);
      }
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects
    },
    handleAvatarSuccess(res, file) {
      this.dialogForm.imagePath = res.data.filePath;
      this.dialogForm.imgeName = file.name;
      this.dialogForm.imageUuid = res.data.UUID
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error(this.$t('product.tip.imgTypeTip'));
      }
      if (!isLt3M) {
        this.$message.error(this.$t('product.tip.imgSizeLength'));
      }
      return isJPG && isLt3M;
    },
    confirmAdd(formName, type) {
      if (!this.questionList.length) {
        return this.$message.warning(this.$t('newProduct.questionnaire.questionTip'));
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          let api = type === 1 ? addQuestionnaire : updateQuestionnaire;
          this.questionList.forEach((e, index) => {
            e.questionSort = index + 1
          });
          this.dialogForm.questionnaireQuestionFormList = this.questionList.concat(this.delQuestionList);
          api(this.dialogForm).then(res => {
            this.$message.success(type === 1 ? this.$t('common.tip.saveTip') : this.$t('common.tip.updateTip'));
            this.$refs[formName].resetFields();
            this.getDataList();
            this.dialogVisible = false;
            this.confirmLoading = false;
            this.delQuestionList = [];
          }).catch(err => {
            this.listLoading = false;
            this.confirmLoading = false;
            this.$message.error(err.message)
          });
        } else {
          this.$message.warning(this.$t('common.tip.isdataFill'));
          return false;
        }
      });
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    statusFilter(val, flag) {
      switch (val) {
        case 1: return flag ? '禁用中' : 'Active';
        case 2: return flag ? '启用中' : 'Disabled';
        case 3: return flag ? '完成' : 'Finished';
        default: return ''
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';

  .questionnaire {
    .fieldset {
      line-height: 36px;
      font-weight: 700;
      color: #3f51b5;
      border-bottom: 1px solid $border-light-color;
      margin-bottom: 16px;
    }
    .question-set {
      margin: 10px 0;
      text-align: right;
      font-size: 12px;
      line-height: 24px;
    }
    .total-result {
      margin: 10px 0;
      border: 1px dashed #ccc;
      padding: 16px;
      .chart-box {
        padding-top: 16px;
        width: 100%;
      }
    }
    .question {
      border: 1px dashed #ccc;
      padding: 5px;
      .question-item {
        border-bottom: 1px dashed #ccc;
        display: flex;
        display: -webkit-flex;
        min-height: 60px;
        cursor: pointer;
        &-box {
          width: 50px;
          padding: 5px;
          text-align: center;
        }
        &-label {
          padding: 5px;
          width: 150px;
          display: flex;
          display: -webkit-flex;
        }
        &-content {
          flex: 1;
          padding: 5px;
          .el-checkbox,.el-radio {
            width: 45%;
            margin: 5px 0;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        &-action {
          width: 120px;
          padding-top: 10px;
          text-align: center;
        }
      }
      .question-item:hover {
        background: #F5F5F5;
      }
    }
    .order-step {
      padding-top: 25px;
      .el-steps--horizontal {
        padding-top: 20px;
      }
      .el-step.is-horizontal .el-step__line {
        top: 17px;
        border-color: #8c97d3 !important;
      }
      .el-step__icon {
        width: 36px;
        height: 36px;
        cursor: pointer;
      }
      .el-step__icon-inner {
        color: white;
      }
      .el-step__title {
        position: absolute;
        top: -25px;
        text-align: center;
        width: 100%;
        font-size: 12px;
        line-height: 1.15rem;
        color: #2f4be1 !important;
        font-weight: bold;
      }
      .el-step__description {
        margin-top: 5px;
        color: #2f4be1 !important;
        font-weight: bold;
      }
      .is-finish {
        .el-step__icon {
          background: #3f51b5 !important;
          border-color: #3f51b5;
        }
      }
      .is-wait {
        .el-step__icon {
          background: #e3e4e8 !important;
          border-color: #e3e4e8;
        }
      }
      .is-process {
        .el-step__icon {
          background: #3f51b5 !important;
          border-color: #3f51b5;
        }
      }
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .svgClass {
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
    .table-expand {
      display: -webkit-flex;
      display: flex;
      width: 100%;
      .expand-box {
        width: 48px;
        line-height: 32px;
        text-align: center;
        padding: 0 10px;
      }
      .table-flex {
        display: -webkit-flex;
        display: flex;
        width: 100%;
        font-size: 12px;
        >div {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 0 10px;
          word-wrap: break-word;
          word-break: normal;
          line-height: 32px;
        }
      }
    }
    .table-expand + .table-expand {
      border-top: 1px solid $border-light-color;
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0 !important;
    }
    .table-expand-border {
      border-right: none;
    }
  }
  .inner-dialog {
    .answer {
      display: flex;
      display: -webkit-flex;
      flex-wrap: wrap;
      justify-content: space-between;
      border-top: 1px solid $border-light-color;

      &-item {
        margin: 10px;
        width: 45%;
        display: -webkit-flex;
        display: flex;
        .del-btn {
          margin: 0 5px;
        }
      }
    }
  }
  .tab-btn {
    width: 100%;
    .el-radio-button__inner {
      width: 80px;
    }
  }
  .preview-content {
    margin: 10px 0;
    >div {
      border: 1px solid $border-light-color;
      margin: 0 auto;
    }
    .pc-preview {
      width: 80%;
      max-height: 550px;
    }
    .app-preview {
      width: 360px;
      max-height: 550px;
      overflow: auto;
      font-size: 12px;
    }
    .pc-preview::-webkit-scrollbar {
      display: none;
    }
    .app-preview::-webkit-scrollbar {
      display: none;
    }
    .preview-image {
      width: 100%;
      height: 140px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .preview-box {
      padding: 5px 10px 20px;
      p {
        color: #e51c23;
        line-height: 1.3rem;
      }
      .preview-title {
        line-height: 36px;
        font-weight: 700;
        color: #3f51b5;
        border-bottom: 1px solid $border-light-color;
        margin-bottom: 16px;
        padding-left: 20px;
      }
      .question {
        .question-item {
          display: flex;
          display: -webkit-flex;
          cursor: pointer;
          &-box {
            width: 50px;
            padding: 5px;
            text-align: center;
          }
          &-label {
            padding: 5px;
            width: 150px;
            display: flex;
            display: -webkit-flex;
          }
          &-app-label {
            padding: 5px;
            display: flex;
            display: -webkit-flex;
          }
          &-content {
            flex: 1;
            padding: 5px;
           .el-radio {
              width: 33%;
              margin: 5px 0;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .el-checkbox {
              width: 45%;
              margin: 5px 0;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          &-app-content {
            width: 100%;
            padding: 5px 5px 5px 55px;
            .el-radio {
              width: 100%;
              margin: 5px 0;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .el-checkbox {
              width: 100%;
              margin: 5px 0;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
</style>
