const { getCookie, getTraffic, getEmailAndPwdList, getDirectCookie } = require('./utils')
const notify = require('./sendNotify')

async function run() {
  const directCookie = getDirectCookie()

  if (directCookie) {
    let msg = '📌 Cookie 模式流量查询'

    const arr = await getTraffic(directCookie)
    console.log('流量结果：', arr)
    msg += '\n' + arr.join('\n')

    console.log('准备发送通知，内容：\n' + msg)
    await notify.sendNotify('iKuuu VPN 流量统计', msg)
    console.log('通知发送完成')
  }
}

run()
