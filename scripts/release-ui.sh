#!/usr/bin/env bash
# Builds packages/ui and force-pushes just the installable package (package.json, dist, README) to the
# `ui-dist` branch. npm cannot install from a subfolder of a git repo, so this branch is what other projects install:
#   npm i git+https://github.com/<owner>/<repo>.git#ui-dist
set -euo pipefail
cd "$(dirname "$0")/.."
REMOTE_URL="$(git remote get-url origin)"
VERSION="$(node -p "require('./packages/ui/package.json').version")"
SRC_SHA="$(git rev-parse --short HEAD)"

npm run build:ui
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp -R packages/ui/dist packages/ui/README.md "$TMP"/
# drop the workspace-only "source" condition and dev tooling from the published manifest
node -e '
  const p = require("./packages/ui/package.json");
  delete p.devDependencies; delete p.scripts;
  for (const k of Object.keys(p.exports)) delete p.exports[k].source;
  require("fs").writeFileSync(process.argv[1] + "/package.json", JSON.stringify(p, null, 2) + "\n");
' "$TMP"

cd "$TMP"
git init -q -b ui-dist
git add -A
git commit -q -m "@junction-kit/ui ${VERSION} (built from ${SRC_SHA})"
git push -f "$REMOTE_URL" ui-dist
git tag -f "ui-v${VERSION}"
git push -f "$REMOTE_URL" "ui-v${VERSION}"
echo "Published @junction-kit/ui ${VERSION} to branch ui-dist and tag ui-v${VERSION}"
