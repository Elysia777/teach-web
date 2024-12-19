<template>
    <div class="base_form">
      <div class="base_header">
        <div class="blue_column"></div>
        <div class="base_title">活动信息</div>
      </div>
      <div class="form-div" style="margin-top: 5px">
        <table class="content">
          <tr>
            <td colspan="1" style="text-align: right">活动名称</td>
            <td colspan="1"><input v-model="form.activityName" style="width: 97%" /></td>
          </tr>
          <tr>
            <td colspan="1" style="text-align: right">活动类型</td>
            <td colspan="1"><input v-model="form.type" style="width: 97%" /></td>
          </tr>
          <tr>
            <td colspan="1" style="text-align: right">活动日期</td>
            <td colspan="1">
              <el-date-picker
                v-model="form.date"
                size="mini"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </td>
          </tr>
          <tr>
            <td colspan="1" style="text-align: right">活动时间</td>
            <td colspan="1"><input v-model="form.time" style="width: 97%" /></td>
          </tr>
          <tr>
            <td colspan="1" style="text-align: right">组织单位</td>
            <td colspan="1"><input v-model="form.organizer" style="width: 97%" /></td>
          </tr>
          <tr>
            <td colspan="1" style="text-align: right">人数名额</td>
            <td colspan="1"><input v-model="form.people" style="width: 97%" /></td>
          </tr>
          
          
          <tr>
            <td colspan="1" style="text-align: right">剩余名额</td>
            <td colspan="1"><input v-model="form.remainPeople" style="width: 97%" /></td>
          </tr>
          <tr>
            <td colspan="1" style="text-align: right">活动地点</td>
            <td colspan="1"><input v-model="form.activityAddress" style="width: 97%" /></td>
          </tr>
          <tr>
            <td colspan="1" style="text-align: right">活动费用</td>
            <td colspan="1">
              <input v-model="form.enrollFee" style="width: 97%" />
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
  import { getActivityInfo, activityEditSave } from '@/services/activityServ'
  import { defineComponent } from 'vue'
  import router from '@/router'
  import { type OptionItem, type StudentItem, type ActivityItem} from '@/models/general'
  import { getOptionItem } from '@/tools/comMethod'
  
  export default defineComponent({
    //数据
    data: () => ({
      valid: false,
      activityId: null as number | null,
      form: {} as ActivityItem,
      gender: {} as OptionItem,
      genderList: [] as OptionItem[],
      nameRules: [],
      emailRules: []
    }),
    //页面加载方法, 获取性别选择列表,获取活动信息,注意async和await的使用
    async created() {
      //获取获取路由参数,上一个页面传过来的活动id
      const res = this.$route.query.activityId
      if (res != null) {
        this.activityId = parseInt(res.toString())
      }
      
      if (this.activityId != null) {
        this.form = await getActivityInfo(this.activityId)
      }
    },
    methods: {
      //提交表单
      async submit() {
        //      this.form.gender = this.gender.value;
        const res = await activityEditSave(this.activityId, this.form)
        if (res.code == 0) {
          router.push('activity-panel')
        } else {
          alert(res.msg)
        }
      }
    }
  })
  </script>
  