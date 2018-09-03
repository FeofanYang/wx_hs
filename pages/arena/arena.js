// arena.js
Page({


  data: {
    nScrollT: 0,
    nScrollH: 0,
    oArena: null,
    aCurList: []
  },

  onLoad: function(options) {

    let that = this;
    // 获取页面高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          nScrollH: res.windowHeight - 50
        });
      }
    });
    wx.request({
      url: 'https://wxapp-1257102469.cos.ap-shanghai.myqcloud.com/arena.json',
      success: function(res) {
        let cards = wx.getStorageSync('cards');
        let data = res.data.series.data;
        let list = that.data.aCurList;
        for (let i = 0; i < 50; i++) {
          list.push(data.ALL[i]);
        }
        // 添加属性
        for (let x in list) {
          list[x].popularity = list[x].popularity.toFixed(1);
          list[x].count = list[x].count.toFixed(1);
          list[x].winrate = list[x].winrate.toFixed(1);
          for (let y = 0; y < cards.length; y++) {
            if (list[x].dbf_id == cards[y].dbfId) {
              list[x].cost = cards[y].cost;
              list[x].id = cards[y].id;
              list[x].name = cards[y].name;
              list[x].rarity = cards[y].rarity;
              break;
            }
          }
        }
        that.setData({
          oArena: res.data.series.data,
          aCurList: list
        });
      },
      fail: function() {
        require('../../funtions.js').fnRequestFail();
      }
    });

  },

})