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
  coordinates: [number, number]; // [longitude, latitude] for Mapbox
  activeJobsCount: number;
  highlightRole: string;
  jobs: RadarJob[];
}

export interface CountryRegion {
  id: "all" | "india" | "usa" | "europe" | "apac";
  label: string;
  flag: string;
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
}

export const RADAR_COUNTRIES: CountryRegion[] = [
  {
    id: "all",
    label: "Global Orbit",
    flag: "🌐",
    center: [0, 20],
    zoom: 1.8,
    pitch: 15,
    bearing: 0,
  },
  {
    id: "india",
    label: "India",
    flag: "🇮🇳",
    center: [78.9629, 20.5937],
    zoom: 4.2,
    pitch: 35,
    bearing: 10,
  },
  {
    id: "usa",
    label: "United States",
    flag: "🇺🇸",
    center: [-98.5795, 39.8283],
    zoom: 3.8,
    pitch: 35,
    bearing: -15,
  },
  {
    id: "europe",
    label: "Europe",
    flag: "🇪🇺",
    center: [10.4515, 51.1657],
    zoom: 4.1,
    pitch: 35,
    bearing: 5,
  },
  {
    id: "apac",
    label: "Asia-Pacific",
    flag: "🌏",
    center: [115.8605, 15.0000],
    zoom: 3.7,
    pitch: 35,
    bearing: 10,
  },
];

