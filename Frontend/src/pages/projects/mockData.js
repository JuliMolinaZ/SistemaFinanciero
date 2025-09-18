// 📊 DATOS DE EJEMPLO PARA EL DASHBOARD DE PROYECTOS
// ==================================================

export const mockProjects = [
  {
    id: 1,
    name: 'Sistema de E-commerce',
    description: 'Desarrollo de plataforma completa de comercio electrónico con carrito de compras, pagos y gestión de inventario.',
    status: 'active',
    priority: 'high',
    progress: 75,
    deadline: '2024-03-15',
    team_size: 8,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-02-20T14:30:00Z',
    client_id: 1,
    budget: 150000
  },
  {
    id: 2,
    name: 'App Móvil de Delivery',
    description: 'Aplicación móvil para servicio de entrega de comida con geolocalización y seguimiento en tiempo real.',
    status: 'planning',
    priority: 'medium',
    progress: 25,
    deadline: '2024-04-30',
    team_size: 5,
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2024-02-18T16:45:00Z',
    client_id: 2,
    budget: 95000
  },
  {
    id: 3,
    name: 'Dashboard Analytics',
    description: 'Panel de control con métricas y reportes avanzados para análisis de negocio.',
    status: 'active',
    priority: 'high',
    progress: 60,
    deadline: '2024-03-01',
    team_size: 6,
    created_at: '2024-01-20T11:30:00Z',
    updated_at: '2024-02-19T10:15:00Z',
    client_id: 3,
    budget: 120000
  },
  {
    id: 4,
    name: 'Sistema de CRM',
    description: 'Plataforma de gestión de relaciones con clientes con automatización de marketing.',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    deadline: '2024-01-31',
    team_size: 7,
    created_at: '2023-12-01T08:00:00Z',
    updated_at: '2024-01-31T17:00:00Z',
    client_id: 4,
    budget: 180000
  },
  {
    id: 5,
    name: 'Portal de Empleados',
    description: 'Sistema interno para gestión de recursos humanos y comunicación corporativa.',
    status: 'on_hold',
    priority: 'low',
    progress: 40,
    deadline: '2024-05-15',
    team_size: 4,
    created_at: '2024-01-10T14:20:00Z',
    updated_at: '2024-02-10T09:30:00Z',
    client_id: 5,
    budget: 75000
  },
  {
    id: 6,
    name: 'API de Integración',
    description: 'Servicio de API REST para integración con sistemas externos y terceros.',
    status: 'active',
    priority: 'high',
    progress: 85,
    deadline: '2024-02-28',
    team_size: 3,
    created_at: '2024-01-05T12:00:00Z',
    updated_at: '2024-02-21T11:45:00Z',
    client_id: 6,
    budget: 65000
  }
];

export const mockTasks = [
  {
    id: 1,
    title: 'Implementar autenticación',
    description: 'Configurar sistema de login y registro de usuarios',
    status: 'in_progress',
    priority: 'high',
    project_id: 1,
    assignee_id: 1,
    due_date: '2024-02-25',
    created_at: '2024-02-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Diseñar UI del carrito',
    description: 'Crear interfaz de usuario para el carrito de compras',
    status: 'done',
    priority: 'medium',
    project_id: 1,
    assignee_id: 2,
    due_date: '2024-02-20',
    created_at: '2024-02-10T14:30:00Z'
  },
  {
    id: 3,
    title: 'Configurar base de datos',
    description: 'Diseñar y configurar esquema de base de datos',
    status: 'done',
    priority: 'high',
    project_id: 1,
    assignee_id: 3,
    due_date: '2024-02-18',
    created_at: '2024-02-08T09:15:00Z'
  },
  {
    id: 4,
    title: 'Implementar geolocalización',
    description: 'Integrar servicios de mapas y geolocalización',
    status: 'todo',
    priority: 'high',
    project_id: 2,
    assignee_id: 4,
    due_date: '2024-03-10',
    created_at: '2024-02-20T16:00:00Z'
  },
  {
    id: 5,
    title: 'Crear dashboard de métricas',
    description: 'Desarrollar panel con gráficos y KPIs principales',
    status: 'in_progress',
    priority: 'medium',
    project_id: 3,
    assignee_id: 5,
    due_date: '2024-02-28',
    created_at: '2024-02-18T11:30:00Z'
  },
  {
    id: 6,
    title: 'Configurar CI/CD',
    description: 'Establecer pipeline de integración continua',
    status: 'done',
    priority: 'low',
    project_id: 4,
    assignee_id: 6,
    due_date: '2024-01-15',
    created_at: '2024-01-05T13:45:00Z'
  },
  {
    id: 7,
    title: 'Optimizar rendimiento',
    description: 'Mejorar velocidad de carga y optimizar consultas',
    status: 'in_progress',
    priority: 'medium',
    project_id: 1,
    assignee_id: 7,
    due_date: '2024-03-05',
    created_at: '2024-02-22T08:20:00Z'
  },
  {
    id: 8,
    title: 'Documentar API',
    description: 'Crear documentación completa de endpoints',
    status: 'todo',
    priority: 'low',
    project_id: 6,
    assignee_id: 8,
    due_date: '2024-03-01',
    created_at: '2024-02-21T15:10:00Z'
  }
];

