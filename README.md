# RRG Group Dashboard

Static GitHub Pages dashboard for weekly RRG performance reporting.

## Files

- `index.html` — dashboard shell and pages
- `css/styles.css` — styling
- `js/app.js` — dashboard logic, admin import and trends
- `data/weekly-data.js` — current weekly data source

## Weekly update process

1. Open the live dashboard.
2. Go to **Admin Update**.
3. Upload:
   - `Weekly Update.xlsx`
   - `SalesActivity.xls`
4. Click **Preview Import**.
5. Click **Publish Snapshot**.
6. Click **Download data.js**.
7. Replace `data/weekly-data.js` in GitHub with the downloaded file.

GitHub Pages will refresh after the commit.

## Notes

The dashboard is plain HTML/CSS/JavaScript so it runs on GitHub Pages without a build step.
