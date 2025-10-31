Build a **static React web app** called **Dynasty Trade Calculator** using Vite or Create React App, designed to be hosted on GitHub Pages.

Requirements:

1. Data sources:
  - Load the Dynasty Process CSV file (`values.csv`) directly from the public GitHub raw URL via a fetch request on app load.
  - Fetch the FantasyCalc API values live from `https://api.fantasycalc.com/values/current?isDynasty=true&numQbs=1&numTeams=12&ppr=1`.
  
2. Data processing:
  - Parse the CSV into a lookup dictionary mapping player IDs or names to their dynasty values.
  - Parse the FantasyCalc JSON API response similarly.
  - Create a merged lookup function that:
    - Uses FantasyCalc value if available.
    - Else uses Dynasty Process CSV value.
    - If both available, returns a weighted average (70% FantasyCalc, 30% Dynasty Process).
    - If neither, returns a fallback default value (e.g., 5).

3. UI:
  - Two input columns (Team A and Team B), where users can:
    - Manually add players by entering player name or selecting from a dropdown loaded from merged player list.
    - Enter player's age and position.
    - Optionally add draft picks (identify round and year).
  - A league settings panel with toggles for Superflex, TE Premium, and PPR.
  - A "Calculate Trade" button.

4. Scoring:
  - When "Calculate Trade" is clicked, sum the merged values for Team A and Team B players.
  - Compute the trade fairness score as:
    - `diff = totalA - totalB`
    - `fairnessPct = 100 - min(abs(diff) / avg(totalA, totalB) * 100, 100)`
  - Display:
    - Numeric values for Team A and Team B.
    - Fairness percentage.
    - A color-coded fairness bar (green for >90%, yellow 70–90%, red <70%).
    - A text summary like "Team A gains +12% value" or "Fair trade".

5. Tech details:
  - Use React functional components with hooks.
  - Use a UI library like Chakra UI or Tailwind CSS for styling.
  - All data fetching and calculations happen client-side; no backend.
  - Optimize for GitHub Pages (static assets only).
  - Include error handling for API failures or missing data.

6. Bonus:
  - Add a shareable link feature that encodes the trade state in the URL query parameters.
  - Responsive layout for mobile and desktop.

Please write all necessary React components, utility functions for CSV parsing, API fetching, trade scoring, and UI code in TypeScript.

---

This will make a fully static, user-friendly dynasty trade calculator app that pulls live values from FantasyCalc and supplements with Dynasty Process CSV data — perfect for early launch on GitHub Pages.

---
