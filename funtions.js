function fnRequestFail() {
  wx.showModal({
    title: '错误提示',
    content: '请求数据失败，页面可能无法正常显示。请尝试删除小程序后再次进入T.T',
    showCancel: false,
    confirmText: '好'
  })
}

function getDeckAndType(callback) {

  let _decks = wx.getStorageSync('decks');
  if (_decks) {
    console.log('读取到 decks');
    getTypes();
  } else {
    console.log('未读取到 decks，现场请求 decks');
    wx.showLoading({
      mask: true,
      title: '请求列表中…',
    });
    wx.request({
      url: 'https://wxapp-1257102469.cos.ap-shanghai.myqcloud.com/decks.json',
      success: function(res) {
        console.log('现场请求 decks 完成');
        wx.setStorage({
          key: "decks",
          data: res.data.series.data
        });
        _decks = res.data.series.data;
        getTypes();
        wx.hideLoading();
      },
      fail: function() {
        require('../../funtions.js').fnRequestFail()
      }
    });
  }

  function getTypes() {
    let _types = wx.getStorageSync('types');
    if (_types) {
      console.log('读取到 types');
      callback(_decks, _types);
    } else {
      console.log('未读取到 types，现场请求 types');
      wx.showLoading({
        mask: true,
        title: '请求卡组名中…',
      });
      wx.request({
        url: 'https://wxapp-1257102469.cos.ap-shanghai.myqcloud.com/archetypes.json',
        success: function(res) {
          console.log('现场请求 types 完成');
          wx.setStorage({
            key: "types",
            data: res.data
          });
          _types = res.data;
          callback(_decks, _types);
          wx.hideLoading();
        },
        fail: function() {
          require('../../funtions.js').fnRequestFail()
        }
      });
    }
  }

}

module.exports.fnRequestFail = fnRequestFail;
module.exports.getDeckAndType = getDeckAndType;