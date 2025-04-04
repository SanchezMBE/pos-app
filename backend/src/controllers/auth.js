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
          error: "Invalid credentials"
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
          }
        },
        message: "Business and user created successfully"
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
          error: "Invalid credentials"
        });
      }

      const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

      if (user.password !== hashedPassword) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials"
        });
      }

      // Creación del token JWT
       
      const token = jwt.sign({ id: user.id, business_id: user.business_id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h"
      });

      res.json({ token });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}
