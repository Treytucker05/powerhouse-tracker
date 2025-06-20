# PowerHouse Tracker - React UI

A modern React-based interface for the PowerHouse Training Tracker with Supabase integration.

## Features

- **Dashboard Home**: Weekly volume bar chart with fatigue status indicators and quick actions
- **Workout Logger**: Start/finish sessions, add sets with real-time tracking
- **Workout Sessions**: View all workout sessions in a clean table interface
- **Set Log Drawer**: Click any session row to open a sliding drawer showing detailed set information
- **Intelligence Page**: View adaptive RIR recommendations with confidence levels in card layout
- **Deload Analysis**: Analyze training fatigue and reset volumes to MEV when needed
- **Global State Management**: React Context for training state across components
- **Supabase Integration**: Real-time data fetching from Supabase backend
- **Responsive Design**: Built with Tailwind CSS for mobile-friendly interface

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## Environment Setup

Create a `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

1. **Dashboard**: Home page shows weekly volume chart, fatigue status, and quick actions
2. **Start Workout**: Navigate to Logger to start a new session and log sets in real-time
3. **View Sessions**: Browse all workout sessions and click rows for detailed set information
4. **Intelligence**: View adaptive RIR recommendations for each muscle group
5. **Deload Analysis**: Click "Analyze Deload Need" to check for fatigue and reset volumes
6. **Navigation**: Use the top navigation bar to switch between different features

## Development

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Database Schema

The application expects the following Supabase tables/views:

### `workout_sessions`
- `id` (primary key)
- `start_time` (timestamp)
- `end_time` (timestamp, nullable)
- `notes` (text, nullable)

### `workout_sets` 
- `id` (primary key)
- `session_id` (foreign key to workout_sessions)
- `set_number` (integer)
- `exercise` (text)
- `weight` (numeric)
- `reps` (integer)
- `rir` (numeric, nullable - Reps in Reserve)

### `rir_recommendations`
- `muscle` (text)
- `recommended_rir` (numeric)
- `confidence` (numeric, 0-1 scale)

### `weekly_volume` 
- `muscle` (text)
- `volume` (numeric)
- `week` (integer)

## Testing

The application includes comprehensive testing:

- **Unit Tests**: Jest tests for individual components and hooks
- **E2E Tests**: Playwright tests for full application workflows  
- **Linting**: ESLint for code quality
- **CI/CD**: Automated testing in GitHub Actions

Run tests locally:
```bash
pnpm run test        # Unit tests (watch mode)
pnpm run ci          # Unit tests (CI mode)  
pnpm run test:e2e    # E2E tests with Playwright
pnpm run lint        # Code linting
```

See `E2E_TESTING.md` for detailed E2E testing information.
