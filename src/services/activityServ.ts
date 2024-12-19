import { generalRequest } from '@/services/genServ'
import {
  type DataResponse,
  type StudentItem,
  type FamilyMemberItem,
  type TeacherItem,
  type ActivityItem,
  type StudentActivityItem
} from '@/models/general'
//获取活动基本信息后台数据请求方法
export async function getActivityInfo(activityId: number): Promise<ActivityItem> {
  const res = await generalRequest('/api/activity/getActivityInfo', {
    activityId: activityId
  })
  return res.data as ActivityItem
}
//保存活动基本信息后台数据请求方法
export async function activityEditSave(
  activityId: number | null,
  form: ActivityItem
): Promise<DataResponse> {
  const res = await generalRequest('/api/activity/activityEditSave', {
    activityId: activityId,
    form: form
  })
  return res as DataResponse
}
//获取活动数据表后台数据请求方法
export async function getActivityList(activityName: string | null): Promise<ActivityItem[]> {
  const res = await generalRequest('/api/activity/getActivityList', {
    activityName: activityName
  })
  return res.data as ActivityItem[]
}
//删除活动后台数据请求方法
export async function activityDelete(activityId: number): Promise<DataResponse> {
  const res = await generalRequest('/api/activity/activityDelete', {
    activityId: activityId
  })
  return res as DataResponse
}
//活动报名后台数据请求方法
export async function studentActivityEditSave(activityId: number,studentActivityId:number,form:StudentActivityItem): Promise<DataResponse> {
  const res = await generalRequest('/api/studentActivity/studentActivityEditSave', {
    activityId: activityId,
    studentActivityId:studentActivityId,
    form:form
  })
  return res as DataResponse
}
//通过学号获取学生个人活动数据表后台数据请求方法
export async function getStudentActivityList(num: string | null): Promise<StudentActivityItem[]> {
  const res = await generalRequest('/api/studentActivity/getStudentActivity1List', {
    num: num
  })
  return res.data as StudentActivityItem[]
}
//通过活动名获取学生个人活动数据表后台数据请求方法
export async function getStudentActivity1List(activityName: string | null): Promise<StudentActivityItem[]> {
  const res = await generalRequest('/api/studentActivity/getStudentActivityList', {
    activityName: activityName
  })
  return res.data as StudentActivityItem[]
}
//删除学生活动后台数据请求方法
export async function studentActivityDelete(studentActivityId: number): Promise<DataResponse> {
  const res = await generalRequest('/api/studentActivity/studentActivityDelete', {
    studentActivityId: studentActivityId
  })
  return res as DataResponse
}