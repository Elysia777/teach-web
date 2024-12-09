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
            <td>查看学生成绩</td>
          </tr>
          <tr v-for="item in courseList" :key="item.courseId">
            <td>{{ item.num }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.credit }}</td>
            <td>{{ item.coursePath }}</td>
            <td>{{ item.preCourse }}</td>
            <td> 
              <el-button plain @click="visible = true">
                查看
              </el-button>

              <el-dialog
                v-model="visible"
                title="Tips"
                :fullscreen="true"
              >
                <score-table></score-table>
              </el-dialog>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { type CourseItem, type OptionItem ,type TeacherItem} from '@/models/general'
  import { defineComponent } from 'vue'
  import { getCourseList, courseDelete, courseSave,studentCourseSave,getTeacherCourseList} from '@/services/teachingServ'
  import { message, messageConform } from '@/tools/messageBox'
  import { getTeacherList } from '@/services/personServ'
  import { getDialog } from '@/tools/comMethod'
import { useAppStore } from '@/stores/app'
import { userInfo } from 'os'
 import ScoreTable from '@/views/teaching/ScoreTable.vue'
  export default defineComponent({
    components: { ScoreTable },
    // 双向绑定数据
    data: () => ({
      numName: '',
      courseList: [] as CourseItem[],
      teacherList:[] as TeacherItem[],
      deleteId: -1,
      form: {} as CourseItem,
      visible:false,
    }),
    //初始加载一次,直接获取教师列表
    created() {
      this.query()
    },
  
    methods: {
      handleClose(done: () => void){
         messageConform('Are you sure to close this dialog?')
          .then(() => {
            done()
          })
          .catch(() => {
            // catch error
          })
      },
      handleClick(){
        this.visible=true
      },
      handleOk(){
        this.visible=false
      },
      handleCancel(){
        this.visible=false
      },
      //查询课程列表
      async query() {
        this.courseList = await getTeacherCourseList(useAppStore().userInfo.id,this.numName)
      },
      async deleteItem(item:CourseItem) {
      },
      async checkItem(item:CourseItem){
        
      }
    }
  })
  </script>
  <style></style>
  