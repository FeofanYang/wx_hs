Page({

  data: {
    nScrollT: 0,
    nScrollH: 0,
    oCards: null,
    oArena: null,
    oPages: {
      allList: null,
      curList: null,
      allIndex: null,
      curIndex: 1,
      sort: false
    },
  },

  onLoad: function(options) {
    let that = this;
    // 每次加载都重新请求 arena
    wx.removeStorageSync('arena');
    // 获取页面高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          nScrollH: res.windowHeight - 50 - 80
        });
      }
    });

    let callback = function(_cards, _arena) {
      that.setData({
        oCards: _cards,
        oArena: _arena
      });
      that.setList('ALL');
    }
    this.getData(callback);

  },

  getData: function(callback) {

    let _cards = wx.getStorageSync('cards');
    let _arena = wx.getStorageSync('arena');

    function getCards() {
      if (_cards) {
        console.log('读取到 cards');
        getArena();
      } else {
        console.log('未读取到 cards ，现场请求 cards');
        wx.showLoading({
          mask: true,
          title: '请求卡牌中…',
        });
        wx.request({
          url: 'https://wxapp-1257102469.cos.ap-shanghai.myqcloud.com/cards.json',
          success: function(res) {
            console.log('现场请求 cards 完成');
            // 删除部分卡牌属性 节省资源
            for (let i in res.data) {
              delete res.data[i]['artist'];
              delete res.data[i]['collectible'];
              delete res.data[i]['flavor'];
              delete res.data[i]['text'];
            }
            wx.setStorage({
              key: "cards",
              data: res.data
            });
            _cards = res.data;
            getArena();
            wx.hideLoading();
          },
          fail: function() {
            require('../../funtions.js').fnRequestFail();
          }
        });
      }
    }

    function getArena() {
      if (_arena) {
        console.log('读取到 arena');
        callback(_cards, _arena);
      } else {
        console.log('未读取到 arena ，现场请求 arena');
        wx.showLoading({
          mask: true,
          title: '请求列表中…',
        });
        wx.request({
          url: 'https://wxapp-1257102469.cos.ap-shanghai.myqcloud.com/arena.json',
          success: function(res) {
            console.log('现场请求 arena 完成');
            let arena = res.data.series.data;
            wx.setStorage({
              key: "arena",
              data: arena
            });
            _arena = arena;
            callback(_cards, _arena);
            wx.hideLoading();
          },
          fail: function() {
            require('../../funtions.js').fnRequestFail();
          }
        });
      }
    }

    getCards();

  },

  setList: function(classes) {

    let arena = this.data.oArena;
    let cards = this.data.oCards;

    // 添加属性
    const compact = (arr) => arr.filter(v => v);
    for (let a in arena[classes]) {
      arena[classes][a].popularity = arena[classes][a].popularity.toFixed(1);
      arena[classes][a].count = arena[classes][a].count.toFixed(1);
      arena[classes][a].winrate = arena[classes][a].winrate.toFixed(1);
      if (arena[classes][a].popularity < 1) {
        delete arena[classes][a];
      } else {
        for (let i = 0; i < cards.length; i++) {
          if (arena[classes][a].dbf_id == cards[i].dbfId) {
            arena[classes][a].id = cards[i].id;
            arena[classes][a].name = cards[i].name;
            arena[classes][a].cost = cards[i].cost;
            arena[classes][a].rarity = cards[i].rarity;
            break;
          }
        }
      }
    }
    arena[classes] = compact(arena[classes]);
    this.setData({
      ['oArena.' + classes]: arena[classes],
    });
    this.pagination(arena[classes], 1, this.data.oPages.sort);

  },

  pagination: function(_shortList, _resetIndex, _sort) {
    wx.showLoading({
      mask: true,
      title: '加载列表中…',
    })
    this.setData({
      ['oPages.curIndex']: _resetIndex
    })
    if (_sort == 'w') {
      _shortList.sort((a, b) => b.winrate - a.winrate);
    } else if (_sort == 'c') {
      _shortList.sort((a, b) => b.count - a.count);
    } else if (_sort == 'cost') {
      _shortList.sort((a, b) => b.cost - a.cost);
    } else {
      _shortList.sort((a, b) => b.popularity - a.popularity);
    }
    let items = 25;
    let allIndex = Math.ceil(_shortList.length / items);
    let curIndex = this.data.oPages.curIndex;
    // 设置分页
    let curList = [];
    for (let i = 0; i < _shortList.length; i++) {
      if (i >= items * (curIndex - 1) && i < items * curIndex) {
        curList.push(_shortList[i]);
        if (curList >= items) {
          break;
        }
      }
    }
    this.setData({
      ['oPages.allList']: _shortList,
      ['oPages.curList']: curList,
      ['oPages.allIndex']: allIndex,
      ['oPages.sort']: _sort,
      nScrollT: 0
    });
    wx.hideLoading();
  },
  bindPageFirst: function() {
    this.pagination(this.data.oPages.allList, 1, this.data.oPages.sort);
  },
  bindPageNext: function() {
    this.pagination(this.data.oPages.allList, ++this.data.oPages.curIndex, this.data.oPages.sort);
  },
  bindPagePrev: function() {
    this.pagination(this.data.oPages.allList, --this.data.oPages.curIndex, this.data.oPages.sort);
  },

  sortByP: function() {
    this.pagination(this.data.oPages.allList, 1, false);
  },
  sortByC: function() {
    this.pagination(this.data.oPages.allList, 1, 'c');
  },
  sortByCost: function() {
    this.pagination(this.data.oPages.allList, 1, 'cost');
  },
  sortByW: function() {
    this.pagination(this.data.oPages.allList, 1, 'w');
  }

})