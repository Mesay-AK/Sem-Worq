const ServiceModel = require("../Infrastructures/models/ServicesModel");

class ServiceRepository {

  async CreateService(service) {
    try {
      const checkExistance = await ServiceModel.findOne(service);

      if (checkExistance){
        throw new Error("Service already Exists.")
      }
      const newService = new ServiceModel(service);
      return await newService.save();
    } catch (error) {

      console.error("Error in repository (createService):", error.message);
      throw new Error(`Error while creating service: ${error.message}`);
    }
  }

  async UpdateService(id, updatedFields) {
    try {
      const updatedService = await ServiceModel.findByIdAndUpdate(id, updatedFields, { new: true });

      if (!updatedService) {
        throw new Error(`Service with ID ${id} not found.`);
      }

      return updatedService;
    } catch (error) {
      console.error("Error in repository (updateService):", error.message);
      throw new Error(`Error updating service: ${error.message}`);
    }
  }

  async DeleteService(id) {
    try {
      const deletedService = await ServiceModel.findByIdAndDelete(id);

      if (!deletedService) {
        throw new Error(`Service with ID ${id} not found.`);
      }

      return deletedService;
    } catch (error) {
      console.error("Error in repository (deleteService):", error.message);
      throw new Error(`Error deleting service: ${error.message}`);
    }
  }

  async GetAllServices() {
    try {
      return await ServiceModel.find();
    } catch (error) {
      console.error("Error in repository (getAllServices):", error.message);
      throw new Error(`Error retrieving services: ${error.message}`);
    }
  }
}

module.exports = ServiceRepository;
