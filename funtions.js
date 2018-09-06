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
          let decks = res.data.series.data;
          const compact = (arr) => arr.filter(v => v);
          for (let c in decks) {
            for (let d in decks[c]) {
              if (parseInt(decks[c][d]['total_games']) < 1000) {
                delete decks[c][d];
              }
            }
            decks[c] = compact(decks[c]);
          }
          wx.setStorage({
            key: "decks",
            data: decks
          });
          _decks = decks;
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
  let cardsId = [],
    cardsAllObj = [],
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
        cardsId.push({
          id: cards[y].id,
          cost: cards[y].cost
        });
        break;
      }
    }
  }
  cardsId = cardsId.sort((a, b) => a.cost - b.cost);
  cardsNeutralObj = cardsNeutralObj.sort((a, b) => a.cost - b.cost);
  cardsClassObj = cardsClassObj.sort((a, b) => a.cost - b.cost);
  cardsNeutralCount = cardsNeutralCount;
  cardsAllObj = cardsAllObj.sort((a, b) => a.cost - b.cost);
  return {
    cardsId: cardsId,
    cardsAllObj: cardsAllObj,
    deck_list: aCurCards,
    cardsNeutralObj: cardsNeutralObj,
    cardsClassObj: cardsClassObj,
    cardsNeutralCount: cardsNeutralCount,
  };
}

function clearStorage(url, storage) {
  wx.showModal({
    title: '清空本地缓存',
    content: '此操作将清空本地缓存，可以解决绝大部分卡牌图片显示不全、卡组名空白、数据未更新等问题。\r\n注意：设置缓存的目地是为了避免反复请求数据以节省您的流量。请勿频繁使用此功能。',
    success: function(res) {
      if (res.confirm) {
        if (storage) {
          wx.removeStorageSync(storage);
        } else {
          wx.clearStorageSync();
        }
        wx.reLaunch({
          url: url
        });
      }
    },
  });
}

module.exports.fnRequestFail = fnRequestFail;
module.exports.getDeckAndType = getDeckAndType;
module.exports.getCardsObj = getCardsObj;
module.exports.clearStorage = clearStorage;