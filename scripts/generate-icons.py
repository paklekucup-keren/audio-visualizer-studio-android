from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1] / "assets" / "images"
DESKTOP_ASSETS = Path(__file__).resolve().parents[1] / "desktop" / "assets"
ROOT.mkdir(parents=True, exist_ok=True)
DESKTOP_ASSETS.mkdir(parents=True, exist_ok=True)
SIZE = 1024


def mark(size: int, color=(68, 235, 215, 255)) -> Image.Image:
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    center = size / 2
    unit = size / 1024
    draw.ellipse(
        (center - 346 * unit, center - 346 * unit, center + 346 * unit, center + 346 * unit),
        outline=(54, 227, 207, 70),
        width=max(2, int(9 * unit)),
    )
    x_positions = [-220, -142, -64, 14, 92, 170, 248]
    heights = [70, 158, 248, 174, 290, 184, 82]
    bar_width = 38
    for x, height in zip(x_positions, heights):
        x0 = center + x * unit
        y0 = center - height * unit / 2
        y1 = center + height * unit / 2
        draw.rounded_rectangle(
            (x0 - bar_width * unit / 2, y0, x0 + bar_width * unit / 2, y1),
            radius=max(3, int(19 * unit)),
            fill=color,
        )
    draw.arc(
        (center - 205 * unit, center - 86 * unit, center + 205 * unit, center + 86 * unit),
        start=200,
        end=340,
        fill=(171, 255, 246, 210),
        width=max(2, int(10 * unit)),
    )
    return image


icon = Image.new("RGBA", (SIZE, SIZE), (8, 11, 16, 255))
icon.alpha_composite(mark(SIZE, (65, 229, 210, 255)))
icon.save(ROOT / "icon.png")
mark(SIZE, (65, 229, 210, 255)).save(ROOT / "android-icon-foreground.png")
Image.new("RGBA", (SIZE, SIZE), (8, 11, 16, 255)).save(ROOT / "android-icon-background.png")
mark(SIZE, (255, 255, 255, 255)).save(ROOT / "android-icon-monochrome.png")
mark(SIZE, (65, 229, 210, 255)).save(ROOT / "splash-icon.png")
icon.resize((96, 96), Image.Resampling.LANCZOS).save(ROOT / "favicon.png")
icon.save(
    DESKTOP_ASSETS / "icon.ico",
    format="ICO",
    sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
)
