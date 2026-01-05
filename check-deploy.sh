#!/bin/bash

echo "Checking deployment status..."
echo "Site: https://plannerum.vercel.app"
echo "Chat: https://plannerum.vercel.app/chat"
echo ""
echo "Will check every 30 seconds (Ctrl+C to stop)..."
echo ""

for i in {1..10}; do
  echo -n "Check $i ($(date '+%H:%M:%S')): "
  
  if curl -s -f https://plannerum.vercel.app > /dev/null; then
    echo "✅ Site is live!"
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "=== What to do next ==="
    echo "1. Open https://plannerum.vercel.app"
    echo "2. Open https://plannerum.vercel.app/chat"
    echo "3. Both pages should load"
    echo "4. Try sending messages in chat"
    echo ""
    echo "=== For real-time chat ==="
    echo "Now that we have a working deployment, we can add:"
    echo "1. Supabase Realtime for actual real-time messaging"
    echo "2. User authentication"
    echo "3. Better UI"
    exit 0
  else
    echo "⏳ Still building..."
  fi
  
  sleep 30
done

echo ""
echo "⚠️  Taking longer than expected..."
echo "Check manually: https://vercel.com/kolyas-projects/plannerum"
