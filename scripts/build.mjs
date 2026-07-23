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
    id: 'y2k-elements',
    name: 'Y2K Elements',
    author: 'Алина Ревазян',
    authorUrl: 'https://www.figma.com/@63671c80_51f1_4',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl: 'https://www.figma.com/community/file/1555322950361847099/y2k-elements',
    sourceDir: '/Users/ivanpang/Downloads/y2k elements (Community)',
    coverSlug: 'planeta',
  },
{
    id: 'cats',
    name: 'Cats',
    author: 'Valentina',
    authorUrl: 'https://www.figma.com/@valenty63',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl: 'https://www.figma.com/community/file/1350875841892893027/the-best-memes-with-cats',
    sourceDir: '/Users/ivanpang/Downloads/The best memes with cats (Community)',
    coverSlug: 'happy-cat-01',
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
    id: 'hand-drawn-emojis',
    name: 'Hand Drawn Emojis Illustration Pack',
    author: 'Isaiah Trotter',
    authorUrl: 'https://www.figma.com/@isaiahtrotter1',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl:
      'https://www.figma.com/community/file/1280863093339672805/hand-drawn-emojis-illustration-pack',
    sourceDir: '/Users/ivanpang/Downloads/Hand Drawn Emojis Illustration Pack (Community)',
    coverSlug: 'surprised',
  },
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
    id: 'acid-graphics',
    name: 'Acid Graphics',
    author: 'Artsem Pachabut',
    authorUrl: 'https://www.figma.com/@artyompochebut',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl: 'https://www.figma.com/community/file/1607756253697616515/acid-graphics-free-45-png-pack',
    sourceDir: '/Users/ivanpang/Downloads/Acid Graphics Free — 45+ PNG Pack (Community)',
  },
]

const CYRILLIC_TO_LATIN = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

function transliterate(text) {
  return text
    .split('')
    .map((ch) => {
      const lower = ch.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(CYRILLIC_TO_LATIN, lower)) {
        const latin = CYRILLIC_TO_LATIN[lower];
        return ch === lower ? latin : latin.toUpperCase();
      }
      return ch;
    })
    .join('');
}

function slugFromFilename(filename) {
  const base = transliterate(path.basename(filename, path.extname(filename)));
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

function uniqueSlug(baseSlug, used) {
  let slug = baseSlug || 'sticker';
  if (!used.has(slug)) {
    used.add(slug);
    return slug;
  }
  let n = 2;
  while (used.has(`${slug}-${n}`)) n += 1;
  const next = `${slug}-${n}`;
  used.add(next);
  return next;
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

function sourcesAvailable(pack) {
  const dirs = pack.sourceDirs ?? (pack.sourceDir ? [pack.sourceDir] : []);
  return dirs.length > 0 && dirs.every((dir) => fs.existsSync(dir));
}

async function main() {
  // Keep .git / scripts; rebuild pack assets + catalog.
  // Optional: `node scripts/build.mjs y2k-elements` rebuilds only that pack.
  const onlyIds = new Set(process.argv.slice(2));
  const packsRoot = path.join(OUT, 'packs');
  const listPath = path.join(OUT, 'list.json');
  const existingCatalog = fs.existsSync(listPath)
    ? JSON.parse(fs.readFileSync(listPath, 'utf8'))
    : { version: 1, packs: [] };
  const existingById = new Map(existingCatalog.packs.map((p) => [p.id, p]));

  const packsToBuild = PACKS.filter((pack) => {
    if (onlyIds.size > 0 && !onlyIds.has(pack.id)) return false;
    if (!sourcesAvailable(pack)) {
      if (onlyIds.has(pack.id)) {
        throw new Error(`Source missing for ${pack.id}`);
      }
      console.log(`${pack.id}: skip (source missing, keep existing)`);
      return false;
    }
    return true;
  });

  if (onlyIds.size === 0 && packsToBuild.length === PACKS.length) {
    fs.rmSync(packsRoot, { recursive: true, force: true });
  }
  fs.mkdirSync(packsRoot, { recursive: true });

  const builtById = new Map();

  for (const pack of packsToBuild) {
    const packRoot = path.join(OUT, 'packs', pack.id);
    fs.rmSync(packRoot, { recursive: true, force: true });
    const hdDir = path.join(packRoot, 'hd');
    const thumbDir = path.join(packRoot, 'thumbnails');
    fs.mkdirSync(hdDir, { recursive: true });
    fs.mkdirSync(thumbDir, { recursive: true });

    const multiDir = Array.isArray(pack.sourceDirs) && pack.sourceDirs.length > 0;
    const sources = listPngSources(pack);
    const seen = new Set();
    const usedSlugs = new Set();
    const stickers = [];

    for (const entry of sources) {
      const hash = sha1File(entry.src);
      if (seen.has(hash)) {
        console.log(`${pack.id}: skip dup ${entry.file}`);
        continue;
      }
      seen.add(hash);

      const baseSlug = slugFromFilename(entry.file);
      const prefixed = multiDir ? `b${entry.batch}-${baseSlug}` : baseSlug;
      const slug = uniqueSlug(prefixed, usedSlugs);
      const filename = `${slug}.webp`;
      await convertOne(entry.src, path.join(hdDir, filename), path.join(thumbDir, filename));
      stickers.push({
        id: `${pack.id}-${slug}`,
        thumbnailUrl: `${CDN_BASE}/packs/${pack.id}/thumbnails/${filename}`,
        hdUrl: `${CDN_BASE}/packs/${pack.id}/hd/${filename}`,
      });
      console.log(`${pack.id}: ${entry.file} -> ${filename}`);
    }

    const cover =
      (pack.coverSlug && stickers.find((s) => s.id === `${pack.id}-${pack.coverSlug}`)) ||
      stickers[0];
    builtById.set(pack.id, {
      id: pack.id,
      name: pack.name,
      author: pack.author,
      authorUrl: pack.authorUrl,
      license: pack.license,
      licenseUrl: pack.licenseUrl,
      sourceUrl: pack.sourceUrl,
      coverThumbnailUrl: cover?.thumbnailUrl ?? '',
      stickers,
    });
  }

  const catalog = {
    version: 1,
    packs: PACKS.map((pack) => {
      if (builtById.has(pack.id)) return builtById.get(pack.id);
      const existing = existingById.get(pack.id);
      if (existing) return existing;
      throw new Error(`Missing pack data for ${pack.id} (no sources and not in list.json)`);
    }),
  };

  fs.writeFileSync(path.join(OUT, 'list.json'), JSON.stringify(catalog, null, 2) + '\n');

  const attributionRows = PACKS.map(
    (p) =>
      `| ${p.name} | [${p.author}](${p.authorUrl}) | [Figma Community](${p.sourceUrl}) | [CC BY 4.0](${p.licenseUrl}) |`,
  ).join('\n');

  const readme = `# choeae-stickers

On-demand sticker packs for Choeae (served via [jsDelivr](https://www.jsdelivr.com/github)).

## Catalog

\`\`\`
https://cdn.jsdelivr.net/gh/lgnbs-dev/choeae-stickers@main/list.json
\`\`\`

## Purge CDN cache

After pushing to \`main\`, purge jsDelivr so clients pick up the new \`list.json\` immediately:

\`\`\`bash
curl https://purge.jsdelivr.net/gh/lgnbs-dev/choeae-stickers@main/list.json
\`\`\`

Or use the [purge tool](https://www.jsdelivr.com/tools/purge).

## Attribution

These packs are **CC BY 4.0**. Credit the original authors when redistributing.

| Pack | Author | Source | License |
|------|--------|--------|---------|
${attributionRows}

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
