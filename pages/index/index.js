const app = getApp();
Page({
  data: {
    winrateStatus: {
      standard: {
        name: '标准',
        status: true,
        BGI: 'icon-standard_icon'
      },
      wild: {
        name: '狂野',
        status: false,
        BGI: 'icon-wild_icon'
      },
      arena: {
        name: '竞技场',
        status: false,
        BGI: 'icon-arena_icon'
      },
    },
    winrateRes: null,
    winrateList: {
      standard: null,
      wild: null,
      arena: null,
    },
    curWinrateList: null,
    isWinrate: true,
    oBtnShow: null,
  },

  onLoad: function() {

    let that = this;
    let day = new Date();
    wx.setNavigationBarTitle({
      title: '每日排行 ' + day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate(),
    });
    wx.request({
      url: 'https://wxapp-1257102469.cos.ap-shanghai.myqcloud.com/winrate.json',
      success: function(res) {
        that.setData({
          winrateRes: res.data
        });
        let list = that.data.winrateList;
        list['standard'] = that.filterCurList(2);
        list['wild'] = that.filterCurList(30);
        list['arena'] = that.filterCurList(3);
        // 添加切换按钮动画
        let btnShow = wx.createAnimation({
          transformOrigin: "50% 50%",
          duration: 1000,
          timingFunction: "ease",
          delay: 0
        });
        btnShow.right(0).step();
        that.setData({
          winrateRes: that.data.winrateRes,
          curWinrateList: that.data.winrateList['standard'],
          winrateList: list,
          oBtnShow: btnShow.export()
        });
      },
      fail: function() {
        require('../../funtions.js').fnRequestFail();
      }
    });
  },

  chooseWinrate: function(e) {
    // 设置按钮的选择
    let winrateS = this.data.winrateStatus;
    let choose = e.currentTarget.dataset.choose;
    for (let obj in winrateS) {
      winrateS[obj].status = false;
    }
    winrateS[choose].status = true;
    // 筛选正确的列表
    this.setData({
      curWinrateList: this.data.winrateList[choose],
      winrateStatus: winrateS
    });
  },

  filterCurList: function(gt) {
    // 返回制定参数的数组对象
    let cur_winrateL = [];
    let winrataR = this.data.winrateRes.series.data;
    for (let classes in winrataR) {
      for (let types in winrataR[classes]) {
        if (winrataR[classes][types]['game_type'] == gt) {
          let name, index;
          if (classes == 'WARRIOR') {
            name = '战士';
            index = 1;
          } else if (classes == 'PALADIN') {
            name = '骑士';
            index = 2;
          } else if (classes == 'HUNTER') {
            name = '猎人';
            index = 3;
          } else if (classes == 'DRUID') {
            name = '小德';
            index = 4;
          } else if (classes == 'ROGUE') {
            name = '盗贼';
            index = 5;
          } else if (classes == 'SHAMAN') {
            name = '萨满';
            index = 6;
          } else if (classes == 'MAGE') {
            name = '法师';
            index = 7;
          } else if (classes == 'WARLOCK') {
            name = '术士';
            index = 8;
          } else if (classes == 'PRIEST') {
            name = '牧师';
            index = 9;
          }
          winrataR[classes][types]['classes'] = name;
          winrataR[classes][types]['classesEN'] = classes.toLowerCase();
          winrataR[classes][types]['win_rate'] = winrataR[classes][types]['win_rate'].toFixed(1);
          winrataR[classes][types]['popularity'] = winrataR[classes][types]['popularity'].toFixed(1);
          winrataR[classes][types]['index'] = index;
          cur_winrateL.push(winrataR[classes][types]);
        }
      }
    }
    cur_winrateL.sort((a, b) => b.win_rate - a.win_rate);
    return cur_winrateL;
  },

  toggle: function() {
    this.setData({
      isWinrate: !this.data.isWinrate
    })
    let cur = this.data.curWinrateList[0].game_type;
    if (cur == 2) {
      cur = 'standard';
    }
    if (cur == 3) {
      cur = 'arena';
    }
    if (cur == 30) {
      cur = 'wild';
    }
    let list = this.data.winrateList;
    if (this.data.isWinrate) {
      list['standard'].sort((a, b) => b.win_rate - a.win_rate);
      list['wild'].sort((a, b) => b.win_rate - a.win_rate);
      list['arena'].sort((a, b) => b.win_rate - a.win_rate);
    } else {
      list['standard'].sort((a, b) => b.popularity - a.popularity);
      list['wild'].sort((a, b) => b.popularity - a.popularity);
      list['arena'].sort((a, b) => b.popularity - a.popularity);
    }
    this.setData({
      winrateList: list,
      curWinrateList: this.data.winrateList[cur],
    });
  },

  toFindPage: function(e) {
    app.globalData.index2findArg = {
      index: e.currentTarget.dataset.index,
      classes: e.currentTarget.dataset.classes
    }
    wx.switchTab({
      url: '../find/find'
    });
  },

  onShareAppMessage: function() {},
})