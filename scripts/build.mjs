import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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
  {
    id: 'free-stickers',
    name: 'Free Stickers Pack',
    author: 'Sergey Korobkoff',
    authorUrl: 'https://www.figma.com/@korobkoff',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl: 'https://www.figma.com/community/file/1115952276212246903/free-stickers-pack',
    sourceDir: '/Users/ivanpang/Downloads/Free Stickers pack (Community)',
  },
  {
    id: 'word-clippings',
    name: 'Word Clippings Retro Stickers',
    author: 'Dirtybarn',
    authorUrl: 'https://dirtybarn.com/',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl:
      'https://www.figma.com/community/file/1455532408821014814/word-clippings-retro-stickers-free',
    sourceDir: '/Users/ivanpang/Downloads/Word Clippings - Retro Stickers FREE (Community)',
  },
  {
    id: 'retro-stickers',
    name: 'Retro Stickers',
    author: 'Design Garage',
    authorUrl: 'https://www.figma.com/@des_garage',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl: 'https://www.figma.com/community/file/1358236713751987058/retro-stickers-free',
    sourceDir: '/Users/ivanpang/Downloads/🖖 RETRO  STICKERS FREE (Community)',
  },
  {
    id: 'project-status',
    name: 'Project Status Stickers',
    author: 'Iconfinder',
    authorUrl: 'https://www.figma.com/@Iconfinder',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl: 'https://www.figma.com/community/file/1128224635870836270/project-status-stickers',
    sourceDir: '/Users/ivanpang/Downloads/Project status stickers (Community)',
  },
  {
    id: 'brix-stickers',
    name: '100+ Stickers & Shapes',
    author: 'BRIX Templates',
    authorUrl: 'https://www.figma.com/@brixtemplates',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl:
      'https://www.figma.com/community/file/1131717954098372689/100-stickers-shapes-brix-templates',
    // Merged from multiple download folders of the same Figma file.
    sourceDirs: [
      '/Users/ivanpang/Downloads/100+ Stickers & Shapes _ BRIX Templates (Community)',
      '/Users/ivanpang/Downloads/100+ Stickers & Shapes _ BRIX Templates (Community) (1)',
      '/Users/ivanpang/Downloads/100+ Stickers & Shapes _ BRIX Templates (Community) (2)',
      '/Users/ivanpang/Downloads/100+ Stickers & Shapes _ BRIX Templates (Community) (3)',
      '/Users/ivanpang/Downloads/100+ Stickers & Shapes _ BRIX Templates (Community) (4)',
      '/Users/ivanpang/Downloads/100+ Stickers & Shapes _ BRIX Templates (Community) (5)',
    ],
  },
  {
    id: 'y2k-chromed',
    name: 'Y2K Chromed',
    author: 'Seeing Watching',
    authorUrl: 'https://www.figma.com/@seeingwatching',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl: 'https://www.figma.com/community/file/1457071600671965131/y2k-chromed-free',
    sourceDir: '/Users/ivanpang/Downloads/Y2k chromed free (Community)',
  },
  {
    id: 'y2k-pixel-icons',
    name: 'Y2K Abstract Pixel Icons',
    author: 'Seif Designera',
    authorUrl: 'https://www.figma.com/@digitaltelega',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl: 'https://www.figma.com/community/file/1622310464019186799/y2k-abstract-pixel-icons',
    sourceDir: '/Users/ivanpang/Downloads/Y2K Abstract Pixel Icons (Community)',
  },
  {
    id: 'brutalism-elements',
    name: 'Brutalism Elements',
    author: 'Seif Designera',
    authorUrl: 'https://www.figma.com/@digitaltelega',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl: 'https://www.figma.com/community/file/1638166204238617118/brutalism-elements',
    sourceDir: '/Users/ivanpang/Downloads/Brutalism Elements (Community)',
  },
  {
    id: 'vintage-y2k-frames',
    name: 'Vintage & Y2K Frames',
    author: 'Vlada',
    authorUrl: 'https://www.figma.com/@vladamoto',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl:
      'https://www.figma.com/community/file/1646469205666975543/set-of-vintage-y2k-frames-from-tg-blog-visualllculture',
    sourceDirs: [
      '/Users/ivanpang/Downloads/SET OF VINTAGE & Y2K FRAMES __ FROM_ TG-BLOG @VISUALLLCULTURE ⌒☆ (Community)',
      '/Users/ivanpang/Downloads/SET OF VINTAGE & Y2K FRAMES __ FROM_ TG-BLOG @VISUALLLCULTURE ⌒☆ (Community) (1)',
      '/Users/ivanpang/Downloads/SET OF VINTAGE & Y2K FRAMES __ FROM_ TG-BLOG @VISUALLLCULTURE ⌒☆ (Community) (2)',
      '/Users/ivanpang/Downloads/SET OF VINTAGE & Y2K FRAMES __ FROM_ TG-BLOG @VISUALLLCULTURE ⌒☆ (Community) (3)',
    ],
  },
  {
    id: 'acid-graphics',
    name: 'Acid Graphics',
    author: 'Artsem Pachabut',
    authorUrl: 'https://www.figma.com/@artyompochebut',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl: 'https://www.figma.com/community/file/1607756253697616515/acid-graphics-free-45-png-pack',
    sourceDir: '/Users/ivanpang/Downloads/Acid Graphics Free — 45+ PNG Pack (Community)',
  },
];

