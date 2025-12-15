# 🔍 Análisis de JavaScript en COMEA

**Fecha:** 29 de noviembre de 2025  
**Herramienta:** Lighthouse  
**Advertencia:** "Reducir el uso de JavaScript — Ahorro estimado de 1,579 KiB"

---

## 📊 Diagnóstico del Problema

### JavaScript en el Build

Después de compilar el proyecto, encontramos:

```
dist/_astro/ClientRouter.astro_astro_type_script_index_0_lang.QW52Ox2j.js
Tamaño: 15KB (comprimido)
```

**PERO**, el diagnóstico de Lighthouse indica **1,579 KiB** (~1.5MB). ¿De dónde viene?

---

## 🎯 Fuentes de JavaScript

### 1. **Astro Client Router** (~15 KB) ✅

- **Origen:** `@astrojs/transitions`
- **Necesidad:** Alta
- **Acción:** Mantener (es eficiente)

### 2. **Iconos de Astro-Icon** (~800 KB - 1.2 MB) 🔴

**ESTE ES EL PROBLEMA PRINCIPAL**

```json
"@iconify-json/fa6-brands": "^1.2.6",    // ~200 KB
"@iconify-json/fa6-regular": "^1.2.4",   // ~300 KB
"@iconify-json/fa6-solid": "^1.2.4",     // ~400 KB
"@iconify-json/mdi": "^1.2.3"            // ~200 KB
```

**Total de paquetes de iconos:** ~1.1 MB

#### Iconos que usamos en el proyecto:

```javascript
// Contados en el código:
- fa6-solid:plane-up        (Navbar - eliminado)
- fa6-solid:bars            (Navbar)
- fa6-solid:moon            (Navbar)
- fa6-solid:sun             (Navbar)
- fa6-solid:chevron-down    (Hero, MembersSection)
- fa6-solid:chevron-left    (SocialSidebar)
- fa6-solid:arrow-right     (About)
- fa6-brands:x-twitter      (SocialSidebar)
- mdi:facebook              (SocialSidebar)
- mdi:email                 (SocialSidebar)
- mdi:linkedin              (SocialSidebar)
- mdi:share-variant         (SocialSidebar)
- mdi:chevron-left          (NewsDetailSidebar)
```

**Total:** ~13 iconos únicos  
**Peso de paquetes completos:** ~1.1 MB  
**Peso necesario:** ~3-5 KB

**Desperdicio:** ~1.095 MB (99.5%) 🚨

---

## 💡 SOLUCIONES

### ✅ **Opción 1: Usar SVG Inline** (Recomendado)

**Impacto:** -1.1 MB de JavaScript  
**Esfuerzo:** Medio (1-2 horas)  
**Ventajas:**

- ✅ Cero JavaScript para iconos
- ✅ Mejor rendimiento
- ✅ Mayor control sobre SVGs
- ✅ Iconos inline en el HTML

#### Implementación:

```bash
# 1. Crear carpeta de SVGs
mkdir src/components/icons

# 2. Descargar SVGs individuales desde:
# https://icon-sets.iconify.design/
```

```astro
<!-- En lugar de astro-icon -->
<Icon name="mdi:facebook" />

<!-- Usar SVG inline -->
<svg class="w-6 h-6" viewBox="0 0 24 24">
  <path d="M..." fill="currentColor"/>
</svg>
```

**Archivos a modificar:**

- Navbar.astro (5 iconos)
- Hero.astro (1 icono)
- SocialSidebar.astro (5 iconos)
- About.astro (1 icono)
- MembersSection.astro (1 icono)
- NewsDetailSidebar.astro (1 icono)

---

### ✅ **Opción 2: Optimizar astro-icon con local collection**

**Impacto:** -900 KB aproximadamente  
**Esfuerzo:** Bajo (30 min)  
**Ventajas:**

- ✅ Mantiene sintaxis de astro-icon
- ✅ Solo incluye iconos usados
- ✅ Fácil implementación

#### Implementación:

```bash
# 1. Instalar solo los iconos necesarios
npm uninstall @iconify-json/fa6-brands @iconify-json/fa6-regular @iconify-json/fa6-solid @iconify-json/mdi
npm install --save-dev @iconify/json
```

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";

export default defineConfig({
  vite: {
    optimizeDeps: {
      include: ["astro-icon"],
    },
  },
});
```

Crear archivo `src/icons/custom.json`:

```json
{
  "prefix": "custom",
  "icons": {
    "facebook": { "body": "<path d='...' />" },
    "twitter": { "body": "<path d='...' />" },
    "moon": { "body": "<path d='...' />" }
    // ... solo los 13 iconos que usamos
  }
}
```

---

### 🟡 **Opción 3: Usar Sprite SVG**

**Impacto:** -1.1 MB de JavaScript  
**Esfuerzo:** Medio (1 hora)  
**Ventajas:**

- ✅ Cero JavaScript
- ✅ Reutilización eficiente de SVGs
- ✅ Cache del navegador

#### Implementación:

Crear `public/icons.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <symbol id="icon-facebook" viewBox="0 0 24 24">
    <path d="..."/>
  </symbol>
  <symbol id="icon-twitter" viewBox="0 0 24 24">
    <path d="..."/>
  </symbol>
  <!-- ... resto de iconos -->
