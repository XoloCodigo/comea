/**
 * INFORMACIÓN DEL SITIO
 * Datos generales utilizados en metadatos y textos globales.
 */
export const SITE_INFO = {
  title: "COMEA | Consejo Mexicano de Educación Aeroespacial",
  description:
    "Sitio Oficial del Consejo Mexicano de Educación Aeroespacial. Unificamos academia, industria y gobierno.",
  shortName: "COMEA",
  subtitle: "Educación Aeroespacial",
};

/**
 * ENLACES DE NAVEGACIÓN
 * Define los items del menú principal y del footer.
 * href: El ID de la sección o URL externa.
 */
export const NAV_LINKS = [
  { name: "Inicio", href: "#home" },
  { name: "Nosotros", href: "#nosotros" },
  { name: "Miembros", href: "#miembros" },
  { name: "Vinculación", href: "#vinculacion" },
  { name: "Noticias", href: "#noticias" },
  { name: "Talento", href: "#vacantes" },
  { name: "Concursos", href: "#convocatoria" },
];

/**
 * ESTADÍSTICAS
 * Datos numéricos mostrados en la barra de impacto (Home).
 */
export const STATS = [
  { value: "50+", label: "Miembros Académicos" },
  { value: "20", label: "Convenios Internacionales" },
  { value: "15", label: "Estados Representados" },
  { value: "100%", label: "Compromiso" },
];

/**
 * INFORMACIÓN DE CONTACTO
 * Datos mostrados en el footer y sección de contacto.
 */
export const CONTACT_INFO = {
  address: "", // Dirección eliminada
  email: "presidencia@comea.org.mx", 
  phone: "+52 427 100 8179",
};

/**
 * REDES SOCIALES
 * Enlaces a perfiles oficiales.
 * icon: Clase de FontAwesome para el ícono.
 */
export const SOCIALS = [
  { name: "Facebook", href: "#", icon: "mdi:facebook" },
  { name: "Twitter", href: "#", icon: "mdi:twitter" },
  { name: "LinkedIn", href: "#", icon: "mdi:linkedin" },
];
