/*
    处理并分析用户发送的消息
    决定返回什么消息给用户
 */

const template = require('./template');

module.exports = async message => {

    //定义options
    let options ={
        toUserName:message.FromUserName,
        fromUserName:message.ToUserName,
        createTime:Date.now(),
        msgType:'text'
    }

    //设置回复用户消息的具体内容
    let content = '';

    //判断用户发送消息的类型和内容，决定返回什么消息给用户
    if(message.MsgType === 'text'){
        if(message.Content === 'Hi'){
            content = 'hello world';
        }else if(message.Content === 'clfc'){
            content = 'hello CLFC';
        }else if(message.Content === 'T'){
            //回复图文消息
            content = [{
                title:'Tesla',
                description:'battery electric vehicle',
                picUrl:'https://w.wallhaven.cc/full/j8/wallhaven-j8gjvy.jpg',
                url:'https://www.tesla.com/'
            },{
                title:'SpaceX',
                description:'Living in the Mars',
                picUrl:'https://w.wallhaven.cc/full/vm/wallhaven-vm8qg3.jpg',
                url:'https://www.spacex.com/'
            }];
            options.msgType = 'news';
        }else if(message.Content.match('elon')){
            content = 'The Greatest man living in this fucking world';
        }else{
            content = 'Are you ok?'
        }
    }else if(message.MsgType === 'image'){
        content = 'The Adress of the img is:' + message.PicUrl;
    }else if(message.MsgType === 'voice'){
        content = 'The Voice recognition result is :' + message.Recognition;
    }else if(message.MsgType === 'video'){
        content = 'The video message accepted';
    }else if(message.MsgType === 'shortvideo'){
        content = 'The shortvideo message accepted';
    }else if(message.MsgType === 'location'){
        content = '纬度:' + message.Location_X + '经度:' + message.Location_Y
        + '缩放大小:' + message.Scale + '详情:' + message.Label;
    }else if(message.MsgType === 'link'){
        content = '标题:' + message.Title + '描述:' + message.Description + '网址:' + message.Url;
    }

    //将最终回复消息内容添加到options中
    options.content = content;
    //返回最终的xml数据
    return template(options);
}
