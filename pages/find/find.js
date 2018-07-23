const app = getApp();
Page({
  data: {
    decksData: null,
    isDeckListNull: false,
    scrollHeight: null,
    multiArray: [
      ['全部模式', '标准模式', '狂野模式'],
      ['全部职业', '战士', '圣骑士', '猎人', '德鲁伊', '潜行者', '萨满祭司', '法师', '术士', '牧师'],
      ['全部原型']
    ],
    multiIndex: [0, 0, 0],
    dataArr: {
      all: {
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
      standard: {
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
      wild: {
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
      }
    },
  },

  onLoad: function() {
    // 获取页面高度
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight - 50
        });
      }
    });
    // 设置数据
    // 如果可以优先从缓存中读取，否则读取全局变量
    const decks = wx.getStorageSync('decks');
    if (decks) {
      this.setData({
        decksData: decks
      });
    } else {
      this.setData({
        decksData: app.globalData.decksData
      });
    }
    let data = this.data.decksData;
    let vArr = this.data.dataArr;
    for (let i = 0; i < data.length; i++) {
      // 标准模式
      if (data[i].format == 'standard') {
        for (let s in vArr.standard) {
          if (data[i].classes == s) {
            vArr.standard[s].decks.push(data[i]);
            vArr.standard[s].names.push(data[i].archetype);
          }
        }
        vArr.standard.all.decks.push(data[i]);
        vArr.standard.all.names.push(data[i].archetype);
      }
      // 狂野模式
      if (data[i].format == 'wild') {
        for (let w in vArr.wild) {
          if (data[i].classes == w) {
            vArr.wild[w].decks.push(data[i]);
            vArr.wild[w].names.push(data[i].archetype);
          }
        }
        vArr.wild.all.decks.push(data[i]);
        vArr.wild.all.names.push(data[i].archetype);
      }
      // 全部模式
      for (let a in vArr.all) {
        if (data[i].classes == a) {
          vArr.all[a].decks.push(data[i]);
          vArr.all[a].names.push(data[i].archetype);
        }
      }
      vArr.all.all.decks.push(data[i]);
      vArr.all.all.names.push(data[i].archetype);
    }
    // 循环结束
    // 数组去重
    const unique = arr => [...new Set(arr)];
    for (let uniItem in vArr.standard) {
      vArr.standard[uniItem].names = unique(vArr.standard[uniItem].names);
      vArr.standard[uniItem].names.unshift("全部原型");
    }
    for (let uniItem in vArr.wild) {
      vArr.wild[uniItem].names = unique(vArr.wild[uniItem].names);
      vArr.wild[uniItem].names.unshift("全部原型");
    }
    for (let uniItem in vArr.all) {
      vArr.all[uniItem].names = unique(vArr.all[uniItem].names);
      vArr.all[uniItem].names.unshift("全部原型");
    }
    // 修改 page-data
    for (let classes in this.data.dataArr.standard) {
      this.setData({
        ['dataArr.standard.' + classes + '.decks']: vArr.standard[classes].decks,
        ['dataArr.standard.' + classes + '.names']: vArr.standard[classes].names,
        ['dataArr.wild.' + classes + '.decks']: vArr.wild[classes].decks,
        ['dataArr.wild.' + classes + '.names']: vArr.wild[classes].names,
        ['dataArr.all.' + classes + '.decks']: vArr.all[classes].decks,
        ['dataArr.all.' + classes + '.names']: vArr.all[classes].names,
        ['multiArray[2]']: vArr.all.all.names,
      })
    }
    console.log(this.data.dataArr);
  },

  onShow: function() {
    // 页面路由
    if (app.globalData.index2findArg != null) {
      this.filterList(0, app.globalData.index2findArg, 0);
      this.setData({
        multiIndex: [0, app.globalData.index2findArg, 0]
      });
      app.globalData.index2findArg = null;
    }
  },

  bindMultiPickerChange: function(e) {
    this.setData({
      multiIndex: e.detail.value,
      isDeckListNull: false
    });
    let col1Val = e.detail.value[0];
    let col2Val = e.detail.value[1];
    let col3Val = e.detail.value[2];
    this.filterList(col1Val, col2Val, col3Val);
  },

  bindMultiPickerColumnChange: function(e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    let dataArr = this.data.dataArr;
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      // 一级列表
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = this.data.multiArray[1];
            data.multiArray[2] = dataArr.all.all.names;
            break;
          case 1:
            data.multiArray[1] = this.data.multiArray[1];
            data.multiArray[2] = dataArr.standard.all.names;
            break;
          case 2:
            data.multiArray[1] = this.data.multiArray[1];
            data.multiArray[2] = dataArr.wild.all.names;
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
        // 二级列表
      case 1:
        switch (data.multiIndex[0]) {
          // 全部
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = dataArr.all.all.names;
                break;
              case 1:
                data.multiArray[2] = dataArr.all.warrior.names;
                break;
              case 2:
                data.multiArray[2] = dataArr.all.paladin.names;
                break;
              case 3:
                data.multiArray[2] = dataArr.all.hunter.names;
                break;
              case 4:
                data.multiArray[2] = dataArr.all.druid.names;
                break;
              case 5:
                data.multiArray[2] = dataArr.all.rogue.names;
                break;
              case 6:
                data.multiArray[2] = dataArr.all.shaman.names;
                break;
              case 7:
                data.multiArray[2] = dataArr.all.mage.names;
                break;
              case 8:
                data.multiArray[2] = dataArr.all.warlock.names;
                break;
              case 9:
                data.multiArray[2] = dataArr.all.priest.names;
                break;
            }
            break;
            // 标准模式
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = dataArr.standard.all.names;
                break;
              case 1:
                data.multiArray[2] = dataArr.standard.warrior.names;
                break;
              case 2:
                data.multiArray[2] = dataArr.standard.paladin.names;
                break;
              case 3:
                data.multiArray[2] = dataArr.standard.hunter.names;
                break;
              case 4:
                data.multiArray[2] = dataArr.standard.druid.names;
                break;
              case 5:
                data.multiArray[2] = dataArr.standard.rogue.names;
                break;
              case 6:
                data.multiArray[2] = dataArr.standard.shaman.names;
                break;
              case 7:
                data.multiArray[2] = dataArr.standard.mage.names;
                break;
              case 8:
                data.multiArray[2] = dataArr.standard.warlock.names;
                break;
              case 9:
                data.multiArray[2] = dataArr.standard.priest.names;
                break;
            }
            break;
            // 狂野模式
          case 2:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = dataArr.wild.all.names;
                break;
              case 1:
                data.multiArray[2] = dataArr.wild.warrior.names;
                break;
              case 2:
                data.multiArray[2] = dataArr.wild.paladin.names;
                break;
              case 3:
                data.multiArray[2] = dataArr.wild.hunter.names;
                break;
              case 4:
                data.multiArray[2] = dataArr.wild.druid.names;
                break;
              case 5:
                data.multiArray[2] = dataArr.wild.rogue.names;
                break;
              case 6:
                data.multiArray[2] = dataArr.wild.shaman.names;
                break;
              case 7:
                data.multiArray[2] = dataArr.wild.mage.names;
                break;
              case 8:
                data.multiArray[2] = dataArr.wild.warlock.names;
                break;
              case 9:
                data.multiArray[2] = dataArr.wild.priest.names;
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
  },

  filterList: function(col1Val, col2Val, col3Val) {
    this.setData({
      isDeckListNull: false
    })
    let col1Key = Object.keys(this.data.dataArr);
    let col2Key = Object.keys(this.data.dataArr[col1Key[col1Val]]);
    let col3Key = this.data.dataArr[col1Key[col1Val]][col2Key[col2Val]].names;
    let col1 = col1Key[col1Val];
    let col2 = col2Key[col2Val];
    let col3 = col3Key[col3Val];
    let choose = this.data.dataArr[col1][col2].decks;
    let curList = [];
    if (col3 == "全部原型") {
      // 如果选择全部原型，直接将全部原型展示
      // 没有可显示的内容
      if (choose.length == 0) {
        this.setData({
          isDeckListNull: true
        })
      }
      this.setData({
        decksData: choose
      });
    } else {
      // 否则先对应keys筛选，再展示筛选后的列表
      for (let deck in choose) {
        if (choose[deck].archetype == col3) {
          curList.push(choose[deck]);
        }
      }
      this.setData({
        decksData: curList
      });
    }
  },

  resetPicker: function() {
    this.filterList(0, 0, 0);
    this.setData({
      multiIndex: [0, 0, 0]
    });
  },

  toSinglePage: function(e) {
    let index = e.currentTarget.dataset.index;
    let data = this.data.decksData[index];
    app.globalData.find2singleArg = data;
    wx.navigateTo({
      url: '../singleDeck/singleDeck'
    });
  },
})