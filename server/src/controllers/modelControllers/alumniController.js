import { Alumni, AlumniCollection } from '../../models/User.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';

export const alumniController = {
    ...createCRUDController(Alumni),

    async findAlumniById(req, res) {
        try {
            const { id } = req.params;
            const event = await Alumni.findById(id);
            if (!event) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(event);
        } catch (e) {
            console.error("Error in eventController.findAlumniById:", e);
            res.status(500).json({ message: e.message });
        }
    },

    async deleteByEmail(req, res) {
        try {
            const { email } = req.params;
            const deleted = await Alumni.findOneAndDelete({ email });
        
            if (!deleted) return res.status(404).json({ message: 'User not found' });
        
            res.status(200).json({ message: 'User deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async editProfile(req, res) {
        if (req.params.id !== req.user.userId) {
            return res.status(401)
        }
        
        try {
            const { contact_number, address, current_job_title, company, industry, skills } = req.body;
        
            const updatedUser = await Alumni.findByIdAndUpdate(
            req.params.id,
            {
                contact_number,
                address,
                current_job_title,
                company,
                industry,
                skills,
            },
            { new: true, runValidators: true }
            ).select('-password');
        
            if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
            }
        
            res.json({ message: 'Profile updated successfully!', user: updatedUser });
        } catch (err) {
            console.error(err);
            if (err.name === 'ValidationError') {
            const errors = {};
            for (const field in err.errors) {
                errors[field] = err.errors[field].message;
            }
            return res.status(400).json({ message: 'Validation error', errors });
            }
            res.status(500).json({ message: 'Server error' });
        }
    }
}

// Controller function to search for alumni based on query parameters
export const alumniSearch = async (req, res) => {
    try {
      const {
        name = '',
        degree = '',
        startYear,
        endYear,
        current_job_title = '',
        company = '',
        skills = ''
      } = req.query;
  
      // Initialize the match stage with profile visibility
      const matchStage = {
        profile_visibility: true,
      };
  
      // Add filters only if they are non-empty
      if (name) matchStage.name = { $regex: name, $options: 'i' }; // Case-insensitive name search
      if (degree) matchStage.degree = { $regex: degree, $options: 'i' }; // Case-insensitive degree search
      if (current_job_title) matchStage.current_job_title = { $regex: current_job_title, $options: 'i' }; // Job title match
      if (company) matchStage.company = { $regex: company, $options: 'i' }; // Company name match
  
      // Handle skills: Use $in to match any skill in the array
      if (skills) {
        const skillsArray = skills.split(',').map(skill => skill.trim()); // Convert skills string to array
        matchStage.skills = { $in: skillsArray }; // Match any skill in the array
      }
  
      // Handle graduation year range
      if (startYear && endYear) {
        matchStage.graduation_year = { $gte: parseInt(startYear), $lte: parseInt(endYear) };
      }
  
      console.log("Match Stage:", matchStage); // Debug match stage
  
      // Perform the aggregation query
      const alumni = await Alumni.aggregate([
        { $match: matchStage },
        {
          $addFields: {
            lastname: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    { $split: ["$name", " "] },
                    -1,
                  ],
                },
                "",
              ],
            },
          },
        },
        { $sort: { lastname: 1 } },
      ]);
  
      if (alumni.length === 0) {
        return res.status(404).json({ message: 'No alumni match the search criteria.' });
      }
  
      res.status(200).json(alumni);
    } catch (error) {
      console.error("Alumni Search Error:", error.message, error.stack);
      res.status(500).json({ message: "Server error while searching alumni.", error: error.message });
    }
  };