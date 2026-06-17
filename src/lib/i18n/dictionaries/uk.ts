import type { Dictionary } from './index';

export const uk: Dictionary = {
  nav: { about: 'про мене', work: 'досвід', projects: 'проєкти', writing: 'нотатки' },
  home: { latestWriting: 'Останні нотатки', allWriting: 'Усі нотатки' },
  theme: { toLight: 'Світла тема', toDark: 'Темна тема', label: 'Тема' },
  language: { label: 'Мова' },
  footer: { github: 'github', linkedin: 'linkedin', email: 'пошта' },
  notFound: {
    title: 'Сторінку не знайдено',
    body: 'Такої сторінки не існує. Натомість ось кілька останніх нотаток.',
    home: 'На головну'
  },
  article: { notTranslated: 'Цей текст ще не перекладено.' },
  menu: { open: 'Відкрити меню', close: 'Закрити меню', nav: 'Навігація сайтом' }
};
