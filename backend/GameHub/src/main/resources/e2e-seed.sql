-- Datos semilla del perfil e2e. Cada prueba usa su propio videojuego para que las pruebas en paralelo no compitan por el stock.
INSERT INTO video_juego (titulo, genero, plataforma, stock, p_venta, p_alquiler, activo) VALUES ('E2E Venta', 'Aventura', 'PS5', 100, 200000, 50000, 1);
INSERT INTO video_juego (titulo, genero, plataforma, stock, p_venta, p_alquiler, activo) VALUES ('E2E Validaciones', 'Deportes', 'PS4', 10, 180000, 45000, 1);
INSERT INTO video_juego (titulo, genero, plataforma, stock, p_venta, p_alquiler, activo) VALUES ('E2E Alquiler', 'Accion', 'XBOX', 10, 150000, 40000, 1);
INSERT INTO video_juego (titulo, genero, plataforma, stock, p_venta, p_alquiler, activo) VALUES ('E2E Agotado', 'Estrategia', 'PS5', 0, 120000, 35000, 1);
