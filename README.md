# Campus Event Registration System

A small IPT1 portfolio project using HTML, CSS, JavaScript, Node.js, Express, JSON, and a REST API.

## Features

- GET `/api/events` — list registrations (200)
- POST `/api/events` — add a registration (201)
- DELETE `/api/events/:id` — delete a registration (204)
- Server-side validation (400)
- Missing registration response (404)
- Front-end loading, success, and error messages
- Safe rendering with `textContent`

## Requirements

- Node.js and npm installed

## Run locally

1. Open this folder in a terminal.
2. Run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000` in your browser.

## Registration fields

- `name`
- `section`
- `event`

## Important note about storage

This starter version stores records in an in-memory array. Records are cleared when the server restarts. This is suitable for demonstrating the required API behavior, but it is not permanent database storage.

## GitHub upload

Do not upload `node_modules`. The `.gitignore` file excludes it.

```bash
git init
git add .
git commit -m "Create campus event registration system"
git branch -M main
git remote set-url origin https://github.com/Ben8Ben/Campus-Event-Registration.git
git push -u origin main
```
