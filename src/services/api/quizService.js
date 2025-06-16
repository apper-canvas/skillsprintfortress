import quizzesData from '../mockData/quizzes.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const quizService = {
  async getAll() {
    await delay(250);
    return [...quizzesData];
  },

  async getById(id) {
    await delay(200);
    const quiz = quizzesData.find(quiz => quiz.id === id);
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    return { ...quiz };
  },

  async getByLessonId(lessonId) {
    await delay(300);
    const quiz = quizzesData.find(quiz => quiz.lessonId === lessonId);
    if (!quiz) {
      throw new Error('Quiz not found for this lesson');
    }
    return { ...quiz };
  },

  async submitQuiz(lessonId, answers) {
    await delay(400);
    const quiz = quizzesData.find(quiz => quiz.lessonId === lessonId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    let correctAnswers = 0;
    const results = quiz.questions.map((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionId: question.id,
        userAnswer: answers[index],
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    return {
      score,
      passed,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      results
    };
  },

  async create(quiz) {
    await delay(400);
    const newQuiz = {
      ...quiz,
      id: `quiz_${Date.now()}`
    };
    quizzesData.push(newQuiz);
    return { ...newQuiz };
  },

  async update(id, updates) {
    await delay(350);
    const index = quizzesData.findIndex(quiz => quiz.id === id);
    if (index === -1) {
      throw new Error('Quiz not found');
    }
    quizzesData[index] = { ...quizzesData[index], ...updates };
    return { ...quizzesData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = quizzesData.findIndex(quiz => quiz.id === id);
    if (index === -1) {
      throw new Error('Quiz not found');
    }
    const deleted = quizzesData.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default quizService;