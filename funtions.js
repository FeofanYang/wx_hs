function fnRequestFail() {
  wx.showModal({
    title: '错误提示',
    content: '请求数据失败，页面可能无法正常显示。请尝试删除小程序后再次进入T.T',
    showCancel: false,
    confirmText: '好'
  })
}

function getDeckAndType(callback) {

  let _cards = wx.getStorageSync('cards');
  let _decks = wx.getStorageSync('decks');
  let _types = wx.getStorageSync('types');

  function getCards() {
    if (_cards) {
      console.log('读取到 cards');
      getDecks();
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
          wx.setStorage({
            key: "cards",
            data: res.data
          });
          _cards = res.data;
          getDecks();
          wx.hideLoading();
        },
        fail: function() {
          require('../../funtions.js').fnRequestFail();
        }
      });
    }
  }

  function getDecks() {
    if (_decks) {
      console.log('读取到 decks');
      getTypes();
    } else {
      console.log('未读取到 decks ，现场请求 decks');
      wx.showLoading({
        mask: true,
        title: '请求列表中…',
      });
      wx.request({
        url: 'https://wxapp-1257102469.cos.ap-shanghai.myqcloud.com/decks.json',
        success: function(res) {
          console.log('现场请求 decks 完成');
          wx.setStorage({
            key: "decks",
            data: res.data.series.data
          });
          _decks = res.data.series.data;
          getTypes();
          wx.hideLoading();
        },
        fail: function() {
          require('../../funtions.js').fnRequestFail();
        }
      });
    }
  }

  function getTypes() {
    if (_types) {
      console.log('读取到 types');
      callback(_cards, _decks, _types);
    } else {
      console.log('未读取到 types ，现场请求 types');
      wx.showLoading({
        mask: true,
        title: '请求卡组名中…',
      });
      wx.request({
        url: 'https://wxapp-1257102469.cos.ap-shanghai.myqcloud.com/archetypes.json',
        success: function(res) {
          console.log('现场请求 types 完成');
          wx.setStorage({
            key: "types",
            data: res.data
          });
          _types = res.data;
          callback(_cards, _decks, _types);
          wx.hideLoading();
        },
        fail: function() {
          require('../../funtions.js').fnRequestFail();
        }
      });
    }
  }

  getCards();

}

function getCardsObj(deck, cards) {
  let cardsAllObj = [],
    cardsNeutralObj = [],
    cardsClassObj = [],
    cardsNeutralCount = 0;
  // 将json字符串转为二维数组
  if (typeof deck.deck_list == 'string') {
    deck.deck_list = deck.deck_list.replace(/[\[|\]]/g, "");
    deck.deck_list = deck.deck_list.split(',');
  }
  let aTempCards = [];
  let aCurCards = [];
  for (let i = 0; i < deck.deck_list.length; i++) {
    if (i % 2 == 0) {
      aTempCards = [];
      aTempCards.push(parseInt(deck.deck_list[i]));
      aTempCards.push(parseInt(deck.deck_list[i + 1]));
      aCurCards.push(aTempCards);
    }
  }
  for (let x in aCurCards) {
    for (let y = 0; y < cards.length; y++) {
      if (aCurCards[x][0] == cards[y].dbfId) {
        cards[y].copy = aCurCards[x][1];
        if (cards[y].cardClass == 'NEUTRAL') {
          cardsNeutralObj.push(cards[y]);
          cardsNeutralCount += parseInt(cards[y].copy);
        } else {
          cardsClassObj.push(cards[y]);
        }
        cardsAllObj.push(cards[y]);
        break;
      }
    }
  }
  cardsNeutralObj = cardsNeutralObj.sort((a, b) => a.cost - b.cost);
  cardsClassObj = cardsClassObj.sort((a, b) => a.cost - b.cost);
  cardsNeutralCount = cardsNeutralCount;
  cardsAllObj = cardsAllObj.sort((a, b) => a.cost - b.cost);
  return {
    cardsAllObj: cardsAllObj,
    deck_list: aCurCards,
    cardsNeutralObj: cardsNeutralObj,
    cardsClassObj: cardsClassObj,
    cardsNeutralCount: cardsNeutralCount,
  };
}

module.exports.fnRequestFail = fnRequestFail;
module.exports.getDeckAndType = getDeckAndType;
module.exports.getCardsObj = getCardsObj;