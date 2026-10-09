# Chess Tournament Manager

Веб-приложение для управления шахматными турнирами: создание турнира,
регистрация участников, жеребьёвка, ввод результатов, турнирная таблица
и итоги с призёрами.

## Стек

**Frontend**
- React 19 + TypeScript
- Vite
- MUI v9
- React Router v7
- Framer Motion
- dayjs

**Backend**
- Python 3.12
- FastAPI
- SQLAlchemy
- Pydantic v2 / pydantic-settings
- PostgreSQL 16
- psycopg2-binary

**Инфраструктура**
- Docker + docker-compose

## Возможности

- Список турниров для live партий
- Создание турнира с настройкой: система (швейцарская / круговая),
  контроль времени, время начала, количество раундов,
  максимум участников, обсчёт рейтинга, ссылка на форму регистрации
- Управление участниками: добавление, снятие с турнира
- Жизненный цикл турнира: регистрация, в процессе, завершён
- Жеребьёвка по упрощённой швейцарской системе (в дальнейшем может быть интеграция с py4swiss)
- Ввод и редактирование результатов партий
- Турнирная таблица с сортировкой по алфавиту / рейтингу / очкам
- Итоги турнира
- Экспорт турнирной таблицы в Excel и PDF (в разработке)

## Модель данных

**Tournament** — турнир.
Поля: id (UUID), name, type (`swiss` / `round-robin`),
status (`draft` / `registration` / `active` / `finished`),
start_date, end_date, start_time, location, total_rounds,
max_players, use_rating, registration_url.
Контроль времени хранится тремя колонками:
`tc_base_minutes`, `tc_increment_seconds`, `tc_label`.

**Player** — участник турнира.
FK `tournament_id` → `tournaments.id` (`ON DELETE CASCADE`).
Поля: name, rating, federation, is_active.

**Round** — раунд турнира.
FK `tournament_id` → `tournaments.id` (`ON DELETE CASCADE`).
Поля: number, status, announced_at.

**Match** — партия.
FK `round_id` → `rounds.id` (`ON DELETE CASCADE`),
FK `white_player_id` → `players.id` (`ON DELETE CASCADE`),
FK `black_player_id` → `players.id` (`ON DELETE SET NULL`).
Поля: board_number, result.

### Связи
- Tournament 1 → N Player
- Tournament 1 → N Round
- Round 1 → N Match
- Match N → 2 Player (белые и чёрные)

## Настройка окружения

### Корневой `.env` (для docker-compose)

Скопируйте `.env.example` в `.env` и при необходимости измените:

```env
POSTGRES_USER=chess
POSTGRES_PASSWORD=change_me_in_production
POSTGRES_DB=chess_tournament
POSTGRES_PORT=5432
BACKEND_PORT=8000
FRONTEND_PORT=5173