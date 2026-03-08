# Efficio Lion ADHD Planner Web App

Standalone gamified web version of the planner in:

- `/Users/prattpackmac/Downloads/Efficio/PDFs/Lion ADHD Planner Design.pdf`

## What it includes

- Monthly self-contract capture
- Daily execution guide with 6a-9p schedule
- Professional and personal priority tracking
- Wellness and flow-state habits
- Mind map, resource hub, and end-of-day reflection
- SMART goals with reverse-engineered steps
- Monthly budget tracker with live variance math
- General meeting and case-review templates
- Contacts and stakeholder tracking
- Gamification: XP, streaks, ranks, achievements, completion score
- Local persistence with JSON export/import

## Local environment

Start a local test environment:

```bash
cd lion-planner-web
./scripts/test-env.sh
```

The app is available at [http://localhost:8080](http://localhost:8080).

## Automated smoke test

```bash
./scripts/test-env.sh
```

If Docker is unavailable, the script automatically falls back to a local `python3 -m http.server` instance.

Command-center checks in this smoke test include:

- `Efficio Lion ADHD Planner`
- `Lion Command Center`

## Open it directly

Open `index.html` in a browser if you prefer file-based testing.

## Run with Docker

```bash
docker build -t efficio-lion-planner .
docker run --rm -p 8080:80 efficio-lion-planner
```

Then open [http://localhost:8080](http://localhost:8080).

## Notes

- Data is stored in browser `localStorage`.
- Changes in this app are local to the current browser profile unless you export/import data or deploy updated static files to the hosted webapp.
- Export regularly if you want a backup or to move data between browsers.
