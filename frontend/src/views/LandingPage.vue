<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div class="container">
        <img 
          src="D:\pos-app\pos-app\frontend\public\favicon.ico" 
          alt="Punto de Venta Logo" 
          class="img-fluid mx-auto d-block"
          link="#"
          style="max-height: 40px;"
        />
        <a class="navbar-brand fw-bold ms-2" href="#">POS App</a>
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
        <h1 class="display-4 fw-bold mb-4">Simplifica tu Negocio con nuestro <br>Punto de Venta</h1>
        <p class="lead mb-4">Gestiona tus ventas, inventario y clientes de manera fácil y eficiente</p>
        <div class="d-flex gap-3">
          <router-link to="/signup" class="btn btn-light btn-lg px-4">
            Comenzar Gratis
          </router-link>
        </div>
      </div>
      <div class="col-lg-6 text-center mb-4 mb-lg-0">
        <img 
          src="D:\pos-app\pos-app\frontend\public\Hero.png" 
          alt="Punto de Venta Logo" 
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
        <div class="row text-center">
          <div class="col-md-4 mb-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <i class="bi bi-cash-coin fs-1 text-primary mb-3 d-block"></i>
                <h3 class="card-title">Ventas Simples</h3>
                <p class="card-text">Procesa ventas rápidamente con nuestra interfaz intuitiva.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <i class="bi bi-graph-up fs-1 text-primary mb-3 d-block"></i>
                <h3 class="card-title">Reportes Detallados</h3>
                <p class="card-text">Obtén insights precisos sobre el rendimiento de tu negocio.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <i class="bi bi-people fs-1 text-primary mb-3 d-block"></i>
                <h3 class="card-title">Gestión de Clientes</h3>
                <p class="card-text">Mantén un registro completo de tus clientes y sus compras.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="bg-light py-5">
      <div class="container text-center">
        <h2 class="mb-4">¿Listo para Transformar tu Negocio?</h2>
        <p class="lead mb-4">Regístrate hoy y comienza a optimizar tus ventas.</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4">
      <div class="container text-center">
        <p class="mb-0">&copy; 2024 Punto de Venta. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>