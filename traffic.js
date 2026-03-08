const { getCookie, getTraffic, getEmailAndPwdList, getDirectCookie } = require('./utils')
const notify = require('./sendNotify')

async function run() {
  const directCookie = getDirectCookie()

  if (directCookie) {
    let msg = '📌 Cookie 模式流量查询'
    const arr = await getTraffic(directCookie)
    msg += `\n${arr.join('\n')}`
    await notify.sendNotify('iKuuu VPN 今日流量统计', msg)
  } else {
    const [emailList, pwdList] = await getEmailAndPwdList()
    const messages = []
    for (let i = 0; i < emailList.length; i++) {
      const email = emailList[i]
      const pwd = pwdList[i]
      let msg = `邮箱：${emailList[i]}`
      const cookie = await getCookie(email, pwd)
      if (cookie.includes('登录失败')) {
        msg += `\n${cookie}`
        messages.push(msg)
        continue
      }
      const arr = await getTraffic(cookie)
      msg += `\n${arr.join('\n')}`
      messages.push(msg)
    }
    await notify.sendNotify('iKuuu VPN 今日流量统计', messages.join('\n\n========================\n\n'))
  }
}

run()
```

---

## 完整操作步骤

### 第一步：获取 Cookie

1. 电脑浏览器打开 `https://ikuuu.nl` 并**登录**
2. 按 `F12` 打开开发者工具 → 点「**网络**」标签
3. 刷新页面，随便点一个请求（比如 `user`）
4. 右侧找到「**请求标头**」→ 复制 `Cookie:` 后面的整段内容

看起来类似：
```
_ga=GA1.1.xxx; uid=12345; key=abcdef...
