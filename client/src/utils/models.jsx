import event1 from "../assets/event.png";
import notice1 from "../assets/notice1.png";
import notice2 from "../assets/notice2.png";
export const jobRequiremets  =[
  { value: 'Python', label: 'Python', isFixed: true },
  { value: 'Java', label: 'Java'},
  { value: 'C', label: 'C' },
  { value: 'SQL', label: 'SQL', isFixed: true },
  { value: 'CSS', label: 'CSS', },
  { value: 'Rust', label: 'Rust', },
  { value: 'C++', label: 'C++', },
  { value: 'OOP', label: 'OOp', },
];
export const jobList = [
  
    {
      job_id: 1,
      posted_by: 123,
      job_title: 'Frontend Developer',
      company: 'NextWeb PH',
      location: 'Makati, Metro Manila',
      job_description: 'Develop and maintain web UI components.',
      requirements: ['React', 'JavaScript', 'CSS'],
      application_link: 'https://nextwebph.com/apply',
      date_posted: new Date('2025-03-01T09:00:00Z'),
      status: 'pending',
      approved_by: null,
      approval_date: null,
      image: notice2
    },
    {
      job_id: 2,
      posted_by: 124,
      job_title: 'Backend Developer',
      company: 'CodeHaus',
      location: 'Cebu City',
      job_description: 'Build and maintain backend services and APIs.',
      requirements: ['Node.js', 'Express', 'MySQL'],
      application_link: 'https://codehaus.com/jobs',
      date_posted: new Date('2025-02-15T09:00:00Z'),
      status: 'approved',
      approved_by: 101,
      approval_date: new Date('2025-02-16T09:00:00Z'),
      image: notice1
    },
    {
      job_id: 3,
      posted_by: 125,
      job_title: 'Data Analyst',
      company: 'Insight Analytics',
      location: 'Davao City',
      job_description: 'Analyze and interpret data to guide business decisions.',
      requirements: ['SQL', 'Python', 'Power BI'],
      application_link: 'https://insightanalytics.ph/apply',
      date_posted: new Date('2025-01-20T09:00:00Z'),
      status: 'rejected',
      approved_by: null,
      approval_date: null,
      image: event1
    },
    {
      job_id: 4,
      posted_by: 126,
      job_title: 'DevOps Engineer',
      company: 'SkyTech Solutions',
      location: 'Quezon City',
      job_description: 'Manage deployment pipelines and system uptime.',
      requirements: ['Docker', 'Kubernetes', 'AWS'],
      application_link: 'https://skytech.ph/careers',
      date_posted: new Date('2025-03-12T09:00:00Z'),
      status: 'pending',
      approved_by: null,
      approval_date: null,
      image: notice2
    },
    {
      job_id: 5,
      posted_by: 127,
      job_title: 'UI/UX Designer',
      company: 'Pixel Perfect',
      location: 'Taguig',
      job_description: 'Design intuitive user interfaces and craft exceptional user experiences.',
      requirements: ['Figma', 'Sketch', 'Adobe XD'],
      application_link: 'https://pixelperfect.com.ph/careers',
      date_posted: new Date('2025-02-01T09:00:00Z'),
      status: 'approved',
      approved_by: 102,
      approval_date: new Date('2025-02-02T09:00:00Z'),
      image: notice1
    },
    {
      job_id: 6,
      posted_by: 128,
      job_title: 'IT Support Specialist',
      company: 'TechAssist PH',
      location: 'Iloilo City',
      job_description: 'Provide technical support and troubleshoot issues.',
      requirements: ['Windows OS', 'Hardware', 'Networking'],
      application_link: 'https://techassist.ph/apply',
      date_posted: new Date('2025-01-05T09:00:00Z'),
      status: 'pending',
      approved_by: null,
      approval_date: null,
      image: event1
    },
    {
      job_id: 7,
      posted_by: 129,
      job_title: 'Mobile Developer',
      company: 'Appify',
      location: 'Baguio City',
      job_description: 'Develop Android and iOS applications.',
      requirements: ['Flutter', 'React Native', 'Firebase'],
      application_link: 'https://appify.ph/jobs',
      date_posted: new Date('2025-03-05T09:00:00Z'),
      status: 'approved',
      approved_by: 103,
      approval_date: new Date('2025-03-06T09:00:00Z'),
      image: notice1
    },
    {
      job_id: 8,
      posted_by: 130,
      job_title: 'Marketing Coordinator',
      company: 'MarketWise PH',
      location: 'Pasig City',
      job_description: 'Coordinate marketing campaigns and analytics.',
      requirements: ['Digital Marketing', 'SEO', 'Content Creation'],
      application_link: 'https://marketwise.ph/apply',
      date_posted: new Date('2025-02-20T09:00:00Z'),
      status: 'rejected',
      approved_by: null,
      approval_date: null,
      image: notice2
    },
    {
      job_id: 9,
      posted_by: 131,
      job_title: 'Database Administrator',
      company: 'DataSync',
      location: 'Cagayan de Oro',
      job_description: 'Manage and secure database systems.',
      requirements: ['MySQL', 'Oracle DB', 'Backup Solutions'],
      application_link: 'https://datasync.ph/careers',
      date_posted: new Date('2025-03-25T09:00:00Z'),
      status: 'pending',
      approved_by: null,
      approval_date: null,
      image: event1
    },
    {
      job_id: 10,
      posted_by: 132,
      job_title: 'Software Engineer',
      company: 'TechBridge',
      location: 'Batangas City',
      job_description: 'Join our dynamic tech team to build and maintain modern web applications.',
      requirements: ['Java', 'Spring Boot', 'REST APIs'],
      application_link: 'https://techbridge.com.ph/jobs',
      date_posted: new Date('2025-03-10T09:00:00Z'),
      status: 'approved',
      approved_by: 104,
      approval_date: new Date('2025-03-11T09:00:00Z'),
      image: notice1
    },
];  
  
