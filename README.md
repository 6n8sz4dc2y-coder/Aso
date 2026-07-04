# RRG Group Dashboard

A static GitHub Pages dashboard for RRG Group weekly performance reporting.

## Files

- `index.html` - the main page
- `styles.css` - all styling
- `app.js` - dashboard data, tables, navigation and charts

## How to use with GitHub Pages

1. Create a GitHub repository called `rrg-group-dashboard`.
2. Upload these files into the root of the repository.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/ root**.
6. Save.
7. Open the GitHub Pages link once deployment finishes.

## Updating figures

For now, update the data inside `app.js`. Search for `const registrations` and `const usedCars`.

Later versions can add Excel upload or Google Sheet import.
