-- Insert sample colleges
INSERT INTO colleges (id, name, description, location, website, ranking) VALUES
(UUID(), 'University of Pennsylvania', 'Ivy League university in Philadelphia', 'Philadelphia, PA', 'www.upenn.edu', 4.50),
(UUID(), 'Harvard University', 'Private Ivy League research university', 'Cambridge, MA', 'www.harvard.edu', 4.80),
(UUID(), 'Columbia University', 'Private Ivy League university in New York City', 'New York, NY', 'www.columbia.edu', 4.30);

-- Insert interviews (get college IDs first)
SET @upenn_id = (SELECT id FROM colleges WHERE name = 'University of Pennsylvania' LIMIT 1);
SET @harvard_id = (SELECT id FROM colleges WHERE name = 'Harvard University' LIMIT 1);

INSERT INTO interviews (id, college_id, title, interviewee_name, interviewee_title, content, media_type, media_url, final_assessment) VALUES
(UUID(), @upenn_id, 'Campus Safety Discussion', 'Sarah Cohen', 'Jewish Student Leader', 'Discussion about recent campus climate', 'video', 'https://example.com/video1', 3.5),
(UUID(), @harvard_id, 'Admissions Process', 'Michael Roth', 'Admissions Officer', 'Interview about diversity initiatives', 'audio', 'https://example.com/audio1', 4.2);

-- Insert interview questions (get interview IDs first)
SET @interview1 = (SELECT id FROM interviews WHERE title LIKE '%Campus Safety%' LIMIT 1);

INSERT INTO interview_questions (id, interview_id, question, answer, position) VALUES
(UUID(), @interview1, 'What safety measures exist for Jewish students?', 'We have increased campus patrols...', 1),
(UUID(), @interview1, 'How does the university handle bias reports?', 'All reports are investigated...', 2);

-- Insert incidents
SET @columbia_id = (SELECT id FROM colleges WHERE name = 'Columbia University' LIMIT 1);

INSERT INTO incidents (id, title, description, college_id, incident_date, severity, location, media_url, reported_by, status) VALUES
(UUID(), 'Swastika Found in Dorm', 'Graffiti discovered in bathroom stall', @columbia_id, '2023-11-01', 4, 'John Jay Hall', 'https://example.com/image1', 'Anonymous', 'verified'),
(UUID(), 'Disrupted Shabbat Dinner', 'Group shouted antisemitic slurs', @upenn_id, '2023-10-15', 3, 'Hillel Building', NULL, 'Rachel Goldstein', 'pending');

-- Insert incident evidence
SET @incident1 = (SELECT id FROM incidents WHERE title LIKE '%Swastika%' LIMIT 1);

INSERT INTO incident_evidences (id, incident_id, evidence_url, description) VALUES
(UUID(), @incident1, 'https://example.com/evidence1.jpg', 'Photo of graffiti'),
(UUID(), @incident1, 'https://example.com/report.pdf', 'Official incident report');

-- Insert petition signatures
INSERT INTO petition_signatures (id, signer_name, high_school_name, email, graduation_year, reason) VALUES
(UUID(), 'David Cohen', 'Bronx Science', 'david@example.com', 2024, 'Safety concerns'),
(UUID(), 'Emily Rosenberg', 'Stuyvesant High School', 'emily@example.com', 2025, 'Stand against hate');

-- Link signatures to colleges
SET @sig1 = (SELECT id FROM petition_signatures WHERE email = 'david@example.com');
SET @sig2 = (SELECT id FROM petition_signatures WHERE email = 'emily@example.com');

INSERT INTO petition_boycott_colleges (id, signature_id, college_id) VALUES
(UUID(), @sig1, @upenn_id),
(UUID(), @sig1, @columbia_id),
(UUID(), @sig2, @harvard_id);

-- Insert resources
INSERT INTO resources (id, title, content, resource_url) VALUES
(UUID(), 'Campus Safety Guide', 'Tips for staying safe on campus', 'https://example.com/safety.pdf'),
(UUID(), 'Reporting Hate Crimes', 'Step-by-step guide to reporting incidents', 'https://example.com/reporting');

-- Insert blog posts
INSERT INTO blog_posts (id, title, slug, content, author, status, published_at) VALUES
(UUID(), 'Understanding Campus Climate', 'understanding-campus-climate', 'Lorem ipsum dolor sit amet...', 'Editor Team', 'published', NOW()),
(UUID(), 'New Safety Initiatives', 'new-safety-initiatives', 'Draft content...', 'John Doe', 'draft', NULL);

-- Insert contact submissions
INSERT INTO contacts (id, name, email, message) VALUES
(UUID(), 'Rachel Green', 'rachel@example.com', 'How can I get involved?'),
(UUID(), 'Michael Stern', 'michael@example.com', 'Requesting more information about...');

-- Insert admin users
INSERT INTO admin_users (id, username, email, password, role) VALUES
(UUID(), 'admin1', 'admin@example.com', 'hashed_password_here', 'superadmin'),
(UUID(), 'editor1', 'editor@example.com', 'hashed_password_here', 'editor');