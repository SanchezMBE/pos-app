import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Business } from "../models/business.js";

import { createVerificationToken } from "../utils/createVerificationToken.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import sendMail from "../utils/sendMail.js";
import { verifyCode } from "../utils/veryCode.js";

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

      res.status(201).json({
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
          },
          token
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

      res.json({
        success: true,
        data: {
          user: {
            username: user.username,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async requestVerification(req, res) {
    try {
      const { username } = req.body;

      const userData = await User.findByName({ username });

      const email = userData.email;
      if (!email) {
        return res.status(404).json({ message: "No se encontró el correo electrónico" });
      }

      const verificationCode = generateVerificationCode();
      const token = createVerificationToken(userData.id, verificationCode, userData.business_id);

      sendMail({
        to: email,
        subject: "Recuperación de contraseña",
        text: `Hola ${userData.full_name}, el código de recuperación es: ${verificationCode}`
      });

      // Devolvemos el token al cliente (pero NO el código)
      res.json({
        success: true,
        message: "Código enviado correctamente",
        token // Este token será necesario para verificar el código posteriormente
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        message: "Error al enviar el código de verificación",
        error: error.message
      });
    }
  }

  static async verifyCode(req, res) {
    const { token, code } = req.body;

    if (!token || !code) {
      return res.status(400).json({ error: "Token y código son requeridos" });
    }

    // Verificamos el código
    const verification = verifyCode(token, code);

    if (!verification) {
      return res.status(400).json({ error: "Código inválido o expirado" });
    }

    // El código es válido, tomamos alguna acción según el caso de uso
    // Por ejemplo, permitir el reset de contraseña

    res.json({
      success: true,
      message: "Verificación exitosa",
      token // Este token será necesario para resetear la contraseña
    });
  }

  static async resetPassword(req, res) {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token y nueva contraseña son requeridos" });
    }

    try {
      // Verificamos el token
      const verification = verifyCode(token);

      if (!verification) {
        return res.status(400).json({ error: "Token inválido o expirado" });
      }

      // Actualizamos la contraseña del usuario
      const hashedPassword = crypto.createHash("sha256").update(newPassword).digest("hex");
      await User.updatePassword(verification.userId, hashedPassword, verification.businessId);

      res.json({
        success: true,
        message: "Contraseña actualizada correctamente"
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        message: "Error al actualizar la contraseña",
        error: error.message
      });
    }
  }
}
