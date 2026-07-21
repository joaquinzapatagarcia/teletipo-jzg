import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsonPath = path.join(root, 'columnas-jzg.json');
const errors = [];

let data;
try {
  data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (error) {
  console.error(`JSON inválido: ${error.message}`);
  process.exit(1);
}

const fields = [
  'id', 'titulo', 'tema_principal', 'temas_secundarios', 'fragmento',
  'pensamiento_de_joaquin', 'por_que_importa', 'etiquetas', 'tono',
  'mini_titular', 'preguntas_que_responde', 'uso_sugerido', 'fuente',
  'orden_original', 'huella',
];
const categories = new Set([
  'Arte y creación', 'Ciudad y sociedad', 'Criterio vital', 'Familia y memoria',
  'Futuro y tecnología', 'Inteligencia artificial', 'Mercado y valor',
  'Política y poder',
]);
const tones = new Set(['cultural', 'ensayístico', 'estratégico', 'íntimo', 'irónico']);

if (!Array.isArray(data.entradas)) errors.push('entradas debe ser un array');
if (data.total_columnas !== data.entradas?.length) {
  errors.push(`total_columnas (${data.total_columnas}) no coincide con entradas (${data.entradas?.length})`);
}
if (JSON.stringify(data.campos) !== JSON.stringify(fields)) {
  errors.push('campos no coincide con el contrato estable de 15 campos');
}

const seen = { id: new Set(), titulo: new Set(), huella: new Set(), mini_titular: new Set(), por_que_importa: new Set() };

for (const [index, entry] of (data.entradas || []).entries()) {
  const label = `entrada ${index + 1}`;
  const keys = Object.keys(entry);
  for (const field of fields) {
    if (!(field in entry)) errors.push(`${label}: falta ${field}`);
  }
  for (const key of keys) {
    if (!fields.includes(key)) errors.push(`${label}: campo desconocido ${key}`);
  }
  if (entry.orden_original !== index + 1) errors.push(`${label}: orden_original no es correlativo`);
  if (!categories.has(entry.tema_principal)) errors.push(`${label}: categoría no autorizada ${entry.tema_principal}`);
  if (!tones.has(entry.tono)) errors.push(`${label}: tono no autorizado ${entry.tono}`);
  if (!Array.isArray(entry.temas_secundarios) || entry.temas_secundarios.length < 1) errors.push(`${label}: faltan temas secundarios`);
  if (!Array.isArray(entry.preguntas_que_responde) || entry.preguntas_que_responde.length !== 3) errors.push(`${label}: debe contener tres preguntas`);
  if (!Array.isArray(entry.etiquetas) || entry.etiquetas.length < 1) errors.push(`${label}: faltan etiquetas`);
  if (entry.mini_titular === entry.titulo) errors.push(`${label}: mini_titular duplica el título`);
  if (!/^col_[0-9]{3}_[a-z0-9-]+$/.test(entry.id)) errors.push(`${label}: id no válido`);
  if (!/^[a-f0-9]{12}$/.test(entry.huella)) errors.push(`${label}: huella no válida`);
  for (const field of Object.keys(seen)) {
    if (seen[field].has(entry[field])) errors.push(`${label}: ${field} duplicado`);
    seen[field].add(entry[field]);
  }
  for (const field of fields) {
    const value = entry[field];
    if (typeof value === 'string' && !value.trim()) errors.push(`${label}: ${field} está vacío`);
  }
}

const serialized = JSON.stringify(data);
for (const legacy of ['Criterio contemporaneo', 'ensayistico', 'estrategico', 'intimo', 'ironico', 'Que piensa Joaquin']) {
  if (serialized.includes(legacy)) errors.push(`permanece una forma sin normalizar: ${legacy}`);
}

if (errors.length) {
  console.error(`Validación fallida (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validación correcta: ${data.total_columnas} columnas · versión ${data.version} · ${categories.size} categorías.`);
