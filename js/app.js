/**
 * RAMIREZ.SYS — Lógica Principal de la Aplicación
 * Buenas prácticas: Modularidad, sin funciones globales sueltas,
 * separación de eventos, accesibilidad y protección anti-spam.
 */

'use strict';

(function () {
  // ==========================================================================
  // 1. MÓDULO DE SEGURIDAD ANTI-SPAM / ANTI-SCRAPING
  // ==========================================================================
  /**
   * Los recolectores automáticos (spambots) rastrean páginas buscando
   * 'mailto:' y patrones de correo en texto plano.
   * 
   * Para proteger la casilla de spam masivo:
   * 1. No dejamos el correo ni el protocolo mailto en el código HTML estático.
   * 2. Lo almacenamos segmentado y ofuscado en Base64.
   * 3. Solo se reconstruye en memoria ante una interacción humana deliberada.
   */
  const Security = {
    // Fragmentos ofuscados del correo: 'contacto' y 'softwarg.ar'
    _userPayload: 'Y29udGFjdG8=',
    _domainPayload: 'c29mdHdhcmcuYXI=',

    /**
     * Reconstruye de forma segura el correo en tiempo de ejecución.
     * @returns {string} Dirección de correo decodificada.
     */
    getEmail() {
      try {
        const user = window.atob(this._userPayload);
        const domain = window.atob(this._domainPayload);
        return `${user}@${domain}`;
      } catch (err) {
        console.error('Error al resolver contacto seguro:', err);
        return '';
      }
    },

    /**
     * Abre el cliente de correo del usuario de manera protegida.
     */
    openMailClient(subject = 'Contacto Profesional — RAMIREZ.SYS') {
      const email = this.getEmail();
      if (!email) return;
      const params = new URLSearchParams({ subject });
      window.location.href = `mailto:${email}?${params.toString()}`;
    },

    /**
     * Copia el correo al portapapeles sin exponerlo al scraper.
     */
    async copyEmail() {
      const email = this.getEmail();
      if (!email) return;

      let success = false;

      // Intento moderno con Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(email);
          success = true;
        } catch {
          success = false;
        }
      }

      // Fallback seguro si Clipboard API no está permitida
      if (!success) {
        try {
          const tempInput = document.createElement('textarea');
          tempInput.value = email;
          tempInput.setAttribute('readonly', '');
          tempInput.style.position = 'absolute';
          tempInput.style.left = '-9999px';
          document.body.appendChild(tempInput);
          tempInput.select();
          success = document.execCommand('copy');
          document.body.removeChild(tempInput);
        } catch (err) {
          console.error('Fallback de copia falló:', err);
        }
      }

      if (success) {
        UI.showToast(`✓ Correo copiado: ${email}`);
      } else {
        UI.showToast('No se pudo copiar automáticamente. Intenta de nuevo.', 'error');
      }
    }
  };

  // ==========================================================================
  // 2. MÓDULO DE INTERFAZ Y NOTIFICACIONES (TOAST)
  // ==========================================================================
  const UI = {
    toastContainer: null,

    initToastContainer() {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
      }
      this.toastContainer = container;
    },

    /**
     * Muestra una notificación profesional flotante.
     * Reemplaza el uso de alert() intrusivo.
     */
    showToast(message, type = 'success') {
      if (!this.toastContainer) this.initToastContainer();

      const toast = document.createElement('div');
      toast.className = 'toast';
      if (type === 'error') {
        toast.style.borderColor = '#EF4444';
      }

      const icon = type === 'error' ? '✕' : '✓';
      toast.innerHTML = `<span style="color: var(--accent); font-weight: bold;">[${icon}]</span> <span>${message}</span>`;

      this.toastContainer.appendChild(toast);

      // Animación de entrada
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });

      // Animación de salida y limpieza
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
          }
        }, 300);
      }, 3500);
    }
  };

  // ==========================================================================
  // 3. GESTIÓN DE TEMA (CLARO / OSCURO)
  // ==========================================================================
  const ThemeManager = {
    STORAGE_KEY: 'ramirez_theme',

    init() {
      // Sincronización inicial
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

      document.documentElement.classList.toggle('dark', isDark);
      this.updateUI();

      // Escuchar cambios de preferencia en el sistema operativo
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          document.documentElement.classList.toggle('dark', e.matches);
          this.updateUI();
        }
      });
    },

    toggle() {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
      this.updateUI();
      UI.showToast(`Modo ${isDark ? 'Oscuro' : 'Claro'} activado`);
    },

    updateUI() {
      const isDark = document.documentElement.classList.contains('dark');
      const icon = document.getElementById('themeIcon');
      const label = document.getElementById('themeLabel');

      if (icon) icon.textContent = isDark ? '☾' : '☀';
      if (label) label.textContent = isDark ? 'OSCURO' : 'CLARO';
    }
  };

  // ==========================================================================
  // 4. DATOS Y GESTIÓN DE CAPAS DE ARQUITECTURA
  // ==========================================================================
  const ARCHITECTURE_LAYERS = {
    dotnet: `
      <div class="text-acc mb-2 font-semibold">// CAPA: ECOSISTEMA .NET & MIGRACIÓN LEGACY</div>
      <p class="text-sec font-sans text-sm mb-4">
        Dominio completo del ciclo de vida .NET: desde mantenimiento y migración de sistemas
        <strong class="text-main">.NET Framework 3.5 / 4.5</strong> (WinForms, SOAP) hasta arquitecturas modernas en
        <strong class="text-main">.NET 7, 8, 9, 10 y 11</strong>.
      </p>
      <!-- Diagrama Visual de Arquitectura -->
      <div class="diagram-preview mb-4">
        <img src="assets/img/diagram-dotnet.svg" alt="Diagrama Clean Architecture .NET" loading="lazy" />
      </div>
      <div class="grid sm:grid-cols-2 gap-3 mb-4">
        <div class="surface-panel p-3">
          <span class="text-mut block mb-1">ARQUITECTURA</span>
          <span class="text-main">Clean Architecture, DDD, CQRS + MediatR, Hexagonal</span>
        </div>
        <div class="surface-panel p-3">
          <span class="text-mut block mb-1">FRAMEWORKS</span>
          <span class="text-main">ASP.NET Core Web API, Blazor, EF Core, SignalR</span>
        </div>
      </div>
      <div class="code-box p-3">
        <span style="color: #00E599;">public record</span> MigrationPath(<span class="text-white">string</span> From = <span style="color: #FCD34D;">"NetFx 3.5 / SOAP"</span>, <span class="text-white">string</span> To = <span style="color: #FCD34D;">".NET 11 / REST"</span>);
      </div>
    `,
    cloud: `
      <div class="text-acc mb-2 font-semibold">// CAPA: CLOUD SERVERLESS & DEVOPS</div>
      <p class="text-sec font-sans text-sm mb-4">
        Pipelines CI/CD empresariales, infraestructura serverless y microservicios/jobs ligeros para integración continua.
      </p>
      <!-- Diagrama Visual Cloud -->
      <div class="diagram-preview mb-4">
        <img src="assets/img/diagram-cloud.svg" alt="Diagrama Cloud Serverless y DevOps" loading="lazy" />
      </div>
      <div class="grid sm:grid-cols-2 gap-3">
        <div class="surface-panel p-3">
          <span class="text-mut block mb-1">AWS & GOOGLE CLOUD</span>
          <span class="text-main">AWS Lambda (Python/.NET), S3, EventBridge, SAM, GCP</span>
        </div>
        <div class="surface-panel p-3">
          <span class="text-mut block mb-1">AZURE DEVOPS & OPS</span>
          <span class="text-main">CI/CD Pipelines, Azure App Services, Docker, IIS</span>
        </div>
      </div>
    `,
    data: `
      <div class="text-acc mb-2 font-semibold">// CAPA: BASES DE DATOS SQL, NOSQL & SPATIAL GIS</div>
      <p class="text-sec font-sans text-sm mb-4">
        Administración y migración de motores de alta criticidad: de bases NoSQL a relacionales optimizadas, además de cartografía y datos geoespaciales.
      </p>
      <!-- Diagrama Visual de Datos -->
      <div class="diagram-preview mb-4">
        <img src="assets/img/diagram-data.svg" alt="Diagrama Bases de Datos y GIS" loading="lazy" />
      </div>
      <div class="grid sm:grid-cols-2 gap-3">
        <div class="surface-panel p-3">
          <span class="text-mut block mb-1">RELACIONALES & GIS</span>
          <span class="text-main">SQL Server, SQL Spatial, Oracle Cartografía, PostgreSQL, MySQL</span>
        </div>
        <div class="surface-panel p-3">
          <span class="text-mut block mb-1">NOSQL & CACHÉ</span>
          <span class="text-main">Redis, DynamoDB, Firestore, Vector Stores</span>
        </div>
      </div>
    `,
    web: `
      <div class="text-acc mb-2 font-semibold">// CAPA: FRONTEND, MOBILE & RUNTIME JS</div>
      <p class="text-sec font-sans text-sm mb-4">
        Aplicaciones web reactivas, clientes móviles con geolocalización exacta y servicios en Node.js.
      </p>
      <!-- Diagrama Visual Frontend & WebSockets -->
      <div class="diagram-preview mb-4">
        <img src="assets/img/diagram-web.svg" alt="Diagrama Reactive Web y SignalR" loading="lazy" />
      </div>
      <div class="grid sm:grid-cols-2 gap-3">
        <div class="surface-panel p-3">
          <span class="text-mut block mb-1">CORE WEB & JS</span>
          <span class="text-main">HTML5, CSS3, JavaScript, TypeScript, Node.js</span>
        </div>
        <div class="surface-panel p-3">
          <span class="text-mut block mb-1">UI & MOBILE</span>
          <span class="text-main">Blazor WebAssembly/PWA, Tailwind CSS, .NET Mobile/GIS</span>
        </div>
      </div>
    `
  };

  const LayerManager = {
    inspect(layerKey, clickedButton) {
      const container = document.getElementById('layer-detail');
      if (!container || !ARCHITECTURE_LAYERS[layerKey]) return;

      container.innerHTML = ARCHITECTURE_LAYERS[layerKey];

      document.querySelectorAll('.layer-btn').forEach((btn) => {
        btn.classList.remove('layer-active');
        btn.classList.add('layer-inactive');
      });

      if (clickedButton) {
        clickedButton.classList.remove('layer-inactive');
        clickedButton.classList.add('layer-active');
      }
    }
  };

  // ==========================================================================
  // 5. NAVEGACIÓN POR PESTAÑAS (TABS)
  // ==========================================================================
  const TabManager = {
    switchTab(targetTabId) {
      const contents = document.querySelectorAll('.tab-content');
      const buttons = document.querySelectorAll('.tab-btn');

      contents.forEach((content) => content.classList.add('hidden'));
      buttons.forEach((btn) => {
        btn.classList.remove('tab-active');
        btn.classList.add('tab-inactive');
        btn.setAttribute('aria-selected', 'false');
      });

      const activeContent = document.getElementById(`content-${targetTabId}`);
      const activeBtn = document.getElementById(`tab-${targetTabId}`);

      if (activeContent) activeContent.classList.remove('hidden');
      if (activeBtn) {
        activeBtn.classList.remove('tab-inactive');
        activeBtn.classList.add('tab-active');
        activeBtn.setAttribute('aria-selected', 'true');
      }
    }
  };

  // ==========================================================================
  // 6. PALETA DE COMANDOS (CTRL + K) & FILTRADO EN VIVO
  // ==========================================================================
  const CommandPalette = {
    modal: null,
    input: null,
    items: [],

    init() {
      this.modal = document.getElementById('cmdModal');
      this.input = document.getElementById('cmdInput');
      if (!this.modal) return;

      this.items = Array.from(this.modal.querySelectorAll('[data-cmd-item]'));

      // Filtrado en vivo de comandos
      if (this.input) {
        this.input.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase().trim();
          this.items.forEach((item) => {
            const text = item.textContent.toLowerCase();
            const matches = text.includes(query);
            item.style.display = matches ? 'flex' : 'none';
          });
        });
      }
    },

    toggle() {
      if (!this.modal) return;
      const isHidden = this.modal.classList.toggle('hidden');

      if (!isHidden) {
        if (this.input) {
          this.input.value = '';
          this.items.forEach((item) => (item.style.display = 'flex'));
          setTimeout(() => this.input.focus(), 50);
        }
      }
    },

    close() {
      if (this.modal && !this.modal.classList.contains('hidden')) {
        this.modal.classList.add('hidden');
      }
    },

    execute(action, param) {
      this.close();
      if (action === 'tab') {
        TabManager.switchTab(param);
      } else if (action === 'theme') {
        ThemeManager.toggle();
      } else if (action === 'copy-email') {
        Security.copyEmail();
      } else if (action === 'contact') {
        Security.openMailClient();
      }
    }
  };

  // ==========================================================================
  // 7. INICIALIZACIÓN DE EVENTOS Y VINCULACIONES (ADDEVENTLISTENER)
  // ==========================================================================
  function setupEventListeners() {
    // 1. Botón de modo claro / oscuro
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => ThemeManager.toggle());
    }

    // 2. Botón de apertura de Paleta de Comandos
    const openCmdButtons = document.querySelectorAll('[data-action="open-cmd"]');
    openCmdButtons.forEach((btn) => {
      btn.addEventListener('click', () => CommandPalette.toggle());
    });

    // 3. Botones para cerrar la Paleta de Comandos
    const closeCmdButtons = document.querySelectorAll('[data-action="close-cmd"]');
    closeCmdButtons.forEach((btn) => {
      btn.addEventListener('click', () => CommandPalette.close());
    });

    // 4. Delegación de clics dentro de la Paleta de Comandos
    const cmdModal = document.getElementById('cmdModal');
    if (cmdModal) {
      cmdModal.addEventListener('click', (e) => {
        // Clic en el backdrop exterior cierra el modal
        if (e.target === cmdModal) {
          CommandPalette.close();
          return;
        }

        const cmdBtn = e.target.closest('[data-cmd-action]');
        if (cmdBtn) {
          const action = cmdBtn.getAttribute('data-cmd-action');
          const param = cmdBtn.getAttribute('data-cmd-param');
          CommandPalette.execute(action, param);
        }
      });
    }

    // 5. Pestañas principales (Tabs)
    const tabButtons = document.querySelectorAll('.tab-btn[data-tab]');
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        TabManager.switchTab(tabId);
      });
    });

    // 6. Capas interactivas de arquitectura
    const layerButtons = document.querySelectorAll('.layer-btn[data-layer]');
    layerButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const layerKey = btn.getAttribute('data-layer');
        LayerManager.inspect(layerKey, btn);
      });
    });

    // 7. Acciones protegidas de Correo / Contacto (Anti-Spam)
    // Botón Header: Contacto directo
    const contactHeaderBtn = document.getElementById('contactHeaderBtn');
    if (contactHeaderBtn) {
      contactHeaderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Security.openMailClient();
      });
    }

    // Botón Footer: Copiar correo protegido con feedback visual
    const secureEmailTrigger = document.getElementById('secureEmailTrigger');
    if (secureEmailTrigger) {
      // Reemplazo visual elegante para usuarios humanos en footer
      secureEmailTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        Security.copyEmail();
      });
    }

    // 8. Atajos de teclado globales (Ctrl + K / Escape)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        CommandPalette.toggle();
      } else if (e.key === 'Escape') {
        CommandPalette.close();
      }
    });
  }

  // ==========================================================================
  // 8. ARRANQUE EN DOMCONTENTLOADED
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    UI.initToastContainer();
    CommandPalette.init();
    setupEventListeners();

    // Revelar correo seguro en el footer dinámicamente para usuarios
    const footerEmailContainer = document.getElementById('footerEmailText');
    if (footerEmailContainer) {
      // Se inyecta tras la carga para que los scrapers estáticos no lo capturen
      footerEmailContainer.textContent = Security.getEmail();
    }
  });
})();
