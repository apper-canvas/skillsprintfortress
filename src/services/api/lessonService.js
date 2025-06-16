import lessonsData from '../mockData/lessons.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const lessonService = {
  async getAll() {
    await delay(300);
    return [...lessonsData];
  },

  async getById(id) {
    await delay(250);
    const lesson = lessonsData.find(lesson => lesson.id === id);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    return { ...lesson };
  },

  async getByCategory(category) {
    await delay(300);
    return lessonsData.filter(lesson => lesson.category === category);
  },

  async create(lesson) {
    await delay(400);
    const newLesson = {
      ...lesson,
      id: `lesson_${Date.now()}`
    };
    lessonsData.push(newLesson);
    return { ...newLesson };
  },

  async update(id, updates) {
    await delay(350);
    const index = lessonsData.findIndex(lesson => lesson.id === id);
    if (index === -1) {
      throw new Error('Lesson not found');
    }
    lessonsData[index] = { ...lessonsData[index], ...updates };
    return { ...lessonsData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = lessonsData.findIndex(lesson => lesson.id === id);
    if (index === -1) {
      throw new Error('Lesson not found');
    }
    const deleted = lessonsData.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default lessonService;