import badgesData from '../mockData/badges.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const badgeService = {
  async getAll() {
    await delay(250);
    return [...badgesData];
  },

  async getById(id) {
    await delay(200);
    const badge = badgesData.find(badge => badge.id === id);
    if (!badge) {
      throw new Error('Badge not found');
    }
    return { ...badge };
  },

  async checkEligibility(userId, userStats) {
    await delay(300);
    const eligibleBadges = [];
    
    badgesData.forEach(badge => {
      const { type, value } = badge.requirement;
      let isEligible = false;
      
      switch (type) {
        case 'streak':
          isEligible = userStats.currentStreak >= value;
          break;
        case 'lessons_completed':
          isEligible = userStats.completedLessons?.length >= value;
          break;
        case 'category_complete':
          // Check if all lessons in a category are completed
          isEligible = userStats.categoryProgress?.[value] === 100;
          break;
        case 'xp_earned':
          isEligible = userStats.totalXP >= value;
          break;
        case 'level_reached':
          isEligible = userStats.currentLevel >= value;
          break;
        default:
          isEligible = false;
      }
      
      if (isEligible && !userStats.badges?.includes(badge.id)) {
        eligibleBadges.push({ ...badge });
      }
    });
    
    return eligibleBadges;
  },

  async create(badge) {
    await delay(400);
    const newBadge = {
      ...badge,
      id: `badge_${Date.now()}`
    };
    badgesData.push(newBadge);
    return { ...newBadge };
  },

  async update(id, updates) {
    await delay(350);
    const index = badgesData.findIndex(badge => badge.id === id);
    if (index === -1) {
      throw new Error('Badge not found');
    }
    badgesData[index] = { ...badgesData[index], ...updates };
    return { ...badgesData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = badgesData.findIndex(badge => badge.id === id);
    if (index === -1) {
      throw new Error('Badge not found');
    }
    const deleted = badgesData.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default badgeService;