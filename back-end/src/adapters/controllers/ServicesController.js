const Service = require("../../Domain/ServicesEntity");

class ServiceController {
  constructor(serviceRepo) {
    this.serviceRepo = serviceRepo;
  }

  convertImageToBase64(imageBuffer) {
    if (imageBuffer) {
      return `data:image/png;base64,${imageBuffer.toString("base64")}`;
    }
    return null;
  }

 async createService(req, res) {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.buffer : null;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    if (!image) {
      return res.status(400).json({ message: "Image is required." });
    }

    const serviceEntity = new Service({ title, description, image });

    serviceEntity.validate(); 

    const newService = new Service(serviceEntity);

    const result = await this.serviceRepo.CreateService(newService);

    res.status(201).json({ success: true, service: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

  async updateService(req, res) {
    try {
      const { id } = req.params;
      const updatedFields = req.body;
      const image = req.file ? req.file.buffer : null;

      if (image) {
        updatedFields.image = image;  
      }

      if (!id) {
        return res.status(400).json({ message: "Service ID is required for updates." });
      }

      const updatedService = await this.serviceRepo.UpdateService(id, updatedFields);
      if (!updatedService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.status(200).json({ success: true, service: updatedService });
    } catch (err) {
      res.status(err.message.includes("not found") ? 404 : 500).json({ success: false, message: err.message });
    }
  }

  // Delete a service
  async deleteService(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Service ID is required for deletion." });
      }

      const deletedService = await this.serviceRepo.DeleteService(id);
      if (!deletedService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.status(200).json({ success: true, message: "Service deleted successfully", deletedService });
    } catch (err) {
      res.status(err.message.includes("not found") ? 404 : 500).json({ success: false, message: err.message });
    }
  }

 async listServices(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;  
    const limit = parseInt(req.query.limit, 10) || 10;  

    if (page <= 0 || limit <= 0) {
      return res.status(400).json({ success: false, message: "Page and limit must be positive integers." });
    }

    const services = await this.serviceRepo.GetAllServices(page, limit);
    const total = await this.serviceRepo.count(); 

    const result = {
      success: true,
      services, 
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: "Unexpected error" });
  }
}

  async getServiceById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Service ID is required." });
      }

      const service = await this.serviceRepo.GetServiceById(id);
      if (!service) {
        return res.status(404).json({ message: "Service not found." });
      }

      const imageUrl = this.convertImageToBase64(service.image);

      res.status(200).json({
        success: true,
        service: {
          id: service._id,
          title: service.title,
          description: service.description,
          image: imageUrl,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = ServiceController;
