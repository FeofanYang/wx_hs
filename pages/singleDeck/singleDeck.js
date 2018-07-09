const app = getApp();
Page({
  data: {
    deckData: null,
    cardsData: null,
    classCardsRes: null,
    neutralCardsRes: null,
    isLoading: true,
    loadCount: 0,
    shareArr: '小精灵',
    gWidth: null,
  },

  onShareAppMessage: function(res) {
    let arr = this.data.shareArr
    let shareName;
    if (arr != []) {
      shareName = arr[Math.floor(Math.random() * arr.length)];
    } else {
      shareName = '小精灵';
    }
    return {
      title: shareName + '推荐了一套「' + this.data.deckData.archetype + '」给你',
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
    let deck = this.data.deckData;
    let cards = this.data.cardsData;
    let cardsClassObj = [];
    let cardsNeutralObj = [];
    let cardsAllObj = [];
    let typeObj = {
      typeV: null,
      name: null,
      len: null,
      percent: null,
      color: null
    }
    // 修改页面标题
    wx.setNavigationBarTitle({
      title: this.data.deckData.archetype
    })
    // 获取卡牌对象
    for (let x = 0; x < deck.cardsAll.length; x++) {
      for (let y = 0; y < cards.length; y++) {
        if (deck.cardsAll[x].id == cards[y].id) {
          cards[y].copy = deck.cardsAll[x].copy;
          cardsAllObj.push(cards[y]);
          break;
        }
      }
    }
    let minionC = 0,
      spellC = 0,
      weaponC = 0,
      heroC = 0;
    let shareArr = [];
    // 遍历卡组
    for (let i = 0; i < cardsAllObj.length; i++) {
      if (cardsAllObj[i].type == 'MINION') {
        minionC += parseInt(cardsAllObj[i].copy);
        shareArr.push(cardsAllObj[i].name);
      }
      if (cardsAllObj[i].type == 'SPELL') {
        spellC += parseInt(cardsAllObj[i].copy);
      }
      if (cardsAllObj[i].type == 'WEAPON') {
        weaponC += parseInt(cardsAllObj[i].copy);
      }
      if (cardsAllObj[i].type == 'HERO') {
        heroC += parseInt(cardsAllObj[i].copy);
      }
    }
    let typeArr = [minionC, spellC, weaponC, heroC];
    this.setData({
      shareArr: shareArr
    })
    // 获取中立卡牌数据
    for (let x = 0; x < deck.cardsNeutral.length; x++) {
      for (let y = 0; y < cards.length; y++) {
        if (deck.cardsNeutral[x].id == cards[y].id) {
          cards[y].copy = deck.cardsNeutral[x].copy;
          cardsNeutralObj.push(cards[y]);
          break;
        }
      }
    }
    // 获取职业卡牌数据
    for (let x = 0; x < deck.cardsClass.length; x++) {
      for (let y = 0; y < cards.length; y++) {
        if (deck.cardsClass[x].id == cards[y].id) {
          cards[y].copy = deck.cardsClass[x].copy;
          cardsClassObj.push(cards[y]);
          break;
        }
      }
    }
    // 修改数据 移除白板
    this.setData({
      classCardsRes: cardsClassObj,
      neutralCardsRes: cardsNeutralObj,
      classCardLength: 30 - deck.cardsNeutralCount,
      neutralCardsLength: deck.cardsNeutralCount,
      isLoading: false
    });
    // 绘制图形
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        let width = res.windowWidth * 0.5;
        that.setData({
          gWidth: width
        })
      }
    })
    this.drawArc(typeArr);
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

  cardOnLoad: function(e) {
    this.setData({
      loadCount: ++this.data.loadCount
    });
    if (this.data.loadCount >= this.data.deckData.cardsAll.length) {
      wx.hideLoading();
    }
  },

  drawArc: function(percent) {
    // 使用 wx.createContext 获取绘图上下文 context
    let ctx = wx.createCanvasContext('typeCanvas')
    let width = this.data.gWidth,
      padding = 20,
      textPadding = 20;
    // 半径 & 圆心
    let radius = width * 0.5 - padding,
      ox = radius + padding,
      oy = radius + padding;
    // 弧度开始&结束
    let startAngle = 0,
      endAngle = 0;
    //图例
    let pwidth = 10,
      pheight = 10,
      posX = padding,
      posY = width;
    // 文字开始位置
    let textX = posX + pwidth + 5,
      textY = posY + 10;
    // 数据
    let percentArr = [percent[0], percent[1], percent[2], percent[3]],
      colorArr = ["#73ac25", "#2472ac", "#b13643", "#a48529"],
      nameArr = ["随从", "法术", "武器", "英雄"];

    for (let i = 0; i < percentArr.length; i++) {
      endAngle = endAngle + percentArr[i] / 30 * Math.PI * 2;
      ctx.fillStyle = colorArr[i];
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.arc(ox, oy, radius, startAngle, endAngle, false);
      ctx.closePath();
      ctx.fill();
      startAngle = endAngle;
      // 绘制图例
      ctx.fillStyle = colorArr[i];
      ctx.fillRect(posX, posY + textPadding * i, pwidth, pheight);
      // 绘制文字
      ctx.moveTo(posX, posY + textPadding * i);
      ctx.fillStyle = colorArr[i];
      let percent = nameArr[i] + ":" + percentArr[i];
      ctx.fillText(percent, textX, textY + textPadding * i);
    }
    ctx.draw()
  }
})