# TransitOps Backend

Node.js 20+/Express 4 + PostgreSQL 16+ (no ORM — hand-written parameterized SQL).

## Setup (3 commands)

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL / JWT_SECRET for your machine
npm run db:migrate     # or: npm run db:reset  (drops + recreates + seeds)
npm start               # http://localhost:4000
```

## Demo accounts (password: `Demo@1234`)

| Role | Email |
|---|---|
| Fleet Manager | manager@transitops.in |
| Dispatcher | dispatch@transitops.in |
| Safety Officer | safety@transitops.in |
| Financial Analyst | finance@transitops.in |

## Tests

```bash
npm start                    # server must be running in another terminal
npm run db:reset             # start from clean seed data
npm test                      # node --test tests/
```

54/54 endpoint tests passing (happy paths, validation, RBAC, and business-rule conflicts).
