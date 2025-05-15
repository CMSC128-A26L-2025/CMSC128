import mongoose from 'mongoose';
const { Schema } = mongoose;

const CommunicationSchema = new Schema({
  type: { type: String, enum: ["announcement", "newsletter", "event", "job_posting"], required: true }, // merged into one field
  title: { type: String, required: true },
  content: { type: String, required: true },
  date_published: { type: Date, default: Date.now },
  posted_by: { type: Schema.Types.ObjectId, ref: "Admin", required: true }
});

const Communication = mongoose.model("Communication", CommunicationSchema);
export default Communication;
