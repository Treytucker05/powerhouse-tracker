#!/usr/bin/env bash
echo "📦 Dependency status"
npm outdated || true
echo
echo "🔒 Security audit"
npm audit --production || true
