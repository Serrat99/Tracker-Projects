// Lean Project Tracker - State, Controllers, Calculations, Charts, Export/Import (Simplified Projects Only)

// 1. Initial State Definition
let state = {
    projects: [],
    planActivities: [],
    responsables: [],
    savingsRecords: [],
    savingsSelectedResponsable: 'all',
    savingsSortBy: 'savings_desc',
    currentSavingEditId: null,
    currentRespEditId: null,
    planFilters: {
        search: '',
        user: '',
        status: '',
        priority: '',
        savingsType: ''
    },
    planSubtab: 'plan',
    config: {
        agingLimit: 60,
        warningDays: 10
    },
    notifications: [],
    currentView: 'dashboard',
    currentProjectId: null,
    currentActivityId: null,
    theme: 'dark',
    sortColumn: 'id',
    sortAscending: true,
    currentPage: 1,
    rowsPerPage: 10
};

// 2. Mock Data Generator (Simplified executive lean projects)
const MOCK_PROJECTS = [
    {
        id: 101,
        name: "Optimización de Flujo en Línea de Pintura 3",
        leanResponsable: "Carlos Gómez",
        owner: "Laura Martínez",
        coLeader: "José Flores",
        area: "Producción",
        category: "Kaizen",
        priority: "Alta",
        status: "En Proceso",
        startDate: "2026-06-15",
        targetDate: "2026-08-25",
        closeDate: "",
        progress: 60,
        description: "Rediseñar racks de transporte y balancear estación de pintura para optimizar el flujo de material y reducir desperdicio de pintura.",
        comments: "Prueba piloto exitosa con el primer lote de racks. Ajustes de velocidad de transportadora en progreso.",
        lastUpdated: "2026-08-05T14:30:00.000Z"
    },
    {
        id: 102,
        name: "Célula Lean de Ensamble de Arnés Eléctrico",
        leanResponsable: "Patricia Rojas",
        owner: "Jorge Ruiz",
        coLeader: "Sofía Medina",
        area: "Ensamble",
        category: "SGA",
        priority: "Alta",
        status: "Cerrado",
        startDate: "2026-04-10",
        targetDate: "2026-06-30",
        closeDate: "2026-06-28",
        progress: 100,
        description: "Implementar celda en U en el área de ensamble de arnés eléctrico para mejorar productividad y reducir recorridos.",
        comments: "Proyecto completado y validado por finanzas. Resultados sostenidos por 4 semanas consecutivas.",
        lastUpdated: "2026-06-28T09:15:00.000Z"
    },
    {
        id: 103,
        name: "Proyecto SMED Prensa Estampadora 800T",
        leanResponsable: "Carlos Gómez",
        owner: "Roberto Méndez",
        coLeader: "",
        area: "Prensas",
        category: "Poka Yoke",
        priority: "Media",
        status: "En Riesgo",
        startDate: "2026-05-01",
        targetDate: "2026-08-01",
        closeDate: "",
        progress: 45,
        description: "Reducir tiempo de cambio de molde de la prensa 800T aplicando la metodología SMED, meta de reducción del 50%.",
        comments: "Retraso en la llegada de las abrazaderas rápidas neumáticas de importación.",
        lastUpdated: "2026-07-20T16:45:00.000Z"
    },
    {
        id: 104,
        name: "Reducción de Retrabajos en Inyección de Plásticos",
        leanResponsable: "Sofía Medina",
        owner: "Elena Cabrera",
        coLeader: "Patricia Rojas",
        area: "Calidad",
        category: "Six Sigma",
        priority: "Alta",
        status: "Planeación",
        startDate: "2026-08-01",
        targetDate: "2026-10-15",
        closeDate: "",
        progress: 10,
        description: "Disminuir defectos por burbujas en proceso de inyección mediante optimización de parámetros de temperatura y presión.",
        comments: "Fase de planeación. Definiendo el plan de instrumentación de las cavidades del molde.",
        lastUpdated: "2026-08-01T11:00:00.000Z"
    }
];

// Mock Plan de Actividades Entries (with Meta Esperada, Ahorro Real Validado, Savings Types, Status, etc.)
const MOCK_ACTIVITIES = [
    {
        id: "ACT-101",
        activity: "Optimización y reducción de tiempos muertos en celda de ensamble",
        userName: "Jose",
        targetDate: "2026-10-15",
        closeDate: "2026-10-08",
        status: "En Proceso",
        priority: "Alta",
        minutes: 240,
        progress: 80,
        hasSavings: "si",
        savingsType: "Hard, Soft",
        targetSavings: 50000,
        actualSavings: 40000,
        savingsLines: [
            { id: "sl-101-1", savingsType: "Hard", targetSavings: 30000, actualSavings: 25000, validationDate: "2026-10-08", financialComment: "Ahorro directo por paros de línea" },
            { id: "sl-101-2", savingsType: "Soft", targetSavings: 20000, actualSavings: 15000, validationDate: "2026-10-08", financialComment: "Optimización de horas setup" }
        ],
        comments: "Reducción del 80% en paros no programados.",
        nextAction: "Estandarizar en turno 2.",
        attachments: [
            { id: "att-1", name: "Reporte_Validacion_Jose.pdf", type: "pdf", size: "1.8 MB", date: "2026-10-08", userName: "Jose" }
        ]
    },
    {
        id: "ACT-102",
        activity: "Rediseño de flujo de trabajo y balanceo de líneas de empaque",
        userName: "Montserrat",
        targetDate: "2026-10-25",
        closeDate: "2026-10-05",
        status: "Completado",
        priority: "Alta",
        minutes: 310,
        progress: 100,
        hasSavings: "si",
        savingsType: "Soft, One Time",
        targetSavings: 70000,
        actualSavings: 65000,
        savingsLines: [
            { id: "sl-102-1", savingsType: "Soft", targetSavings: 50000, actualSavings: 45000, validationDate: "2026-10-05", financialComment: "Productividad por rebalanceo de empacado" },
            { id: "sl-102-2", savingsType: "One Time", targetSavings: 20000, actualSavings: 20000, validationDate: "2026-10-05", financialComment: "Recuperación de empaque reutilizable" }
        ],
        comments: "Pruebas de balanceo completadas exitosamente.",
        nextAction: "Monitoreo semanal.",
        attachments: [
            { id: "att-2", name: "Balanceo_Empaque_Montserrat.pptx", type: "powerpoint", size: "4.5 MB", date: "2026-10-05", userName: "Montserrat" }
        ]
    },
    {
        id: "ACT-103",
        activity: "Reducción de inventario de materia prima WIP mediante supermercado Kanban",
        userName: "Misael",
        targetDate: "2026-10-20",
        closeDate: "2026-10-07",
        status: "Completado",
        priority: "Media",
        minutes: 180,
        progress: 100,
        hasSavings: "si",
        savingsType: "Inventory",
        targetSavings: 40000,
        actualSavings: 35000,
        savingsLines: [
            { id: "sl-103-1", savingsType: "Inventory", targetSavings: 40000, actualSavings: 35000, validationDate: "2026-10-07", financialComment: "Disminución comprobada en almacenamiento WIP." }
        ],
        comments: "Implementación de tarjetas Kanban de 2 contenedores.",
        nextAction: "Auditoría diaria.",
        attachments: [
            { id: "att-3", name: "Auditoria_Kanban_Misael.xlsx", type: "excel", size: "1.1 MB", date: "2026-10-07", userName: "Misael" }
        ]
    },
    {
        id: "ACT-104",
        activity: "Reacondicionamiento por única ocasión de troquel prensa 800T",
        userName: "Alan",
        targetDate: "2026-10-28",
        closeDate: "",
        status: "En Proceso",
        priority: "Alta",
        minutes: 150,
        progress: 75,
        hasSavings: "si",
        savingsType: "One Time",
        targetSavings: 30000,
        actualSavings: 25000,
        savingsLines: [
            { id: "sl-104-1", savingsType: "One Time", targetSavings: 30000, actualSavings: 25000, validationDate: "2026-10-02", financialComment: "Evitamiento de compra de troquel nuevo." }
        ],
        comments: "Reacondicionamiento en taller de matriz.",
        nextAction: "Prueba de troquelado.",
        attachments: [
            { id: "att-4", name: "Cotizacion_Troquel_Alan.docx", type: "word", size: "950 KB", date: "2026-10-02", userName: "Alan" }
        ]
    },
    {
        id: "ACT-105",
        activity: "Implementación de Poka Yoke en sensor de posición de prensa 600T",
        userName: "Carlos Gómez",
        targetDate: "2026-10-30",
        closeDate: "2026-10-09",
        status: "Completado",
        priority: "Alta",
        minutes: 200,
        progress: 100,
        hasSavings: "si",
        savingsType: "Hard",
        targetSavings: 45000,
        actualSavings: 45000,
        savingsLines: [
            { id: "sl-105-1", savingsType: "Hard", targetSavings: 45000, actualSavings: 45000, validationDate: "2026-10-09", financialComment: "Eliminación de scrap en troquelado de lámina." }
        ],
        comments: "Prueba de 1,000 ciclos sin fallas.",
        nextAction: "Cierre de proyecto.",
        attachments: []
    },
    {
        id: "ACT-106",
        activity: "Auditoría de estandarización 5S y rutina de orden en celdas de maquinado",
        userName: "Carlos Gómez",
        targetDate: "2026-11-05",
        closeDate: "",
        status: "En Proceso",
        priority: "Baja",
        minutes: 120,
        progress: 40,
        hasSavings: "no",
        savingsType: "-",
        targetSavings: 0,
        actualSavings: 0,
        savingsLines: [],
        comments: "Actividad operativa de auditoría y disciplina operativa (Sin impacto económico directo).",
        nextAction: "Revisión de checklist semanal.",
        attachments: []
    }
];

// 3. Calculations Engine (Aging & Semaphore Color Codes)
function calculateAging(startDateStr, closeDateStr, status) {
    if (!startDateStr) return 0;
    const start = new Date(startDateStr);
    const current = new Date("2026-08-06");
    
    if (status === 'Cerrado' && closeDateStr) {
        const close = new Date(closeDateStr);
        const diffTime = Math.abs(close - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else {
        const diffTime = current - start;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

function getSemaphoreColor(aging) {
    if (aging <= 30) return 'Normal';
    if (aging <= 60) return 'Atención';
    if (aging <= 90) return 'Crítico';
    return 'Escalación';
}

function getSemaphoreClass(aging, status) {
    if (status === 'Cerrado') return 'sem-green';
    if (aging <= 30) return 'sem-green';
    if (aging <= 60) return 'sem-yellow';
    if (aging <= 90) return 'sem-rojo';
    return 'sem-rojo-oscuro';
}

// 4. Persistence Engine (Configurable: LocalStorage / Supabase)
function isSupabaseEnabled() {
    return window.modoSupabase === true && !!window.supabaseClient && window.SUPABASE_URL !== "YOUR_SUPABASE_URL";
}

function showToastNotification(message, type = 'error') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; max-width: 420px; pointer-events: none;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const isError = type === 'error';
    const bg = isError ? 'rgba(220, 38, 38, 0.95)' : 'rgba(16, 185, 129, 0.95)';
    const icon = isError ? 'fa-triangle-exclamation' : 'fa-circle-check';

    toast.style.cssText = `background: ${bg}; color: white; padding: 12px 16px; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 10px; font-size: 13px; font-family: "Outfit", sans-serif; pointer-events: auto; animation: fadeIn 0.3s ease;`;
    toast.innerHTML = `
        <i class="fa-solid ${icon}" style="font-size: 16px;"></i>
        <span style="flex: 1;">${message}</span>
        <button style="background: none; border: none; color: white; cursor: pointer; font-size: 16px; margin-left: 8px; line-height: 1;" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        if (toast.parentElement) toast.remove();
    }, 4500);
}

function showFriendlyError(message) {
    const errorBannerId = 'supabase-error-banner';
    let banner = document.getElementById(errorBannerId);
    if (!banner) {
        banner = document.createElement('div');
        banner.id = errorBannerId;
        banner.style.cssText = 'background: rgba(220, 38, 38, 0.95); color: white; padding: 12px 20px; text-align: center; font-weight: 500; position: fixed; top: 0; left: 0; right: 0; z-index: 9999; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-family: "Outfit", sans-serif;';
        
        const textSpan = document.createElement('span');
        textSpan.id = 'supabase-error-text';
        textSpan.innerText = message;
        banner.appendChild(textSpan);
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = 'background: none; border: none; color: white; font-size: 20px; cursor: pointer; font-weight: bold; margin-left: 15px;';
        closeBtn.onclick = () => banner.remove();
        banner.appendChild(closeBtn);
        
        document.body.appendChild(banner);
    } else {
        document.getElementById('supabase-error-text').innerText = message;
    }
}

async function fetchProjectsFromSupabase() {
    if (!isSupabaseEnabled()) {
        const local = localStorage.getItem('lean_tracker_projects');
        if (local) {
            try {
                state.projects = JSON.parse(local);
            } catch (e) {
                state.projects = JSON.parse(JSON.stringify(MOCK_PROJECTS));
            }
        } else {
            state.projects = JSON.parse(JSON.stringify(MOCK_PROJECTS));
            localStorage.setItem('lean_tracker_projects', JSON.stringify(state.projects));
        }
        return;
    }
    
    try {
        const { data, error } = await window.supabaseClient
            .from('projects')
            .select('*')
            .order('id', { ascending: true });
            
        if (error) throw error;
        
        state.projects = data || [];
        if (state.projects.length === 0) {
            console.log("Base de datos vacía. Cargando datos demo en Supabase (projects)...");
            const cleanMocks = MOCK_PROJECTS.map(({ id, ...p }) => ({
                name: p.name,
                description: p.description,
                category: p.category,
                area: p.area,
                owner: p.owner,
                leanResponsable: p.leanResponsable,
                coLeader: p.coLeader,
                priority: p.priority,
                status: p.status,
                progress: p.progress,
                startDate: p.startDate,
                targetDate: p.targetDate,
                closeDate: p.closeDate,
                comments: p.comments
            }));
            const { data: inserted, error: insertError } = await window.supabaseClient
                .from('projects')
                .insert(cleanMocks)
                .select();
            if (insertError) {
                console.error("Error al insertar proyectos demo:", insertError);
            } else {
                state.projects = inserted || [];
            }
        }
        
        const banner = document.getElementById('supabase-error-banner');
        if (banner) banner.remove();
    } catch (err) {
        console.error("Error al consultar proyectos desde Supabase:", err);
        showToastNotification("Error al cargar proyectos de Supabase: " + (err.message || err), "error");
        if (state.projects.length === 0) {
            state.projects = JSON.parse(JSON.stringify(MOCK_PROJECTS));
        }
    }
}

function setupSupabaseRealtime() {
    if (!isSupabaseEnabled()) return;
    
    window.supabaseClient
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, async (payload) => {
            console.log('Tiempo real Supabase (projects):', payload);
            await fetchProjectsFromSupabase();
            populateFilters();
            refreshCurrentView();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'plan_activities' }, async (payload) => {
            console.log('Tiempo real Supabase (plan_activities):', payload);
            await fetchPlanActivitiesFromSupabase();
            refreshCurrentView();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'plan_actividades' }, async (payload) => {
            console.log('Tiempo real Supabase (plan_actividades):', payload);
            await fetchPlanActivitiesFromSupabase();
            refreshCurrentView();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'responsables' }, async (payload) => {
            console.log('Tiempo real Supabase (responsables):', payload);
            await fetchResponsablesFromSupabase();
            refreshCurrentView();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'savings_records' }, async (payload) => {
            console.log('Tiempo real Supabase (savings_records):', payload);
            await fetchSavingsRecordsFromSupabase();
            refreshCurrentView();
        })
        .subscribe();
}

function refreshCurrentView() {
    if (state.currentView === 'dashboard') {
        renderDashboard();
    } else if (state.currentView === 'projects') {
        renderProjectsTable();
    } else if (state.currentView === 'reports') {
        renderReportsCharts();
    } else if (state.currentView === 'plan-actividades') {
        renderPlanActividadesView();
    } else if (state.currentView === 'project-detail' && state.currentProjectId) {
        viewProjectDetails(state.currentProjectId);
    }
}

function applyTheme() {
    if (state.theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-toggle').innerHTML = `<i class="fa-solid fa-sun"></i> <span>Modo Claro</span>`;
    } else {
        document.body.classList.remove('dark-theme');
        document.getElementById('theme-toggle').innerHTML = `<i class="fa-solid fa-moon"></i> <span>Modo Oscuro</span>`;
    }
}

// 5. Views Router controller
function switchView(viewName) {
    state.currentView = viewName;
    
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeView = document.getElementById(`view-${viewName}`);
    if (activeView) activeView.classList.add('active');
    
    const activeLink = document.querySelector(`.nav-link[data-view="${viewName}"]`);
    if (activeLink) activeLink.classList.add('active');
    
    if (viewName === 'dashboard') {
        renderDashboard();
    } else if (viewName === 'projects') {
        populateFilters();
        renderProjectsTable();
    } else if (viewName === 'reports') {
        renderReportsCharts();
    } else if (viewName === 'plan-actividades') {
        renderPlanActividadesView();
    }
    
    window.scrollTo(0, 0);
}

// 6. Dynamic Notification System Engines
function triggerNotificationCheck() {
    state.notifications = [];
    const today = new Date("2026-08-06");
    
    state.projects.forEach(proj => {
        const aging = calculateAging(proj.startDate, proj.closeDate, proj.status);
        
        if (proj.status !== 'Cerrado' && proj.status !== 'Cancelado') {
            const targetDate = new Date(proj.targetDate);
            const timeDiff = targetDate - today;
            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            
            if (daysLeft < 0) {
                state.notifications.push({
                    type: 'danger',
                    icon: 'fa-triangle-exclamation',
                    message: `El proyecto "${proj.name}" está VENCIDO por ${Math.abs(daysLeft)} días.`,
                    time: new Date().toLocaleTimeString()
                });
            } else if (daysLeft <= state.config.warningDays) {
                state.notifications.push({
                    type: 'warning',
                    icon: 'fa-clock',
                    message: `El proyecto "${proj.name}" vencerá en ${daysLeft} días.`,
                    time: new Date().toLocaleTimeString()
                });
            }
            
            if (aging >= state.config.agingLimit) {
                state.notifications.push({
                    type: 'warning',
                    icon: 'fa-hourglass-half',
                    message: `El proyecto "${proj.name}" superó el límite de Aging con ${aging} días activos.`,
                    time: new Date().toLocaleTimeString()
                });
            }
        }
    });
    
    updateNotificationsBadge();
}

function updateNotificationsBadge() {
    const badge = document.getElementById('notif-badge');
    badge.innerText = state.notifications.length;
    
    const container = document.getElementById('notif-list');
    container.innerHTML = "";
    
    if (state.notifications.length === 0) {
        container.innerHTML = `<div style="padding:20px; text-align:center; color:var(--text-muted);">Sin alertas de desvíos en el sistema.</div>`;
        return;
    }
    
    state.notifications.forEach(notif => {
        const item = document.createElement('div');
        item.className = 'notif-item unread';
        
        let colorClass = "text-blue";
        if (notif.type === 'danger') colorClass = "text-red";
        if (notif.type === 'warning') colorClass = "text-orange";
        
        item.innerHTML = `
            <i class="fa-solid ${notif.icon} notif-icon ${colorClass}"></i>
            <div class="notif-body">
                <div>${notif.message}</div>
                <span class="notif-time">${notif.time}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

let chartStatusInstance = null;
let chartAvgProgressCategoryInstance = null;
let chartRespInstance = null;
let chartAgingInstance = null;
let chartTrendInstance = null;
let chartCategoryInstance = null;
let chartGaugeInstance = null;

let chartReportStatusInstance = null;
let chartReportClosedMonthsInstance = null;
let chartReportAreaPriorityInstance = null;
let chartReportCategoryInstance = null;
let chartReportResponsibleInstance = null;

function renderDashboard() {
    triggerNotificationCheck();
    
    const total = state.projects.length;
    const active = state.projects.filter(p => p.status !== 'Cerrado' && p.status !== 'Cancelado').length;
    const closed = state.projects.filter(p => p.status === 'Cerrado').length;
    
    const today = new Date("2026-08-06");
    const overdue = state.projects.filter(p => {
        if (p.status === 'Cerrado' || p.status === 'Cancelado') return false;
        return new Date(p.targetDate) < today;
    }).length;
    
    let agingSum = 0;
    let maxAging = -1;
    let maxAgingProj = null;
    
    let normalCount = 0;
    let attentionCount = 0;
    let criticalCount = 0;
    let escalationCount = 0;
    let recentUpdatesCount = 0;
    
    let oldestAging = -1;
    let oldestProj = null;
    
    state.projects.forEach(p => {
        const aging = calculateAging(p.startDate, p.closeDate, p.status);
        agingSum += aging;
        
        if (aging > maxAging) {
            maxAging = aging;
            maxAgingProj = p;
        }
        
        if (aging > oldestAging) {
            oldestAging = aging;
            oldestProj = p;
        }
        
        if (aging <= 30) normalCount++;
        else if (aging <= 60) attentionCount++;
        else if (aging <= 90) criticalCount++;
        else escalationCount++;
        
        if (p.lastUpdated) {
            const lastUpdDate = new Date(p.lastUpdated);
            const diffDays = Math.ceil((today - lastUpdDate) / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays <= 7) {
                recentUpdatesCount++;
            }
        }
    });
    
    const avgAging = total > 0 ? Math.round(agingSum / total) : 0;
    const atRisk = state.projects.filter(p => p.status === 'En Riesgo').length;
    
    document.getElementById('kpi-total').innerText = total;
    document.getElementById('kpi-active').innerText = active;
    document.getElementById('kpi-closed').innerText = closed;
    document.getElementById('kpi-avg-aging').innerText = `${avgAging}d`;
    document.getElementById('kpi-at-risk').innerText = atRisk;
    
    // Populate Max Aging project info
    if (maxAgingProj) {
        document.getElementById('max-aging-proj-name').innerText = maxAgingProj.name;
        document.getElementById('max-aging-proj-resp').innerText = maxAgingProj.leanResponsable;
        document.getElementById('max-aging-proj-days').innerText = `${maxAging} días`;
    } else {
        document.getElementById('max-aging-proj-name').innerText = "-";
        document.getElementById('max-aging-proj-resp').innerText = "-";
        document.getElementById('max-aging-proj-days').innerText = "-";
    }
    
    // Populate Oldest Project info
    if (oldestProj) {
        document.getElementById('oldest-proj-name').innerText = oldestProj.name;
        document.getElementById('oldest-proj-resp').innerText = oldestProj.leanResponsable;
        document.getElementById('oldest-proj-days').innerText = `${oldestAging} días`;
    } else {
        document.getElementById('oldest-proj-name').innerText = "-";
        document.getElementById('oldest-proj-resp').innerText = "-";
        document.getElementById('oldest-proj-days').innerText = "-";
    }
    
    renderExecutiveProjectCards();
    renderCategoryGroupings();
    renderDashboardCharts();
    renderDashboardSmartTables();
}

function renderExecutiveProjectCards() {
    const container = document.getElementById('dashboard-project-cards');
    if (!container) return;
    container.innerHTML = "";
    
    state.projects.forEach(p => {
        const aging = calculateAging(p.startDate, p.closeDate, p.status);
        let ageClass = 'age-green';
        if (aging > 90) ageClass = 'age-dark-red';
        else if (aging > 60) ageClass = 'age-red';
        else if (aging > 30) ageClass = 'age-yellow';
        
        const card = document.createElement('div');
        card.className = `project-card ${ageClass}`;
        card.innerHTML = `
            <div class="project-card-header">
                <span class="project-card-title">${p.name}</span>
                <span class="project-card-category">${p.category || 'Kaizen'}</span>
            </div>
            <div class="project-card-meta">
                <div>
                    <label>Lean Responsable</label>
                    <span>${p.leanResponsable}</span>
                </div>
                <div>
                    <label>Status</label>
                    <span class="badge-status ${p.status.toLowerCase().replace(" ", "-")}">${p.status}</span>
                </div>
                <div>
                    <label>Aging (Días)</label>
                    <span>${aging} días</span>
                </div>
                <div>
                    <label>Fecha Compromiso</label>
                    <span>${p.targetDate}</span>
                </div>
            </div>
            <div class="project-card-desc" title="${p.description || ''}">
                <strong>Descripción:</strong> ${p.description || 'Sin descripción registrada.'}
            </div>
            <div style="font-size: 12px; margin-top: 5px;">
                <strong>Avance:</strong> ${p.progress || 0}%
                <div class="bar-container" style="margin-top: 4px;">
                    <div class="bar-fill" style="width: ${p.progress || 0}%;"></div>
                </div>
            </div>
            <div class="project-card-comment" title="${p.comments || ''}">
                <strong>Último Comentario:</strong> ${p.comments || 'Sin comentarios.'}
            </div>
        `;
        
        card.addEventListener('click', () => {
            viewProjectDetails(p.id);
        });
        
        container.appendChild(card);
    });
}

function renderCategoryGroupings() {
    const container = document.getElementById('category-groupings-container');
    if (!container) return;
    container.innerHTML = "";
    
    const categories = ["Kaizen", "SGA", "Six Sigma", "Poka Yoke", "App"];
    
    categories.forEach(cat => {
        const catProjects = state.projects.filter(p => (p.category || "").toLowerCase() === cat.toLowerCase());
        
        const total = catProjects.length;
        const open = catProjects.filter(p => p.status !== 'Cerrado' && p.status !== 'Cancelado').length;
        const closed = catProjects.filter(p => p.status === 'Cerrado').length;
        
        let progressSum = 0;
        let agingSum = 0;
        catProjects.forEach(p => {
            progressSum += (p.progress || 0);
            agingSum += calculateAging(p.startDate, p.closeDate, p.status);
        });
        
        const avgProgress = total > 0 ? Math.round(progressSum / total) : 0;
        const avgAging = total > 0 ? Math.round(agingSum / total) : 0;
        
        const catCard = document.createElement('div');
        catCard.className = 'category-section-card';
        
        let rowsHtml = "";
        if (total === 0) {
            rowsHtml = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted);">No hay proyectos registrados en esta categoría.</td></tr>`;
        } else {
            catProjects.forEach(p => {
                const aging = calculateAging(p.startDate, p.closeDate, p.status);
                rowsHtml += `
                    <tr>
                        <td><a href="#" class="cat-project-link font-semibold" data-id="${p.id}">${p.name}</a></td>
                        <td>${p.leanResponsable}</td>
                        <td>${p.owner}</td>
                        <td>${p.coLeader || "-"}</td>
                        <td>
                            <div class="bar-container" style="display:inline-block; width:60px; vertical-align:middle; margin-right:5px;">
                                <div class="bar-fill" style="width: ${p.progress || 0}%;"></div>
                            </div>
                            <span>${p.progress || 0}%</span>
                        </td>
                        <td><strong>${aging} d</strong></td>
                        <td><span class="badge-status ${p.status.toLowerCase().replace(" ", "-")}">${p.status}</span></td>
                        <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${p.comments || ''}">${p.comments || "-"}</td>
                        <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${p.description || ''}">${p.description || "-"}</td>
                    </tr>
                `;
            });
        }
        
        catCard.innerHTML = `
            <div class="category-title-bar">
                <h3>Proyectos ${cat}</h3>
            </div>
            
            <div class="category-kpis-row">
                <div class="category-kpi-item">
                    <label>Total Proyectos</label>
                    <span>${total}</span>
                </div>
                <div class="category-kpi-item">
                    <label>Abiertos</label>
                    <span>${open}</span>
                </div>
                <div class="category-kpi-item">
                    <label>Cerrados</label>
                    <span>${closed}</span>
                </div>
                <div class="category-kpi-item">
                    <label>Avance Promedio</label>
                    <span>${avgProgress}%</span>
                </div>
                <div class="category-kpi-item">
                    <label>Aging Promedio</label>
                    <span>${avgAging} días</span>
                </div>
            </div>
            
            <div class="table-container" style="overflow-x: auto;">
                <table class="table-mini" style="width: 100%;">
                    <thead>
                        <tr>
                            <th>Nombre del Proyecto</th>
                            <th>Lean Responsable</th>
                            <th>Owner</th>
                            <th>Co-Líder</th>
                            <th>% Avance</th>
                            <th>Aging</th>
                            <th>Status</th>
                            <th>Comentarios</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        `;
        
        catCard.querySelectorAll('.cat-project-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                viewProjectDetails(id);
            });
        });
        
        container.appendChild(catCard);
    });
}

