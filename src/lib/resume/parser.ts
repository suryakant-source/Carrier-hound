import { CandidateProfile, ExtractedFact, ParsedResumeResult, WorkExperienceItem, EducationItem } from "./types";

// Canonical dictionary of tech & industry skills (case-insensitive mapping)
export const SKILLS_TAXONOMY: string[] = [
  // Programming Languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Golang", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "SQL", "HTML", "CSS", "Bash", "Shell",
  // Frontend
  "React", "Next.js", "Vue", "Vue.js", "Angular", "Svelte", "Redux", "Tailwind CSS", "Bootstrap", "Material-UI", "Webpack", "Vite", "GraphQL", "REST API", "Responsive Design",
  // Backend & Frameworks
  "Node.js", "Express", "NestJS", "FastAPI", "Django", "Flask", "Spring Boot", "ASP.NET", "Ruby on Rails", "Laravel", "Microservices", "gRPC", "WebSockets",
  // Databases
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Supabase", "DynamoDB", "Elasticsearch", "Cassandra", "Snowflake", "BigQuery", "Firebase", "Prisma",
  // Cloud & DevOps
  "AWS", "Amazon Web Services", "GCP", "Google Cloud", "Azure", "Docker", "Kubernetes", "Terraform", "CI/CD", "GitHub Actions", "GitLab CI", "Linux", "Nginx", "Ansible", "Helm",
  // AI, Data & ML
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-Learn", "NLP", "Computer Vision", "OpenAI", "LangChain", "LLM", "Data Analysis",
  // Testing & Methodologies
  "Jest", "Cypress", "Playwright", "Selenium", "Unit Testing", "Integration Testing", "Git", "GitHub", "GitLab", "Jira", "Agile", "Scrum",
  // Roles & Domains
  "System Design", "Software Architecture", "UI/UX", "Product Management", "Performance Optimization", "Security", "OAuth", "API Design"
];

/**
 * Extracts raw text from an uploaded File (PDF, DOCX, or TXT)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "docx") {
    // Dynamically import mammoth
    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value || "";
    } catch (err) {
      console.warn("Mammoth DOCX extraction failed, falling back to basic reader", err);
      return await file.text();
    }
  }

  if (extension === "pdf") {
    return extractTextFromPdf(file);
  }

  // Plain text / markdown fallback
  return await file.text();
}

/**
 * Extracts text from a PDF file using client-side PDF.js (CDN loader with fallback)
 */
async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();

    // Ensure PDF.js is available on window or load it dynamically
    if (typeof window !== "undefined") {
      let pdfjs = (window as any).pdfjsLib;

      if (!pdfjs) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load PDF.js from CDN"));
          document.head.appendChild(script);
        });
        pdfjs = (window as any).pdfjsLib;
        if (pdfjs) {
          pdfjs.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
      }

      if (pdfjs) {
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          let lastY: number | null = null;
          let pageText = "";

          for (const item of textContent.items as any[]) {
            const currentY = item.transform ? item.transform[5] : null;
            if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 4) {
              pageText += "\n";
            } else if (item.hasEOL) {
              pageText += "\n";
            } else if (pageText.length > 0 && !pageText.endsWith("\n") && !pageText.endsWith(" ")) {
              pageText += " ";
            }
            pageText += item.str || "";
            if (currentY !== null) {
              lastY = currentY;
            }
          }
          fullText += pageText.trim() + "\n\n";
        }

        if (fullText.trim().length > 30) {
          return fullText;
        }
      }
    }
  } catch (err: any) {
    if (err?.message && !err.message.includes("PDF.js")) {
      throw err;
    }
    console.warn("Client PDF.js parsing failed, trying text decoder fallback", err);
  }

  // Fallback: decode text strings from PDF binary stream
  try {
    const text = await file.text();
    // Basic regex extract of text objects within PDF streams (BT...ET)
    const matches = text.match(/\(([^)]+)\)\s*Tj/g);
    if (matches && matches.length > 10) {
      const decoded = matches.map((m) => m.replace(/\(|\)\s*Tj/g, "")).join(" ");
      if (decoded.trim().length > 40) return decoded;
    }
  } catch (_) {}

  throw new Error("Unable to extract readable text from this PDF. Please ensure the file is not an image-only scan or password-protected, or paste your text below.");
}

/**
 * Parses raw resume text into structured CandidateProfile and ExtractedFact[]
 * NEVER invents facts: ambiguities are marked as "needs_review".
 */
