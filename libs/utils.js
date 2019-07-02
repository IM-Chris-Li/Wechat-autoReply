/*工具方法库*/

//引入解析xml的js库
const {parseString} = require('xml2js');

module.exports = {
    getUserDataAsync(req){
        // 用户数据是通过流的方式发送的，接受需要绑定data事件
        return new Promise((resolve,reject) => {
            let data = '';
            req
                .on('data',userData => {
                    //拼接流式数据
                    data += userData;
                })
                .on('end',() => {
                    //确保数据全部获取了
                    resolve(data);
                })
        })
    },

    parseXMLAsync(xmlData){
        return new Promise((resolve,reject) => {
            parseString(xmlData,{trim:true},(err,data) => {
                if(!err){
                    //解析成功
                    resolve(data);
                }else{
                    //解析失败
                    reject('parseXMLAsync方法有误:' + err);
                }
            })
        })
    },

    formatMessage(jsData){
        //初始化一个空对象
        const data = jsData.xml;
        let message = {};
        //判断数据是否为合法数据
        if(typeof  data === 'object'){
            //循环遍历对象中的所有数据
            for (let key in data){
                //获取属性
                let value = data[key];
                //过滤掉空的数据和空的数组
                if(Array.isArray(value) && value.length > 0){
                    //在新对象中添加属性和值
                    message[key] = value[0];
                }
            }
        }
        //格式化后，返回数据
        return message;
    }
}