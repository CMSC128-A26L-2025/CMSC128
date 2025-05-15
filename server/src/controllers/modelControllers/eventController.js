import { Event } from '../../models/Event.js';
import { User } from '../../models/User.js';
import Communication from '../../models/Communication.js';
import Notification from '../../models/Notification.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';
import {
    uploadFilesForModel,
    getFilesForModel,
    deleteFileFromModel,
    downloadFile
  } from "../fileController/fileController.js";
  
export const eventController = {
    ...createCRUDController(Event),

    async create(req, res) {
        try {
            const eventDataFromRequest = { ...req.body };
            let donatableBoolean = false;
            if (typeof eventDataFromRequest.donatable === 'string') {
                donatableBoolean = eventDataFromRequest.donatable.toLowerCase() === 'true';
            } else if (typeof eventDataFromRequest.donatable === 'boolean') {
                donatableBoolean = eventDataFromRequest.donatable;
            }

            let eventDate = eventDataFromRequest.event_date ? new Date(eventDataFromRequest.event_date) : new Date();
            if (isNaN(eventDate.getTime())) {
                eventDate = new Date();
            }

            const eventDocument = {
                event_name: eventDataFromRequest.event_name,
                event_description: eventDataFromRequest.event_description,
                event_date: eventDate,
                venue: eventDataFromRequest.venue,
                created_by: eventDataFromRequest.created_by, 
                attendees: [], 
                link: eventDataFromRequest.link,
                donatable: donatableBoolean,
                files: [], 
            };

            console.log(eventDocument)

            const filesForDb = [];
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    let serverFilenameValue = file.filename;
                    if (file.location) {
                        serverFilenameValue = file.location;
                    }

                    const fileMetadataObject = {
                        name: file.originalname,
                        serverFilename: serverFilenameValue,
                        type: file.mimetype,
                        size: file.size,
                    };
                    filesForDb.push(fileMetadataObject);
                });
            }
            eventDocument.files = filesForDb;

            const newEvent = new Event(eventDocument);
            const savedEvent = await newEvent.save();

            try {
                const communicationContent = `A new event has been posted: "${savedEvent.event_name}". Join us on ${savedEvent.event_date.toLocaleDateString()} at ${savedEvent.venue}. ${savedEvent.link ? 'More details: ' + savedEvent.link : ''}`;
                const newCommunication = new Communication({
                    type: "event",
                    title: `New Event: ${savedEvent.event_name}`,
                    content: communicationContent,
                    posted_by: savedEvent.created_by,
                });
                const savedCommunication = await newCommunication.save();

                const alumniUsers = await User.find({ user_type: "Alumni" }).select('_id');

                if (alumniUsers.length > 0) {
                    const notifications = alumniUsers.map(alumnus => ({
                        user: alumnus._id,
                        announcement: savedCommunication._id,
                        status: "unread",
                    }));
                    await Notification.insertMany(notifications);
                    console.log(`Notifications created for ${alumniUsers.length} alumni for event: ${savedEvent.event_name}`);
                }
            } catch (notificationError) {
                console.error("Error creating notifications for new event:", notificationError);
            }

            res.status(201).json(savedEvent);

        } catch (error) {
            console.error("Error in eventController.create:", error);

            if (req.files && req.files.length > 0) {
                console.log("Attempting to clean up uploaded files due to an error during event creation...");
                for (const file of req.files) {
                    if (file.path) {
                        try {
                            await fs.unlink(file.path);
                            console.log(`Deleted orphaned file: ${file.path}`);
                        } catch (cleanupError) {
                            console.error(`Failed to delete orphaned file ${file.path}:`, cleanupError);
                        }
                    } else {
                        console.warn(`Orphaned file ${file.originalname} has no path, cannot auto-delete. Manual cleanup may be needed if stored in cloud.`);
                    }
                }
            }

            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: "Validation Error", errors: error.errors });
            }
            res.status(500).json({ message: "Server error while creating event." });
        }
    },

    async adminPageEvents(req, res) {
        try {
            const items = await Event.find()
                .select('event_name event_date');
            res.status(200).json(items);
        } catch (err) {
            res.status(400).json({ error: err.message })
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

    async findEventById(req, res) {
        try {
            const { id } = req.params;
            const event = await Event.findById(id);
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            res.status(200).json(event);
        } catch (e) {
            console.error("Error in eventController.findEventById:", e);
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