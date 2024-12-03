const ServiceModel = require("../Infrastructures/models/ServicesModel")
// const ServicesPageIntroModel = require("../Infrastructures/models/ServicesPageIntroModel")

const CreateService = async (service) => {
    try{
        const newService = new ServiceModel(service)
        return await newService.save()
    }
    catch (error){
        console.log("error in repo")
        throw new Error (`Error while creating services : ${error.message}`);
    }
};


const UpdateService = async(id, updatedFields) => {
    try{
        const updatedService = await ServiceModel.findByIdAndUpdate(id, updatedFields, {new : true});

        if (!updatedService) {
            throw new Error(`Service with ID ${id} not found.`);
        }
        return updatedService;
    }catch(error){
        throw new Error(`Error updating sevices: ${error.message}`)
    }
};

const DeleteService = async (id) => {
    try {
        const deleteServices = await ServiceModel.findByIdAndDelete(id);
        if (!deleteServices){
            throw new Error(`Service with ID ${id} not found.`);
        }
        return deleteServices
    }catch(error){
        throw new Error(`Error deleting service: ${error.message}`)
    }
}

const GetAllServices = async () => {
    try{
        return await ServiceModel.find();
    }catch(error){
        throw new Error(`Error retrieving services: ${error.message}`)
    }
}




module.exports = {
    CreateService, 
    UpdateService, 
    DeleteService, 
    GetAllServices,

};