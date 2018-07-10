const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [{
        title: "时光酒馆特别活动现已上线",
        url: "/images/swiperImg02.jpg",
      },
      {
        title: "冒险任务“怪物狩猎”已开放",
        url: "/images/swiperImg02.jpg"
      },
      {
        title: "“女巫森林”扩展包现已上线",
        url: "/images/swiperImg03.jpg"
      }
    ],
    classesInfo: [{
        name: "战士",
        url: "/images/icon_warrior.jpg"
      },
      {
        name: "圣骑士",
        url: "/images/icon_paladin.jpg"
      },
      {
        name: "猎人",
        url: "/images/icon_hunter.jpg"
      },
      {
        name: "德鲁伊",
        url: "/images/icon_druid.jpg"
      },
      {
        name: "潜行者",
        url: "/images/icon_rogue.jpg"
      },
      {
        name: "萨满祭司",
        url: "/images/icon_shaman.jpg"
      },
      {
        name: "法师",
        url: "/images/icon_mage.jpg"
      },
      {
        name: "术士",
        url: "/images/icon_warlock.jpg"
      },
      {
        name: "牧师",
        url: "/images/icon_priest.jpg"
      },
    ],
    hotdecks: [{
        name: "任务战",
        leftImg: "/images/swiperImg02.jpg",
        rightImg: "/images/swiperImg02.jpg",
        cost: "12000"
      },
      {
        name: "任务战2",
        leftImg: "/images/swiperImg02.jpg",
        rightImg: "/images/swiperImg03.jpg",
        cost: "24000"
      }
    ],
    newsData: [{
        title: "今天友谊赛可获得 200 金币",
        image: "/images/swiperImg02.jpg"
      },
      {
        title: "黄金公开赛xx站火热报名中",
        image: "/images/swiperImg02.jpg"
      }
    ],
  },

  toFindPage: function(e) {
    app.globalData.index2findArg = e.currentTarget.dataset.index;
    wx.switchTab({
      url: '../find/find'
    });
  },
})