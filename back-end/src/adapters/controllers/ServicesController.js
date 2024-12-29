const Service = require("../../Domain/ServicesEntity")
class ServiceController {
  constructor(serviceRepo) {
    this.serviceRepo = serviceRepo;
  }

  async createService(req, res) {
    try {
      const { title, description }  = req.body;

      if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required." });
      }

      const serviceEntity = new Service({ title, description });
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
      const services = await this.serviceRepo.GetAllServices();
      res.status(200).json(services);
    } catch (err) {
      console.error("Controller error (listServices):", err.message);
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = ServiceController;
