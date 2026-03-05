-- Seed skills
insert into public.skills (name, category, icon) values
  ('Python', 'hard', 'code'),
  ('JavaScript', 'hard', 'code'),
  ('TypeScript', 'hard', 'code'),
  ('React', 'hard', 'code'),
  ('SQL', 'hard', 'database'),
  ('Node.js', 'hard', 'server'),
  ('Git', 'hard', 'git-branch'),
  ('Docker', 'hard', 'box'),
  ('Machine Learning', 'hard', 'brain'),
  ('Data Analysis', 'hard', 'bar-chart'),
  ('Коммуникация', 'soft', 'message-circle'),
  ('Работа в команде', 'soft', 'users'),
  ('Лидерство', 'soft', 'crown'),
  ('Критическое мышление', 'soft', 'lightbulb'),
  ('Управление временем', 'soft', 'clock')
on conflict (name) do nothing;

-- Seed badges
insert into public.badges (name, description, icon, xp_reward) values
  ('Первый проект', 'Добавил первый проект в портфолио', 'rocket', 100),
  ('Первый отклик', 'Откликнулся на первую вакансию', 'send', 50),
  ('Навык подтвержден', 'Получил первое подтверждение навыка', 'check-circle', 75),
  ('Портфолио мастер', 'Добавил 5 проектов', 'folder', 200),
  ('Skill Hunter', 'Добавил 10 навыков', 'target', 150),
  ('Верифицированный', 'Все навыки подтверждены преподавателем', 'shield', 500),
  ('Early Bird', 'Зарегистрировался в первую неделю', 'sunrise', 100),
  ('Активист', 'Выполнил 20 действий на платформе', 'zap', 250)
on conflict (name) do nothing;
