import { JobPosting } from "../../models/Job_Posting.js";
import { User } from "../../models/User.js";
import { createCRUDController } from "../middlewareControllers/createCRUDController/index.js";
import {
    uploadFilesForModel,
    getFilesForModel,
    deleteFileFromModel,
    downloadFile
  } from "../fileController/fileController.js";
export const jobPostingController = {
    ...createCRUDController(JobPosting),

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

    async fetchJobCount (req, res) {
        try {
           
            let jobs = await JobPosting.find(); // Default: no sorting
            
            console.log("Fetched Jobs:", jobs.length);
            res.status(200).json(jobs.length);
        } catch (e) {
            console.error("Error in jobPostingController.jobResults:", e);
            res.status(500).json({ message: e.message });
        }
    },

    async approveJob(req, res){
        try {
            const {userId, jobId} = req.body;
            const user = await User.findById(userId);
            if (user.user_type != "Admin") return res.status(401).json({ message: "Unauthorized" });

            const job = await JobPosting.findById(jobId);
            if(!job) return res.status(404).json({ message: "Job not found" });
            
            if(job.status == "approved") return res.status(400).json({ message: "Job already approved" }); 
            else if(job.status == "rejected") return res.status(400).json({ message: "Job already rejected" }); 
            job.approval_date = new Date();
            job.status = "approved";
            await job.save();

            res.status(200).json({message: "Job approved successfully"});
        }
        catch(e){
            console.error("Error approving job:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    async disapproveJob(req, res){
        try {
            const {userId, jobId} = req.body;
            const user = await User.findById(userId);
            if (user.user_type != "Admin") return res.status(401).json({ message: "Unauthorized" });

            const job = await JobPosting.   findById(jobId);
            if(!job) return res.status(404).json({ message: "Job not found" });
            
            if(job.status == "rejected") return res.status(400).json({ message: "Job already rejected" }); 
            if(job.status == "approved") return res.status(400).json({ message: "Job already approved" }); 
            
            job.status = "rejected";
            await job.save();

            res.status(200).json({message: "Job rejected successfully"});
        }
        catch(e){
            console.error("Error rejecting job:", error);
            res.status(500).json({ message: "Internal server error" });
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

    async uploadJobFiles (req, res){
        req.params.modelName = "JobPosting";
        req.params.id = req.params.job_id; // Assuming job_id is passed in the URL
        return uploadFilesForModel(req, res);
    },
      
    
    async getJobFiles(req, res) {
        req.params.modelName = "JobPosting";
        return getFilesForModel(req, res);
    }
}