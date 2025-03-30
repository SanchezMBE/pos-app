<template>
  <header>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
  </header>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div class="container">
        <img 
          src="D:\pos-app\pos-app\frontend\public\favicon.ico" 
          alt="Logo de Retail-Insight" 
          class="img-fluid mx-auto d-block"
          link="#"
          style="max-height: 40px;"
        />
        <a class="navbar-brand fw-bold ms-2" href="#">Retail-Insight</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/signup" class="btn btn-primary ms-2">Registrarse</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  
    <!-- Hero Section -->
    <header class="bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">Analítica Minorista <br>Impulsada por IA</h1>
            <p class="lead mb-4">Transforma tus datos operativos en decisiones estratégicas con nuestra plataforma de análisis inteligente para establecimientos minoristas</p>
            <div class="d-flex gap-3">
              <router-link to="/signup" class="btn btn-light btn-lg px-4">
                Comenzar Ahora
              </router-link>
              <!--
              <router-link to="/demo" class="btn btn-outline-light btn-lg px-4">
                Ver Demo
              </router-link>
              -->
            </div>
          </div>
          <div class="col-lg-6 text-center mb-4 mb-lg-0">
            <img 
              src="D:\pos-app\pos-app\frontend\public\Hero.png" 
              alt="Análisis de Datos Retail" 
              class="img-fluid mx-auto d-block"
              style="max-height: 500px;"
            />
          </div>
        </div>
      </div>
    </header>
  
    <!-- Features Section -->
    <section class="py-5">
      <div class="container">
        <h2 class="text-center mb-5">Funcionalidades Principales</h2>
        <div class="row text-center">
          <div class="col-md-4 mb-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <i class="bi bi-file-earmark-bar-graph fs-1 text-primary mb-3"></i>
                <h3 class="card-title">Análisis Automatizado</h3>
                <p class="card-text">Procesa automáticamente datos de ventas, inventario y operaciones con IA generativa.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <i class="bi bi-graph-up-arrow fs-1 text-primary mb-3"></i>
                <h3 class="card-title">Visualizaciones Interactivas</h3>
                <p class="card-text">Obtén informes detallados con gráficos dinámicos que facilitan la toma de decisiones.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <i class="bi bi-lightbulb fs-1 text-primary mb-3"></i>
                <h3 class="card-title">Recomendaciones Estratégicas</h3>
                <p class="card-text">Recibe sugerencias personalizadas basadas en los patrones de consumo de tus clientes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <!-- How It Works Section -->
    <section class="bg-light py-5">
      <div class="container">
        <h2 class="text-center mb-5">Cómo Funciona</h2>
        <div class="row align-items-center">
          <div class="col-md-6 mb-4 mb-md-0">
            <img src="#" alt="Dashboard de Análisis" class="img-fluid rounded shadow" />
          </div>
          <div class="col-md-6">
            <div class="d-flex mb-4">
              <div class="me-3">
                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">1</div>
              </div>
              <div>
                <h4>Integra tus Datos</h4>
                <p>Conecta tus bases de datos o sube archivos CSV con información de ventas e inventario.</p>
              </div>
            </div>
            <div class="d-flex mb-4">
              <div class="me-3">
                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">2</div>
              </div>
              <div>
                <h4>Personaliza tu Análisis</h4>
                <p>Selecciona los parámetros que deseas analizar según tus necesidades específicas.</p>
              </div>
            </div>
            <div class="d-flex">
              <div class="me-3">
                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">3</div>
              </div>
              <div>
                <h4>Obtén Resultados</h4>
                <p>Recibe informes detallados con visualizaciones interactivas y recomendaciones accionables.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Benefits Section -->
    <section class="py-5">
      <div class="container">
        <h2 class="text-center mb-5">Beneficios para tu Negocio</h2>
        <div class="row">
          <div class="col-md-6 col-lg-3 mb-4">
            <div class="card h-100 border-0 shadow-sm text-center">
              <div class="card-body">
                <i class="bi bi-clock fs-1 text-primary mb-3"></i>
                <h4>Ahorra Tiempo</h4>
                <p>Reduce horas de análisis manual con procesamiento automático de datos.</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3 mb-4">
            <div class="card h-100 border-0 shadow-sm text-center">
              <div class="card-body">
                <i class="bi bi-bar-chart fs-1 text-primary mb-3"></i>
                <h4>Aumenta Ventas</h4>
                <p>Identifica oportunidades de venta cruzada y patrones de consumo.</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3 mb-4">
            <div class="card h-100 border-0 shadow-sm text-center">
              <div class="card-body">
                <i class="bi bi-box-seam fs-1 text-primary mb-3"></i>
                <h4>Optimiza Inventario</h4>
                <p>Reduce costos con predicciones precisas de demanda y gestión eficiente.</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3 mb-4">
            <div class="card h-100 border-0 shadow-sm text-center">
              <div class="card-body">
                <i class="bi bi-graph-up fs-1 text-primary mb-3"></i>
                <h4>Mejora Eficiencia</h4>
                <p>Toma decisiones basadas en datos con informes en lenguaje natural.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Technologies Section -->
    <section class="bg-light py-5">
      <div class="container">
        <h2 class="text-center mb-5">Tecnologías que Utilizamos</h2>
        <div class="row justify-content-center text-center">
          <div class="col-6 col-md-2 mb-4">
            <div class="bg-white p-3 rounded shadow-sm h-100 d-flex align-items-center justify-content-center">
              <div>
                <i class="bi bi-filetype-py fs-1 text-primary"></i>
                <p class="mb-0 mt-2">Python</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-2 mb-4">
            <div class="bg-white p-3 rounded shadow-sm h-100 d-flex align-items-center justify-content-center">
              <div>
                <i class="bi bi-database fs-1 text-primary"></i>
                <p class="mb-0 mt-2">SQL</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-2 mb-4">
            <div class="bg-white p-3 rounded shadow-sm h-100 d-flex align-items-center justify-content-center">
              <div>
                <i class="bi bi-robot fs-1 text-primary"></i>
                <p class="mb-0 mt-2">APIs IA</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-2 mb-4">
            <div class="bg-white p-3 rounded shadow-sm h-100 d-flex align-items-center justify-content-center">
              <div>
                <i class="bi bi-server fs-1 text-primary"></i>
                <p class="mb-0 mt-2">PostgreSQL</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-2 mb-4">
            <div class="bg-white p-3 rounded shadow-sm h-100 d-flex align-items-center justify-content-center">
              <div>
                <i class="bi bi-bar-chart-line fs-1 text-primary"></i>
                <p class="mb-0 mt-2">Streamlit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Call to Action -->
    <section class="py-5 bg-primary text-white">
      <div class="container text-center">
        <h2 class="mb-4">¿Listo para Transformar tus Datos en Decisiones?</h2>
        <p class="lead mb-4">Registra tu negocio hoy y descubre el poder de la analítica impulsada por IA.</p>
        <div class="d-flex justify-content-center gap-3">
          <router-link to="/signup" class="btn btn-light btn-lg px-4">
            Comenzar Ahora
          </router-link>
          <!--
          <router-link to="/contact" class="btn btn-outline-light btn-lg px-4">
            Solicitar Demo
          </router-link>
          -->
        </div>
      </div>
    </section>
  
    <!-- Footer -->
    <footer class="bg-dark text-white py-4">
      <div class="container">
        <div class="row">
          <div class="col-md-6 mb-3 mb-md-0">
            <h5>Retail-Insight</h5>
            <p class="mb-0">Plataforma Inteligente para Análisis Operativo en Establecimientos Minoristas</p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="mb-2">&copy; 2025 Retail-Insight. Todos los derechos reservados.</p>
            <div>
              <a href="https://github.com/SanchezMBE/pos-app.git" class="text-white"><i class="bi bi-github"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
  </template>