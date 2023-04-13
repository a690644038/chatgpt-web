import express from 'express'
// const app = express()
const { pool, bcrypt,jwt  } = require('./utils/common');
const router = express.Router()
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.163.com", // 邮箱服务商的 SMTP 地址
  port: 465, // SMTP 端口
  secure: true, // 使用 SSL 加密连接
  auth: {
    user: "botmind@163.com", // 发送邮件的邮箱账号
    pass: "GUINHSBJXVPRFCSC" // 发送邮件的邮箱密码，请将其存储在环境变量中并从中读取
  }
});
function createResponseObj(data, code, msg) {
  return { data, code, msg };
}


router.post('/send-verification-code', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "请填写邮箱号" });
  }

  // 检查邮箱格式是否正确
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ message: "邮箱格式不正确" });
  }

  try {
    // 查询验证码记录是否已存在
    const [existingCode] = await pool.query(
      'SELECT * FROM verification_codes WHERE email = ?',
      [email]
    );

    // 生成随机验证码
    const code = Math.random().toString(36).substring(7);

    if (existingCode.length) {
      // 如果验证码记录已存在，则更新验证码值和发送时间
      await pool.query(
        'UPDATE verification_codes SET code = ?, sent_at = NOW() WHERE email = ?',
        [code, email]
      );
    } else {
      // 如果验证码记录不存在，则插入新记录
      await pool.query(
        'INSERT INTO verification_codes (email, code, sent_at) VALUES (?, ?, NOW())',
        [email, code]
      );
    }

    // 在实际应用中，可以通过邮件等方式将验证码发送给用户
    transporter.sendMail({
      from: 'botmind@163.com', // 发件人邮箱地址
      to: email, // 收件人邮箱地址
      subject: '验证码', // 邮件主题
      text: `您的验证码为：${code}` // 邮件正文
    }, (error, info) => {
      if (error) {
        return res.status(500).json({
          success: false,
          code: "1001",
          msg: "服务器内部错误"
        });
      } else {
        return res.status(200).json({
          success: true,
          code: "1",
          msg: "操作成功!",
        });
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      code: "1001",
      msg: "服务器内部错误"
    });
  }
});


router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(200).send(createResponseObj({}, 0, "请填写所有必需字段"));
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(200).send(createResponseObj({}, 0, "邮箱格式不正确"));
  }


  try {
    // 检查邮箱是否已被注册
    const [existingUser] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (existingUser.length) {
      return res.status(200).send(createResponseObj({}, 0, "该邮箱已被注册"));
    }

    // 生成加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入用户数据并更新用户 token
    const levelTime = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const [result] = await pool.query(
      'INSERT INTO users (email, username, password, token, levelTime) VALUES (?, ?, ?, ?, ?)',
      [email, username, hashedPassword, '', levelTime]
    );
    const userId = result.insertId;

    // 返回用户信息和 token
    const token = jwt.sign(
      { userId, email },
      'secret-key',
      { expiresIn: '30d' }
    );
    await pool.query('UPDATE users SET token = ? WHERE id = ?', [token, userId]);
    res.status(200).send(createResponseObj({
      avatar: null,
      username,
      token,
      levelTime
    }, 1, "注册成功"));

  } catch (error) {
    console.error(error);
    res.status(500).send(createResponseObj({}, 0, error.message));
  }
});




router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    // return res.status(400).json({ message: "请填写所有必需字段" });
    return res.status(200).send(createResponseObj({}, 0, "请填写所有必需字段"));
  }

  // 检查邮箱格式是否正确
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    // return res.status(400).json({ message: "邮箱格式不正确" });
    return res.status(200).send(createResponseObj({}, 0, "邮箱格式不正确"));
  }

  try {
    const [[user]] = await pool.query(
      'SELECT * FROM users WHERE email = ?LIMIT 1',
      [email]
    );

    if (!user) {
      return res.status(200).send(createResponseObj({}, 0, "用户名或密码错误"));
    }
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      return res.status(200).send(createResponseObj({}, 0, "用户名或密码错误"));

    }
   
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'secret-key',
      { expiresIn: '30d' }
    );
    await pool.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

    res.status(200).send(createResponseObj({
      avatar: user.avatar,
      username: user.username,
      levelTime:user.levelTime,
      token,
    }, 1, "登录成功"));

  } catch (error) {
    res.sendStatus(500);
  }
});




export default router
