import Communication from '../../models/Communication.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';


export const communicationController = {
    ...createCRUDController(Communication),
}