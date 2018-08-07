function fnRequestFail() {
  wx.showModal({
    title: '错误提示',
    content: '请求数据失败，页面可能无法正常显示。请尝试删除小程序后再次进入，给您带来的不变深表歉意T.T',
    showCancel: false,
    confirmText: '好'
  })
}
module.exports.fnRequestFail = fnRequestFail;