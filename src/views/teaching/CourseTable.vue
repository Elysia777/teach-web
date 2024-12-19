<template>
  <div class="base_form">
    <div class="base_header">
      <div class="blue_column"></div>
      <div class="base_title">课程管理</div>
    </div>

    <div class="base_query_oneLine">
      <div class="query_left">
        <button class="commButton" @click="addItem()">添加课程</button>
      </div>
      <div class="query_right">
        <span class="query_label">课程号或课程名</span>
        <input type="text" v-model="numName" class="query_input" />
        <button class="commButton" @click="query()">查询</button>
      </div>
    </div>

    <div class="table_center">
      <table class="content">
        <thead>
          <tr class="table_th">
            <th>课程号</th>
            <th>课程名</th>
            <th>学分</th>
            <th>材料路径</th>
            <th>前序课</th>
            <th>任课老师</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in courseList" :key="item.courseId">
            <td>{{ item.num }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.credit }}</td>
            <td>{{ item.coursePath }}</td>
            <td>{{ item.preCourse }}</td>
            <td>{{ item.teacherName}}</td>
            <td>
              <button class="table_edit_button" @click="editItem(item)">编辑</button>
              <button class="table_delete_button" @click="deleteItem(item.courseId)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- 课程添加/修改对话框 -->
  <dialog id="favDialog" class="dialog" onclose="close()">
  <div class="dialog-header">
    <div class="base_title">课程添加修改</div>
  </div>
  <div class="dialog-body">
    <table class="content">
      <tr>
        <td class="form-label">课程号</td>
        <td><input v-model="form.num" class="form-input" /></td>
      </tr>
      <tr>
        <td class="form-label">课程名</td>
        <td><input v-model="form.name" class="form-input" /></td>
      </tr>
      <tr>
        <td class="form-label">学分</td>
        <td><input v-model="form.credit" class="form-input" /></td>
      </tr>
      <tr>
        <td class="form-label">资料路径</td>
        <td><input v-model="form.coursePath" class="form-input" /></td>
      </tr>
      <tr>
        <td class="form-label">前序课</td>
        <td>
          <select v-model="form.preCourseId" class="form-select">
            <option v-for="item in courseSelectList" :key="item.id" :value="item.id">
              {{ item.title }}
            </option>
          </select>
        </td>
      </tr>
      <tr>
        <td class="form-label">任课老师</td>
        <td>
          <select v-model="form.teacherId" class="form-select">
            <option v-for="item in teacherSelectList" :key="item.id" :value="item.id">
              {{ item.title }}
            </option>
          </select>
        </td>
      </tr>
      <tr>
        <td colspan="2" class="dialog-footer">
          <button class="commButton" @click="close()">取消</button>
          <button class="commButton" @click="confirm()">确认</button>
        </td>
      </tr>
    </table>
  </div>
</dialog>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getCourseList, courseDelete, courseSave } from '@/services/teachingServ'
import { message, messageConform } from '@/tools/messageBox'
import { getTeacherList } from '@/services/personServ'
import { getDialog } from '@/tools/comMethod'
import { type CourseItem, type OptionItem, type TeacherItem } from '@/models/general'

export default defineComponent({
  data: () => ({
    numName: '',
    courseList: [] as CourseItem[],
    teacherList: [] as TeacherItem[],
    courseSelectList: [] as OptionItem[],
    teacherSelectList: [] as OptionItem[],
    form: {} as CourseItem
  }),
  created() {
    this.query()
  },
  methods: {
    makeSelectCourseList() {
      this.courseSelectList = this.courseList.map(item => ({
        id: item.courseId,
        value: item.num,
        title: `${item.num} - ${item.name}`
      }))
    },
    makeSelectTeacherList() {
      this.teacherSelectList = this.teacherList.map(item => ({
        id: item.teacherId,
        value: item.num,
        title: `${item.num} - ${item.name}`
      }))
    },
    async query() {
      this.courseList = await getCourseList(this.numName)
      this.teacherList = await getTeacherList(this.numName)
      this.makeSelectCourseList()
      this.makeSelectTeacherList()
    },
    addItem() {
      this.form = {} as CourseItem
      getDialog('favDialog').show()
    },
    editItem(item: CourseItem) {
      this.form = item
      getDialog('favDialog').show()
    },
    close() {
      getDialog('favDialog').close()
    },
    async confirm() {
      this.close()
      const res = await courseSave(this.form)
      if (res.code === 0) {
        message(this, '保存成功')
        this.query()
      } else {
        message(this, res.msg)
      }
    },
    async deleteItem(courseId: number) {
      const result = await messageConform('确认删除吗?')
      if (!result) return
      const res = await courseDelete(courseId)
      if (res.code === 0) {
        message(this, '删除成功')
        this.query()
      } else {
        message(this, res.msg)
      }
    }
  }
})
</script>

<style scoped>
.base_form {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.base_header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.blue_column {
  width: 6px;
  height: 40px;
  background-color: #007bff;
  margin-right: 10px;
}

.base_title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.base_query_oneLine {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.query_left button,
.query_right button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.query_left button:hover,
.query_right button:hover {
  background-color: #0056b3;
}

.query_label {
  font-size: 14px;
  margin-right: 10px;
}

.query_input {
  padding: 8px;
  width: 230px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.table_center {
  margin-top: 10px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.content {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.table_th th {
  padding: 12px;
  text-align: left;
  background-color: #007bff;
  color: white;
}

.content td {
  padding: 10px;
  text-align: left
}
.dialog {
  position: fixed;
  top: 50%;
  left: 30%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 460px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 1000; /* 确保对话框在最上层 */
}

.dialog-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.dialog-body {
  margin-bottom: 20px;
}

.dialog-footer {
  justify-content: space-between;
}

.form-label {
  text-align: right;
  padding-right: 10px;
}

.form-input{
  width: 90%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.form-select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.commButton {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
  margin: auto 50px;
}

.commButton:hover {
  background-color: #0056b3;
}</style>