# 🚀 Integración Futura con WordPress (Headless CMS)

## 📋 Contexto

Este proyecto está diseñado para funcionar como un **Headless WordPress**, donde:

- **WordPress** actúa como el **backend** (panel de administración para editar contenido)
- **Astro** actúa como el **frontend** (sitio web optimizado y rápido)

## 🎯 ¿Por qué esta arquitectura?

### Ventajas

✅ **Mejor rendimiento**: Astro genera sitios estáticos ultra rápidos  
✅ **Seguridad mejorada**: WordPress no está expuesto públicamente  
✅ **Flexibilidad de diseño**: Control total sobre el frontend  
✅ **Facilidad de uso**: Los editores usan el familiar panel de WordPress  
✅ **SEO optimizado**: Astro genera HTML estático perfecto para buscadores

---

## 🔌 API: GraphQL vs REST API

### Recomendación: **WPGraphQL** 🏆

**WPGraphQL es la mejor opción** para este proyecto por las siguientes razones:

#### ✅ Ventajas de GraphQL (WPGraphQL)

1. **Consultas precisas**: Solo pides exactamente los datos que necesitas

   ```graphql
   query GetPosts {
     posts {
       nodes {
         title
         excerpt
         featuredImage {
           node {
             sourceUrl
           }
         }
       }
     }
   }
   ```

2. **Una sola petición**: Puedes obtener datos relacionados en una sola llamada

   - Ejemplo: Noticias + Categorías + Autor en un solo request

3. **Tipado fuerte**: TypeScript se integra perfectamente
4. **Mejor rendimiento**: Menos over-fetching (no traes datos innecesarios)
5. **Documentación automática**: GraphQL genera su propia documentación
6. **Comunidad activa**: WPGraphQL tiene excelente soporte

#### ⚠️ Desventajas de REST API

- **Over-fetching**: Traes muchos datos que no necesitas
- **Múltiples peticiones**: Necesitas varios endpoints para datos relacionados
- **Menos flexible**: Estructura de datos fija

### Cuándo usar REST API

- Si ya tienes experiencia con la API REST de WordPress
- Para proyectos muy simples con pocas consultas
- Si no quieres instalar plugins adicionales

---

## 📦 Plugins de WordPress Necesarios

### Esenciales

