export interface RadarJob {
  id: string;
  role: string;
  company: string;
  companyLogo: string;
  companyColor: string;
  salary: string;
  type: string;
  postedTime: string;
  tags: string[];
  directAts: boolean;
  applyUrl: string;
  description: string;
}

export interface RadarCity {
  id: string;
  name: string;
  stateCountry: string;
  countryCode: "india" | "usa" | "europe" | "apac";
  coordinates: [number, number]; // [longitude, latitude]
  activeJobsCount: number;
  highlightRole: string;
  jobs: RadarJob[];
}

export interface CountryRegion {
  id: string;
  name: string;
  code: string;
  label: string;
  flag: string;
  center: [number, number];
  zoom: number;
  cities: RadarCity[];
}

export const RADAR_CITIES: RadarCity[] = [
  {
    id: "sf-bay",
    name: "San Francisco",
    stateCountry: "CA, USA",
    countryCode: "usa",
    coordinates: [-122.4194, 37.7749],
    activeJobsCount: 6,
    highlightRole: "AI / Systems Engineer",
    jobs: [
  {
    "id": "ashby-openai-8fb1615c-34bf-47c4-a1d1-b7b2f836bbd3",
    "role": "Technical Program Manager, Compute Infrastructure",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-blue-600 to-indigo-700",
    "salary": "$165,000 - $240,000",
    "type": "Hybrid • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "DEVOPS",
      "San Francisco, CA",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/8fb1615c-34bf-47c4-a1d1-b7b2f836bbd3",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-240d459b-696d-43eb-8497-fab3e56ecd9b",
    "role": "Research Engineer",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-amber-500 to-orange-600",
    "salary": "$165,000 - $240,000",
    "type": "Hybrid • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "AI",
      "San Francisco, CA",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/240d459b-696d-43eb-8497-fab3e56ecd9b",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-7322d344-9325-4a92-8445-0a2c4e9272f8",
    "role": "Research Engineer, Retrieval & Search, Applied Engineering",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-sky-500 to-blue-700",
    "salary": "$165,000 - $240,000",
    "type": "Hybrid • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "AI",
      "San Francisco, CA",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/7322d344-9325-4a92-8445-0a2c4e9272f8",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-2560ed50-5535-42b8-b069-9ebc28ce7493",
    "role": "Researcher, Robustness & Safety Training",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-emerald-500 to-teal-700",
    "salary": "$165,000 - $240,000",
    "type": "Hybrid • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "AI",
      "San Francisco, CA",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/2560ed50-5535-42b8-b069-9ebc28ce7493",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-3c67f712-697d-48d8-b05c-01be896e61da",
    "role": "Software Engineer, Scaled Abuse",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-purple-500 to-indigo-700",
    "salary": "$165,000 - $240,000",
    "type": "Hybrid • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "ENGINEERING",
      "San Francisco, CA",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/3c67f712-697d-48d8-b05c-01be896e61da",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-f763c6b3-5167-4a67-b691-4c3fa2c44156",
    "role": "Software Engineer, Data Infrastructure",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-rose-500 to-pink-700",
    "salary": "$165,000 - $240,000",
    "type": "Hybrid • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "DEVOPS",
      "San Francisco, CA",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/f763c6b3-5167-4a67-b691-4c3fa2c44156",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  }
]
  },
  {
    id: "nyc",
    name: "New York",
    stateCountry: "NY, USA",
    countryCode: "usa",
    coordinates: [-74.006, 40.7128],
    activeJobsCount: 6,
    highlightRole: "Full Stack / FinTech",
    jobs: [
  {
    "id": "ashby-openai-5bbc43df-558a-4e4b-a0cf-83f185c664d7",
    "role": "Manager, Forward Deployed Engineering- NYC",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-blue-600 to-indigo-700",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "ENGINEERING",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/5bbc43df-558a-4e4b-a0cf-83f185c664d7",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-533c0fc9-b773-476d-9f96-a0528efbab0e",
    "role": "Forward Deployed Software Engineer - NYC",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-amber-500 to-orange-600",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "ENGINEERING",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/533c0fc9-b773-476d-9f96-a0528efbab0e",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-7bdd4df4-b53d-4442-a116-69be7d9d4b1f",
    "role": "Deployment Lead, Financial Services- NYC",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-sky-500 to-blue-700",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "ENGINEERING",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/7bdd4df4-b53d-4442-a116-69be7d9d4b1f",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-66288824-8b77-4774-bc57-6825d3e6221e",
    "role": "Full Stack Software Engineer, API Experience ",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-emerald-500 to-teal-700",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "SOFTWARE",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/66288824-8b77-4774-bc57-6825d3e6221e",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-0a24703f-6108-4422-807e-78831dd98ed1",
    "role": "Manager, Applied AI Engineering  (Enterprise)",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-purple-500 to-indigo-700",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "AI",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/0a24703f-6108-4422-807e-78831dd98ed1",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-2a931dd1-5002-47d1-a367-ec1a19ef7e9e",
    "role": "Forward Deployed Engineer (FDE), Healthcare - NYC",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-rose-500 to-pink-700",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "ENGINEERING",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/2a931dd1-5002-47d1-a367-ec1a19ef7e9e",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  }
]
  },
  {
    id: "blr",
    name: "Bangalore",
    stateCountry: "Karnataka, India",
    countryCode: "india",
    coordinates: [77.5946, 12.9716],
    activeJobsCount: 6,
    highlightRole: "Backend / Cloud Platform",
    jobs: [
  {
    "id": "ashby-openai-bf036b23-cd23-46d0-a02f-4b1483f4698a",
    "role": "Applied AI Engineer",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-blue-600 to-indigo-700",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "AI",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/bf036b23-cd23-46d0-a02f-4b1483f4698a",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-87989505-81e5-4513-bba0-5f00bb064216",
    "role": "Partner AI Deployment Engineer - AWS",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-amber-500 to-orange-600",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "AI",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/87989505-81e5-4513-bba0-5f00bb064216",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-2e127590-8604-4901-ac38-8dfd8e9e255f",
    "role": "B2B Marketing Lead, India",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-sky-500 to-blue-700",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "ENGINEERING",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/2e127590-8604-4901-ac38-8dfd8e9e255f",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-a1b4bfdf-673a-4ac4-a459-70118caabc09",
    "role": "Regional Client Partner, Ads Solutions (Mumbai)",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-emerald-500 to-teal-700",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "AI",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/a1b4bfdf-673a-4ac4-a459-70118caabc09",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-ecd7b6d6-cf20-4e14-a90a-8501cd460557",
    "role": "Strategy & Operations Lead - India",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-purple-500 to-indigo-700",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "ENGINEERING",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/ecd7b6d6-cf20-4e14-a90a-8501cd460557",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-elevenlabs-fb1fd9cc-bd6d-4895-be29-4bc37d0c31a0",
    "role": "Enterprise Solutions Engineer - India",
    "company": "ElevenLabs",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-rose-500 to-pink-700",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "ENGINEERING",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/elevenlabs/fb1fd9cc-bd6d-4895-be29-4bc37d0c31a0",
    "description": "Direct official application at ElevenLabs. 100% verified ATS requisition."
  }
]
  },
  {
    id: "london",
    name: "London",
    stateCountry: "UK",
    countryCode: "europe",
    coordinates: [-0.1278, 51.5074],
    activeJobsCount: 6,
    highlightRole: "Distributed Systems",
    jobs: [
  {
    "id": "ashby-openai-46703db4-6023-4ac6-93a8-22dc95009945",
    "role": "Software Engineer, Integrity Foundations - London",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-blue-600 to-indigo-700",
    "salary": "$165,000 - $240,000",
    "type": "Hybrid • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "ENGINEERING",
      "London, UK",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/46703db4-6023-4ac6-93a8-22dc95009945",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-621bb104-9daa-4c9e-949a-03d5730334e8",
    "role": "Software Engineer, ChatGPT Infrastructure",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-amber-500 to-orange-600",
    "salary": "$165,000 - $240,000",
    "type": "Hybrid • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "DEVOPS",
      "London, UK",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/621bb104-9daa-4c9e-949a-03d5730334e8",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-3fefc615-6950-4a29-9214-eefdc4e659e3",
    "role": "Protection Scientist Engineer, Integrity  ",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-sky-500 to-blue-700",
    "salary": "$165,000 - $240,000",
    "type": "Hybrid • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "ENGINEERING",
      "London, UK",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/3fefc615-6950-4a29-9214-eefdc4e659e3",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-f794c64d-bc5c-430b-b645-bff8c202b80e",
    "role": "Manager, Applied AI Architects",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-emerald-500 to-teal-700",
    "salary": "$165,000 - $240,000",
    "type": "Hybrid • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "AI",
      "London, UK",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/f794c64d-bc5c-430b-b645-bff8c202b80e",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-6fdc9e35-c9d9-49fb-a8f7-80d2d7f03968",
    "role": "Researcher, Training - London ",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-purple-500 to-indigo-700",
    "salary": "$165,000 - $240,000",
    "type": "Hybrid • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "AI",
      "London, UK",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/6fdc9e35-c9d9-49fb-a8f7-80d2d7f03968",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-openai-f8b84ae5-743b-41c9-8432-02dff9993d6b",
    "role": "Software Engineer, Model Deployment- ChatGPT Engineering",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-rose-500 to-pink-700",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "ENGINEERING",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/f8b84ae5-743b-41c9-8432-02dff9993d6b",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  }
]
  },
  {
    id: "berlin",
    name: "Berlin",
    stateCountry: "Germany",
    countryCode: "europe",
    coordinates: [13.405, 52.52],
    activeJobsCount: 6,
    highlightRole: "DevOps / Infrastructure",
    jobs: [
  {
    "id": "ashby-openai-c00094f9-e071-4870-afec-104beb3ce499",
    "role": "Applied AI Architect, Large Enterprise",
    "company": "OpenAI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-blue-600 to-indigo-700",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "AI",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/openai/c00094f9-e071-4870-afec-104beb3ce499",
    "description": "Direct official application at OpenAI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-perplexity-b9e1ff15-d52a-46d5-abf0-26460f2a116c",
    "role": "Internship - Machine Learning Research Engineer",
    "company": "Perplexity AI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-amber-500 to-orange-600",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "AI",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/perplexity/b9e1ff15-d52a-46d5-abf0-26460f2a116c",
    "description": "Direct official application at Perplexity AI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-perplexity-1a3df802-9238-4827-ab1f-12a9d1e4b81c",
    "role": "Member of Technical Staff (Machine Learning Research Engineer)",
    "company": "Perplexity AI",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-sky-500 to-blue-700",
    "salary": "$165,000 - $240,000",
    "type": "Hybrid • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "AI",
      "Berlin, Germany",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/perplexity/1a3df802-9238-4827-ab1f-12a9d1e4b81c",
    "description": "Direct official application at Perplexity AI. 100% verified ATS requisition."
  },
  {
    "id": "ashby-cohere-2d256112-b336-4539-8133-a0bf7f6698f0",
    "role": "Forward Deployed Engineer, Agentic Platform (Europe)",
    "company": "Cohere",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-emerald-500 to-teal-700",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "ENGINEERING",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/cohere/2d256112-b336-4539-8133-a0bf7f6698f0",
    "description": "Direct official application at Cohere. 100% verified ATS requisition."
  },
  {
    "id": "ashby-cohere-f722247c-291b-44ee-af67-5159b8d5d9b9",
    "role": "Software Engineer, North for Finance",
    "company": "Cohere",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-purple-500 to-indigo-700",
    "salary": "$165,000 - $240,000",
    "type": "Remote • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "ENGINEERING",
      "100% Remote",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/cohere/f722247c-291b-44ee-af67-5159b8d5d9b9",
    "description": "Direct official application at Cohere. 100% verified ATS requisition."
  },
  {
    "id": "ashby-cohere-335a6fe6-c857-4c5e-866a-4163496e1254",
    "role": "Engineering Manager",
    "company": "Cohere",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "companyColor": "from-rose-500 to-pink-700",
    "salary": "$165,000 - $240,000",
    "type": "Hybrid • Full-time",
    "postedTime": "Live Today",
    "tags": [
      "ENGINEERING",
      "Berlin, Germany",
      "Direct ATS"
    ],
    "directAts": true,
    "applyUrl": "https://jobs.ashbyhq.com/cohere/335a6fe6-c857-4c5e-866a-4163496e1254",
    "description": "Direct official application at Cohere. 100% verified ATS requisition."
  }
]
  }
];

export const RADAR_COUNTRIES: CountryRegion[] = [
  {
    id: "all",
    name: "Global",
    code: "all",
    label: "Global Orbit",
    flag: "🌐",
    center: [0, 20],
    zoom: 2,
    cities: RADAR_CITIES
  },
  {
    id: "usa",
    name: "United States",
    code: "usa",
    label: "United States",
    flag: "🇺🇸",
    center: [-98.5795, 39.8283],
    zoom: 3.5,
    cities: RADAR_CITIES.filter(c => c.countryCode === "usa")
  },
  {
    id: "india",
    name: "India",
    code: "india",
    label: "India",
    flag: "🇮🇳",
    center: [78.9629, 20.5937],
    zoom: 4,
    cities: RADAR_CITIES.filter(c => c.countryCode === "india")
  },
  {
    id: "europe",
    name: "Europe",
    code: "europe",
    label: "Europe",
    flag: "🇪🇺",
    center: [10.4515, 51.1657],
    zoom: 4,
    cities: RADAR_CITIES.filter(c => c.countryCode === "europe")
  }
];

export const REGIONS = RADAR_COUNTRIES;
