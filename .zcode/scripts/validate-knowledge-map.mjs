// 校验 v0.1 知识图谱节点。
// 用法：在知识库根目录运行 node .zcode/scripts/validate-knowledge-map.mjs
// 只检查 50-Maps/KnowledgeMap/；没有节点时也应正常退出。

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, basename, extname, sep } from 'node:path';

const ROOT = process.cwd();
const NODE_DIR = join(ROOT, '50-Maps', 'KnowledgeMap');
const ONTOLOGY = join(ROOT, '50-Maps', 'KnowledgeMapRule', '本体登记.md');
const VOCAB = join(ROOT, '50-Maps', 'KnowledgeMapRule', '知识词表.md');

function parseScalar(value) {
  const v = value.trim();
  if (!v) return null;
  if (v === '[]') return [];
  if (v === '{}') return {};
  return v.replace(/^(["']).*\1$/, (s) => s.slice(1, -1));
}

// 只解析模板使用的 YAML 子集：标量、块列表和一层嵌套映射。
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const out = {};
  let current = null;
  let nestedKey = null;
  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const top = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (top) {
      current = top[1];
      nestedKey = null;
      out[current] = parseScalar(top[2]);
      continue;
    }

    // List items such as `  - "https://..."` must not be parsed as nested keys.
    const nested = line.match(/^\s{2}(?!-\s)([^\s:][^:]*):\s*(.*)$/);
    if (nested && current) {
      if (!out[current] || typeof out[current] !== 'object' || Array.isArray(out[current])) out[current] = {};
      nestedKey = nested[1].trim();
      out[current][nestedKey] = parseScalar(nested[2]);
      continue;
    }

    const item = line.match(/^\s+-\s+(.+)$/);
    if (item && current) {
      if (nestedKey) {
        if (!Array.isArray(out[current][nestedKey])) out[current][nestedKey] = [];
        out[current][nestedKey].push(parseScalar(item[1]));
      } else {
        if (!Array.isArray(out[current])) out[current] = [];
        out[current].push(parseScalar(item[1]));
      }
    }
  }
  return out;
}

function walkMarkdown(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walkMarkdown(path, out);
    else if (extname(entry.name).toLowerCase() === '.md') out.push(path);
  }
  return out;
}

function normalizeTarget(value) {
  const match = String(value).match(/^\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]$/);
  return match ? match[1].trim().replace(/\.md$/, '') : null;
}

const problems = [];
const warnings = [];
const pending = [];

if (!existsSync(ONTOLOGY)) {
  console.error('找不到本体登记：' + relative(ROOT, ONTOLOGY));
  process.exit(1);
}
if (!existsSync(VOCAB)) {
  console.error('找不到知识词表：' + relative(ROOT, VOCAB));
  process.exit(1);
}

const ontologyRaw = readFileSync(ONTOLOGY, 'utf8');
const vocabRaw = readFileSync(VOCAB, 'utf8');
const nodeTypes = new Set([...ontologyRaw.matchAll(/^\| `(concept|method|entity)` \|/gm)].map((m) => m[1]));
const relationNames = ['broader_than', 'instantiates', 'prerequisites', 'related'];
const relationTypes = new Set(relationNames);
const domainLine = vocabRaw.match(/知识节点的 `domain` 只使用一级值：([^。]+)。/);
const domains = new Set(domainLine ? [...domainLine[1].matchAll(/`([a-z-]+)`/g)].map((m) => m[1]) : []);

const relationSpec = {
  broader_than: { multi: true, from: ['concept', 'method'], to: ['concept', 'method'] },
  instantiates: { multi: true, from: ['entity', 'method'], to: ['concept'] },
  prerequisites: { multi: true, from: ['concept', 'method'], to: ['concept', 'method'] },
  related: { multi: true, from: [], to: [] },
};

