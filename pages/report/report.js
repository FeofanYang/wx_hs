const app = getApp();
Page({
  data: {
    cardsData: null,
    inputCode: null,
    languageData: [{
        enName: "Aggro Warrior",
        zhName: "快攻战"
      },
      {
        enName: "Control Warrior",
        zhName: "控制战"
      },
      {
        enName: "Even Warrior",
        zhName: "偶数战"
      },
      {
        enName: "Odd Fatigue Warrior",
        zhName: "奇数防战"
      },
      {
        enName: "Odd Quest Warrior",
        zhName: "奇数任务战"
      },
      {
        enName: "Odd Warrior",
        zhName: "奇数战"
      },
      {
        enName: "Pirate Warrior",
        zhName: "海盗战"
      },
      {
        enName: "Quest Warrior",
        zhName: "任务战"
      },
      {
        enName: "Recruit Warrior",
        zhName: "招募战"
      },
      {
        enName: "Rush Warrior",
        zhName: "突袭战"
      },
      {
        enName: "Spiteful Warrior",
        zhName: "恶毒战"
      },
      {
        enName: "Whirlwind Warrior",
        zhName: "炮塔战"
      },

      {
        enName: "Anyfin Paladin",
        zhName: "死鱼骑"
      },
      {
        enName: "Aggro Paladin",
        zhName: "快攻骑"
      },
      {
        enName: "Dragon Paladin",
        zhName: "龙骑"
      },
      {
        enName: "Dude Paladin",
        zhName: "阅兵骑"
      },
      {
        enName: "Even Paladin",
        zhName: "偶数骑"
      },
      {
        enName: "Murloc Paladin",
        zhName: "鱼人骑"
      },
      {
        enName: "Odd Paladin",
        zhName: "奇数骑"
      },
      {
        enName: "OTK DK Paladin",
        zhName: "天启骑"
      },
      {
        enName: "Quest Paladin",
        zhName: "任务骑"
      },
      {
        enName: "Secret Paladin",
        zhName: "奥秘骑"
      },
      {
        enName: "Silver Hand Paladin",
        zhName: "阅兵骑"
      },

      {
        enName: "Aggro Hunter",
        zhName: "T7猎"
      },
      {
        enName: "Cube Hunter",
        zhName: "肉块猎"
      },
      {
        enName: "Deathrattle Hunter",
        zhName: "亡语猎"
      },
      {
        enName: "Dragon Hunter",
        zhName: "龙猎"
      },
      {
        enName: "Emeriss Hunter",
        zhName: "斩杀猎"
      },
      {
        enName: "Even Hunter",
        zhName: "偶数猎"
      },
      {
        enName: "Face Hunter",
        zhName: "T7猎"
      },
      {
        enName: "Kathrena Hunter",
        zhName: "冬灵猎"
      },
      {
        enName: "Midrange Hunter",
        zhName: "中速猎"
      },
      {
        enName: "Odd Hunter",
        zhName: "奇数猎"
      },
      {
        enName: "OTK Hunter",
        zhName: "斩杀猎"
      },
      {
        enName: "Quest Hunter",
        zhName: "任务猎"
      },
      {
        enName: "Recruit Hunter",
        zhName: "招募猎"
      },
      {
        enName: "Secret Hunter",
        zhName: "奥秘猎"
      },
      {
        enName: "Spell Hunter",
        zhName: "法术猎"
      },

      {
        enName: "Big Druid",
        zhName: "大哥德"
      },
      {
        enName: "Devilsaur Druid",
        zhName: "魔暴龙德"
      },
      {
        enName: "Hand Druid",
        zhName: "手牌德"
      },
      {
        enName: "Jade Druid",
        zhName: "青玉德"
      },
      {
        enName: "Malygos Druid",
        zhName: "蓝龙德"
      },
      {
        enName: "Mill Druid",
        zhName: "疲劳德"
      },
      {
        enName: "Odd Druid",
        zhName: "奇数德"
      },
      {
        enName: "Quest Druid",
        zhName: "任务德"
      },
      {
        enName: "Recruit Druid",
        zhName: "招募德"
      },
      {
        enName: "Spiteful Druid",
        zhName: "恶毒德"
      },
      {
        enName: "Taunt Druid",
        zhName: "墙德"
      },
      {
        enName: "Token Druid",
        zhName: "铺场德"
      },
      {
        enName: "Togwaggle Druid",
        zhName: "换家德"
      },

      {
        enName: "Even Rogue",
        zhName: "偶数贼"
      },
      {
        enName: "Kingsbane Rogue",
        zhName: "弑君贼"
      },
      {
        enName: "Mill Rogue",
        zhName: "爆牌贼"
      },
      {
        enName: "Miracle Rogue",
        zhName: "奇迹贼"
      },
      {
        enName: "Odd Rogue",
        zhName: "奇数贼"
      },
      {
        enName: "Pick Pocket Rogue",
        zhName: "搜索贼"
      },
      {
        enName: "Quest Rogue",
        zhName: "任务贼"
      },
      {
        enName: "Tempo Rogue",
        zhName: "节奏贼"
      },

      {
        enName: "Aggro Shaman",
        zhName: "快攻萨"
      },
      {
        enName: "Combo Shudderwock Shaman",
        zhName: "战吼萨"
      },
      {
        enName: "Elemental Shaman",
        zhName: "元素萨"
      },
      {
        enName: "Even Shaman",
        zhName: "偶数萨"
      },
      {
        enName: "Mid-Range Shaman",
        zhName: "中速萨"
      },
      {
        enName: "Murloc Shaman",
        zhName: "鱼人萨"
      },
      {
        enName: "Overload Shaman",
        zhName: "过载萨"
      },
      {
        enName: "Shudderwock Shaman",
        zhName: "战吼萨"
      },

      {
        enName: "Aggro Mage",
        zhName: "快攻法"
      },
      {
        enName: "Big Spell Mage",
        zhName: "控制法"
      },
      {
        enName: "Control Mage",
        zhName: "控制法"
      },
      {
        enName: "Elemental Mage",
        zhName: "元素法"
      },
      {
        enName: "Even Mage",
        zhName: "偶数法"
      },
      {
        enName: "Exodia Mage",
        zhName: "无限火球法"
      },
      {
        enName: "Freeze Mage",
        zhName: "冰法"
      },
      {
        enName: "Murloc Mage",
        zhName: "鱼人法"
      },
      {
        enName: "Odd Mage",
        zhName: "奇数法"
      },
      {
        enName: "Quest Mage",
        zhName: "任务法"
      },
      {
        enName: "Reno Mage",
        zhName: "宇宙法"
      },
      {
        enName: "Secret Mage",
        zhName: "奥秘法"
      },
      {
        enName: "Tempo Mage",
        zhName: "节奏法"
      },

      {
        enName: "Control Warlock",
        zhName: "控制术"
      },
      {
        enName: "Cube Warlock",
        zhName: "肉块术"
      },
      {
        enName: "Cubelock",
        zhName: "肉块术"
      },
      {
        enName: "Echo Warlock",
        zhName: "回响术"
      },
      {
        enName: "Even Warlock",
        zhName: "偶数术"
      },
      {
        enName: "Murloc Warlock",
        zhName: "鱼人术"
      },
      {
        enName: "Odd Warlock",
        zhName: "奇数术"
      },
      {
        enName: "Renolock",
        zhName: "宇宙术"
      },
      {
        enName: "Zoolock",
        zhName: "动物园"
      },
      {
        enName: "Zoo Warlock",
        zhName: "动物园"
      },

      {
        enName: "Combo Priest",
        zhName: "心火牧"
      },
      {
        enName: "Control Priest",
        zhName: "控制牧"
      },
      {
        enName: "Deathrattle Priest",
        zhName: "亡语牧"
      },
      {
        enName: "Odd Priest",
        zhName: "奇数牧"
      },
      {
        enName: "Quest Priest",
        zhName: "任务牧"
      },
      {
        enName: "Reno Priest",
        zhName: "宇宙牧"
      },
      {
        enName: "Resurrect Priest",
        zhName: "复活牧"
      },
      {
        enName: "Spiteful Dragon Priest",
        zhName: "恶毒龙牧"
      },
      {
        enName: "Spiteful Priest",
        zhName: "恶毒牧"
      },

      {
        enName: "Druid",
        zhName: "小德"
      },
      {
        enName: "Hunter",
        zhName: "猎人"
      },
      {
        enName: "Mage",
        zhName: "法师"
      },
      {
        enName: "Paladin",
        zhName: "骑士"
      },
      {
        enName: "Priest",
        zhName: "牧师"
      },
      {
        enName: "Rogue",
        zhName: "盗贼"
      },
      {
        enName: "Shaman",
        zhName: "萨满"
      },
      {
        enName: "Warlock",
        zhName: "术士"
      },
      {
        enName: "Warrior",
        zhName: "战士"
      },
    ],
  },

  onLoad: function () {
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

  analyzeCode: function() {
    let json = {
      codeLink: null,
      codeCore: null,
      archetype: null,
      classes: null,
      format: null,
      cardsAll: [],
      dust: null,
    };
    // 解构代码
    let code = this.data.inputCode;
    let codeSplit = code.split("# ");
    json.codeLink = codeSplit[codeSplit.length - 1].split("decks/")[1];
    let codeArr = [];
    let isPrevCard = [];
    for (let i = 0; i < codeSplit.length; i++) {
      // 添加卡组名称
      let lan = this.data.languageData;
      json.archetype = codeSplit[1].replace(/(^\s*)|(\s*$)/g, "");
      for (let l = 0; l < lan.length; l++) {
        if (json.archetype == lan[l].enName) {
          json.archetype = lan[l].zhName
        }
      }
      // 判断卡牌
      if (codeSplit[i].indexOf(")") != -1) {
        codeArr.push({
          name: codeSplit[i].split(")")[1],
          copy: codeSplit[i].split("")[0]
        });
        isPrevCard.push(true);
      } else {
        isPrevCard.push(false);
        // 判断核心代码
        if (isPrevCard[(i - 1)] == true) {
          json.codeCore = codeSplit[i].replace(/(^\s*)|(\s*$)/g, "");
        }
      }
      // 判断卡组职业
      if (codeSplit[i].indexOf("Class:") != -1) {
        json.classes = codeSplit[i].split("Class:")[1].replace(/(^\s*)|(\s*$)/g, "").toLowerCase();
      }
      // 判断卡组模式
      if (codeSplit[i].indexOf("Format:") != -1) {
        json.format = codeSplit[i].split("Format:")[1].replace(/(^\s*)|(\s*$)/g, "").toLowerCase();
      }
    }
    // 分析卡组列表
    let cardsData = this.data.cardsData;
    let allCardsObj = [];
    for (let x = 0; x < codeArr.length; x++) {
      for (let y = 0; y < cardsData.length; y++) {
        codeArr[x].name = codeArr[x].name.replace(/(^\s*)|(\s*$)/g, "");
        if (cardsData[y].name == codeArr[x].name) {
          // 添加 copy 值
          cardsData[y].copy = parseInt(codeArr[x].copy);
          let allObj = {
            id: cardsData[y].id,
            copy: codeArr[x].copy
          }
          json.cardsAll.push(allObj);
          allCardsObj.push(cardsData[y]);
          break;
        }
      }
    }
    // 循环结束
    // 计算奥术之尘
    for (let i = 0; i < allCardsObj.length; i++) {
      let cost = null;
      let kind = allCardsObj[i].rarity;
      if (kind == "FREE") {
        cost = 0;
      } else if (kind == "COMMON") {
        cost = 40;
      } else if (kind == "RARE") {
        cost = 100;
      } else if (kind == "EPIC") {
        cost = 400;
      } else if (kind == "LEGENDARY") {
        cost = 1600;
      }
      json.dust += cost * parseInt(allCardsObj[i].copy);
    }
    wx.setClipboardData({
      data: JSON.stringify(json),
    })
    console.log(json);
  }
})