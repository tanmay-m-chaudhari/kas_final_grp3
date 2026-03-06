# JobBoard — Django + Gunicorn Job Board

A production-ready job board with job listings, company profiles, and application submissions.

## Features
- Browse and filter jobs by type, experience level, location, and keyword search
- Detailed job pages with application form (name, email, cover letter, resume upload)
- Company directory with open position counts
- Django admin for managing jobs, companies, and application statuses
- Whitenoise for static file serving in production

## Tech Stack
Django 5 · Gunicorn · SQLite · Whitenoise

## Run (Production)

```bash
pip install -r requirements.txt

# Apply migrations and seed data
python manage.py migrate
python manage.py seed_data
python manage.py collectstatic --noinput

# Start production server
gunicorn jobboard.wsgi:application --bind 0.0.0.0:8000 --workers 3
# → http://localhost:8000
```

> **Important:** Use `gunicorn`, NOT `python manage.py runserver`.

## Admin Panel
After seeding, log in at `/admin/` with `admin` / `admin123`.
