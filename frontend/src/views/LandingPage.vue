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
          alt="Logo de StorePOS" 
          class="img-fluid mx-auto d-block"
          link="#"
          style="max-height: 40px"
        />
        <a class="navbar-brand fw-bold ms-2" href="#">StorePOS</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/login" class="nav-link"
                >Iniciar Sesión</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/signup" class="btn btn-primary ms-2"
                >Registrarse</router-link
              >
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
            <h1 class="display-4 fw-bold mb-4">
              Sistema de Punto de Venta <br />Para Tiendas de Abarrotes
            </h1>
            <p class="lead mb-4">
              Gestiona tu inventario, ventas y finanzas de manera eficiente con
              nuestro sistema integral diseñado específicamente para tiendas de
              conveniencia
            </p>
            <div class="d-flex gap-3">
              <router-link to="/signup" class="btn btn-light btn-lg px-4">
                Comenzar Gratis
              </router-link>
            </div>
          </div>
          <div class="col-lg-6 text-center mb-4 mb-lg-0">
            <img 
              src="D:\pos-app\pos-app\frontend\public\Hero.png" 
              alt="Sistema de Punto de Venta" 
              class="img-fluid mx-auto d-block"
              style="max-height: 500px"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section class="py-5">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-4 mb-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <i class="bi bi-cart-check fs-1 text-primary mb-3"></i>
                <h3 class="card-title">Gestión de Ventas</h3>
                <p class="card-text">
                  Registra ventas de manera rápida e intuitiva, optimizando el
                  flujo de atención al cliente.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <i class="bi bi-box-seam fs-1 text-primary mb-3"></i>
                <h3 class="card-title">Control de Inventario</h3>
                <p class="card-text">
                  Actualización en tiempo real del stock con alertas de
                  productos con baja existencia.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <i class="bi bi-cash-stack fs-1 text-primary mb-3"></i>
                <h3 class="card-title">Corte de Caja</h3>
                <p class="card-text">
                  Conciliación financiera automatizada que reduce errores en el
                  manejo del efectivo.
                </p>
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
            <img
              src="#"
              alt="Dashboard del Sistema POS"
              class="img-fluid rounded shadow"
            />
          </div>
          <div class="col-md-6">
            <div class="d-flex mb-4">
              <div class="me-3">
                <div
                  class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                  style="width: 50px; height: 50px"
                >
                  1
                </div>
              </div>
              <div>
                <h4>Configura tu Tienda</h4>
                <p>
                  Registra tus productos, categorías y precios para comenzar a
                  operar rápidamente.
                </p>
              </div>
            </div>
            <div class="d-flex mb-4">
              <div class="me-3">
                <div
                  class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                  style="width: 50px; height: 50px"
                >
                  2
                </div>
              </div>
              <div>
                <h4>Gestiona tus Ventas</h4>
                <p>
                  Realiza transacciones de manera eficiente con una interfaz
                  adaptada para tiendas de abarrotes.
                </p>
              </div>
            </div>
            <div class="d-flex">
              <div class="me-3">
                <div
                  class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                  style="width: 50px; height: 50px"
                >
                  3
                </div>
              </div>
              <div>
                <h4>Monitorea tu Negocio</h4>
                <p>
                  Accede a reportes detallados sobre ventas, inventario y
                  finanzas para tomar mejores decisiones.
                </p>
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
                <i class="bi bi-speedometer2 fs-1 text-primary mb-3"></i>
                <h4>Mayor Rapidez</h4>
                <p>
                  Agiliza las transacciones y reduce las filas en tu
                  establecimiento.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3 mb-4">
            <div class="card h-100 border-0 shadow-sm text-center">
              <div class="card-body">
                <i class="bi bi-graph-up fs-1 text-primary mb-3"></i>
                <h4>Control Financiero</h4>
                <p>
                  Seguimiento preciso de ventas y ganancias con reportes
                  automatizados.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3 mb-4">
            <div class="card h-100 border-0 shadow-sm text-center">
              <div class="card-body">
                <i class="bi bi-box-seam fs-1 text-primary mb-3"></i>
                <h4>Menos Pérdidas</h4>
                <p>
                  Reduce faltantes con alertas de stock y control de fechas de
                  caducidad.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3 mb-4">
            <div class="card h-100 border-0 shadow-sm text-center">
              <div class="card-body">
                <i class="bi bi-shield-check fs-1 text-primary mb-3"></i>
                <h4>Mayor Seguridad</h4>
                <p>Sistema de roles que protege la información sensible de tu negocio.</p>
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
                <i class="bi bi-filetype-js fs-1 text-primary"></i>
                <p class="mb-0 mt-2">Node.js</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-2 mb-4">
            <div class="bg-white p-3 rounded shadow-sm h-100 d-flex align-items-center justify-content-center">
              <div>
                <i class="bi bi-database fs-1 text-primary"></i>
                <p class="mb-0 mt-2">MySQL</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-2 mb-4">
            <div class="bg-white p-3 rounded shadow-sm h-100 d-flex align-items-center justify-content-center">
              <div>
                <i class="bi bi-server fs-1 text-primary"></i>
                <p class="mb-0 mt-2">Supabase</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-2 mb-4">
            <div class="bg-white p-3 rounded shadow-sm h-100 d-flex align-items-center justify-content-center">
              <div>
                <i class="bi bi-code-slash fs-1 text-primary"></i>
                <p class="mb-0 mt-2">Vite</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-2 mb-4">
            <div class="bg-white p-3 rounded shadow-sm h-100 d-flex align-items-center justify-content-center">
              <div>
                <i class="bi bi-vue fs-1 text-primary"></i>
                <p class="mb-0 mt-2">Vue.js</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="bg-light py-5">
      <div class="container text-center">
        <h2 class="mb-4">¿Listo para Optimizar la Gestión de tu Tienda?</h2>
        <p class="lead mb-4">
          Registra tu negocio hoy y mejora la eficiencia de tu punto de venta.
        </p>
        <div class="d-flex justify-content-center gap-3">
          <router-link to="/signup" class="btn btn-primary btn-lg px-4">
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
            <h5>StorePOS</h5>
            <p class="mb-0">
              Sistema Integral de Punto de Venta para Tiendas de Abarrotes
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="mb-2">
              &copy; 2025 StorePOS. Todos los derechos reservados.
            </p>
            <div>
              <a
                href="https://github.com/SanchezMBE/pos-app.git"
                class="text-white"
                ><i class="bi bi-github"></i
              ></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
