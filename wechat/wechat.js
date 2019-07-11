//引入配置对象
const {appID, appsecret} = require('../config');
//引入发送http请求的库
const rp = require('request-promise-native');
const request = require('request');
//引入fs模块
const {readFile, writeFile, createReadStream, createWriteStream} = require('fs');
//引入接口文件
const api = require('../libs/api');
//引入菜单
const menu = require('./menu');

class Wechat {
    getAccessToken () {
        //定义请求地址
        const url = `${api.accessToken}&appid=${appID}&secret=${appsecret}`;
        /*
          问题：需要将回调函数中的数据返回出去？
          解决：用promise解决

          所有的异步操作，都应该包装一层promise，让这个异步操作执行完毕之后，再去执行后面的代码
          简化： 所有的异步操作，都应该包装一层promise
         */
        return new Promise((resolve, reject) => {
            //发送http请求
            //下载 request-promise-native  request
            rp({method: 'GET', json: true, url})
                .then(res => {
                    //请求成功的状态
                    // console.log(res);
                    //重新赋值凭据的过期时间 ： 当前时间 + (7200 - 5分钟) * 1000
                    res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
                    // console.log(res);
                    resolve(res);
                })
                .catch(err => {
                    //请求失败
                    reject('getAccessToken方法出了问题：' + err);
                })
        })
    }
    saveAccessToken (data) {
        /*
          问题：writeFile方法会将对象转化为字符串
          解决：我将对象转化为json字符串
         */
        data = JSON.stringify(data);
        return new Promise((resolve, reject) => {
            //将凭据保存为一个文件
            writeFile('accessToken.txt', data, err => {
                if (!err) {
                    //写入成功
                    resolve();
                } else {
                    //写入失败
                    reject('saveAccessToken方法出了问题：' + err);
                }
            })
        })
    }
    readAccessToken () {
        return new Promise((resolve, reject) => {
            //将凭据读取出来
            readFile('accessToken.txt', (err, data) => {
                if (!err) {
                    //将读取的Buffer数据转化为json字符串
                    data = data.toString();
                    //将json字符串转化为对象
                    data = JSON.parse(data);
                    //读取成功
                    resolve(data);
                } else {
                    //读取失败
                    reject('readAccessToken方法出了问题：' + err);
                }
            })
        })
    }
    isValidAccessToken (data) {
/*
  判断凭据是否过期
   true   凭据没有过期
        false  凭据过期了
     */
        //过滤非法的数据
        if (!data || !data.access_token || !data.expires_in) return false;
        //判断凭据是否过期
        /*if (data.expires_in > Date.now()) {
          //如果凭据的过期时间大于当前时间，说明没有过期
          return true
        } else {
          //如果凭据的过期时间小于当前时间，说明过期了
          return false
        }*/
        //简写方式
        return data.expires_in > Date.now();
    }
    fetchAccessToken () {
        //优化操作,优化不去执行读取文件操作
        if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
            //说明this有凭据和过期时间，并且凭据未过期
            return Promise.resolve({access_token: this.access_token, expires_in: this.expires_in});
        }

        return this.readAccessToken()
            .then(async res => {
                //判断凭据是否过期(isValidAccessToken)
                if (this.isValidAccessToken(res)) {
                    //没有过期，直接使用
                    return Promise.resolve(res);
                } else {
                    //重新发送请求获取凭据
                    const data = await this.getAccessToken();
                    //保存下来
                    await this.saveAccessToken(data);
                    //将请求回来的凭据返回出去
                    return Promise.resolve(data);
                }
            })
            .catch(async err => {
                console.log(err);
                //重新发送请求获取凭据
                const data = await this.getAccessToken();
                //保存下来
                await this.saveAccessToken(data);
                //将请求回来的凭据返回出去
                return Promise.resolve(data);
            })
            .then(res => {
                //将其请求回来的凭据和过期时间挂载到this上
                this.access_token = res.access_token;
                this.expires_in = res.expires_in;
                //指定fetchAccessToken方法返回值
                return Promise.resolve(res);
            })
    }
    //创建菜单
    createMenu(body){
        return new Promise((resolve,reject) => {
            this.fetchAccessToken()
                .then(res => {
                    const url = `${api.menu.create}access_token=${res.access_token}`;
                    rp({method:'POST',json:true,url,body})
                        .then(res => resolve(res))
                        .catch(err => reject('createMenu方法有误'+err))
                })
        })
    }
    //删除菜单
    deleteMenu(){
        return new Promise((resolve,reject) => {
            this.fetchAccessToken()
                .then(res => {
                    const url = `${api.menu.delete}access_token=${res.access_token}`;
                    rp({method:'GET',json:true,url})
                        .then(res => resolve(res))
                        .catch(err => reject('deleteMenu方法有误:'+err));
                })
        })
    }
    //获取菜单的配置
    getMenu(){
        return new Promise((resolve,reject) => {
            this.fetchAccessToken()
                .then(res => {
                    const url = `${api.menu.delete}access_token=${res.access_token}`;
                    rp({method:'GET',json:true,url})
                        .then(res => resolve(res))
                        .catch(err => reject('getMenu方法有误:'+err))
                })
        })
    }
    //创建自定义菜单
    createMyMenu(body){
        return new Promise((resolve,reject) => {
            this.fetchAccessToken()
                .then(res => {
                    const url = `${api.menu.myCreate}access_token=${res.access_token}`;
                    rp({method:'POST',json:true,url,body})
                        .then(res => resolve(res))
                        .catch(err => reject('createMyMenu方法有误:'+err))
                })
        })
    }
    //删除自定义菜单
    deleteMyMenu(body){
        return new Promise((resolve,reject) => {
            this.fetchAccessToken()
                .then(res => {
                    const url = `${api.menu.myDelete}access_token=${res.access_token}`;
                    rp({method:'POST',json:true,url,body})
                        .then(res => resolve(res))
                        .catch(err => reject('deleteMyMenu方法有误:'+err))
                })
        })
    }
}

//创建菜单
(async () => {
    const wechatApi = new Wechat();

    let data = await wechatApi.deleteMenu();
    console.log(data);
    data = await wechatApi.createMenu();
    console.log(data);
})()

module.exports = Wechat;