export const RADAR_CITIES: RadarCity[] = [
  {
    id: "bangalore",
    name: "Bangalore",
    stateCountry: "Karnataka, India",
    countryCode: "india",
    coordinates: [77.5946, 12.9716],
    activeJobsCount: 142,
    highlightRole: "Software Engineer, Infrastructure ",
    jobs: [
      {
            "id": "ashby-notion-42f18ccd-c4c8-4a85-8c1f-de12c575fe87",
            "role": "Software Engineer, Infrastructure ",
            "company": "Notion",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-blue-600 to-indigo-700",
            "salary": "$150,000 - $220,000",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "DEVOPS",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobs.ashbyhq.com/notion/42f18ccd-c4c8-4a85-8c1f-de12c575fe87",
            "description": "Verified open role at Notion. Direct application pipeline enabled."
      },
      {
            "id": "ashby-notion-49bdf081-6e20-4323-8c73-6d6b19544ff5",
            "role": "Software Engineer, Developer Experience",
            "company": "Notion",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-amber-500 to-orange-600",
            "salary": "$150,000 - $220,000",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobs.ashbyhq.com/notion/49bdf081-6e20-4323-8c73-6d6b19544ff5",
            "description": "Verified open role at Notion. Direct application pipeline enabled."
      },
      {
            "id": "ashby-notion-3339493a-ee21-49f3-ab09-e1f8ba8f1b92",
            "role": "Product Support Manager",
            "company": "Notion",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-sky-500 to-blue-700",
            "salary": "$150,000 - $220,000",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobs.ashbyhq.com/notion/3339493a-ee21-49f3-ab09-e1f8ba8f1b92",
            "description": "Verified open role at Notion. Direct application pipeline enabled."
      },
      {
            "id": "ashby-notion-79c18580-c927-456c-9d5f-72efbc6c43cb",
            "role": "Forward Deployed Engineer, India",
            "company": "Notion",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-emerald-500 to-teal-700",
            "salary": "$150,000 - $220,000",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobs.ashbyhq.com/notion/79c18580-c927-456c-9d5f-72efbc6c43cb",
            "description": "Verified open role at Notion. Direct application pipeline enabled."
      },
      {
            "id": "ashby-cursor-a6c00f7f-2288-4461-a64d-0f1cd9878909",
            "role": "Field Engineer - India ",
            "company": "Cursor",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-purple-500 to-indigo-700",
            "salary": "$150,000 - $220,000",
            "type": "Hybrid • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "Bangalore",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobs.ashbyhq.com/cursor/a6c00f7f-2288-4461-a64d-0f1cd9878909",
            "description": "Verified open role at Cursor. Direct application pipeline enabled."
      }
],
  },
  {
    id: "san-francisco",
    name: "San Francisco",
    stateCountry: "California, USA",
    countryCode: "usa",
    coordinates: [-122.4194, 37.7749],
    activeJobsCount: 384,
    highlightRole: "Senior / Staff Fullstack Engineer",
    jobs: [
      {
            "id": "ashby-linear-d3bc1ced-3ce4-4086-a050-555055dbb1ff",
            "role": "Senior / Staff Fullstack Engineer",
            "company": "Linear",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-blue-600 to-indigo-700",
            "salary": "$150,000 - $220,000",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "SOFTWARE",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobs.ashbyhq.com/linear/d3bc1ced-3ce4-4086-a050-555055dbb1ff",
            "description": "Verified open role at Linear. Direct application pipeline enabled."
      },
      {
            "id": "ashby-linear-069c4628-88d7-4e4d-b393-c996fc7f3076",
            "role": "Senior / Staff Product Engineer",
            "company": "Linear",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-amber-500 to-orange-600",
            "salary": "$150,000 - $220,000",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobs.ashbyhq.com/linear/069c4628-88d7-4e4d-b393-c996fc7f3076",
            "description": "Verified open role at Linear. Direct application pipeline enabled."
      },
      {
            "id": "ashby-linear-f04f398b-6320-499d-8a60-290239d62da8",
            "role": "Design Engineer (Web & Brand)",
            "company": "Linear",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-sky-500 to-blue-700",
            "salary": "$150,000 - $220,000",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "DESIGN",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobs.ashbyhq.com/linear/f04f398b-6320-499d-8a60-290239d62da8",
            "description": "Verified open role at Linear. Direct application pipeline enabled."
      },
      {
            "id": "ashby-linear-0c7c2e26-0a98-42cf-a47c-9a3999fb513b",
            "role": "Product Engineer",
            "company": "Linear",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-emerald-500 to-teal-700",
            "salary": "$150,000 - $220,000",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobs.ashbyhq.com/linear/0c7c2e26-0a98-42cf-a47c-9a3999fb513b",
            "description": "Verified open role at Linear. Direct application pipeline enabled."
      },
      {
            "id": "ashby-linear-b7669c4b-eeca-421d-ba9a-d90203f6fcb2",
            "role": "Product Manager",
            "company": "Linear",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-purple-500 to-indigo-700",
            "salary": "$150,000 - $220,000",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobs.ashbyhq.com/linear/b7669c4b-eeca-421d-ba9a-d90203f6fcb2",
            "description": "Verified open role at Linear. Direct application pipeline enabled."
      }
],
  },
  {
    id: "new-york",
    name: "New York",
    stateCountry: "New York, USA",
    countryCode: "usa",
    coordinates: [-74.006, 40.7128],
    activeJobsCount: 295,
    highlightRole: " Security Engineer, Cloud",
    jobs: [
      {
            "id": "ashby-ramp-34413f8d-26bf-4bbc-8ade-eb309a0e2245",
            "role": " Security Engineer, Cloud",
            "company": "Ramp",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-blue-600 to-indigo-700",
            "salary": "$150,000 - $220,000",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "DEVOPS",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobs.ashbyhq.com/ramp/34413f8d-26bf-4bbc-8ade-eb309a0e2245",
            "description": "Verified open role at Ramp. Direct application pipeline enabled."
      },
      {
            "id": "ashby-ramp-f564dcf9-9390-4a3f-896f-8047a5086040",
            "role": "Mobile Engineer, Android",
            "company": "Ramp",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-amber-500 to-orange-600",
            "salary": "$150,000 - $220,000",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobs.ashbyhq.com/ramp/f564dcf9-9390-4a3f-896f-8047a5086040",
            "description": "Verified open role at Ramp. Direct application pipeline enabled."
      },
      {
            "id": "ashby-ramp-4e64ab86-4e30-403b-b1b9-41dc052570ce",
            "role": "Software Engineer, Frontend",
            "company": "Ramp",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-sky-500 to-blue-700",
            "salary": "$150,000 - $220,000",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "SOFTWARE",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobs.ashbyhq.com/ramp/4e64ab86-4e30-403b-b1b9-41dc052570ce",
            "description": "Verified open role at Ramp. Direct application pipeline enabled."
      },
      {
            "id": "ashby-ramp-4859cd5e-f2a9-44d7-81f7-8bfc0e62369f",
            "role": "Mobile Engineer, iOS",
            "company": "Ramp",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-emerald-500 to-teal-700",
            "salary": "$150,000 - $220,000",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobs.ashbyhq.com/ramp/4859cd5e-f2a9-44d7-81f7-8bfc0e62369f",
            "description": "Verified open role at Ramp. Direct application pipeline enabled."
      },
      {
            "id": "ashby-ramp-081dbe29-8a06-4cb2-bda5-4b0bfb35c2e8",
            "role": "Product Operations Specialist | Generalist",
            "company": "Ramp",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-purple-500 to-indigo-700",
            "salary": "$150,000 - $220,000",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobs.ashbyhq.com/ramp/081dbe29-8a06-4cb2-bda5-4b0bfb35c2e8",
            "description": "Verified open role at Ramp. Direct application pipeline enabled."
      }
],
  },
  {
    id: "london",
    name: "London",
    stateCountry: "Greater London, UK",
    countryCode: "europe",
    coordinates: [-0.1278, 51.5074],
    activeJobsCount: 218,
    highlightRole: "Telecom Engineer",
    jobs: [
      {
            "id": "jobicy-151643",
            "role": "Telecom Engineer",
            "company": "Five9",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-blue-600 to-indigo-700",
            "salary": "Competitive Rate",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobicy.com/jobs/151643-telecom-engineer-2",
            "description": "Verified open role at Five9. Direct application pipeline enabled."
      },
      {
            "id": "jobicy-151620",
            "role": "Engineering Manager - UK",
            "company": "Ashby",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-amber-500 to-orange-600",
            "salary": "Competitive Rate",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobicy.com/jobs/151620-engineering-manager-uk",
            "description": "Verified open role at Ashby. Direct application pipeline enabled."
      },
      {
            "id": "jobicy-151541",
            "role": "AI Transformation Owner, Product & Design",
            "company": "GitLab",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-sky-500 to-blue-700",
            "salary": "Competitive Rate",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "DESIGN",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobicy.com/jobs/151541-ai-transformation-owner-product-design",
            "description": "Verified open role at GitLab. Direct application pipeline enabled."
      },
      {
            "id": "jobicy-151538",
            "role": "Sales Engineer (French) SMB",
            "company": "1Password",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-emerald-500 to-teal-700",
            "salary": "Competitive Rate",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobicy.com/jobs/151538-sales-engineer-french-smb",
            "description": "Verified open role at 1Password. Direct application pipeline enabled."
      },
      {
            "id": "jobicy-154028",
            "role": "Contract Software Engineer - DOM Core Firefox/Gecko",
            "company": "Mozilla",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-purple-500 to-indigo-700",
            "salary": "Competitive Rate",
            "type": "Remote • Contract",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobicy.com/jobs/154028-contract-software-engineer-dom-core-firefox-gecko",
            "description": "Verified open role at Mozilla. Direct application pipeline enabled."
      }
],
  },
  {
    id: "berlin",
    name: "Berlin",
    stateCountry: "Berlin, Germany",
    countryCode: "europe",
    coordinates: [13.405, 52.52],
    activeJobsCount: 176,
    highlightRole: "Lead Creative Producer",
    jobs: [
      {
            "id": "jobicy-151441",
            "role": "Lead Creative Producer",
            "company": "Ruby Labs",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-blue-600 to-indigo-700",
            "salary": "Competitive Rate",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobicy.com/jobs/151441-lead-creative-producer",
            "description": "Verified open role at Ruby Labs. Direct application pipeline enabled."
      },
      {
            "id": "jobicy-151442",
            "role": "Security Platform Engineer",
            "company": "Sporty Group",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-amber-500 to-orange-600",
            "salary": "Competitive Rate",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "DEVOPS",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobicy.com/jobs/151442-security-platform-engineer",
            "description": "Verified open role at Sporty Group. Direct application pipeline enabled."
      },
      {
            "id": "jobicy-154051",
            "role": "Staff Software Engineer - Curated Data",
            "company": "Dune",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-sky-500 to-blue-700",
            "salary": "Competitive Rate",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "AI",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobicy.com/jobs/154051-staff-software-engineer-curated-data",
            "description": "Verified open role at Dune. Direct application pipeline enabled."
      },
      {
            "id": "jobicy-154028",
            "role": "Contract Software Engineer - DOM Core Firefox/Gecko",
            "company": "Mozilla",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-emerald-500 to-teal-700",
            "salary": "Competitive Rate",
            "type": "Remote • Contract",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobicy.com/jobs/154028-contract-software-engineer-dom-core-firefox-gecko",
            "description": "Verified open role at Mozilla. Direct application pipeline enabled."
      },
      {
            "id": "jobicy-154032",
            "role": "Contract Software Engineer - WebCompat Tooling (Dashboards and Reporting), Firefox",
            "company": "Mozilla",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-purple-500 to-indigo-700",
            "salary": "Competitive Rate",
            "type": "Remote • Contract",
            "postedTime": "Live Today",
            "tags": [
                  "SOFTWARE",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobicy.com/jobs/154032-contract-software-engineer-webcompat-tooling-dashboards-and-reporting-firefox",
            "description": "Verified open role at Mozilla. Direct application pipeline enabled."
      }
],
  },
  {
    id: "singapore",
    name: "Singapore",
    stateCountry: "Singapore Central",
    countryCode: "apac",
    coordinates: [103.8198, 1.3521],
    activeJobsCount: 124,
    highlightRole: "Staff Cloud Reliability Engineer",
    jobs: [
      {
            "id": "jobicy-151643",
            "role": "Telecom Engineer",
            "company": "Five9",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-blue-600 to-indigo-700",
            "salary": "Competitive Rate",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobicy.com/jobs/151643-telecom-engineer-2",
            "description": "Verified open role at Five9. Direct application pipeline enabled."
      },
      {
            "id": "jobicy-151605",
            "role": "Principal, Value Realization",
            "company": "League",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-amber-500 to-orange-600",
            "salary": "Competitive Rate",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "ENGINEERING",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobicy.com/jobs/151605-principal-value-realization",
            "description": "Verified open role at League. Direct application pipeline enabled."
      },
      {
            "id": "jobicy-151644",
            "role": "Staff Design Engineer - Americas",
            "company": "Ashby",
            "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            "companyColor": "from-sky-500 to-blue-700",
            "salary": "Competitive Rate",
            "type": "Remote • Full-time",
            "postedTime": "Live Today",
            "tags": [
                  "DESIGN",
                  "100% Remote",
                  "Direct ATS"
            ],
            "directAts": true,
            "applyUrl": "https://jobicy.com/jobs/151644-staff-design-engineer-americas",
            "description": "Verified open role at Ashby. Direct application pipeline enabled."
      }
],
  }
];
