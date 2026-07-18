#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="$ROOT/source-assets/images"

if [[ ! -d "$SOURCE" ]]; then
  SOURCE="$ROOT/images"
fi

if [[ ! -d "$SOURCE" ]]; then
  echo "Source images were not found. Expected source-assets/images or images." >&2
  exit 1
fi

mkdir -p \
  "$ROOT/assets/home" \
  "$ROOT/assets/about" \
  "$ROOT/assets/internship" \
  "$ROOT/assets/projects" \
  "$ROOT/assets/play" \
  "$ROOT/assets/resume"

PYTHON_BIN="${PYTHON_BIN:-python3}"
"$PYTHON_BIN" -c "from PIL import Image" >/dev/null 2>&1 || {
  echo "Pillow is required to generate WebP assets." >&2
  exit 1
}
"$PYTHON_BIN" "$ROOT/scripts/optimize-images.py" "$SOURCE" "$ROOT/assets"

cp "$SOURCE/About me/华侨大学校徽.png" "$ROOT/assets/about/huaqiao-logo.png"
cp "$SOURCE/About me/香港理工大学校徽.png" "$ROOT/assets/about/polyu-logo.png"
cp "$SOURCE/About me/Keendata.png" "$ROOT/assets/about/keendata-logo.png"
cp "$SOURCE/About me/XGRIDS.png" "$ROOT/assets/about/xgrids-logo.png"
cp "$SOURCE/About me/CHERY.png" "$ROOT/assets/about/chery-logo.png"

cp "$SOURCE/HOME/完美娃娃-web.glb" "$ROOT/assets/home/character.glb"
cp "$ROOT/docs/PRD/Nan YE.pdf" "$ROOT/assets/resume/Nan-YE.pdf"

VIDEO_SOURCE="$SOURCE/Play/数智运河.创享拱墅 AI 赋能大运河文化出海-《运河谜影》-香港理工大学-叶楠-中国香港.MOV"
if [[ ! -f "$VIDEO_SOURCE" ]]; then
  VIDEO_SOURCE="$SOURCE/Play/ai-video-production.m4v"
fi
VIDEO_OUTPUT="$ROOT/assets/play/ai-video-production.m4v"
if [[ -f "$VIDEO_SOURCE" && -x /usr/bin/avconvert ]]; then
  /usr/bin/avconvert \
    --source "$VIDEO_SOURCE" \
    --preset PresetAppleM4VWiFi \
    --output "$VIDEO_OUTPUT" \
    --replace
fi

echo "Optimized runtime assets in assets/."
