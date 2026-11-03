# Evidencia local — Reparación de Batalla contra el Jefe Cangrejo (V6)

Estado: Cambios locales implementados, verificados y compilados exitosamente para Wukong v0.0.34.

## Componentes y Mejoras Implementadas

### 1. Modelo 3D Exclusivo del Jefe (`public/assets/enemies/boss-crab.glb`)
- Se integró el modelo demoníaco exclusivo del General Cangrejo (`boss-crab.glb`), separándolo completamente del cangrejo común.
- **Escala e implantación**: Escalado uniforme por ancho a ~5.2 m (3 veces la escala de Wukong) con la base vertical perfectamente alineada (`y = 0`) para que las patas toquen físicamente el suelo de la arena.
- **Cinemática y animaciones**:
  - Detección precisa de las 5 patas (`Cube005`, `Cube006`, `Cube007`, `Cube008`, `Cube009`) permitiendo animación fluida de marcha.
  - Detección de las 3 pinzas principales (`Cube001`, `Cube003`, `Sphere`) para el telégrafo de ataque (elevación de pinzas a 0.85 rad) y recuperación vulnerable.
  - Postura de derrota natural: el jefe queda recostado sobre la arena (`y = 0.2`) sin giros invertidos irreales.

### 2. Arena de Combate con Material PBR Roca Oscura (`LevelToyStory.ts`)
- El suelo de la arena oriental circular ahora utiliza el set PBR de roca oscura (`dark_rock_diff_2k.jpg`, `dark_rock_nor_2k.webp`, `dark_rock_rough_2k.jpg`) con mapeo UV repetido a 6x6, otorgando un aspecto volcánico y solemne.
- Eliminada la variable obsoleta `sandMat` resolviendo el fallo de TypeScript TS6133.
- Gestión segura de tokens de encuentro (`bossHudToken`) para garantizar que la barra de vida solo se muestre durante el combate activo y se oculte en transiciones de menú, reinicio o derrota.

### 3. HUD Imperial de Jefe con Enmascaramiento Dinámico (`HUD.ts`, `style.css`, `index.html`)
- Integración del arte original imperial `hud-boss-imperial.png` en proporción nativa (2244 x 701).
- Técnica de enmascaramiento (`boss-health-mask`): en lugar de estirar o recortar toscamente la barra de rubíes/joyas, se desplaza una máscara negra imperceptible desde el borde derecho (`88.25%` al 100% de vida) hacia la izquierda (`32.15%` al 0% de vida), preservando intactos los ornamentos dorados y relieves.
- Adaptabilidad responsive móvil y escritorio con cálculo de ancho dinámico (`min(96vw, 580px)`).

---

## Validación Automatizada y Compilación

1. **Compilación de Producción**:
   - `npm run build` (`tsc && vite build`) completado con 0 errores.
   - Bundles generados correctamente en `dist/` con todos los assets incluidos.
2. **Suite Funcional y Unitaria (`scratch/test_boss_v6_unit.mjs`)**:
   - **18 aserciones superadas (0 fallos)**:
     - Carga de GLTF y cálculo de caja de colisión (5.2m x 5.0m).
     - Validación de alineación en suelo (`min.y = 0`).
     - Extracción exacta de 5 nodos de patas y 3 nodos de pinzas sin duplicados anidados.
     - Elevación y restauración angular de pinzas en telégrafo.
     - Matemática de enmascaramiento HUD al 100%, 55% y 0% de salud.
     - Integridad física de archivos y texturas en `public/` y `dist/`.