function renderDashboardCharts() {
    // 1. Projects by Status
    const statusCounts = {};
    state.projects.forEach(p => {
        statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
    });
    
    const statusColorMap = {
        "Planeación": "#3B82F6",
        "En Proceso": "#06B6D4",
        "En Riesgo": "#F59E0B",
        "Cerrado": "#10B981",
        "Cancelado": "#64748B"
    };
    const statusColors = Object.keys(statusCounts).map(s => statusColorMap[s] || '#64748B');
    
    if (chartStatusInstance) chartStatusInstance.destroy();
    const ctxStatus = document.getElementById('chart-status').getContext('2d');
    chartStatusInstance = new Chart(ctxStatus, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: statusColors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right' } }
        }
    });
    
    // 2. Avance Promedio por Categoría
    const categoriesList = ["Kaizen", "SGA", "Six Sigma", "Poka Yoke", "App"];
    const progressData = categoriesList.map(cat => {
        const catProjs = state.projects.filter(p => (p.category || "").toLowerCase() === cat.toLowerCase());
        if (catProjs.length === 0) return 0;
        const sum = catProjs.reduce((acc, p) => acc + (p.progress || 0), 0);
        return Math.round(sum / catProjs.length);
    });
    
    if (chartAvgProgressCategoryInstance) chartAvgProgressCategoryInstance.destroy();
    const ctxAvgProg = document.getElementById('chart-avg-progress-category').getContext('2d');
    chartAvgProgressCategoryInstance = new Chart(ctxAvgProg, {
        type: 'bar',
        data: {
            labels: categoriesList,
            datasets: [{
                label: 'Avance Promedio (%)',
                data: progressData,
                backgroundColor: ['#2563EB', '#059669', '#F59E0B', '#DC2626', '#7C3AED'],
                borderColor: '#e2e8f0',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 100 } }
        }
    });
    
    // 3. Projects by Lean Responsable
    const respCounts = {};
    state.projects.forEach(p => {
        respCounts[p.leanResponsable] = (respCounts[p.leanResponsable] || 0) + 1;
    });
    if (chartRespInstance) chartRespInstance.destroy();
    const ctxResp = document.getElementById('chart-responsible').getContext('2d');
    chartRespInstance = new Chart(ctxResp, {
        type: 'polarArea',
        data: {
            labels: Object.keys(respCounts),
            datasets: [{
                data: Object.values(respCounts),
                backgroundColor: ['#2563EB', '#059669', '#F59E0B', '#DC2626', '#7C3AED']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // 4. Aging distribution bar
    let binGreen = 0;
    let binYellow = 0;
    let binRed = 0;
    let binDarkRed = 0;
    
    state.projects.forEach(p => {
        const aging = calculateAging(p.startDate, p.closeDate, p.status);
        if (aging <= 30) binGreen++;
        else if (aging <= 60) binYellow++;
        else if (aging <= 90) binRed++;
        else binDarkRed++;
    });
    
    if (chartAgingInstance) chartAgingInstance.destroy();
    const ctxAging = document.getElementById('chart-aging-dist').getContext('2d');
    chartAgingInstance = new Chart(ctxAging, {
        type: 'bar',
        data: {
            labels: ['0-30 días (Normal)', '31-60 días (Atención)', '61-90 días (Crítico)', '+90 días (Escalación)'],
            datasets: [{
                label: 'Cantidad de Proyectos',
                data: [binGreen, binYellow, binRed, binDarkRed],
                backgroundColor: ['#22c55e', '#eab308', '#ef4444', '#7f1d1d']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const idx = elements[0].index;
                    showDrilldown('aging', idx);
                }
            }
        }
    });
    
    // 5. Proyectos por Categoría (New Dashboard Chart)
    const categoryCounts = { "Kaizen": 0, "SGA": 0, "Poka Yoke": 0, "Six Sigma": 0, "App": 0 };
    state.projects.forEach(p => {
        if (p.category && categoryCounts[p.category] !== undefined) {
            categoryCounts[p.category]++;
        }
    });
    if (chartCategoryInstance) chartCategoryInstance.destroy();
    const ctxCat = document.getElementById('chart-category').getContext('2d');
    chartCategoryInstance = new Chart(ctxCat, {
        type: 'bar',
        data: {
            labels: Object.keys(categoryCounts),
            datasets: [{
                label: 'Cantidad de Proyectos',
                data: Object.values(categoryCounts),
                backgroundColor: ['#2563EB', '#059669', '#F59E0B', '#DC2626', '#7C3AED']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const idx = elements[0].index;
                    const labels = Object.keys(categoryCounts);
                    const selectedCat = labels[idx];
                    showDrilldown('category', selectedCat);
                }
            }
        }
    });

function showDrilldown(type, value) {
    const section = document.getElementById('drilldown-section');
    const filterNameEl = document.getElementById('drilldown-filter-name');
    const tbody = document.getElementById('table-drilldown-body');
    
    if (!section || !tbody) return;
    
    let filtered = [];
    let filterLabel = "";
    
    if (type === 'aging') {
        if (value === 0) {
            filtered = state.projects.filter(p => calculateAging(p.startDate, p.closeDate, p.status) <= 30);
            filterLabel = "Aging 0 a 30 días";
        } else if (value === 1) {
            filtered = state.projects.filter(p => {
                const aging = calculateAging(p.startDate, p.closeDate, p.status);
                return aging > 30 && aging <= 60;
            });
            filterLabel = "Aging 31 a 60 días";
        } else if (value === 2) {
            filtered = state.projects.filter(p => {
                const aging = calculateAging(p.startDate, p.closeDate, p.status);
                return aging > 60 && aging <= 90;
            });
            filterLabel = "Aging 61 a 90 días";
        } else {
            filtered = state.projects.filter(p => calculateAging(p.startDate, p.closeDate, p.status) > 90);
            filterLabel = "Aging Más de 90 días";
        }
    } else if (type === 'category') {
        filtered = state.projects.filter(p => (p.category || "").toLowerCase() === value.toLowerCase());
        filterLabel = `Categoría ${value}`;
    }
    
    filterNameEl.innerText = `${filterLabel} (${filtered.length} proyectos)`;
    tbody.innerHTML = "";
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No hay proyectos que coincidan.</td></tr>`;
    } else {
        filtered.forEach(p => {
            const aging = calculateAging(p.startDate, p.closeDate, p.status);
            tbody.innerHTML += `
                <tr>
                    <td><a href="#" class="drilldown-project-link font-semibold" data-id="${p.id}">${p.name}</a></td>
                    <td>${p.leanResponsable}</td>
                    <td>${p.category || "-"}</td>
                    <td><span class="badge-status ${p.status.toLowerCase().replace(" ", "-")}">${p.status}</span></td>
                    <td>
                        <div class="bar-container" style="display:inline-block; width:60px; vertical-align:middle; margin-right:5px;">
                            <div class="bar-fill" style="width: ${p.progress || 0}%;"></div>
                        </div>
                        <span>${p.progress || 0}%</span>
                    </td>
                    <td><strong>${aging} días</strong></td>
                </tr>
            `;
        });
    }
    
    tbody.querySelectorAll('.drilldown-project-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            viewProjectDetails(id);
        });
    });
    
    section.style.display = "block";
    section.scrollIntoView({ behavior: 'smooth' });
}

    // Aging Gauge Chart Simulation
    let agingSumForGauge = 0;
    state.projects.forEach(p => {
        agingSumForGauge += calculateAging(p.startDate, p.closeDate, p.status);
    });
    const avgAgingForGauge = state.projects.length > 0 ? Math.round(agingSumForGauge / state.projects.length) : 0;
    
    document.getElementById('gauge-avg-value').innerText = `${avgAgingForGauge} días promedio`;
    
    if (chartGaugeInstance) chartGaugeInstance.destroy();
    const ctxGauge = document.getElementById('chart-gauge-aging').getContext('2d');
    chartGaugeInstance = new Chart(ctxGauge, {
        type: 'doughnut',
        data: {
            labels: ['Normal', 'Atención', 'Crítico', 'Escalación'],
            datasets: [{
                data: [30, 30, 30, 90], // Gauge segments scale
                backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#7F1D1D'],
                needleValue: avgAgingForGauge
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            circumference: 180,
            rotation: 270,
            plugins: {
                legend: { display: false }
            }
        }
    });

    // 6. Closed Projects por Month
    const monthlyClosed = {};
    state.projects.forEach(p => {
        if (p.status === 'Cerrado' && p.closeDate) {
            const dateObj = new Date(p.closeDate);
            const monthYear = dateObj.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
            monthlyClosed[monthYear] = (monthlyClosed[monthYear] || 0) + 1;
        }
    });
    
    if (chartTrendInstance) chartTrendInstance.destroy();
    const ctxTrend = document.getElementById('chart-monthly-trend').getContext('2d');
    chartTrendInstance = new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: Object.keys(monthlyClosed).length > 0 ? Object.keys(monthlyClosed) : ['Sin datos'],
            datasets: [{
                label: 'Proyectos Cerrados',
                data: Object.keys(monthlyClosed).length > 0 ? Object.values(monthlyClosed) : [0],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

function renderDashboardSmartTables() {
    // 1. Top 10 Highest Aging Projects
    const sortedAging = [...state.projects].sort((a,b) => {
        return calculateAging(b.startDate, b.closeDate, b.status) - calculateAging(a.startDate, a.closeDate, a.status);
    }).slice(0, 10);
    
    const tableAge = document.querySelector('#table-highest-aging tbody');
    tableAge.innerHTML = "";
    sortedAging.forEach(p => {
        const aging = calculateAging(p.startDate, p.closeDate, p.status);
        const sem = getSemaphoreColor(aging);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><a href="#" class="project-detail-link" data-id="${p.id}">${p.name}</a></td>
            <td>${p.leanResponsable}</td>
            <td><strong>${aging} días</strong></td>
            <td><span class="badge-status ${sem}">${sem.toUpperCase()}</span></td>
        `;
        tableAge.appendChild(tr);
    });

    // 2. Proyectos próximos a vencer (30 días)
    const today = new Date("2026-08-06");
    const expiringSoon = state.projects.filter(p => {
        if (p.status === 'Cerrado' || p.status === 'Cancelado') return false;
        const target = new Date(p.targetDate);
        const diffTime = target - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 30;
    }).slice(0, 10);
    
    const tableExp = document.querySelector('#table-expiring-soon tbody');
    tableExp.innerHTML = "";
    expiringSoon.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><a href="#" class="project-detail-link" data-id="${p.id}">${p.name}</a></td>
            <td>${p.leanResponsable}</td>
            <td>${p.targetDate}</td>
            <td><span class="badge-status ${p.status.toLowerCase().replace(" ", "-")}">${p.status}</span></td>
        `;
        tableExp.appendChild(tr);
    });

    // 3. Proyectos abiertos por responsable
    const respOpen = {};
    state.projects.forEach(p => {
        if (p.status !== 'Cerrado' && p.status !== 'Cancelado') {
            if (!respOpen[p.leanResponsable]) {
                respOpen[p.leanResponsable] = { count: 0, agingSum: 0 };
            }
            respOpen[p.leanResponsable].count++;
            respOpen[p.leanResponsable].agingSum += calculateAging(p.startDate, p.closeDate, p.status);
        }
    });
    
    const tableResp = document.querySelector('#table-open-by-resp tbody');
    tableResp.innerHTML = "";
    Object.entries(respOpen).forEach(([resp, data]) => {
        const avg = Math.round(data.agingSum / data.count);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${resp}</td>
            <td><strong>${data.count}</strong></td>
            <td>${avg} días</td>
        `;
        tableResp.appendChild(tr);
    });

    // 4. Proyectos en riesgo
    const riskProjects = state.projects.filter(p => p.status === 'En Riesgo').slice(0, 10);
    const tableRisk = document.querySelector('#table-at-risk tbody');
    tableRisk.innerHTML = "";
    riskProjects.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><a href="#" class="project-detail-link" data-id="${p.id}">${p.name}</a></td>
            <td>${p.leanResponsable}</td>
            <td>${p.area}</td>
            <td><strong>${p.progress}%</strong></td>
        `;
        tableRisk.appendChild(tr);
    });

    // 5. Proyectos en Escalación (+90 días)
    const escalationProjects = state.projects.filter(p => {
        return calculateAging(p.startDate, p.closeDate, p.status) > 90;
    }).slice(0, 10);
    const tableEsc = document.querySelector('#table-escalation tbody');
    tableEsc.innerHTML = "";
    escalationProjects.forEach(p => {
        const aging = calculateAging(p.startDate, p.closeDate, p.status);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><a href="#" class="project-detail-link" data-id="${p.id}">${p.name}</a></td>
            <td>${p.leanResponsable}</td>
            <td><strong class="text-danger">${aging} días</strong></td>
        `;
        tableEsc.appendChild(tr);
    });
    
    // Add navigation click event delegation to table links
    document.querySelectorAll('.project-detail-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            viewProjectDetails(id);
        });
    });
}

