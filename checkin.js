const axios = require('axios')
const { getCookie, getTraffic, getEmailAndPwdList, getDirectCookie } = require('./utils')
const notify = require('/ql/data/scripts/sendNotify')

const host = 'https://ikuuu.nl'
const checkinURL = host + '/user/checkin'

async function checkin(cookie) {
  try {
    const res = await axios(checkinURL, {
      method: 'POST',
      headers: {
        Cookie: cookie
      },
      withCredentials: true
    })
    return res.data.msg
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

async function run() {
  const directCookie = getDirectCookie()

  if (directCookie) {
    let msg = '📌 Cookie 模式签到'
    const checkinRes = await checkin(directCookie)
    console.log('签到结果：', checkinRes)
    msg += '\n' + checkinRes
    const arr = await getTraffic(directCookie)
    console.log('流量结果：', arr)
    msg += '\n' + arr.join('\n')
    await notify.sendNotify('iKuuu VPN 签到通知', msg)
    console.log('通知发送完成')
  } else {
    const [emailList, pwdList] = await getEmailAndPwdList()
    const messages = []
    for (let i = 0; i < emailList.length; i++) {
      const email = emailList[i]
      const pwd = pwdList[i]
      let msg = '邮箱：' + emailList[i]
      const cookie = await getCookie(email, pwd)
      if (cookie.includes('登录失败')) {
        msg += '\n' + cookie
        messages.push(msg)
        continue
      }
      const checkinRes = await checkin(cookie)
      msg += '\n' + checkinRes
      const arr = await getTraffic(cookie)
      msg += '\n' + arr.join('\n')
      messages.push(msg)
    }
    // 在 run() 函数里，签到成功后加入：
    const expireIn = parseInt(directCookie.match(/expire_in=(\d+)/)?.[1] || '0')
    if (expireIn) {
      const daysLeft = Math.floor((expireIn - Date.now() / 1000) / 86400)
      console.log(`Cookie 剩余有效期：${daysLeft} 天`)
      if (daysLeft <= 7) {
        msg += `\n⚠️ Cookie 还有 ${daysLeft} 天过期，请及时更新！`
      }
    }
    await notify.sendNotify('iKuuu VPN 签到通知', messages.join('\n\n========================\n\n'))
    console.log('通知发送完成')
  }
}

run()
