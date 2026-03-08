const axios = require('axios')
const { getCookie, getTraffic, getEmailAndPwdList, getDirectCookie } = require('./utils')
const notify = require('./sendNotify')

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
    await QLAPI.notify('iKuuu VPN 签到通知', msg)
    console.log('通知发送完成')
  }
}

run()
