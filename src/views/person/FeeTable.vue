<template>
  <!-- 这个显示表单区域 -->
  <div class="base_form">
    <!-- 头部区域 页面标题 -->
    <div class="base_header">
      <div class="blue_column"></div>
      <div class="base_title">消费管理</div>
    </div>
    <!-- 查询区域 -->
    <div class="base_query_oneLine" style="width: 97%">
      <!-- 左边操作按钮组 -->
      <div class="query_left">
        <el-button class="commButton" @click="addItem()">添加</el-button>
      </div>
      <!-- 右边查询组 -->
      <div class="query_right">
        <el-input v-model="numName">学号或姓名</el-input>
        <el-button class="commButton" @click="doQuery()">查询</el-button>
        <el-button class="commButton" @click="doExport()">导出</el-button>
      </div>
    </div>
    <!-- 日志数据表格区域  基于el-table ,可方便实现分页数据展现-->
    <div class="table-content">
      <el-table
        :data="dataList"
        :header-cell-style="{
          color: '#2E2E2E',
          fontSize: '10px',
          fontWeight: '400',
          background: 'rgb(242,242,242)',
        }"
        :row-style="{ height: '10px' }"
        :cell-style="{ padding: '2px' }"
        style="width: 100%"
      >
        <el-table-column label="序号" fixed="left" width="50" color="black">
          <template v-slot="scope">
            {{ scope.$index + 1 }}



          </template>
        </el-table-column>
        <el-table-column label="学号" color="black" align="center" width="100">
          <template v-slot="scope">
            {{ scope.row.num }}

          </template>
        </el-table-column>
        <el-table-column label="姓名" color="black" align="center" width="100">
          <template v-slot="scope">
            {{ scope.row.name }}


          </template>
        </el-table-column>
        <el-table-column label="消费" color="black" align="center" width="100">
          <template v-slot="scope">
            {{ scope.row.cost }}
          </template>
        </el-table-column>
        <el-table-column label="日期" color="black" align="center">
          <template v-slot="scope">
            {{ scope.row.day }}
          </template>
        </el-table-column>
        <el-table-column label="余额" color="black" align="center">
          <template v-slot="scope">
            {{ scope.row.money }}

          </template>
        </el-table-column>
        <el-table-column label="操作" color="black" align="center" width="260">
          <template v-slot="scope">
            <el-button class="commButton" @click="editItem(scope.row.feeId)"
              >基本信息</el-button
            >
            <el-button
              class="commButton"
              @click="deleteItem(scope.row.feeId)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页区域 -->
    <div class="pagin">
      <el-pagination
        background
        style="margin-top: 15px"
        :total="pagination.dataTotal"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        @current-change="handleChangePage"
        layout="total, prev, pager, next, jumper"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { downloadPost } from "@/services/genServ";
import { getFeePageData, feeDelete } from "@/services/personServ";
import { type FeeItem } from "@/models/general";
import { message, messageConform } from "@/tools/messageBox";
import router from "@/router";

export default defineComponent({
  data: () => ({
    numName: "",
    dataList: [] as FeeItem[],
    pagination: {
      currentPage: 1,
      pageSize: 10,
      dataTotal: 0,
    },
  }),
  created() {
    this.getDataPage();
  },
  methods: {
    // 查询请求
    doQuery() {
      this.pagination.currentPage = 1;
      this.getDataPage();
    },
    // 分页请求
    handleChangePage(val: number) {
      this.pagination.currentPage = val;
      this.getDataPage();
    },
    // 获取分页数据
    async getDataPage() {
      const res = await getFeePageData(
        this.numName,
        this.pagination.currentPage
      );
      this.pagination.dataTotal = res.data.dataTotal;
      this.pagination.pageSize = res.data.pageSize;
      this.dataList = res.data.dataList;
    },
    // 添加日志,进入日志信息页面
    addItem() {
      router.push({ path: "/FeeInfo" });
    },
    // 编辑日志,进入日志信息页面
    editItem(feeId: number) {
      router.push({
        path: "/FeeInfo",
        // 传递参数
        query: { feeId: feeId },
      });
    },
    // 删除日志
    async deleteItem(feeId: number) {
      const result = await messageConform("确认删除日志吗?");
      if (!result) {
        return;
      }
      const res = await feeDelete(feeId);
      if (res.code == 0) {
        message(this, "删除成功");
      } else {
        message(this, res.msg);
      }
    },
    // 进入日志家庭成员页面
    familyMember(feeId: number) {
      router.push({
        path: "/FamilyMember",
        query: { feeId: feeId },
      });
    },
    // 导出日志信息
    async doExport() {
      const res = await downloadPost(
        "/api/fee/getFeeListExcl",
        "日志.xlsx",
        {
          numName: this.numName,
        }
      );
      if (res != 200) {
        message(this, "导出失败！");
      }
    },
  },
});
</script>
