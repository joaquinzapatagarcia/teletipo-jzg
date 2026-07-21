# TELETIPO JZG

Biblioteca editorial de las columnas públicas de Joaquín Zapata en *La Razón*. El archivo alimenta el teletipo, el buscador y la selección aleatoria del frontal publicado en Carrd.

## Contrato estable con Carrd

Carrd consume directamente este archivo y su ruta no debe cambiar:

```text
https://raw.githubusercontent.com/joaquinzapatagarcia/teletipo-jzg/main/columnas-jzg.json
```

La estructura puede ampliarse de forma compatible, pero no deben renombrarse ni eliminarse los campos actuales sin revisar antes el HTML de Carrd.

## Estado de la biblioteca

- Versión de datos: `0.3.0`
- Columnas: 147
- Categorías editoriales: 8
- Fuente: documento maestro actualizado el 21 de julio de 2026
- Validación: automática en cada cambio de `columnas-jzg.json`, el esquema o el validador

## Estructura

```text
teletipo-jzg/
├── columnas-jzg.json              # Fuente pública que consume Carrd
├── schema/columnas.schema.json    # Contrato formal de los datos
├── scripts/validar-datos.mjs      # Comprobaciones editoriales y técnicas
├── docs/MODELO-EDITORIAL.md       # Significado de campos y taxonomía
├── docs/ACTUALIZACION.md          # Procedimiento seguro de actualización
├── CHANGELOG.md                   # Historia comprensible de versiones
└── RIGHTS.md                      # Autoría y condiciones de reutilización
```

## Validación local

Solo requiere Node.js 20 o posterior; no hay dependencias ni costes externos.

```bash
node scripts/validar-datos.mjs
```

El proceso comprueba, entre otras cosas, que el JSON sea válido, que el total coincida, que no haya identificadores, títulos ni huellas duplicadas, que el orden sea correlativo y que todas las fichas estén completas.

## Actualizar la biblioteca

1. Conservar el documento maestro antes de editar los datos.
2. Añadir la nueva ficha al final de `entradas`.
3. Incrementar `total_columnas` y la versión.
4. Ejecutar el validador.
5. Revisar el cambio antes de incorporarlo a `main`.
6. Si Carrd mantiene una copia antigua en caché, actualizar únicamente el parámetro de versión de su llamada; la ruta del JSON permanece igual.

El procedimiento completo está en [docs/ACTUALIZACION.md](docs/ACTUALIZACION.md).

## Recuperación

Cada actualización debe entrar mediante un cambio identificable en GitHub. Para regresar a una versión anterior, se restaura `columnas-jzg.json` desde el último commit estable y se vuelve a ejecutar el validador. La rama `stable-v0.2` conserva el estado previo a la reorganización de julio de 2026.

## Derechos

La publicación del repositorio no convierte las columnas en contenido de libre reutilización. Consulta [RIGHTS.md](RIGHTS.md).
