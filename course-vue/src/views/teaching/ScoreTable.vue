<template>
  <div class="base_form">
    <div class="base_header">
      <div class="blue_column"></div>
      <div class="base_title">成绩管理</div>
    </div>

    <div class="base_query_oneLine">
      <div class="query_left">
        <button class="commButton" @click="addItem()">添加</button>
      </div>
      <div class="query_right">
        <span style="margin-top: 5px">学生</span>
        <select class="commInput" v-model="studentId">
          <option value="0">请选择...</option>
          <option v-for="item in studentList" :key="item.id" :value="item.id">
            {{ item.title }}
          </option>
        </select>
        <span style="margin-top: 5px">课程</span>
        <select class="commInput" v-model="courseId">
          <option value="0">请选择...</option>
          <option v-for="item in courseList" :key="item.id" :value="item.id">
            {{ item.title }}
          </option>
        </select>
        <button style="margin-left: 5px" class="commButton" @click="query()">查询</button>
      </div>
    </div>
    <a-table :columns="columns" :data="scoreList">
      <template #view="{record}">
        <a-button class="table_edit_button" @click="editItem(record)">编辑</a-button>
        <a-button class="table_delete_button" @click="deleteItem(record.scoreId)">删除</a-button>

      </template>
    </a-table>
  </div>
  <!-- 成绩修改对话框显示 -->
  <a-modal body-class="score_modal"
           onclose="close()"
           v-model:visible="addVisible"
           title="成绩添加修改对话框"
           @cancel="close()"
           @ok="confirm()"
  >
    <a-form :model="form">
      <a-form-item field="name" label="学号姓名">
        <a-select v-model="form.studentId" :style="{width:'320px'}" placeholder="Please select ...">
          <a-option v-for="item in studentList" :key="item.id" :value="item.id ">
            {{item.title}}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="post" label="课程名">
        <a-select v-model="form.courseId" :style="{width:'320px'}" placeholder="Please select ...">
          <a-option v-for="item in courseList" :key="item.id" :value="item.id ">
            {{item.title}}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="mark" label="成绩">
        <a-input-number v-model="form.mark" :style="{width:'320px'}" placeholder="please enter your post..." />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import {
  getScoreList,
  getStudentItemOptionList,
  getCourseItemOptionList,
  scoreSave,
  scoreDelete
} from '@/services/teachingServ'
import { type OptionItem, type ScoreItem } from '@/models/general'
import { message, messageConform } from '@/tools/messageBox'
export default defineComponent({
  data: () => ({
    columns: [
      {
        title: '学号',
        dataIndex: 'studentNum'
      },
      {
        title: '姓名',
        dataIndex: 'studentName'
      },
      {
        title: '班级',
        dataIndex: 'className'
      },
      {
        title: '课程号',
        dataIndex: 'courseNum'
      },
      {
        title: '课程名',
        dataIndex: 'courseName'
      },
      {
        title: '学分',
        dataIndex: 'credit'
      },
      {
        title: '成绩',
        dataIndex: 'mark'
      },
      {
        title: '操作',
        slotName: 'view'
      }
    ],
    form : {} as ScoreItem,
    scoreList: [] as ScoreItem[],
    studentId: null,
    courseId: null,
    editedItem: {} as ScoreItem,
    studentList: [] as OptionItem[],
    courseList: [] as OptionItem[],
    deleteId: -1,
    addVisible: false
  }),
  computed: {},
  created() {
    this.initialize()
  },

  methods: {
    handleSubmit() {
      console.log(this.form)
    },
    // 初始化,获取学生选择项列表和课程选择项列表
    async initialize() {
      this.scoreList = await getScoreList(this.studentId, this.courseId)
      this.studentList = await getStudentItemOptionList()
      this.courseList = await getCourseItemOptionList()
    },
    // 查询
    async query() {
      this.scoreList = await getScoreList(this.studentId, this.courseId)
    },
    // 添加成绩,显示成绩修改对画框
    addItem() {
      this.editedItem = {} as ScoreItem
      this.addVisible = true
    },
    // 编辑成绩,显示成绩修改对画框
    editItem(item: ScoreItem) {
      this.editedItem.courseId = item.courseId

      this.addVisible = true
    },
    // 关闭成绩修改对话框
    close() {
      this.addVisible = false
    },
    // 确认成绩修改对话框
    async confirm() {
      this.close()
      const res = await scoreSave(
        this.form.scoreId,
        this.form.studentId,
        this.form.courseId,
        this.form.mark
      )
      if (res.code == 0) {
        message(this, '保存成功')
        this.query()
      } else {
        message(this, res.msg)
      }
    },
    // 删除成绩
    async deleteItem(scoreId: number) {
      const result = await messageConform('确认删除吗?')
      if (!result) {
        return
      }
      const res = await scoreDelete(scoreId)
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
<style lang="scss">
.score_modal{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

</style>