export const announcementList = [
    {
      announcement_id: 1,
      title: 'Important Update',
      context: 'There will be a system maintenance tonight at 10 PM.',
      date_posted: new Date('2025-04-10T09:00:00Z'),
      posted_by: 123,
      image: notice1
    },
    {
      announcement_id: 2,
      title: 'Holiday Notice',
      context: 'The office will be closed on December 25th for Christmas.',
      date_posted: new Date('2024-12-20T09:00:00Z'),
      posted_by: 124,
      image: notice2
    },
    {
      announcement_id: 3,
      title: 'New Employee Orientation',
      context: 'New employees are invited to attend the orientation on June 1st.',
      date_posted: new Date('2025-04-01T09:00:00Z'),
      posted_by: 125,
      image: event1
    },
    {
      announcement_id: 4,
      title: 'Upcoming Webinar',
      context: 'Join us for a webinar on cloud computing on May 20th.',
      date_posted: new Date('2025-04-05T09:00:00Z'),
      posted_by: 126,
      image: notice1
    },
    {
      announcement_id: 5,
      title: 'Software Update',
      context: 'A new version of the software will be released next week.',
      date_posted: new Date('2025-04-08T09:00:00Z'),
      posted_by: 127,
      image: notice2
    },
    {
      announcement_id: 6,
      title: 'Job Fair Invitation',
      context: 'We are hosting a job fair next month. Make sure to attend!',
      date_posted: new Date('2025-04-07T09:00:00Z'),
      posted_by: 128,
      image: event1
    },
    {
      announcement_id: 7,
      title: 'Training Session',
      context: 'A training session on the new system will be held on April 10th.',
      date_posted: new Date('2025-04-01T09:00:00Z'),
      posted_by: 129,
      image: notice1
    },
    {
      announcement_id: 8,
      title: 'Employee of the Month',
      context: 'Congratulations to Sarah for being Employee of the Month!',
      date_posted: new Date('2025-04-03T09:00:00Z'),
      posted_by: 130,
      image: notice2
    },
    {
      announcement_id: 9,
      title: 'Project Deadline',
      context: 'The project deadline has been extended to May 15th.',
      date_posted: new Date('2025-04-03T09:00:00Z'),
      posted_by: 131,
      image: event1
    },
    {
      announcement_id: 10,
      title: 'Office Renovation',
      context: 'The office will undergo renovations starting next week.',
      date_posted: new Date('2025-04-03T09:00:00Z'),
      posted_by: 132,
      image: notice1
    },
];

