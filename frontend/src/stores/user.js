import axios from "axios";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    business: null,
    isLoading: false
  }),
  actions: {
    async fetchUser() {
      if (this.isLoading) return;

      this.isLoading = true;
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me", { withCredentials: true });

        if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
        this.user = res.data.data.user;
        this.business = res.data.data.business;
        console.log("Fetch user successful:", this.user);
      } catch (error) {
        console.log("Fetch user failed:", error);
        this.user = null;
      } finally {
        this.isLoading = false;
      }
    },
    async login(username, password) {
      try {
        const res = await axios.post(
          "http://localhost:3000/api/auth/login",
          {
            username,
            password
          },
          { withCredentials: true }
        );

        if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
        this.user = res.data.data.user;
        this.business = res.data.data.business;

        console.log("business:", this.business);

        console.log("Login successful:", this.user);
      } catch (error) {
        console.error("Login failed:", error);
        this.user = null;
      }
    },
    async signup(userData) {
      try {
        const res = await axios.post("http://localhost:3000/api/auth/signup", userData, { withCredentials: true });

        if (res.status !== 201) throw new Error(`HTTP ${res.status}`);
        this.user = res.data.data.user;
        this.business = res.data.data.business;

        console.log("Signup successful:", this.user);
      } catch (error) {
        // Handle specific error cases
        if (error.response && error.response.status === 400) {
          console.error("Signup failed: Bad Request", error.response.data);
        } else if (error.response && error.response.status === 409) {
          console.error("Signup failed: User already exists", error.response.data);
        } else {
          console.error("Signup failed:", error);
        }
        console.error("Signup failed:", error);
        this.user = null;
      }
    },
    async logout() {
      try {
        const res = await fetch("http://localhost:3000/api/auth/logout", {
          method: "POST",
          credentials: "include"
        });

        if (!res.ok) throw new Error("Logout failed");

        this.user = null;
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user
  }
});
