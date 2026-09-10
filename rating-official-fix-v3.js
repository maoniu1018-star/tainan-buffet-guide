/* Verified Google rating data + corrected official links. Data-only. */
window.RATING_OFFICIAL_FIX_V3={
"億品鍋 成大勝利店":{"rating":4.4,"reviewCount":1250,"ratingSource":"Google Maps"},
"武灰鍋 平價個人小火鍋":{"rating":4.6,"reviewCount":159,"ratingSource":"Google Maps"},
"XM 麻辣鍋":{"rating":4.5,"reviewCount":3659,"ratingSource":"Google Maps"},
"牧鍋 頂級熟成牛鍋物":{"rating":4.5,"reviewCount":1731,"ratingSource":"Google Maps"},
"兩餐 Dookki 台南店":{"rating":4.1,"reviewCount":1905,"ratingSource":"Google Maps"},
"串家物語 台南三井店":{"rating":3.9,"reviewCount":967,"ratingSource":"Google Maps"},
"燒肉眾 台南永康店":{"rating":4.5,"reviewCount":752,"ratingSource":"Google Maps"},
"魔力牛牛排館 安南安中店":{"rating":4.2,"reviewCount":1106,"ratingSource":"Google Maps"},
"遠東 CAFÉ 台南遠東香格里拉":{"rating":4.3,"reviewCount":2800,"ratingSource":"Google Maps"},
"桂田酒店 阿力海百匯餐廳":{"rating":4.5,"reviewCount":10323,"ratingSource":"Google Maps"},
"甘粹餐廳（台南老爺行旅）":{"rating":3.9,"reviewCount":1400,"ratingSource":"Google Maps"},
"饗翻天臭臭鍋 新營店":{"rating":4.8,"ratingSource":"Google Maps"},
"一個圓鍋火鍋店":{"rating":4.9,"reviewCount":2600,"ratingSource":"Google Maps"},
"麻佬二 台南店":{"rating":4.6,"reviewCount":1147,"ratingSource":"Google Maps"},
"肉次方 燒肉放題 台南府前店":{"official":"https://www.powerofmeat.com.tw/shop-location"},
"涮乃葉 台南大全聯店":{"official":"https://syabuyo.com.tw/"},
"饗麻饗辣 台南永華旗艦店":{"official":"https://www.enjoyhot.com.tw/store.php?act=view&id=1"},
"串家物語 台南三井店":{"official":"https://www.mitsui-shopping-park.com.tw/mop/tainan/tw/shop.html?id=262a75a7"},
"嗑肉石鍋 東門店":{"official":"https://www.meatshotpot.com/stores"},
"灼花燒肉 HIBANA × 深煙酒吧 SHINEN":{"official":"https://hibana.tw/"},
"燒肉工廠":{"official":"https://bbqfty.com.tw/"},
"甘粹餐廳（台南老爺行旅）":{"rating":3.9,"reviewCount":1400,"ratingSource":"Google Maps","official":"https://www.hotelroyal.com.tw/zh-tw/tainan/dining/1435"},
"井賀鍋物 安南店":{"official":"https://www.jinghe-hotpot.com.tw/stronghold.html"},
"橫濱牛排 台南三井店":{"official":"https://www.yokohama-steakhouse.com.tw/"}
};
(function(){const d=window.RESTAURANTS||[];const m=window.RATING_OFFICIAL_FIX_V3||{};for(const r of d){const x=m[r.name];if(!x)continue;if(x.rating!=null){r.rating=x.rating;r.reviewCount=x.reviewCount;r.ratingSource=x.ratingSource||"Google Maps";}if(x.official)r.official=x.official;}})();