export const mockSprints = [
  {
    id: 1,
    name: 'Sprint 1 - Fundación',
    description: 'Configuración inicial y arquitectura base',
    status: 'completed',
    project_id: 1,
    start_date: '2024-01-15',
    end_date: '2024-01-29',
    velocity: 32,
    created_at: '2024-01-15T09:00:00Z'
  },
  {
    id: 2,
    name: 'Sprint 2 - Autenticación',
    description: 'Implementación del sistema de usuarios y permisos',
    status: 'active',
    project_id: 1,
    start_date: '2024-02-01',
    end_date: '2024-02-15',
    velocity: 28,
    created_at: '2024-02-01T09:00:00Z'
  },
  {
    id: 3,
    name: 'Sprint 3 - Carrito y Pagos',
    description: 'Desarrollo de funcionalidades de e-commerce',
    status: 'active',
    project_id: 1,
    start_date: '2024-02-16',
    end_date: '2024-03-01',
    velocity: 35,
    created_at: '2024-02-16T09:00:00Z'
  },
  {
    id: 4,
    name: 'Sprint 1 - Planificación',
    description: 'Análisis de requisitos y diseño de arquitectura',
    status: 'active',
    project_id: 2,
    start_date: '2024-02-01',
    end_date: '2024-02-15',
    velocity: 20,
    created_at: '2024-02-01T10:00:00Z'
  },
  {
    id: 5,
    name: 'Sprint 2 - Desarrollo Core',
    description: 'Implementación de funcionalidades principales',
    status: 'todo',
    project_id: 2,
    start_date: '2024-02-16',
    end_date: '2024-03-01',
    velocity: 25,
    created_at: '2024-02-16T10:00:00Z'
  },
  {
    id: 6,
    name: 'Sprint 1 - Dashboard',
    description: 'Desarrollo del panel de control principal',
    status: 'active',
    project_id: 3,
    start_date: '2024-02-05',
    end_date: '2024-02-19',
    velocity: 30,
    created_at: '2024-02-05T09:00:00Z'
  }
];

export const mockUsers = [
  {
    id: 1,
    name: 'Ana García',
    email: 'ana.garcia@empresa.com',
    role: 'Frontend Developer',
    avatar: null,
    status: 'active'
  },
  {
    id: 2,
    name: 'Carlos López',
    email: 'carlos.lopez@empresa.com',
    role: 'UI/UX Designer',
    avatar: null,
    status: 'active'
  },
  {
    id: 3,
    name: 'María Rodríguez',
    email: 'maria.rodriguez@empresa.com',
    role: 'Backend Developer',
    avatar: null,
    status: 'active'
  },
  {
    id: 4,
    name: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    role: 'Project Manager',
    avatar: null,
    status: 'active'
  },
  {
    id: 5,
    name: 'Laura Martínez',
    email: 'laura.martinez@empresa.com',
    role: 'DevOps Engineer',
    avatar: null,
    status: 'active'
  }
];

export const mockClients = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    email: 'contacto@techcorp.com',
    phone: '+1 555 0123',
    industry: 'Tecnología',
    status: 'active'
  },
  {
    id: 2,
    name: 'FoodDelivery Inc',
    email: 'info@fooddelivery.com',
    phone: '+1 555 0456',
    industry: 'Alimentación',
    status: 'active'
  },
  {
    id: 3,
    name: 'Analytics Pro',
    email: 'hello@analyticspro.com',
    phone: '+1 555 0789',
    industry: 'Consultoría',
    status: 'active'
  },
  {
    id: 4,
    name: 'CRM Experts',
    email: 'support@crmeexperts.com',
    phone: '+1 555 0321',
    industry: 'Software',
    status: 'active'
  },
  {
    id: 5,
    name: 'HR Solutions',
    email: 'contact@hrsolutions.com',
    phone: '+1 555 0654',
    industry: 'Recursos Humanos',
    status: 'active'
  },
  {
    id: 6,
    name: 'Integration Hub',
    email: 'info@integrationhub.com',
    phone: '+1 555 0987',
    industry: 'Integración',
    status: 'active'
  }
];

// 📊 Métricas calculadas para el dashboard
export const calculateMetrics = (projects, tasks, sprints) => {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const activeSprints = sprints.filter(s => s.status === 'active').length;

  const projectCompletionRate = totalProjects > 0
    ? Math.round((completedProjects / totalProjects) * 100)
    : 0;

  const taskCompletionRate = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    totalTasks,
    completedTasks,
    activeSprints,
    projectCompletionRate,
    taskCompletionRate
  };
};
