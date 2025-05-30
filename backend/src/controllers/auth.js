import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Business } from "../models/business.js";

export class AuthController {
  static async signup(req, res) {
    try {
      // Extract business and user details from the nested structure
      const { business, user } = req.body;

      const { username, password, full_name } = user;
      const { name, address, phone, email } = business;

      // Verify if the username already exists
      const existingUsers = await User.findByName({ username });
      if (existingUsers) {
        return res.status(400).json({
          success: false,
          error: "Credenciales inválidas"
        });
      }

      const newBusiness = {
        name,
        address,
        phone,
        email
      };

      // First, create the business record
      const businessResult = await Business.create({
        businessData: newBusiness
      });

      const business_id = businessResult.id;

      // Hash the password with SHA-256
      const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

      const userRole = "admin";

      // Create a new user admin with the business_id from the created business
      const newUser = {
        username,
        password: hashedPassword,
        full_name,
        role: userRole
      };

      const userResult = await User.create({
        userData: newUser,
        businessId: business_id
      });

      const token = jwt.sign(
        { id: userResult.id, business_id: userResult.business_id, role: userResult.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h"
        }
      );

      res
        .cookie("access_token", token, {
          httpOnly: true, // the cookie is not accessible via JavaScript
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 // 1 hour
        })
        .status(201)
        .json({
          success: true,
          data: {
            business: {
              name: businessResult.name,
              address: businessResult.address,
              phone: businessResult.phone,
              email: businessResult.email
            },
            user: {
              username: userResult.username,
              full_name: userResult.full_name,
              role: userResult.role
            }
          },
          message: "Negocio y usuario creados correctamente"
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.findByName({ username });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Credenciales inválidas"
        });
      }

      const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

      if (user.password !== hashedPassword) {
        return res.status(401).json({
          success: false,
          error: "Credenciales inválidas"
        });
      }

      // Creación del token JWT
      const token = jwt.sign({ id: user.id, business_id: user.business_id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h"
      });

      res
        .cookie("access_token", token, {
          httpOnly: true, // the cookie is not accessible via JavaScript
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 // 1 hour
        })
        .json({
          success: true,
          data: {
            user: {
              username: user.username,
              full_name: user.full_name,
              role: user.role
            }
          }
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async logout(req, res) {
    try {
      // Invalidate the token by not returning it or by using a blacklist strategy
      // Here we simply send a success response
      res.clearCookie("access_token").json({
        success: true,
        message: "Sesión cerrada correctamente"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getMe(req, res) {
    try {
      const user = req.user; // User is set by the authentication middleware

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "No autenticado"
        });
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            role: user.role,
            business_id: user.business_id
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}
