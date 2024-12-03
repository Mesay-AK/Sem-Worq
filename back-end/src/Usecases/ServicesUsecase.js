const Service = require("../Domain/ServicesEntity")
// const ServicePageIntro = require("../Domain/ServicesEntity/ServicePageIntro")
const serviceRepo = require("../Repositories/ServicesRepo")


const CreateService = async (serviceData) =>{
    try {
        const serviceEntity = new Service(serviceData);
        serviceEntity.validate(); 

        const newService = new Service(serviceEntity);
        return await serviceRepo.CreateService(newService)

    }catch (error){
     
        throw new Error(`Use case error: Unable to create service. ${error.message}`);
    }
};

const UpdateService = async (id, updatedFields) => {
  try {

    if (!id) throw new Error('Service ID is required for updates.');

    return await serviceRepo.UpdateService(id, updatedFields);

  } catch (error) {
    throw new Error(`Use case error: Unable to update service. ${error.message}`);
  }
};

const DeleteService = async (id) => {
  try {
    if (!id) throw new Error('Service ID is required for deletion.');
    return await serviceRepo.DeleteService(id);
  } catch (error) {
    throw new Error(`Use case error: Unable to delete service. ${error.message}`);
  }
};


const ListAllServices = async () => {
  try {
    return await serviceRepo.GetAllServices();
  } catch (error) {
    throw new Error(`Use case error: Unable to list services. ${error.message}`);
  }
};

module.exports = {
    CreateService,
    UpdateService,
    DeleteService,
    ListAllServices,
}