# Calculador de Horas Trabajadas por Concepto

Este proyecto es una aplicación web para calcular las horas trabajadas por concepto basándose en un horario de entrada y salida. La aplicación utiliza un servicio REST para realizar los cálculos, y los resultados se visualizan de manera gráfica y tabular. Durante el desarrollo y pruebas locales, se identificó y manejó el problema de **CORS**.

## Problema de CORS

El servicio REST utilizado en este proyecto está sujeto a restricciones de **CORS (Cross-Origin Resource Sharing)**, lo que impide realizar solicitudes directas desde el navegador en ciertas condiciones.
Para superar este problema, se recomienda:

 **Configuración del servidor **:
   La solución definitiva sería ajustar las configuraciones del servidor REST para incluir el encabezado:
   ```http
   Access-Control-Allow-Origin: *
   ```
   o limitarlo al dominio específico que utiliza esta aplicación.
