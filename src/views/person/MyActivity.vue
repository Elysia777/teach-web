<template>
  <div class="base_form">
    <div class="base_header">
      <div class="blue_column"></div>
      <div class="base_title">我的活动</div>
    </div>

    
    <div class="table_center" style="margin-top: 5px">
      <table class="content">
        <tr class="table_th">
          <td>活动名称</td>
          <td>活动类型</td>
          <td>活动日期</td>
          <td>活动时间</td>
          <td>组织单位</td>
          <td>人数名额</td>
          <td>剩余名额</td>
          <td>活动地点</td>
          <td>活动费用</td>
          <td>操作</td>
        </tr>
        <tr v-for="item in activityList" :key="item.activityId">
          <td>{{ item.activityName }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.time }}</td>
          <td>{{ item.organizer }}</td>
          <td>{{ item.people }}</td>
          <td>{{ item.remainPeople }}</td>
          <td>{{ item.activityAddress }}</td>
          <td>{{ item.enrollFee }}</td>
          <td>
            <el-button class="commButton" size="mini" @click="deleteItem(item.studentActivityId)">退选</el-button>
          </td>
        </tr>
      </table>
    </div>
  </div>

</template>

<script lang="ts">
import { type ActivityItem, type OptionItem, type StudentActivityItem,type StudentItem } from '@/models/general'
import { defineComponent } from 'vue'
import{ getActivityList ,studentActivityEditSave ,getActivityInfo ,getStudentActivityList ,studentActivityDelete } from'@/services/activityServ'
import { getStudentIntroduceData } from '@/services/infoServ'
import { message, messageConform } from '@/tools/messageBox'
import router from '@/router'
export default defineComponent({
  // 双向绑定数据
  data: () => ({
    numName: '',
    activityList: [] as StudentActivityItem[],
    activitySelectList: [] as OptionItem[],
    deleteId: -1,
    studentActivityId: null as number | null,
    studentId: null as number | null,
    activityId: null as number | null,
    form: {} as StudentActivityItem,
    form1:{} as ActivityItem,
    info: {} as StudentItem
  }),
  //初始加载一次,直接获取活动列表
  created() {
    this.query()
  },

  methods: {
    //设置活动选择列表
    makeSelectActivityList() {
      this.activitySelectList = []
      for (let i = 0; i < this.activityList.length; i++) {
        const item = this.activityList[i]
        this.activitySelectList.push({
          id: item.activityId,
          value: item.activityName,
          title: item.activityName
        })
      }
    },
    //查询活动列表
    async query() {
      let res = await getStudentIntroduceData(this.studentId)
      this.info=res.data.info
      this.numName=this.info.num
      this.activityList = await getStudentActivityList(this.numName)
      //console.log("1");
      this.makeSelectActivityList()
      
    },
    //添加活动
    addItem() {
      router.push({ 
        name: 'ActivityInfo'
      })
    },
    
    //退选活动
    async deleteItem(studentActivityId: number) {
      const result = await messageConform('确认退选吗?')
      if (!result) {
        return
      }
      const res = await studentActivityDelete(studentActivityId)
      if (res.code == 0) {
        message(this, '退选成功')
        this.query()
      } else {
        message(this, res.msg)
      }
    }
  }
})
</script>
<style></style>
