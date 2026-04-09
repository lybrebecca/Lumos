import { getHabitColor } from '../utils/habitLogic';

// App 第一次打开时，默认显示这些习惯
// 用户可以删除或添加自己的
const DEFAULT_HABITS = [
  { emoji: '🏃', name: '运动' },
  { emoji: '📚', name: '阅读' },
  { emoji: '🧘', name: '冥想' },
];

export function getDefaultHabits() {
  return DEFAULT_HABITS.map((h, index) => ({
    id: Date.now() + index,       // 唯一 id，用时间戳生成
    emoji: h.emoji,
    name: h.name,
    todayCount: 0,                // 今天打卡次数
    totalCount: 0,                // 历史总打卡次数
    streak: 0,                    // 当前连击天数
    lastCheckinDate: null,        // 最后一次打卡日期
    logs: [],                     // 所有打卡记录
    colorIndex: index,            // 颜色索引
    ...getHabitColor(index),      // iconBg, btnBg
  }));
}