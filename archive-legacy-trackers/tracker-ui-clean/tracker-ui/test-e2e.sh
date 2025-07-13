# E2E Test Script
# Run this to test the application end-to-end

echo "Building application..."
pnpm run build

echo "Starting preview server..."
pnpm vite preview --port 5173 &
PREVIEW_PID=$!

echo "Waiting for server to start..."
sleep 5

echo "Running Playwright tests..."
pnpm playwright test

echo "Stopping preview server..."
kill $PREVIEW_PID

echo "E2E tests completed!"
