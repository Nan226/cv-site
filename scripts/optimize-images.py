#!/usr/bin/env python3
from pathlib import Path
import sys

from PIL import Image, ImageOps


def optimize(source_root: Path, assets_root: Path) -> None:
    jobs = [
        ("About me/照片1.JPEG", "about/profile.webp", 720, 72),
        ("About me/照片2.jpg", "about/huaqiao.webp", 720, 72),
        ("About me/照片3.png", "about/keendata.webp", 720, 72),
        ("About me/照片4.png", "about/polyu.webp", 720, 72),
        ("About me/照片5.png", "about/xgrids.webp", 720, 72),
        ("About me/照片6.png", "about/chery.webp", 720, 72),
        ("照片.JPG", "about/profile-logo.webp", 240, 72),
        ("Internship/卡片1.jpg", "internship/keendata.webp", 900, 72),
        ("Internship/卡片2.jpg", "internship/xgrids.webp", 900, 72),
        ("Internship/卡片3.jpg", "internship/chery.webp", 900, 72),
        ("HOME/娃娃正面.png", "home/character-fallback.webp", 520, 82),
        ("Projects/chiikawa-spring.jpg", "projects/chiikawa-spring.webp", 1440, 72),
        ("Play/chiikawa-side.jpg", "play/companion.webp", 640, 72),
        ("Play/图1.jpg", "play/pair-01-a.webp", 720, 68),
        ("Play/微信图片_20260716090703_468_85.jpg", "play/pair-01-b.webp", 720, 68),
        ("Play/微信图片_20260716090746_469_85.jpg", "play/pair-02-a.webp", 720, 68),
        ("Play/微信图片_20260716091459_479_85.jpg", "play/pair-02-b.webp", 720, 68),
        ("Play/微信图片_20260716090847_471_85.jpg", "play/pair-03-a.webp", 720, 68),
        ("Play/微信图片_20260716090901_472_85.jpg", "play/pair-03-b.webp", 720, 68),
        ("Play/微信图片_20260716090959_475_85.jpg", "play/pair-04-a.webp", 720, 68),
        ("Play/微信图片_20260716091044_478_85.jpg", "play/pair-04-b.webp", 720, 68),
        ("Play/微信图片_20260716090917_473_85.jpg", "play/pair-05-a.webp", 720, 68),
        ("Play/微信图片_20260716090943_474_85.jpg", "play/pair-05-b.webp", 720, 68),
        ("Play/微信图片_20260716091023_476_85.jpg", "play/pair-06-a.webp", 720, 68),
        ("Play/微信图片_20260716091037_477_85.jpg", "play/pair-06-b.webp", 720, 68),
    ]

    for source_name, output_name, max_size, quality in jobs:
        source = source_root / source_name
        output = assets_root / output_name
        output.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened)
            image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            if image.mode not in {"RGB", "RGBA"}:
                image = image.convert("RGBA" if "transparency" in image.info else "RGB")
            image.save(output, "WEBP", quality=quality, method=6)

        for suffix in (".jpg", ".jpeg", ".png"):
            legacy = output.with_suffix(suffix)
            if legacy != output and legacy.exists():
                legacy.unlink()

        print(f"Optimized {source_name} -> {output_name}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Usage: optimize-images.py SOURCE_ROOT ASSETS_ROOT")
    optimize(Path(sys.argv[1]), Path(sys.argv[2]))
