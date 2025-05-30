<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <div id="page-content-wrapper" class="flex-grow-1 bg-light p-4">
      <div class="card-body">
        <h2 class="fw-bold mb-4">Perfil de Administrador</h2>

        <!-- Alertas -->
        <div v-if="alert.show" :class="`alert alert-${alert.type} alert-dismissible fade show`" role="alert">
          {{ alert.message }}
          <button type="button" class="btn-close" @click="hideAlert"></button>
        </div>

        <!-- Datos Personales -->
        <div class="card shadow-lg border-0 mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0"><i class="bi bi-person-circle me-2"></i>Datos Personales</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="updatePersonalData">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="fullName" class="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    class="form-control"
                    id="fullName"
                    v-model="personalData.full_name"
                    :readonly="!editingPersonal"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="username" class="form-label">Usuario</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    v-model="personalData.username"
                    :readonly="!editingPersonal"
                    :class="{ 'is-invalid': errors.username }"
                    required
                  />
                  <div v-if="errors.username" class="invalid-feedback">
                    {{ errors.username }}
                  </div>
                </div>
              </div>

              <div class="row" v-if="editingPersonal">
                <div class="col-md-6 mb-3">
                  <label for="password" class="form-label">Nueva Contraseña (opcional)</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="personalData.password"
                    :class="{ 'is-invalid': errors.password }"
                    placeholder="Dejar vacío para mantener actual"
                  />
                  <div v-if="errors.password" class="invalid-feedback">
                    {{ errors.password }}
                  </div>
                  <small class="form-text text-muted">
                    Máximo 8 caracteres, debe incluir al menos un número y un carácter especial
                  </small>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
                  <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    v-model="confirmPassword"
                    :class="{ 'is-invalid': errors.confirmPassword }"
                    placeholder="Confirmar nueva contraseña"
                  />
                  <div v-if="errors.confirmPassword" class="invalid-feedback">
                    {{ errors.confirmPassword }}
                  </div>
                </div>
              </div>

              <div class="d-flex gap-2">
                <button
                  v-if="!editingPersonal"
                  type="button"
                  class="btn btn-outline-primary"
                  @click="toggleEditPersonal"
                >
                  <i class="bi bi-pencil-square me-2"></i>Editar
                </button>
                <template v-else>
                  <button type="submit" class="btn btn-success" :disabled="loadingPersonal">
                    <span v-if="loadingPersonal" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check-lg me-2"></i>Guardar
                  </button>
                  <button type="button" class="btn btn-secondary" @click="cancelEditPersonal">
                    <i class="bi bi-x-lg me-2"></i>Cancelar
                  </button>
                </template>
              </div>
            </form>
          </div>
        </div>

        <!-- Datos del Negocio -->
        <div class="card shadow-lg border-0">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0"><i class="bi bi-shop me-2"></i>Datos del Negocio</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateBusinessData">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="businessName" class="form-label">Nombre del Negocio</label>
                  <input
                    type="text"
                    class="form-control"
                    id="businessName"
                    v-model="businessData.name"
                    :readonly="!editingBusiness"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="businessPhone" class="form-label">Número Telefónico</label>
                  <input
                    type="tel"
                    class="form-control"
                    id="businessPhone"
                    v-model="businessData.phone"
                    :readonly="!editingBusiness"
                    :class="{ 'is-invalid': errors.phone }"
                    maxlength="10"
                  />
                  <div v-if="errors.phone" class="invalid-feedback">
                    {{ errors.phone }}
                  </div>
                  <small class="form-text text-muted">Máximo 10 dígitos</small>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="businessAddress" class="form-label">Dirección</label>
                  <input
                    class="form-control"
                    id="businessAddress"
                    v-model="businessData.address"
                    :readonly="!editingBusiness"
                    rows="2"
                  ></input>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="businessEmail" class="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    class="form-control"
                    id="businessEmail"
                    v-model="businessData.email"
                    :readonly="!editingBusiness"
                    :class="{ 'is-invalid': errors.email }"
                  />
                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
                  </div>
                </div>
              </div>

              <div class="d-flex gap-2">
                <button
                  v-if="!editingBusiness"
                  type="button"
                  class="btn btn-outline-success"
                  @click="toggleEditBusiness"
                >
                  <i class="bi bi-pencil-square me-2"></i>Editar
                </button>
                <template v-else>
                  <button type="submit" class="btn btn-success" :disabled="loadingBusiness">
                    <span v-if="loadingBusiness" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check-lg me-2"></i>Guardar
                  </button>
                  <button type="button" class="btn btn-secondary" @click="cancelEditBusiness">
                    <i class="bi bi-x-lg me-2"></i>Cancelar
                  </button>
                </template>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import "bootstrap-icons/font/bootstrap-icons.css";
import Sidebar from "@/components/Sidebar.vue";
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
const router = useRouter();

const user = ref({
  username: "Usuario",
  role: ""
});

