/*
    设置回复用户的6种消息
 */

module.exports = options => {
    //回复用户消息
    let replyMessage = '<xml>'+
        '<ToUserName><![CDATA[' + options.toUserName + ']]></ToUserName>' +
        '<FromUserName><![CDATA[' + options.fromUserName + ']]></FromUserName>' +
        '<CreateTime>' + options.createTime + '</CreateTime>' +
        '<MsgType><![CDATA[' + options.msgType + ']]></MsgType>';

    if(options.msgType === 'text'){
        replyMessage += '<Content><![CDATA]>' + options.content + ']]></Content>';
    }else if(options.msgType === 'image'){
        replyMessage += '<Image><Mediald><![CDATA[' + options.mediald +']]></Mediald></Image>';
    }else if(options.msgType === 'voice'){
        replyMessage += '<Voice><Mediald><![CDATA[' + options.mediald +']]></Mediald></Voice>';
    }else if(options.msgType === 'video'){
        replyMessage += '<Video>' +
            '<MediaId><![CDATA[' + options.mediaId + ']]></MediaId>' +
            '<Title><![CDATA[' + options.title + ']]></Title>' +
            '<Description><![CDATA[' + options.description + ']]></Description>' +
            '</Video>';
    }else if(options.msgType === 'music'){
        replyMessage += '<Music>' +
            '<Title><![CDATA[' + options.title + ']]></Title>' +
            '<Description><![CDATA[' + options.description + ']]></Description>' +
            '<MusicUrl><![CDATA[' + options.musicUrl + ']]></MusicUrl>' +
            '<HQMusicUrl><![CDATA[' + options.hqMusicUrl + ']]></HQMusicUrl>' +
            '<ThumbMediaId><![CDATA[' + options.mediaId + ']]></ThumbMediaId>' +
            '</Music>';
    }else if(options.msgType === 'news'){
        replyMessage += '<ArticleCount>' + options.content.length + '</ArticleCount>' +
            '<Articles>';

        options.forEach(item => {
            replyMessage += '<item>' +
                '<Title><![CDATA[' + item.title + ']]></Title>' +
                '<Description><![CDATA[' + item.description + ']]></Description>' +
                '<PicUrl><![CDATA[' + item.picUrl + ']]></PicUrl>' +
                '<Url><![CDATA[' + item.url + ']]></Url>' +
                '</item>'
        })

        replyMessage += '<Articles>';
    }

    replyMessage += '</xml>';

    //返回拼接好的最终数据
    return replyMessage;
}