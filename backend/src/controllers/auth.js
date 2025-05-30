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
        {
          user_id: userResult.id,
          business_id: userResult.business_id,
          role: userResult.role
        },
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
      const userResult = await User.findByName({ username });

      if (!userResult) {
        return res.status(401).json({
          success: false,
          error: "Credenciales inválidas"
        });
      }

      const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

      if (userResult.password !== hashedPassword) {
        return res.status(401).json({
          success: false,
          error: "Credenciales inválidas"
        });
      }

      const token = jwt.sign(
        {
          user_id: userResult.id,
          business_id: userResult.business_id,
          role: userResult.role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h"
        }
      );

      const businessResult = await Business.findById({ id: userResult.business_id });
      if (!businessResult) {
        return res.status(404).json({
          success: false,
          error: "Negocio no encontrado"
        });
      }

      res
        .cookie("access_token", token, {
          httpOnly: true, // the cookie is not accessible via JavaScript
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 // 1 hour
        })
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
      const session = req.session; // Assuming session contains user information

      if (!session || !session.user_id) {
        return res.status(401).json({
          success: false,
          error: "No autenticado"
        });
      }

      const userResult = await User.findById({ id: session.user_id });
      if (!userResult) {
        return res.status(404).json({
          success: false,
          error: "Usuario no encontrado"
        });
      }

      const businessResult = await Business.findById({ id: userResult.business_id });
      if (!businessResult) {
        return res.status(404).json({
          success: false,
          error: "Negocio no encontrado"
        });
      }

      res.json({
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
