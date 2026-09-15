"""Compress only full-length homepage previews. Never overwrite originals."""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BIN = Path(r'E:\ffmpeg\ffmpeg-7.1.1-essentials_build\bin')
FFMPEG = str(BIN / 'ffmpeg.exe')
FFPROBE = str(BIN / 'ffprobe.exe')
OUT = ROOT / 'public/media/card-videos'
OUT.mkdir(parents=True, exist_ok=True)
VIDEOS = [
    ('manbo', 'manbo/manboyanshi.mp4'),
    ('chaji', 'chaji/chajiyanshi.mp4'),
    ('diy', 'DIY image/DIY imageyanshi.mp4'),
    ('redbook', 'red book/red bookyanshi.mp4'),
    ('douyin', 'douyin/douyinyanshi.mp4'),
]


def probe(path):
    return json.loads(subprocess.check_output([
        FFPROBE, '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)
    ], encoding='utf-8'))


report = []
for name, relative in VIDEOS:
    source = ROOT / 'public' / relative
    target = OUT / f'{name}.mp4'
    before = probe(source)
    if not target.exists():
        print(f'Encoding full-length {name}', flush=True)
        subprocess.run([
            FFMPEG, '-hide_banner', '-loglevel', 'error', '-n', '-i', str(source),
            '-map', '0:v:0', '-map', '0:a?', '-vf', 'scale=960:-2:flags=lanczos,fps=30',
            '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-maxrate', '1800k',
            '-bufsize', '3600k', '-pix_fmt', 'yuv420p', '-g', '60', '-threads', '4',
            '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', str(target),
        ], check=True)
    after = probe(target)
    original_duration = float(before['format']['duration'])
    duration = float(after['format']['duration'])
    assert abs(original_duration - duration) < 0.15, (name, original_duration, duration)
    subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', '-xerror', '-i', str(target), '-f', 'null', '-'], check=True)
    report.append({'name': name, 'originalBytes': source.stat().st_size,
                   'compressedBytes': target.stat().st_size, 'originalDuration': original_duration,
                   'compressedDuration': duration})
    print(f'OK {name}: {target.stat().st_size / 1e6:.2f} MB, {duration:.2f}s', flush=True)

(ROOT / 'tmp').mkdir(exist_ok=True)
(ROOT / 'tmp/card-video-compression.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print('All five full-length card videos passed decode and duration checks', flush=True)
