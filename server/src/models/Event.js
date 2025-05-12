import { text } from 'express';
import { Alumni } from './User.js';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const eventSchema = new Schema({
    event_name: { type: String, required: true },
    event_description: { type: String },
    event_date: { type: Date, min: new Date('1940-01-01'), required: true },
    venue: { type: String, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alumni' }],
    link: { type: String },
    files: [
        {
          name: String,
          size: Number,
          type: String,
          lastModified: Number,
          serverFilename: String, // optional
        },
      ],
});

eventSchema.index({ event_name: 1 });
eventSchema.index({ event_date: 1 });
eventSchema.index({ venue: 1 });
eventSchema.index({ created_by: 1 });

const Event = mongoose.model('Event', eventSchema);

export { Event }
