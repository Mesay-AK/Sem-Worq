class ServiceController {
  constructor(serviceUseCases) {
    this.serviceUseCases = serviceUseCases;
  }

  async createService(req, res) {
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required." });
      }

      const newService = await this.serviceUseCases.CreateService({ title, description });
      res.status(201).json(newService);
    } catch (err) {
      console.error("Controller error (createService):", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  async updateService(req, res) {
    try {
      const { id } = req.params;
      const updatedFields = req.body;

      const updatedService = await this.serviceUseCases.UpdateService(id, updatedFields);
      res.status(200).json(updatedService);
    } catch (err) {
      console.error("Controller error (updateService):", err.message);
      res.status(err.message.includes("not found") ? 404 : 500).json({ message: err.message });
    }
  }

  async deleteService(req, res) {
    try {
      const { id } = req.params;

      await this.serviceUseCases.DeleteService(id);
      res.status(200).json({ message: "Service deleted successfully" });
    } catch (err) {
      console.error("Controller error (deleteService):", err.message);
      res.status(err.message.includes("not found") ? 404 : 500).json({ message: err.message });
    }
  }

  async listServices(req, res) {
    try {
      const services = await this.serviceUseCases.ListAllServices();
      res.status(200).json(services);
    } catch (err) {
      console.error("Controller error (listServices):", err.message);
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = ServiceController;
