const { getCookie, getTraffic, getEmailAndPwdList, getDirectCookie } = require('./utils')
const notify = require('/ql/data/scripts/sendNotify')

async function run() {
  const directCookie = getDirectCookie()

  if (directCookie) {
    let msg = '📌 Cookie 模式流量查询'
    const arr = await getTraffic(directCookie)
    console.log('流量结果：', arr)
    msg += '\n' + arr.join('\n')
    await notify.sendNotify('iKuuu VPN 流量统计', msg)
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
      const arr = await getTraffic(cookie)
      msg += '\n' + arr.join('\n')
      messages.push(msg)
    }
    await notify.sendNotify('iKuuu VPN 流量统计', messages.join('\n\n========================\n\n'))
    console.log('通知发送完成')
  }
}

run()
