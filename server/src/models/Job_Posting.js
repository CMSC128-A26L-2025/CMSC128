import mongoose from 'mongoose';
const { Schema } = mongoose;

const jobPostingSchema = new Schema({
    job_id: { type: Number, required: true },
    posted_by: { type: Schema.Types.ObjectId, ref: 'Alumni', required: true },
    job_title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    job_description: { type: String, required: true },
    requirements: { type: [String], required: true },
    application_link: { type: String, required: true },
    date_posted: { type: Date, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        required: true
    },
    approved_by: { type: Schema.Types.ObjectId, ref: 'Admin' },
    approval_date: {
        type: Date,
        default: null
    },
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

// Add indexes
jobPostingSchema.index({ job_id: 1 }, { unique: true });
jobPostingSchema.index({ posted_by: 1 });
jobPostingSchema.index({ company: 1 });
jobPostingSchema.index({ location: 1 });
jobPostingSchema.index({ date_posted: 1 });
jobPostingSchema.index({ status: 1 });
jobPostingSchema.index({ company: 1, location: 1 });
jobPostingSchema.index({ status: 1, date_posted: -1 });
jobPostingSchema.index({ posted_by: 1, status: 1 });

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);
export { JobPosting }
