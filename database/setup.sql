-- TODO: Reload updated tables sql

-- Table: colleges
CREATE TABLE colleges (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    ranking DECIMAL(4,2) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE interviews (
    id CHAR(36) PRIMARY KEY,
    college_id CHAR(36) NOT NULL, -- Links the interview to a specific college
    title VARCHAR(255) NOT NULL,
    interviewee_name VARCHAR(255) NOT NULL,
    interviewee_title VARCHAR(255),
    content TEXT NOT NULL, -- Additional context for the interview
    media_type ENUM('text','video','audio') DEFAULT 'text',
    media_url VARCHAR(255),
    final_assessment DECIMAL(2,1) CHECK (final_assessment BETWEEN 0 AND 5), -- Rating out of 5
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

CREATE TABLE interview_questions (
    id CHAR(36) PRIMARY KEY,
    interview_id CHAR(36) NOT NULL, -- Links to the interviews table
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    position INT NOT NULL, -- Allows ordering of questions
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
);

-- Table: incidents (for tracking antisemitic incidents)
CREATE TABLE incidents (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    college_id CHAR(36) NOT NULL,
    incident_date DATE NOT NULL,
    severity INT NOT NULL CHECK (severity BETWEEN 1 AND 5), -- 1-5 scale
    location VARCHAR(255) NOT NULL, -- Specific location on campus
    media_url VARCHAR(255),
    reported_by VARCHAR(255), -- Name of person reporting (can be anonymous)
    status ENUM('pending', 'verified', 'resolved') DEFAULT 'pending',
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

-- Table for additional evidence (if you want to support multiple files per incident)
CREATE TABLE incident_evidences (
    id CHAR(36) PRIMARY KEY,
    incident_id CHAR(36) NOT NULL,
    evidence_url VARCHAR(255) NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE
);

-- Table: petition_signatures (for the high school boycott petition)
CREATE TABLE petition_signatures (
    id CHAR(36) PRIMARY KEY,
    signer_name VARCHAR(255) NOT NULL,
    high_school_name VARCHAR(255), 
    email VARCHAR(255) NOT NULL UNIQUE, -- Ensures each person signs once
    graduation_year YEAR NOT NULL, -- Helps track eligibility
    reason TEXT, -- Optional: Allows them to share their motivation for signing
    signed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE petition_boycott_colleges (
    id CHAR(36) PRIMARY KEY,
    signature_id CHAR(36) NOT NULL, -- Links to petition_signatures
    college_id CHAR(36) NOT NULL, -- Links to colleges being boycotted
    FOREIGN KEY (signature_id) REFERENCES petition_signatures(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

-- Table: resources (guides, safety tips, and external resource links)
CREATE TABLE resources (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    resource_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: blog_posts (articles and news updates)
CREATE TABLE blog_posts (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    author VARCHAR(255),
    status ENUM('draft','published') DEFAULT 'draft',
    published_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: contacts (contact form submissions)
CREATE TABLE contacts (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: admin_users (for managing admin access to the dashboard)
CREATE TABLE admin_users (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('superadmin','editor','moderator') DEFAULT 'editor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE api_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  method VARCHAR(10) NOT NULL,
  url VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent VARCHAR(255),
  referer VARCHAR(255),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  authorization_cookie VARCHAR(255),
  page VARCHAR(255)
);