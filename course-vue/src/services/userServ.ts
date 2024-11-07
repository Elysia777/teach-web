import axios from 'axios'
import {generalRequest} from '@/services/genServ'
import { message } from '@/tools/messageBox'

export async function userLoginReq(username: string, password: string): Promise<any> {
  try {
    const res = await axios.post('/api/auth/login', {
      username: username,
      password: password
    })
    //等待从服务器返还
    if (
      res.status == 200 &&
      res.data.accessToken != null &&
      res.data.accessToken != '' &&
      res.data.accessToken != undefined
    ) {
      return res.data
    } else {
      throw new Error('登录错误')
    }
  } catch (error: any) {
    console.log(error)
    throw error
  }
}
//获取测试用户接口，切换用户需要用户已登陆，但测试环境只允许一个账号默认登录，故才用这个办法
export async function getTestUserToken() :Promise<any> {
  try {
    const res = await generalRequest('/api/auth/testUserToken', null)
    localStorage.setItem('testUsers',JSON.stringify(res) )
    return res
  }
  catch (error: any) {
    console.log(error)
    return error
  }

}