const allFiles = walkMarkdown(ROOT);
const byPath = new Map();
const byBase = new Map();
const headings = new Map();
for (const file of allFiles) {
  const rel = relative(ROOT, file).split(sep).join('/').replace(/\.md$/, '');
  const base = basename(file, '.md');
  byPath.set(rel, file);
  if (!byBase.has(base)) byBase.set(base, []);
  byBase.get(base).push(rel);
  headings.set(rel, new Set([...readFileSync(file, 'utf8').matchAll(/^#{1,6}\s+(.+?)\s*$/gm)].map((m) => m[1])));
}

function resolveNote(target) {
  if (byPath.has(target)) return target;
  const candidates = byBase.get(basename(target));
  return candidates?.length === 1 ? candidates[0] : null;
}

const nodeFiles = existsSync(NODE_DIR)
  ? readdirSync(NODE_DIR).filter((name) => name.endsWith('.md')).map((name) => join(NODE_DIR, name))
  : [];
const nodes = [];
const ids = new Map();
const names = new Map();

for (const file of nodeFiles) {
  const relativeFile = relative(ROOT, file).split(sep).join('/');
  const fm = parseFrontmatter(readFileSync(file, 'utf8'));
  if (!fm) {
    problems.push(`${relativeFile} — 缺少有效 frontmatter`);
    continue;
  }
  nodes.push({ file: relativeFile, fm });

  if (!fm.id || !String(fm.id).startsWith('node:')) problems.push(`${relativeFile} — id 必须是 node:<规范名>`);
  else if (ids.has(fm.id)) problems.push(`${relativeFile} — id 重复：${fm.id}（另见 ${ids.get(fm.id)}）`);
  else ids.set(fm.id, relativeFile);

  if (!nodeTypes.has(fm.type)) problems.push(`${relativeFile} — type 未登记：${fm.type}`);
  if (!domains.has(fm.domain)) problems.push(`${relativeFile} — domain 未登记：${fm.domain}`);
  if (!['active', 'merged', 'deprecated'].includes(fm.status)) problems.push(`${relativeFile} — status 不合法：${fm.status}`);
  if (fm.status === 'merged' && !fm.merged_into) problems.push(`${relativeFile} — status 为 merged 时必须填写 merged_into`);

  if (!Array.isArray(fm.sources) || fm.sources.length === 0) {
    problems.push(`${relativeFile} — 缺 sources`);
  } else {
    for (const source of fm.sources) {
      if (/^https?:\/\//.test(String(source))) continue;
      const target = normalizeTarget(source);
      if (!target) {
        problems.push(`${relativeFile} — sources 格式不合法：${source}`);
        continue;
      }
      const resolved = resolveNote(target);
      if (!resolved) problems.push(`${relativeFile} — sources 指向的笔记不存在或不唯一：${target}`);
    }
  }

  const relations = fm.relations || {};
  for (const key of Object.keys(relations)) {
    if (!relationTypes.has(key)) {
      problems.push(`${relativeFile} — 关系类型未登记：${key}`);
      continue;
    }
    const spec = relationSpec[key];
    const targets = Array.isArray(relations[key]) ? relations[key] : (relations[key] ? [relations[key]] : []);
    if (!spec.multi && targets.length > 1) problems.push(`${relativeFile} — ${key} 目标必须唯一`);
    if (targets.length > 0 && spec.from.length && !spec.from.includes(fm.type)) problems.push(`${relativeFile} — ${key} 不允许从 ${fm.type} 出发`);
    for (const value of targets) {
      const target = normalizeTarget(value);
      if (!target) {
        problems.push(`${relativeFile} — ${key} 目标必须是内部链接：${value}`);
        continue;
      }
      const resolved = resolveNote(target);
      if (!resolved) pending.push(`${fm.id || relativeFile} --${key}--> ${target}`);
      else if (spec.to.length) {
        const targetFile = join(ROOT, resolved + '.md');
        const targetFm = parseFrontmatter(readFileSync(targetFile, 'utf8')) || {};
        if (!spec.to.includes(targetFm.type)) problems.push(`${relativeFile} — ${key} 的目标类型不允许 ${targetFm.type}`);
      }
    }
  }

  for (const name of [basename(file, '.md'), ...(Array.isArray(fm.aliases) ? fm.aliases : [])]) {
    if (!names.has(name)) names.set(name, []);
    names.get(name).push(relativeFile);
  }

}

// 关系只允许在一侧登记（related 尤其如此），因此判断孤立节点时还要计入其他节点指向本节点的边。
const inbound = new Set();
for (const { fm } of nodes) {
  const relations = fm.relations || {};
  for (const value of Object.values(relations)) {
    for (const item of Array.isArray(value) ? value : value ? [value] : []) {
      const target = normalizeTarget(item);
      const resolved = target ? resolveNote(target) : null;
      if (resolved) inbound.add(resolved);
    }
  }
}
for (const { file, fm } of nodes) {
  const relations = fm.relations || {};
  const relationCount = Object.values(relations).reduce((sum, value) => sum + (Array.isArray(value) ? value.length : value ? 1 : 0), 0);
  if (relationCount === 0 && !inbound.has(file.replace(/\.md$/, ''))) {
    warnings.push(`${file} — 既没有声明关系，也没有其他节点指向它；若不是根节点，请补充关系`);
  }
}

for (const [name, files] of names) if (files.length > 1) problems.push(`显示名或别名冲突：「${name}」出现在 ${files.join('、')}`);

console.log(`节点 ${nodes.length} 个 · type ${nodeTypes.size} 个 · domain ${domains.size} 个 · 关系 ${relationTypes.size} 个`);
console.log(`\n约束违反 ${problems.length} 条`);
for (const problem of problems) console.log('  FAIL ' + problem);
console.log(`\n告警 ${warnings.length} 条`);
for (const warning of warnings) console.log('  WARN ' + warning);
console.log(`\n待建目标 ${pending.length} 项`);
for (const item of pending) console.log('  PENDING ' + item);

process.exitCode = problems.length ? 1 : 0;