1. **WPGraphQL** - API GraphQL para WordPress

   - [Sitio oficial](https://www.wpgraphql.com/)
   - Instalación: Buscar "WPGraphQL" en el directorio de plugins

2. **Advanced Custom Fields (ACF)** - Para campos personalizados
   - [Sitio oficial](https://www.advancedcustomfields.com/)
3. **WPGraphQL for Advanced Custom Fields** - Expone ACF a GraphQL
   - Conecta ACF con WPGraphQL

### Opcionales pero Recomendados

4. **Yoast SEO** - Para metadatos SEO
5. **WPGraphQL for Yoast SEO** - Expone datos de Yoast a GraphQL

---

## 🗂️ Estructura de Contenido en WordPress

### Custom Post Types (CPTs) Necesarios

#### 1. **Miembros** (Instituciones)

```
Campos ACF:
- Nombre de la Institución (texto)
- Logo (imagen)
- Tipo (taxonomía: Pública/Privada)
- Sitio web (URL)
```

#### 2. **Equipo** (Consejo Directivo)

```
Campos ACF:
- Nombre completo (texto)
- Cargo (texto)
- Foto (imagen)
- Orden de aparición (número)
- Tipo de miembro (select: Presidente, Secretario, Consejero, Honorífico)
```

#### 3. **Vacantes** (Bolsa de Trabajo)

```
Campos ACF:
- Título del puesto (texto)
- Empresa (texto o relación con CPT Miembros)
- Ubicación (texto)
- Tipo de contrato (select: Tiempo completo, Prácticas, etc.)
- Enlace de aplicación (URL)
- Fecha de cierre (fecha)
```

#### 4. **Programas Estratégicos** (Vinculación)

```
Campos ACF:
- Título del programa (texto)
- Descripción (wysiwyg)
- Número de orden (número)
- Color de acento (color picker)
```

#### 5. **Noticias** (Posts nativos de WordPress)

```
Usar campos nativos:
- Título
- Contenido
- Extracto
- Imagen destacada
- Categorías
- Fecha de publicación
```

---

## 🔄 Flujo de Integración

### Fase 1: Preparar WordPress

1. Instalar WordPress en tu hosting
2. Instalar y activar plugins:
   - WPGraphQL
   - ACF
   - WPGraphQL for ACF
3. Crear Custom Post Types
4. Configurar campos ACF
5. Poblar con contenido de prueba

### Fase 2: Conectar Astro

1. Crear funciones de fetch en Astro:

```typescript
// src/lib/wordpress.ts
const WORDPRESS_API_URL = import.meta.env.WORDPRESS_GRAPHQL_URL;

export async function fetchMembers() {
  const query = `
    query GetMembers {
      members {
        nodes {
          title  
          memberFields {
            logo {
              sourceUrl
            }
            tipo
          }
        }
      }
    }
  `;

  const response = await fetch(WORDPRESS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  return data.members.nodes;
}
```

2. Actualizar componentes para usar datos de WordPress:

```astro
---
// src/components/MembersSection.astro
import { fetchMembers } from '../lib/wordpress';

const members = await fetchMembers();
---
```

### Fase 3: Configurar Build

1. Agregar variables de entorno:

```env
# .env
WORDPRESS_GRAPHQL_URL=https://tu-hosting.com/graphql
```

2. Configurar rebuild automático (opcional):
   - Webhooks de WordPress → Trigger build en Netlify/Vercel
   - Cada vez que publicas contenido, se reconstruye el sitio

---

## 📝 Mapeo de Componentes → WordPress

| Componente Astro           | Fuente en WordPress                        |
| -------------------------- | ------------------------------------------ |
| `Hero.astro`               | ACF Options Page                           |
| `About.astro`              | Página estática + CPT "Equipo"             |
| `MembersSection.astro`     | CPT "Miembros"                             |
| `NewsSection.astro`        | Posts nativos                              |
| `VacantesSection.astro`    | CPT "Vacantes"                             |
| `VinculacionSection.astro` | CPT "Programas"                            |
| `ContactSection.astro`     | ACF Options Page                           |
| `Footer.astro`             | Ya usa `consts.ts` (puede quedar estático) |

---

## 🛠️ Ejemplo Práctico: Migrar `MembersSection`

### Antes (Datos hardcodeados)

```astro
const members = [
  "UNAM", "IPN", "UNAQ"
];
```

### Después (Datos de WordPress)

```astro
---
import { fetchMembers } from '../lib/wordpress';
const members = await fetchMembers();
---

<div class="grid">
  {members.map(member => (
    <div>
      <img src={member.logo} alt={member.nombre} />
      <span>{member.nombre}</span>
    </div>
  ))}
</div>
```

---

## ⚡ Optimización de Rendimiento

### Static Site Generation (SSG) - Recomendado

- El sitio se construye una vez
- WordPress solo se consulta durante el build
- Resultado: Sitio estático ultra rápido

### Cuándo reconstruir

- Manualmente cuando publicas contenido nuevo
- Automáticamente con webhooks (cada vez que editas en WordPress)
- Programado (ej: cada hora, cada día)

---

## 🎓 Recursos de Aprendizaje

### Documentación Oficial

- [WPGraphQL Docs](https://www.wpgraphql.com/docs/introduction)
- [Astro + WordPress Guide](https://docs.astro.build/en/guides/cms/wordpress/)
- [ACF Documentation](https://www.advancedcustomfields.com/resources/)

### Tutoriales Recomendados

- [Building a Headless WordPress Site with Astro](https://kinsta.com/blog/headless-wordpress/)
- [WPGraphQL for Beginners](https://www.wpgraphql.com/docs/quick-start)

---

## ✅ Checklist de Implementación

### WordPress Setup

- [ ] Instalar WordPress en hosting
- [ ] Instalar WPGraphQL
- [ ] Instalar ACF
- [ ] Instalar WPGraphQL for ACF
- [ ] Crear Custom Post Types
- [ ] Configurar campos ACF
- [ ] Poblar contenido de prueba
- [ ] Configurar CORS (si es necesario)

### Astro Setup

- [ ] Crear `src/lib/wordpress.ts`
- [ ] Agregar variables de entorno
- [ ] Crear funciones de fetch para cada CPT
- [ ] Actualizar componentes para usar datos dinámicos
- [ ] Probar build local
- [ ] Configurar webhooks (opcional)

---

## 🚨 Notas Importantes

1. **Seguridad**: Asegúrate de que tu WordPress esté protegido (SSL, contraseñas fuertes, actualizaciones)
2. **Caché**: Considera usar un plugin de caché en WordPress para mejorar la velocidad de las consultas GraphQL
3. **Límites de API**: Verifica los límites de tu hosting para peticiones API
4. **Backup**: Siempre ten respaldos de tu base de datos de WordPress

---

## 📞 Soporte

Si tienes dudas durante la implementación:

1. Revisa la documentación de WPGraphQL
2. Usa el GraphiQL IDE (incluido en WPGraphQL) para probar consultas
3. Consulta la comunidad de Astro en Discord

---

**Última actualización**: Noviembre 2025  
**Estado del proyecto**: ✅ Frontend listo para integración  
**Próximo paso**: Configurar WordPress en hosting
