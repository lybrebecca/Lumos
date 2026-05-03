import { MILESTONES, HABIT_COLORS, CRYSTAL_LEVELS } from './constants';

// 判断两个日期是否是连续的两天
function isConsecutiveDay(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diff = (d2 - d1) / (1000 * 60 * 60 * 24);
  return diff === 1;
}

// 获取今天的日期字符串，格式：'2024-01-15'
export function getTodayStr() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 打卡一次，返回更新后的习惯 + 本次获得的积分
export function doCheckin(habit) {
  const today = getTodayStr();
  const newLog = { date: today, time: new Date().toLocaleTimeString('zh-CN') };

  // 更新连击天数
  const lastDate = habit.lastCheckinDate;
  let newStreak = habit.streak;

  if (!lastDate) {
    // 第一次打卡
    newStreak = 1;
  } else if (lastDate === today) {
    // 今天已经打过卡了，连击不变
    newStreak = habit.streak;
  } else if (isConsecutiveDay(lastDate, today)) {
    // 昨天打过，连击 +1
    newStreak = habit.streak + 1;
  } else {
    // 中断了，重新从 1 开始
    newStreak = 1;
  }

  // 检查是否触发里程碑奖励
  const milestone = MILESTONES[newStreak];
  const bonus = milestone ? milestone.bonus : 0;
  const milestoneText = milestone ? milestone.text : null;

  // 更新习惯数据
  const updatedHabit = {
    ...habit,
    todayCount: lastDate === today ? habit.todayCount + 1 : 1,
    totalCount: habit.totalCount + 1,
    streak: newStreak,
    lastCheckinDate: today,
    logs: [...(habit.logs || []), newLog],
  };

  return {
    updatedHabit,
    pointsEarned: 1 + bonus,
    milestoneText,
    bonus,
  };
}

// 撤销最近一次打卡
export function undoCheckin(habit) {
  const today = getTodayStr();
  const logs = habit.logs || [];

  // 只能撤销今天的打卡
  if (habit.lastCheckinDate !== today || habit.todayCount === 0) {
    return null;
  }

  const newLogs = logs.slice(0, -1);
  const newTodayCount = habit.todayCount - 1;

  const updatedHabit = {
    ...habit,
    todayCount: newTodayCount,
    totalCount: habit.totalCount - 1,
    logs: newLogs,
  };

  return { updatedHabit, pointsLost: 1 };
}

// 根据习惯 id 分配颜色（循环使用颜色列表）
export function getHabitColor(index) {
  return HABIT_COLORS[index % HABIT_COLORS.length];
}

// 获取某个习惯当前解锁的水晶等级
export function getCrystalLevel(totalCount) {
  let current = null;
  for (const level of CRYSTAL_LEVELS) {
    if (totalCount >= level.threshold) {
      current = level;
    }
  }
  return current;
}