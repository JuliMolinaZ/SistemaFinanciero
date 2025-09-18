const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Script para poblar la base de datos con datos iniciales del módulo de gestión de proyectos

async function seedProjectManagement() {
  try {
    console.log('🌱 Iniciando seed del módulo de gestión de proyectos...');

    // 1. Crear metodologías de proyecto
    console.log('📋 Creando metodologías de proyecto...');
    const methodologies = await Promise.all([
      prisma.projectMethodology.upsert({
        where: { name: 'Scrum' },
        update: {},
        create: {
          name: 'Scrum',
          description: 'Metodología ágil que se enfoca en entregas incrementales y iterativas',
          is_active: true
        }
      }),
      prisma.projectMethodology.upsert({
        where: { name: 'Kanban' },
        update: {},
        create: {
          name: 'Kanban',
          description: 'Metodología de flujo continuo que visualiza el trabajo en progreso',
          is_active: true
        }
      }),
      prisma.projectMethodology.upsert({
        where: { name: 'Waterfall' },
        update: {},
        create: {
          name: 'Waterfall',
          description: 'Metodología tradicional con fases secuenciales',
          is_active: true
        }
      }),
      prisma.projectMethodology.upsert({
        where: { name: 'Hybrid' },
        update: {},
        create: {
          name: 'Hybrid',
          description: 'Combinación de metodologías ágiles y tradicionales',
          is_active: true
        }
      })
    ]);

    console.log(`✅ ${methodologies.length} metodologías creadas`);

    // 2. Crear roles de proyecto
    console.log('👥 Creando roles de proyecto...');
    const roles = await Promise.all([
      prisma.projectRole.upsert({
        where: { name: 'Project Manager' },
        update: {},
        create: {
          name: 'Project Manager',
          description: 'Responsable de la planificación, ejecución y cierre del proyecto',
          level: 5,
          is_active: true
        }
      }),
      prisma.projectRole.upsert({
        where: { name: 'Scrum Master' },
        update: {},
        create: {
          name: 'Scrum Master',
          description: 'Facilitador del proceso Scrum y remoción de impedimentos',
          level: 4,
          is_active: true
        }
      }),
      prisma.projectRole.upsert({
        where: { name: 'Product Owner' },
        update: {},
        create: {
          name: 'Product Owner',
          description: 'Representante del cliente y responsable del backlog del producto',
          level: 4,
          is_active: true
        }
      }),
      prisma.projectRole.upsert({
        where: { name: 'Tech Lead' },
        update: {},
        create: {
          name: 'Tech Lead',
          description: 'Líder técnico del equipo de desarrollo',
          level: 4,
          is_active: true
        }
      }),
      prisma.projectRole.upsert({
        where: { name: 'Senior Developer' },
        update: {},
        create: {
          name: 'Senior Developer',
          description: 'Desarrollador senior con experiencia avanzada',
          level: 3,
          is_active: true
        }
      }),
      prisma.projectRole.upsert({
        where: { name: 'Mid Developer' },
        update: {},
        create: {
          name: 'Mid Developer',
          description: 'Desarrollador de nivel intermedio',
          level: 2,
          is_active: true
        }
      }),
      prisma.projectRole.upsert({
        where: { name: 'Junior Developer' },
        update: {},
        create: {
          name: 'Junior Developer',
          description: 'Desarrollador junior en aprendizaje',
          level: 1,
          is_active: true
        }
      }),
      prisma.projectRole.upsert({
        where: { name: 'QA Engineer' },
        update: {},
        create: {
          name: 'QA Engineer',
          description: 'Ingeniero de calidad y testing',
          level: 2,
          is_active: true
        }
      }),
      prisma.projectRole.upsert({
        where: { name: 'UI/UX Designer' },
        update: {},
        create: {
          name: 'UI/UX Designer',
          description: 'Diseñador de interfaz y experiencia de usuario',
          level: 2,
          is_active: true
        }
      }),
      prisma.projectRole.upsert({
        where: { name: 'DevOps Engineer' },
        update: {},
        create: {
          name: 'DevOps Engineer',
          description: 'Ingeniero de operaciones y despliegue',
          level: 3,
          is_active: true
        }
      })
    ]);

    console.log(`✅ ${roles.length} roles de proyecto creados`);

    // 3. Obtener usuarios existentes para asignar como project managers
    console.log('👤 Obteniendo usuarios existentes...');
    const users = await prisma.user.findMany({
      where: { is_active: true },
      take: 5
    });

    if (users.length === 0) {
      console.log('⚠️ No hay usuarios activos en el sistema. Creando usuario de ejemplo...');
      const exampleUser = await prisma.user.create({
        data: {
          email: 'pm@example.com',
          name: 'Project Manager Ejemplo',
          role: 'administrador',
          is_active: true,
          profile_complete: true
        }
      });
      users.push(exampleUser);
    }

    // 4. Obtener clientes existentes
    console.log('🏢 Obteniendo clientes existentes...');
    const clients = await prisma.client.findMany({
      where: { status: 'activo' },
      take: 3
    });

    if (clients.length === 0) {
      console.log('⚠️ No hay clientes activos. Creando cliente de ejemplo...');
      const exampleClient = await prisma.client.create({
        data: {
          run_cliente: '12345678-9',
          nombre: 'Cliente Ejemplo S.A.',
          email: 'contacto@cliente-ejemplo.com',
          status: 'activo'
        }
      });
      clients.push(exampleClient);
    }

    // 5. Crear proyectos de ejemplo
    console.log('🚀 Creando proyectos de ejemplo...');
    const projects = await Promise.all([
      prisma.project.upsert({
        where: { id: 1 },
        update: {},
        create: {
          nombre: 'Sistema de E-commerce Moderno',
          cliente_id: clients[0]?.id,
          descripcion: 'Desarrollo de una plataforma de e-commerce completa con funcionalidades avanzadas',
          monto_sin_iva: 50000.00,
          monto_con_iva: 58000.00,
          methodology_id: methodologies.find(m => m.name === 'Scrum')?.id,
          start_date: new Date('2024-01-15'),
          end_date: new Date('2024-06-15'),
          budget: 60000.00,
          priority: 'high',
          project_manager_id: users[0]?.id,
          status: 'active',
          progress: 35
        }
      }),
      prisma.project.upsert({
        where: { id: 2 },
        update: {},
        create: {
          nombre: 'App Móvil de Delivery',
          cliente_id: clients[1]?.id || clients[0]?.id,
          descripcion: 'Aplicación móvil para servicio de delivery con geolocalización',
          monto_sin_iva: 30000.00,
          monto_con_iva: 34800.00,
          methodology_id: methodologies.find(m => m.name === 'Kanban')?.id,
          start_date: new Date('2024-02-01'),
          end_date: new Date('2024-05-01'),
          budget: 35000.00,
          priority: 'medium',
          project_manager_id: users[1]?.id || users[0]?.id,
          status: 'planning',
          progress: 10
        }
      }),
      prisma.project.upsert({
        where: { id: 3 },
        update: {},
        create: {
          nombre: 'Migración a Cloud',
          cliente_id: clients[2]?.id || clients[0]?.id,
          descripcion: 'Migración completa de infraestructura a la nube',
          monto_sin_iva: 25000.00,
          monto_con_iva: 29000.00,
          methodology_id: methodologies.find(m => m.name === 'Waterfall')?.id,
          start_date: new Date('2024-03-01'),
          end_date: new Date('2024-08-01'),
          budget: 30000.00,
          priority: 'low',
          project_manager_id: users[2]?.id || users[0]?.id,
          status: 'planning',
          progress: 5
        }
      })
    ]);

    console.log(`✅ ${projects.length} proyectos creados`);

    // 6. Crear miembros de proyecto
    console.log('👥 Asignando miembros a proyectos...');
    const projectMembers = [];
    
    for (const project of projects) {
      // Asignar project manager
      if (project.project_manager_id) {
        const pmRole = roles.find(r => r.name === 'Project Manager');
        if (pmRole) {
          projectMembers.push({
            project_id: project.id,
            user_id: project.project_manager_id,
            role_id: pmRole.id,
            is_active: true
          });
        }
      }

      // Asignar otros miembros (hasta 3 por proyecto)
      const availableUsers = users.filter(u => u.id !== project.project_manager_id);
      const memberRoles = roles.filter(r => r.name !== 'Project Manager');
      
      for (let i = 0; i < Math.min(3, availableUsers.length); i++) {
        const user = availableUsers[i];
        const role = memberRoles[i % memberRoles.length];
        
        projectMembers.push({
          project_id: project.id,
          user_id: user.id,
          role_id: role.id,
          is_active: true
        });
      }
    }

    // Insertar miembros de proyecto
    for (const member of projectMembers) {
      await prisma.projectMember.upsert({
        where: {
          project_id_user_id: {
            project_id: member.project_id,
            user_id: member.user_id
          }
        },
        update: {},
        create: member
      });
    }

    console.log(`✅ ${projectMembers.length} miembros asignados a proyectos`);

    // 7. Crear sprints para el primer proyecto (Scrum)
    console.log('🏃 Creando sprints de ejemplo...');
    const scrumProject = projects.find(p => p.methodology_id === methodologies.find(m => m.name === 'Scrum')?.id);
    
    if (scrumProject) {
      const sprints = await Promise.all([
        prisma.sprint.create({
          data: {
            project_id: scrumProject.id,
            name: 'Sprint 1 - Configuración Inicial',
            description: 'Configuración del entorno de desarrollo y arquitectura base',
            start_date: new Date('2024-01-15'),
            end_date: new Date('2024-01-29'),
            status: 'completed',
            goal: 'Establecer la base del proyecto y configurar herramientas'
          }
        }),
        prisma.sprint.create({
          data: {
            project_id: scrumProject.id,
            name: 'Sprint 2 - Autenticación y Usuarios',
            description: 'Implementar sistema de autenticación y gestión de usuarios',
            start_date: new Date('2024-01-30'),
            end_date: new Date('2024-02-13'),
            status: 'completed',
            goal: 'Sistema de login y registro de usuarios funcional'
          }
        }),
        prisma.sprint.create({
          data: {
            project_id: scrumProject.id,
            name: 'Sprint 3 - Catálogo de Productos',
            description: 'Desarrollo del catálogo y búsqueda de productos',
            start_date: new Date('2024-02-14'),
            end_date: new Date('2024-02-28'),
            status: 'active',
            goal: 'Catálogo de productos con filtros y búsqueda'
          }
        }),
        prisma.sprint.create({
          data: {
            project_id: scrumProject.id,
            name: 'Sprint 4 - Carrito de Compras',
            description: 'Implementar carrito de compras y proceso de checkout',
            start_date: new Date('2024-03-01'),
            end_date: new Date('2024-03-15'),
            status: 'planning',
            goal: 'Carrito de compras y proceso de pago básico'
          }
        })
      ]);

      console.log(`✅ ${sprints.length} sprints creados para proyecto Scrum`);

      // 8. Crear tareas de ejemplo para el sprint activo
      console.log('📝 Creando tareas de ejemplo...');
      const activeSprint = sprints.find(s => s.status === 'active');
      const projectMembersList = await prisma.projectMember.findMany({
        where: { project_id: scrumProject.id, is_active: true },
        include: { user: true }
      });

      if (activeSprint && projectMembersList.length > 0) {
        const tasks = await Promise.all([
          prisma.task.create({
            data: {
              project_id: scrumProject.id,
              sprint_id: activeSprint.id,
              title: 'Diseñar esquema de base de datos para productos',
              description: 'Crear las tablas necesarias para el catálogo de productos con categorías, subcategorías y atributos',
              status: 'done',
              priority: 'high',
              story_points: 8,
              assignee_id: projectMembersList[0]?.user_id,
              reporter_id: scrumProject.project_manager_id,
              due_date: new Date('2024-02-20'),
              estimated_hours: 16.0,
              actual_hours: 14.5
            }
          }),
          prisma.task.create({
            data: {
              project_id: scrumProject.id,
              sprint_id: activeSprint.id,
              title: 'Implementar API de productos',
              description: 'Crear endpoints REST para CRUD de productos con validaciones',
              status: 'in_progress',
              priority: 'high',
              story_points: 13,
              assignee_id: projectMembersList[1]?.user_id,
              reporter_id: scrumProject.project_manager_id,
              due_date: new Date('2024-02-25'),
              estimated_hours: 24.0,
              actual_hours: 8.0
            }
          }),
          prisma.task.create({
            data: {
              project_id: scrumProject.id,
              sprint_id: activeSprint.id,
              title: 'Crear interfaz de catálogo',
              description: 'Desarrollar la UI del catálogo con grid de productos y filtros',
              status: 'todo',
              priority: 'medium',
              story_points: 8,
              assignee_id: projectMembersList[2]?.user_id,
              reporter_id: scrumProject.project_manager_id,
              due_date: new Date('2024-02-28'),
              estimated_hours: 20.0
            }
          }),
          prisma.task.create({
            data: {
              project_id: scrumProject.id,
              sprint_id: activeSprint.id,
              title: 'Implementar búsqueda de productos',
              description: 'Agregar funcionalidad de búsqueda con filtros avanzados',
              status: 'todo',
              priority: 'medium',
              story_points: 5,
              assignee_id: projectMembersList[0]?.user_id,
              reporter_id: scrumProject.project_manager_id,
              due_date: new Date('2024-02-28'),
              estimated_hours: 12.0
            }
          }),
          prisma.task.create({
            data: {
              project_id: scrumProject.id,
              sprint_id: activeSprint.id,
              title: 'Testing de funcionalidades',
              description: 'Crear tests unitarios y de integración para el catálogo',
              status: 'todo',
              priority: 'low',
              story_points: 3,
              assignee_id: projectMembersList[1]?.user_id,
              reporter_id: scrumProject.project_manager_id,
              due_date: new Date('2024-03-01'),
              estimated_hours: 8.0
            }
          })
        ]);

        console.log(`✅ ${tasks.length} tareas creadas para el sprint activo`);

        // 9. Crear algunos daily standups de ejemplo
        console.log('📅 Creando daily standups de ejemplo...');
        const standupDates = [
          new Date('2024-02-14'),
          new Date('2024-02-15'),
          new Date('2024-02-16'),
          new Date('2024-02-19'),
          new Date('2024-02-20')
        ];

        for (const date of standupDates) {
          for (const member of projectMembersList.slice(0, 3)) {
            await prisma.dailyStandup.create({
              data: {
                sprint_id: activeSprint.id,
                user_id: member.user_id,
                date: date,
                yesterday: `Trabajé en ${Math.random() > 0.5 ? 'desarrollo de API' : 'diseño de UI'}`,
                today: `Voy a continuar con ${Math.random() > 0.5 ? 'implementación' : 'testing'}`,
                blockers: Math.random() > 0.7 ? 'Esperando aprobación del cliente' : null
              }
            });
          }
        }

        console.log(`✅ Daily standups de ejemplo creados`);

        // 10. Crear algunos comentarios en tareas
        console.log('💬 Creando comentarios de ejemplo...');
        const taskWithComments = tasks[1]; // Tarea en progreso
        if (taskWithComments) {
          await prisma.taskComment.createMany({
            data: [
              {
                task_id: taskWithComments.id,
                user_id: projectMembersList[0]?.user_id,
                comment: 'He revisado los requerimientos y todo se ve bien. Procedo con la implementación.'
              },
              {
                task_id: taskWithComments.id,
                user_id: projectMembersList[1]?.user_id,
                comment: '¿Podrías agregar validación para el campo de precio? Debe ser mayor a 0.'
              },
              {
                task_id: taskWithComments.id,
                user_id: projectMembersList[0]?.user_id,
                comment: 'Perfecto, ya agregué esa validación. También incluí validación para descuentos.'
              }
            ]
          });
        }

        console.log(`✅ Comentarios de ejemplo creados`);

        // 11. Crear entradas de tiempo de ejemplo
        console.log('⏱️ Creando entradas de tiempo de ejemplo...');
        const taskWithTime = tasks[1];
        if (taskWithTime) {
          await prisma.timeEntry.createMany({
            data: [
              {
                task_id: taskWithTime.id,
                user_id: projectMembersList[1]?.user_id,
                description: 'Análisis de requerimientos y diseño de API',
                hours: 4.0,
                date: new Date('2024-02-14')
              },
              {
                task_id: taskWithTime.id,
                user_id: projectMembersList[1]?.user_id,
                description: 'Implementación de endpoints básicos',
                hours: 6.0,
                date: new Date('2024-02-15')
              },
              {
                task_id: taskWithTime.id,
                user_id: projectMembersList[1]?.user_id,
                description: 'Testing y corrección de bugs',
                hours: 2.0,
                date: new Date('2024-02-16')
              }
            ]
          });
        }

        console.log(`✅ Entradas de tiempo de ejemplo creadas`);

        // 12. Crear milestones del proyecto
        console.log('🎯 Creando milestones de ejemplo...');
        await prisma.milestone.createMany({
          data: [
            {
              project_id: scrumProject.id,
              name: 'Configuración Inicial Completada',
              description: 'Entorno de desarrollo y arquitectura base establecida',
              due_date: new Date('2024-01-29'),
              completed_at: new Date('2024-01-28'),
              status: 'completed'
            },
            {
              project_id: scrumProject.id,
              name: 'Sistema de Autenticación',
              description: 'Login, registro y gestión de usuarios implementado',
              due_date: new Date('2024-02-13'),
              completed_at: new Date('2024-02-12'),
              status: 'completed'
            },
            {
              project_id: scrumProject.id,
              name: 'Catálogo de Productos',
              description: 'Catálogo con búsqueda y filtros funcional',
              due_date: new Date('2024-02-28'),
              status: 'pending'
            },
            {
              project_id: scrumProject.id,
              name: 'Carrito de Compras',
              description: 'Carrito y proceso de checkout implementado',
              due_date: new Date('2024-03-15'),
              status: 'pending'
            },
            {
              project_id: scrumProject.id,
              name: 'Sistema de Pagos',
              description: 'Integración con pasarelas de pago',
              due_date: new Date('2024-04-15'),
              status: 'pending'
            }
          ]
        });

        console.log(`✅ Milestones de ejemplo creados`);
      }
    }

    console.log('🎉 ¡Seed del módulo de gestión de proyectos completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`- ${methodologies.length} metodologías creadas`);
    console.log(`- ${roles.length} roles de proyecto creados`);
    console.log(`- ${projects.length} proyectos creados`);
    console.log(`- ${projectMembers.length} miembros asignados`);
    console.log(`- Sprints, tareas, standups y más datos de ejemplo creados`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed si se llama directamente
if (require.main === module) {
  seedProjectManagement()
    .then(() => {
      console.log('✅ Seed completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en seed:', error);
      process.exit(1);
    });
}

module.exports = { seedProjectManagement };
