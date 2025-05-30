import { Business } from "../../models/business.js";
import { User } from "../../models/user.js";

export class ProfileController {
  static async getMe(req, res) {
    try {
      const businessId = req.session.business_id;
      const userId = req.session.user_id;

      const user = await User.findById({ id: userId });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        });
      }

      const business = await Business.findById({ id: businessId });
      if (!business) {
        return res.status(404).json({
          success: false,
          message: "Negocio no encontrado"
        });
      }
      return res.status(200).json({
        success: true,
        data: {
          business: {
            name: business.name,
            address: business.address,
            phone: business.phone,
            email: business.email
          },
          user: {
            username: user.username,
            full_name: user.full_name,
            role: user.role
          }
        }
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Error al obtener el usuario"
      });
    }
  }

  static async update(req, res) {
    try {
      const userData = req.body;
      const userId = req.session.user_id;

      userData.role = userData.role || "admin";

      const updatedUser = await User.update({
        id: userId,
        userData
      });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          user: {
            username: updatedUser.username,
            full_name: updatedUser.full_name,
            role: updatedUser.role
          }
        },
        message: "Perfil actualizado correctamente"
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Error al actualizar el perfil"
      });
    }
  }

  static async updateBusiness(req, res) {
    try {
      const businessData = req.body;
      const businessId = req.session.business_id;

      const updatedBusiness = await Business.update({
        businessId,
        businessData
      });

      if (!updatedBusiness) {
        return res.status(404).json({
          success: false,
          message: "Negocio no encontrado"
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          business: {
            name: updatedBusiness.name,
            address: updatedBusiness.address,
            phone: updatedBusiness.phone,
            email: updatedBusiness.email
          }
        },
        message: "Negocio actualizado correctamente"
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Error al actualizar el negocio"
      });
    }
  }
}
