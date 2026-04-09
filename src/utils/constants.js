// 每日首页顶部的温柔文案，每天随机显示一条
export const TAGLINES = [
    '今天也可以慢慢来',
    '一点点也很好',
    '你已经在改变了',
    '做了一点点，就是赢了',
    '不用完美，出现就够了',
    '今天出现了，就很好',
    '小小的行动，也是行动',
  ];
  
  // 连击里程碑：连续 N 天时，触发一次性奖励
  export const MILESTONES = {
    5:  { bonus: 1, text: '5天连击！继续加油' },
    10: { bonus: 3, text: '10天！你真的很厉害' },
    30: { bonus: 5, text: '30天！习惯大师诞生了' },
  };
  
  // 水晶等级：某个习惯累计完成 N 次，解锁对应水晶
  export const CRYSTAL_LEVELS = [
    { threshold: 10,  name: '初光', emoji: '🟡' },
    { threshold: 20,  name: '生长', emoji: '💚' },
    { threshold: 30,  name: '沉淀', emoji: '💜' },
    { threshold: 50,  name: '稳定', emoji: '⬛' },
    { threshold: 75,  name: '恒定', emoji: '💎' },
    { threshold: 100, name: '掌控', emoji: '🥇' },
  ];
  
  // 习惯卡片颜色，每个习惯自动分配一个
  export const HABIT_COLORS = [
    { iconBg: 'rgba(250,180,150,0.5)', btnBg: 'rgba(220,130,100,0.6)' },
    { iconBg: 'rgba(160,200,240,0.5)', btnBg: 'rgba(100,160,210,0.6)' },
    { iconBg: 'rgba(170,230,200,0.5)', btnBg: 'rgba(100,190,150,0.6)' },
    { iconBg: 'rgba(200,180,240,0.5)', btnBg: 'rgba(150,130,210,0.6)' },
    { iconBg: 'rgba(250,220,160,0.5)', btnBg: 'rgba(210,170,80,0.6)'  },
    { iconBg: 'rgba(240,180,200,0.5)', btnBg: 'rgba(200,130,160,0.6)' },
    { iconBg: 'rgba(180,230,230,0.5)', btnBg: 'rgba(100,190,190,0.6)' },
    { iconBg: 'rgba(210,200,170,0.5)', btnBg: 'rgba(160,150,110,0.6)' },
  ];
  
  // 双击撤销的时间窗口（毫秒）
  export const DOUBLE_CLICK_MS = 1500;
  
  // 最多同时显示的习惯数量