const app = getApp();
Page({
  data: {
    deckData: null,
    cardsData: null,
    isLoading: true,
    gWidth: null,
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
    // 从 find 页面进入 (读取到 find 传参)
    if (app.globalData.find2singleArg != null) {
      this.setData({
        deckData: app.globalData.find2singleArg
      });
    }
    // 从转发进入 (读取到分享链接参数)
    if (options.id != null) {
      let data = app.globalData.decksData;
      for (let i = 0; i < data.length; i++) {
        if (data[i].codeLink == options.id) {
          this.setData({
            deckData: data[i]
          });
        }
      }
    }
  },

  onShow: function() {
    let that = this;
    // 修改页面标题
    wx.setNavigationBarTitle({
      title: this.data.deckData.archetype
    })
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
    // 遍历卡牌，获取对象列表
    let cardsAllObj = this.getCardsObj(deck, cards);
    // 遍历卡组，获取分类数组
    let checkDeckRes = this.checkDeck(cardsAllObj);
    let typeArg = checkDeckRes.typeArg;
    let rarityArg = checkDeckRes.rarityArg;
    // 修改数据
    this.setData({
      deckData: that.data.deckData,
      isLoading: false,
    });
    // 绘制 canvas
    this.drawArc('typeCanvas', typeArg);
    this.drawArc('rarityCanvas', rarityArg);
    wx.hideLoading();
  },

  getCardsObj: function(deck, cards) {
    let cardsAllObj = [],
      cardsNeutralObj = [],
      cardsClassObj = [],
      cardsNeutralCount = 0,
      cardsClassCount = 0;
    for (let x = 0; x < deck.cardsAll.length; x++) {
      for (let y = 0; y < cards.length; y++) {
        if (deck.cardsAll[x].id == cards[y].id) {
          cards[y].copy = deck.cardsAll[x].copy;
          cardsAllObj.push(cards[y]);
          if (cards[y].cardClass == 'NEUTRAL') {
            cardsNeutralObj.push(cards[y]);
            cardsNeutralCount += parseInt(cards[y].copy);
          } else {
            cardsClassObj.push(cards[y]);
          }
          break;
        }
      }
    }
    deck.cardsNeutral = cardsNeutralObj;
    deck.cardsClass = cardsClassObj;
    deck.cardsNeutralCount = cardsNeutralCount;
    return cardsAllObj;
  },

  checkDeck: function(cards) {
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
    for (let i = 0; i < cards.length; i++) {
      // 遍历卡牌类型
      if (cards[i].type == 'MINION') {
        cMinion += parseInt(cards[i].copy);
        shareArr.push(cards[i].name);
      }
      if (cards[i].type == 'SPELL') {
        cSpell += parseInt(cards[i].copy);
      }
      if (cards[i].type == 'WEAPON') {
        cWeapon += parseInt(cards[i].copy);
      }
      if (cards[i].type == 'HERO') {
        cHero += parseInt(cards[i].copy);
      }
      // 遍历稀有度
      if (cards[i].rarity == 'FREE') {
        cFree += parseInt(cards[i].copy);
      }
      if (cards[i].rarity == 'COMMON') {
        cCommon += parseInt(cards[i].copy);
      }
      if (cards[i].rarity == 'RARE') {
        cRare += parseInt(cards[i].copy);
      }
      if (cards[i].rarity == 'EPIC') {
        cEpic += parseInt(cards[i].copy);
      }
      if (cards[i].rarity == 'LEGENDARY') {
        cLegendary += parseInt(cards[i].copy);
      }
      // 遍历费用
      if (cards[i].cost == 0) {
        cost0 += parseInt(cards[i].copy);
      } else if (cards[i].cost == 1) {
        cost1 += parseInt(cards[i].copy);
      } else if (cards[i].cost == 2) {
        cost2 += parseInt(cards[i].copy);
      } else if (cards[i].cost == 3) {
        cost3 += parseInt(cards[i].copy);
      } else if (cards[i].cost == 4) {
        cost4 += parseInt(cards[i].copy);
      } else if (cards[i].cost == 5) {
        cost5 += parseInt(cards[i].copy);
      } else if (cards[i].cost == 6) {
        cost6 += parseInt(cards[i].copy);
      } else if (cards[i].cost > 6) {
        cost7 += parseInt(cards[i].copy);
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
    this.data.deckData.cost = costData;
    this.data.deckData.share = shareArr;
    return {
      typeArg: typeArg,
      rarityArg: rarityArg
    }
  },

  drawArc: function(canvasId, typeArg) {
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
  },

  // 复制卡组代码
  copyCode: function() {
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

  // 分享设置
  onShareAppMessage: function(res) {
    // 设置分享标题
    let arr = this.data.deckData.share
    let shareName;
    if (arr != []) {
      shareName = arr[Math.floor(Math.random() * arr.length)];
    } else {
      shareName = '小精灵';
    }
    // 传参
    let arg = this.data.deckData.codeLink;
    return {
      title: shareName + '向你推荐「' + this.data.deckData.archetype + '」',
      path: '/pages/singleDeck/singleDeck?id=' + arg,
    }
  },

  toHome: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
})