// 9. Project module filters & segment controllers
function populateFilters() {
    const resps = new Set();
    const owners = new Set();
    const coleaders = new Set();
    const areas = new Set();
    
    state.projects.forEach(p => {
        if (p.leanResponsable) resps.add(p.leanResponsable);
        if (p.owner) owners.add(p.owner);
        if (p.coLeader) coleaders.add(p.coLeader);
        if (p.area) areas.add(p.area);
    });
    
    const fillSelect = (id, items) => {
        const select = document.getElementById(id);
        const prevVal = select.value;
        select.innerHTML = '<option value="">Todos</option>';
        [...items].sort().forEach(item => {
            select.innerHTML += `<option value="${item}">${item}</option>`;
        });
        select.value = prevVal;
    };
    
    fillSelect('filter-lean-resp', resps);
    fillSelect('filter-owner', owners);
    fillSelect('filter-co-leader', coleaders);
    fillSelect('filter-area', areas);
}

function getFilteredProjects() {
    const leanResp = document.getElementById('filter-lean-resp').value;
    const owner = document.getElementById('filter-owner').value;
    const coLeader = document.getElementById('filter-co-leader').value;
    const area = document.getElementById('filter-area').value;
    const category = document.getElementById('filter-category').value;
    const status = document.getElementById('filter-status').value;
    const priority = document.getElementById('filter-priority').value;
    const agingFilter = document.getElementById('filter-aging').value;
    const searchVal = document.getElementById('global-search').value.toLowerCase().trim();
    
    return state.projects.filter(p => {
        if (leanResp && p.leanResponsable !== leanResp) return false;
        if (owner && p.owner !== owner) return false;
        if (coLeader && p.coLeader !== coLeader) return false;
        if (area && p.area !== area) return false;
        if (category && p.category !== category) return false;
        if (status && p.status !== status) return false;
        if (priority && p.priority !== priority) return false;
        
        if (agingFilter) {
            const aging = calculateAging(p.startDate, p.closeDate, p.status);
            const stateLabel = getSemaphoreColor(aging);
            if (stateLabel !== agingFilter) return false;
        }
        
        if (searchVal) {
            const matchesSearch = 
                p.id.toString().includes(searchVal) ||
                p.name.toLowerCase().includes(searchVal) ||
                p.leanResponsable.toLowerCase().includes(searchVal) ||
                p.owner.toLowerCase().includes(searchVal) ||
                p.area.toLowerCase().includes(searchVal) ||
                p.status.toLowerCase().includes(searchVal);
            if (!matchesSearch) return false;
        }
        
        return true;
    });
}