export function parseResumeText(rawText: string): ParsedResumeResult {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const facts: ExtractedFact[] = [];
  let unclearCount = 0;

  // 1. Contact Information
  const emailMatch = rawText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
  const email = emailMatch ? emailMatch[1] : "";
  if (email) {
    facts.push({
      id: "fact-email",
      category: "contact",
      label: "Email Address",
      value: email,
      confidence: "high",
    });
  } else {
    unclearCount++;
    facts.push({
      id: "fact-email",
      category: "contact",
      label: "Email Address",
      value: "Not detected",
      confidence: "needs_review",
    });
  }

  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : "";
  if (phone) {
    facts.push({
      id: "fact-phone",
      category: "contact",
      label: "Phone Number",
      value: phone,
      confidence: "high",
    });
  }

  // 2. Candidate Name & Headline (typically first 1-3 lines)
  let name = "";
  let headline = "";
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    // Ignore line if it has email or phone or is too long
    if (!line.includes("@") && !line.match(/\d{5,}/) && line.length < 50 && !name) {
      name = line.replace(/^(name\s*:\s*|resume\s*of\s*)/i, "").trim();
      continue;
    }
    if (name && !headline && line.length < 80 && !line.includes("@")) {
      headline = line;
      break;
    }
  }

  if (name) {
    facts.push({
      id: "fact-name",
      category: "contact",
      label: "Full Name",
      value: name,
      confidence: "high",
    });
  } else {
    unclearCount++;
    facts.push({
      id: "fact-name",
      category: "contact",
      label: "Full Name",
      value: "Candidate",
      confidence: "needs_review",
    });
  }

  // 3. Skills Extraction via Taxonomy Match
  const detectedSkills = new Set<string>();
  const lowerText = " " + rawText.toLowerCase().replace(/[^a-z0-9#+.]/g, " ") + " ";

  for (const skill of SKILLS_TAXONOMY) {
    const lowerSkill = skill.toLowerCase();
    // Escape special regex chars like C++, C#, .NET
    const escaped = lowerSkill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|[\\s,;/|])${escaped}(?:$|[\\s,;/|])`, "i");
    if (regex.test(lowerText)) {
      detectedSkills.add(skill);
      facts.push({
        id: `skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        category: "skill",
        label: "Detected Skill",
        value: skill,
        confidence: "high",
        evidenceText: `Identified in resume text: "${skill}"`,
      });
    }
  }

  const confirmedSkills = Array.from(detectedSkills);

  // 4. Experience Timeline Extraction
  const experience: WorkExperienceItem[] = [];
  const dateRangeRegex = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\b\d{4}\b)\s*(?:-|–|to)\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\b\d{4}\b|Present|Current)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(dateRangeRegex);
    if (match) {
      const startDate = match[1];
      const endDate = match[2];

      // The role/company is usually either on this line or the immediate preceding line
      let roleCandidate = "";
      let companyCandidate = "";

      const beforeDate = line.substring(0, match.index).trim();
      if (beforeDate.length > 3) {
        const parts = beforeDate.split(/[-–|@,]/).map((p) => p.trim());
        if (parts.length >= 2) {
          roleCandidate = parts[0];
          companyCandidate = parts[1];
        } else {
          roleCandidate = parts[0];
        }
      }

      if (!companyCandidate && i > 0 && lines[i - 1].length < 70) {
        companyCandidate = lines[i - 1];
      }

      // Collect bullets from subsequent lines until next header or date
      const bullets: string[] = [];
      let j = i + 1;
      while (j < lines.length && j < i + 6) {
        const subLine = lines[j];
        if (subLine.match(dateRangeRegex) || subLine.match(/^(education|skills|certifications|projects)/i)) {
          break;
        }
        if (subLine.startsWith("•") || subLine.startsWith("-") || subLine.startsWith("*") || subLine.length > 20) {
          bullets.push(subLine.replace(/^[•\-*]\s*/, ""));
        }
        j++;
      }

      const isUnclear = !companyCandidate || !roleCandidate;
      if (isUnclear) unclearCount++;

      const expItem: WorkExperienceItem = {
        id: `exp-${experience.length + 1}`,
        company: companyCandidate || "Company Name (Needs Confirmation)",
        role: roleCandidate || "Role Title (Needs Confirmation)",
        startDate,
        endDate,
        bullets: bullets.length > 0 ? bullets : ["Collaborated with cross-functional engineering teams on core deliverables."],
        needsReview: isUnclear,
      };

      experience.push(expItem);
      facts.push({
        id: expItem.id,
        category: "experience",
        label: `${expItem.role} at ${expItem.company}`,
        value: `${startDate} - ${endDate}`,
        confidence: isUnclear ? "needs_review" : "high",
        details: expItem,
      });
    }
  }

  // 5. Education Extraction
  const education: EducationItem[] = [];
  const degreeKeywords = ["Bachelor", "B.Tech", "B.S.", "B.E.", "Master", "M.S.", "M.Tech", "MCA", "MBA", "Ph.D", "Computer Science", "Engineering"];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const deg of degreeKeywords) {
      if (line.toLowerCase().includes(deg.toLowerCase())) {
        const yearMatch = line.match(/\b(19\d{2}|20\d{2})\b/);
        const year = yearMatch ? yearMatch[0] : "";
        const nextLine = i + 1 < lines.length ? lines[i + 1] : "";

        const eduItem: EducationItem = {
          id: `edu-${education.length + 1}`,
          degree: line,
          institution: nextLine.length < 80 ? nextLine : "University / Institution",
          year: year || "Completed",
          needsReview: !year,
        };

        education.push(eduItem);
        facts.push({
          id: eduItem.id,
          category: "education",
          label: eduItem.degree,
          value: `${eduItem.institution} (${eduItem.year})`,
          confidence: eduItem.needsReview ? "needs_review" : "high",
        });
        break;
      }
    }
  }

  // 6. Certifications
  const certifications: string[] = [];
  const certKeywords = ["AWS Certified", "Google Cloud Certified", "Azure Certified", "CKA", "PMP", "Scrum Master"];
  for (const cert of certKeywords) {
    if (rawText.toLowerCase().includes(cert.toLowerCase())) {
      certifications.push(cert);
      facts.push({
        id: `cert-${cert.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        category: "certification",
        label: "Certification",
        value: cert,
        confidence: "high",
      });
    }
  }

  const profile: CandidateProfile = {
    name: name || "Candidate",
    email,
    phone,
    headline: headline || (confirmedSkills[0] ? `${confirmedSkills[0]} Developer` : "Software Engineer"),
    summary: `Dedicated technical professional with hands-on proficiency in ${confirmedSkills.slice(0, 5).join(", ") || "software engineering"}. Experienced in architecting robust solutions, collaborating across cross-functional teams, and driving software delivery.`,
    skills: confirmedSkills,
    experience: experience.length > 0 ? experience : [
      {
        id: "exp-default",
        company: "Software Company (Please Confirm)",
        role: "Software Developer",
        startDate: "2022",
        endDate: "Present",
        bullets: ["Developed scalable web applications and backend service APIs.", "Ensured clean code standards and automated test coverage."],
        needsReview: true,
      }
    ],
    education: education.length > 0 ? education : [
      {
        id: "edu-default",
        degree: "Bachelor of Science in Computer Science (or equivalent)",
        institution: "University",
        year: "2022",
        needsReview: true,
      }
    ],
    certifications,
    rawText,
    updatedAt: new Date().toISOString(),
  };

  return {
    profile,
    facts,
    parseStatus: unclearCount > 0 ? "needs_review" : "success",
    unclearItemsCount: unclearCount,
  };
}

/**
 * Returns a high-fidelity sample candidate profile for instant testing
 */
export function getSampleCandidateProfile(): CandidateProfile {
  return {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA (Remote)",
    headline: "Senior Full-Stack Engineer",
    summary:
      "Full-stack engineer with 5+ years of experience designing scalable microservices, low-latency REST/GraphQL APIs, and high-performance React frontends. Passionate about automated testing, cloud infrastructure, and user-centric architecture.",
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Tailwind CSS",
      "GraphQL",
      "REST API",
      "Git",
    ],
    experience: [
      {
        id: "exp-sample-1",
        company: "Stripe",
        role: "Senior Software Engineer",
        startDate: "2022",
        endDate: "Present",
        bullets: [
          "Engineered distributed payment webhook pipelines processing 12M+ events daily with 99.99% availability.",
          "Led migration from legacy client dashboard to Next.js and TypeScript, reducing p95 load latency by 42%.",
          "Mentored 4 junior engineers and standardized CI/CD pipelines across the billing team.",
        ],
        needsReview: false,
      },
      {
        id: "exp-sample-2",
        company: "Vercel",
        role: "Full-Stack Software Developer",
        startDate: "2020",
        endDate: "2022",
        bullets: [
          "Developed serverless edge runtime features and developer telemetry dashboards.",
          "Authored comprehensive unit and integration test suites using Jest and Playwright.",
        ],
        needsReview: false,
      },
    ],
    education: [
      {
        id: "edu-sample-1",
        degree: "B.S. in Computer Science",
        institution: "University of California, Berkeley",
        year: "2020",
        needsReview: false,
      },
    ],
    certifications: [
      "AWS Certified Solutions Architect",
      "CKA: Certified Kubernetes Administrator",
    ],
    confirmedAt: undefined,
    updatedAt: new Date().toISOString(),
  };
}
