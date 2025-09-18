// pdfReports.js - Utilidades para generar reportes PDF profesionales
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Genera un reporte PDF completo del proyecto con análisis avanzado
 */
export const generateAdvancedProjectReport = (project, tasks = [], team = [], budget = {}) => {
  const doc = new jsPDF();
  const currentDate = new Date().toLocaleDateString('es-ES');
  let yPos = 20;
  
  // Header principal con diseño profesional
  doc.setFillColor(13, 148, 136); // Teal elegante
  doc.rect(0, 0, 210, 45, 'F');
  
  // Título principal
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORTE EJECUTIVO', 105, 20, { align: 'center' });
  doc.text('DE PROYECTO', 105, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado el ${currentDate}`, 105, 38, { align: 'center' });
  
  yPos = 60;
  
  // Información del proyecto
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN GENERAL DEL PROYECTO', 20, yPos);
  
  yPos += 15;
  doc.setFillColor(245, 245, 245);
  doc.rect(15, yPos - 5, 180, 40, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Nombre: ${project.nombre || 'Sin nombre'}`, 20, yPos + 5);
  doc.text(`Estado: ${getProjectStatus(project)}`, 20, yPos + 15);
  doc.text(`Prioridad: ${(project.priority || 'medium').toUpperCase()}`, 20, yPos + 25);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha Inicio: ${formatDate(project.start_date)}`, 105, yPos + 5);
  doc.text(`Fecha Fin: ${formatDate(project.end_date)}`, 105, yPos + 15);
  doc.text(`Presupuesto: ${formatCurrency(project.budget)}`, 105, yPos + 25);
  
  yPos += 50;
  
  // Descripción
  if (project.descripcion) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIPCIÓN', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const description = doc.splitTextToSize(project.descripcion, 170);
    doc.text(description, 20, yPos);
    yPos += description.length * 5 + 15;
  }
  
  // Análisis de progreso
  if (tasks.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ANÁLISIS DE PROGRESO', 20, yPos);
    yPos += 15;
    
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Gráfico de progreso simulado
    doc.setFillColor(229, 231, 235);
    doc.rect(20, yPos, 120, 8, 'F');
    doc.setFillColor(34, 197, 94);
    doc.rect(20, yPos, (120 * progressPercentage) / 100, 8, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${progressPercentage}% Completado`, 145, yPos + 6);
    
    yPos += 20;
    doc.setFont('helvetica', 'normal');
    doc.text(`Tareas completadas: ${completedTasks} de ${totalTasks}`, 20, yPos);
    yPos += 15;
  }
  
  // Tabla de equipo
  if (team.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EQUIPO DEL PROYECTO', 20, yPos);
    yPos += 10;
    
    const teamData = team.map(member => [
      member.nombre || 'Sin nombre',
      member.role || 'Sin rol',
      member.email || 'Sin email'
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Miembro', 'Rol', 'Email']],
      body: teamData,
      theme: 'striped',
      headStyles: {
        fillColor: [13, 148, 136],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: { fontSize: 9 },
      margin: { left: 20, right: 20 }
    });
    
    yPos = doc.lastAutoTable.finalY + 20;
  }
  
  // Análisis financiero detallado
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ANÁLISIS FINANCIERO', 20, yPos);
  yPos += 15;
  
  // Crear tabla financiera
  const financialData = [
    ['Presupuesto Total', formatCurrency(project.budget || 0)],
    ['Monto sin IVA', formatCurrency(project.monto_sin_iva || 0)],
    ['IVA (19%)', formatCurrency((project.monto_sin_iva || 0) * 0.19)],
    ['Monto con IVA', formatCurrency(project.monto_con_iva || 0)]
  ];
  
  doc.autoTable({
    startY: yPos,
    head: [['Concepto', 'Monto']],
    body: financialData,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      1: { halign: 'right' }
    },
    margin: { left: 20, right: 20 }
  });
  
  // Nueva página si es necesario
  if (doc.lastAutoTable.finalY > 250) {
    doc.addPage();
    yPos = 20;
  } else {
    yPos = doc.lastAutoTable.finalY + 20;
  }
  
  // Recomendaciones
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMENDACIONES', 20, yPos);
  yPos += 15;
  
  const recommendations = generateRecommendations(project, tasks, team);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  recommendations.forEach((rec, index) => {
    const recText = doc.splitTextToSize(`${index + 1}. ${rec}`, 170);
    doc.text(recText, 20, yPos);
    yPos += recText.length * 5 + 5;
  });
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  const footerY = pageHeight - 20;
  
  doc.setFillColor(13, 148, 136);
  doc.rect(0, footerY - 5, 210, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Reporte generado automáticamente por Sistema de Gestión de Proyectos', 105, footerY + 5, { align: 'center' });
  doc.text('Confidencial - Solo para uso interno', 105, footerY + 12, { align: 'center' });
  
  // Generar archivo
  const fileName = `Reporte_${project.nombre?.replace(/[^a-zA-Z0-9]/g, '_') || 'Proyecto'}_${currentDate.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};

/**
 * Genera un reporte de dashboard con métricas clave
 */
export const generateDashboardReport = (projects = [], metrics = {}) => {
  const doc = new jsPDF('landscape'); // Formato horizontal
  const currentDate = new Date().toLocaleDateString('es-ES');
  
  // Header
  doc.setFillColor(67, 56, 202); // Indigo
  doc.rect(0, 0, 297, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('DASHBOARD DE PROYECTOS', 148.5, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Reporte generado el ${currentDate}`, 148.5, 30, { align: 'center' });
  
  let yPos = 60;
  
  // Métricas generales
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('MÉTRICAS GENERALES', 20, yPos);
  yPos += 15;
  
  // Cards de métricas
  const metricsData = [
    { label: 'Total Proyectos', value: projects.length, color: [59, 130, 246] },
    { label: 'Proyectos Activos', value: projects.filter(p => p.status === 'active').length, color: [34, 197, 94] },
    { label: 'Proyectos Completados', value: projects.filter(p => p.status === 'completed').length, color: [168, 85, 247] },
    { label: 'Inversión Total', value: formatCurrency(projects.reduce((sum, p) => sum + (p.budget || 0), 0)), color: [249, 115, 22] }
  ];
  
  metricsData.forEach((metric, index) => {
    const x = 20 + (index * 65);
    doc.setFillColor(...metric.color);
    doc.rect(x, yPos, 60, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(metric.label, x + 30, yPos + 12, { align: 'center' });
    doc.setFontSize(14);
    doc.text(String(metric.value), x + 30, yPos + 22, { align: 'center' });
  });
  
  yPos += 50;
  
  // Tabla de proyectos
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('LISTADO DE PROYECTOS', 20, yPos);
  yPos += 10;
  
  const projectsData = projects.map(project => [
    project.nombre || 'Sin nombre',
    getProjectStatus(project),
    formatDate(project.start_date),
    formatDate(project.end_date),
    formatCurrency(project.budget || 0)
  ]);
  
  doc.autoTable({
    startY: yPos,
    head: [['Proyecto', 'Estado', 'Inicio', 'Fin', 'Presupuesto']],
    body: projectsData,
    theme: 'striped',
    headStyles: {
      fillColor: [67, 56, 202],
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      4: { halign: 'right' }
    },
    margin: { left: 20, right: 20 }
  });
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  const footerY = pageHeight - 15;
  
  doc.setFillColor(67, 56, 202);
  doc.rect(0, footerY - 5, 297, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Dashboard - Sistema de Gestión de Proyectos', 148.5, footerY + 2, { align: 'center' });
  
  // Generar archivo
  const fileName = `Dashboard_Proyectos_${currentDate.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};

// Funciones auxiliares
const formatCurrency = (value) => {
  if (!value) return '$0';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value);
};

const formatDate = (date) => {
  if (!date) return 'Sin fecha';
  return new Date(date).toLocaleDateString('es-ES');
};

const getProjectStatus = (project) => {
  if (!project.start_date || !project.end_date) return 'Sin fechas';
  
  const now = new Date();
  const start = new Date(project.start_date);
  const end = new Date(project.end_date);
  
  if (now < start) return 'Programado';
  if (now > end) return 'Finalizado';
  return 'En Progreso';
};

const generateRecommendations = (project, tasks, team) => {
  const recommendations = [];
  
  // Análisis de progreso
  if (tasks.length > 0) {
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const progressPercentage = (completedTasks / tasks.length) * 100;
    
    if (progressPercentage < 30) {
      recommendations.push('El proyecto muestra un progreso bajo. Considerar revisar los obstáculos y reasignar recursos.');
    } else if (progressPercentage > 80) {
      recommendations.push('Excelente progreso del proyecto. Preparar documentación de cierre y evaluación final.');
    }
  }
  
  // Análisis de equipo
  if (team.length < 3) {
    recommendations.push('El equipo parece pequeño para el alcance del proyecto. Evaluar la necesidad de recursos adicionales.');
  } else if (team.length > 10) {
    recommendations.push('Equipo numeroso detectado. Asegurar una comunicación efectiva y roles bien definidos.');
  }
  
  // Análisis de fechas
  if (project.start_date && project.end_date) {
    const start = new Date(project.start_date);
    const end = new Date(project.end_date);
    const duration = (end - start) / (1000 * 60 * 60 * 24);
    
    if (duration < 30) {
      recommendations.push('Proyecto de corta duración. Asegurar entregas ágiles y seguimiento diario.');
    } else if (duration > 365) {
      recommendations.push('Proyecto de larga duración. Implementar hitos intermedios y revisiones regulares.');
    }
  }
  
  // Análisis financiero
  if (project.budget) {
    if (project.budget > 1000000) {
      recommendations.push('Alto presupuesto asignado. Implementar controles financieros estrictos y reportes mensuales.');
    } else if (project.budget < 100000) {
      recommendations.push('Presupuesto ajustado. Optimizar recursos y considerar metodologías ágiles.');
    }
  }
  
  // Recomendaciones por defecto si no hay específicas
  if (recommendations.length === 0) {
    recommendations.push('Mantener comunicación regular con stakeholders y documentar decisiones importantes.');
    recommendations.push('Realizar revisiones semanales de progreso y ajustar planificación según necesidad.');
    recommendations.push('Considerar implementar herramientas de automatización para mejorar eficiencia.');
  }
  
  return recommendations;
};