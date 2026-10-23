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

## Запуск приложения
```bash
docker-compose up --build
```

API: http://localhost:8000  
Swagger: http://localhost:8000/docs  
Frontend: http://localhost:5173

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