// ============================================================
// DATOS DEL SITIO — Acá editás toda la información del portal
// ============================================================

export type DaySchedule = {
  open: string;    // ej: "08:00"
  close: string;   // ej: "20:00"
  closed: boolean; // true = no abre ese día
};

export type Business = {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  whatsapp?: string;
  description: string;
  tags: string[]; // palabras clave para buscar: "hielo", "garrafas", "delivery"
  featured: boolean;
  schedule: {
    lunes: DaySchedule;
    martes: DaySchedule;
    miercoles: DaySchedule;
    jueves: DaySchedule;
    viernes: DaySchedule;
    sabado: DaySchedule;
    domingo: DaySchedule;
  };
  instagram?: string;
  facebook?: string;
  mapUrl?: string;
};

export type Promotion = {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  description: string;
  endsAt: string; // fecha "2025-12-31"
};

export type UsefulInfo = {
  id: string;
  type: "hospital" | "policia" | "bomberos" | "veterinaria" | "farmacia_turno" | "otro";
  title: string;
  phone: string;
  address?: string;
  notes?: string;
};

// ============================================================
// CATEGORÍAS
// ============================================================
export const CATEGORIES = [
  { id: "almacen",      label: "Almacenes",          icon: "🏪" },
  { id: "supermercado", label: "Supermercados",       icon: "🛒" },
  { id: "kiosco",       label: "Kioscos",             icon: "🗞️" },
  { id: "restaurante",  label: "Restaurantes",        icon: "🍽️" },
  { id: "cafeteria",    label: "Cafeterías",          icon: "☕" },
  { id: "heladeria",    label: "Heladerías",          icon: "🍦" },
  { id: "farmacia",     label: "Farmacias",           icon: "💊" },
  { id: "ferreteria",   label: "Ferreterías",         icon: "🔧" },
  { id: "veterinaria",  label: "Veterinarias",        icon: "🐾" },
  { id: "combustible",  label: "Est. de Servicio",    icon: "⛽" },
  { id: "profesional",  label: "Profesionales",       icon: "👔" },
  { id: "tecnico",      label: "Serv. Técnicos",      icon: "🛠️" },
  { id: "construccion", label: "Construcción",        icon: "🏗️" },
  { id: "salud",        label: "Salud",               icon: "🏥" },
  { id: "educacion",    label: "Educación",           icon: "📚" },
  { id: "deportes",     label: "Deportes",            icon: "⚽" },
  { id: "otros",        label: "Otros",               icon: "📦" },
];

