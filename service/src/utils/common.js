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

async function getUserData(token){
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

module.exports = {
    bcrypt,
    jwt,
    pool,
    checkLevelTime,
    getUserData
};