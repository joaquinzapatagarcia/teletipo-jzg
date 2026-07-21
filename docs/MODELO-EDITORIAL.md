# Modelo editorial

## Propósito

`columnas-jzg.json` convierte una colección de columnas en una biblioteca consultable sin sustituir los textos originales. Cada ficha contiene un fragmento breve, una idea central y metadatos para el teletipo, el buscador y la selección aleatoria.

## Campos de una entrada

| Campo | Función |
|---|---|
| `id` | Identificador estable; no debe reutilizarse ni cambiarse. |
| `titulo` | Título público de la columna. |
| `tema_principal` | Categoría editorial dominante. |
| `temas_secundarios` | Relaciones útiles con otras categorías. |
| `fragmento` | Extracto breve de apertura o especial fuerza expresiva. |
| `pensamiento_de_joaquin` | Idea representativa seleccionada del texto. |
| `por_que_importa` | Lectura específica de su relevancia actual. |
| `etiquetas` | Términos normalizados en mayúsculas para búsqueda. |
| `tono` | Registro predominante de la pieza. |
| `mini_titular` | Formulación breve distinta del título. |
| `preguntas_que_responde` | Tres puertas de entrada para búsqueda o conversación. |
| `uso_sugerido` | Superficies autorizadas dentro del proyecto. |
| `fuente` | Procedencia editorial. |
| `orden_original` | Posición correlativa en el documento maestro. |
| `huella` | Identificador técnico de control de duplicados. |

## Categorías oficiales

- Arte y creación
- Ciudad y sociedad
- Criterio vital
- Familia y memoria
- Futuro y tecnología
- Inteligencia artificial
- Mercado y valor
- Política y poder

Una columna debe tener una sola categoría principal y al menos una secundaria. Si parece necesitar una categoría nueva, primero se comprueba si el problema puede resolverse mediante etiquetas.

## Tonos oficiales

- cultural
- ensayístico
- estratégico
- íntimo
- irónico

## Principios de edición

- Conservar el título y el sentido del texto fuente.
- No presentar una paráfrasis automática como cita literal.
- Mantener `mini_titular` breve, autónomo y distinto del título.
- Redactar `por_que_importa` para la columna concreta, no para toda la categoría.
- Evitar categorías, etiquetas o tonos nuevos por una sola entrada.
- Corregir los datos de origen; las mayúsculas de la interfaz no deben utilizarse para ocultar errores ortográficos.
