let app=getApp()


// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
//窗口可用高度
wh: 0,
//摄像头的朝向 front前置摄像头 back后置摄像头
position:'front',
//照片的路径，默认为空，拍照成功后赋值
src:'',
//是否展示选取的图片
isShowPic: false,
//人脸信息
faceInfo:null,
//映射关系
map: {
  gender:{
    male:'男性',
    female:'女性'
  },
  expression:{
    none:'不笑',
    smile:'微笑',
    laugh:'大笑',
  },
  glasses:{
    none:'无眼镜',
    common:'普通眼镜',
    sun:'墨镜'
  },
  emotion:{
    angry:'愤怒',
    disgust:'厌恶',
    fear:'恐惧',
    happy:'高兴',
    sad:'伤心',
    surprise:'惊讶',
    neutral:'无情绪',
  }
}
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
 let sysInfo = wx.getSystemInfoSync()
 this.setData(
   {
     wh: sysInfo.windowHeight
   }
 )
},

//toCamera: function () {
//     wx.redirectTo({
//       url: 'pages/home/home',
//     })
//},


//点击按钮，切换摄像头
reverseCamera(){
let newPosition = this.data.position === 'front' ? 'back' : 'front' //如果现在是front，就转换成back
this.setData({
    position: newPosition
  }
)},
//拍照
takePhoto(){
  //创建相机的实例对象
  let ctx = wx.createCameraContext()
  ctx.takePhoto({
    quality: 'high',
    success: (res) => {
      console.log(res.tempImagePath)
      this.setData({
        src: res.tempImagePath,
        isShowPic:true
      }, () => {
        this.getFaceInfo()//使用测颜值的回调函数
      }
      )
    },
    //拍照成功后的回调函数
    fail: () => {
      console.log('拍照失败啦，小笨蛋！')
      this.setData({
        src: ''
      })    
    },
  })
},
//拍照失败后的回调函数

//从相册选取照片
choosePhoto(){
wx.chooseMedia({
  count: 1, //只能选取一张图片
  sizeType: ['original'], //选取原图
  mediaType:['image'],//选取类型为图片
  sourceType: ['album'], //只能从相册选取照片
  success:(res) =>{
  console.log(res.tempFiles)
  //选取成功后，进行判断并赋值
    if(res.tempFiles != null && res.tempFiles != undefined){
    this.setData({
      src: res.tempFiles[0].tempFilePath,
      isShowPic:true //展示
    }, () => {
      this.getFaceInfo()//使用测颜值的回调函数
    }
    )
    }
  },
  fail(){
console.log('选取照片失败啦，小笨蛋!')
this.setData({
  src:''//选取失败，清空src
})
  },
})
},
//重新选择照片
reChoose(){
  this.setData({
    isShowPic:false,
    src:''
  })
},

//测试颜值分数的函数
getFaceInfo(){
//console.log('调用了测颜值的函数')
//console.log(app.globalData1)
const token = app.globalData1.access_token
if(!token){
  return wx.showToast({
    title: '鉴权失败唔！',
  })
}
//把用户选择的图片转码为base64格式的字符串
const fileManager = wx.getFileSystemManager()
const fileStr = fileManager.readFileSync(this.data.src,'base64') //用readFileSync方法用指定编码格式读取路径下的图片

//进行颜值的检测
wx.request({
  method: 'POST',
  url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token='+token,
  header:{
    'Content-Type':'application/json'
  },
  data:{
    image_type: 'BASE64',
    image:fileStr,
    //年龄，颜值分数，表情，性别，是否戴眼镜，情绪
    face_field:'age,beauty,expression,gender,glasses,emotion',
  },
  success: (res) => {
    console.log(res)
    if(res.data.result.face_num <= 0){
      return wx.showToast({
        title: '未检测到人脸！',
      })
    }
    this.setData({
      faceInfo:res.data.result.face_list[0]
    })
  },
  fail: () => {
    wx.showToast({
      title: '颜值鉴定失败！',
    })
  }
})
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})