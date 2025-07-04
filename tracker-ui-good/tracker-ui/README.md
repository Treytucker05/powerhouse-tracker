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

### Prerequisites
This project uses **pnpm** for package management. Ensure you have it set up:

```bash
# One-time system setup (if not already done)
npm install --global corepack@latest
corepack enable pnpm
corepack prepare pnpm@latest-10 --activate
```

### Development Setup
```bash
# Install dependencies
pnpm install --frozen-lockfile

# Start development server
pnpm run dev

# Run tests
pnpm run test

# Build for production
pnpm run build

# Lint and fix code
pnpm run lint
# Install dependencies (from tracker-ui directory)
pnpm install --frozen-lockfile

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Run tests
pnpm run test

# Run tests with coverage
pnpm run test:unit

# Run E2E tests
pnpm run test:e2e

# Lint code
pnpm run lint
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
- `user_id` (uuid, NOT NULL, default: auth.uid())

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

## Troubleshooting

### pnpm Issues
- **Command not found**: Run `corepack enable pnpm` to activate pnpm
- **Wrong version**: This project uses pnpm@9.15.0 (locked via `packageManager` field)
- **Permission errors**: Make sure Corepack is properly installed: `npm install --global corepack@latest`
- **Cache issues**: Clear pnpm cache with `pnpm store prune`

### Build Issues
- **Build fails**: Ensure `.env` variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- **Charts not loading**: Verify the Chart.js bundle exists inside the `dist/` folder after running `pnpm run build`
- **Tests failing**: Run `pnpm test -- --verbose` to see detailed errors
- **Large bundle warning**: This is normal; we've optimized with code splitting in `vite.config.js`

### Development
- **Hot reload not working**: Try `pnpm run dev --force` to bypass cache
- **TypeScript errors**: Run `pnpm run build` to see all type errors
- **Linting failures**: Run `pnpm run lint` to see style issues
