const app = getApp();
Page({
  data: {
    deckData: null,
    cardsData: null,
    classCardsRes: null,
    neutralCardsRes: null,
    isLoading: true,
    loadCount: 0,
    shareData: '小精灵',
    gWidth: null,
    costData: null
  },

  onReady: function() {
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#cardList').boundingClientRect()
    query.exec(function(res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
      console.log(res);
      //取高度
      console.log(res[0].height);
    })
  },

  onShareAppMessage: function(res) {
    let arr = this.data.shareData
    let shareName;
    if (arr != []) {
      shareName = arr[Math.floor(Math.random() * arr.length)];
    } else {
      shareName = '小精灵';
    }
    return {
      title: shareName + '向你推荐「' + this.data.deckData.archetype + '」',
    }
  },

  onLoad: function(options) {
    let that = this;
    wx.showLoading({
      title: '读取卡组中',
    })
    // 如果可以优先从缓存中读取，否则读取全局变量
    const cards = wx.getStorageSync('cards');
    if (cards) {
      this.setData({
        cardsData: cards
      });
    } else {
      this.setData({
        cardsData: app.globalData.cards
      });
    }
  },

  onShow: function() {
    if (app.globalData.find2singleArg != null) {
      this.setData({
        deckData: app.globalData.find2singleArg
      });
    }
    // 修改页面标题
    wx.setNavigationBarTitle({
      title: this.data.deckData.archetype
    })
    let that = this;
    // 获取设备宽度
    wx.getSystemInfo({
      success: function(res) {
        let width = res.windowWidth;
        that.setData({
          gWidth: width
        })
      }
    })
    let deck = this.data.deckData,
      cards = this.data.cardsData;
    let cardsAllObj = [],
      cardsNeutralObj = [],
      cardsClassObj = [];
    // 遍历卡牌，获取对象列表
    for (let x = 0; x < deck.cardsAll.length; x++) {
      for (let y = 0; y < cards.length; y++) {
        if (deck.cardsAll[x].id == cards[y].id) {
          cards[y].copy = deck.cardsAll[x].copy;
          cardsAllObj.push(cards[y]);
          if (cards[y].cardClass == 'NEUTRAL') {
            cardsNeutralObj.push(cards[y]);
          } else {
            cardsClassObj.push(cards[y]);
          }
          break;
        }
      }
    }
    let cMinion = 0,
      cSpell = 0,
      cWeapon = 0,
      cHero = 0;
    let shareArr = [];
    let cFree = 0,
      cCommon = 0,
      cRare = 0,
      cEpic = 0,
      cLegendary = 0;
    let costArr = [],
      cost0 = 0,
      cost1 = 0,
      cost2 = 0,
      cost3 = 0,
      cost4 = 0,
      cost5 = 0,
      cost6 = 0,
      cost7 = 0;
    // 遍历卡组，获取分类数组
    for (let i = 0; i < cardsAllObj.length; i++) {
      // 遍历卡牌类型
      if (cardsAllObj[i].type == 'MINION') {
        cMinion += parseInt(cardsAllObj[i].copy);
        shareArr.push(cardsAllObj[i].name);
      }
      if (cardsAllObj[i].type == 'SPELL') {
        cSpell += parseInt(cardsAllObj[i].copy);
      }
      if (cardsAllObj[i].type == 'WEAPON') {
        cWeapon += parseInt(cardsAllObj[i].copy);
      }
      if (cardsAllObj[i].type == 'HERO') {
        cHero += parseInt(cardsAllObj[i].copy);
      }
      // 遍历稀有度
      if (cardsAllObj[i].rarity == 'FREE') {
        cFree += parseInt(cardsAllObj[i].copy);
      }
      if (cardsAllObj[i].rarity == 'COMMON') {
        cCommon += parseInt(cardsAllObj[i].copy);
      }
      if (cardsAllObj[i].rarity == 'RARE') {
        cRare += parseInt(cardsAllObj[i].copy);
      }
      if (cardsAllObj[i].rarity == 'EPIC') {
        cEpic += parseInt(cardsAllObj[i].copy);
      }
      if (cardsAllObj[i].rarity == 'LEGENDARY') {
        cLegendary += parseInt(cardsAllObj[i].copy);
      }
      // 遍历费用
      if (cardsAllObj[i].cost == 0) {
        cost0 += parseInt(cardsAllObj[i].copy);
      } else if (cardsAllObj[i].cost == 1) {
        cost1 += parseInt(cardsAllObj[i].copy);
      } else if (cardsAllObj[i].cost == 2) {
        cost2 += parseInt(cardsAllObj[i].copy);
      } else if (cardsAllObj[i].cost == 3) {
        cost3 += parseInt(cardsAllObj[i].copy);
      } else if (cardsAllObj[i].cost == 4) {
        cost4 += parseInt(cardsAllObj[i].copy);
      } else if (cardsAllObj[i].cost == 5) {
        cost5 += parseInt(cardsAllObj[i].copy);
      } else if (cardsAllObj[i].cost == 6) {
        cost6 += parseInt(cardsAllObj[i].copy);
      } else if (cardsAllObj[i].cost > 6) {
        cost7 += parseInt(cardsAllObj[i].copy);
      }
    }
    let typeArg = [{
        name: '随从',
        count: cMinion,
        percent: cMinion / 30,
        color: '#abd473'
      },
      {
        name: '法术',
        count: cSpell,
        percent: cSpell / 30,
        color: '#0070de'
      },
      {
        name: '武器',
        count: cWeapon,
        percent: cWeapon / 30,
        color: '#c41e3b'
      },
      {
        name: '英雄',
        count: cHero,
        percent: cHero / 30,
        color: '#a48529'
      }
    ];
    let rarityArg = [{
        name: '免费',
        count: cFree,
        percent: cFree / 30,
        color: '#d3d3d3'
      }, {
        name: '普通',
        count: cCommon,
        percent: cCommon / 30,
        color: '#a9a9a9'
      },
      {
        name: '稀有',
        count: cRare,
        percent: cRare / 30,
        color: '#0070dd'
      },
      {
        name: '史诗',
        count: cEpic,
        percent: cEpic / 30,
        color: '#a335ee'
      },
      {
        name: '传说',
        count: cLegendary,
        percent: cLegendary / 30,
        color: '#ff8000'
      },
    ];
    const arrayMax = arr => Math.max(...arr);
    costArr = [cost0, cost1, cost2, cost3, cost4, cost5, cost6, cost7]
    let costMax = arrayMax(costArr);
    let costData = {
      arr: costArr,
      max: costMax
    };
    // 修改数据
    this.setData({
      classCardsRes: cardsClassObj,
      neutralCardsRes: cardsNeutralObj,
      classCardLength: 30 - deck.cardsNeutralCount,
      neutralCardsLength: deck.cardsNeutralCount,
      shareData: shareArr,
      isLoading: false,
      costData: costData,
    });
    this.drawArc('typeCanvas', typeArg);
    this.drawArc('rarityCanvas', rarityArg);
  },

  copyCode: function() {
    // 复制卡组代码
    wx.setClipboardData({
      data: this.data.deckData.codeCore,
      success: function(res) {
        wx.showToast({
          title: "代码已复制~",
          icon: "success"
        });
      }
    })
  },

  cardOnLoad: function(e) {
    // 图片加载
    this.setData({
      loadCount: ++this.data.loadCount
    });
    if (this.data.loadCount >= this.data.deckData.cardsAll.length) {
      wx.hideLoading();
    }
  },

  drawArc: function(canvasId, typeArg) {
    // 绘制函数
    let ctx = wx.createCanvasContext(canvasId)
    let width = this.data.gWidth,
      padding = 50,
      textPadding = 30;
    // 半径 & 圆心
    let radius = width * 0.5 * 0.6 - padding * 0.5,
      ox = radius + width * 0.4,
      oy = radius;
    // 弧度开始 & 结束
    let startAngle = 0,
      endAngle = 0;
    // 图例
    let pwidth = 10,
      pheight = 10,
      posX = padding,
      posY = pheight + textPadding;
    // 文字开始位置
    let textX = posX + pwidth + 5,
      textY = posY + 5;
    let count = 0;
    for (let i = 0; i < typeArg.length; i++) {
      if (typeArg[i].count != 0) {
        // 绘制扇区
        startAngle = startAngle + typeArg[i].percent * Math.PI * 2;
        ctx.fillStyle = typeArg[i].color;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.arc(ox, oy, radius, startAngle, endAngle, true);
        ctx.closePath();
        // 绘制图例
        ctx.arc(posX, posY + textPadding * count, 8, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        endAngle = startAngle;
        // 绘制文字
        ctx.moveTo(posX, posY + textPadding * count);
        ctx.fillStyle = '#000';
        ctx.font = "16px 微软雅黑";
        let text = typeArg[i].name + "×" + typeArg[i].count;
        ctx.fillText(text, textX, textY + textPadding * count);
        count++;
      }
    }
    ctx.draw();
  }
})