<template>
  <div class="base_form">
    <div class="base_header">
      <div class="blue_column"></div>
      <div class="base_title">消费信息</div>
    </div>
    <div class="form-div" style="margin-top: 5px">
      <table class="content">

        <tr>
          <td colspan="1" style="text-align: right">学号</td>
          <td colspan="1"><input v-model="form.num" style="width: 97%" /></td>
        </tr>
        <tr>
          <td colspan="1" style="text-align: right">姓名</td>
          <td colspan="1"><input v-model="form.name" style="width: 97%" /></td>
        </tr>

        <tr>
          <td colspan="1" style="text-align: right">消费</td>
          <td colspan="1">
            <input v-model="form.cost" style="width: 97%" />
          </td>
        </tr>


        <tr>
          <td colspan="1" style="text-align: right">日期</td>
          <td colspan="1">
            <el-date-picker
                v-model="form.day"
                size="mini"
              type="date"
              style="width: 100%"
              @change="handleDateChange"
                placeholder="选择日期"
            />
          </td>
        </tr>
        <tr>
          <td colspan="1" style="text-align: right">余额</td>
          <td colspan="1">
            <input v-model="form.money" style="width: 97%" />
          </td>
        </tr>



        <tr>
          <td colspan="2">
            <button class="commButton" @click="submit">提交</button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
import { getDictionaryOptionItemList } from '@/services/systemServ'
import { getFeeInfo, feeEditSave } from '@/services/personServ'
import { defineComponent } from 'vue'
import router from '@/router'
import { type OptionItem, type FeeItem } from '@/models/general'
import { getOptionItem } from '@/tools/comMethod'
import {getStudentItemOptionList} from "@/services/teachingServ";

export default defineComponent({
  //数据
  data: () => ({
    valid: false,
    feeId: null as number | null,
    form: {} as FeeItem,
    gender: {} as OptionItem,
    genderList: [] as OptionItem[],
    nameRules: [],
    emailRules: [],
    studentList: [] as OptionItem[],
  }),
  //页面加载方法, 获取性别选择列表,获取学生信息,注意async和await的使用
  async created() {
    //获取获取路由参数,上一个页面传过来的学生id
    const res = this.$route.query.feeId
    if (res != null) {
      this.feeId = parseInt(res.toString())
    }
    this.genderList = await getDictionaryOptionItemList('XBM')
    if (this.feeId != null) {
      this.form = await getFeeInfo(this.feeId)
      this.gender = getOptionItem(this.genderList, this.form.gender)
    }
  },
  mounted() {
    this.initialize()
  },
  methods: {
    handleDateChange(value: Date) {
    const localDate = new Date(value.getTime() - value.getTimezoneOffset() * 60000); // 修正时区偏移
    this.form.day = localDate.toISOString().split('T')[0];
  },
    async initialize() {
      this.studentList = await getStudentItemOptionList()
    },

    //提交表单
    async submit() {
      //      this.form.gender = this.gender.value;
      const res = await feeEditSave(this.feeId, this.form)
      if (res.code == 0) {
        router.push('fee-panel')
      } else {
        alert(res.msg)
      }
    }
  }
})
</script>
