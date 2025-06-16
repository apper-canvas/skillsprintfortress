import userData from '../mockData/user.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let currentUser = { ...userData };

const userService = {
  async getUser() {
    await delay(200);
    return { ...currentUser };
  },

  async updateUser(updates) {
    await delay(300);
    currentUser = { ...currentUser, ...updates };
    return { ...currentUser };
  },

  async addXP(amount) {
    await delay(200);
    const newXP = currentUser.totalXP + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;
    
    currentUser = {
      ...currentUser,
      totalXP: newXP,
      currentLevel: newLevel
    };
    
    return { ...currentUser };
  },

  async completeLesson(lessonId) {
    await delay(250);
    if (!currentUser.completedLessons.includes(lessonId)) {
      currentUser = {
        ...currentUser,
        completedLessons: [...currentUser.completedLessons, lessonId]
      };
    }
    return { ...currentUser };
  },

  async updateStreak() {
    await delay(200);
    currentUser = {
      ...currentUser,
      currentStreak: currentUser.currentStreak + 1
    };
    return { ...currentUser };
  },

  async earnBadge(badgeId) {
    await delay(200);
    if (!currentUser.badges.includes(badgeId)) {
      currentUser = {
        ...currentUser,
        badges: [...currentUser.badges, badgeId]
      };
    }
    return { ...currentUser };
  },

  async setDailyGoal(goal) {
    await delay(200);
    currentUser = {
      ...currentUser,
      dailyGoal: goal
    };
    return { ...currentUser };
  }
};

export default userService;