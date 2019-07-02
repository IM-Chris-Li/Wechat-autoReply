/*入口启动文件*/

const express = require('express');
const auth = require('./wechat/auth');
const app = express();

app.use(auth());

app.listen(80,err => {
    if(!err){
        console.log('服务器启动成功 ---')
    }
})