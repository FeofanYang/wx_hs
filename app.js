App({
  globalData: {
    index2findArg: null,
    find2singleArg: null,
    cardsData: null,
    decksData: null,
  },

  onLaunch: function() {
    let that = this;
    // 先请求卡组数据
    wx.request({
      url: 'https://wxapp-1257102469.cos.ap-shanghai.myqcloud.com/decks.json',
      success: function(res) {
        that.globalData.decksData = res.data;
        // 再请求卡牌数据
        wx.request({
          url: 'https://wxapp-1257102469.cos.ap-shanghai.myqcloud.com/cards.json',
          success: function(res) {
            that.globalData.cardsData = res.data;
            wx.setStorage({
              key: "cards",
              data: res.data
            });
            wx.redirectTo({
              url: '/pages/find/find',
            });
          }
        });
      }
    });
  },
})