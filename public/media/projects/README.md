# 项目媒体文件

将项目封面和演示视频放在此目录，并在 `src/data/resume.js` 的
`portfolioProjects` 中配置对应路径。

```js
image: '/media/projects/project-name.webp',
video: '/media/projects/project-name.mp4',
poster: '/media/projects/project-name-poster.webp',
```

- 封面优先使用 WebP，建议控制在 300 KB 以内。
- 视频使用 MP4（H.264），建议 1080p 以下并压缩后上传。
- 文件名使用小写英文和连字符，不使用空格或中文。
- 有视频时仍应提供 `poster`，避免视频加载前出现空白。
