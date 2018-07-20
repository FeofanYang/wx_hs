App({
  globalData: {
    index2findArg: null,
    find2singleArg: null,
    cardsData: null,
    decksData: null,
  },

  onLaunch: function(scene) {
    let that = this;
    wx.showLoading({
      title: '加载数据中…',
    });
    wx.hideTabBar();
    // 先请求卡组数据
    wx.request({
      url: 'https://wxapp-1257102469.cos.ap-shanghai.myqcloud.com/decks.json',
      success: function(res) {
        that.globalData.decksData = res.data;
        wx.setStorage({
          key: "decks",
          data: res.data
        });
        // 再请求卡牌数据
        wx.request({
          url: 'https://wxapp-1257102469.cos.ap-shanghai.myqcloud.com/cards.json',
          success: function(res) {
            that.globalData.cardsData = res.data;
            wx.setStorage({
              key: "cards",
              data: res.data
            });
            wx.hideLoading();
            wx.showTabBar();
          }
        });
      }
    });
  },
})