# Proofy — задание для бэкенда

Фронтенд готов и работает: https://nuralyga07-netizen.github.io/proofy/
Сейчас «сервер» имитируется в браузере: объект `API` в `app.js` (поиск по `const API = {`). Задача — сделать настоящий сервер с теми же эндпоинтами, чтобы фронт переключился на него заменой этих функций на `fetch`.

**Главное правило:** форму ответов не менять. Фронт уже ждёт именно такие поля, как ниже.

## Стек (рекомендация)

- **Node.js + Fastify** или **Python + FastAPI** — что команде привычнее.
- **PostgreSQL** (подойдёт бесплатный Supabase или Neon).
- Хостинг: Render, Railway или Fly.io, бесплатный тариф.
- CORS: разрешить `https://nuralyga07-netizen.github.io`.

Если до финала мало времени, минимум — **только `GET /v1/certificates/{id}/verify`** и **`POST /v1/contests/{id}/certificates`**. Это и есть ядро демо.

## Таблицы

```sql
create table orgs (
  id text primary key,
  name text not null,
  city text,
  verified boolean not null default false,
  public_key_jwk jsonb not null,      -- открытый ключ ECDSA P-256
  key_id text not null                 -- первые 16 hex SHA-256 от (x+y) ключа
);
-- Закрытые ключи организаторов НЕ хранить в этой таблице: env-переменные или KMS.

create table contests (
  id text primary key,
  code text unique not null,           -- 4 символа, напр. GH26
  org_id text references orgs(id),
  name text not null,
  direction text not null,             -- IT | Математика | Робототехника | Физика
  level text not null,                 -- school | city | region | national | intl
  participants int not null,
  selection boolean not null,
  paid boolean not null,
  awarded_pct int not null,            -- % награждённых
  date date not null,
  next_no int not null default 1
);

create table students (
  id text primary key,
  name text not null,
  grade int not null check (grade between 1 and 11),
  city text, school text, direction text,
  parent_consent boolean not null default false,
  in_search boolean not null default false,
  show_name boolean not null default false,
  public_portfolio boolean not null default false,
  contact text                          -- email; отдавать только по одобренному запросу
);

create table certificates (
  id text primary key,                  -- PRF-GH26-0001
  contest_id text references contests(id),
  student_id text references students(id),
  result text not null,                 -- winner | prize | finalist | participant
  signature text not null,              -- base64url, ECDSA P-256 / SHA-256
  key_id text not null,
  issued_at timestamptz default now()
);

create table buyers (id text primary key, name text, type text, api_key_hash text);

create table contact_requests (
  id text primary key,
  buyer_id text references buyers(id),
  student_id text references students(id),
  purpose text not null,
  status text not null default 'pending', -- pending | approved | declined
  created_at timestamptz default now()
);

create table verification_log (id bigserial primary key, cert_id text, buyer_id text, ok boolean, at timestamptz default now());
```

## Подпись сертификата (важно сделать точно так же)

Строка, которую подписывает организатор:

```
PROOFY/1|{cert_id}|{org_id}|{contest_name}|{contest_date YYYY-MM-DD}|{student_id}|{result}
```

- Алгоритм: **ECDSA P-256, хеш SHA-256**, подпись в формате IEEE P1363 (r‖s, 64 байта), закодирована в base64url без `=`. Так делает WebCrypto в браузере.
- Node: `crypto.sign('sha256', data, { key, dsaEncoding: 'ieee-p1363' })`.
- Python: `cryptography` → `ec.ECDSA(hashes.SHA256())`, затем `decode_dss_signature` → склеить r и s по 32 байта.
- Проверка «изменённого результата»: та же строка, но с `result` из документа. Если подпись не сходится, документ подделан.

## Вес конкурса (0–100)

