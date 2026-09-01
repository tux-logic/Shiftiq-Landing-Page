# Shiftiq — Landing Page

Landing page para **Shiftiq**, plataforma de gestión inteligente para talleres automotrices.

## Estructura

- **Web ejecutiva** → Dueños (OWNER)
- **Web principal** → Administradores (ADMIN)
- **App móvil** → Mecánicos (EMPLOYEE)

## Cómo ejecutar

Abre `index.html` con un servidor local (necesario para i18n y animaciones Lottie):

```bash
# Con Python
cd landing-page
python -m http.server 8080

# O con Node
npx serve .
```

Luego visita `http://localhost:8080`

## Animaciones

9 animaciones Lottie descargadas en `assets/animations/` desde LottieFiles:

| Archivo | Uso |
|---------|-----|
| `car-service.json` | Hero principal |
| `work-order.json` | Órdenes de trabajo |
| `inventory.json` | Inventario |
| `obd-diagnostics.json` | Telemetría OBD2 |
| `analytics.json` | Dashboard ejecutivo |
| `garage.json` | Sección desafío |
| `repair.json` | Admin / web principal |
| `mobile-app.json` | App móvil mecánicos |
| `mechanic.json` | Nosotros |

## Stack

- HTML5 + CSS3 + JavaScript vanilla
- i18n ES/EN con `localStorage`
- `lottie-player` (única dependencia externa, para animaciones)
- Intersection Observer para scroll reveal
- Carrusel y acordeón en vanilla JS

## Licencia animaciones

Animaciones de [LottieFiles](https://lottiefiles.com) bajo Lottie Simple License (uso gratuito).
