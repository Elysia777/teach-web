import axios from 'axios'

export async function userLoginReq(username: string, password: string): Promise<any> {
  try {
    const res = await axios.post('/api/auth/login', {
      username: username,
      password: password
    })
    //等待从服务器返还
    if (
      res.status == 200 &&
      res.data[0].accessToken != null &&
      res.data[0].accessToken != '' &&
      res.data[0].accessToken != undefined
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
