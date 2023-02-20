// 发送Ajax请求

/*
1.封装功能函数
    1.功能点明确
    2.函数内部应该保留固定的代码（静态的）
    3.将动态的数据抽取成形参，由使用者根据自身的情况动态传入形参
    4。一个良好的功能函数应该设置形参的默认值（ES6的形参默认值即可）
2.封装功能组件
    1.功能点明确
    2.组件内部保留静态的代码
    3.将动态的数据抽取成props参数 由使用者根据自身的情况以标签属性的形式动态传入props数据
    4.一个良好的组件应该设置组件的必要性和数据类型
*/ 
import config from './config'

export default (url,data={},method='GET')=>{
    return new Promise((resolve,reject)=>{
        //1.new promise初始化promise的状态为pending
        wx.request({
            url:config.host+url,
            data,
            method,
            header:{
                cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item=>item.indexOf('MUSIC_U')!==-1):''
            },
            success:(res)=>{
            //   console.log('请求成功：',res);
            if(url==='/login'){//登录请求
                // 将用户的cookie存入本地
                wx.setStorage({
                    key:'cookies',
                    data:res.cookies
                })

            }
              resolve(res.data);//修改promise的状态为成功状态resolved
            },
            fail:(err)=>{
            //   console.log('请求失败',err);
              reject(err);//修改promise的状态为失败状态rejected
            }
          })
    })
}