// Estados de edición
const editingPersonal = ref(false);
const editingBusiness = ref(false);
const loadingPersonal = ref(false);
const loadingBusiness = ref(false);

// Datos personales
const personalData = ref({
  full_name: "",
  username: "",
  password: ""
});

const originalPersonalData = ref({});
const confirmPassword = ref("");

// Datos del negocio
const businessData = ref({
  name: "",
  address: "",
  phone: "",
  email: ""
});

const originalBusinessData = ref({});

// Errores de validación
const errors = ref({});

// Sistema de alertas
const alert = ref({
  show: false,
  type: "success",
  message: ""
});

// Funciones de alertas
const showAlert = (type, message) => {
  alert.value = {
    show: true,
    type,
    message
  };
  setTimeout(() => {
    hideAlert();
  }, 5000);
};

const hideAlert = () => {
  alert.value.show = false;
};

// Validaciones
const validatePassword = (password) => {
  if (!password) return true; // Opcional

  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasNumber) {
    return "La contraseña debe incluir al menos un número";
  }

  if (!hasSpecialChar) {
    return "La contraseña debe incluir al menos un carácter especial";
  }

  return null;
};

const validateEmail = (email) => {
  if (!email) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "El correo electrónico no tiene un formato válido";
  }

  return null;
};

const validatePhone = (phone) => {
  if (!phone) return null;

  if (!/^\d+$/.test(phone)) {
    return "El teléfono solo debe contener números";
  }

  if (phone.length > 10) {
    return "El teléfono debe tener máximo 10 dígitos";
  }

  return null;
};

// Funciones de datos personales
const toggleEditPersonal = () => {
  editingPersonal.value = true;
  originalPersonalData.value = { ...personalData.value };
  personalData.value.password = "";
  confirmPassword.value = "";
  errors.value = {};
};

const cancelEditPersonal = () => {
  editingPersonal.value = false;
  personalData.value = { ...originalPersonalData.value };
  confirmPassword.value = "";
  errors.value = {};
};

const updatePersonalData = async () => {
  errors.value = {};

  // Validar contraseña
  if (personalData.value.password) {
    const passwordError = validatePassword(personalData.value.password);
    if (passwordError) {
      errors.value.password = passwordError;
    }

    if (personalData.value.password !== confirmPassword.value) {
      errors.value.confirmPassword = "Las contraseñas no coinciden";
    }
  }
  
  if (Object.keys(errors.value).length > 0) {
    return;
  }

  loadingPersonal.value = true;

  try {
    const updateData = {
      full_name: personalData.value.full_name,
      username: personalData.value.username
    };

    if (personalData.value.password) {
      updateData.password = personalData.value.password;
    }

    const response = await axios.put("http://localhost:3000/api/admin/profile/me", updateData, { withCredentials: true });
     console.log("Datos personales actualizados:", response.data.data.user);
    // Actualizar datos del usuario en el store
    const userStore = useUserStore();
    userStore.user = response.data.data.user;
    user.value = response.data.data.user;
    
    editingPersonal.value = false;
    showAlert("success", "Datos personales actualizados correctamente");
  } catch (error) {
    // console.error("Error actualizando datos personales:", error);
    // showAlert("danger", "Error al actualizar los datos personales");
  } finally {
    loadingPersonal.value = false;
  }
};

// Funciones de datos del negocio
const toggleEditBusiness = () => {
  editingBusiness.value = true;
  originalBusinessData.value = { ...businessData.value };
  errors.value = {};
};

const cancelEditBusiness = () => {
  editingBusiness.value = false;
  businessData.value = { ...originalBusinessData.value };
  errors.value = {};
};

const updateBusinessData = async () => {
  errors.value = {};

  // Validar teléfono
  const phoneError = validatePhone(businessData.value.phone);
  if (phoneError) {
    errors.value.phone = phoneError;
    return;
  }

  const emailError = validateEmail(businessData.value.email);
  if (emailError) {
    errors.value.email = emailError;
    return;
  }

  if (Object.keys(errors.value).length > 0) {
    return;
  }

  loadingBusiness.value = true;

  try {
    const response = await axios.put("http://localhost:3000/api/admin/profile/business", businessData.value, { withCredentials: true });
    const userStore = useUserStore();
    // Actualizar datos del negocio en el store
    userStore.business = response.data.data.business;
    

    editingBusiness.value = false;
    showAlert("success", "Datos del negocio actualizados correctamente");
  } catch (error) {
    console.error("Error actualizando datos del negocio:", error);
    showAlert("danger", "Error al actualizar los datos del negocio");
  } finally {
    loadingBusiness.value = false;
  }
};

onMounted(async () => {
  const userStore = useUserStore();

  if (userStore.isAuthenticated) {
    personalData.value = userStore.user;
    businessData.value = userStore.business;
    user.value = userStore.user;
  } else {
    // Redirigir al login si no está autenticado
    router.push("/login");
  }
});
</script>

<style scoped>
.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
}

.form-control:read-only {
  background-color: #f8f9fa;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>
