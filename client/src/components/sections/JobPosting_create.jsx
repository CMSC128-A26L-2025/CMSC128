import { useState } from "react";
import axios from "axios";

export const CreateJobPosting = () => {
  const [jobData, setJobData] = useState({
    job_id: 4,
    job_title: "Software Engineer Intern",
    company: "OpenAI",
    location: "San Francisco, CA",
    job_description: "Work on cutting-edge AI research and development.",
    requirements: ["Python", "React", "Node.js"],
    application_link: "https://openai.com/careers",
    start_date: "2025-06-01",
    end_date: "2025-08-30",
  });

  const [files, setFiles] = useState([]);
  const [actualFiles, setActualFiles] = useState([]); // store actual file objects
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles.map(file => file.serverFilename)); // only store names
    setActualFiles(selectedFiles); // store actual file objects
  };
  const dummyJobId = Math.floor(Math.random() * 1000000); // simulate unique ID
  const dummyAlumniId = "660f842eabc123456789abcd"; // replace with real user ID

  const handleSubmit = async () => {
  try {
    const fileFormData = new FormData();
    actualFiles.forEach(file => fileFormData.append("files[]", file));

    const file_res = await axios.post(`http://localhost:5050/job-postings/${jobData.job_id}/upload`, fileFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setFiles(file_res.data.files.map(file => file.serverFilename));

    const jobPostingData = {
      job_id: jobData.job_id,
      posted_by: dummyAlumniId,
      job_title: jobData.job_title,
      company: jobData.company,
      location: jobData.location,
      job_description: jobData.job_description,
      requirements: jobData.requirements,
      application_link: jobData.application_link,
      start_date: jobData.start_date,
      end_date: jobData.end_date,
      date_posted: new Date(),
      status: "pending",
      files: files, // Remove this line
    };

    const res = await axios.post("http://localhost:5050/job-postings/create", jobPostingData); // Send as JSON
    alert("Job posting submitted successfully!");
    console.log("Response:", res.data);
  } catch (err) {
    console.error("Error creating job posting:", err);
    alert("Submission failed.");
  }
};
  
  return (
    <div className="max-w-lg mx-auto p-4 shadow-md mt-8 border rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Create Job Posting</h2>
      <p><strong>Job Title:</strong> {jobData.job_title}</p>
      <p><strong>Company:</strong> {jobData.company}</p>
      <p><strong>Location:</strong> {jobData.location}</p>
      <p><strong>Description:</strong> {jobData.job_description}</p>
      <p><strong>Requirements:</strong> {jobData.requirements.join(", ")}</p>
      <p><strong>Application Link:</strong> {jobData.application_link}</p>
      <p><strong>Start Date:</strong> {jobData.start_date}</p>
      <p><strong>End Date:</strong> {jobData.end_date}</p>

      <div className="my-4">
        <input type="file" multiple onChange={handleFileChange} />
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit Job Posting
      </button>

      {actualFiles.length != 0 && actualFiles?.map((file) => (
        <img  
          key={file.name}
          // src={axios.get(`http://localhost:5050/uploads/${fileName}`)}\
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="w-full max-w-sm rounded my-2 shadow"
        />
      ))}
    </div>
  );
};
