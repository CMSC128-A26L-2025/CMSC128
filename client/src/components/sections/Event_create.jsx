import { useState } from "react";
import axios from "axios";

export const CreateEvent= () => {


  const [eventData, setEventData] = useState({
    event_name: "Alumni Homecoming 2025",
    event_description: "A special gathering for all alumni to reconnect, network, and celebrate shared memories.",
    event_date: new Date("2025-08-15"),
    venue: "University Main Auditorium",
    created_by: "663230fa3e1a9c9a07e0b12d", // Example Admin ObjectId
    attendees: [
        "663245bc4b1c4d9c8c8f0123",
        "6632467a4b1c4d9c8c8f0456",
        "663247aa4b1c4d9c8c8f0789"
    ], // Example Alumni ObjectIds
    link: "https://www.facebook.com/share/p/1EpBQ9TGCN/"
      
    }
    );
    const [files, setFiles] = useState([]);
    const [actualFiles, setActualFiles] = useState([]); // Store actual file objects



    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles.map(file => file.serverFilename)); // only store names
        setActualFiles(selectedFiles); // store actual file objects
    };

  const handleSubmit = async () => {
  try {
    const fileFormData = new FormData();
    actualFiles.forEach(file => fileFormData.append("files[]", file));

    // 1. Upload Files
    const file_res = await axios.post(`http://localhost:5050/events/${eventData.event_id}/upload`, fileFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("File upload response:", file_res.data.files); // Log the response
    const uploadedFiles = file_res.data.files.map(file => file.serverFilename)
    // setFiles(uploadedFiles);
    // console.log("FILES:" + uploadedFiles)
    // 2. Create Event Posting (Separate Request)
    const eventPostingData = {
        event_name: eventData.event_name,
        event_description: eventData.event_description,
        event_date: eventData.event_date,
        venue: eventData.venue,
        created_by: eventData.created_by,
        attendees: eventData.attendees,
        link: eventData.link,
        files: uploadedFiles, 
    }

    const res = await axios.post("http://localhost:5050/events/create", eventPostingData); // Send as JSON
    alert("Job posting submitted successfully!");
    console.log("Response:", res.data);
  } catch (err) {
    console.error("Error creating job posting:", err);
    alert("Submission failed.");
  }
};
  
  return (
    <div className="max-w-lg mx-auto p-4 shadow-md mt-8 border rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Create Event</h2>
        <p><strong>Event Name:</strong> {eventData.event_name}</p>
        <p><strong>Description:</strong> {eventData.event_description || "N/A"}</p>
        <p><strong>Date:</strong> {new Date(eventData.event_date).toLocaleDateString()}</p>
        <p><strong>Venue:</strong> {eventData.venue}</p>
        <p><strong>Link:</strong> {
        eventData.link 
            ? <a href={eventData.link} target="_blank" rel="noopener noreferrer">{eventData.link}</a>
            : "N/A"
        }</p>
        <p><strong>Created By (Admin ID):</strong> {eventData.created_by}</p>
        <p><strong>Attendees:</strong> {
        eventData.attendees && eventData.attendees.length > 0 
            ? eventData.attendees.join(", ") 
            : "None"
        }</p>

      <div className="my-4">
        <input type="file" multiple onChange={handleFileChange} />
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit Event
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
