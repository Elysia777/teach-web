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
    <a-table :columns="columns" :data="courseList">
      <template #view="{}">
        <a-button @click="visible = true"> 查看 </a-button>
      </template>
    </a-table>
    <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" :fullscreen="true">
      <score-table></score-table>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { type CourseItem, type TeacherItem } from '@/models/general'
import { defineComponent } from 'vue'
import { getTeacherCourseList } from '@/services/teachingServ'
import { useAppStore } from '@/stores/app'
import ScoreTable from '@/views/teaching/ScoreTable.vue'
export default defineComponent({
  components: { ScoreTable },

  data: () => ({
    columns: [
      {
        title: '课程号',
        dataIndex: 'courseId'
      },
      {
        title: '课程名',
        dataIndex: 'name'
      },
      {
        title: '学分',
        dataIndex: 'credit'
      },
      {
        title: '材料路径',
        dataIndex: 'coursePath'
      },
      {
        title: '前序课',
        dataIndex: 'preCourse'
      },
      {
        title: '查看学生成绩',
        slotName: 'view'
      }
    ],
    numName: '',
    courseList: [] as CourseItem[],
    teacherList: [] as TeacherItem[],
    deleteId: -1,
    form: {} as CourseItem,
    visible: false
  }),
  //初始加载一次,直接获取教师列表
  created() {
    this.query()

  },

  methods: {
    //查询课程列表

    handleClick(){
      this.visible = true;
    },
     handleOk(){
      this.visible = false;
    },
     handleCancel(){
      this.visible = false;
    },
    async query() {
      this.courseList = await getTeacherCourseList(useAppStore().userInfo.id, this.numName)
    }
  }
})

</script>
<style></style>
