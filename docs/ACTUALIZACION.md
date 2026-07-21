# Procedimiento de actualización

## Antes de empezar

1. Confirmar que el documento maestro es la versión más reciente.
2. Comparar sus títulos con la biblioteca para distinguir adiciones de correcciones.
3. Trabajar en una rama y conservar un punto estable recuperable.

## Incorporar una columna

1. Añadir la ficha al final de `entradas`.
2. Crear un `id` con el formato `col_NNN_slug-del-titulo`.
3. Mantener `orden_original` correlativo.
4. Seleccionar un fragmento y un pensamiento que existan realmente en la fuente.
5. Elegir una categoría principal, al menos una secundaria y etiquetas ya normalizadas.
6. Escribir un mini titular distinto y tres preguntas.
7. Añadir una huella única de doce caracteres hexadecimales.
8. Actualizar `total_columnas` y la versión de la biblioteca.

## Comprobar

Ejecutar:

```bash
node scripts/validar-datos.mjs
```

El cambio no debe incorporarse si falla la validación. Además del resultado técnico, conviene revisar manualmente título, extractos, clasificación y tildes.

## Publicar sin romper Carrd

- Mantener `columnas-jzg.json` en la raíz.
- No renombrar campos existentes.
- Incorporar el cambio a `main` solo después de validar.
- Abrir el teletipo y comprobar carga, selección aleatoria, buscador y caracteres españoles.
- Si el navegador conserva datos anteriores, modificar el parámetro de caché del HTML de Carrd, no la ruta del archivo.

## Volver atrás

Restaurar el archivo desde el commit estable inmediatamente anterior, ejecutar el validador y publicar la restauración como un nuevo commit. No se borra la historia: se deja constancia de la recuperación.
