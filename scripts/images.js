import { mkdir, readdir } from 'node:fs/promises';
import sharp from 'sharp';
const source = new URL('../src/assets/images/', import.meta.url);
const output = new URL('../public/images/', import.meta.url);
await mkdir(output, { recursive: true });
for (const file of await readdir(source)) {
  if (!file.endsWith('.png')) continue;
  const input = new URL(file, source).pathname;
  const { width } = await sharp(input).metadata();
  for (const scale of [1, 2]) {
    const image = sharp(input).resize({
      width: Math.round((width * scale) / 2),
    });
    const name = new URL(file.replace('.png', `-${scale}x`), output).pathname;
    await Promise.all([
      image
        .clone()
        .avif({ quality: 55 })
        .toFile(name + '.avif'),
      image
        .clone()
        .webp({ quality: 82 })
        .toFile(name + '.webp'),
      image
        .clone()
        .jpeg({ quality: 88 })
        .toFile(name + '.jpg'),
    ]);
  }
}
