# Arkanoid

Este juego está hecho con HTML, CSS y JavaScript, usando un solo `<canvas>` para dibujar toda la partida.

## Cómo está hecho

- `index.html` carga el canvas y las imágenes de los sprites.
- `styles.css` centra el canvas y le da el fondo del escenario.
- `script.js` contiene toda la lógica del juego:
	- crea los ladrillos con `createBricks()`;
	- dibuja pelota, paleta y ladrillos con `drawBall()`, `drawPaddle()` y `drawBricks()`;
	- mueve la pelota y la paleta con `ballMovement()` y `paddleMovement()`;
	- detecta choques con `collisionDetection()`;
	- usa `requestAnimationFrame()` para refrescar la pantalla en cada frame.

La partida arranca con `resetGame()` y el estado se reinicia cuando pierdes o cuando pausas y presionas Enter.

## Controles

- Flecha izquierda: mover la paleta a la izquierda.
- Flecha derecha: mover la paleta a la derecha.
- Esc: pausar o reanudar.
- Enter: reiniciar la partida cuando termina o está pausada.

## Cómo probarlo

1. Abre una terminal en la carpeta del proyecto.
2. Levanta un servidor local, por ejemplo:

```bash
python3 -m http.server 8000
```

3. Abre `http://localhost:8000` en el navegador.
4. Haz clic en la ventana del juego si hace falta para que capture el teclado.
5. Juega con las flechas, pausa con Esc y reinicia con Enter.
