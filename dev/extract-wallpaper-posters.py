"""Extract static video previews; originals are never modified."""
import json
from pathlib import Path
import cv2

root = Path(__file__).resolve().parents[1]
items = json.loads((root / 'src/data/wallpaperVideos.json').read_text(encoding='utf-8'))
destination = root / 'public/red book/posters'
destination.mkdir(exist_ok=True)
for item in items:
    source = root / 'public' / item['src'].lstrip('/')
    capture = cv2.VideoCapture(str(source))
    capture.set(cv2.CAP_PROP_POS_MSEC, 100)
    ok, frame = capture.read()
    capture.release()
    if not ok:
        raise RuntimeError(f'Cannot extract frame: {source.name}')
    height, width = frame.shape[:2]
    frame = cv2.resize(frame, (max(1, round(width * 480 / height)), 480))
    ok, encoded = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 82])
    if not ok:
        raise RuntimeError(f'Cannot encode: {source.name}')
    encoded.tofile(str(destination / (source.stem + '.jpg')))
print(f'Extracted {len(items)} static previews')
