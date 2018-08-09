const app = getApp();
Page({
  data: {
    ResDecksList: null,
    ResArchetypes: null,
    oSList: {
      all: {
        decks: [],
        names: []
      },
      warrior: {
        decks: [],
        names: []
      },
      paladin: {
        decks: [],
        names: []
      },
      hunter: {
        decks: [],
        names: []
      },
      druid: {
        decks: [],
        names: []
      },
      rogue: {
        decks: [],
        names: []
      },
      shaman: {
        decks: [],
        names: []
      },
      mage: {
        decks: [],
        names: []
      },
      warlock: {
        decks: [],
        names: []
      },
      priest: {
        decks: [],
        names: []
      },
    },
    oWList: {
      all: {
        decks: [],
        names: []
      },
      warrior: {
        decks: [],
        names: []
      },
      paladin: {
        decks: [],
        names: []
      },
      hunter: {
        decks: [],
        names: []
      },
      druid: {
        decks: [],
        names: []
      },
      rogue: {
        decks: [],
        names: []
      },
      shaman: {
        decks: [],
        names: []
      },
      mage: {
        decks: [],
        names: []
      },
      warlock: {
        decks: [],
        names: []
      },
      priest: {
        decks: [],
        names: []
      },
    },
    oPages: {
      allList: null,
      curList: null,
      allIndex: null,
      curIndex: 1,
    },
    bSortByGames: true,
    aMultiList: [
      ['标准模式', '狂野模式'],
      ['全部职业', '战士', '圣骑士', '猎人', '德鲁伊', '潜行者', '萨满祭司', '法师', '术士', '牧师'],
      ['全部原型']
    ],
    aMultiIndex: [0, 0, 0],
    aFilterList: null,
    bEmptyList: false,
    bLoadIng: true,
    nScrollH: null,
    nScrollT: 0,
  },

  onLoad: function() {
    let that = this;
    wx.clearStorage();
    // 获取页面高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          nScrollH: res.windowHeight - 60
        });
      }
    });
    let callback = function(_decks, _types) {
      that.setData({
        bLoadIng: false,
        ResDecksList: _decks,
        ResArchetypes: _types
      });
      that.setList();
    }
    require('../../funtions.js').getDeckAndType(callback);
  },

  onShow: function() {
    // 页面路由
    let arg = app.globalData.index2findArg;
    if (arg != null) {
      this.filterList(0, arg.index, 0);
      this.setData({
        aMultiIndex: [0, arg.index, 0]
      });
      this.pagination(this.data.oSList[arg.classes].decks, this.data.oPages.curIndex, true);
      app.globalData.index2findArg = null;
    }
  },

  setList: function() {
    let decks = this.data.ResDecksList;
    let types = this.data.ResArchetypes;
    let oSList = this.data.oSList;
    for (let c in decks) {
      for (let d in decks[c]) {
        delete decks[c][d]['avg_game_length_seconds'];
        delete decks[c][d]['avg_num_player_turns'];
        delete decks[c][d]['digest'];
        // 设置 classes 属性
        decks[c][d]['classes'] = c.toLowerCase();
        let classes = decks[c][d]['classes'];
        // 调整 win_rate 值
        decks[c][d]['win_rate'] = decks[c][d]['win_rate'].toFixed(1);
        // 对局数量后两位取整
        decks[c][d]['total_games'] = Math.round(decks[c][d]['total_games'] / 100) * 100;
        // 添加中文卡组名
        for (let t in types) {
          if (decks[c][d]['archetype_id'] == t) {
            decks[c][d]['archetype'] = types[t]
          }
        }
        // 分职业添加对象
        oSList[classes].decks.push(decks[c][d]);
        oSList[classes].names.push(decks[c][d].archetype);
        // 全部添加对象
        oSList.all.decks.push(decks[c][d]);
        oSList.all.names.push(decks[c][d].archetype);
      }
    }
    // 卡组名去重
    const unique = arr => [...new Set(arr)];
    for (let item in oSList) {
      oSList[item].names = unique(oSList[item].names);
      oSList[item].names.unshift("全部原型");
      this.setData({
        ['oSList.' + item + '.decks']: oSList[item].decks,
        ['oSList.' + item + '.names']: oSList[item].names,
      });
    }
    this.setData({
      ['aMultiList[2]']: oSList.all.names,
    });
    this.pagination(oSList.all.decks, this.data.oPages.curIndex, this.data.bSortByGames);
  },

  pagination: function(_shortList, _resetIndex, _sortByGames) {
    wx.showLoading({
      mask: true,
      title: '加载列表中…',
    })
    this.setData({
      ['oPages.curIndex']: _resetIndex
    })
    if (_sortByGames) {
      _shortList.sort((a, b) => b.total_games - a.total_games);
    } else {
      _shortList.sort((a, b) => b.win_rate - a.win_rate);
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
      nScrollT: 0
    });
    wx.hideLoading();
  },
  bindPageNext: function() {
    this.pagination(this.data.oPages.allList, ++this.data.oPages.curIndex, this.data.bSortByGames);
  },
  bindPagePrev: function() {
    this.pagination(this.data.oPages.allList, --this.data.oPages.curIndex, this.data.bSortByGames);
  },

  sortBtn: function(e) {
    let res = e.currentTarget.dataset.filter;
    if ((this.data.bSortByGames && res == 'total_games') || (!this.data.bSortByGames && res == 'win_rate')) {
      return false;
    }
    let _is;
    res == 'total_games' ? _is = true : _is = false;
    this.setData({
      bSortByGames: _is
    })
    this.pagination(this.data.oPages.allList, this.data.oPages.curIndex, this.data.bSortByGames)
  },

  bindMultiPickerChange: function(e) {
    this.setData({
      aMultiIndex: e.detail.value,
      bEmptyList: false
    });
    let col1Val = e.detail.value[0];
    let col2Val = e.detail.value[1];
    let col3Val = e.detail.value[2];
    this.filterList(col1Val, col2Val, col3Val);
    this.pagination(this.data.aFilterList, 1, this.data.bSortByGames);
  },
  bindMultiPickerColumnChange: function(e) {
    let oSList = this.data.oSList;
    let oWList = this.data.oWList;
    let data = {
      aMultiList: this.data.aMultiList,
      aMultiIndex: this.data.aMultiIndex
    };
    data.aMultiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      // 一级列表
      case 0:
        switch (data.aMultiIndex[0]) {
          case 0:
            data.aMultiList[1] = this.data.aMultiList[1];
            data.aMultiList[2] = oSList.all.names;
            break;
          case 1:
            data.aMultiList[1] = this.data.aMultiList[1];
            data.aMultiList[2] = oWList.all.names;
            break;
        }
        data.aMultiIndex[1] = 0;
        data.aMultiIndex[2] = 0;
        break;
        // 二级列表
      case 1:
        switch (data.aMultiIndex[0]) {
          // 标准模式
          case 0:
            switch (data.aMultiIndex[1]) {
              case 0:
                data.aMultiList[2] = oSList.all.names;
                break;
              case 1:
                data.aMultiList[2] = oSList.warrior.names;
                break;
              case 2:
                data.aMultiList[2] = oSList.paladin.names;
                break;
              case 3:
                data.aMultiList[2] = oSList.hunter.names;
                break;
              case 4:
                data.aMultiList[2] = oSList.druid.names;
                break;
              case 5:
                data.aMultiList[2] = oSList.rogue.names;
                break;
              case 6:
                data.aMultiList[2] = oSList.shaman.names;
                break;
              case 7:
                data.aMultiList[2] = oSList.mage.names;
                break;
              case 8:
                data.aMultiList[2] = oSList.warlock.names;
                break;
              case 9:
                data.aMultiList[2] = oSList.priest.names;
                break;
            }
            break;
            // 狂野模式
          case 1:
            switch (data.aMultiIndex[1]) {
              case 0:
                data.aMultiList[2] = oWList.all.names;
                break;
              case 1:
                data.aMultiList[2] = oWList.warrior.names;
                break;
              case 2:
                data.aMultiList[2] = oWList.paladin.names;
                break;
              case 3:
                data.aMultiList[2] = oWList.hunter.names;
                break;
              case 4:
                data.aMultiList[2] = oWList.druid.names;
                break;
              case 5:
                data.aMultiList[2] = oWList.rogue.names;
                break;
              case 6:
                data.aMultiList[2] = oWList.shaman.names;
                break;
              case 7:
                data.aMultiList[2] = oWList.mage.names;
                break;
              case 8:
                data.aMultiList[2] = oWList.warlock.names;
                break;
              case 9:
                data.aMultiList[2] = oWList.priest.names;
                break;
            }
            break;
        }
        data.aMultiIndex[2] = 0;
        break;
    }
    this.setData(data);
  },
  filterList: function(col1Val, col2Val, col3Val) {
    this.setData({
      bEmptyList: false
    })
    // 判断是标准还是狂野，赋值的对象
    let col1Obj;
    if (col1Val == 0) {
      col1Obj = this.data.oSList;
    } else if (col1Val == 1) {
      col1Obj = this.data.oWList;
    }
    // 获取对应的键值
    let col2Key = Object.keys(col1Obj);
    let col3Key = this.data.oSList[col2Key[col2Val]].names;
    let col2 = col2Key[col2Val];
    let col3 = col3Key[col3Val];
    let choose = col1Obj[col2].decks;
    let list = [];
    if (col3 == "全部原型") {
      // 如果选择全部原型，直接将全部原型展示
      // 没有可显示的内容
      if (choose.length == 0) {
        this.setData({
          bEmptyList: true
        })
      }
      choose.sort((a, b) => b.total_games - a.total_games);
      this.setData({
        aFilterList: choose
      });
    } else {
      // 否则先对应keys筛选，再展示筛选后的列表
      for (let deck in choose) {
        if (choose[deck].archetype == col3) {
          list.push(choose[deck]);
        }
      }
      list.sort((a, b) => b.total_games - a.total_games);
      this.setData({
        aFilterList: list
      });
    }
  },

  resetPicker: function() {
    this.filterList(0, 0, 0);
    this.setData({
      aMultiIndex: [0, 0, 0]
    });
    this.pagination(this.data.oSList.all.decks, 1, true);
  },

  toSinglePage: function(e) {
    let index = e.currentTarget.dataset.index;
    let data = this.data.oPages.curList[index];
    app.globalData.find2singleArg = data;
    wx.navigateTo({
      url: '../singleDeck/singleDeck'
    });
  },
})