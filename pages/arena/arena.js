Page({

  data: {
    // 滚动区相关
    nScrollT: 0,
    nScrollH: 0,
    // 基础
    oCards: null,
    oArena: null,
    oLoadStatus: {
      ALL: false,
      DRUID: false,
      HUNTER: false,
      MAGE: false,
      PALADIN: false,
      PRIEST: false,
      ROGUE: false,
      SHAMAN: false,
      WARLOCK: false,
      WARRIOR: false,
    },
    // 分页
    oPages: {
      allList: null,
      curList: null,
      allIndex: null,
      curIndex: 1,
      sort: false
    },
    // 弹窗
    bModuleOpen: false,
    oPageShow: null,
    oPageHide: null,
    nFilterP: -500,
    oClassMenu: [{
        name: '小德',
        key: 'DRUID',
        status: false
      },
      {
        name: '猎人',
        key: 'HUNTER',
        status: false
      },
      {
        name: '法师',
        key: 'MAGE',
        status: false
      },
      {
        name: '骑士',
        key: 'PALADIN',
        status: false
      },
      {
        name: '牧师',
        key: 'PRIEST',
        status: false
      },
      {
        name: '盗贼',
        key: 'ROGUE',
        status: false
      },
      {
        name: '萨满',
        key: 'SHAMAN',
        status: false
      },
      {
        name: '术士',
        key: 'WARLOCK',
        status: false
      },
      {
        name: '战士',
        key: 'WARRIOR',
        status: false
      },
    ],
  },

  onLoad: function(options) {
    let that = this;
    // 获取页面高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          nScrollH: res.windowHeight - 50,
          nFilterP: -res.windowWidth
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
    wx.showLoading({
      mask: true,
      title: '加载列表中…',
    });

    let arena = this.data.oArena;
    let cards = this.data.oCards;

    // 判断加载状态 → 添加属性
    if (!this.data.oLoadStatus[classes]) {
      const compact = (arr) => arr.filter(v => v);
      for (let a in arena[classes]) {
        arena[classes][a].popularity = arena[classes][a].popularity.toFixed(2);
        arena[classes][a].count = arena[classes][a].count.toFixed(1);
        arena[classes][a].winrate = arena[classes][a].winrate.toFixed(1);
        if (arena[classes][a].popularity < 0.05) {
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
        ['oLoadStatus.' + classes]: true,
      });
    }
    this.pagination(arena[classes], 1, this.data.oPages.sort);
    wx.hideLoading();
  },

  pagination: function(_shortList, _resetIndex, _sort) {
    wx.showLoading({
      mask: true,
      title: '加载列表中…',
    });
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
    let items = 50;
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
  },

  moduleOpen: function() {
    // 添加切换按钮动画
    let pageShow = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    });
    pageShow.right(0).step();
    this.setData({
      bModuleOpen: true,
      oPageShow: pageShow.export()
    });
  },
  moduleClose: function() {
    let that = this;
    // 添加切换按钮动画
    let pageShow = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 200,
      timingFunction: "ease",
      delay: 0
    });
    pageShow.right(that.data.nFilterP).step();
    this.setData({
      oPageShow: pageShow.export()
    });
    setTimeout(function() {
      that.setData({
        bModuleOpen: false
      });
    }, 100);
  },

  filterClasses: function(e) {
    let choose = e.currentTarget.dataset.classes;
    let menu = this.data.oClassMenu;
    let res;
    for (let i in menu) {
      if (menu[i].key == choose) {
        menu[i].status = !menu[i].status;
      } else {
        menu[i].status = false;
      }
    }
    for (let i in menu) {
      if (menu[i].status == true) {
        res = menu[i].key;
      }
    }
    this.setData({
      oClassMenu: menu
    })
    if (res) {
      this.setList(res);
    } else {
      this.pagination(this.data.oArena.ALL, 1, this.data.oPages.sort);
    }
  },

  resetFilter: function() {
    let menu = this.data.oClassMenu;
    for (let i in menu) {
      menu[i].status = false;
    }
    this.setData({
      oClassMenu: menu
    });
    this.pagination(this.data.oArena.ALL, 1, this.data.oPages.sort);
  },

  clear: function() {
    require('../../funtions.js').clearStorage('/pages/arena/arena', 'arena');
  },

})