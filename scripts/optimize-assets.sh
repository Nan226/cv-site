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

photo() {
  local input="$1"
  local output="$2"
  local max_size="$3"
  local quality="$4"
  sips -Z "$max_size" -s format jpeg -s formatOptions "$quality" "$input" --out "$output" >/dev/null
}

photo "$SOURCE/About me/照片1.JPEG" "$ROOT/assets/about/profile.jpg" 960 74
photo "$SOURCE/About me/照片2.jpg" "$ROOT/assets/about/huaqiao.jpg" 960 74
photo "$SOURCE/About me/照片3.png" "$ROOT/assets/about/keendata.jpg" 960 74
photo "$SOURCE/About me/照片4.png" "$ROOT/assets/about/polyu.jpg" 960 74
photo "$SOURCE/About me/照片5.png" "$ROOT/assets/about/xgrids.jpg" 960 74
photo "$SOURCE/About me/照片6.png" "$ROOT/assets/about/chery.jpg" 960 74
photo "$SOURCE/照片.JPG" "$ROOT/assets/about/profile-logo.jpg" 480 78

cp "$SOURCE/About me/华侨大学校徽.png" "$ROOT/assets/about/huaqiao-logo.png"
cp "$SOURCE/About me/香港理工大学校徽.png" "$ROOT/assets/about/polyu-logo.png"
cp "$SOURCE/About me/Keendata.png" "$ROOT/assets/about/keendata-logo.png"
cp "$SOURCE/About me/XGRIDS.png" "$ROOT/assets/about/xgrids-logo.png"
cp "$SOURCE/About me/CHERY.png" "$ROOT/assets/about/chery-logo.png"

photo "$SOURCE/Internship/卡片1.jpg" "$ROOT/assets/internship/keendata.jpg" 1200 74
photo "$SOURCE/Internship/卡片2.jpg" "$ROOT/assets/internship/xgrids.jpg" 1200 74
photo "$SOURCE/Internship/卡片3.jpg" "$ROOT/assets/internship/chery.jpg" 1200 74

cp "$SOURCE/HOME/娃娃正面.png" "$ROOT/assets/home/character-fallback.png"
cp "$SOURCE/HOME/完美娃娃-web.glb" "$ROOT/assets/home/character.glb"
cp "$SOURCE/Projects/chiikawa-spring.jpg" "$ROOT/assets/projects/chiikawa-spring.jpg"
cp "$SOURCE/Play/chiikawa-side.jpg" "$ROOT/assets/play/companion.jpg"
cp "$ROOT/docs/PRD/Nan YE.pdf" "$ROOT/assets/resume/Nan-YE.pdf"

photo "$SOURCE/Play/图1.jpg" "$ROOT/assets/play/pair-01-a.jpg" 960 72
photo "$SOURCE/Play/微信图片_20260716090703_468_85.jpg" "$ROOT/assets/play/pair-01-b.jpg" 960 72
photo "$SOURCE/Play/微信图片_20260716090746_469_85.jpg" "$ROOT/assets/play/pair-02-a.jpg" 960 72
photo "$SOURCE/Play/微信图片_20260716091459_479_85.jpg" "$ROOT/assets/play/pair-02-b.jpg" 960 72
photo "$SOURCE/Play/微信图片_20260716090847_471_85.jpg" "$ROOT/assets/play/pair-03-a.jpg" 960 72
photo "$SOURCE/Play/微信图片_20260716090901_472_85.jpg" "$ROOT/assets/play/pair-03-b.jpg" 960 72
photo "$SOURCE/Play/微信图片_20260716090959_475_85.jpg" "$ROOT/assets/play/pair-04-a.jpg" 960 72
photo "$SOURCE/Play/微信图片_20260716091044_478_85.jpg" "$ROOT/assets/play/pair-04-b.jpg" 960 72
photo "$SOURCE/Play/微信图片_20260716090917_473_85.jpg" "$ROOT/assets/play/pair-05-a.jpg" 960 72
photo "$SOURCE/Play/微信图片_20260716090943_474_85.jpg" "$ROOT/assets/play/pair-05-b.jpg" 960 72
photo "$SOURCE/Play/微信图片_20260716091023_476_85.jpg" "$ROOT/assets/play/pair-06-a.jpg" 960 72
photo "$SOURCE/Play/微信图片_20260716091037_477_85.jpg" "$ROOT/assets/play/pair-06-b.jpg" 960 72

VIDEO_SOURCE="$SOURCE/Play/ai-video-production.m4v"
VIDEO_OUTPUT="$ROOT/assets/play/ai-video-production.m4v"
if [[ -f "$VIDEO_SOURCE" && -x /usr/bin/avconvert ]]; then
  /usr/bin/avconvert \
    --source "$VIDEO_SOURCE" \
    --preset PresetAppleM4V480pSD \
    --output "$VIDEO_OUTPUT" \
    --replace
fi

echo "Optimized runtime assets in assets/."
