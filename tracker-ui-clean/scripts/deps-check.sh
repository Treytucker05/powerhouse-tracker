#!/usr/bin/env bash
echo "📦 Dependency status"
pnpm outdated || true
echo
echo "🔒 Security audit"
pnpm audit --production || true
