<template>
    <div class="base_form">
      <div class="base_header">
        <div class="blue_column"></div>
        <div class="base_title">活动报名</div>
      </div>
  
      <div class="base_query_oneLine">
        <div class="query_right">
          <span style="margin-top: 5px">活动名称</span>
          <input type="text" v-model="numName" style="margin-left: 10px; width: 230px" />
          <button style="margin-left: 5px" class="commButton" @click="query()">查询</button>
        </div>
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
              <el-button class="commButton" size="mini" @click="editSave(item.activityId)">报名活动</el-button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  
  </template>
  
  <script lang="ts">
  import { type ActivityItem, type OptionItem, type StudentActivityItem,type StudentItem } from '@/models/general'
  import { defineComponent } from 'vue'
  import{ getActivityList ,studentActivityEditSave ,getActivityInfo } from'@/services/activityServ'
  import { getStudentIntroduceData } from '@/services/infoServ'
  import { message, messageConform } from '@/tools/messageBox'
  import router from '@/router'
  export default defineComponent({
    // 双向绑定数据
    data: () => ({
      numName: '',
      activityList: [] as ActivityItem[],
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
       
        this.activityList = await getActivityList(this.numName)
        //console.log("1");
        this.makeSelectActivityList()
        
      },
      //添加活动
      addItem() {
        router.push({ 
          name: 'ActivityInfo'
        })
      },
      
      //报名活动
      async editSave(activityId: number) {
        let res = await getStudentIntroduceData(this.studentId)
        this.info=res.data.info
        this.studentId=this.info.studentId
        this.activityId=activityId
        this.form1 = await getActivityInfo(this.activityId)
        this.form.activityAddress=this.form1.activityAddress
        this.form.activityId=this.form1.activityId
        this.form.activityName=this.form1.activityName
        this.form.date=this.form1.date
        this.form.enrollFee=this.form1.enrollFee
        this.form.num=this.info.num
        this.form.organizer=this.form1.organizer
        this.form.people=this.form1.people
        this.form.remainPeople=this.form1.remainPeople
        this.form.time=this.form1.time
        this.form.type=this.form1.type
        let res1 = await studentActivityEditSave(this.activityId,this.form.studentActivityId,this.form)
        if(res1.data==3){
          message(this, '报名成功')
          this.query()
        }
        else if(res1.data==2){
          message(this, '名额已满')
          this.query()
        }
        else if(res1.data==1){
          message(this, '已报名')
          this.query()
        }
      }
    }
  })
  </script>
  <style></style>
  