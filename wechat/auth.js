/*验证服务器和回复用户消息功能*/

//引入配置对象
const config = require('../config');
//引入加密模块
const sha1 = require('sha1');
//引入工具函数
const {getUserDataAsync,parseXMLAsync,formatMessage} = require('../libs/utils');
//引入reply模块
const reply = require('./reply');
//引入wechat模块
const menu = require('./menu');

module.exports = () => {
    return async (req,res,next) => {
        //接受微信服务器的请求参数
        const {signature,echostr,timestamp,nonce} = req.query;
        const {token} = config;

        //拼接参数并加密
        const sha1Str = sha1([timestamp,nonce,token].sort().join(''));
        /*
            微信服务器会主动发GET、POST方法的消息
                -GET请求，验证服务器有效性
                -POST请求，微信server将用户转发过来的消息转发到开发者服务器
         */
        if (req.method === 'GET'){
            //将加密后生成字符串和微信签名进行比较
            if(sha1Str === signature){
                res.send(echostr);
            }else{
                res.send('');
            }
        }else if(req.method === 'POST'){
            //接受用户发送过来的消息
            // console.log(req.query);

            //验证消息是否来自微信服务器
            if(sha1Str !== signature){
                //过滤非法请求
                res.send('error');
                return '';
            }
            //获取用户的消息,返回的数据格式是xml
            const xmlData = await getUserDataAsync(req);

            //将xml解析成js对象
            const jsData = await parseXMLAsync(xmlData);

            //格式化数据
            const message = formatMessage(jsData);
            console.log(message);

            //返回用户消息
            //设置回复消息的具体内容
            const replyMessage = await reply(message);
            console.log(replyMessage);

            //返回响应给微信服务器
            res.send(replyMessage);
        }
    }
}