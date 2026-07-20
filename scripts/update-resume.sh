#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CN_SOURCE=""
EN_SOURCE=""
BUILD_MODE="ask"
VERSION="$(date +%Y%m%d%H%M)"

usage() {
  cat <<USAGE
Usage: scripts/update-resume.sh [--cn /path/to/cn.pdf] [--en /path/to/en.pdf] [--build|--no-build]
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --cn)
      CN_SOURCE="${2:-}"
      shift 2
      ;;
    --en)
      EN_SOURCE="${2:-}"
      shift 2
      ;;
    --build)
      BUILD_MODE="yes"
      shift
      ;;
    --no-build)
      BUILD_MODE="no"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$CN_SOURCE" && -z "$EN_SOURCE" ]]; then
  echo "Please provide at least one resume PDF with --cn or --en." >&2
  exit 1
fi

mkdir -p "$ROOT/assets/resume" "$ROOT/source-assets/raw/resume"

copy_resume() {
  local source_file="$1"
  local runtime_name="$2"
  local label="$3"

  if [[ ! -f "$source_file" ]]; then
    echo "$label source file does not exist: $source_file" >&2
    exit 1
  fi

  case "${source_file##*.}" in
    pdf|PDF) ;;
    *)
      echo "$label must be a PDF file: $source_file" >&2
      exit 1
      ;;
  esac

  local base_name
  base_name="$(basename "$source_file")"
  local raw_name="${VERSION}-${label}-${base_name}"

  cp "$source_file" "$ROOT/source-assets/raw/resume/$raw_name"
  cp "$source_file" "$ROOT/assets/resume/$runtime_name"

  local size_bytes
  size_bytes="$(wc -c < "$source_file" | tr -d ' ')"
  echo "Updated $label resume -> assets/resume/$runtime_name ($size_bytes bytes)"
  echo "Raw backup -> source-assets/raw/resume/$raw_name"
}

if [[ -n "$CN_SOURCE" ]]; then
  copy_resume "$CN_SOURCE" "Ye-Nan-Resume-CN.pdf" "CN"
fi

if [[ -n "$EN_SOURCE" ]]; then
  copy_resume "$EN_SOURCE" "Nan-YE.pdf" "EN"
fi

# Replace resume links using the stable download="..." attribute as anchor (much more
# robust than regex-matching href paths that evolve with directory renames).
if grep -q 'download="Ye_Nan_Resume_CN\.pdf"' "$ROOT/index.html"; then
  sed -i '' -E 's#href="[^"]*" download="Ye_Nan_Resume_CN\.pdf"#href="assets/resume/Ye-Nan-Resume-CN.pdf?v='"$VERSION"'" download="Ye_Nan_Resume_CN.pdf"#' "$ROOT/index.html"
  echo "✓ Updated CN resume link in index.html (v=$VERSION)"
else
  echo "⚠ CN resume link not found in index.html — please add manually."
fi

if grep -q 'download="Nan_YE_Resume\.pdf"' "$ROOT/index.html"; then
  sed -i '' -E 's#href="[^"]*" download="Nan_YE_Resume\.pdf"#href="assets/resume/Nan-YE.pdf?v='"$VERSION"'" download="Nan_YE_Resume.pdf"#' "$ROOT/index.html"
  echo "✓ Updated EN resume link in index.html (v=$VERSION)"
else
  echo "⚠ EN resume link not found in index.html — please add manually."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Resume update complete! Next steps:"
echo "  1. Review changes:  git diff"
echo "  2. Commit & push:   git add -A && git commit -m 'chore: update resume PDFs' && git push"

if [[ "$BUILD_MODE" == "yes" ]]; then
  if command -v node >/dev/null 2>&1; then
    (cd "$ROOT" && node scripts/build-site.mjs)
  else
    echo "Node.js was not found in PATH, so local build was skipped."
    echo "Cloudflare Pages can still build after you push to GitHub."
  fi
elif [[ "$BUILD_MODE" == "ask" ]]; then
  echo "Build was not requested by command line."
fi

echo
echo "Current Git status:"
(cd "$ROOT" && git status --short)
