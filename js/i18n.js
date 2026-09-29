/**
 * ShiftIQ — i18n (ES / EN)
 * Gestión inteligente para talleres automotrices
 */
(function () {
    const STORAGE_KEY = 'shiftiq_lang';

    const TRANSLATIONS = {
        es: {
            lang_group_aria: 'Seleccionar idioma',
            meta_title: 'ShiftIQ',
            meta_desc:
                'ShiftIQ — Gestión inteligente para talleres automotrices: órdenes de trabajo, telemetría OBD2, inventario y app móvil para mecánicos.',
            nav_inicio: 'Inicio',
            nav_tecnologia: 'Solución',
            nav_sectores: 'Segmentos',
            nav_nosotros: 'Nosotros',
            nav_equipo: 'Equipo',
            nav_planes: 'Planes',
            nav_cta: 'Comienza ahora',
            footer_nav_contact: 'Contacto',
            hero_tagline: 'Gestión de talleres · OBD2',
            hero_title: 'Máxima rentabilidad para tu taller, precisión total en cada reparación',
            hero_desc:
                'Órdenes, telemetría OBD2, inventario y app móvil en una plataforma hecha para talleres que operan en serio.',
            hero_btn_login: '¡Comienza hoy mismo!',
            about_partners_kicker: 'Marco regulatorio',
            about_partners_html: 'Alineados con las <em>instituciones</em> del sector',
            about_panel: 'Los retos del taller',
            about_mission_t: 'Operación fragmentada',
            about_mission_p:
                'Citas, órdenes y repuestos en sistemas distintos o en papel, generando errores y retrasos.',
            about_vision_t: 'Inventario sin control',
            about_vision_p:
                'Repuestos reservados sin trazabilidad y stock desactualizado que frena las reparaciones.',
            about_acc3_t: 'Sin telemetría OBD2',
            about_acc3_p:
                'Diagnósticos manuales sin alertas DTC en tiempo real ni historial del vehículo.',
            about_acc4_t: 'Ceguera estratégica',
            about_acc4_p:
                'Dueños sin métricas por sede, ingresos ni alertas de negocio hasta que es demasiado tarde.',
            about_kicker: 'El desafío',
            about_h2: 'La gestión tradicional del taller deja demasiado al azar',
            about_lead_html:
                'Órdenes en papel, inventario desactualizado, sin visibilidad de telemetría y reportes que llegan tarde. <strong>ShiftIQ</strong> nace para cerrar la brecha entre la <strong>operación del taller</strong> y la <strong>visión del negocio</strong>: control operativo, alertas tempranas y mejores decisiones por sede.',
            about_cta: 'Conoce la solución',
            expand_intro: 'Cada día sin datos claros es una oportunidad perdida: demoras, costos ocultos y clientes que no vuelven.',
            expand_caption: 'ShiftIQ muestra el taller como es: órdenes, alertas OBD2 e inventario en una sola vista para actuar a tiempo.',
            tech_wm: 'LA SOLUCIÓN',
            tech_kicker: 'Opera mejor. Decide antes.',
            tech_h2: 'Convierte la operación del taller en decisiones inteligentes',
            tech_lead:
                'ShiftIQ conecta la visión del dueño con la urgencia del piso: órdenes, OBD2, inventario y app móvil en una sola plataforma.',
            tech_f1h: 'Órdenes de trabajo',
            tech_f1p: 'Crea, asigna y da seguimiento a cada reparación desde la web principal.',
            tech_f2h: 'Inventario inteligente',
            tech_f2p: 'Productos, lotes y reserva de repuestos vinculados a cada tarea.',
            tech_f3h: 'OBD2 y telemetría',
            tech_f3p: 'Vincula dispositivos, recibe alertas DTC y consulta datos técnicos del vehículo.',
            tech_f4h: 'Dashboard ejecutivo',
            tech_f4p: 'Ingresos, ganancias y métricas por sede para dueños y gerentes.',
            tech_f5h: 'App para mecánicos',
            tech_f5p: 'Tareas, repuestos y telemetría en tiempo real desde el piso del taller.',
            tech_f6h: 'Cotizaciones y pagos',
            tech_f6p: 'Facturación, cotizaciones y aprobación del cliente desde la app, sin papeles.',
            tech_f7h: 'Gestión multi-sede',
            tech_f7p: 'Supervisa el rendimiento de cada sucursal en tiempo real desde web y móvil.',
            mosaic_kicker: 'Resultados esperados',
            mosaic_title: 'Toma decisiones más inteligentes en tu taller y reduce el riesgo operativo.',
            mosaic_s1v: '< 5 min',
            mosaic_s1l: 'Meta de respuesta a alertas OBD2',
            mosaic_s2v: '200+',
            mosaic_s2l: 'Talleres en adopción temprana',
            mosaic_s3v: '40+',
            mosaic_s3l: 'Especialistas objetivo en la red',
            mosaic_s4v: '20%',
            mosaic_s4l: 'Reducción estimada en tiempos muertos',
            mosaic_eyebrow: 'Una recomendación de ShiftIQ',
            mosaic_h3: 'Nunca enfrentes una avería crítica solo',
            mosaic_p: 'Cuando el riesgo aumenta, ShiftIQ te conecta con talleres y especialistas cercanos que pueden revisar los datos de tu vehículo, evaluar la situación y ayudarte a responder más rápido.',
            mosaic_btn: 'Explorar la red',
            yt_caption: 'Mira cómo funciona ShiftIQ<br>en tu taller',
            yt_plus_h: '¿Listo para ver ShiftIQ en acción?',
            yt_plus_p: 'No reproduzcas el video todavía: ve directo a los planes y lleva ShiftIQ a tu taller.',
            yt_plus_btn: 'Obtener la app',
            yt_plus_close: 'Cerrar',
            sec_wm: 'SEGMENTOS',
            sec_kicker: 'Dueños y Conductores',
            sec_h2: 'Una plataforma. Dos experiencias.',
            sec_lead:
                'Conectamos talleres automotrices con propietarios de vehículos en un ecosistema digital integrado.',
            sec_b1: 'Segmento 01',
            sec_t1: 'Dueños, administradores y mecánicos de talleres',
            sec_p1:
                'Gestiona tu taller desde un solo lugar: ingresos, empleados, repuestos y alertas OBD2 de vehículos cercanos que puedes convertir en órdenes de trabajo.',
            sec_tag1a: 'Talleres independientes',
            sec_tag1b: 'Cadenas',
            sec_tag1c: 'Especializados',
            sec_l1: 'SABER MÁS',
            sec_b2: 'Segmento 02',
            sec_t2: 'Conductores y propietarios de vehículos',
            sec_p2:
                'Monitorea la salud de tu vehículo desde la app, recibe códigos DTC explicados en lenguaje simple y actúa antes de la avería.',
            sec_tag2a: 'Autos particulares',
            sec_tag2b: 'Flotas',
            sec_tag2c: 'Alta gama',
            sec_l2: 'MÁS INFO',
            connect_h2: 'Deja de operar tu taller a ciegas',
            connect_lead:
                'Gestionar con papel, Excel y llamadas sueltas suele costar más que anticipar fallas, stock y cuellos de botella con datos en tiempo real.',
            connect_h2b: 'Conecta operación, equipo y clientes',
            connect_leadb:
                'ShiftIQ une la web ejecutiva, la operación del taller y la app móvil en un solo ecosistema que todos entienden.',
            connect_h2c: 'Invierte en un taller proactivo',
            connect_leadc:
                'Convierte cada alerta OBD2, cada orden y cada sede en decisiones que protegen tu rentabilidad.',
            connect_c1: 'Operación diaria',
            connect_c2: 'Control integral',
            connect_c3: 'Telemetría OBD2',
            team_h2: 'Conoce al equipo ShiftIQ',
            team_lead: 'Con raíces en la industria automotriz, impulsados por la precisión',
            team_b1: 'Desarrollo de la plataforma, despliegue continuo y documentación.',
            team_b2: 'Web ejecutiva y dashboard: métricas por sede para dueños y gerentes.',
            team_b3: 'Órdenes de trabajo, inventario y flujo operativo del taller.',
            team_b4: 'App móvil para mecánicos y conductores.',
            team_b5: 'Telemetría OBD2, alertas DTC e integraciones.',
            team_tab_video: 'Video',
            team_tab_image: 'Imagen',
            team_img_soon: 'Imagen del equipo en preparación',
            team_media_copy: 'Nuestro equipo entiende ambos lados del taller. Desde desarrolladores y diseñadores hasta especialistas en movilidad y telemetría automotriz, en ShiftIQ convertimos datos, procesos y experiencia compartida en talleres más eficientes y rentables.',
            orbit_text: 'Nuestro equipo entiende ambos lados del taller: la urgencia del piso y la visión del dueño. Esa perspectiva es lo que hace que ShiftIQ sea diferente.',
            plan_wm: 'NUESTROS PLANES',
            plan_kicker: 'Planes de precio',
            plan_h2: 'Cada taller merece las herramientas correctas',
            plan_lead:
                'Planes que escalan contigo: desde el taller independiente hasta cadenas multi-sede y propietarios de vehículos.',
            plan_pilot: 'APP FREE',
            plan_basic: 'BÁSICO',
            plan_pro: 'PROFESIONAL',
            plan_hosp: 'APP PREMIUM',
            plan_prem: 'CORPORATIVO',
            plan_period: '/mes',
            plan_custom: 'A medida',
            plan_rec: 'RECOMENDADO',
            plan_d0: 'Para propietarios de vehículos: monitoreo, recordatorios e historial en la red ShiftIQ.',
            plan_d1: 'Para talleres independientes: órdenes, facturación y citas en un solo lugar.',
            plan_d2: 'Para talleres en crecimiento: OBD2, portal de clientes y reportes.',
            plan_d3: 'Para cadenas de talleres con múltiples sedes. Desde S/ 899 al mes.',
            plan_d4: 'Para conductores que quieren diagnóstico avanzado y alertas antes de la avería.',
            plan0_f1: 'Registro de vehículos y perfil',
            plan0_f2: 'Monitoreo básico del vehículo',
            plan0_f3: 'Recordatorios de mantenimiento',
            plan0_f4: 'Historial en talleres afiliados',
            plan0_f5: 'Lectura avanzada de DTC',
            plan0_f6: 'Alertas proactivas',
            plan0_btn: 'Descargar app',
            plan1_f1: 'Gestión de órdenes de trabajo',
            plan1_f2: 'Facturación, cotizaciones y pagos',
            plan1_f3: 'Registro de clientes y vehículos',
            plan1_f4: 'Hasta 2 usuarios · 1 sede',
            plan1_f5: 'Conexión OBD2',
            plan1_f6: 'Reportes financieros',
            plan1_btn: 'Seleccionar Básico',
            plan2_f1: 'Todo lo del plan Básico',
            plan2_f2: 'Conexión OBD2 y códigos DTC',
            plan2_f3: 'Portal para clientes',
            plan2_f4: 'Informes operativos y financieros',
            plan2_f5: 'App móvil para mecánicos',
            plan2_f6: 'Hasta 5 usuarios · 3 sedes',
            plan2_btn: 'Comenzar ahora',
            plan3_f1: 'Todo lo del plan Profesional',
            plan3_f2: 'Múltiples sedes',
            plan3_f3: 'Usuarios ilimitados',
            plan3_f4: 'Dashboard ejecutivo global',
            plan3_f5: 'Integraciones vía API',
            plan3_f6: 'Soporte prioritario y onboarding',
            plan3_btn: 'Contactar ventas',
            plan4_f1: 'Lectura avanzada de DTC',
            plan4_f2: 'Telemetría detallada',
            plan4_f3: 'Alertas proactivas',
            plan4_f4: 'Historial completo de servicios',
            plan4_f5: 'Integración con talleres afiliados',
            plan4_f6: 'Aprobación de cotizaciones',
            plan4_btn: 'Elegir Premium',
            plan_note: 'Facturación anual disponible: ahorra 2 meses en cualquier plan de taller',
            footer_terms: 'Términos y Condiciones',
            footer_legal_copy: '© 2026 ShiftIQ. Todos los derechos reservados.',
            footer_credit: 'Sitio diseñado por el equipo ShiftIQ',
            footer_cta_lead: 'Talleres más inteligentes empiezan aquí. Únete a los equipos que ya operan con datos, no con suposiciones.',
            footer_cta_btn: 'Prueba ShiftIQ ahora',
            footer_follow: 'Síguenos:',
            cta_v_badge: 'Empieza hoy',
            cta_v_title: 'Talleres inteligentes.\nOperación más fuerte.\nHecho para quienes reparan.',
            cta_v_sub: 'Nuestro equipo entiende ambos lados del taller: la urgencia del piso y la visión del dueño. Esa perspectiva es lo que hace que ShiftIQ sea diferente.',
            cta_v_btn: 'Comenzar',
            cta_v_perk1: 'Sin permanencia',
            cta_v_perk2: 'Configuración en minutos',
            cta_v_perk3: 'Soporte en español',
            terms_back: 'Volver al sitio',
            terms_doc_title: 'Términos y Condiciones | ShiftIQ',
            terms_modal_title: 'Términos y Condiciones',
            modal_ok: 'Entendido',
            terms_body_html: `<p class="terms-lead text-secondary mb-4">Última actualización: 31 de agosto de 2026</p>
<p class="terms-section-title">1. Aceptación de los términos</p>
<p>Al acceder o utilizar ShiftIQ —incluyendo la web ejecutiva, la web operativa y la aplicación móvil— aceptas estos Términos y Condiciones. Si no estás de acuerdo, no debes usar nuestros servicios. Estos términos constituyen un acuerdo legal vinculante entre tú (el usuario o el taller registrado) y ShiftIQ.</p>
<p class="terms-section-title">2. Descripción del servicio</p>
<p>ShiftIQ es una plataforma de gestión inteligente para talleres automotrices que permite administrar órdenes de trabajo, inventario, diagnósticos OBD, reportes, equipos y comunicación con clientes. Nos reservamos el derecho de modificar, suspender o discontinuar funciones del servicio con previo aviso razonable cuando sea posible.</p>
<p class="terms-section-title">3. Cuentas y responsabilidades</p>
<p>Eres responsable de mantener la confidencialidad de tus credenciales y de toda actividad realizada bajo tu cuenta. Debes proporcionar información veraz y actualizada al registrarte. Te comprometes a:</p>
<ul class="terms-list mb-3">
<li>Notificar de inmediato cualquier uso no autorizado de tu cuenta.</li>
<li>Asignar roles y permisos de forma adecuada dentro de tu taller.</li>
<li>Cumplir con las leyes aplicables en materia de protección de datos de clientes y vehículos.</li>
</ul>
<p class="terms-section-title">4. Planes, pagos y facturación</p>
<p>Los planes de suscripción se facturan según el ciclo elegido (mensual o anual). Los precios publicados pueden cambiar con aviso previo de al menos 30 días para suscriptores activos.</p>
<p class="terms-section-title">5. Uso permitido y restricciones</p>
<p>Te comprometes a utilizar ShiftIQ únicamente para fines legítimos relacionados con la operación de talleres automotrices. Queda prohibido:</p>
<ul class="terms-list mb-3">
<li>Intentar acceder sin autorización a sistemas, datos o cuentas de terceros.</li>
<li>Realizar ingeniería inversa, copiar o redistribuir el software sin permiso escrito.</li>
<li>Usar la plataforma para actividades fraudulentas, ilegales o que perjudiquen a otros usuarios.</li>
</ul>
<p class="terms-section-title">6. Propiedad intelectual y datos</p>
<p>ShiftIQ y sus licenciantes conservan todos los derechos sobre la plataforma, el diseño, el código y las marcas. Los datos operativos que ingreses (órdenes, clientes, inventario) te pertenecen a ti o a tu organización. Nos concedes una licencia limitada para procesar esos datos con el fin de prestar, mejorar y asegurar el servicio.</p>
<p class="terms-section-title">7. Limitación de responsabilidad</p>
<p>ShiftIQ se proporciona «tal cual». No garantizamos disponibilidad ininterrumpida ni ausencia total de errores. En la máxima medida permitida por la ley, no seremos responsables por daños indirectos, pérdida de ingresos o interrupciones operativas derivadas del uso de la plataforma.</p>
<p class="terms-section-title">8. Contacto y cambios</p>
<p>Podemos actualizar estos términos publicando la versión revisada en esta página. El uso continuado del servicio tras los cambios implica tu aceptación. Para consultas legales, escríbenos a <a href="mailto:legal@shiftiq.com">legal@shiftiq.com</a>.</p>`
        },
        en: {
            lang_group_aria: 'Choose language',
            meta_title: 'ShiftIQ',
            meta_desc:
                'ShiftIQ — Smart management for auto repair shops: work orders, OBD2 telemetry, inventory, and a mobile app for mechanics.',
            nav_inicio: 'Home',
            nav_tecnologia: 'Solution',
            nav_sectores: 'Segments',
            nav_nosotros: 'About',
            nav_equipo: 'Team',
            nav_planes: 'Plans',
            nav_cta: 'Start now',
            footer_nav_contact: 'Contact',
            hero_tagline: 'Workshop management · OBD2',
            hero_title: 'Maximum profitability for your shop, total precision in every repair',
            hero_desc:
                'Work orders, OBD2 telemetry, inventory, and a mobile app in one platform built for shops that mean business.',
            hero_btn_login: 'Start today!',
            about_partners_kicker: 'Regulatory framework',
            about_partners_html: 'Aligned with the sector’s <em>institutions</em>',
            about_panel: 'Workshop challenges',
            about_mission_t: 'Fragmented operations',
            about_mission_p:
                'Appointments, orders, and parts in separate systems or on paper, causing errors and delays.',
            about_vision_t: 'Uncontrolled inventory',
            about_vision_p:
                'Parts reserved without traceability and outdated stock that slows down repairs.',
            about_acc3_t: 'No OBD2 telemetry',
            about_acc3_p:
                'Manual diagnostics with no real-time DTC alerts or vehicle history.',
            about_acc4_t: 'Strategic blindness',
            about_acc4_p:
                'Owners without per-site metrics, revenue, or business alerts until it is too late.',
            about_kicker: 'The challenge',
            about_h2: 'Traditional workshop management leaves too much to chance',
            about_lead_html:
                'Paper orders, outdated inventory, no telemetry visibility, and reports that arrive late. <strong>ShiftIQ</strong> closes the gap between <strong>shop-floor operations</strong> and <strong>business vision</strong>: operational control, early alerts, and better decisions per site.',
            about_cta: 'Discover the solution',
            expand_intro: 'Every day without clear data is a lost opportunity: delays, hidden costs, and customers who don’t come back.',
            expand_caption: 'ShiftIQ shows the shop as it is: orders, OBD2 alerts, and inventory in one view so you can act in time.',
            tech_wm: 'THE SOLUTION',
            tech_kicker: 'Operate better. Decide sooner.',
            tech_h2: 'Turn workshop operations into smart decisions',
            tech_lead:
                'ShiftIQ connects the owner’s vision with the urgency of the shop floor: orders, OBD2, inventory, and mobile app in a single platform.',
            tech_f1h: 'Work orders',
            tech_f1p: 'Create, assign, and track every repair from the main web app.',
            tech_f2h: 'Smart inventory',
            tech_f2p: 'Products, batches, and parts reservations linked to each task.',
            tech_f3h: 'OBD2 & telemetry',
            tech_f3p: 'Link devices, receive DTC alerts, and check vehicle technical data.',
            tech_f4h: 'Executive dashboard',
            tech_f4p: 'Revenue, profit, and per-site metrics for owners and managers.',
            tech_f5h: 'Mechanics app',
            tech_f5p: 'Tasks, parts, and real-time telemetry from the shop floor.',
            tech_f6h: 'Quotes & payments',
            tech_f6p: 'Billing, quotes, and customer approval from the app, paper-free.',
            tech_f7h: 'Multi-site management',
            tech_f7p: 'Monitor each branch’s performance in real time from web and mobile.',
            mosaic_kicker: 'Expected results',
            mosaic_title: 'Make smarter decisions in your shop and reduce operational risk.',
            mosaic_s1v: '< 5 min',
            mosaic_s1l: 'Target response to OBD2 alerts',
            mosaic_s2v: '200+',
            mosaic_s2l: 'Shops in early adoption',
            mosaic_s3v: '40+',
            mosaic_s3l: 'Target specialists in the network',
            mosaic_s4v: '20%',
            mosaic_s4l: 'Estimated reduction in downtime',
            mosaic_eyebrow: 'A ShiftIQ recommendation',
            mosaic_h3: 'Never face a critical breakdown alone',
            mosaic_p: 'When risk rises, ShiftIQ connects you with nearby shops and specialists who can review your vehicle data, assess the situation, and help you respond faster.',
            mosaic_btn: 'Explore the network',
            yt_caption: 'See how ShiftIQ works<br>in your shop',
            yt_plus_h: 'Ready to see ShiftIQ in action?',
            yt_plus_p: 'Don’t play the video yet: go straight to the plans and bring ShiftIQ to your shop.',
            yt_plus_btn: 'Get the app',
            yt_plus_close: 'Close',
            sec_wm: 'SEGMENTS',
            sec_kicker: 'Owners and Drivers',
            sec_h2: 'One platform. Two experiences.',
            sec_lead:
                'We connect auto repair shops with vehicle owners in an integrated digital ecosystem.',
            sec_b1: 'Segment 01',
            sec_t1: 'Shop owners, managers, and mechanics',
            sec_p1:
                'Run your shop from one place: revenue, staff, parts, and OBD2 alerts from nearby vehicles you can turn into work orders.',
            sec_tag1a: 'Independent shops',
            sec_tag1b: 'Chains',
            sec_tag1c: 'Specialized',
            sec_l1: 'LEARN MORE',
            sec_b2: 'Segment 02',
            sec_t2: 'Drivers and vehicle owners',
            sec_p2:
                'Monitor your vehicle’s health from the app, get DTC codes explained in plain language, and act before the breakdown.',
            sec_tag2a: 'Private cars',
            sec_tag2b: 'Fleets',
            sec_tag2c: 'High-end',
            sec_l2: 'MORE INFO',
            connect_h2: 'Stop running your shop blind',
            connect_lead:
                'Managing with paper, spreadsheets, and scattered calls usually costs more than anticipating failures, stock, and bottlenecks with real-time data.',
            connect_h2b: 'Connect operations, team, and customers',
            connect_leadb:
                'ShiftIQ unites the executive web, shop operations, and the mobile app in one ecosystem everyone understands.',
            connect_h2c: 'Invest in a proactive shop',
            connect_leadc:
                'Turn every OBD2 alert, every order, and every site into decisions that protect your profitability.',
            connect_c1: 'Daily operations',
            connect_c2: 'End-to-end control',
            connect_c3: 'OBD2 telemetry',
            team_h2: 'Meet the ShiftIQ team',
            team_lead: 'Rooted in the automotive industry, driven by precision',
            team_b1: 'Platform development, continuous delivery, and documentation.',
            team_b2: 'Executive web and dashboard: per-site metrics for owners and managers.',
            team_b3: 'Work orders, inventory, and shop operations flow.',
            team_b4: 'Mobile app for mechanics and drivers.',
            team_b5: 'OBD2 telemetry, DTC alerts, and integrations.',
            team_tab_video: 'Video',
            team_tab_image: 'Image',
            team_img_soon: 'Team image coming soon',
            team_media_copy: 'Our team understands both sides of the shop. From developers and designers to mobility and automotive telemetry specialists, at ShiftIQ we turn data, processes, and shared experience into more efficient and profitable shops.',
            orbit_text: 'Our team understands both sides of the shop: the urgency of the floor and the owner’s vision. That perspective is what makes ShiftIQ different.',
            plan_wm: 'OUR PLANS',
            plan_kicker: 'Pricing plans',
            plan_h2: 'Every shop deserves the right tools',
            plan_lead:
                'Plans that scale with you: from independent shops to multi-site chains and vehicle owners.',
            plan_pilot: 'APP FREE',
            plan_basic: 'BASIC',
            plan_pro: 'PROFESSIONAL',
            plan_hosp: 'APP PREMIUM',
            plan_prem: 'ENTERPRISE',
            plan_period: '/mo',
            plan_custom: 'Custom',
            plan_rec: 'RECOMMENDED',
            plan_d0: 'For vehicle owners: monitoring, reminders, and history in the ShiftIQ network.',
            plan_d1: 'For independent shops: orders, billing, and appointments in one place.',
            plan_d2: 'For growing shops: OBD2, customer portal, and reports.',
            plan_d3: 'For shop chains with multiple sites. From S/ 899 per month.',
            plan_d4: 'For drivers who want advanced diagnostics and alerts before a breakdown.',
            plan0_f1: 'Vehicle registration and profile',
            plan0_f2: 'Basic vehicle monitoring',
            plan0_f3: 'Maintenance reminders',
            plan0_f4: 'History at affiliated shops',
            plan0_f5: 'Advanced DTC reading',
            plan0_f6: 'Proactive alerts',
            plan0_btn: 'Download app',
            plan1_f1: 'Work order management',
            plan1_f2: 'Billing, quotes, and payments',
            plan1_f3: 'Customer and vehicle records',
            plan1_f4: 'Up to 2 users · 1 site',
            plan1_f5: 'OBD2 connection',
            plan1_f6: 'Financial reports',
            plan1_btn: 'Choose Basic',
            plan2_f1: 'Everything in Basic',
            plan2_f2: 'OBD2 connection and DTC codes',
            plan2_f3: 'Customer portal',
            plan2_f4: 'Operational and financial reports',
            plan2_f5: 'Mobile app for mechanics',
            plan2_f6: 'Up to 5 users · 3 sites',
            plan2_btn: 'Get started',
            plan3_f1: 'Everything in Professional',
            plan3_f2: 'Multiple sites',
            plan3_f3: 'Unlimited users',
            plan3_f4: 'Global executive dashboard',
            plan3_f5: 'API integrations',
            plan3_f6: 'Priority support and onboarding',
            plan3_btn: 'Contact sales',
            plan4_f1: 'Advanced DTC reading',
            plan4_f2: 'Detailed telemetry',
            plan4_f3: 'Proactive alerts',
            plan4_f4: 'Full service history',
            plan4_f5: 'Integration with affiliated shops',
            plan4_f6: 'Quote approval',
            plan4_btn: 'Choose Premium',
            plan_note: 'Annual billing available: save 2 months on any shop plan',
            footer_terms: 'Terms and Conditions',
            footer_legal_copy: '© 2026 ShiftIQ. All rights reserved.',
            footer_credit: 'Site designed by the ShiftIQ team',
            footer_cta_lead: 'Smarter shops start here. Join the teams that already operate with data, not assumptions.',
            footer_cta_btn: 'Try ShiftIQ now',
            footer_follow: 'Follow us:',
            cta_v_badge: 'Start today',
            cta_v_title: 'Smarter shops.\nStronger operations.\nBuilt for those who repair.',
            cta_v_sub: 'Our team understands both sides of the shop: the urgency of the floor and the owner’s vision. That perspective is what makes ShiftIQ different.',
            cta_v_btn: 'Get started',
            cta_v_perk1: 'No lock-in',
            cta_v_perk2: 'Set up in minutes',
            cta_v_perk3: 'Support in Spanish',
            terms_back: 'Return to site',
            terms_doc_title: 'Terms and Conditions | ShiftIQ',
            terms_modal_title: 'Terms and Conditions',
            modal_ok: 'Got it',
            terms_body_html: `<p class="terms-lead text-secondary mb-4">Last updated: August 31, 2026</p>
<p class="terms-section-title">1. Acceptance of terms</p>
<p>By accessing or using ShiftIQ —including the executive web, the operations web, and the mobile app— you accept these Terms and Conditions. If you do not agree, you must not use our services. These terms form a binding legal agreement between you (the user or registered shop) and ShiftIQ.</p>
<p class="terms-section-title">2. Service description</p>
<p>ShiftIQ is a smart management platform for auto repair shops to manage work orders, inventory, OBD diagnostics, reports, teams, and customer communication. We reserve the right to modify, suspend, or discontinue features with reasonable prior notice whenever possible.</p>
<p class="terms-section-title">3. Accounts and responsibilities</p>
<p>You are responsible for keeping your credentials confidential and for all activity under your account. You must provide accurate, up-to-date information when registering. You agree to:</p>
<ul class="terms-list mb-3">
<li>Immediately report any unauthorized use of your account.</li>
<li>Assign roles and permissions appropriately within your shop.</li>
<li>Comply with applicable data-protection laws regarding customers and vehicles.</li>
</ul>
<p class="terms-section-title">4. Plans, payments, and billing</p>
<p>Subscription plans are billed according to the chosen cycle (monthly or annual). Published prices may change with at least 30 days’ notice for active subscribers.</p>
<p class="terms-section-title">5. Permitted use and restrictions</p>
<p>You agree to use ShiftIQ only for legitimate purposes related to operating auto repair shops. The following is prohibited:</p>
<ul class="terms-list mb-3">
<li>Attempting unauthorized access to third-party systems, data, or accounts.</li>
<li>Reverse engineering, copying, or redistributing the software without written permission.</li>
<li>Using the platform for fraudulent, illegal, or harmful activities.</li>
</ul>
<p class="terms-section-title">6. Intellectual property and data</p>
<p>ShiftIQ and its licensors retain all rights to the platform, design, code, and trademarks. Operational data you enter (orders, customers, inventory) belongs to you or your organization. You grant us a limited license to process that data to provide, improve, and secure the service.</p>
<p class="terms-section-title">7. Limitation of liability</p>
<p>ShiftIQ is provided “as is”. We do not guarantee uninterrupted availability or error-free operation. To the maximum extent permitted by law, we are not liable for indirect damages, lost revenue, or operational interruptions arising from use of the platform.</p>
<p class="terms-section-title">8. Contact and changes</p>
<p>We may update these terms by posting the revised version on this page. Continued use of the service after changes implies acceptance. For legal inquiries, write to <a href="mailto:legal@shiftiq.com">legal@shiftiq.com</a>.</p>`
        }
    };

    let currentLang = 'es';

    function getTable(lang) {
        return TRANSLATIONS[lang] || TRANSLATIONS.es;
    }

    function applyI18n(lang) {
        currentLang = lang === 'en' ? 'en' : 'es';
        localStorage.setItem(STORAGE_KEY, currentLang);
        document.documentElement.lang = currentLang;

        const T = getTable(currentLang);
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && T.meta_desc) metaDesc.setAttribute('content', T.meta_desc);
        if (document.body.classList.contains('page-terms') && T.terms_doc_title) {
            document.title = T.terms_doc_title;
        } else if (T.meta_title) {
            document.title = T.meta_title;
        }

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (key && T[key] !== undefined) el.textContent = T[key];
        });

        document.querySelectorAll('[data-i18n-html]').forEach((el) => {
            const key = el.getAttribute('data-i18n-html');
            if (key && T[key] !== undefined) el.innerHTML = T[key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key && T[key] !== undefined) el.setAttribute('placeholder', T[key]);
        });

        document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
            const key = el.getAttribute('data-i18n-aria');
            if (key && T[key] !== undefined) el.setAttribute('aria-label', T[key]);
        });

        document.querySelectorAll('.lang-switch [data-lang]').forEach((btn) => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
            btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
        });

        window.dispatchEvent(new CustomEvent('kairolabs:i18n', { detail: { lang: currentLang } }));
    }

    function bindLangSwitcher() {
        document.querySelectorAll('.lang-switch [data-lang]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                applyI18n(lang);
            });
        });
    }

    window.KAIROLABS_I18N = {
        apply: applyI18n,
        getLang: () => currentLang,
        getHero: () => {
            const T = getTable(currentLang);
            return {
                tagline: T.hero_tagline,
                title: T.hero_title,
                desc: T.hero_desc
            };
        },
        translations: TRANSLATIONS
    };

    // Compatibilidad con referencias previas
    window.MEDITRACK_I18N = window.KAIROLABS_I18N;

    document.addEventListener('DOMContentLoaded', () => {
        const saved = localStorage.getItem(STORAGE_KEY) || 'es';
        applyI18n(saved);
        bindLangSwitcher();
    });
})();
