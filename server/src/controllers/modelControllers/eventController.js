import { Event } from '../../models/Event.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';
import {
    uploadFilesForModel,
    getFilesForModel,
    deleteFileFromModel,
    downloadFile
  } from "../fileController/fileController.js";
export const eventController = {
    ...createCRUDController(Event),

    async adminPageEvents(req, res) {
        try {
            const items = await Event.find()
                .select('event_name event_date');
            res.status(200).json(items);
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    },

    async readSort(req, res) {
        try {

            const { sortBy } = req.query;
            let events;
    
            if (sortBy === "date") {
                events = await Event.find().sort({ event_date: -1 }); // Sort newest first
            } else if (sortBy === "title") {
                events = await Event.find().sort({ event_name: 1 }); // Sort A → Z
            } else {
                events = await Event.find(); // Default: return unsorted events
            }
    
            console.log("Fetched Events:", events.length);
            res.status(200).json(events);
        } catch (e) {
            console.error("Error in eventController.read:", e);
            res.status(500).json({ message: e.message });
        }
    },

    async uploadEventFiles (req, res){
        req.params.modelName = "Event";
        req.params.id = req.params.event_id;
        return uploadFilesForModel(req, res);
    },
        
    
    async getEventFiles(req, res) {
        req.params.modelName = "Event";
        req.params.id = req.params.event_id; 
        return getFilesForModel(req, res);
    },
}