function slugFromFilename(filename) {
  const base = path.basename(filename, path.extname(filename));
  // Prefer full descriptive slug when the name has text (e.g. "01 Hot", "Figure 1").
  // Fall back to trailing digits only for bare numbered exports like "03.png".
  if (/[a-zA-Z]/.test(base)) {
    return base
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  const m = base.match(/(\d+)\s*$/);
  if (m) return m[1].padStart(2, '0');
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function sha1File(filePath) {
  return crypto.createHash('sha1').update(fs.readFileSync(filePath)).digest('hex');
}

function listPngSources(pack) {
  const dirs = pack.sourceDirs ?? (pack.sourceDir ? [pack.sourceDir] : []);
  const entries = [];
  dirs.forEach((dir, batch) => {
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith('.png'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    for (const file of files) {
      entries.push({ batch, dir, file, src: path.join(dir, file) });
    }
  });
  return entries;
}

async function convertOne(srcPath, hdPath, thumbPath) {
  const meta = await sharp(srcPath).metadata();
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
  // Keep .git / scripts; only rebuild pack assets + catalog.
  const packsRoot = path.join(OUT, 'packs');
  fs.rmSync(packsRoot, { recursive: true, force: true });
  fs.mkdirSync(packsRoot, { recursive: true });

  const catalog = { version: 1, packs: [] };

  for (const pack of PACKS) {
    const packRoot = path.join(OUT, 'packs', pack.id);
    const hdDir = path.join(packRoot, 'hd');
    const thumbDir = path.join(packRoot, 'thumbnails');
    fs.mkdirSync(hdDir, { recursive: true });
    fs.mkdirSync(thumbDir, { recursive: true });

    const multiDir = Array.isArray(pack.sourceDirs) && pack.sourceDirs.length > 0;
    const sources = listPngSources(pack);
    const seen = new Set();
    const stickers = [];

    for (const entry of sources) {
      const hash = sha1File(entry.src);
      if (seen.has(hash)) {
        console.log(`${pack.id}: skip dup ${entry.file}`);
        continue;
      }
      seen.add(hash);

      const baseSlug = slugFromFilename(entry.file);
      const slug = multiDir ? `b${entry.batch}-${baseSlug}` : baseSlug;
      const filename = `${slug}.webp`;
      await convertOne(entry.src, path.join(hdDir, filename), path.join(thumbDir, filename));
      stickers.push({
        id: `${pack.id}-${slug}`,
        thumbnailUrl: `${CDN_BASE}/packs/${pack.id}/thumbnails/${filename}`,
        hdUrl: `${CDN_BASE}/packs/${pack.id}/hd/${filename}`,
      });
      console.log(`${pack.id}: ${entry.file} -> ${filename}`);
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
| Free Stickers Pack | [Sergey Korobkoff](https://www.figma.com/@korobkoff) | [Figma Community](https://www.figma.com/community/file/1115952276212246903/free-stickers-pack) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Word Clippings Retro Stickers | [Dirtybarn](https://dirtybarn.com/) | [Figma Community](https://www.figma.com/community/file/1455532408821014814/word-clippings-retro-stickers-free) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Retro Stickers | [Design Garage](https://www.figma.com/@des_garage) | [Figma Community](https://www.figma.com/community/file/1358236713751987058/retro-stickers-free) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Project Status Stickers | [Iconfinder](https://www.figma.com/@Iconfinder) | [Figma Community](https://www.figma.com/community/file/1128224635870836270/project-status-stickers) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| 100+ Stickers & Shapes | [BRIX Templates](https://www.figma.com/@brixtemplates) | [Figma Community](https://www.figma.com/community/file/1131717954098372689/100-stickers-shapes-brix-templates) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Y2K Chromed | [Seeing Watching](https://www.figma.com/@seeingwatching) | [Figma Community](https://www.figma.com/community/file/1457071600671965131/y2k-chromed-free) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Y2K Abstract Pixel Icons | [Seif Designera](https://www.figma.com/@digitaltelega) | [Figma Community](https://www.figma.com/community/file/1622310464019186799/y2k-abstract-pixel-icons) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Brutalism Elements | [Seif Designera](https://www.figma.com/@digitaltelega) | [Figma Community](https://www.figma.com/community/file/1638166204238617118/brutalism-elements) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Vintage & Y2K Frames | [Vlada](https://www.figma.com/@vladamoto) | [Figma Community](https://www.figma.com/community/file/1646469205666975543/set-of-vintage-y2k-frames-from-tg-blog-visualllculture) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Acid Graphics | [Artsem Pachabut](https://www.figma.com/@artyompochebut) | [Figma Community](https://www.figma.com/community/file/1607756253697616515/acid-graphics-free-45-png-pack) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |

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
