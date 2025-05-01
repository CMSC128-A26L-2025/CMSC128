import { JobPosting } from "../../models/Job_Posting.js";
import { User } from "../../models/User.js";
import { createCRUDController } from "../middlewareControllers/createCRUDController/index.js";

export const jobPostingController = {
    ...createCRUDController(JobPosting),

    async postJob(req, res) {
        try {
            const {
                job_title,
                company,
                location,
                job_description,
                requirements,
                application_link,
                start_date,
                end_date,
                posted_by
            } = req.body;
    
            let status = 'pending';
            let approved_by = null;
            let approval_date = null;
    
            if (req.user.user_type === 'Admin') {
                status = 'approved';
                approved_by = req.user.userId;
                approval_date = new Date();
            }
    
            const newJob = new JobPosting({
                posted_by: req.user.userId,
                job_title,
                company,
                location,
                job_description,
                requirements,
                application_link,
                date_posted: new Date(),
                start_date,
                end_date,
                status,
                approved_by,
                approval_date
            });
            
            const savedJob = await newJob.save();
    
            if (req.user.user_type === 'Alumni') {
                await User.findByIdAndUpdate(req.user.userId, {
                    $push: { job_postings: savedJob._id }
                });
            }
    
            res.status(201).json({ message: 'Job posted successfully', job: savedJob });
    
        } catch (error) {
            console.error('Error posting job:', error);
            res.status(500).json({ message: 'Failed to post job', error: error.message });
        }
    },

    async adminPageJobs(req, res) {
        try {
            const items = await JobPosting.find({status: 'approved'})
                .select('job_title company');
            res.status(200).json(items);
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    },

    async adminPageJobRequests(req, res) {
        try {
            const items = await JobPosting.find({status: 'pending'})
                .select('_id job_title posted_by')
                .populate('posted_by');
            console.log(items);
            res.status(200).json(items);
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    },

    async jobResults (req, res) {
        try {
            const { sortBy } = req.query;
            let jobs;
    
            if (sortBy === "date") {
                jobs = await JobPosting.find({ status: 'approved' }).sort({ date_posted: 1 }); // Oldest first
            } else if (sortBy === "title") {
                jobs = await JobPosting.find({ status: 'approved' }).sort({ job_title: 1 }); // A → Z
            } else {
                jobs = await JobPosting.find({ status: 'approved' }); // Default: no sorting
            }
    
            console.log("Fetched Jobs:", jobs.length);
            res.status(200).json(jobs);
        } catch (e) {
            console.error("Error in jobPostingController.jobResults:", e);
            res.status(500).json({ message: e.message });
        }
    },

     //  Add Bookmark
     async bookmarkJob(req, res) {
        try {
            const { userId, jobId } = req.body;

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            if (user.bookmarked_jobs.includes(jobId)) {
                return res.status(400).json({ message: "Job already bookmarked" });
            }

            user.bookmarked_jobs.push(jobId);
            await user.save();

            res.status(200).json({ message: "Job bookmarked successfully" });
        } catch (error) {
            console.error("Error bookmarking job:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    //  Unbookmark
    async unbookmarkJob(req, res) {
        try {
            const { userId, jobId } = req.body;

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            user.bookmarked_jobs = user.bookmarked_jobs.filter(id => id.toString() !== jobId);
            await user.save();

            res.status(200).json({ message: "Job unbookmarked successfully" });
        } catch (error) {
            console.error("Error unbookmarking job:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    //  Get all bookmarked jobs for a user
    async getbookmarked_jobs(req, res) {
        try {
            const { userId } = req.query;

            const user = await User.findById(userId).populate('bookmarked_jobs');
            if (!user) return res.status(404).json({ message: "User not found" });

            res.status(200).json(user.bookmarked_jobs);
        } catch (error) {
            console.error("Error fetching bookmarked jobs:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    async findJobById(req, res) {
        try {
            const { id } = req.params;
            const event = await JobPosting.findById(id);
            if (!event) {
                return res.status(404).json({ message: "Job Posting not found" });
            }
            res.status(200).json(event);
        } catch (e) {
            console.error("Error in findJobById: ", e);
            res.status(500).json({ message: e.message });
        }
    }
}