App({

  globalData: {
    cardsData: null,
    decksData: null,
    index2findArg: null,
    find2singleArg: null,
  },

  onLaunch: function(scene) {
    let that = this;
    wx.showLoading({
      mask: true,
      title: '加载数据中…',
    });
    wx.hideTabBar();
    // 请求卡牌数据
    wx.request({
      url: 'https://wxapp-1257102469.cos.ap-shanghai.myqcloud.com/cards.json',
      success: function(res) {
        that.globalData.cardsData = res.data;
        wx.setStorage({
          key: "cards",
          data: res.data
        });
        wx.request({
          url: 'https://wxapp-1257102469.cos.ap-shanghai.myqcloud.com/decks_list.json',
          success: function(res) {
            that.globalData.decksData = res.data.series.data;
            wx.setStorage({
              key: "decks",
              data: res.data.series.data
            });
            wx.hideLoading();
            wx.showTabBar();
          },
          fail: function() {
            wx.showToast({
              title: '加载数据失败，请删除小程序后重新进入',
              duration: 10000
            })
          }
        });
      },
      fail: function() {
        wx.showToast({
          title: '加载数据失败，请删除小程序后重新进入',
          duration: 10000
        })
      }
    });
  },

})