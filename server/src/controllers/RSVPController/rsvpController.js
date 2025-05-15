import RSVP from "../../models/RSVP.js"
import { Event } from "../../models/Event.js"

export const createRSVP = async (req, res) => {
    try {
        const { eventID } = req.params;
        const { status } = req.body;
        const alumniID = req.user.userId; // get user id of currently logged in user
        // get user id of currently logged in user
        console.log(eventID, status, alumniID);


        const existingRSVP = await RSVP.findOne({ event: eventID, alumni: alumniID });

        // check for any existing RSVPs of alumnus for chosen event
        if (existingRSVP) {
            return res.status(400).json({ message: "You've already RSVP'd for this event." });
        }

        // Add alumni to event's attendees array if not already present
        await Event.findByIdAndUpdate(
            eventID,
            { $addToSet: { attendees: alumniID } }
        );

        const newRSVP = await RSVP.create({ event: eventID, alumni: alumniID, status });
        res.status(201).json(newRSVP);


    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export const editRSVP = async (req, res) => {
    try {
        const { status } = req.body;
        const { eventID } = req.params;
        const alumniID = req.user._id;

        const updatedRSVP = await RSVP.findOneAndUpdate(
            { event: eventID, alumni: alumniID },
            { $set: { status } },
            { new: true, runValidators: true }
        );

        if (!updatedRSVP) {
            return res.status(404).json({ message: "RSVP for event does not exist" });
        }

        res.status(200).json({ message: "RSVP updated successfully", updatedRSVP });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const viewRSVP = async (req, res) => {
    try {
        const alumniID = req.user._id;

        const existingRSVP = await RSVP.find({ alumni: alumniID })
            .populate({
                path: "event",
                select: "event_name event_date venue"
            })
            .sort({ "event.event_date": -1 })
            .lean();

        if (existingRSVP.length === 0) {
            return res.status(404).json({ message: "No existing RSVPs" });
        }

        res.status(200).json({ message: "RSVPs retrieved successfully", existingRSVP });
    } catch (e) {
        console.error("Error fetching RSVPs:", e.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