```
вес = база_уровня + min(15, round(log10(участники) * 5))
      + 10 если есть отбор
      − 30 если организатор не подтверждён
      − 25 если платно и без отбора
      − 20 если наградили > 50%
база: school 20, city 35, region 55, national 75, intl 85; итог обрезать до 0..100
баллы_за_сертификат = round(вес × k), k: winner 1.0, prize 0.7, finalist 0.4, participant 0.15
```

## Эндпоинты

| Метод | Путь | Кто вызывает | Что делает |
| --- | --- | --- | --- |
| GET | `/v1/certificates/{id}/verify?claimed_result=winner` | кто угодно | проверка сертификата |
| POST | `/v1/contests` | организатор | новый конкурс |
| POST | `/v1/contests/{id}/certificates` | организатор | выдача пачкой |
| GET | `/v1/contests?direction=IT` | кто угодно | рейтинг конкурсов с весом |
| GET | `/v1/orgs/{id}/public-key` | кто угодно | открытый ключ (JWK) |
| GET | `/v1/talents?city=&direction=&min_weight=` | покупатель | поиск школьников |
| POST | `/v1/contact-requests` | покупатель | запрос контакта |
| PATCH | `/v1/contact-requests/{id}` | школьник | `{"status":"approved"}` или `declined` |
| PATCH | `/v1/students/{id}/consent` | школьник | `{"field":"parent_consent","value":true}` |

### GET /v1/certificates/{id}/verify

`200`:
```json
{
  "found": true,
  "cert": { "id": "PRF-GH26-0001", "contest_id": "k1", "result": "winner", "key_id": "3fa2..." },
  "holder": { "display_name": "А. Н.", "grade": 10, "city": "Хромтау" },
  "contest": { "name": "Gambit Hackathon 2026", "level": "region", "weight": 77, "weight_parts": [["Уровень: областной", 55], ["300 участников", 12], ["Есть отборочный этап", 10]] },
  "org": { "name": "Gambit Hackathon (HackHub)", "verified": true },
  "sig_ok": true,
  "claimed_result_sig_ok": null,
  "points": 77
}
```
`404`: `{ "found": false }`

- `display_name`: полное имя, только если `show_name = true`; иначе инициалы.
- Каждую проверку писать в `verification_log`.

### POST /v1/contests/{id}/certificates

Тело:
```json
{ "rows": [ { "name": "Алия Серикова", "grade": 10, "city": "Актобе", "school": "СОШ №12", "result": "winner" } ] }
```
Сервер ищет школьника по (name, school) или создаёт **скрытого** (все флаги согласия = false), выдаёт ID `PRF-{code}-{0001}`, подписывает ключом организатора. Ответ `201`: `{ "issued": ["PRF-GH26-0004", ...] }`.

### GET /v1/talents

Возвращает **только** школьников с `parent_consent = true AND in_search = true`. Без имени, школы и контакта, если нет одобренного запроса от этого покупателя. Плюс `hidden_count` — сколько скрыто.

## Правила доступа (данные несовершеннолетних)

1. Контакт школьника отдаётся только покупателю с одобренным запросом.
2. `in_search` нельзя включить без `parent_consent` (в рабочей версии согласие родителя — по SMS-коду).
3. Не хранить ИИН, телефон и фото.
4. Покупатель авторизуется ключом `Authorization: Bearer <key>`, в базе хранить только хеш.

## Тестовые данные

Взять из функции `seed()` в `app.js`: 4 организатора, 5 конкурсов, 6 школьников, 12 сертификатов, 2 покупателя. ID сертификатов должны совпасть: на напечатанных карточках для питча стоят `PRF-GH26-0001`, `PRF-OM26-0003` и `PRF-GH26-0999` (последнего не должно быть в базе).

## Как подключить к фронту

В `app.js` у объекта `API` каждая функция вызывает `api(method, path, handler)`. Замените `handler` на `fetch(API_BASE + path)` и верните `{ status, data, ms }` в том же виде. Больше ничего во фронте менять не нужно: журнал запросов на странице API продолжит работать.
