<template>
    <div class="base_form">
      <div class="base_header">
        <div class="blue_column"></div>
        <div class="base_title">课程管理</div>
      </div>
  
      <div class="base_query_oneLine">
        <div class="query_right">
          <span style="margin-top: 5px">课程号或课程名</span>
          <input type="text" v-model="numName" style="margin-left: 10px; width: 230px" />
          <button style="margin-left: 5px" class="commButton" @click="query()">查询</button>
        </div>
      </div>
      <div class="table_center" style="margin-top: 5px">
        <table class="content">
          <tr class="table_th">
            <td>课程号</td>
            <td>课程名</td>
            <td>学分</td>
            <td>材料路径</td>
            <td>前序课</td>
            <td>任课老师</td>
            <td>操作</td>
          </tr>
          <tr v-for="item in courseList" :key="item.courseId">
            <td>{{ item.num }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.credit }}</td>
            <td>{{ item.coursePath }}</td>
            <td>{{ item.preCourse }}</td>
            <td>{{ item.teacherName}}</td>    
            <td>
              <button class="table_edit_button" @click="chooseItem(item)">选择</button>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <!-- 对话框显示 -->
    <dialog
  id="favDialog"
  onclose="close()"
  style="position: absolute; top: 380px; left: 300px; width: 300px; height: 210px; padding: 0; border: 3px solid black;"
>
  <div class="dialog-div" style="display: flex; flex-direction: column; height: 100%; justify-content: center; align-items: center;">
    <div style="text-align: center; font-size: large; margin-bottom: 20px;">
      是否选择该课程
    </div>
    <div style="margin-top: 20px; text-align: center; width: 100%;">
      <button class="commButton" @click="close()" style="margin-right: 10px;">取消</button>
      <button class="commButton" @click="confirm()">确认</button>
    </div>

  </div>
</dialog>
  </template>
  
  <script lang="ts">
  import { type CourseItem, type OptionItem ,type TeacherItem} from '@/models/general'
  import { defineComponent } from 'vue'
  import { getCourseList, courseDelete, courseSave,studentCourseSave } from '@/services/teachingServ'
  import { message, messageConform } from '@/tools/messageBox'
  import { getTeacherList } from '@/services/personServ'
  import { getDialog } from '@/tools/comMethod'
import { useAppStore } from '@/stores/app'
import { userInfo } from 'os'
  export default defineComponent({
    // 双向绑定数据
    data: () => ({
      numName: '',
      courseList: [] as CourseItem[],
      teacherList:[] as TeacherItem[],
      courseSelectList: [] as OptionItem[],
      teacherSelectList: [] as OptionItem[],
      deleteId: -1,
      form: {} as CourseItem
    }),
    //初始加载一次,直接获取教师列表
    created() {
      this.query()
      console.log(this.teacherList)
    },
  
    methods: {
      //设置课程选择列表
      makeSelectCourseList() {
        this.courseSelectList = []
        for (let i = 0; i < this.courseList.length; i++) {
          const item = this.courseList[i]
          this.courseSelectList.push({
            id: item.courseId,
            value: item.num,
            title: item.num + '-' + item.name
          })
        }
      },
      makeSelectTeacherList() {
        this.teacherSelectList = []
        for (let i = 0; i < this.teacherList.length; i++) {
          const item = this.teacherList[i]
          this.teacherSelectList.push({
            id: item.teacherId,
            value: item.num,
            title: item.num + '-' + item.name
          })
        }
      },
      //查询课程列表
      async query() {
        this.courseList = await getCourseList(this.numName)
        this.teacherList=await getTeacherList(this.numName)
        this.makeSelectCourseList()
        this.makeSelectTeacherList()
      },
      //编辑课程,显示对话框
      chooseItem(item: CourseItem) {
        this.form = item
        getDialog('favDialog').show()
      },
      //关闭对话框
      close() {
        getDialog('favDialog').close()
      },
      //确认对话框
      async confirm() {
        this.close()
        const res = await studentCourseSave(useAppStore().userInfo.id,this.form.courseId)
        if (res.code == 0) {
          message(this, '保存成功')
          this.query()
        } else {
          message(this, res.msg)
        }
      },
      //删除课程
      async deleteItem(courseId: number) {
        const result = await messageConform('确认删除吗?')
        if (!result) {
          return
        }
        const res = await courseDelete(courseId)
        if (res.code == 0) {
          message(this, '删除成功')
          this.query()
        } else {
          message(this, res.msg)
        }
      }
    }
  })
  </script>
  <style></style>
  