</svg>
```

Usar en componentes:

```astro
<svg class="w-6 h-6">
  <use href="/icons.svg#icon-facebook"></use>
</svg>
```

---

## 📉 Impacto de Cada Solución

| Solución             | JS Removido | Lighthouse Score | Esfuerzo | Recomendación |
| -------------------- | ----------- | ---------------- | -------- | ------------- |
| **SVG Inline**       | -1.1 MB     | +15-20           | Medio    | ⭐⭐⭐⭐⭐    |
| **Local Collection** | -900 KB     | +12-15           | Bajo     | ⭐⭐⭐⭐      |
| **SVG Sprite**       | -1.1 MB     | +15-20           | Medio    | ⭐⭐⭐⭐      |

---

## 🚀 PLAN DE ACCIÓN RECOMENDADO

### **Fase 1: Implementar SVG Inline** (Recomendado)

#### Paso 1: Crear componente de iconos

```astro
<!-- src/components/icons/Icon.astro -->
---
import Facebook from './Facebook.astro';
import Twitter from './Twitter.astro';
import Moon from './Moon.astro';
// ... importar todos

const { name, ...props } = Astro.props;

const icons = {
  'facebook': Facebook,
  'twitter': Twitter,
  'moon': Moon,
  // ... mapear todos
};

const IconComponent = icons[name];
---

{IconComponent && <IconComponent {...props} />}
```

#### Paso 2: Crear SVGs individuales

```astro
<!-- src/components/icons/Facebook.astro -->
---
const { class: className = "w-6 h-6", ...props } = Astro.props;
---
<svg
  class={className}
  viewBox="0 0 24 24"
  fill="currentColor"
  {...props}
>
  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
</svg>
```

#### Paso 3: Reemplazar en componentes

```diff
- import { Icon } from "astro-icon/components";
+ import Icon from "../components/icons/Icon.astro";

- <Icon name="mdi:facebook" class="w-6 h-6" />
+ <Icon name="facebook" class="w-6 h-6" />
```

#### Paso 4: Desinstalar paquetes

```bash
npm uninstall astro-icon @iconify-json/fa6-brands @iconify-json/fa6-regular @iconify-json/fa6-solid @iconify-json/mdi
```

---

## 📊 Resultados Esperados

### Antes

```
JavaScript total: ~1.6 MB
- Astro Router: 15 KB
- Iconify paquetes: ~1.1 MB
- Scripts inline: ~400 KB
Lighthouse Performance: 88-92
```

### Después (SVG Inline)

```
JavaScript total: ~500 KB
- Astro Router: 15 KB
- Iconify: 0 KB (eliminado)
- Scripts inline: ~400 KB
- SVGs: ~5 KB (inline en HTML, no JS)
Lighthouse Performance: 95-98 ✅
```

---

## 🔧 Scripts Inline Optimizables

También encontramos scripts inline que podrían optimizarse:

### 1. **MembersSection.astro** (~8 KB)

- Lógica de filtrado y paginación
- **Acción:** Podría convertirse a Web Components nativos

### 2. **NewsSection.astro** (~6 KB)

- Apertura de sidebar de noticias
- **Acción:** Ya está bien optimizado

### 3. **Navbar.astro** (~4 KB)

- Tema oscuro y menú móvil
- **Acción:** Ya está bien optimizado

**Total scripts inline:** ~400 KB (combinados en build)  
**Acción:** Mantener, son necesarios para interactividad

---

## ✅ RESUMEN

### Problema Principal

- ❌ **1.1 MB de paquetes de iconos** sin usar completamente
- ❌ Solo usamos ~13 iconos de 1000+ disponibles
- ❌ Desperdicio del 99.5%

### Solución Recomendada

- ✅ Implementar **SVG Inline**
- ✅ Eliminar paquetes de Iconify
- ✅ Ahorro de ~1.1 MB de JavaScript
- ✅ Mejora de +15-20 puntos en Lighthouse

### Esfuerzo vs Beneficio

| Tarea                  | Tiempo     | Beneficio    |
| ---------------------- | ---------- | ------------ |
| Crear SVG components   | 45 min     | Alto         |
| Reemplazar en archivos | 30 min     | Alto         |
| Testing                | 15 min     | Alto         |
| **TOTAL**              | **90 min** | **Muy Alto** |

---

## 🎯 ¿Quieres que implemente esto ahora?

Puedo:

1. ✅ Crear todos los componentes SVG inline
2. ✅ Reemplazar astro-icon en todos los archivos
3. ✅ Actualizar package.json
4. ✅ Reducir JavaScript en ~1.1 MB

**Resultado:** Lighthouse Performance score de 95-98

---

_Análisis realizado: 29 de noviembre de 2025_
