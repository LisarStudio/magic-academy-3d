# Menú de Wukong y recursos

## Cinemáticas utilizadas

Los tres originales son MP4/H.264 sin pista de audio. Las cinemáticas se muestran como vídeo a pantalla completa; la interfaz permanece compuesta por elementos HTML independientes.

| Original | Datos comprobados | Versión publicada |
| --- | --- | --- |
| `La_leyenda_de_Wukong_Intro.mp4` | 1920×1080, 30 FPS, 290 cuadros, 9,667 s | `public/assets/cinematics/wukong-intro.mp4`, H.264, 16,3 MB |
| `MenuIdle_3x_preview.mp4` | 288×162, 30 FPS, 451 cuadros, 15,033 s | `public/assets/cinematics/wukong-menu-idle.mp4`, primer ciclo limpio de 150 cuadros/5 s, escalado a 864×486 |
| `StartGame_CamaraSuave_FINAL_Fundido_0441-0568.mp4` | 960×540, 30 FPS, 128 cuadros, 4,267 s | `public/assets/cinematics/wukong-start.mp4`, H.264, 1,44 MB |

El README de la escena `MenuIdle` documenta el ciclo de 150 intervalos y la unión Intro 290 → Idle 291. La entrega recorta una repetición para evitar repetir dos pausas adicionales. El vídeo final de inicio contiene un fundido oscuro y se coordina con la entrada a gameplay.

La previsualización idle proporcionada es 288×162. Se amplió para la web, pero el escalado no recupera detalle. Un render de un cuadro a 960×540 desde el `.blend` superó un minuto en esta máquina; para mantener una carga razonable, el fondo conserva la previsualización ampliada. El texto y los controles del menú sí se renderizan nítidos por separado.

## Wukong jugable

`D:\Wukong\wukong_2.0.glb` contiene 18 mallas y sus materiales, pero Blender confirmó que no incluye armature, pesos ni clips. Las FBX de `D:\Wukong\animations` incluyen el mismo diseño con el rig Mixamo de 41 huesos. Los nombres de las 18 mallas y sus dimensiones coinciden con el GLB nuevo. `scratch/prepare_wukong_rig.py` transfiere los pesos de las mallas FBX a las mallas GLB y conserva la geometría y materiales nuevos en `public/assets/characters/wukong_2.0_rigged.glb`. El exportador glTF limita cada vértice a cuatro influencias y normaliza sus pesos.

Mapa de acciones en `AssetManager`:

| Acción del juego | Recurso y adaptación |
| --- | --- |
| Reposo | `wukong/iddle.fbx`; clip retargeteado a los 41 huesos. |
| Correr | `wukong/Running.fbx`; se usa también con báculo porque no hay una variante armada en el conjunto nuevo. |
| Salto | `wukong/Jumping.fbx`. |
| Doble salto | `wukong_no_wood_double_jumpFront Flip.fbx` ya presente en el proyecto; se conserva porque el conjunto local no trae un clip de doble salto separado. |
| Caída | `wukong/wukong_falling_air.fbx`; ahora se reproduce al descender. |
| Aterrizaje fuerte | `wukong/Falling To Landing.fbx`. |
| Patada | `wukong/wukong_kick.fbx`; el contacto cae cerca de su extensión de pierna (aprox. cuadro 20/49). |
| Ataque con báculo | `wukong/wukong_atack_baculo.fbx`; el evento de golpe se mueve al 42% del clip tras revisar la curva de los brazos. Tiene fallback al clip anterior del proyecto si el recurso nuevo no está disponible. |
| Recoger objeto | `Taking_item_nowood.fbx`, ya incluido en el proyecto; el conjunto local no tiene una animación de recogida. |
| Levantarse y cámara de inicio | Vídeo `wukong-start.mp4`; no se aplica retargeting de esqueleto a un MP4. |

Los clips FBX usan nombres Mixamo normalizados por el retargeter existente. Las pistas de traslación y escala de huesos se eliminan para que el controlador físico mantenga la posición y no duplique root motion.

## Interfaz

No había un archivo de logo aislado. El título se recreó como SVG dentro de la página: letras amarillas con contorno rojizo, nubes y báculo. La disposición y los colores siguen la referencia, aunque la tipografía y las formas son una aproximación dibujada en código, no el arte original exacto.

Los ajustes reales disponibles son volumen de música, volumen de efectos y escala de resolución del renderer; se guardan en `localStorage`. Continuar se activa solo con una posición válida guardada. Los guardados nuevos usan versión 1 y los guardados anteriores sin versión siguen siendo legibles. No se muestra “Salir” en el navegador.

## Recursos ambientales del nivel 1

public/assets/environment/chinese-pavilion.glb conserva el modelo/materiales del pabellÃ³n y pesa 8,8 MB (geometrÃ­a reducida desde 636.842 a 138.791 vÃ©rtices; texturas a 1K). wukong-grass-clumps.glb contiene tres variantes instanciables y pesa 4,3 MB. wukong-dirt-base.jpg pesa 825 KB. En el nivel se agregan alrededor del pabellÃ³n y fuera de la ruta de inicio; la forma, altura y colisiÃ³n del terreno se conservan. El pabellÃ³n aporta una colisiÃ³n visual propia. Los originales Blender y las imÃ¡genes empacadas no se modificaron.
