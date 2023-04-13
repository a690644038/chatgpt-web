var express = require('express');
var router = express.Router();

const alipaySdk = require('./utils/alipayUtil')
const AlipayFormData = require('alipay-sdk/lib/form').default
const { pool, jwt, getUserData } = require('./utils/common');

const cors = require('cors');
const { default: axios } = require('axios');
router.use(cors());
router.use(express.urlencoded({ extended: true }))

function createResponseObj(data, code, msg) {
  return { data, code, msg };
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
// 查询订单是否交易成功
router.get('/queryOrder', function (req, res, next) {
  //参数
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log(req);
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  let out_trade_no = req.body.out_trade_no //订单号
  let trade_no = req.body.trade_no //支付宝交易号
  //对接支付宝
  const formData = new AlipayFormData();
  formData.setMethod('get')
  formData.addField('bizContent', {
    out_trade_no,
    trade_no
  });
  const result = alipaySdk.exec(
    'alipay.trade.query',
    {},
    { formData: formData }
  );
  result.then(resData => {
    console.log("resData:" + resData)
    axios({
      url: resData,
      method: 'get',
    }).then(data => {
      let r = data.data.alipay_trade_query_response;
      console.log(r)
      if (r.code === '10000') {
        switch (r.trade_status) {
          case 'WAIT_BUYER_PAY':
            res.send({
              success: 'true',
              code: 200,
              msg: '支付宝有交易记录，没付款'
            })
            break;
          case 'TRADE_FINISHED':
            res.send({
              success: 'true',
              code: 200,
              msg: '交易完成，不可以退款'
            })
            break;
          case 'TRADE_SUCCESS':
            res.send({
              success: 'true',
              code: 200,
              msg: '交易完成'
            })
            break;
          case 'TRADE_CLOSED':
            res.send({
              success: 'true',
              code: 200,
              msg: '交易关闭，没有支付成功'
            })
            break;
        }
      } else if (r.code === '40004') {
        res.json('交易不存在')
      }
    }).catch(err => {
      res.json({
        msg: '查询失败',
        err
      })
    })
  })

})




// 向支付宝请求支付
router.post('/playment', async (req, res, next) => {
  //订单号
  const token = req.headers.authorization?.split(' ')[1];
  let userInfo = await getUserData(token)
  const timestamp = Date.now()
  let orderId = timestamp + '_' + userInfo.id
  const { type } = req.body; // 新增字段 - type

  // // // 从membership_level查询数据
  const [level] = await pool.query('SELECT * FROM membership_level WHERE type = ? LIMIT 1', [type]);
  const levelInfo = level[0]
  // //对接支付宝
  const formData = new AlipayFormData();
  formData.setMethod('get')
  // //支付成功后自动跳转的页面
  formData.addField('returnUrl', 'https://chat.workwps.com');
  formData.addField('notify_url', 'https://chat.workwps.com/queryOrder');
  formData.addField('bizContent', {
    outTradeNo: orderId, // 订单号
    productCode: 'FAST_INSTANT_TRADE_PAY', //商品销售码
    totalAmount: levelInfo.price,//设置支付金额
    subject: levelInfo.name + '会员', //订单标题
    // body:'商品详情'
  })


  const result = alipaySdk.exec(
    'alipay.trade.page.pay',
    {},
    { formData: formData }
  );

  result.then(async (resp) => {
    const time = new Date(timestamp)
    await pool.query('INSERT INTO order_list (user_id, order_date, total_amount, order_id, status, prd_name) VALUES (?, ?, ?, ?, ?, ?)',
      [userInfo.id, time, levelInfo.price, orderId, 0, levelInfo.name]
    )
    res.send({
      success: 'true',
      code: '200',
      'result': resp //要跳转到支付宝页面的地址返回给前端页面
    })
  })
})

router.get('/membership-level', async (req, res) => {
  try {
    const [list] = await pool.query('SELECT * FROM membership_level');
    res.status(200).send(createResponseObj({
      list
    }, 1, "操作成功"));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



module.exports = router;
