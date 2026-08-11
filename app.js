// Lean Project Tracker - State, Controllers, Calculations, Charts, Export/Import (Simplified Projects Only)

// 1. Initial State Definition
let state = {
    projects: [],
    config: {
        agingLimit: 60,
        warningDays: 10
    },
    notifications: [],
    currentView: 'dashboard',
    currentProjectId: null,
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

// 4. Persistence Engine (Migrated to Supabase)
function showFriendlyError(message) {
    const errorBannerId = 'supabase-error-banner';
    let banner = document.getElementById(errorBannerId);
    if (!banner) {
        banner = document.createElement('div');
        banner.id = errorBannerId;
        banner.style.cssText = 'background: rgba(220, 53, 69, 0.9); color: white; padding: 12px 20px; text-align: center; font-weight: 500; position: fixed; top: 0; left: 0; right: 0; z-index: 9999; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-family: "Outfit", sans-serif;';
        
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
    if (!supabaseClient || SUPABASE_URL === "YOUR_SUPABASE_URL") {
        console.error("Supabase no está configurado. Por favor, actualiza config.js con tus credenciales.");
        showFriendlyError("El servicio de base de datos no está configurado. Por favor configure las credenciales de Supabase en config.js.");
        state.projects = JSON.parse(JSON.stringify(MOCK_PROJECTS));
        return;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('projects')
            .select('*')
            .order('id', { ascending: true });
            
        if (error) throw error;
        
        state.projects = data || [];
        if (state.projects.length === 0) {
            console.log("Base de datos vacía. Cargando datos demo en Supabase...");
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
            const { data: inserted, error: insertError } = await supabaseClient
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
        showFriendlyError("No se pudo conectar a la base de datos compartida. Mostrando datos locales temporales.");
        if (state.projects.length === 0) {
            state.projects = JSON.parse(JSON.stringify(MOCK_PROJECTS));
        }
    }
}

function setupSupabaseRealtime() {
    if (!supabaseClient || SUPABASE_URL === "YOUR_SUPABASE_URL") return;
    
    supabaseClient
        .channel('schema-db-changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'projects'
            },
            async (payload) => {
                console.log('Cambio detectado en tiempo real:', payload);
                await fetchProjectsFromSupabase();
                populateFilters();
                if (state.currentView === 'dashboard') {
                    renderDashboard();
                } else if (state.currentView === 'projects') {
                    renderProjectsTable();
                } else if (state.currentView === 'reports') {
                    renderReportsCharts();
                } else if (state.currentView === 'project-detail' && state.currentProjectId) {
                    viewProjectDetails(state.currentProjectId);
                }
            }
        )
        .subscribe();
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
        try {
            const { error } = await supabaseClient
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
            console.error("Error al eliminar el proyecto en Supabase:", err);
            showFriendlyError("No se pudo eliminar el proyecto.");
            alert("Error al eliminar el proyecto: " + (err.message || err));
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
    
    try {
        const { error } = await supabaseClient
            .from('projects')
            .insert([clone]);
        if (error) throw error;
        
        await fetchProjectsFromSupabase();
        populateFilters();
        renderProjectsTable();
    } catch (err) {
        console.error("Error al duplicar el proyecto en Supabase:", err);
        showFriendlyError("No se pudo duplicar el proyecto.");
        alert("Error al duplicar el proyecto: " + (err.message || err));
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
            
            const { error } = await supabaseClient
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

// 15. Document Event Bindings Setup
async function inicializarAplicacion() {
    applyTheme();
    await fetchProjectsFromSupabase();
    setupSupabaseRealtime();
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
            renderDashboardCharts();
        } else if (state.currentView === 'reports') {
            renderReportsCharts();
        }
    });
    
    document.getElementById('global-search').addEventListener('input', () => {
        if (state.currentView === 'projects') {
            renderProjectsTable();
        }
    });

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
        
        try {
            if (idInput) {
                const id = parseInt(idInput);
                const { error } = await supabaseClient
                    .from('projects')
                    .update(projectData)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabaseClient
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
            console.error("Error al guardar el proyecto en Supabase:", err);
            showFriendlyError("No se pudo guardar el proyecto en la base de datos.");
            alert("Error al guardar el proyecto: " + (err.message || err));
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
        document.getElementById(fid).addEventListener('change', renderProjectsTable);
    });
    
    document.getElementById('btn-clear-filters').addEventListener('click', () => {
        filterSelectors.forEach(fid => {
            document.getElementById(fid).value = "";
        });
        document.getElementById('global-search').value = "";
        renderProjectsTable();
    });

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

    document.getElementById('btn-export-excel').addEventListener('click', exportProjectsToExcel);
    document.getElementById('btn-download-template').addEventListener('click', downloadExcelTemplate);
    
    document.getElementById('btn-import-excel-trigger').addEventListener('click', () => {
        document.getElementById('excel-file-input').click();
    });
    
    document.getElementById('excel-file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) importProjectsFromExcel(file);
    });

    document.getElementById('btn-export-pdf').addEventListener('click', exportDashboardToPDF);

    const btnCloseDrilldown = document.getElementById('btn-close-drilldown');
    if (btnCloseDrilldown) {
        btnCloseDrilldown.addEventListener('click', () => {
            document.getElementById('drilldown-section').style.display = "none";
        });
    }

    // Bind pagination next/prev click actions
    document.getElementById('btn-page-prev').addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderProjectsTable();
        }
    });

    document.getElementById('btn-page-next').addEventListener('click', () => {
        const total = getFilteredProjects().length;
        const maxPage = Math.ceil(total / (state.rowsPerPage || 10)) || 1;
        if (state.currentPage < maxPage) {
            state.currentPage++;
            renderProjectsTable();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarAplicacion();
});