export const eventList = [
    {
      event_id: 1,
      event_name: 'Tech Talk: AI sa Edukasyon',
      event_description: 'Learn how AI contributes to the field of education in the Philippines.',
      event_date: new Date('2025-05-15T14:00:00Z'),
      venue: 'Room 101, UP Tech Center, Quezon City',
      created_by: 123,
      attendees: [1001, 1002, 1003],
      donatable:true,
      image: event1
    },
    {
      event_id: 2,
      event_name: 'Hackathon Pilipinas 2025',
      event_description: 'Join a 24-hour coding competition with the top student developers in the country.',
      event_date: new Date('2025-06-10T09:00:00Z'),
      venue: 'iAcademy Nexus Campus, Makati City',
      created_by: 124,
      attendees: [1004, 1005, 1006],
      donatable:false,
      image: notice1
    },
    {
      event_id: 3,
      event_name: 'Tech Networking Night',
      event_description: 'An evening of connections and opportunities for tech professionals in the country.',
      event_date: new Date('2025-07-20T18:00:00Z'),
      venue: 'The Astbury, Makati',
      created_by: 125,
      attendees: [1007, 1008, 1009],
      donatable:false,
      image: notice2
    },
    {
      event_id: 4,
      event_name: 'Paglulunsad ng Produkto: NextGen PH',
      event_description: 'Discover the latest products developed by Filipino tech innovators.',
      event_date: new Date('2025-08-05T11:00:00Z'),
      venue: 'SMX Convention Center, Pasay City',
      created_by: 126,
      attendees: [1010, 1011, 1012],
      donatable:true,
      image: event1
    },
    {
      event_id: 5,
      event_name: 'Blockchain Conference PH',
      event_description: 'Discuss the current trends and future of blockchain in the Philippines.',
      event_date: new Date('2025-09-15T09:00:00Z'),
      venue: 'Function Hall B, Cebu IT Park',
      created_by: 127,
      attendees: [1013, 1014, 1015],
      donatable:false,
      image: notice1
    },
    {
      event_id: 6,
      event_name: 'AI Workshop: Hands-on Session',
      event_description: 'Learn the basic concepts of AI through live demonstrations.',
      event_date: new Date('2025-10-01T13:00:00Z'),
      venue: 'Room 202, FEU Tech Building, Manila',
      created_by: 128,
      attendees: [1016, 1017, 1018],
      donatable:false,
      image: notice2
    },
    {
      event_id: 7,
      event_name: 'Cloud Summit Pilipinas',
      event_description: 'Join us in exploring the possibilities of cloud computing in local settings.',
      event_date: new Date('2025-11-10T10:00:00Z'),
      venue: 'Philippine International Convention Center (PICC), Pasay City',
      created_by: 129,
      attendees: [1019, 1020, 1021],
      donatable:false,
      image: event1
    },
    {
      event_id: 8,
      event_name: 'Startup Pinoy Showcase',
      event_description: 'Present your innovative startup idea to local investors.',
      event_date: new Date('2025-12-01T15:00:00Z'),
      venue: 'LaunchGarage, Quezon City',
      created_by: 130,
      attendees: [1022, 1023, 1024],
      donatable:true,
      image: notice1
    },
    {
      event_id: 9,
      event_name: 'Design Thinking Workshop Manila',
      event_description: 'A creative approach to problem-solving through design thinking.',
      event_date: new Date('2025-12-10T14:00:00Z'),
      venue: 'The Common Ground, BGC, Taguig',
      created_by: 131,
      attendees: [1025, 1026, 1027],
      donatable:false,
      image: notice2
    },
    {
      event_id: 10,
      event_name: 'Cybersecurity Summit PH 2025',
      event_description: 'Learn about new and advanced threats and protections in the digital world.',
      event_date: new Date('2025-01-12T08:00:00Z'),
      venue: 'Cyberzone Conference Hall, SM North EDSA, Quezon City',
      created_by: 132,
      attendees: [1028, 1029, 1030],
      donatable:false,
      image: event1
    },
];  