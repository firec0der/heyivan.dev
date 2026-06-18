import type { Dictionary } from './index';

export const uk: Dictionary = {
  nav: { about: 'про мене', work: 'досвід', projects: 'проєкти', writing: 'нотатки' },
  home: { latestWriting: 'Останні нотатки', allWriting: 'Усі нотатки' },
  about: { elsewhere: 'Деінде' },
  work: {
    title: 'Досвід',
    subtitle: 'Десять років інженерної роботи, від найновішої.',
    downloadCv: 'Завантажити CV (PDF)',
    education: 'Освіта'
  },
  theme: { toLight: 'Світла тема', toDark: 'Темна тема', label: 'Тема' },
  language: { label: 'Мова' },
  footer: { github: 'github', linkedin: 'linkedin', email: 'пошта' },
  notFound: {
    title: 'Сторінку не знайдено',
    body: 'Такої сторінки не існує. Натомість ось кілька останніх нотаток.',
    home: 'На головну'
  },
  content: { notTranslated: 'Цей текст ще не перекладено.' },
  menu: { open: 'Відкрити меню', close: 'Закрити меню', nav: 'Навігація сайтом' }
};
