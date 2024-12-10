// Utilities
import { defineStore } from 'pinia'
import { userLoginReq } from '@/services/userServ'
import {
  type MenuInfo,
  type UserInfo,
  type SystemConfig,
  type NotificationMsg,
  type ConfirmMsg
} from '@/models/general'
import { getMenuList } from '@/services/mainServ'
const defaultNaviList: MenuInfo[] = []
//创建Store对象方法 前端各页面共享的数据保存在该对象里，在其他的文件可以读取或者修改，实现数据共享
export const useAppStore = defineStore('app', {
  //sates属性，包括用户信息、系统配置信息、通知信息、确认信息
  state: () => ({
    userInfo: {
      loggedIn: false,
      username: '',
      perName: '',
      jwtToken: '',
      id: 0,
      roles: '',
    } as UserInfo,
    systemConfig: {
      naviList: defaultNaviList,
      showLeftMeun: false,
      leftList: defaultNaviList,
      id: null
    } as SystemConfig,
    notificationMsg: {
      show: false,
      msg: ''
    } as NotificationMsg,
    confirmMsg: {
      show: false,
      msg: '',
      confirm: () => {
        alert('resolve')
      }
    } as ConfirmMsg
  }),
  //actions属性，包括登录、注销、设置导航、设置左侧菜单、消息提示、确认提示
  actions: {
    //登录方法，登录成功后设置用户信息
    async login(username: string, password: string): Promise<void> {
      const res = await userLoginReq(username, password)
    console.log(res)
      this.userInfo = {
        loggedIn: true,
        username: res.username,
        perName: res.perName,
        jwtToken: res.accessToken,
        id: res.id,
        roles: res.roles,
      }
    },
    //注销方法，注销后清除用户信息
    logout() {
      this.userInfo = {
        loggedIn: false,
        username: '',
        perName: '',
        jwtToken: '',
        roles: '',
        id: 0,
      }
      this.systemConfig.naviList = []
    },
    //设置Navi菜单导航数据
    async setNavi() {
      this.systemConfig.naviList = await getMenuList()
      this.systemConfig.leftList = this.systemConfig.naviList[0].sList
      this.systemConfig.showLeftMeun = true
      this.systemConfig.id = this.systemConfig.naviList[0].id
    },
    //选中模块菜单，设置左侧菜单数据
    setLeftList(id: number) {
      let i: number
      for (i = 0; i < this.systemConfig.naviList.length; i++) {
        if (this.systemConfig.naviList[i].id === id) {
          this.systemConfig.leftList = this.systemConfig.naviList[i].sList
          this.systemConfig.id = id
          break
        }
      }
    },
    //消息提示
    message(msg: string) {
      this.notificationMsg = {
        show: true,
        msg: msg
      }
    },
    //确认提示
    confirm(msg: string, confirm: Function) {
      this.confirmMsg = {
        show: true,
        msg: msg,
        confirm: confirm
      }
    }
  },
  // persist: true 表示数据保存浏览器，刷新页面后数据不会丢失
  persist: true
})
