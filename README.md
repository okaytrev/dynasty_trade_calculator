# Dynasty Trade Calculator

A modern, user-friendly web application for analyzing fantasy football dynasty league trades using live player values from FantasyCalc API and Dynasty Process data.

## Features

- **Live Player Values**: Fetches real-time player valuations from FantasyCalc API
- **Dynasty Process Integration**: Supplements data with Dynasty Process CSV values
- **Weighted Calculations**: Uses 70% FantasyCalc and 30% Dynasty Process for accurate valuations
- **League Settings**: Customize for Superflex, TE Premium, and PPR leagues
- **Draft Pick Support**: Add and value future draft picks in trades
- **Trade Fairness Analysis**: Visual representation of trade fairness with color-coded indicators
- **Shareable Links**: Generate URLs to share trade proposals with league mates
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Client-Side Only**: No backend required - perfect for static hosting

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS v4** for styling
- **GitHub Pages** for deployment

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd dynastyTradeCalculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

### Setup

1. Create a new repository on GitHub
2. Initialize git and push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to your repository Settings > Pages
   - Set Source to "GitHub Actions"

4. Update the `base` in `vite.config.ts`:
```typescript
base: '/your-repo-name/',
```

5. Push your changes - the GitHub Action will automatically build and deploy

### Manual Deployment

Alternatively, you can deploy manually using:
```bash
npm run deploy
```

This requires the `gh-pages` branch to be configured.

## Usage

1. **Add Players**: Click "Add Player" for either team and search for players by name
2. **Add Draft Picks**: Click "Add Pick" to include future draft picks
3. **Adjust League Settings**: Toggle Superflex, TE Premium, and PPR settings
4. **Calculate Trade**: Click the "Calculate Trade" button to analyze fairness
5. **Share Trade**: Use the "Share Trade" button to generate a shareable link

## Trade Fairness Scoring

The app calculates fairness based on:
- **Green (90%+)**: Very fair trade
- **Yellow (70-90%)**: Moderately fair
- **Red (<70%)**: Potentially unfair trade

Formula: `fairness = 100 - min(|difference| / average * 100, 100)`

## Data Sources

- **FantasyCalc API**: `https://api.fantasycalc.com/values/current`
- **Dynasty Process**: GitHub raw CSV from dynasty process repository

## Project Structure

```
src/
├── components/          # React components
│   ├── LeagueSettings.tsx
│   ├── PlayerInput.tsx
│   ├── DraftPickInput.tsx
│   ├── TeamColumn.tsx
│   └── TradeResults.tsx
├── utils/              # Utility functions
│   ├── csvParser.ts
│   ├── apiClient.ts
│   ├── valueCalculator.ts
│   ├── tradeCalculator.ts
│   └── urlSharing.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Acknowledgments

- [FantasyCalc](https://www.fantasycalc.com/) for providing the player values API
- [Dynasty Process](https://github.com/dynastyprocess) for dynasty-specific valuations
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)
