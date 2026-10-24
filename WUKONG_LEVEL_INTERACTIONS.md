# Interacciones originales del primer nivel

Este registro fija las mecánicas observadas antes de los cambios de entorno del nivel 1.

- **Gekko y misión:** Gekko está en `(-2.8, terrainY, -10)` y su zona de disparo va de `(-6,-2,-16)` a `(4,6,-6)`. Al acercarse a menos de 5.5 m comienza la primera cinemática si la misión no ha comenzado. La misión exige reunir 50 Lisar Coins. Con menos de 50 se mantiene el aviso de progreso; al completar la cantidad, la segunda cinemática entrega `key1_gekko`.
- **Combate y monedas:** se mantienen las monedas, la lógica de enemigos, patrullas, ataques, daño y recompensas existentes. Los enemigos no se reubican en estos cambios.
- **Cangrejo jefe:** el `crab_boss` comienza en `(45, 0.2, -40)`. La zona de entrada a su arena es `x=26..34`, `z=-47..-33`. Su derrota conserva la cinemática y recompensa `key2_boss`.
- **Alcance de esta actualización:** solo se añadieron recursos visuales del pabellón, césped y suelo, junto con el bucle de fondo de menú HD. La geometría, la forma, las rutas, los checkpoints y colisiones del terreno base no se editaron. El pabellón añade un collider propio; el césped es instanciado y decorativo. `Game.init` espera la carga del entorno antes de completar el inicio del nivel.
