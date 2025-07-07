# E2E Test Script
# Run this to test the application end-to-end

echo "Building application..."
npm run build

echo "Starting preview server..."
npm run preview -- --port 5173 &
PREVIEW_PID=$!

echo "Waiting for server to start..."
sleep 5

echo "Running Playwright tests..."
npm run test:e2e

echo "Stopping preview server..."
kill $PREVIEW_PID

echo "E2E tests completed!"
