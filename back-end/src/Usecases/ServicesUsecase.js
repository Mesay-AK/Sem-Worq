const Service = require("../Domain/ServicesEntity")

class ServiceUseCase {
  constructor(serviceRepo, ServiceEntity) {
    this.serviceRepo = serviceRepo;
  }

  async createService(serviceData) {
    try {
      const serviceEntity = new Service(serviceData);
      serviceEntity.validate(); 

      const newService = new Service(serviceEntity);
      return await this.serviceRepo.CreateService(newService);
      
    } catch (error) {
      console.log("usecase error", error)
      throw error;
    }
  }

  async updateService(id, updatedFields) {
    try {
      if (!id) throw new Error('Service ID is required for updates.');

      return await this.serviceRepo.UpdateService(id, updatedFields);
    } catch (error) {
      throw new Error(`Use case error: Unable to update service. ${error.message}`);
    }
  }

  async deleteService(id) {
    try {
      if (!id) throw new Error('Service ID is required for deletion.');

      return await this.serviceRepo.DeleteService(id);
    } catch (error) {
      throw new Error(`Use case error: Unable to delete service. ${error.message}`);
    }
  }

  async listAllServices() {
    try {
      return await this.serviceRepo.GetAllServices();
    } catch (error) {
      throw new Error(`Use case error: Unable to list services. ${error.message}`);
    }
  }
}

module.exports = ServiceUseCase;