function renderProjectsTable() {
    const list = getFilteredProjects();
    
    list.sort((a, b) => {
        let valA = a[state.sortColumn];
        let valB = b[state.sortColumn];
        
        if (state.sortColumn === 'aging') {
            valA = calculateAging(a.startDate, a.closeDate, a.status);
            valB = calculateAging(b.startDate, b.closeDate, b.status);
        }
        
        if (typeof valA === 'string') {
            return state.sortAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
            return state.sortAscending ? (valA - valB) : (valB - valA);
        }
    });
    
    const tbody = document.getElementById('projects-table-body');
    tbody.innerHTML = "";
    
    const totalRecords = list.length;
    document.getElementById('pag-total').innerText = totalRecords;
    
    if (totalRecords === 0) {
        tbody.innerHTML = `<tr><td colspan="12" style="text-align: center; color: var(--text-muted);">Ningún proyecto coincide con los filtros aplicados.</td></tr>`;
        document.getElementById('pag-start').innerText = 0;
        document.getElementById('pag-end').innerText = 0;
        return;
    }
    
    // Pagination calculation
    const maxPage = Math.ceil(totalRecords / state.rowsPerPage);
    if (state.currentPage > maxPage) state.currentPage = maxPage;
    if (state.currentPage < 1) state.currentPage = 1;
    
    const startIndex = (state.currentPage - 1) * state.rowsPerPage;
    const endIndex = Math.min(startIndex + state.rowsPerPage, totalRecords);
    
    document.getElementById('pag-start').innerText = startIndex + 1;
    document.getElementById('pag-end').innerText = endIndex;
    
    const pageList = list.slice(startIndex, endIndex);
    
    pageList.forEach(p => {
        const aging = calculateAging(p.startDate, p.closeDate, p.status);
        const semClass = getSemaphoreClass(aging, p.status);
        const stateLabel = getSemaphoreColor(aging);
        
        const tr = document.createElement('tr');
        tr.className = semClass;
        
        tr.innerHTML = `
            <td><strong>#${p.id}</strong></td>
            <td><a href="#" class="project-detail-link font-semibold" data-id="${p.id}">${p.name}</a></td>
            <td>${p.leanResponsable}</td>
            <td>${p.owner}</td>
            <td>${p.coLeader || "-"}</td>
            <td>${p.area}</td>
            <td>${p.category || "-"}</td>
            <td>${p.priority}</td>
            <td><span class="badge-status ${p.status.toLowerCase().replace(" ", "-")}">${p.status}</span></td>
            <td>${p.startDate}</td>
            <td>${p.targetDate}</td>
            <td>${p.closeDate || "-"}</td>
            <td><strong>${aging} d</strong></td>
            <td><strong>${stateLabel}</strong></td>
            <td>
                <div class="bar-container">
                    <div class="bar-fill" style="width: ${p.progress || 0}%;"></div>
                </div>
                <span style="font-size: 11px; margin-left: 5px;">${p.progress || 0}%</span>
            </td>
            <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.comments || "-"}</td>
            <td>
                <button class="table-action-btn edit" data-id="${p.id}" title="Editar"><i class="fa-solid fa-pen"></i></button>
                <button class="table-action-btn delete" data-id="${p.id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                <button class="table-action-btn duplicate" data-id="${p.id}" title="Duplicar"><i class="fa-solid fa-copy"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Rebind project action buttons click events
    tbody.querySelectorAll('.project-detail-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(btn.getAttribute('data-id'));
            viewProjectDetails(id);
        });
    });
    
    tbody.querySelectorAll('.table-action-btn.edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id'));
            openProjectModal(id);
        });
    });
    
    tbody.querySelectorAll('.table-action-btn.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id'));
            deleteProject(id);
        });
    });

    tbody.querySelectorAll('.table-action-btn.duplicate').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id'));
            duplicateProject(id);
        });
    });
}

// 10. CRUD logic details for projects
async function deleteProject(id) {
    if (confirm("¿Está seguro de eliminar este proyecto?\n\nPresione Aceptar para Confirmar Eliminación o Cancelar.")) {
        if (!isSupabaseEnabled()) {
            state.projects = state.projects.filter(p => p.id !== id);
            localStorage.setItem('lean_tracker_projects', JSON.stringify(state.projects));
            if (state.currentView === 'project-detail') {
                switchView('projects');
            } else {
                populateFilters();
                renderProjectsTable();
            }
            return;
        }
        try {
            const { error } = await window.supabaseClient
                .from('projects')
                .delete()
                .eq('id', id);
            if (error) throw error;
            
            await fetchProjectsFromSupabase();
            if (state.currentView === 'project-detail') {
                switchView('projects');
            } else {
                populateFilters();
                renderProjectsTable();
            }
        } catch (err) {
            console.error("Error detallado al eliminar el proyecto en Supabase:", err);
            if (err.message) console.error("Mensaje:", err.message);
            if (err.details) console.error("Detalles:", err.details);
            showFriendlyError("No se pudo eliminar el proyecto de Supabase. (Error: " + (err.message || err) + ")");
            alert("Error al eliminar el proyecto: " + (err.message || JSON.stringify(err)));
        }
    }
}

async function duplicateProject(id) {
    const orig = state.projects.find(p => p.id === id);
    if (!orig) return;
    
    const { id: origId, created_at, updated_at, ...origDetails } = orig;
    const clone = {
        ...origDetails,
        name: orig.name + " (Copia)",
        updated_at: new Date().toISOString()
    };
    
    if (!isSupabaseEnabled()) {
        const maxId = state.projects.length > 0 ? Math.max(...state.projects.map(p => p.id || 0)) : 100;
        const newProj = { ...clone, id: maxId + 1 };
        state.projects.unshift(newProj);
        localStorage.setItem('lean_tracker_projects', JSON.stringify(state.projects));
        populateFilters();
        renderProjectsTable();
        return;
    }

    try {
        const { error } = await window.supabaseClient
            .from('projects')
            .insert([clone]);
        if (error) throw error;
        
        await fetchProjectsFromSupabase();
        populateFilters();
        renderProjectsTable();
    } catch (err) {
        console.error("Error detallado al duplicar el proyecto en Supabase:", err);
        if (err.message) console.error("Mensaje:", err.message);
        if (err.details) console.error("Detalles:", err.details);
        showFriendlyError("No se pudo duplicar el proyecto en Supabase. (Error: " + (err.message || err) + ")");
        alert("Error al duplicar el proyecto: " + (err.message || JSON.stringify(err)));
    }
}

function openProjectModal(id = null) {
    const form = document.getElementById('project-form');
    form.reset();
    document.getElementById('form-project-id').value = "";
    
    const statusSelect = document.getElementById('form-status');
    const closeDateContainer = document.getElementById('form-close-date-container');
    
    statusSelect.addEventListener('change', () => {
        if (statusSelect.value === 'Cerrado') {
            closeDateContainer.style.display = 'block';
        } else {
            closeDateContainer.style.display = 'none';
        }
    });

    if (id) {
        document.getElementById('modal-project-title').innerText = "Editar Proyecto";
        const proj = state.projects.find(p => p.id === id);
        if (proj) {
            document.getElementById('form-project-id').value = proj.id;
            document.getElementById('form-name').value = proj.name;
            document.getElementById('form-lean-resp').value = proj.leanResponsable;
            document.getElementById('form-owner').value = proj.owner;
            document.getElementById('form-co-leader').value = proj.coLeader;
            document.getElementById('form-area').value = proj.area;
            document.getElementById('form-category').value = proj.category || "Kaizen";
            document.getElementById('form-priority').value = proj.priority;
            document.getElementById('form-status').value = proj.status;
            document.getElementById('form-progress').value = proj.progress || 0;
            document.getElementById('form-start-date').value = proj.startDate;
            document.getElementById('form-target-date').value = proj.targetDate;
            document.getElementById('form-close-date').value = proj.closeDate;
            document.getElementById('form-description').value = proj.description || "";
            document.getElementById('form-comments').value = proj.comments || "";
            
            if (proj.status === 'Cerrado') {
                closeDateContainer.style.display = 'block';
            } else {
                closeDateContainer.style.display = 'none';
            }
        }
    } else {
        document.getElementById('modal-project-title').innerText = "Nuevo Proyecto";
        closeDateContainer.style.display = 'none';
        document.getElementById('form-start-date').value = new Date("2026-08-06").toISOString().split('T')[0];
        document.getElementById('form-description').value = "";
    }
    
    document.getElementById('project-modal').classList.add('show');
}

// 11. View project details dashboard
function viewProjectDetails(id) {
    const proj = state.projects.find(p => p.id === id);
    if (!proj) return;
    
    state.currentProjectId = id;
    
    document.getElementById('detail-project-title').innerText = proj.name;
    document.getElementById('dt-id').innerText = `#${proj.id}`;
    document.getElementById('dt-status').innerText = proj.status;
    document.getElementById('dt-priority').innerText = proj.priority;
    document.getElementById('dt-lean-resp').innerText = proj.leanResponsable;
    document.getElementById('dt-owner').innerText = proj.owner;
    document.getElementById('dt-co-leader').innerText = proj.coLeader || "-";
    document.getElementById('dt-area').innerText = proj.area;
    document.getElementById('dt-category').innerText = proj.category || "-";
    document.getElementById('dt-start-date').innerText = proj.startDate;
    document.getElementById('dt-target-date').innerText = proj.targetDate;
    document.getElementById('dt-close-date').innerText = proj.closeDate || "-";
    
    const aging = calculateAging(proj.startDate, proj.closeDate, proj.status);
    document.getElementById('dt-aging').innerText = `${aging} días`;
    document.getElementById('dt-aging-state').innerText = getSemaphoreColor(aging);
    document.getElementById('dt-description').innerText = proj.description || "Sin descripción registrada.";
    document.getElementById('dt-comments').innerText = proj.comments || "Sin comentarios registrados.";
    
    document.getElementById('dt-progress-percent').innerText = `${proj.progress || 0}%`;
    document.getElementById('dt-progress-bar').style.width = `${proj.progress || 0}%`;
    
    switchView('project-detail');
}

// 12. Analytics reports rendering (Wider priority layout reports)
function renderReportsCharts() {
    // 1. Distribution of Projects por Status
    const statusCounts = {};
    state.projects.forEach(p => {
        statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
    });
    
    const statusColorMap = {
        "Planeación": "#3B82F6",
        "En Proceso": "#06B6D4",
        "En Riesgo": "#F59E0B",
        "Cerrado": "#10B981",
        "Cancelado": "#64748B"
    };
    const statusColors = Object.keys(statusCounts).map(s => statusColorMap[s] || '#64748B');
    
    if (chartReportStatusInstance) chartReportStatusInstance.destroy();
    const ctxRepStat = document.getElementById('chart-report-status').getContext('2d');
    chartReportStatusInstance = new Chart(ctxRepStat, {
        type: 'pie',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: statusColors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 2. Closed Projects por Month
    const monthlyClosed = {};
    state.projects.forEach(p => {
        if (p.status === 'Cerrado' && p.closeDate) {
            const dateObj = new Date(p.closeDate);
            const monthYear = dateObj.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
            monthlyClosed[monthYear] = (monthlyClosed[monthYear] || 0) + 1;
        }
    });
    
    if (chartReportClosedMonthsInstance) chartReportClosedMonthsInstance.destroy();
    const ctxRepClosed = document.getElementById('chart-report-closed-months').getContext('2d');
    chartReportClosedMonthsInstance = new Chart(ctxRepClosed, {
        type: 'bar',
        data: {
            labels: Object.keys(monthlyClosed).length > 0 ? Object.keys(monthlyClosed) : ['Sin datos'],
            datasets: [{
                label: 'Cerrados',
                data: Object.keys(monthlyClosed).length > 0 ? Object.values(monthlyClosed) : [0],
                backgroundColor: 'rgba(5, 150, 105, 0.7)',
                borderColor: '#059669',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });

    // 3. Projects por Categoría
    const catCounts = { "Kaizen": 0, "SGA": 0, "Poka Yoke": 0, "Six Sigma": 0, "App": 0 };
    state.projects.forEach(p => {
        if (p.category && catCounts[p.category] !== undefined) {
            catCounts[p.category]++;
        }
    });
    if (chartReportCategoryInstance) chartReportCategoryInstance.destroy();
    const ctxRepCat = document.getElementById('chart-report-category').getContext('2d');
    chartReportCategoryInstance = new Chart(ctxRepCat, {
        type: 'bar',
        data: {
            labels: Object.keys(catCounts),
            datasets: [{
                label: 'Proyectos',
                data: Object.values(catCounts),
                backgroundColor: ['#2563EB', '#059669', '#F59E0B', '#DC2626', '#7C3AED']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 4. Projects por Responsable
    const respCounts = {};
    state.projects.forEach(p => {
        respCounts[p.leanResponsable] = (respCounts[p.leanResponsable] || 0) + 1;
    });
    if (chartReportResponsibleInstance) chartReportResponsibleInstance.destroy();
    const ctxRepResp = document.getElementById('chart-report-responsible').getContext('2d');
    chartReportResponsibleInstance = new Chart(ctxRepResp, {
        type: 'bar',
        data: {
            labels: Object.keys(respCounts),
            datasets: [{
                label: 'Proyectos',
                data: Object.values(respCounts),
                backgroundColor: '#7C3AED'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 5. Projects por Area and Priority levels
    const areas = [...new Set(state.projects.map(p => p.area))];
    const highPriorityData = [];
    const medPriorityData = [];
    const lowPriorityData = [];
    
    areas.forEach(area => {
        const areaProjs = state.projects.filter(p => p.area === area);
        highPriorityData.push(areaProjs.filter(p => p.priority === 'Alta').length);
        medPriorityData.push(areaProjs.filter(p => p.priority === 'Media').length);
        lowPriorityData.push(areaProjs.filter(p => p.priority === 'Baja').length);
    });
    
    if (chartReportAreaPriorityInstance) chartReportAreaPriorityInstance.destroy();
    const ctxRepAreaPri = document.getElementById('chart-report-area-priority').getContext('2d');
    chartReportAreaPriorityInstance = new Chart(ctxRepAreaPri, {
        type: 'bar',
        data: {
            labels: areas,
            datasets: [
                { label: 'Prioridad Alta', data: highPriorityData, backgroundColor: '#ef4444' },
                { label: 'Prioridad Media', data: medPriorityData, backgroundColor: '#eab308' },
                { label: 'Prioridad Baja', data: lowPriorityData, backgroundColor: '#3b82f6' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

function exportProjectsToExcel() {
    // Sheet 1: Resumen Ejecutivo
    const totalProjs = state.projects.length;
    const totalOpen = state.projects.filter(p => p.status !== 'Cerrado' && p.status !== 'Cancelado').length;
    const totalClosed = state.projects.filter(p => p.status === 'Cerrado').length;
    const totalAgingSum = state.projects.reduce((acc, p) => acc + calculateAging(p.startDate, p.closeDate, p.status), 0);
    const avgAgingGeneral = totalProjs > 0 ? Math.round(totalAgingSum / totalProjs) : 0;

    const resumenGeneral = [
        { "Métrica": "Total Proyectos", "Valor": totalProjs },
        { "Métrica": "Proyectos Abiertos", "Valor": totalOpen },
        { "Métrica": "Proyectos Cerrados", "Valor": totalClosed },
        { "Métrica": "Aging Promedio (Días)", "Valor": avgAgingGeneral }
    ];

    const categories = ["Kaizen", "SGA", "Six Sigma", "Poka Yoke", "App"];
    const resumenPorCategoria = categories.map(cat => {
        const catProjs = state.projects.filter(p => (p.category || "").toLowerCase() === cat.toLowerCase());
        const total = catProjs.length;
        const open = catProjs.filter(p => p.status !== 'Cerrado' && p.status !== 'Cancelado').length;
        const closed = catProjs.filter(p => p.status === 'Cerrado').length;
        
        let progressSum = 0;
        let agingSum = 0;
        catProjs.forEach(p => {
            progressSum += (p.progress || 0);
            agingSum += calculateAging(p.startDate, p.closeDate, p.status);
        });
        
        const avgProgress = total > 0 ? Math.round(progressSum / total) : 0;
        const avgAging = total > 0 ? Math.round(agingSum / total) : 0;

        return {
            "Categoría": cat,
            "Total Proyectos": total,
            "Cantidad Abiertos": open,
            "Cantidad Cerrados": closed,
            "Avance Promedio (%)": avgProgress,
            "Aging Promedio (Días)": avgAging
        };
    });

    const wsExecutive = XLSX.utils.json_to_sheet(resumenGeneral);
    XLSX.utils.sheet_add_json(wsExecutive, [{}], { skipHeader: true, origin: "A6" });
    XLSX.utils.sheet_add_json(wsExecutive, resumenPorCategoria, { origin: "A8" });

    // Sheet 2: Listado Completo de Proyectos
    const listadoCompleto = state.projects.map(p => {
        const aging = calculateAging(p.startDate, p.closeDate, p.status);
        return {
            "ID": p.id,
            "Nombre del Proyecto": p.name,
            "Lean Responsable": p.leanResponsable,
            "Owner": p.owner,
            "Co-Líder": p.coLeader || "",
            "Área": p.area,
            "Categoría": p.category || "Kaizen",
            "Prioridad": p.priority,
            "Status": p.status,
            "Fecha Inicio": p.startDate,
            "Fecha Compromiso": p.targetDate,
            "Fecha Cierre": p.closeDate || "",
            "Aging": aging,
            "Estado Aging": getSemaphoreColor(aging),
            "% Avance": p.progress || 0,
            "Descripción": p.description || "",
            "Comentarios": p.comments || ""
        };
    });
    const wsListado = XLSX.utils.json_to_sheet(listadoCompleto);

    // Sheet 3: Resumen por Categoría
    const resumenCategoriaHoja3 = categories.map(cat => {
        const catProjs = state.projects.filter(p => (p.category || "").toLowerCase() === cat.toLowerCase());
        const total = catProjs.length;
        
        let progressSum = 0;
        let agingSum = 0;
        catProjs.forEach(p => {
            progressSum += (p.progress || 0);
            agingSum += calculateAging(p.startDate, p.closeDate, p.status);
        });
        
        const avgProgress = total > 0 ? Math.round(progressSum / total) : 0;
        const avgAging = total > 0 ? Math.round(agingSum / total) : 0;

        return {
            "Categoría": cat,
            "Cantidad de Proyectos": total,
            "Avance Promedio (%)": avgProgress,
            "Aging Promedio (Días)": avgAging
        };
    });
    const wsResumenCat = XLSX.utils.json_to_sheet(resumenCategoriaHoja3);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, wsExecutive, "Resumen Ejecutivo");
    XLSX.utils.book_append_sheet(workbook, wsListado, "Listado Completo");
    XLSX.utils.book_append_sheet(workbook, wsResumenCat, "Resumen por Categoría");
    XLSX.writeFile(workbook, "Lean_Projects_Tracker_Report.xlsx");
}

function downloadExcelTemplate() {
    const templateHeaders = [{
        "ID_OPCIONAL": "Deje vacío para auto-crear",
        "Nombre": "Nombre del Proyecto Ejemplo",
        "Lean Responsable": "Carlos Gómez",
        "Owner": "Laura Martínez",
        "Co-Líder": "José Flores",
        "Área": "Producción",
        "Categoría": "Kaizen",
        "Prioridad": "Alta",
        "Status": "En Proceso",
        "Fecha Inicio (AAAA-MM-DD)": "2026-08-01",
        "Fecha Compromiso (AAAA-MM-DD)": "2026-10-30",
        "Fecha Cierre (AAAA-MM-DD)": "",
        "Avance (%)": 30,
        "Descripción": "Breve descripción",
        "Comentarios": "Notas adicionales"
    }];
    
    const worksheet = XLSX.utils.json_to_sheet(templateHeaders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla Importación");
    XLSX.writeFile(workbook, "Plantilla_Importacion_Proyectos.xlsx");
}

function importProjectsFromExcel(file) {
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            
            if (json.length === 0) {
                alert("La plantilla de Excel está vacía.");
                return;
            }
            
            let projectsToUpsert = [];
            let lastId = state.projects.length > 0 ? Math.max(...state.projects.map(p => p.id)) : 100;
            
            json.forEach(row => {
                lastId++;
                const newProj = {
                    id: parseInt(row["ID_OPCIONAL"] || row["ID"]) || lastId,
                    name: row["Nombre"] || row["Nombre del Proyecto"] || "Proyecto Importado",
                    leanResponsable: row["Lean Responsable"] || "No Asignado",
                    owner: row["Owner"] || "No Asignado",
                    coLeader: row["Co-Líder"] || "",
                    area: row["Área"] || "General",
                    category: row["Categoría"] || "Kaizen",
                    priority: row["Prioridad"] || "Media",
                    status: row["Status"] || "Planeación",
                    startDate: row["Fecha Inicio (AAAA-MM-DD)"] || row["Fecha Inicio"] || "2026-08-06",
                    targetDate: row["Fecha Compromiso (AAAA-MM-DD)"] || row["Fecha Compromiso"] || "2026-08-06",
                    closeDate: row["Fecha Cierre (AAAA-MM-DD)"] || row["Fecha Cierre"] || "",
                    progress: parseInt(row["Avance (%)"] || row["Avance"]) || 0,
                    description: row["Descripción"] || row["Descripcion"] || "",
                    comments: row["Comentarios"] || "",
                    updated_at: new Date().toISOString()
                };
                projectsToUpsert.push(newProj);
            });
            
            if (!isSupabaseEnabled()) {
                projectsToUpsert.forEach(newP => {
                    const idx = state.projects.findIndex(p => p.id === newP.id);
                    if (idx >= 0) state.projects[idx] = newP;
                    else state.projects.unshift(newP);
                });
                localStorage.setItem('lean_tracker_projects', JSON.stringify(state.projects));
                alert(`Se importaron exitosamente ${projectsToUpsert.length} proyectos.`);
                switchView('projects');
                return;
            }

            const { error } = await window.supabaseClient
                .from('projects')
                .upsert(projectsToUpsert, { onConflict: 'id' });
                
            if (error) throw error;
            
            await fetchProjectsFromSupabase();
            alert(`Se importaron exitosamente ${projectsToUpsert.length} proyectos.`);
            switchView('projects');
            
        } catch (err) {
            console.error(err);
            showFriendlyError("Error al importar proyectos a la base de datos.");
            alert("Error al analizar o guardar el archivo de Excel.");
        }
    };
    reader.readAsArrayBuffer(file);
}

// 14. PDF DASHBOARD PRINTING
function exportDashboardToPDF() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById('view-dashboard');
    element.style.padding = "20px";
    
    html2canvas(element, {
        scale: 2,
        useCORS: true,
        background: '#0b0f19'
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgWidth = 297;
        const pageHeight = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save('Lean_Projects_Dashboard.pdf');
        element.style.padding = "";
    });
}

// ==========================================================================
// PLAN DE ACTIVIDADES & MÉTRICOS DE AHORRO CONTROLLER & ENGINES
// ==========================================================================

let planCharts = {};

async function fetchPlanActivitiesFromSupabase() {
    if (!isSupabaseEnabled()) {
        const local = localStorage.getItem('lean_tracker_plan_activities');
        if (local) {
            try {
                state.planActivities = JSON.parse(local);
            } catch (e) {
                state.planActivities = JSON.parse(JSON.stringify(MOCK_ACTIVITIES));
            }
        } else {
            state.planActivities = JSON.parse(JSON.stringify(MOCK_ACTIVITIES));
            localStorage.setItem('lean_tracker_plan_activities', JSON.stringify(state.planActivities));
        }
        return;
    }

    try {
        let { data, error } = await window.supabaseClient
            .from('plan_activities')
            .select('*')
            .order('id', { ascending: false });

        if (error && (error.code === 'PGRST301' || (error.message && (error.message.includes('relation') || error.message.includes('does not exist'))))) {
            const res2 = await window.supabaseClient
                .from('plan_actividades')
                .select('*')
                .order('id', { ascending: false });
            data = res2.data;
            error = res2.error;
        }

        if (error) {
            console.error("Error al consultar plan_activities en Supabase:", error);
            showToastNotification("Error de Supabase al consultar actividades: " + error.message, "error");
            if (!state.planActivities || state.planActivities.length === 0) {
                state.planActivities = JSON.parse(JSON.stringify(MOCK_ACTIVITIES));
            }
            return;
        }

        if (data && data.length > 0) {
            state.planActivities = data.map(item => {
                if (typeof item.savingsLines === 'string') {
                    try { item.savingsLines = JSON.parse(item.savingsLines); } catch (e) {}
                }
                if (typeof item.attachments === 'string') {
                    try { item.attachments = JSON.parse(item.attachments); } catch (e) {}
                }
                return item;
            });
        } else {
            console.log("Base de datos de actividades vacía. Cargando MOCK_ACTIVITIES en Supabase...");
            state.planActivities = JSON.parse(JSON.stringify(MOCK_ACTIVITIES));
            
            const { data: inserted, error: insertErr } = await window.supabaseClient
                .from('plan_activities')
                .insert(state.planActivities)
                .select();

            if (insertErr) {
                const { data: inserted2 } = await window.supabaseClient
                    .from('plan_actividades')
                    .insert(state.planActivities)
                    .select();
                if (inserted2 && inserted2.length > 0) state.planActivities = inserted2;
            } else if (inserted && inserted.length > 0) {
                state.planActivities = inserted;
            }
        }
    } catch (err) {
        console.error("Excepción al consultar actividades en Supabase:", err);
        showToastNotification("Error al conectar con Supabase (" + (err.message || err) + ")", "error");
        if (!state.planActivities || state.planActivities.length === 0) {
            state.planActivities = JSON.parse(JSON.stringify(MOCK_ACTIVITIES));
        }
    }
}

async function savePlanActivityToPersistence(item) {
    const existingIndex = state.planActivities.findIndex(b => b.id === item.id);
    if (existingIndex >= 0) {
        state.planActivities[existingIndex] = item;
    } else {
        state.planActivities.unshift(item);
    }

    if (!isSupabaseEnabled()) {
        localStorage.setItem('lean_tracker_plan_activities', JSON.stringify(state.planActivities));
        return;
    }

    try {
        let { error } = await window.supabaseClient
            .from('plan_activities')
            .upsert([item]);

        if (error && (error.code === 'PGRST301' || (error.message && (error.message.includes('relation') || error.message.includes('does not exist'))))) {
            const res2 = await window.supabaseClient
                .from('plan_actividades')
                .upsert([item]);
            error = res2.error;
        }

        if (error) {
            console.error("Error al guardar actividad en Supabase:", error);
            showToastNotification("Error de Supabase al guardar la actividad: " + error.message, "error");
        } else {
            showToastNotification("Actividad guardada en Supabase correctamente.", "success");
        }
    } catch (err) {
        console.error("Excepción al guardar actividad en Supabase:", err);
        showToastNotification("Error al conectar con Supabase: " + (err.message || err), "error");
    }
}

async function deletePlanActivityFromPersistence(id) {
    state.planActivities = state.planActivities.filter(b => b.id !== id);

    if (!isSupabaseEnabled()) {
        localStorage.setItem('lean_tracker_plan_activities', JSON.stringify(state.planActivities));
        return;
    }

    try {
        let { error } = await window.supabaseClient
            .from('plan_activities')
            .delete()
            .eq('id', id);

        if (error && (error.code === 'PGRST301' || (error.message && (error.message.includes('relation') || error.message.includes('does not exist'))))) {
            const res2 = await window.supabaseClient
                .from('plan_actividades')
                .delete()
                .eq('id', id);
            error = res2.error;
        }

        if (error) {
            console.error("Error al eliminar actividad en Supabase:", error);
            showToastNotification("Error de Supabase al eliminar actividad: " + error.message, "error");
        } else {
            showToastNotification("Actividad eliminada de Supabase.", "success");
        }
    } catch (err) {
        console.error("Excepción al eliminar actividad en Supabase:", err);
        showToastNotification("Error al conectar con Supabase: " + (err.message || err), "error");
    }
}

function populatePlanUserFilter() {
    const userSelect = document.getElementById('plan-filter-user');
    if (!userSelect) return;

    const currentVal = userSelect.value;
    const users = Array.from(new Set(state.planActivities.map(b => b.userName))).filter(Boolean).sort();

    userSelect.innerHTML = `<option value="">Todos los responsables</option>` +
        users.map(u => `<option value="${u}" ${u === currentVal ? 'selected' : ''}>${u}</option>`).join('');
}

function getFilteredPlanActivities() {
    const { search, user, status, priority, savingsType } = state.planFilters;
    const searchLower = (search || '').toLowerCase();

    return state.planActivities.filter(b => {
        if (user && b.userName !== user) return false;
        if (status && b.status !== status) return false;
        if (priority && b.priority !== priority) return false;
        if (savingsType && b.savingsType !== savingsType) return false;

        if (searchLower) {
            const actMatch = (b.activity || '').toLowerCase().includes(searchLower);
            const userMatch = (b.userName || '').toLowerCase().includes(searchLower);
            const commMatch = (b.comments || '').toLowerCase().includes(searchLower);
            const nextMatch = (b.nextAction || '').toLowerCase().includes(searchLower);
            if (!actMatch && !userMatch && !commMatch && !nextMatch) return false;
        }

        return true;
    });
}

function formatMinutes(min) {
    const m = parseInt(min || 0);
    const h = (m / 60).toFixed(1);
    return `${m} min (${h} hrs)`;
}

function formatCurrency(amount) {
    const num = parseFloat(amount || 0);
    return '$' + num.toLocaleString('en-US');
}

function renderPlanActividadesView() {
    populatePlanUserFilter();

    const filtered = getFilteredPlanActivities();
    const countEl = document.getElementById('plan-results-count');
    if (countEl) countEl.innerText = `Mostrando ${filtered.length} de ${state.planActivities.length} actividades`;

    if (state.planSubtab === 'plan') {
        renderPlanTable(filtered);
    } else if (state.planSubtab === 'metricos') {
        renderPlanMetricos(filtered);
    } else if (state.planSubtab === 'dashboard') {
        renderPlanDashboard(filtered);
    } else if (state.planSubtab === 'evidencias') {
        renderPlanEvidencias(filtered);
    }
}

function switchPlanSubtab(subtabName) {
    console.log("Pestaña seleccionada:", subtabName);
    state.planSubtab = subtabName;

    document.querySelectorAll('#view-plan-actividades .subtab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-subtab') === subtabName) {
            btn.classList.add('active');
        }
    });

    document.querySelectorAll('#view-plan-actividades .subtab-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });

    const activeContent = document.getElementById(`subtab-plan-${subtabName}`);
    if (activeContent) {
        activeContent.style.display = 'block';
        activeContent.classList.add('active');
    }

    renderPlanActividadesView();
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderPlanTable(activities) {
    const tbody = document.getElementById('plan-actividades-table-body');
    if (!tbody) return;

    if (activities.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" class="text-center" style="padding: 24px;">No se encontraron actividades con los filtros seleccionados.</td></tr>`;
        return;
    }

    tbody.innerHTML = activities.map(act => {
        const statusClass = act.status === 'Completado' ? 'completado' :
                           act.status === 'En Proceso' ? 'en-proceso' :
                           act.status === 'En Riesgo' ? 'en-riesgo' :
                           act.status === 'Bloqueado' ? 'bloqueado' : 'pendiente';

        const priorityClass = `priority-${(act.priority || 'media').toLowerCase()}`;
        const hasSavings = (act.hasSavings === 'si' || act.hasSavings === true);
        const lines = getActivitySavingsLines(act);

        let typeHtml = '';
        let targetVal = 0;
        let actualVal = 0;

        if (!hasSavings || lines.length === 0) {
            typeHtml = `<span class="badge" style="background: rgba(148,163,184,0.1); color: var(--text-muted); border: 1px dashed var(--border-color);">Sin Ahorro</span>`;
        } else {
            lines.forEach(l => {
                targetVal += Math.max(0, parseFloat(l.targetSavings || 0));
                actualVal += Math.max(0, parseFloat(l.actualSavings || 0));
            });
            const uniqueTypes = [...new Set(lines.map(l => l.savingsType || 'Hard'))];
            if (uniqueTypes.length === 1) {
                const sType = uniqueTypes[0];
                const badgeClass = `badge-${sType.toLowerCase().replace(/\s+/g, '')}`;
                typeHtml = `<span class="savings-badge ${badgeClass}">${sType}</span>`;
            } else {
                typeHtml = `<span class="savings-badge badge-hard" title="${uniqueTypes.join(', ')}">Múltiple (${uniqueTypes.length})</span>`;
            }
        }

        const compObj = hasSavings ? formatCategoryCompliance(actualVal, targetVal) : { text: "N/A" };
        const attCount = act.attachments ? act.attachments.length : 0;
        const actTitleEscaped = escapeHtml(act.activity);

        return `
            <tr>
                <td class="col-activity" title="${actTitleEscaped}">
                    <strong style="font-size: 14px; color: var(--text-main); white-space: normal; word-break: break-word; overflow-wrap: break-word; display: block;">${act.activity}</strong>
                </td>
                <td class="col-resp"><strong>${act.userName}</strong></td>
                <td class="col-savings-type">${typeHtml}</td>
                <td class="col-meta"><strong>${hasSavings ? formatCurrency(targetVal) : '<span style="color: var(--text-muted);">$0.00</span>'}</strong></td>
                <td class="col-real"><strong>${hasSavings ? `<span class="text-success">${formatCurrency(actualVal)}</span>` : '<span style="color: var(--text-muted);">$0.00</span>'}</strong></td>
                <td class="col-compliance">
                    <span class="badge" style="background: ${hasSavings ? 'var(--purple-sem)' : 'rgba(148,163,184,0.1)'}; color: ${hasSavings ? 'var(--purple-sem-text)' : 'var(--text-muted)'}; font-weight: 700;">
                        ${compObj.text}
                    </span>
                </td>
                <td class="col-status"><span class="badge-status-pill ${statusClass}">${act.status}</span></td>
                <td class="col-priority"><span class="badge-priority ${priorityClass}">${act.priority}</span></td>
                <td class="col-time"><strong>${formatMinutes(act.minutes)}</strong></td>
                <td class="col-evidences">
                    ${attCount > 0 ? `
                        <button class="btn btn-secondary btn-sm" onclick="openPlanActivityModal('${act.id}')" title="Ver evidencias">
                            <i class="fa-solid fa-paperclip text-blue"></i> ${attCount} archivo(s)
                        </button>
                    ` : '<span style="color: var(--text-muted); font-size: 12px;">Sin archivo</span>'}
                </td>
                <td class="col-actions" style="white-space: nowrap;">
                    <button class="btn btn-icon-only btn-secondary" onclick="openPlanActivityModal('${act.id}')" title="Editar Actividad"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn btn-icon-only btn-danger" onclick="confirmDeletePlanActivity('${act.id}')" title="Eliminar Actividad"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

// ==========================================
// MÉTRICOS DE AHORRO MANAGEMENT & PERSISTENCE
// ==========================================

const DEFAULT_RESPONSABLES = [
    {
        id: "resp-1",
        name: "Jose",
        area: "Producción",
        targetHard: 50000,
        targetSoft: 20000,
        targetOneTime: 20000,
        targetInventory: 10000,
        targetTotal: 100000
    },
    {
        id: "resp-2",
        name: "Montserrat",
        area: "Calidad",
        targetHard: 60000,
        targetSoft: 30000,
        targetOneTime: 10000,
        targetInventory: 20000,
        targetTotal: 120000
    },
    {
        id: "resp-3",
        name: "Misael",
        area: "Logística",
        targetHard: 40000,
        targetSoft: 15000,
        targetOneTime: 15000,
        targetInventory: 30000,
        targetTotal: 100000
    },
    {
        id: "resp-4",
        name: "Alan",
        area: "Ingeniería",
        targetHard: 45000,
        targetSoft: 25000,
        targetOneTime: 10000,
        targetInventory: 20000,
        targetTotal: 100000
    }
];

const DEFAULT_SAVINGS_RECORDS = [
    {
        id: "SAV-101",
        responsable: "Jose",
        savingsType: "Hard",
        description: "Optimización de tiempo de ciclo en ensamble de chasis",
        amount: 20000,
        date: "2026-09-15",
        evidence: "Validacion_Finanzas_Jose_Hard.pdf",
        comments: "Reducción directa de tiempos muertos comprobada."
    },
    {
        id: "SAV-102",
        responsable: "Jose",
        savingsType: "Soft",
        description: "Reducción de horas extras por kaizen de flujo de material",
        amount: 15000,
        date: "2026-09-20",
        evidence: "Reporte_HorasHombre_Q3.xlsx",
        comments: "Liberación de horas-hombre en turno nocturno."
    },
    {
        id: "SAV-103",
        responsable: "Jose",
        savingsType: "One Time",
        description: "Reutilización de herramental de troquelado reacondicionado",
        amount: 8000,
        date: "2026-09-28",
        evidence: "Factura_Reacondicionamiento.pdf",
        comments: "Evitamiento de compra de troquel nuevo."
    },
    {
        id: "SAV-104",
        responsable: "Jose",
        savingsType: "Inventory",
        description: "Disminución de stock de seguridad de componentes metálicos",
        amount: 2000,
        date: "2026-10-02",
        evidence: "Auditoria_Inventario_Oct.xlsx",
        comments: "Reducción en almacén central."
    },
    {
        id: "SAV-105",
        responsable: "Montserrat",
        savingsType: "Hard",
        description: "Reducción de scrap por inspección con visión artificial",
        amount: 35000,
        date: "2026-09-10",
        evidence: "Reporte_Scrap_Calidad.pdf",
        comments: "Disminución del 40% en rechazos de línea 2."
    },
    {
        id: "SAV-106",
        responsable: "Montserrat",
        savingsType: "Soft",
        description: "Estandarización de reportes de calidad y auditoría rápida",
        amount: 18000,
        date: "2026-09-25",
        evidence: "Matriz_Calidad_Digital.pptx",
        comments: "Ahorro en tiempos administrativos."
    },
    {
        id: "SAV-107",
        responsable: "Montserrat",
        savingsType: "Inventory",
        description: "Control Kanban en área de cuarentena de producto terminado",
        amount: 12000,
        date: "2026-10-05",
        evidence: "Kanban_Cuarentena.xlsx",
        comments: "Rotación acelerada de producto retenido."
    },
    {
        id: "SAV-108",
        responsable: "Misael",
        savingsType: "Hard",
        description: "Optimización de rutas de transporte interno y consolidación",
        amount: 25000,
        date: "2026-09-18",
        evidence: "Rutas_Transporte_Logistica.pdf",
        comments: "Reducción de fletes externos de urgencia."
    },
    {
        id: "SAV-109",
        responsable: "Misael",
        savingsType: "Inventory",
        description: "Reducción de contenedores WIP en pasillos de producción",
        amount: 22000,
        date: "2026-10-01",
        evidence: "Conteo_WIP_Logistica.xlsx",
        comments: "Liberación de espacio físico y capital de trabajo."
    },
    {
        id: "SAV-110",
        responsable: "Alan",
        savingsType: "Hard",
        description: "Modificación de herramental para eliminación de paros",
        amount: 30000,
        date: "2026-09-12",
        evidence: "Plano_Herramental_Modificado.pdf",
        comments: "Mayor disponibilidad de equipo en prensa 800T."
    },
    {
        id: "SAV-111",
        responsable: "Alan",
        savingsType: "Soft",
        description: "Digitalización de hojas de instrucción de trabajo interactiva",
        amount: 10000,
        date: "2026-09-29",
        evidence: "Instrucciones_Digitales.docx",
        comments: "Reducción en tiempos de entrenamiento de nuevos operadores."
    },
    {
        id: "SAV-112",
        responsable: "Alan",
        savingsType: "One Time",
        description: "Reparación interna de husillo de maquinado CNC",
        amount: 5000,
        date: "2026-10-04",
        evidence: "Orden_Trabajo_CNC.pdf",
        comments: "Ahorro vs contratar proveedor externo."
    }
];

function loadResponsablesFromStorage() {
    fetchResponsablesFromSupabase();
}

function saveResponsablesToStorage() {
    saveResponsablesToSupabase();
}

function loadSavingsRecordsFromStorage() {
    fetchSavingsRecordsFromSupabase();
}

function saveSavingsRecordsToStorage(item) {
    if (item) saveSavingsRecordToSupabase(item);
    else saveResponsablesToSupabase();
}

function updateTeamUsersDatalist() {
    const listEl = document.getElementById('team-users-list');
    if (listEl && state.responsables) {
        listEl.innerHTML = state.responsables.map(r => `<option value="${r.name}">`).join('');
    }
}

function getAllActualSavingsRecords() {
    const records = [...(state.savingsRecords || [])];
    if (state.planActivities) {
        state.planActivities.forEach(act => {
            if (act.hasSavings === 'si' && parseFloat(act.savingsAmount || 0) > 0) {
                const exists = records.some(r => r.id === act.id);
                if (!exists) {
                    records.push({
                        id: act.id,
                        responsable: act.userName || 'No asignado',
                        savingsType: act.savingsType || 'Hard',
                        description: act.activity,
                        amount: parseFloat(act.savingsAmount || 0),
                        date: act.validationDate || act.closeDate || act.targetDate || '',
                        evidence: act.attachments && act.attachments.length > 0 ? act.attachments[0].name : 'Actividad Plan',
                        comments: act.financialComment || act.comments || ''
                    });
                }
            }
        });
    }
    return records;
}

// ==========================================
// FORMULAS & AUDIT ENGINE FOR MÉTRICOS DE AHORRO
// ==========================================

function formatCategoryCompliance(actual, meta) {
    const numericMeta = parseFloat(meta || 0);
    const numericActual = parseFloat(actual || 0);

    if (isNaN(numericMeta) || numericMeta <= 0) {
        return { text: "Sin Meta", isNumeric: false, pct: 0 };
    }

    if (isNaN(numericActual)) {
        return { text: "0.0%", isNumeric: true, pct: 0 };
    }

    const pct = (numericActual / numericMeta) * 100;
    if (isNaN(pct) || !isFinite(pct)) {
        return { text: "0.0%", isNumeric: true, pct: 0 };
    }

    return { text: `${pct.toFixed(1)}%`, isNumeric: true, pct: parseFloat(pct.toFixed(1)) };
}

// Helper to extract savings lines array for an activity
function getActivitySavingsLines(a) {
    const hasSavings = (a.hasSavings === 'si' || a.hasSavings === true);
    if (!hasSavings) return [];

    if (Array.isArray(a.savingsLines) && a.savingsLines.length > 0) {
        return a.savingsLines;
    }

    // Fallback for single line activities
    const target = Math.max(0, parseFloat(a.targetSavings || a.savingsTarget || 0));
    const actual = Math.max(0, parseFloat(a.actualSavings || a.savingsAmount || 0));
    if (target > 0 || actual > 0) {
        return [{
            id: 'sl-legacy-' + (a.id || Math.random()),
            savingsType: a.savingsType || 'Hard',
            targetSavings: target,
            actualSavings: actual,
            validationDate: a.validationDate || '',
            financialComment: a.financialComment || ''
        }];
    }

    return [];
}

function getGlobalSavingsStats(selectedResp = 'all') {
    let activities = state.planActivities || [];
    if (selectedResp && selectedResp !== 'all') {
        activities = activities.filter(a => (a.userName || '').toLowerCase() === selectedResp.toLowerCase());
    }

    let metaHard = 0, metaSoft = 0, metaOneTime = 0, metaInventory = 0;
    let actualHard = 0, actualSoft = 0, actualOneTime = 0, actualInventory = 0;

    activities.forEach(a => {
        const lines = getActivitySavingsLines(a);
        lines.forEach(line => {
            const type = line.savingsType || 'Hard';
            const target = Math.max(0, parseFloat(line.targetSavings || 0));
            const actual = Math.max(0, parseFloat(line.actualSavings || 0));

            if (type === 'Hard') {
                metaHard += target;
                actualHard += actual;
            } else if (type === 'Soft') {
                metaSoft += target;
                actualSoft += actual;
            } else if (type === 'One Time') {
                metaOneTime += target;
                actualOneTime += actual;
            } else if (type === 'Inventory') {
                metaInventory += target;
                actualInventory += actual;
            }
        });
    });

    const metaTotal = metaHard + metaSoft + metaOneTime + metaInventory;
    const actualTotal = actualHard + actualSoft + actualOneTime + actualInventory;
    const complianceObj = formatCategoryCompliance(actualTotal, metaTotal);

    return {
        metaHard, metaSoft, metaOneTime, metaInventory, metaTotal,
        actualHard, actualSoft, actualOneTime, actualInventory, actualTotal,
        compliancePct: complianceObj.pct,
        complianceStr: complianceObj.text
    };
}

function getResponsablesMetricsFromActivities() {
    const map = {};

    (state.planActivities || []).forEach(a => {
        const respName = (a.userName || 'Sin Asignar').trim();
        if (!map[respName]) {
            map[respName] = {
                id: 'resp-' + respName.toLowerCase().replace(/\s+/g, '-'),
                name: respName,
                area: 'Plan de Actividades',
                targetHard: 0, targetSoft: 0, targetOneTime: 0, targetInventory: 0, targetTotal: 0,
                actualHard: 0, actualSoft: 0, actualOneTime: 0, actualInventory: 0, actualTotal: 0,
                activitiesCount: 0
            };
        }

        const item = map[respName];
        item.activitiesCount++;

        const lines = getActivitySavingsLines(a);
        lines.forEach(line => {
            const type = line.savingsType || 'Hard';
            const target = Math.max(0, parseFloat(line.targetSavings || 0));
            const actual = Math.max(0, parseFloat(line.actualSavings || 0));

            if (type === 'Hard') {
                item.targetHard += target;
                item.actualHard += actual;
            } else if (type === 'Soft') {
                item.targetSoft += target;
                item.actualSoft += actual;
            } else if (type === 'One Time') {
                item.targetOneTime += target;
                item.actualOneTime += actual;
            } else if (type === 'Inventory') {
                item.targetInventory += target;
                item.actualInventory += actual;
            }

            item.targetTotal += target;
            item.actualTotal += actual;
        });
    });

    const result = Object.values(map).map(r => {
        const compTotalObj = formatCategoryCompliance(r.actualTotal, r.targetTotal);
        const compHardObj = formatCategoryCompliance(r.actualHard, r.targetHard);
        const compSoftObj = formatCategoryCompliance(r.actualSoft, r.targetSoft);
        const compOneTimeObj = formatCategoryCompliance(r.actualOneTime, r.targetOneTime);
        const compInventoryObj = formatCategoryCompliance(r.actualInventory, r.targetInventory);

        return {
            ...r,
            complianceTotal: compTotalObj.pct,
            complianceTotalStr: compTotalObj.text,
            complianceHardStr: compHardObj.text,
            complianceSoftStr: compSoftObj.text,
            complianceOneTimeStr: compOneTimeObj.text,
            complianceInventoryStr: compInventoryObj.text
        };
    });

    return result;
}

async function fetchResponsablesFromSupabase() {
    if (!isSupabaseEnabled()) {
        const local = localStorage.getItem('lean_tracker_responsables');
        if (local) {
            try {
                state.responsables = JSON.parse(local);
            } catch (e) {
                state.responsables = getResponsablesMetricsFromActivities();
            }
        } else {
            state.responsables = getResponsablesMetricsFromActivities();
            localStorage.setItem('lean_tracker_responsables', JSON.stringify(state.responsables));
        }
        updateTeamUsersDatalist();
        return;
    }

    try {
        const { data, error } = await window.supabaseClient
            .from('responsables')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error("Error al consultar responsables en Supabase:", error);
            showToastNotification("Error al cargar tabla 'responsables': " + error.message, "error");
            state.responsables = getResponsablesMetricsFromActivities();
        } else if (data && data.length > 0) {
            state.responsables = data;
        } else {
            console.log("Tabla 'responsables' vacía en Supabase. Seeding...");
            const computed = getResponsablesMetricsFromActivities();
            state.responsables = computed;

            const { data: inserted, error: insertErr } = await window.supabaseClient
                .from('responsables')
                .insert(computed)
                .select();

            if (!insertErr && inserted && inserted.length > 0) {
                state.responsables = inserted;
            }
        }
    } catch (err) {
        console.error("Excepción al cargar responsables de Supabase:", err);
        state.responsables = getResponsablesMetricsFromActivities();
    }
    updateTeamUsersDatalist();
}

async function saveResponsablesToSupabase() {
    updateTeamUsersDatalist();
    if (!isSupabaseEnabled()) {
        localStorage.setItem('lean_tracker_responsables', JSON.stringify(state.responsables));
        return;
    }
    try {
        const { error } = await window.supabaseClient
            .from('responsables')
            .upsert(state.responsables);

        if (error) {
            console.error("Error al guardar responsables en Supabase:", error);
            showToastNotification("Error al guardar responsables en Supabase: " + error.message, "error");
        }
    } catch (err) {
        console.error("Excepción al guardar responsables:", err);
    }
}

async function deleteResponsableFromSupabase(id) {
    state.responsables = state.responsables.filter(r => r.id !== id);
    updateTeamUsersDatalist();

    if (!isSupabaseEnabled()) {
        localStorage.setItem('lean_tracker_responsables', JSON.stringify(state.responsables));
        return;
    }

    try {
        const { error } = await window.supabaseClient
            .from('responsables')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error al eliminar responsable en Supabase:", error);
            showToastNotification("Error al eliminar responsable en Supabase: " + error.message, "error");
        } else {
            showToastNotification("Responsable eliminado en Supabase.", "success");
        }
    } catch (err) {
        console.error("Excepción al eliminar responsable:", err);
    }
}

async function fetchSavingsRecordsFromSupabase() {
    if (!isSupabaseEnabled()) {
        const local = localStorage.getItem('lean_tracker_savings_records');
        if (local) {
            try {
                state.savingsRecords = JSON.parse(local);
            } catch (e) {
                state.savingsRecords = JSON.parse(JSON.stringify(DEFAULT_SAVINGS_RECORDS));
            }
        } else {
            state.savingsRecords = JSON.parse(JSON.stringify(DEFAULT_SAVINGS_RECORDS));
            localStorage.setItem('lean_tracker_savings_records', JSON.stringify(state.savingsRecords));
        }
        return;
    }

    try {
        const { data, error } = await window.supabaseClient
            .from('savings_records')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.error("Error al consultar savings_records en Supabase:", error);
            showToastNotification("Error al consultar savings_records en Supabase: " + error.message, "error");
            state.savingsRecords = JSON.parse(JSON.stringify(DEFAULT_SAVINGS_RECORDS));
        } else if (data && data.length > 0) {
            state.savingsRecords = data;
        } else {
            console.log("Tabla 'savings_records' vacía en Supabase. Seeding...");
            state.savingsRecords = JSON.parse(JSON.stringify(DEFAULT_SAVINGS_RECORDS));

            const { data: inserted, error: insertErr } = await window.supabaseClient
                .from('savings_records')
                .insert(state.savingsRecords)
                .select();

            if (!insertErr && inserted && inserted.length > 0) {
                state.savingsRecords = inserted;
            }
        }
    } catch (err) {
        console.error("Excepción al cargar registros de ahorro:", err);
        state.savingsRecords = JSON.parse(JSON.stringify(DEFAULT_SAVINGS_RECORDS));
    }
}

async function saveSavingsRecordToSupabase(item) {
    const idx = state.savingsRecords.findIndex(s => s.id === item.id);
    if (idx >= 0) {
        state.savingsRecords[idx] = item;
    } else {
        state.savingsRecords.unshift(item);
    }

    if (!isSupabaseEnabled()) {
        localStorage.setItem('lean_tracker_savings_records', JSON.stringify(state.savingsRecords));
        return;
    }

    try {
        const { error } = await window.supabaseClient
            .from('savings_records')
            .upsert([item]);

        if (error) {
            console.error("Error al guardar registro de ahorro en Supabase:", error);
            showToastNotification("Error al guardar registro de ahorro en Supabase: " + error.message, "error");
        } else {
            showToastNotification("Registro de ahorro guardado en Supabase.", "success");
        }
    } catch (err) {
        console.error("Excepción al guardar registro de ahorro:", err);
    }
}

async function deleteSavingsRecordFromSupabase(id) {
    state.savingsRecords = state.savingsRecords.filter(s => s.id !== id);

    if (!isSupabaseEnabled()) {
        localStorage.setItem('lean_tracker_savings_records', JSON.stringify(state.savingsRecords));
        return;
    }

    try {
        const { error } = await window.supabaseClient
            .from('savings_records')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error al eliminar registro de ahorro en Supabase:", error);
            showToastNotification("Error al eliminar registro de ahorro en Supabase: " + error.message, "error");
        } else {
            showToastNotification("Registro de ahorro eliminado en Supabase.", "success");
        }
    } catch (err) {
        console.error("Excepción al eliminar registro de ahorro:", err);
    }
}

function loadResponsablesFromStorage() {
    fetchResponsablesFromSupabase();
}

function saveResponsablesToStorage() {
    saveResponsablesToSupabase();
}

function loadSavingsRecordsFromStorage() {
    fetchSavingsRecordsFromSupabase();
}

function saveSavingsRecordsToStorage(item) {
    if (item) saveSavingsRecordToSupabase(item);
    else saveResponsablesToSupabase();
}

function updateTeamUsersDatalist() {
    const listEl = document.getElementById('team-users-list');
    const users = Array.from(new Set((state.planActivities || []).map(a => a.userName))).filter(Boolean).sort();
    if (listEl) {
        listEl.innerHTML = users.map(u => `<option value="${u}">`).join('');
    }
}

function renderPlanMetricos(activities) {
    const respMetrics = getResponsablesMetricsFromActivities();

    // 1. Populate Person Selector
    const selector = document.getElementById('savings-person-selector');
    if (selector) {
        const currentSelected = state.savingsSelectedResponsable || 'all';
        selector.innerHTML = `<option value="all" ${currentSelected === 'all' ? 'selected' : ''}>[ Todos ] - Vista Consolidada Global</option>` +
            respMetrics.map(r => `<option value="${r.name}" ${currentSelected.toLowerCase() === r.name.toLowerCase() ? 'selected' : ''}>${r.name} (${r.activitiesCount} actividades)</option>`).join('');
    }

    const selectedRespName = state.savingsSelectedResponsable || 'all';
    const globalStats = getGlobalSavingsStats(selectedRespName);

    let bannerTitle = "TODOS LOS RESPONSABLES";
    let bannerSubtitle = "Área: Consolidado General del Plan de Actividades";

    if (selectedRespName !== 'all') {
        const resp = respMetrics.find(r => r.name.toLowerCase() === selectedRespName.toLowerCase());
        if (resp) {
            bannerTitle = resp.name.toUpperCase();
            bannerSubtitle = `Actividades registradas en el Plan: ${resp.activitiesCount}`;
        }
    }

    // 2. Update Banner
    const bannerNameEl = document.getElementById('savings-selected-person-name');
    if (bannerNameEl) bannerNameEl.innerText = bannerTitle;

    const bannerAreaEl = document.getElementById('savings-selected-person-area');
    if (bannerAreaEl) bannerAreaEl.innerText = bannerSubtitle;

    const bannerMetaEl = document.getElementById('banner-meta-total');
    if (bannerMetaEl) bannerMetaEl.innerText = formatCurrency(globalStats.metaTotal);

    const bannerActualEl = document.getElementById('banner-actual-total');
    if (bannerActualEl) bannerActualEl.innerText = formatCurrency(globalStats.actualTotal);

    const bannerPctEl = document.getElementById('banner-compliance-pct');
    if (bannerPctEl) bannerPctEl.innerText = globalStats.complianceStr;

    // 3. Update KPI Cards
    const kpiTargetEl = document.getElementById('metric-kpi-target-total');
    if (kpiTargetEl) kpiTargetEl.innerText = formatCurrency(globalStats.metaTotal);

    const kpiActualEl = document.getElementById('metric-kpi-actual-total');
    if (kpiActualEl) kpiActualEl.innerText = formatCurrency(globalStats.actualTotal);

    const kpiComplianceEl = document.getElementById('metric-kpi-compliance-total');
    if (kpiComplianceEl) kpiComplianceEl.innerText = globalStats.complianceStr;

    // 4. Update Category Breakdown Cards
    const compHardObj = formatCategoryCompliance(globalStats.actualHard, globalStats.metaHard);
    const compSoftObj = formatCategoryCompliance(globalStats.actualSoft, globalStats.metaSoft);
    const compOneTimeObj = formatCategoryCompliance(globalStats.actualOneTime, globalStats.metaOneTime);
    const compInventoryObj = formatCategoryCompliance(globalStats.actualInventory, globalStats.metaInventory);

    const updateCard = (prefix, meta, actual, compObj) => {
        const metaEl = document.getElementById(`${prefix}-meta-val`);
        if (metaEl) metaEl.innerText = formatCurrency(meta);

        const actualEl = document.getElementById(`${prefix}-actual-val`);
        if (actualEl) actualEl.innerText = formatCurrency(actual);

        const pctEl = document.getElementById(`${prefix}-pct-val`);
        if (pctEl) {
            pctEl.innerText = compObj.text;
            pctEl.style.color = "var(--purple-sem-text)";
        }

        const barEl = document.getElementById(`${prefix}-progress-bar`);
        if (barEl) {
            barEl.style.width = `${Math.min(compObj.pct, 100)}%`;
        }
    };

    updateCard('hard', globalStats.metaHard, globalStats.actualHard, compHardObj);
    updateCard('soft', globalStats.metaSoft, globalStats.actualSoft, compSoftObj);
    updateCard('onetime', globalStats.metaOneTime, globalStats.actualOneTime, compOneTimeObj);
    updateCard('inventory', globalStats.metaInventory, globalStats.actualInventory, compInventoryObj);

    // 5. Render Ranking de Responsables
    renderRankingResponsables(respMetrics);

    // 6. Render Consolidated Summary Table
    renderConsolidatedSavingsTable(respMetrics);

    // 7. Render Plan Activities Detail Table
    renderPlanActivitiesDetailTable(selectedRespName);

    // 8. Render Savings Charts
    renderPlanSavingsChartsDynamic(selectedRespName, respMetrics, globalStats);
}

function renderRankingResponsables(respMetrics) {
    const grid = document.getElementById('ranking-responsables-grid');
    if (!grid) return;

    let ranked = [...respMetrics].sort((a, b) => b.actualTotal - a.actualTotal);

    if (ranked.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; padding: 20px; text-align: center; color: var(--text-muted);">No hay actividades con responsables registrados.</div>`;
        return;
    }

    grid.innerHTML = ranked.map((r, index) => {
        const pos = index + 1;
        const rankClass = pos === 1 ? 'rank-1' : pos === 2 ? 'rank-2' : pos === 3 ? 'rank-3' : 'rank-other';
        const badgeClass = pos === 1 ? 'rank-1' : pos === 2 ? 'rank-2' : pos === 3 ? 'rank-3' : 'rank-other';

        return `
            <div class="ranking-card ${rankClass}">
                <div class="ranking-card-header">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="ranking-badge ${badgeClass}">${pos}</div>
                        <div>
                            <div class="ranking-user-name">${r.name}</div>
                            <div style="font-size: 11px; color: var(--text-muted);">${r.activitiesCount} actividad(es) en plan</div>
                        </div>
                    </div>
                    <span class="badge" style="background: var(--purple-sem); color: var(--purple-sem-text); font-weight: 800; font-size: 13px;">
                        ${r.complianceTotalStr}
                    </span>
                </div>
                <div class="ranking-metrics-grid">
                    <div class="ranking-metric-item">
                        <label>Meta Esperada</label>
                        <span>${formatCurrency(r.targetTotal)}</span>
                    </div>
                    <div class="ranking-metric-item">
                        <label>Ahorro Real</label>
                        <span class="text-success">${formatCurrency(r.actualTotal)}</span>
                    </div>
                    <div class="ranking-metric-item">
                        <label>Cumplimiento</label>
                        <span class="text-purple">${r.complianceTotalStr}</span>
                    </div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill bg-success" style="width: ${Math.min(r.complianceTotal, 100)}%;"></div>
                </div>
            </div>
        `;
    }).join('');
}

function renderConsolidatedSavingsTable(respMetrics) {
    const tbody = document.getElementById('table-consolidated-savings-body');
    if (!tbody) return;

    let statsList = [...respMetrics];
    const sortBy = state.savingsSortBy || 'savings_desc';

    if (sortBy === 'savings_desc') {
        statsList.sort((a, b) => b.actualTotal - a.actualTotal);
    } else if (sortBy === 'compliance_desc') {
        statsList.sort((a, b) => b.complianceTotal - a.complianceTotal);
    } else if (sortBy === 'meta_desc') {
        statsList.sort((a, b) => b.targetTotal - a.targetTotal);
    } else if (sortBy === 'name_asc') {
        statsList.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (statsList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center" style="padding: 20px;">No hay datos de responsables en el Plan de Actividades.</td></tr>`;
        return;
    }

    const rankingMap = {};
    [...respMetrics].sort((a, b) => b.actualTotal - a.actualTotal).forEach((r, idx) => {
        rankingMap[r.name] = idx + 1;
    });

    tbody.innerHTML = statsList.map(s => {
        const rankPos = rankingMap[s.name] || '-';
        const rankBadge = rankPos === 1 ? '🥇 #1' : rankPos === 2 ? '🥈 #2' : rankPos === 3 ? '🥉 #3' : `#${rankPos}`;

        return `
            <tr style="${(state.savingsSelectedResponsable || '').toLowerCase() === s.name.toLowerCase() ? 'background-color: var(--blue-sem);' : ''}">
                <td><strong style="font-weight: 800; color: var(--primary-light);">${rankBadge}</strong></td>
                <td><strong style="font-size: 14px; color: var(--text-main);">${s.name}</strong></td>
                <td><strong>${formatCurrency(s.targetTotal)}</strong></td>
                <td><strong class="text-success">${formatCurrency(s.actualTotal)}</strong></td>
                <td>
                    <span class="badge" style="background: var(--purple-sem); color: var(--purple-sem-text); font-weight: 700;">
                        ${s.complianceTotalStr}
                    </span>
                </td>
                <td style="font-size: 12px;">
                    ${formatCurrency(s.actualHard)} / <span style="color: var(--text-muted);">${formatCurrency(s.targetHard)}</span> <span style="font-size: 11px; font-weight: 600;">(${s.complianceHardStr})</span>
                </td>
                <td style="font-size: 12px;">
                    ${formatCurrency(s.actualSoft)} / <span style="color: var(--text-muted);">${formatCurrency(s.targetSoft)}</span> <span style="font-size: 11px; font-weight: 600;">(${s.complianceSoftStr})</span>
                </td>
                <td style="font-size: 12px;">
                    ${formatCurrency(s.actualOneTime)} / <span style="color: var(--text-muted);">${formatCurrency(s.targetOneTime)}</span> <span style="font-size: 11px; font-weight: 600;">(${s.complianceOneTimeStr})</span>
                </td>
                <td style="font-size: 12px;">
                    ${formatCurrency(s.actualInventory)} / <span style="color: var(--text-muted);">${formatCurrency(s.targetInventory)}</span> <span style="font-size: 11px; font-weight: 600;">(${s.complianceInventoryStr})</span>
                </td>
            </tr>
        `;
    }).join('');
}

function renderPlanActivitiesDetailTable(selectedResp = 'all') {
    const tbody = document.getElementById('table-real-savings-body');
    if (!tbody) return;

    let activities = state.planActivities || [];
    if (selectedResp !== 'all') {
        activities = activities.filter(a => (a.userName || '').toLowerCase() === selectedResp.toLowerCase());
    }

    const rows = [];
    activities.forEach(act => {
        const lines = getActivitySavingsLines(act);
        if (lines.length === 0) return;

        lines.forEach((line, idx) => {
            const sType = line.savingsType || 'Hard';
            const badgeClass = `badge-${sType.toLowerCase().replace(/\s+/g, '')}`;
            const targetVal = Math.max(0, parseFloat(line.targetSavings || 0));
            const actualVal = Math.max(0, parseFloat(line.actualSavings || 0));
            const compObj = formatCategoryCompliance(actualVal, targetVal);

            rows.push(`
                <tr>
                    <td style="max-width: 250px;">
                        <strong style="font-size: 13px;">${act.activity}</strong>
                        ${lines.length > 1 ? `<span class="badge" style="margin-left: 6px; font-size: 10px; background: rgba(99,102,241,0.15); color: var(--primary);">Línea #${idx + 1}</span>` : ''}
                    </td>
                    <td><strong>${act.userName}</strong></td>
                    <td><span class="savings-badge ${badgeClass}">${sType}</span></td>
                    <td><strong>${formatCurrency(targetVal)}</strong></td>
                    <td><strong class="text-success" style="font-size: 14px;">${formatCurrency(actualVal)}</strong></td>
                    <td>
                        <span class="badge" style="background: var(--purple-sem); color: var(--purple-sem-text); font-weight: 700;">
                            ${compObj.text}
                        </span>
                    </td>
                    <td style="font-size: 12px;">
                        ${line.validationDate ? `<div><i class="fa-solid fa-calendar-check text-green"></i> ${line.validationDate}</div>` : ''}
                        ${line.financialComment ? `<div style="font-style: italic; font-size: 11px; color: var(--text-muted); margin-top: 2px;">"${line.financialComment}"</div>` : (!line.validationDate ? '-' : '')}
                    </td>
                    <td style="white-space: nowrap;">
                        <button class="btn btn-secondary btn-sm" onclick="openPlanActivityModal('${act.id}')" title="Editar Actividad">
                            <i class="fa-solid fa-pen-to-square"></i> Editar
                        </button>
                    </td>
                </tr>
            `);
        });
    });

    if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding: 20px;">No hay líneas de ahorro registradas para ${selectedResp === 'all' ? 'los responsables' : selectedResp}.</td></tr>`;
        return;
    }

    tbody.innerHTML = rows.join('');
}

function renderPlanSavingsChartsDynamic(selectedResp, respMetrics, globalStats) {
    if (typeof Chart === 'undefined') return;

    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#f1f5f9' : '#334155';
    const gridColor = isDark ? '#24324d' : '#e2e8f0';

    const types = ['Hard', 'Soft', 'One Time', 'Inventory'];
    const metas = [globalStats.metaHard, globalStats.metaSoft, globalStats.metaOneTime, globalStats.metaInventory];
    const actuals = [globalStats.actualHard, globalStats.actualSoft, globalStats.actualOneTime, globalStats.actualInventory];

    // Chart 1: Compare Meta vs Actual by Category
    const ctxCompare = document.getElementById('chart-plan-savings-compare')?.getContext('2d');
    if (ctxCompare) {
        if (planCharts.compare) planCharts.compare.destroy();
        planCharts.compare = new Chart(ctxCompare, {
            type: 'bar',
            data: {
                labels: types,
                datasets: [
                    { label: 'Meta Esperada ($)', data: metas, backgroundColor: 'rgba(37, 99, 235, 0.4)', borderColor: '#2563eb', borderWidth: 1 },
                    { label: 'Ahorro Real ($)', data: actuals, backgroundColor: '#10b981', borderWidth: 1 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: textColor } } },
                scales: {
                    x: { ticks: { color: textColor }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });
    }

    // Chart 2: Distribution by Savings Type
    const ctxDist = document.getElementById('chart-plan-savings-dist')?.getContext('2d');
    if (ctxDist) {
        if (planCharts.dist) planCharts.dist.destroy();
        planCharts.dist = new Chart(ctxDist, {
            type: 'doughnut',
            data: {
                labels: types,
                datasets: [{
                    data: actuals,
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#a855f7']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: textColor } } }
            }
        });
    }

    // Chart 3: Compare Actual vs Meta per Responsable
    const ctxTrend = document.getElementById('chart-plan-savings-trend')?.getContext('2d');
    if (ctxTrend) {
        if (planCharts.trend) planCharts.trend.destroy();

        const labels = respMetrics.map(s => s.name);
        const metaValues = respMetrics.map(s => s.targetTotal);
        const actualValues = respMetrics.map(s => s.actualTotal);

        planCharts.trend = new Chart(ctxTrend, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Meta Esperada Total ($)', data: metaValues, backgroundColor: 'rgba(59, 130, 246, 0.5)', borderColor: '#3b82f6', borderWidth: 1 },
                    { label: 'Ahorro Real Total ($)', data: actualValues, backgroundColor: '#10b981', borderWidth: 1 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: textColor } } },
                scales: {
                    x: { ticks: { color: textColor }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });
    }
}

function openEditMetaModal(respId = null) {
    const modal = document.getElementById('modal-edit-meta');
    const form = document.getElementById('form-edit-meta');
    const titleEl = document.getElementById('modal-edit-meta-title');

    form.reset();

    let targetResp = null;
    if (respId) {
        targetResp = state.responsables.find(r => r.id === respId);
    } else if (state.savingsSelectedResponsable && state.savingsSelectedResponsable !== 'all') {
        targetResp = state.responsables.find(r => r.name.toLowerCase() === state.savingsSelectedResponsable.toLowerCase());
    }

    if (!targetResp && state.responsables.length > 0) {
        targetResp = state.responsables[0];
    }

    if (targetResp) {
        titleEl.innerText = `✏ Editar Meta de Ahorro: ${targetResp.name}`;
        document.getElementById('edit-meta-resp-id').value = targetResp.id;
        document.getElementById('edit-meta-resp-name').value = targetResp.name;
        document.getElementById('edit-meta-resp-area').value = targetResp.area || 'General';
        document.getElementById('edit-meta-hard').value = targetResp.targetHard || 0;
        document.getElementById('edit-meta-soft').value = targetResp.targetSoft || 0;
        document.getElementById('edit-meta-onetime').value = targetResp.targetOneTime || 0;
        document.getElementById('edit-meta-inventory').value = targetResp.targetInventory || 0;
        document.getElementById('edit-meta-total').value = targetResp.targetTotal || (targetResp.targetHard + targetResp.targetSoft + targetResp.targetOneTime + targetResp.targetInventory);
    } else {
        titleEl.innerText = `✏ Crear / Editar Meta de Ahorro`;
        document.getElementById('edit-meta-resp-id').value = "";
        document.getElementById('edit-meta-resp-name').value = "";
        document.getElementById('edit-meta-resp-area').value = "";
        document.getElementById('edit-meta-hard').value = 0;
        document.getElementById('edit-meta-soft').value = 0;
        document.getElementById('edit-meta-onetime').value = 0;
        document.getElementById('edit-meta-inventory').value = 0;
        document.getElementById('edit-meta-total').value = 0;
    }

    modal.classList.add('show');
}

function autoCalcEditMetaTotal() {
    const hard = parseFloat(document.getElementById('edit-meta-hard').value) || 0;
    const soft = parseFloat(document.getElementById('edit-meta-soft').value) || 0;
    const onetime = parseFloat(document.getElementById('edit-meta-onetime').value) || 0;
    const inventory = parseFloat(document.getElementById('edit-meta-inventory').value) || 0;
    document.getElementById('edit-meta-total').value = hard + soft + onetime + inventory;
}

function openCatalogModal() {
    const modal = document.getElementById('modal-responsables-catalog');
    const tbody = document.getElementById('catalog-responsables-body');

    if (tbody) {
        tbody.innerHTML = state.responsables.map(r => `
            <tr>
                <td><strong>${r.name}</strong></td>
                <td>${r.area || 'General'}</td>
                <td>${formatCurrency(r.targetHard)}</td>
                <td>${formatCurrency(r.targetSoft)}</td>
                <td>${formatCurrency(r.targetOneTime)}</td>
                <td>${formatCurrency(r.targetInventory)}</td>
                <td><strong>${formatCurrency(r.targetTotal)}</strong></td>
                <td style="white-space: nowrap;">
                    <button class="btn btn-secondary btn-sm" onclick="document.getElementById('modal-responsables-catalog').classList.remove('show'); openEditMetaModal('${r.id}');">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteResponsable('${r.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    modal.classList.add('show');
}

function openRealSavingModal(savingId = null) {
    const modal = document.getElementById('modal-real-saving');
    const form = document.getElementById('form-real-saving');
    const titleEl = document.getElementById('modal-real-saving-title');
    const respSelect = document.getElementById('form-saving-resp');

    form.reset();

    if (respSelect) {
        respSelect.innerHTML = state.responsables.map(r => `<option value="${r.name}">${r.name} (${r.area || 'General'})</option>`).join('');
    }

    if (savingId) {
        const item = state.savingsRecords.find(s => s.id === savingId);
        if (item) {
            titleEl.innerText = "✏ Editar Ahorro Real";
            document.getElementById('form-saving-id').value = item.id;
            if (respSelect) respSelect.value = item.responsable;
            document.getElementById('form-saving-type').value = item.savingsType;
            document.getElementById('form-saving-description').value = item.description;
            document.getElementById('form-saving-amount').value = item.amount;
            document.getElementById('form-saving-date').value = item.date || new Date().toISOString().split('T')[0];
            document.getElementById('form-saving-evidence').value = item.evidence || '';
            document.getElementById('form-saving-comments').value = item.comments || '';
        }
    } else {
        titleEl.innerText = "💵 Registrar Ahorro Real";
        document.getElementById('form-saving-id').value = "";
        if (state.savingsSelectedResponsable && state.savingsSelectedResponsable !== 'all' && respSelect) {
            respSelect.value = state.savingsSelectedResponsable;
        }
        document.getElementById('form-saving-date').value = new Date().toISOString().split('T')[0];
    }

    modal.classList.add('show');
}

function deleteResponsable(respId) {
    const resp = state.responsables.find(r => r.id === respId);
    if (!resp) return;

    if (confirm(`¿Está seguro de eliminar a "${resp.name}" del catálogo de responsables?`)) {
        state.responsables = state.responsables.filter(r => r.id !== respId);
        saveResponsablesToStorage();
        if ((state.savingsSelectedResponsable || '').toLowerCase() === resp.name.toLowerCase()) {
            state.savingsSelectedResponsable = 'all';
        }
        const catalogModal = document.getElementById('modal-responsables-catalog');
        if (catalogModal && catalogModal.classList.contains('show')) {
            openCatalogModal();
        }
        renderPlanActividadesView();
    }
}

function deleteRealSaving(savingId) {
    if (confirm("¿Está seguro de eliminar este registro de ahorro real?")) {
        state.savingsRecords = state.savingsRecords.filter(s => s.id !== savingId);
        saveSavingsRecordsToStorage();
        renderPlanActividadesView();
    }
}

function setupSavingsEvents() {
    const personSelector = document.getElementById('savings-person-selector');
    if (personSelector) {
        personSelector.addEventListener('change', (e) => {
            state.savingsSelectedResponsable = e.target.value;
            renderPlanActividadesView();
        });
    }

    const sortSelect = document.getElementById('sort-responsables-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.savingsSortBy = e.target.value;
            renderPlanActividadesView();
        });
    }

    const btnEditCurrentMeta = document.getElementById('btn-edit-current-meta');
    if (btnEditCurrentMeta) {
        btnEditCurrentMeta.addEventListener('click', () => openEditMetaModal());
    }

    const btnManageResp = document.getElementById('btn-manage-responsables');
    if (btnManageResp) {
        btnManageResp.addEventListener('click', () => openCatalogModal());
    }

    const btnNewRealSaving = document.getElementById('btn-new-real-saving');
    if (btnNewRealSaving) {
        btnNewRealSaving.addEventListener('click', () => openRealSavingModal());
    }

    const btnAddRealSavingTable = document.getElementById('btn-add-real-saving-table');
    if (btnAddRealSavingTable) {
        btnAddRealSavingTable.addEventListener('click', () => openRealSavingModal());
    }

    const btnAddNewCatalog = document.getElementById('btn-add-new-responsable-catalog');
    if (btnAddNewCatalog) {
        btnAddNewCatalog.addEventListener('click', () => {
            document.getElementById('modal-responsables-catalog').classList.remove('show');
            openEditMetaModal(null);
        });
    }

    const btnCloseEditMeta = document.getElementById('btn-close-edit-meta-modal');
    if (btnCloseEditMeta) {
        btnCloseEditMeta.addEventListener('click', () => document.getElementById('modal-edit-meta').classList.remove('show'));
    }
    const btnCancelEditMeta = document.getElementById('btn-cancel-edit-meta-modal');
    if (btnCancelEditMeta) {
        btnCancelEditMeta.addEventListener('click', () => document.getElementById('modal-edit-meta').classList.remove('show'));
    }

    const btnCloseCatalog = document.getElementById('btn-close-catalog-modal');
    if (btnCloseCatalog) {
        btnCloseCatalog.addEventListener('click', () => document.getElementById('modal-responsables-catalog').classList.remove('show'));
    }
    const btnCloseCatalogFooter = document.getElementById('btn-close-catalog-modal-footer');
    if (btnCloseCatalogFooter) {
        btnCloseCatalogFooter.addEventListener('click', () => document.getElementById('modal-responsables-catalog').classList.remove('show'));
    }

    const btnCloseRealSaving = document.getElementById('btn-close-real-saving-modal');
    if (btnCloseRealSaving) {
        btnCloseRealSaving.addEventListener('click', () => document.getElementById('modal-real-saving').classList.remove('show'));
    }
    const btnCancelRealSaving = document.getElementById('btn-cancel-real-saving-modal');
    if (btnCancelRealSaving) {
        btnCancelRealSaving.addEventListener('click', () => document.getElementById('modal-real-saving').classList.remove('show'));
    }

    ['edit-meta-hard', 'edit-meta-soft', 'edit-meta-onetime', 'edit-meta-inventory'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', autoCalcEditMetaTotal);
    });

    const btnRecalculate = document.getElementById('btn-recalculate-metrics');
    if (btnRecalculate) {
        btnRecalculate.addEventListener('click', () => runRecalculateMetricsAndShowReport());
    }

    const btnCloseAuditModal = document.getElementById('btn-close-audit-report-modal');
    if (btnCloseAuditModal) {
        btnCloseAuditModal.addEventListener('click', () => document.getElementById('modal-audit-report').classList.remove('show'));
    }

    const btnCloseAuditFooter = document.getElementById('btn-close-audit-report-footer');
    if (btnCloseAuditFooter) {
        btnCloseAuditFooter.addEventListener('click', () => document.getElementById('modal-audit-report').classList.remove('show'));
    }

    const formEditMeta = document.getElementById('form-edit-meta');
    if (formEditMeta) {
        formEditMeta.addEventListener('submit', (e) => {
            e.preventDefault();
            const respId = document.getElementById('edit-meta-resp-id').value;
            const name = document.getElementById('edit-meta-resp-name').value.trim();
            const area = document.getElementById('edit-meta-resp-area').value.trim();
            const hard = parseFloat(document.getElementById('edit-meta-hard').value) || 0;
            const soft = parseFloat(document.getElementById('edit-meta-soft').value) || 0;
            const onetime = parseFloat(document.getElementById('edit-meta-onetime').value) || 0;
            const inventory = parseFloat(document.getElementById('edit-meta-inventory').value) || 0;
            const total = hard + soft + onetime + inventory;

            if (respId) {
                const item = state.responsables.find(r => r.id === respId);
                if (item) {
                    item.name = name;
                    item.area = area;
                    item.targetHard = hard;
                    item.targetSoft = soft;
                    item.targetOneTime = onetime;
                    item.targetInventory = inventory;
                    item.targetTotal = total;
                }
            } else {
                const newResp = {
                    id: "resp-" + Math.floor(100 + Math.random() * 900),
                    name,
                    area,
                    targetHard: hard,
                    targetSoft: soft,
                    targetOneTime: onetime,
                    targetInventory: inventory,
                    targetTotal: total
                };
                state.responsables.push(newResp);
            }

            saveResponsablesToStorage();
            document.getElementById('modal-edit-meta').classList.remove('show');
            renderPlanActividadesView();
        });
    }

    const formRealSaving = document.getElementById('form-real-saving');
    if (formRealSaving) {
        formRealSaving.addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = document.getElementById('form-saving-id').value;
            const responsable = document.getElementById('form-saving-resp').value;
            const type = document.getElementById('form-saving-type').value;
            const desc = document.getElementById('form-saving-description').value.trim();
            const amount = parseFloat(document.getElementById('form-saving-amount').value) || 0;
            const date = document.getElementById('form-saving-date').value;
            const evidence = document.getElementById('form-saving-evidence').value.trim();
            const comments = document.getElementById('form-saving-comments').value.trim();

            const item = {
                id: editId || "SAV-" + Math.floor(100 + Math.random() * 900),
                responsable,
                savingsType: type,
                description: desc,
                amount,
                date,
                evidence: evidence || 'Sin evidencia',
                comments
            };

            if (editId) {
                const idx = state.savingsRecords.findIndex(s => s.id === editId);
                if (idx >= 0) state.savingsRecords[idx] = item;
            } else {
                state.savingsRecords.unshift(item);
            }

            saveSavingsRecordsToStorage();
            document.getElementById('modal-real-saving').classList.remove('show');
            renderPlanActividadesView();
        });
    }
}

function renderPlanDashboard(activities) {
    const totalAct = activities.length;
    const closedAct = activities.filter(a => a.status === 'Completado').length;
    const openAct = totalAct - closedAct;
    const totalMin = activities.reduce((sum, a) => sum + parseInt(a.minutes || 0), 0);
    const totalHours = (totalMin / 60).toFixed(1);

    const globalStats = getGlobalSavingsStats();
    const targetSavings = globalStats.metaTotal;
    const actualSavings = globalStats.actualTotal;
    const compliancePct = globalStats.complianceStr;

    let totalEvidences = 0;
    activities.forEach(a => { if (a.attachments) totalEvidences += a.attachments.length; });

    const totalActEl = document.getElementById('dash-plan-total-act');
    if (totalActEl) totalActEl.innerText = totalAct;

    const openActEl = document.getElementById('dash-plan-open-act');
    if (openActEl) openActEl.innerText = openAct;

    const closedActEl = document.getElementById('dash-plan-closed-act');
    if (closedActEl) closedActEl.innerText = closedAct;

    const totalMinEl = document.getElementById('dash-plan-total-minutes');
    if (totalMinEl) totalMinEl.innerText = `${totalMin} min`;

    const totalHoursEl = document.getElementById('dash-plan-total-hours');
    if (totalHoursEl) totalHoursEl.innerText = `${totalHours} horas equivalentes`;

    const targetSavingsEl = document.getElementById('dash-plan-target-savings');
    if (targetSavingsEl) targetSavingsEl.innerText = formatCurrency(targetSavings);

    const actualSavingsEl = document.getElementById('dash-plan-actual-savings');
    if (actualSavingsEl) actualSavingsEl.innerText = formatCurrency(actualSavings);

    const savingsPctEl = document.getElementById('dash-plan-savings-pct');
    if (savingsPctEl) savingsPctEl.innerText = compliancePct;

    const totalEvidencesEl = document.getElementById('dash-plan-total-evidences');
    if (totalEvidencesEl) totalEvidencesEl.innerText = totalEvidences;

    renderPlanDashboardCharts(activities);
}

function renderPlanDashboardCharts(activities) {
    if (typeof Chart === 'undefined') return;

    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#f1f5f9' : '#334155';
    const gridColor = isDark ? '#24324d' : '#e2e8f0';

    const statusCounts = { 'Pendiente': 0, 'En Proceso': 0, 'En Riesgo': 0, 'Bloqueado': 0, 'Completado': 0 };
    activities.forEach(a => statusCounts[a.status] = (statusCounts[a.status] || 0) + 1);
    const ctxStatus = document.getElementById('chart-plan-status')?.getContext('2d');
    if (ctxStatus) {
        if (planCharts.dashStatus) planCharts.dashStatus.destroy();
        planCharts.dashStatus = new Chart(ctxStatus, {
            type: 'pie',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: ['#64748b', '#3b82f6', '#f59e0b', '#ef4444', '#10b981']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: textColor } } }
            }
        });
    }

    const prioCounts = { 'Alta': 0, 'Media': 0, 'Baja': 0 };
    activities.forEach(a => prioCounts[a.priority] = (prioCounts[a.priority] || 0) + 1);
    const ctxPrio = document.getElementById('chart-plan-priority')?.getContext('2d');
    if (ctxPrio) {
        if (planCharts.dashPrio) planCharts.dashPrio.destroy();
        planCharts.dashPrio = new Chart(ctxPrio, {
            type: 'bar',
            data: {
                labels: Object.keys(prioCounts),
                datasets: [{
                    label: 'Actividades',
                    data: Object.values(prioCounts),
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: textColor }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });
    }

    const userMinutes = {};
    activities.forEach(a => userMinutes[a.userName] = (userMinutes[a.userName] || 0) + parseInt(a.minutes || 0));
    const ctxUserMin = document.getElementById('chart-plan-user-minutes')?.getContext('2d');
    if (ctxUserMin) {
        if (planCharts.dashUserMin) planCharts.dashUserMin.destroy();
        planCharts.dashUserMin = new Chart(ctxUserMin, {
            type: 'bar',
            data: {
                labels: Object.keys(userMinutes),
                datasets: [{
                    label: 'Minutos invertidos',
                    data: Object.values(userMinutes),
                    backgroundColor: '#7c3aed'
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: textColor }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });
    }
}

function renderPlanEvidencias(activities) {
    const tbody = document.getElementById('plan-evidencias-table-body');
    if (!tbody) return;

    const allEvidences = [];
    activities.forEach(act => {
        if (act.attachments && act.attachments.length > 0) {
            act.attachments.forEach(att => {
                allEvidences.push({
                    ...att,
                    activityTitle: act.activity,
                    activityId: act.id
                });
            });
        }
    });

    if (allEvidences.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 30px;">No hay evidencias cargadas en las actividades.</td></tr>`;
        return;
    }

    tbody.innerHTML = allEvidences.map(att => {
        let iconClass = 'fa-file';
        let iconColor = 'text-blue';
        if (att.type === 'pdf') { iconClass = 'fa-file-pdf'; iconColor = 'text-red'; }
        else if (att.type === 'excel') { iconClass = 'fa-file-excel'; iconColor = 'text-green'; }
        else if (att.type === 'word') { iconClass = 'fa-file-word'; iconColor = 'text-blue'; }
        else if (att.type === 'powerpoint') { iconClass = 'fa-file-powerpoint'; iconColor = 'text-orange'; }
        else if (att.type === 'image') { iconClass = 'fa-file-image'; iconColor = 'text-purple'; }
        else if (att.type === 'video') { iconClass = 'fa-file-video'; iconColor = 'text-yellow'; }

        return `
            <tr>
                <td><i class="fa-solid ${iconClass} ${iconColor}" style="font-size: 22px;"></i></td>
                <td><strong>${att.name}</strong> <span style="font-size: 11px; color: var(--text-muted); display: block;">${att.size || 'Evidencia'}</span></td>
                <td style="max-width: 280px; font-size: 13px;">${att.activityTitle}</td>
                <td style="white-space: nowrap; font-size: 13px;">${att.date || '-'}</td>
                <td><strong>${att.userName || 'Usuario'}</strong></td>
                <td style="white-space: nowrap;">
                    <button class="btn btn-secondary btn-sm" onclick="previewEvidenceFile('${att.name}', '${att.type}', '${att.dataUrl || ''}')">
                        <i class="fa-solid fa-eye"></i> Ver
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="alert('Descargando archivo: ${att.name}')">
                        <i class="fa-solid fa-download"></i> Descargar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDeleteEvidence('${att.activityId}', '${att.name}')">
                        <i class="fa-solid fa-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

let currentModalSavingsLines = [];

function renderModalSavingsLines() {
    const container = document.getElementById('form-act-savings-lines-list');
    const targetEl = document.getElementById('modal-savings-total-target');
    const actualEl = document.getElementById('modal-savings-total-actual');
    const complianceEl = document.getElementById('modal-savings-total-compliance');

    if (!container) return;

    if (currentModalSavingsLines.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 16px; border: 1px dashed var(--border-color); border-radius: 8px; color: var(--text-muted); font-size: 13px;">
                No hay líneas de ahorro agregadas. Haz clic en <strong>"+ Agregar Línea de Ahorro"</strong> para registrar metas y ahorros.
            </div>
        `;
        if (targetEl) targetEl.innerText = formatCurrency(0);
        if (actualEl) actualEl.innerText = formatCurrency(0);
        if (complianceEl) complianceEl.innerText = "0.0%";
        return;
    }

    let totalTarget = 0;
    let totalActual = 0;

    container.innerHTML = currentModalSavingsLines.map((line, index) => {
        const targetVal = parseFloat(line.targetSavings || 0);
        const actualVal = parseFloat(line.actualSavings || 0);
        totalTarget += targetVal;
        totalActual += actualVal;

        const lineComp = formatCategoryCompliance(actualVal, targetVal);

        return `
            <div class="savings-line-card" data-index="${index}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 12px; font-weight: 700; color: var(--primary-light);">
                        <i class="fa-solid fa-coins text-yellow"></i> Línea #${index + 1}
                    </span>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 11px; font-weight: 600; color: var(--text-muted);">Cumplimiento: <strong style="color: var(--purple-sem-text);">${lineComp.text}</strong></span>
                        <button type="button" class="btn btn-icon-only btn-danger btn-sm" onclick="removeSavingsLineFromModal(${index})" title="Eliminar Línea">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>

                <div class="form-grid-3 margin-top-xs" style="margin-bottom: 6px;">
                    <div class="form-group mb-0">
                        <label>Tipo de Ahorro *</label>
                        <select onchange="updateSavingsLineFromModal(${index}, 'savingsType', this.value)" required>
                            <option value="Hard" ${line.savingsType === 'Hard' ? 'selected' : ''}>Hard Savings (Duro)</option>
                            <option value="Soft" ${line.savingsType === 'Soft' ? 'selected' : ''}>Soft Savings (Blando)</option>
                            <option value="One Time" ${line.savingsType === 'One Time' ? 'selected' : ''}>One Time Savings (Única Ocasión)</option>
                            <option value="Inventory" ${line.savingsType === 'Inventory' ? 'selected' : ''}>Inventory Reduction (Inventario)</option>
                        </select>
                    </div>
                    <div class="form-group mb-0">
                        <label>Meta Esperada ($) *</label>
                        <input type="number" min="0" step="100" value="${targetVal}" oninput="updateSavingsLineFromModal(${index}, 'targetSavings', parseFloat(this.value) || 0)" required placeholder="Ej. 50000">
                    </div>
                    <div class="form-group mb-0">
                        <label>Ahorro Real Validado ($) *</label>
                        <input type="number" min="0" step="100" value="${actualVal}" oninput="updateSavingsLineFromModal(${index}, 'actualSavings', parseFloat(this.value) || 0)" required placeholder="Ej. 40000">
                    </div>
                </div>

                <div class="form-grid-2 margin-top-xs" style="margin-bottom: 0;">
                    <div class="form-group mb-0">
                        <label>Fecha de Validación</label>
                        <input type="date" value="${line.validationDate || ''}" onchange="updateSavingsLineFromModal(${index}, 'validationDate', this.value)">
                    </div>
                    <div class="form-group mb-0">
                        <label>Comentario / Validación Financiera</label>
                        <input type="text" value="${line.financialComment || ''}" oninput="updateSavingsLineFromModal(${index}, 'financialComment', this.value)" placeholder="Ej. Validación de finanzas por reducción de scrap en estación 4.">
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const compTotalObj = formatCategoryCompliance(totalActual, totalTarget);

    if (targetEl) targetEl.innerText = formatCurrency(totalTarget);
    if (actualEl) actualEl.innerText = formatCurrency(totalActual);
    if (complianceEl) complianceEl.innerText = compTotalObj.text;
}

function updateSavingsLineFromModal(index, field, value) {
    if (currentModalSavingsLines[index]) {
        currentModalSavingsLines[index][field] = value;
        if (field === 'targetSavings' || field === 'actualSavings') {
            let totalTarget = 0;
            let totalActual = 0;
            currentModalSavingsLines.forEach(line => {
                totalTarget += parseFloat(line.targetSavings || 0);
                totalActual += parseFloat(line.actualSavings || 0);
            });
            const compTotalObj = formatCategoryCompliance(totalActual, totalTarget);
            const targetEl = document.getElementById('modal-savings-total-target');
            const actualEl = document.getElementById('modal-savings-total-actual');
            const complianceEl = document.getElementById('modal-savings-total-compliance');
            if (targetEl) targetEl.innerText = formatCurrency(totalTarget);
            if (actualEl) actualEl.innerText = formatCurrency(totalActual);
            if (complianceEl) complianceEl.innerText = compTotalObj.text;
        }
    }
}

function addSavingsLineToModal(lineData = null) {
    const newLine = lineData || {
        id: 'sl-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        savingsType: 'Hard',
        targetSavings: 0,
        actualSavings: 0,
        validationDate: '',
        financialComment: ''
    };
    currentModalSavingsLines.push(newLine);
    renderModalSavingsLines();
}

function removeSavingsLineFromModal(index) {
    currentModalSavingsLines.splice(index, 1);
    renderModalSavingsLines();
}

function openPlanActivityModal(editId = null) {
    const modal = document.getElementById('activity-modal');
    const form = document.getElementById('activity-form');
    const titleEl = document.getElementById('modal-activity-title');

    form.reset();
    document.getElementById('form-act-attachment-previews').innerHTML = '';

    const hasSavingsCheck = document.getElementById('form-act-has-savings-check');
    const savingsContainer = document.getElementById('form-act-savings-container');

    if (editId) {
        const item = state.planActivities.find(b => b.id === editId);
        if (item) {
            titleEl.innerText = "Editar Actividad del Plan";
            document.getElementById('form-act-id').value = item.id;
            document.getElementById('form-act-title').value = item.activity;
            document.getElementById('form-act-user').value = item.userName;
            document.getElementById('form-act-target-date').value = item.targetDate || '';
            document.getElementById('form-act-close-date').value = item.closeDate || '';
            document.getElementById('form-act-status').value = item.status;
            document.getElementById('form-act-priority').value = item.priority;
            document.getElementById('form-act-minutes').value = item.minutes || 60;
            document.getElementById('form-act-progress').value = item.progress || 0;
            document.getElementById('form-act-comments').value = item.comments || '';
            document.getElementById('form-act-next-action').value = item.nextAction || '';

            const itemHasSavings = (item.hasSavings === 'si' || item.hasSavings === true);
            if (hasSavingsCheck) hasSavingsCheck.checked = itemHasSavings;

            if (itemHasSavings) {
                if (savingsContainer) savingsContainer.style.display = 'block';
                if (Array.isArray(item.savingsLines) && item.savingsLines.length > 0) {
                    currentModalSavingsLines = JSON.parse(JSON.stringify(item.savingsLines));
                } else if ((item.targetSavings || 0) > 0 || (item.actualSavings || 0) > 0) {
                    currentModalSavingsLines = [{
                        id: 'sl-1',
                        savingsType: item.savingsType || 'Hard',
                        targetSavings: item.targetSavings || 0,
                        actualSavings: item.actualSavings || 0,
                        validationDate: item.validationDate || '',
                        financialComment: item.financialComment || ''
                    }];
                } else {
                    currentModalSavingsLines = [{
                        id: 'sl-1',
                        savingsType: 'Hard',
                        targetSavings: 0,
                        actualSavings: 0,
                        validationDate: '',
                        financialComment: ''
                    }];
                }
            } else {
                if (savingsContainer) savingsContainer.style.display = 'none';
                currentModalSavingsLines = [];
            }

            if (item.attachments && item.attachments.length > 0) {
                const prevContainer = document.getElementById('form-act-attachment-previews');
                prevContainer.innerHTML = item.attachments.map(att => `
                    <div class="attachment-chip">
                        <i class="fa-solid fa-paperclip"></i>
                        <span>${att.name}</span>
                    </div>
                `).join('');
            }
        }
    } else {
        titleEl.innerText = "Registrar Actividad en el Plan";
        document.getElementById('form-act-id').value = "";
        const todayStr = new Date().toISOString().split('T')[0];
        document.getElementById('form-act-target-date').value = todayStr;
        document.getElementById('form-act-user').value = "Carlos Gómez";
        document.getElementById('form-act-minutes').value = 120;
        document.getElementById('form-act-progress').value = 0;

        if (hasSavingsCheck) hasSavingsCheck.checked = false;
        if (savingsContainer) savingsContainer.style.display = 'none';
        currentModalSavingsLines = [];
    }

    renderModalSavingsLines();
    modal.classList.add('show');
}

function previewEvidenceFile(name, type, dataUrl) {
    const modal = document.getElementById('evidence-preview-modal');
    const titleEl = document.getElementById('evidence-preview-title');
    const bodyEl = document.getElementById('evidence-preview-body');

    titleEl.innerText = `Evidencia: ${name}`;

    if (type === 'image' && dataUrl) {
        bodyEl.innerHTML = `<img src="${dataUrl}" alt="${name}" style="max-width: 100%; max-height: 450px; border-radius: 8px; box-shadow: var(--shadow-md);">`;
    } else if (type === 'video' && dataUrl) {
        bodyEl.innerHTML = `
            <video controls autoplay style="max-width: 100%; max-height: 450px; border-radius: 8px; box-shadow: var(--shadow-md);">
                <source src="${dataUrl}" type="video/mp4">
                Tu navegador no soporta la reproducción de video.
            </video>
        `;
    } else {
        let iconClass = 'fa-file-pdf';
        let iconColor = 'text-red';
        if (type === 'excel') { iconClass = 'fa-file-excel'; iconColor = 'text-green'; }
        if (type === 'word') { iconClass = 'fa-file-word'; iconColor = 'text-blue'; }
        if (type === 'powerpoint') { iconClass = 'fa-file-powerpoint'; iconColor = 'text-orange'; }
        if (type === 'video') { iconClass = 'fa-file-video'; iconColor = 'text-yellow'; }

        bodyEl.innerHTML = `
            <div style="padding: 30px;">
                <i class="fa-solid ${iconClass} ${iconColor}" style="font-size: 64px; margin-bottom: 16px;"></i>
                <h4 style="font-size: 18px; margin-bottom: 8px;">${name}</h4>
                <p style="color: var(--text-muted);">Documento de evidencia adjunto al plan de actividades.</p>
                <div class="margin-top-md" style="display: flex; gap: 10px; justify-content: center;">
                    <button class="btn btn-primary" onclick="alert('Descargando archivo evidencia: ${name}')">
                        <i class="fa-solid fa-download"></i> Descargar Archivo
                    </button>
                    <button class="btn btn-secondary" onclick="document.getElementById('evidence-preview-modal').classList.remove('show')">
                        Cerrar
                    </button>
                </div>
            </div>
        `;
    }

    modal.classList.add('show');
}

function confirmDeletePlanActivity(id) {
    if (confirm("¿Está seguro de que desea eliminar esta actividad del plan?")) {
        deletePlanActivityFromPersistence(id).then(() => {
            renderPlanActividadesView();
        });
    }
}

function confirmDeleteEvidence(activityId, fileName) {
    if (confirm(`¿Eliminar la evidencia "${fileName}"?`)) {
        const act = state.planActivities.find(a => a.id === activityId);
        if (act && act.attachments) {
            act.attachments = act.attachments.filter(att => att.name !== fileName);
            savePlanActivityToPersistence(act).then(() => {
                renderPlanActividadesView();
            });
        }
    }
}

function exportPlanToExcel() {
    if (typeof XLSX === 'undefined') {
        alert("La librería SheetJS no está cargada.");
        return;
    }

    const filtered = getFilteredPlanActivities();
    const exportData = filtered.map(b => {
        const hasSavings = (b.hasSavings === 'si' || b.hasSavings === true);
        const lines = getActivitySavingsLines(b);
        let targetTotal = 0;
        let actualTotal = 0;
        lines.forEach(l => {
            targetTotal += parseFloat(l.targetSavings || 0);
            actualTotal += parseFloat(l.actualSavings || 0);
        });

        return {
            "ID": b.id,
            "Nombre Actividad": b.activity,
            "Responsable": b.userName,
            "Fecha Compromiso": b.targetDate,
            "Fecha Cierre": b.closeDate || "",
            "Status": b.status,
            "Prioridad": b.priority,
            "Tiempo (Minutos)": b.minutes,
            "% Avance": (b.progress || 0) + "%",
            "Genera Ahorro": hasSavings ? "Sí" : "No",
            "Tipo Ahorro": hasSavings ? (b.savingsType || "Hard") : "-",
            "Meta Esperada Total ($)": hasSavings ? targetTotal : 0,
            "Ahorro Real Validado Total ($)": hasSavings ? actualTotal : 0,
            "% Cumplimiento": hasSavings ? formatCategoryCompliance(actualTotal, targetTotal).text : "N/A",
            "Cantidad de Líneas de Ahorro": lines.length,
            "Comentarios": b.comments || "",
            "Próxima Acción": b.nextAction || "",
            "Evidencias": b.attachments ? b.attachments.map(a => a.name).join(', ') : ""
        };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plan_Actividades");
    XLSX.writeFile(wb, `Plan_Actividades_Lean_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// 15. Document Event Bindings Setup
async function inicializarAplicacion() {
    applyTheme();

    await Promise.all([
        fetchProjectsFromSupabase(),
        fetchPlanActivitiesFromSupabase(),
        fetchResponsablesFromSupabase(),
        fetchSavingsRecordsFromSupabase()
    ]);

    setupSupabaseRealtime();
    setupSavingsEvents();
    updateTeamUsersDatalist();
    switchView('dashboard');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = e.currentTarget.getAttribute('data-view');
            switchView(view);
        });
    });
    
    document.getElementById('theme-toggle').addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme();
        
        if (state.currentView === 'dashboard') {
            renderDashboard();
        } else if (state.currentView === 'reports') {
            renderReportsCharts();
        } else if (state.currentView === 'plan-actividades') {
            renderPlanActividadesView();
        }
    });
    
    document.getElementById('global-search').addEventListener('input', (e) => {
        if (state.currentView === 'projects') {
            renderProjectsTable();
        } else if (state.currentView === 'plan-actividades') {
            state.planFilters.search = e.target.value;
            const searchInput = document.getElementById('plan-filter-search');
            if (searchInput) searchInput.value = e.target.value;
            renderPlanActividadesView();
        }
    });

    // ==========================================
    // PLAN DE ACTIVIDADES EVENT BINDINGS
    // ==========================================

    const btnNewActTop = document.getElementById('btn-new-activity-top');
    if (btnNewActTop) btnNewActTop.addEventListener('click', () => openPlanActivityModal());

    const btnNewActPlan = document.getElementById('btn-new-activity-plan');
    if (btnNewActPlan) btnNewActPlan.addEventListener('click', () => openPlanActivityModal());

    const btnCloseActModal = document.getElementById('btn-close-activity-modal');
    if (btnCloseActModal) btnCloseActModal.addEventListener('click', () => {
        document.getElementById('activity-modal').classList.remove('show');
    });

    const btnCancelActModal = document.getElementById('btn-cancel-activity-modal');
    if (btnCancelActModal) btnCancelActModal.addEventListener('click', () => {
        document.getElementById('activity-modal').classList.remove('show');
    });

    const btnCloseEvModal = document.getElementById('btn-close-evidence-modal');
    if (btnCloseEvModal) btnCloseEvModal.addEventListener('click', () => {
        document.getElementById('evidence-preview-modal').classList.remove('show');
    });

    // Plan Subtabs switching
    document.querySelectorAll('#view-plan-actividades .subtab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const subtab = e.currentTarget.getAttribute('data-subtab');
            switchPlanSubtab(subtab);
        });
    });

    // Plan Filter Controls
    const planFilterSearch = document.getElementById('plan-filter-search');
    if (planFilterSearch) {
        planFilterSearch.addEventListener('input', (e) => {
            state.planFilters.search = e.target.value;
            renderPlanActividadesView();
        });
    }

    const planFilterUser = document.getElementById('plan-filter-user');
    if (planFilterUser) {
        planFilterUser.addEventListener('change', (e) => {
            state.planFilters.user = e.target.value;
            renderPlanActividadesView();
        });
    }

    const planFilterStatus = document.getElementById('plan-filter-status');
    if (planFilterStatus) {
        planFilterStatus.addEventListener('change', (e) => {
            state.planFilters.status = e.target.value;
            renderPlanActividadesView();
        });
    }

    const planFilterPriority = document.getElementById('plan-filter-priority');
    if (planFilterPriority) {
        planFilterPriority.addEventListener('change', (e) => {
            state.planFilters.priority = e.target.value;
            renderPlanActividadesView();
        });
    }

    const planFilterSavingsType = document.getElementById('plan-filter-savings-type');
    if (planFilterSavingsType) {
        planFilterSavingsType.addEventListener('change', (e) => {
            state.planFilters.savingsType = e.target.value;
            renderPlanActividadesView();
        });
    }

    const btnClearPlanFilters = document.getElementById('btn-clear-plan-filters');
    if (btnClearPlanFilters) {
        btnClearPlanFilters.addEventListener('click', () => {
            state.planFilters = { search: '', user: '', status: '', priority: '', savingsType: '' };
            if (planFilterSearch) planFilterSearch.value = "";
            if (planFilterUser) planFilterUser.value = "";
            if (planFilterStatus) planFilterStatus.value = "";
            if (planFilterPriority) planFilterPriority.value = "";
            if (planFilterSavingsType) planFilterSavingsType.value = "";
            renderPlanActividadesView();
        });
    }

    const btnExportPlanExcel = document.getElementById('btn-export-plan-excel');
    if (btnExportPlanExcel) btnExportPlanExcel.addEventListener('click', exportPlanToExcel);

    // Dynamic Savings Checkbox and Add Line Button in Modal
    const hasSavingsCheck = document.getElementById('form-act-has-savings-check');
    const savingsContainer = document.getElementById('form-act-savings-container');
    if (hasSavingsCheck && savingsContainer) {
        hasSavingsCheck.addEventListener('change', (e) => {
            if (e.target.checked) {
                savingsContainer.style.display = 'block';
                if (currentModalSavingsLines.length === 0) {
                    addSavingsLineToModal();
                }
            } else {
                savingsContainer.style.display = 'none';
            }
        });
    }

    const btnAddSavingsLine = document.getElementById('btn-add-savings-line');
    if (btnAddSavingsLine) {
        btnAddSavingsLine.addEventListener('click', () => {
            addSavingsLineToModal();
        });
    }

    // Plan Activity Form Submit Handler
    const actForm = document.getElementById('activity-form');
    if (actForm) {
        actForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const editId = document.getElementById('form-act-id').value;
            const titleVal = document.getElementById('form-act-title').value;
            const userVal = document.getElementById('form-act-user').value;
            const targetDateVal = document.getElementById('form-act-target-date').value;
            const closeDateVal = document.getElementById('form-act-close-date').value;
            const statusVal = document.getElementById('form-act-status').value;
            const priorityVal = document.getElementById('form-act-priority').value;
            const minutesVal = parseInt(document.getElementById('form-act-minutes').value) || 60;
            const progressVal = parseInt(document.getElementById('form-act-progress').value) || 0;
            const commentsVal = document.getElementById('form-act-comments').value;
            const nextActionVal = document.getElementById('form-act-next-action').value;

            const isSavingsChecked = hasSavingsCheck ? hasSavingsCheck.checked : false;

            let savingsLines = [];
            let targetSavingsVal = 0;
            let actualSavingsVal = 0;
            let savingsTypeVal = '-';

            if (isSavingsChecked) {
                savingsLines = JSON.parse(JSON.stringify(currentModalSavingsLines));
                savingsLines.forEach(line => {
                    targetSavingsVal += parseFloat(line.targetSavings || 0);
                    actualSavingsVal += parseFloat(line.actualSavings || 0);
                });
                if (savingsLines.length > 0) {
                    const uniqueTypes = [...new Set(savingsLines.map(l => l.savingsType || 'Hard'))];
                    savingsTypeVal = uniqueTypes.length === 1 ? uniqueTypes[0] : uniqueTypes.join(', ');
                }
            }

            const fileInput = document.getElementById('form-act-attachments');

            let attachments = [];
            if (editId) {
                const existing = state.planActivities.find(b => b.id === editId);
                if (existing && existing.attachments) attachments = [...existing.attachments];
            }

            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                const filePromises = Array.from(fileInput.files).map(file => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        const isImage = file.type.startsWith('image/');
                        const isVideo = file.type.startsWith('video/');
                        let type = 'document';
                        if (isImage) type = 'image';
                        else if (isVideo) type = 'video';
                        else if (file.name.endsWith('.pdf')) type = 'pdf';
                        else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) type = 'excel';
                        else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) type = 'word';
                        else if (file.name.endsWith('.pptx') || file.name.endsWith('.ppt')) type = 'powerpoint';

                        reader.onload = function(evt) {
                            resolve({
                                id: 'att-' + Math.floor(Math.random() * 10000),
                                name: file.name,
                                type: type,
                                size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                                date: new Date().toISOString().split('T')[0],
                                userName: userVal,
                                dataUrl: (isImage || isVideo) ? evt.target.result : null
                            });
                        };
                        reader.readAsDataURL(file);
                    });
                });
                const newAtts = await Promise.all(filePromises);
                attachments = [...attachments, ...newAtts];
            }

            const itemData = {
                id: editId || "ACT-" + Math.floor(100 + Math.random() * 900),
                activity: titleVal,
                userName: userVal,
                targetDate: targetDateVal,
                closeDate: closeDateVal,
                status: statusVal,
                priority: priorityVal,
                minutes: minutesVal,
                progress: progressVal,
                hasSavings: isSavingsChecked ? 'si' : 'no',
                savingsType: savingsTypeVal,
                targetSavings: targetSavingsVal,
                actualSavings: actualSavingsVal,
                savingsAmount: actualSavingsVal,
                savingsLines: savingsLines,
                comments: commentsVal,
                nextAction: nextActionVal,
                attachments: attachments
            };

            await savePlanActivityToPersistence(itemData);
            document.getElementById('activity-modal').classList.remove('show');
            renderPlanActividadesView();
        });
    }

    // ==========================================
    // EXISTING PROJECT BINDINGS
    // ==========================================

    document.getElementById('btn-new-project-top').addEventListener('click', () => openProjectModal());
    document.getElementById('btn-new-project-list').addEventListener('click', () => openProjectModal());
    document.getElementById('btn-close-project-modal').addEventListener('click', () => {
        document.getElementById('project-modal').classList.remove('show');
    });
    document.getElementById('btn-cancel-project-modal').addEventListener('click', () => {
        document.getElementById('project-modal').classList.remove('show');
    });

    document.getElementById('project-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const idInput = document.getElementById('form-project-id').value;
        const name = document.getElementById('form-name').value;
        const leanResp = document.getElementById('form-lean-resp').value;
        const owner = document.getElementById('form-owner').value;
        const coLeader = document.getElementById('form-co-leader').value;
        const area = document.getElementById('form-area').value;
        const category = document.getElementById('form-category').value;
        const priority = document.getElementById('form-priority').value;
        const status = document.getElementById('form-status').value;
        const progress = parseInt(document.getElementById('form-progress').value) || 0;
        const startDate = document.getElementById('form-start-date').value;
        const targetDate = document.getElementById('form-target-date').value;
        const closeDate = document.getElementById('form-close-date').value;
        const description = document.getElementById('form-description').value;
        const comments = document.getElementById('form-comments').value;
        
        const projectData = {
            name,
            leanResponsable: leanResp,
            owner,
            coLeader,
            area,
            category,
            priority,
            status,
            progress,
            startDate,
            targetDate,
            closeDate: status === 'Cerrado' ? closeDate || new Date("2026-08-06").toISOString().split('T')[0] : "",
            description,
            comments,
            updated_at: new Date().toISOString()
        };
        
        if (!isSupabaseEnabled()) {
            if (idInput) {
                const id = parseInt(idInput);
                const idx = state.projects.findIndex(p => p.id === id);
                if (idx >= 0) state.projects[idx] = { ...state.projects[idx], ...projectData, id };
            } else {
                const maxId = state.projects.length > 0 ? Math.max(...state.projects.map(p => p.id || 0)) : 100;
                state.projects.unshift({ ...projectData, id: maxId + 1 });
            }
            localStorage.setItem('lean_tracker_projects', JSON.stringify(state.projects));
            document.getElementById('project-modal').classList.remove('show');
            if (state.currentView === 'project-detail') {
                viewProjectDetails(state.currentProjectId);
            } else {
                switchView('projects');
            }
            return;
        }

        try {
            if (idInput) {
                const id = parseInt(idInput);
                const { error } = await window.supabaseClient
                    .from('projects')
                    .update(projectData)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await window.supabaseClient
                    .from('projects')
                    .insert([projectData]);
                if (error) throw error;
            }
            
            document.getElementById('project-modal').classList.remove('show');
            
            await fetchProjectsFromSupabase();
            
            if (state.currentView === 'project-detail') {
                viewProjectDetails(state.currentProjectId);
            } else {
                switchView('projects');
            }
        } catch (err) {
            console.error("Error detallado al guardar el proyecto en Supabase:", err);
            showFriendlyError("No se pudo guardar el proyecto en Supabase. (Error: " + (err.message || err) + ")");
            alert("Error al guardar el proyecto: " + (err.message || JSON.stringify(err)));
        }
    });

    document.getElementById('btn-back-to-projects').addEventListener('click', () => switchView('projects'));
    
    document.getElementById('btn-edit-project-current').addEventListener('click', () => {
        if (state.currentProjectId) openProjectModal(state.currentProjectId);
    });
    
    document.getElementById('btn-delete-project-current').addEventListener('click', () => {
        if (state.currentProjectId) deleteProject(state.currentProjectId);
    });

    document.getElementById('notif-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('notif-panel').classList.toggle('show');
    });
    
    document.getElementById('clear-notif-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        state.notifications = [];
        updateNotificationsBadge();
    });
    
    document.addEventListener('click', () => {
        document.getElementById('notif-panel').classList.remove('show');
    });

    const filterSelectors = ['filter-lean-resp', 'filter-owner', 'filter-co-leader', 'filter-area', 'filter-category', 'filter-status', 'filter-priority', 'filter-aging'];
    filterSelectors.forEach(fid => {
        const el = document.getElementById(fid);
        if (el) el.addEventListener('change', renderProjectsTable);
    });
    
    const btnClearProjFilters = document.getElementById('btn-clear-filters');
    if (btnClearProjFilters) {
        btnClearProjFilters.addEventListener('click', () => {
            filterSelectors.forEach(fid => {
                const el = document.getElementById(fid);
                if (el) el.value = "";
            });
            document.getElementById('global-search').value = "";
            renderProjectsTable();
        });
    }

    document.querySelectorAll('#main-projects-table th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const col = th.getAttribute('data-sort');
            if (state.sortColumn === col) {
                state.sortAscending = !state.sortAscending;
            } else {
                state.sortColumn = col;
                state.sortAscending = true;
            }
            document.querySelectorAll('#main-projects-table th.sortable i').forEach(icon => {
                icon.className = "fa-solid fa-sort";
            });
            const activeIcon = th.querySelector('i');
            activeIcon.className = state.sortAscending ? "fa-solid fa-sort-up" : "fa-solid fa-sort-down";
            
            renderProjectsTable();
        });
    });

    const btnExportExcel = document.getElementById('btn-export-excel');
    if (btnExportExcel) btnExportExcel.addEventListener('click', exportProjectsToExcel);

    const btnDlTemplate = document.getElementById('btn-download-template');
    if (btnDlTemplate) btnDlTemplate.addEventListener('click', downloadExcelTemplate);
    
    const btnImportExcelTrig = document.getElementById('btn-import-excel-trigger');
    if (btnImportExcelTrig) {
        btnImportExcelTrig.addEventListener('click', () => {
            document.getElementById('excel-file-input').click();
        });
    }
    
    const excelFileInput = document.getElementById('excel-file-input');
    if (excelFileInput) {
        excelFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) importProjectsFromExcel(file);
        });
    }

    const btnExportPdf = document.getElementById('btn-export-pdf');
    if (btnExportPdf) btnExportPdf.addEventListener('click', exportDashboardToPDF);

    const btnCloseDrilldown = document.getElementById('btn-close-drilldown');
    if (btnCloseDrilldown) {
        btnCloseDrilldown.addEventListener('click', () => {
            document.getElementById('drilldown-section').style.display = "none";
        });
    }

    const btnPagePrev = document.getElementById('btn-page-prev');
    if (btnPagePrev) {
        btnPagePrev.addEventListener('click', () => {
            if (state.currentPage > 1) {
                state.currentPage--;
                renderProjectsTable();
            }
        });
    }

    const btnPageNext = document.getElementById('btn-page-next');
    if (btnPageNext) {
        btnPageNext.addEventListener('click', () => {
            const total = getFilteredProjects().length;
            const maxPage = Math.ceil(total / (state.rowsPerPage || 10)) || 1;
            if (state.currentPage < maxPage) {
                state.currentPage++;
                renderProjectsTable();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarAplicacion();
});
