import Home from '@/components/pages/Home';
import Progress from '@/components/pages/Progress';
import Goals from '@/components/pages/Goals';
import TopicDetail from '@/components/pages/TopicDetail';
import LessonView from '@/components/pages/LessonView';
import Quiz from '@/components/pages/Quiz';
import Onboarding from '@/components/pages/Onboarding';
export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home,
    showInNav: true
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: Progress,
    showInNav: true
  },
  goals: {
    id: 'goals',
    label: 'Goals',
    path: '/goals',
    icon: 'Target',
    component: Goals,
    showInNav: true
},
  onboarding: {
    id: 'onboarding',
    label: 'Onboarding',
    path: '/onboarding',
    icon: 'UserPlus',
    component: Onboarding,
    showInNav: false
  },
  topicDetail: {
    id: 'topicDetail',
    label: 'Topic Detail',
    path: '/topic/:category',
    icon: 'BookOpen',
    component: TopicDetail,
    showInNav: false
  },
  lessonView: {
    id: 'lessonView',
    label: 'Lesson',
    path: '/lesson/:id',
    icon: 'Play',
    component: LessonView,
    showInNav: false
  },
  quiz: {
    id: 'quiz',
    label: 'Quiz',
    path: '/quiz/:lessonId',
    icon: 'HelpCircle',
    component: Quiz,
    showInNav: false
  }
};

export const routeArray = Object.values(routes);
export const navRoutes = routeArray.filter(route => route.showInNav);