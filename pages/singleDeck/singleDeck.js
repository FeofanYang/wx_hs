const app = getApp();
Page({

  data: {
    deckData: null,
    cardsData: null,
    gWidth: null,
  },

  onLoad: function(options) {
    let that = this;
    let callback = function(_cards, _decks, _types) {
      that.setData({
        cardsData: _cards,
      });
      // 从 find 页面进入 (读取到 find 传参)
      if (app.globalData.find2singleArg != null) {
        that.setData({
          deckData: app.globalData.find2singleArg,
        });
        processData();
      }
      // 从转发进入 (读取到分享链接参数)
      if (options.id) {
        let data = _decks,
          types = _types;
        // 分享参数遍历正确的卡组信息与卡组名
        for (let c in data) {
          for (let d in data[c]) {
            if (data[c][d].deck_id == options.id) {
              data[c][d]['classes'] = c.toLowerCase();
              // 设置 classes 属性
              let classes = data[c][d]['classes'];
              // 添加中文卡组名
              for (let t in types) {
                if (data[c][d]['archetype_id'] == t) {
                  data[c][d]['archetype'] = types[t]
                }
              }
              that.setData({
                deckData: data[c][d],
              });
              break;
            }
          }
        }
        processData();
      }
    }
    require('../../funtions.js').getDeckAndType(callback);

    function processData() {
      // 修改页面标题
      wx.setNavigationBarTitle({
        title: that.data.deckData.archetype
      });
      // 获取设备宽度
      wx.getSystemInfo({
        success: function(res) {
          let width = res.windowWidth;
          that.setData({
            gWidth: width
          });
        }
      });
      let deckD = that.data.deckData,
        cardsD = that.data.cardsData;
      // 遍历卡牌，获取对象列表
      let cardsAllObj = require('../../funtions.js').getCardsObj(deckD, cardsD);
      that.setData({
        ['deckData.cardsNeutral']: cardsAllObj.cardsNeutralObj,
        ['deckData.cardsClass']: cardsAllObj.cardsClassObj,
        ['deckData.cardsNeutralCount']: cardsAllObj.cardsNeutralCount,
        ['deckData.deck_list']: cardsAllObj.deck_list
      });
      // 遍历卡组，获取分类数组
      let checkDeckRes = that.checkDeck(cardsAllObj.cardsAllObj);
      let typeArg = checkDeckRes.typeArg;
      let rarityArg = checkDeckRes.rarityArg;
      // 修改数据
      that.setData({
        deckData: that.data.deckData,
      });
      // 绘制 canvas
      that.drawArc('typeCanvas', typeArg);
      // that.drawArc('rarityCanvas', rarityArg);
    }

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
    costArr = [cost0, cost1, cost2, cost3, cost4, cost5, cost6, cost7];
    let costMax = arrayMax(costArr);
    let costData = {
      arr: costArr,
      max: costMax
    };
    let dust = cCommon * 40 + cRare * 100 + cEpic * 400 + cLegendary * 1600;
    this.data.deckData.dust = dust;
    this.data.deckData.cost = costData;
    this.data.deckData.share = shareArr;
    return {
      typeArg: typeArg,
      rarityArg: rarityArg
    }
  },

  drawArc: function(canvasId, typeArg) {
    let ctx = wx.createCanvasContext(canvasId);
    let width = this.data.gWidth,
      padding = 10,
      textPadding = 30;
    // 半径 & 圆心
    let radius = width * 0.5 * 0.3,
      ox = radius + width * 0.5 * 0.2,
      oy = radius + padding;
    // 弧度开始 & 结束
    let startAngle = 0,
      endAngle = 0;
    // 图例
    let pwidth = 10,
      posX = pwidth + padding,
      posY = (radius + padding) * 2 + padding;
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
        if (count % 2 == 0) {
          ctx.arc(posX, posY + textPadding * Math.floor(count / 2), 8, 0, 2 * Math.PI);
        } else {
          ctx.arc(posX + width * 0.5 * 0.45, posY + textPadding * Math.floor(count / 2), 8, 0, 2 * Math.PI);
        }
        ctx.closePath();
        ctx.fill();
        endAngle = startAngle;
        // 绘制文字
        ctx.moveTo(posX, posY + textPadding * count);
        ctx.fillStyle = '#000';
        ctx.font = "16px 微软雅黑";
        let text = typeArg[i].name + "×" + typeArg[i].count;
        if (count % 2 == 0) {
          ctx.fillText(text, posX + 10, posY + textPadding * Math.floor(count / 2) + 6);
        } else {
          ctx.fillText(text, posX + 10 + width * 0.5 * 0.45, posY + textPadding * Math.floor(count / 2) + 6);
        }
        count++;
      }
    }
    ctx.draw();
  },

  toHome: function() {
    wx.switchTab({
      url: '/pages/find/find',
    });
  },

  onShareAppMessage: function(res) {
    // 设置分享标题
    let arr = this.data.deckData.share;
    let shareName;
    if (arr.length > 0) {
      shareName = arr[Math.floor(Math.random() * arr.length)];
    } else {
      shareName = '小精灵';
    }
    // 传参
    let arg = this.data.deckData.deck_id;
    if (this.data.deckData.archetype) {
      return {
        title: shareName + '向你推荐「' + this.data.deckData.archetype + '」',
        path: '/pages/singleDeck/singleDeck?id=' + arg,
      }
    } else {
      return {
        title: shareName + '向你推荐了一套神秘卡组',
        path: '/pages/singleDeck/singleDeck?id=' + arg,
      }
    }
  },

  copyCode: function() {
    // 编码解码卡组代码
    var encode_1 = encode;
    var MSB = 0x80;
    var REST = 0x7F;
    var MSBALL = ~REST;
    var INT = Math.pow(2, 31);

    function encode(num, out, offset) {
      out = out || [];
      offset = offset || 0;
      var oldOffset = offset;
      while (num >= INT) {
        out[offset++] = (num & 0xFF) | MSB;
        num /= 128
      }
      while (num & MSBALL) {
        out[offset++] = (num & 0xFF) | MSB;
        num >>>= 7
      }
      out[offset] = num | 0;
      encode.bytes = offset - oldOffset + 1;
      return out
    }
    var decode = read;
    var MSB$1 = 0x80;
    var REST$1 = 0x7F;

    function read(buf, offset) {
      var res = 0,
        offset = offset || 0,
        shift = 0,
        counter = offset,
        b, l = buf.length;
      do {
        if (counter >= l) {
          read.bytes = 0;
          throw new RangeError('Could not decode varint')
        }
        b = buf[counter++];
        res += shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
        shift += 7
      } while (b >= MSB$1) read.bytes = counter - offset;
      return res
    }
    var N1 = Math.pow(2, 7);
    var N2 = Math.pow(2, 14);
    var N3 = Math.pow(2, 21);
    var N4 = Math.pow(2, 28);
    var N5 = Math.pow(2, 35);
    var N6 = Math.pow(2, 42);
    var N7 = Math.pow(2, 49);
    var N8 = Math.pow(2, 56);
    var N9 = Math.pow(2, 63);
    var length = function(value) {
      return (value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10)
    };
    var varint = {
      encode: encode_1,
      decode: decode,
      encodingLength: length
    };

    function __extends(d, b) {
      for (var p in b)
        if (b.hasOwnProperty(p)) d[p] = b[p];

      function __() {
        this.constructor = d
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __())
    }

    function atob_binary(encoded) {
      return _atob(encoded)
    }

    function btoa_binary(decoded) {
      return _btoa(decoded)
    }
    var base64hash = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    function _atob(s) {
      s = s.replace(/\s|=/g, '');
      var cur, prev, mod, i = 0,
        result = [];
      while (i < s.length) {
        cur = base64hash.indexOf(s.charAt(i));
        mod = i % 4;
        switch (mod) {
          case 0:
            break;
          case 1:
            result.push(String.fromCharCode(prev << 2 | cur >> 4));
            break;
          case 2:
            result.push(String.fromCharCode((prev & 0x0f) << 4 | cur >> 2));
            break;
          case 3:
            result.push(String.fromCharCode((prev & 3) << 6 | cur));
            break
        }
        prev = cur;
        i++
      }
      return result.join('')
    }

    function _btoa(s) {
      if (/([^\u0000-\u00ff])/.test(s)) {
        throw new Error('INVALID_CHARACTER_ERR');
      }
      var i = 0,
        prev, ascii, mod, result = [];
      while (i < s.length) {
        ascii = s.charCodeAt(i);
        mod = i % 3;
        switch (mod) {
          case 0:
            result.push(base64hash.charAt(ascii >> 2));
            break;
          case 1:
            result.push(base64hash.charAt((prev & 3) << 4 | (ascii >> 4)));
            break;
          case 2:
            result.push(base64hash.charAt((prev & 0x0f) << 2 | (ascii >> 6)));
            result.push(base64hash.charAt(ascii & 0x3f));
            break
        }
        prev = ascii;
        i++
      }
      if (mod == 0) {
        result.push(base64hash.charAt((prev & 3) << 4));
        result.push('==')
      } else if (mod == 1) {
        result.push(base64hash.charAt((prev & 0x0f) << 2));
        result.push('=')
      }
      return result.join('')
    }
    var Iterator = (function() {
      function Iterator() {
        this.index = 0
      }
      Iterator.prototype.next = function(repeat) {
        if (repeat === void 0) {
          repeat = 1
        }
        this.index += repeat
      };
      return Iterator
    }());
    var BufferWriter = (function(_super) {
      __extends(BufferWriter, _super);

      function BufferWriter() {
        var _this = _super.call(this) || this;
        _this.buffer = [];
        return _this
      }
      BufferWriter.prototype.null = function() {
        this.buffer[this.index] = 0;
        this.next()
      };
      BufferWriter.prototype.varint = function(value) {
        varint.encode(value, this.buffer, this.index);
        this.next(varint.encode.bytes)
      };
      BufferWriter.prototype.toString = function() {
        var binary = String.fromCharCode.apply(String, this.buffer);
        return btoa_binary(binary)
      };
      return BufferWriter
    }(Iterator));
    var BufferReader = (function(_super) {
      __extends(BufferReader, _super);

      function BufferReader(string) {
        var _this = _super.call(this) || this;
        var binary = atob_binary(string);
        var buffer = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) {
          buffer[i] = binary.charCodeAt(i)
        }
        _this.buffer = buffer;
        return _this
      }
      BufferReader.prototype.nextByte = function() {
        var value = this.buffer[this.index];
        this.next();
        return value
      };
      BufferReader.prototype.nextVarint = function() {
        var value = varint.decode(this.buffer, this.index);
        this.next(varint.decode.bytes);
        return value
      };
      return BufferReader
    }(Iterator));
    var DECKSTRING_VERSION = 1;

    function verifyDbfId(id, name) {
      name = name ? name : "dbf id";
      if (!isPositiveNaturalNumber(id)) {
        throw new Error("Invalid " + name + " " + id + " (expected valid dbf id)");
      }
    }

    function isPositiveNaturalNumber(n) {
      if (typeof n !== "number" || !isFinite(n)) {
        return false
      }
      if (Math.floor(n) !== n) {
        return false
      }
      return n > 0
    }

    function sorted_cards(cards) {
      return cards.sort(function(a, b) {
        return (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)
      })
    }

    function trisort_cards(cards) {
      var single = [],
        double = [],
        n = [];
      for (var _i = 0, cards_1 = cards; _i < cards_1.length; _i++) {
        var tuple = cards_1[_i];
        var list = void 0;
        var card = tuple[0],
          count = tuple[1];
        verifyDbfId(card, "card");
        if (count === 0) {
          continue
        }
        if (count === 1) {
          list = single
        } else if (count === 2) {
          list = double
        } else if (isPositiveNaturalNumber(count)) {
          list = n
        } else {
          throw new Error("Invalid count " + count + " (expected positive natural number)");
        }
        list.push(tuple)
      }
      return [single, double, n]
    }

    function encode$1(deck) {
      if (typeof deck !== "object" || (deck.format !== 1 && deck.format !== 2) || !Array.isArray(deck.heroes) || !Array.isArray(deck.cards)) {
        throw new Error("Invalid deck definition");
      }
      var writer = new BufferWriter();
      var format = deck.format;
      var heroes = deck.heroes.slice().sort();
      var cards = sorted_cards(deck.cards.slice());
      writer.null();
      writer.varint(DECKSTRING_VERSION);
      writer.varint(format);
      writer.varint(heroes.length);
      for (var _i = 0, heroes_1 = heroes; _i < heroes_1.length; _i++) {
        var hero = heroes_1[_i];
        verifyDbfId(hero, "hero");
        writer.varint(hero)
      }
      for (var _a = 0, _b = trisort_cards(cards); _a < _b.length; _a++) {
        var list = _b[_a];
        writer.varint(list.length);
        for (var _c = 0, list_1 = list; _c < list_1.length; _c++) {
          var tuple = list_1[_c];
          var card = tuple[0],
            count = tuple[1];
          writer.varint(card);
          if (count !== 1 && count !== 2) {
            writer.varint(count)
          }
        }
      }
      return writer.toString()
    }

    function decode$2(deckstring) {
      var reader = new BufferReader(deckstring);
      if (reader.nextByte() !== 0) {
        throw new Error("Invalid deckstring");
      }
      var version = reader.nextVarint();
      if (version !== DECKSTRING_VERSION) {
        throw new Error("Unsupported deckstring version " + version);
      }
      var format = reader.nextVarint();
      if (format !== 1 && format !== 2) {
        throw new Error("Unsupported format " + format + " in deckstring");
      }
      var heroes = new Array(reader.nextVarint());
      for (var i = 0; i < heroes.length; i++) {
        heroes[i] = reader.nextVarint()
      }
      heroes.sort();
      var cards = [];
      for (var i = 1; i <= 3; i++) {
        for (var j = 0, c = reader.nextVarint(); j < c; j++) {
          cards.push([reader.nextVarint(), i === 1 || i === 2 ? i : reader.nextVarint(), ])
        }
      }
      sorted_cards(cards);
      return {
        cards: cards,
        heroes: heroes,
        format: format,
      }
    }
    // 编码卡组赋值
    let _class = this.data.deckData.classes;
    if (_class == 'paladin') {
      _class = [671];
    } else if (_class == 'warlock') {
      _class = [893];
    } else if (_class == 'shaman') {
      _class = [1066];
    } else if (_class == 'rogue') {
      _class = [930];
    } else if (_class == 'druid') {
      _class = [274];
    } else if (_class == 'hunter') {
      _class = [31];
    } else if (_class == 'priest') {
      _class = [813];
    } else if (_class == 'mage') {
      _class = [637];
    } else if (_class == 'warrior') {
      _class = [7];
    }
    const deck = {
      cards: this.data.deckData.deck_list,
      heroes: _class,
      format: 2,
    };
    const deckstring = encode$1(deck);

    wx.setClipboardData({
      data: deckstring,
      success: function(res) {
        wx.showToast({
          title: "代码已复制~",
          icon: "success"
        });
      }
    })
  },

})