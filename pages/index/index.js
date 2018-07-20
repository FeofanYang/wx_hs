const app = getApp();
Page({
  data: {
    swiperList: [{
        // title: "时光酒馆特别活动现已上线",
        url: "/images/swiperImg02.jpg",
      },
    ],
    classes: [{
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
  },

  toFindPage: function(e) {
    app.globalData.index2findArg = e.currentTarget.dataset.index;
    wx.switchTab({
      url: '../find/find'
    });
  },
})