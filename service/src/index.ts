import express from 'express'
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'
import user from 'src/user'
import pay from 'src/pay'

const jwt = require('jsonwebtoken');
const pool = require('../db');

const app = express()
const router = express.Router()

app.use(express.static('dist'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

async function checkLevelTime(token) {

  try {
    const decodedToken = jwt.verify(token, 'secret-key');
    const [user] = await pool.query(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [decodedToken.userId]
    );
    
    if (!user.length) {
      return { success: false, message: "请登录！" };
    }

    const levelTime = new Date(user[0].levelTime).getTime();
    if (levelTime < Date.now()) {
      return { success: false, message: "会员已过期" };
    } else {
      return { success: true, message: "Leveltime is not passed yet" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}


router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')
  const token = req.headers.authorization?.split(' ')[1];
  // if (!token) {
  //   return res.status(401).send(JSON.stringify({ message: "Unauthorized access" }));
  // }

  if(token){
    const levelTimeCheckResult = await checkLevelTime(token);
    if (!levelTimeCheckResult.success) {
      // return res.send(JSON.stringify({ message: levelTimeCheckResult.message }));
      return res.status(200).send({
        data:{},
        code:0,
        msg:levelTimeCheckResult.message
      });
    }
  }

 

  try {
    const { prompt, options = {}, systemMessage, temperature, top_p } = req.body as RequestProps
    let firstChunk = true
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
      temperature,
      top_p,
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    if (process.env.AUTH_SECRET_KEY !== token)
      throw new Error('密钥无效 | Secret key is invalid')

    res.send({ status: 'Success', message: 'Verify successfully', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})


app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})



app.use('', router)
app.use('/api', router)
app.use('/user', user)
app.use('/pay', pay)
app.set('trust proxy', 1)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
