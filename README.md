# RRG Group Dashboard

Weekly dealership performance dashboard for registrations, used cars and centre fleet BCH.

## What it does

- Shows Q3 group performance from `Weekly update.xlsx`
- Includes North CDA and West Yorkshire summaries
- Shows registrations, used cars and BCH performance vs target
- Allows a weekly Excel upload from the browser
- Stores the uploaded data in the browser using local storage
- Includes centre drill-down views

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Weekly process

1. Export/save the latest `Weekly update.xlsx`.
2. Open the dashboard.
3. Click **Upload Weekly Update**.
4. Select the Excel file.
5. Dashboard refreshes automatically.

## Deploy

Recommended: Vercel.

1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. Deploy with the default Next.js settings.

## Current scope

Version 0.1 is deliberately simple:

- Dashboard
- Registrations
- Used Cars
- Centre detail
- Excel upload

Next likely additions:

- Enquiries
- Conversion
- Forecast
- Executive insight card
- Historical trend tracking
