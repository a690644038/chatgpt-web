const pool = require('../../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

async function getUserData(token) {
    try {
        const decodedToken = jwt.verify(token, 'secret-key');
        const [user] = await pool.query(
            'SELECT * FROM users WHERE id = ? LIMIT 1',
            [decodedToken.userId]
        );

        if (!user.length) {
            return { success: false, message: "登录超时" };
        }
        return user[0]
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

async function getOpenAiKey() {
    // 创建数据库连接池
    try {
        // 从连接池中获取一个连接
        const conn = await pool.getConnection();

        // 执行 SQL 查询
        const [rows] = await conn.query('SELECT * FROM open_ai_key');

        // 释放连接
        conn.release();

        // 返回查询结果
        return rows;
    } catch (err) {
        console.error(err);
    } finally {
        // 最后记得关闭连接池
        pool.end();
    }
}



module.exports = {
    bcrypt,
    jwt,
    pool,
    checkLevelTime,
    getUserData,
    getOpenAiKey,
};