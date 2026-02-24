Directory purpose: backend API services for AutoChord.

Local commands:
- npm install
- npm run dev

Migrations:
- npm run migrate

API endpoints:
- GET /health
- GET /api/status
- GET /api/songs
- GET /api/songs/:id
- POST /api/songs

POST /api/songs body:
- title: string
- artist: string