// ============================================================
// NEGOCIOS — Agregá o editá negocios acá
// ============================================================
export const BUSINESSES: Business[] = [
  {
    id: "farmacia-central",
    name: "Farmacia Central",
    category: "farmacia",
    address: "Av. 25 de Mayo 450, San Miguel del Monte",
    phone: "02271-123456",
    whatsapp: "5492271123456",
    description:
      "Farmacia con amplio stock de medicamentos, perfumería y artículos de salud. Atención personalizada.",
    tags: ["medicamentos", "remedios", "perfumeria", "pañales", "vitaminas"],
    featured: true,
    mapUrl: "https://maps.google.com/?q=Farmacia+Central+San+Miguel+del+Monte",
    schedule: {
      lunes:     { open: "08:00", close: "21:00", closed: false },
      martes:    { open: "08:00", close: "21:00", closed: false },
      miercoles: { open: "08:00", close: "21:00", closed: false },
      jueves:    { open: "08:00", close: "21:00", closed: false },
      viernes:   { open: "08:00", close: "21:00", closed: false },
      sabado:    { open: "09:00", close: "13:00", closed: false },
      domingo:   { open: "09:00", close: "13:00", closed: false },
    },
  },
  {
    id: "almacen-el-cruce",
    name: "Almacén El Cruce",
    category: "almacen",
    address: "Ruta 41 km 2, San Miguel del Monte",
    phone: "02271-234567",
    whatsapp: "5492271234567",
    description:
      "Almacén de barrio con todo lo necesario. Fiambrería, verdulería y productos de limpieza.",
    tags: ["hielo", "carbon", "garrafas", "pan", "fiambreria", "verduleria", "limpieza", "cigarrillos"],
    featured: true,
    mapUrl: "https://maps.google.com/?q=Almacen+El+Cruce+San+Miguel+del+Monte",
    schedule: {
      lunes:     { open: "07:00", close: "22:00", closed: false },
      martes:    { open: "07:00", close: "22:00", closed: false },
      miercoles: { open: "07:00", close: "22:00", closed: false },
      jueves:    { open: "07:00", close: "22:00", closed: false },
      viernes:   { open: "07:00", close: "22:00", closed: false },
      sabado:    { open: "07:00", close: "22:00", closed: false },
      domingo:   { open: "08:00", close: "20:00", closed: false },
    },
  },
  {
    id: "veterinaria-sos",
    name: "Veterinaria SOS",
    category: "veterinaria",
    address: "Belgrano 123, San Miguel del Monte",
    phone: "02271-345678",
    whatsapp: "5492271345678",
    description:
      "Clínica veterinaria con guardia. Atención de urgencias las 24hs. Vacunación, cirugías y peluquería canina.",
    tags: ["guardia", "urgencias", "vacunas", "peluqueria canina", "cirugia", "perros", "gatos"],
    featured: true,
    mapUrl: "https://maps.google.com/?q=Veterinaria+SOS+San+Miguel+del+Monte",
    schedule: {
      lunes:     { open: "09:00", close: "20:00", closed: false },
      martes:    { open: "09:00", close: "20:00", closed: false },
      miercoles: { open: "09:00", close: "20:00", closed: false },
      jueves:    { open: "09:00", close: "20:00", closed: false },
      viernes:   { open: "09:00", close: "20:00", closed: false },
      sabado:    { open: "09:00", close: "13:00", closed: false },
      domingo:   { open: "00:00", close: "23:59", closed: false },
    },
  },
  {
    id: "ypf-monte",
    name: "YPF San Miguel del Monte",
    category: "combustible",
    address: "Acceso Ruta 41, San Miguel del Monte",
    phone: "02271-456789",
    description:
      "Estación de servicio YPF. Nafta, gasoil, GNC. Tienda de conveniencia. Aire y agua gratis.",
    tags: ["nafta", "gasoil", "gnc", "combustible", "aire", "agua"],
    featured: false,
    mapUrl: "https://maps.google.com/?q=YPF+San+Miguel+del+Monte",
    schedule: {
      lunes:     { open: "00:00", close: "23:59", closed: false },
      martes:    { open: "00:00", close: "23:59", closed: false },
      miercoles: { open: "00:00", close: "23:59", closed: false },
      jueves:    { open: "00:00", close: "23:59", closed: false },
      viernes:   { open: "00:00", close: "23:59", closed: false },
      sabado:    { open: "00:00", close: "23:59", closed: false },
      domingo:   { open: "00:00", close: "23:59", closed: false },
    },
  },
  {
    id: "pizzeria-los-pinos",
    name: "Pizzería Los Pinos",
    category: "restaurante",
    address: "San Martín 789, San Miguel del Monte",
    phone: "02271-567890",
    whatsapp: "5492271567890",
    description:
      "Pizzería artesanal con delivery. Empanadas, facturas y tartas caseras. La mejor pizza del Monte.",
    tags: ["pizza", "empanadas", "delivery", "facturas", "tartas", "comida"],
    featured: true,
    schedule: {
      lunes:     { open: "19:00", close: "23:30", closed: false },
      martes:    { open: "19:00", close: "23:30", closed: false },
      miercoles: { open: "19:00", close: "23:30", closed: false },
      jueves:    { open: "19:00", close: "23:30", closed: false },
      viernes:   { open: "19:00", close: "00:30", closed: false },
      sabado:    { open: "19:00", close: "00:30", closed: false },
      domingo:   { open: "19:00", close: "23:30", closed: false },
    },
  },
];

// ============================================================
// PROMOCIONES ACTIVAS
// ============================================================
export const PROMOTIONS: Promotion[] = [
  {
    id: "promo-1",
    businessId: "pizzeria-los-pinos",
    businessName: "Pizzería Los Pinos",
    title: "2 pizzas grandes por $8.000",
    description: "Todos los martes y miércoles. Solo con retiro en el local.",
    endsAt: "2025-12-31",
  },
  {
    id: "promo-2",
    businessId: "farmacia-central",
    businessName: "Farmacia Central",
    title: "10% off en perfumería",
    description: "Descuento en todos los productos de perfumería durante junio.",
    endsAt: "2025-06-30",
  },
];

// ============================================================
// INFORMACIÓN ÚTIL — Emergencias y servicios esenciales
// ============================================================
export const USEFUL_INFO: UsefulInfo[] = [
  {
    id: "hospital",
    type: "hospital",
    title: "Hospital Municipal",
    phone: "02271-420000",
    address: "Av. Rivadavia 500, San Miguel del Monte",
    notes: "Guardia las 24 horas",
  },
  {
    id: "policia",
    type: "policia",
    title: "Comisaría",
    phone: "911 / 02271-420100",
    address: "Mitre 200, San Miguel del Monte",
    notes: "Emergencias: 911",
  },
  {
    id: "bomberos",
    type: "bomberos",
    title: "Bomberos Voluntarios",
    phone: "100 / 02271-420200",
    address: "Belgrano 400, San Miguel del Monte",
    notes: "Emergencias: 100",
  },
  {
    id: "farmacia-turno",
    type: "farmacia_turno",
    title: "Farmacia de turno",
    phone: "02271-123456",
    notes: "Esta semana: Farmacia Central — Av. 25 de Mayo 450",
  },
];
