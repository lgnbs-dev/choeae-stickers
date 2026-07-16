import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const OUT = '/Users/ivanpang/Desktop/choeae-stickers';
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/lgnbs-dev/choeae-stickers@main';
const HD_MAX = 500;
const THUMB_MAX = 80;
const WEBP_HD_QUALITY = 82;
const WEBP_THUMB_QUALITY = 75;

const PACKS = [
  {
    id: 'y2k-hologram',
    name: 'Y2K Hologram Badges',
    author: 'Design Garage',
    authorUrl: 'https://www.figma.com/@des_garage',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl:
      'https://www.figma.com/community/file/1386684185250424926/y2k-hologram-badge-stickers-free',
    sourceDir: '/Users/ivanpang/Downloads/Y2K Hologram Badge Stickers FREE (Community)',
  },
  {
    id: 'grunged-peeled',
    name: 'GRUNGED Peeled Stickers',
    author: 'Artsem Pachabut',
    authorUrl: 'https://www.figma.com/@artyompochebut',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl:
      'https://www.figma.com/community/file/1240354284418405901/grunged-peeled-stickers-free',
    sourceDir: '/Users/ivanpang/Downloads/GRUNGED peeled stickers FREE (Community)',
  },
];

function slugFromFilename(filename) {
  const base = path.basename(filename, path.extname(filename));
  // "My project-10" -> "10"; "03" -> "03"
  const m = base.match(/(\d+)\s*$/);
  if (m) return m[1].padStart(2, '0');
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function convertOne(srcPath, hdPath, thumbPath) {
  const img = sharp(srcPath).ensureAlpha();
  const meta = await img.metadata();
  const w = meta.width || HD_MAX;
  const h = meta.height || HD_MAX;
  const hdScale = Math.min(1, HD_MAX / Math.max(w, h));
  const hdW = Math.max(1, Math.round(w * hdScale));
  const hdH = Math.max(1, Math.round(h * hdScale));
  const thumbScale = Math.min(1, THUMB_MAX / Math.max(w, h));
  const thumbW = Math.max(1, Math.round(w * thumbScale));
  const thumbH = Math.max(1, Math.round(h * thumbScale));

  await sharp(srcPath)
    .ensureAlpha()
    .resize(hdW, hdH, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_HD_QUALITY, alphaQuality: 90 })
    .toFile(hdPath);

  await sharp(srcPath)
    .ensureAlpha()
    .resize(thumbW, thumbH, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_THUMB_QUALITY, alphaQuality: 85 })
    .toFile(thumbPath);
}

async function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const catalog = { version: 1, packs: [] };

  for (const pack of PACKS) {
    const packRoot = path.join(OUT, 'packs', pack.id);
    const hdDir = path.join(packRoot, 'hd');
    const thumbDir = path.join(packRoot, 'thumbnails');
    fs.mkdirSync(hdDir, { recursive: true });
    fs.mkdirSync(thumbDir, { recursive: true });

    const pngs = fs
      .readdirSync(pack.sourceDir)
      .filter((f) => f.toLowerCase().endsWith('.png'))
      .sort((a, b) => {
        const na = parseInt(slugFromFilename(a), 10);
        const nb = parseInt(slugFromFilename(b), 10);
        if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return na - nb;
        return a.localeCompare(b);
      });

    const stickers = [];
    for (const file of pngs) {
      const slug = slugFromFilename(file);
      const filename = `${slug}.webp`;
      const src = path.join(pack.sourceDir, file);
      const hdPath = path.join(hdDir, filename);
      const thumbPath = path.join(thumbDir, filename);
      await convertOne(src, hdPath, thumbPath);
      stickers.push({
        id: `${pack.id}-${slug}`,
        thumbnailUrl: `${CDN_BASE}/packs/${pack.id}/thumbnails/${filename}`,
        hdUrl: `${CDN_BASE}/packs/${pack.id}/hd/${filename}`,
      });
      console.log(`${pack.id}: ${file} -> ${filename}`);
    }

    catalog.packs.push({
      id: pack.id,
      name: pack.name,
      author: pack.author,
      authorUrl: pack.authorUrl,
      license: pack.license,
      licenseUrl: pack.licenseUrl,
      sourceUrl: pack.sourceUrl,
      coverThumbnailUrl: stickers[0]?.thumbnailUrl ?? '',
      stickers,
    });
  }

  fs.writeFileSync(path.join(OUT, 'list.json'), JSON.stringify(catalog, null, 2) + '\n');

  const readme = `# choeae-stickers

On-demand sticker packs for Choeae (served via [jsDelivr](https://www.jsdelivr.com/github)).

## Catalog

\`\`\`
https://cdn.jsdelivr.net/gh/lgnbs-dev/choeae-stickers@main/list.json
\`\`\`

## Attribution

These packs are **CC BY 4.0**. Credit the original authors when redistributing.

| Pack | Author | Source | License |
|------|--------|--------|---------|
| Y2K Hologram Badges | [Design Garage](https://www.figma.com/@des_garage) | [Figma Community](https://www.figma.com/community/file/1386684185250424926/y2k-hologram-badge-stickers-free) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| GRUNGED Peeled Stickers | [Artsem Pachabut](https://www.figma.com/@artyompochebut) | [Figma Community](https://www.figma.com/community/file/1240354284418405901/grunged-peeled-stickers-free) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |

## Layout

\`\`\`
packs/<pack-id>/hd/*.webp
packs/<pack-id>/thumbnails/*.webp
list.json
\`\`\`
`;
  fs.writeFileSync(path.join(OUT, 'README.md'), readme);
  console.log('\\nWrote', path.join(OUT, 'list.json'));
  console.log('Packs:', catalog.packs.map((p) => `${p.id}(${p.stickers.length})`).join(', '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
