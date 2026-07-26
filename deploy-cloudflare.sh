#!/bin/bash
# Read token from env file
source .env.deploy

ACCT="$CLOUDFLARE_ACCOUNT_ID"
TOKEN="$CLOUDFLARE_API_TOKEN"
PROJECT="shrimp-burger-memory"
DIST="dist"

echo "=== Uploading assets ==="
find "$DIST" -type f | while read f; do
  rel="${f#$DIST/}"
  echo "  $rel"
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCT/pages/projects/$PROJECT/assets" \
    -H "Authorization: Bearer $TOKEN" \
    -F "file=@$f" \
    -F "id=$rel" > /dev/null
done

echo ""
echo "=== Uploading deployment.json ==="
# Create deployment manifest
HASH=$(cat $DIST/index.html | md5sum | head -c 8)
cat > /tmp/deploy-cf.json << JSONDOC
{
  "manifest": {
$(find $DIST -type f | while read f; do
  rel="${f#$DIST/}"
  echo "    \"/$rel\": \"$HASH\""
done | paste -sd,)
  }
}
JSONDOC

curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCT/pages/projects/$PROJECT/deployments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"branch\":\"main\"}" | grep -o '"url":"[^"]*"'

echo ""
echo "=== Done! ==="
echo "https://$PROJECT.pages.dev"
