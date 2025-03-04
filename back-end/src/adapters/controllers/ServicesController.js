const Service = require("../../Domain/ServicesEntity");

class ServiceController {
  constructor(serviceRepo) {
    this.serviceRepo = serviceRepo;
  }

  async createService(req, res) {
    try {
      const { title, description } = req.body;
      const image = req.file ? req.file.buffer : null; // Get the image buffer from req.file

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
      res.status(201).json(result);
    } catch (err) {
      console.error("Controller error (createService):", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  async updateService(req, res) {
    try {
      const { id } = req.params;
      const updatedFields = req.body;
      const image = req.file ? req.file.buffer : null; // Get the image buffer from req.file if it exists

      if (image) {
        updatedFields.image = image; // If the image is provided, update it
      }

      if (!id) throw new Error('Service ID is required for updates.');

      const updatedService = await this.serviceRepo.UpdateService(id, updatedFields);
      res.status(200).json(updatedService);
    } catch (err) {
      console.error("Controller error (updateService):", err.message);
      res.status(err.message.includes("not found") ? 404 : 500).json({ message: err.message });
    }
  }

  async deleteService(req, res) {
    try {
      const { id } = req.params;

      if (!id) throw new Error('Service ID is required for deletion.');

      const DeletedService = await this.serviceRepo.DeleteService(id);

      res.status(200).json({ message: "Service deleted successfully", deleted: DeletedService });
    } catch (err) {
      console.error("Controller error (deleteService):", err.message);
      res.status(err.message.includes("not found") ? 404 : 500).json({ message: err.message });
    }
  }

  async listServices(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const portfolios = await this.serviceRepo.GetAllServices(page, limit);
      const total = await this.ServiceRepo.count();

      const result = {
        portfolios,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
      res.json(result);
    } catch (err) {
      console.error("Controller error (listServices):", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  // Get a service by its ID
  async getServiceById(req, res) {
    try {
      const { id } = req.params;

      if (!id) throw new Error("Service ID is required.");

      const service = await this.serviceRepo.GetServiceById(id);

      if (!service) {
        return res.status(404).json({ message: "Service not found." });
      }

      // Convert the image buffer to base64 string
      const base64Image = service.image.toString('base64');
      const imageUrl = `data:image/png;base64,${base64Image}`;

      // Return the service along with the base64-encoded image
      res.status(200).json({
        service: {
          id: service._id,
          title: service.title,
          description: service.description,
          image: imageUrl,  // Send the base64 image string
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        }
      });
    } catch (err) {
      console.error("Controller error (getServiceById):", err.message);
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = ServiceController;
