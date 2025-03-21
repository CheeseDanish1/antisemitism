-- Insert sample colleges
INSERT INTO colleges (id, name, description, location, website, ranking) VALUES
(UUID(), 'University of Pennsylvania', 'Ivy League university in Philadelphia', 'Philadelphia, PA', 'www.upenn.edu', 4.50),
(UUID(), 'Harvard University', 'Private Ivy League research university', 'Cambridge, MA', 'www.harvard.edu', 4.80),
(UUID(), 'Columbia University', 'Private Ivy League university in New York City', 'New York, NY', 'www.columbia.edu', 4.30),
(UUID(), 'Johns Hopkins University', 'Private university in Baltimor', 'Baltimore, MD', 'www.jhu.edu', 4.70),
(UUID(), 'Cornell University', 'Private Ivy League university in Ithica', 'Ithica, NY', 'www.cornell.edu', 4.50);

-- Insert interviews (get college IDs first)
SET @upenn_id = (SELECT id FROM colleges WHERE name = 'University of Pennsylvania' LIMIT 1);
SET @harvard_id = (SELECT id FROM colleges WHERE name = 'Harvard University' LIMIT 1);
SET @columbia_id = (SELECT id FROM colleges WHERE name = 'Columbia University' LIMIT 1);
SET @jhu_id = (SELECT id FROM colleges WHERE name = 'Johns Hopkins University' LIMIT 1);
SET @cornell_id = (SELECT id FROM colleges WHERE name = 'Cornell University' LIMIT 1);

INSERT INTO interviews (id, college_id, title, interviewee_name, interviewee_title, content, media_type, media_url, final_assessment) VALUES
(UUID(), @upenn_id, 'Campus Safety Discussion', 'Sarah Cohen', 'Jewish Student Leader', 'Discussion about recent campus climate', 'video', 'https://example.com/video1', 3.5),
(UUID(), @harvard_id, 'Admissions Process', 'Michael Roth', 'Admissions Officer', 'Interview about diversity initiatives', 'audio', 'https://example.com/audio1', 4.2);

-- Insert interview questions (get interview IDs first)
SET @interview1 = (SELECT id FROM interviews WHERE title LIKE '%Campus Safety%' LIMIT 1);

INSERT INTO interview_questions (id, interview_id, question, answer, position) VALUES
(UUID(), @interview1, 'What safety measures exist for Jewish students?', 'We have increased campus patrols...', 1),
(UUID(), @interview1, 'How does the university handle bias reports?', 'All reports are investigated...', 2);

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

-- Now, let's insert sample incidents
-- We'll create a mix of different severities, statuses, and dates

-- Generating sample incidents spanning the last 6 months
INSERT INTO incidents (id, title, description, college_id, incident_date, severity, location, media_url, reported_by, status, reported_at) VALUES
-- Pending incidents
('a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 'Water Leak in Library', 'Water leaking from ceiling on the 3rd floor near the reference section. Several books have been damaged.', @upenn_id, '2025-03-15', 3, 'Main Library, 3rd Floor', 'https://example.com/media/leak1.jpg', 'John Smith', 'pending', '2025-03-15 14:30:00'),
('b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901', 'Broken Window in Dorm', 'Window shattered in Room 302, possibly due to strong winds. Glass shards on the floor pose a safety risk.', @harvard_id, '2025-03-10', 2, 'Dormitory A, Room 302', 'https://example.com/media/window1.jpg', 'Maria Garcia', 'pending', '2025-03-10 09:15:00'),
('c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012', 'Power Outage in Science Building', 'Complete power failure in the Science Building. All experiments and equipment affected.', @columbia_id, '2025-03-18', 4, 'Science Building', 'https://example.com/media/power1.jpg', 'Robert Johnson', 'pending', '2025-03-18 16:45:00'),
('d4e5f6a7-b8c9-0123-d4e5-f6a7b8c90123', 'Graffiti on Admin Building', 'Offensive graffiti on the north wall of the Administration Building.', @jhu_id, '2025-03-12', 2, 'Administration Building, North Wall', 'https://example.com/media/graffiti1.jpg', 'Jennifer Lee', 'pending', '2025-03-12 08:30:00'),
('e5f6a7b8-c9d0-1234-e5f6-a7b8c9d01234', 'Chemical Spill in Lab', 'Small acid spill in Chemistry Lab 4. Area has been evacuated but requires professional cleanup.', @cornell_id, '2025-03-20', 3, 'Chemistry Building, Lab 4', 'https://example.com/media/spill1.jpg', 'David Wilson', 'pending', '2025-03-20 11:20:00'),

-- Verified incidents
('f6a7b8c9-d0e1-2345-f6a7-b8c9d0e12345', 'HVAC Failure in Computer Lab', 'The air conditioning system has failed in the main computer lab. Temperature exceeds 85°F, endangering equipment.', @upenn_id, '2025-02-25', 3, 'Computer Science Building, Lab 101', 'https://example.com/media/hvac1.jpg', 'Sarah Thompson', 'verified', '2025-02-25 13:40:00'),
('a7b8c9d0-e1f2-3456-a7b8-c9d0e1f23456', 'Elevator Malfunction', 'Main elevator in the Business School building stuck between floors with no occupants inside.', @jhu_id, '2025-02-18', 3, 'Business School, Main Elevator', 'https://example.com/media/elevator1.jpg', 'Michael Brown', 'verified', '2025-02-18 15:10:00'),
('b8c9d0e1-f2a3-4567-b8c9-d0e1f2a34567', 'Flooding in Basement', 'Severe flooding in the basement of the Engineering building after heavy rain. Water level approximately 4 inches.', @cornell_id, '2025-03-05', 4, 'Engineering Building, Basement', 'https://example.com/media/flood1.jpg', 'Emily Davis', 'verified', '2025-03-05 18:20:00'),
('c9d0e1f2-a3b4-5678-c9d0-e1f2a3b45678', 'Suspicious Person Reported', 'Unidentified individual attempting to access secure areas in the Medical Sciences building.', @columbia_id, '2025-03-08', 5, 'Medical Sciences Building, East Wing', 'https://example.com/media/security1.jpg', 'James Wilson', 'verified', '2025-03-08 22:30:00'),
('d0e1f2a3-b4c5-6789-d0e1-f2a3b4c56789', 'Fire Alarm Malfunction', 'Fire alarm system in Liberal Arts building continuously triggering false alarms.', @harvard_id, '2025-02-27', 3, 'Liberal Arts Building', 'https://example.com/media/alarm1.jpg', 'Sophia Martinez', 'verified', '2025-02-27 10:50:00'),

-- Resolved incidents
('e1f2a3b4-c5d6-7890-e1f2-a3b4c5d67890', 'Network Outage in Dorms', 'Complete internet service disruption in all dormitories. Affecting approximately 500 students.', @upenn_id, '2025-01-20', 4, 'All Dormitories', 'https://example.com/media/network1.jpg', 'William Taylor', 'resolved', '2025-01-20 19:15:00'),
('f2a3b4c5-d6e7-8901-f2a3-b4c5d6e78901', 'Broken AC in Lecture Hall', 'Air conditioning unit broken in main lecture hall causing excessive heat during classes.', @harvard_id, '2025-01-15', 2, 'Main Lecture Hall, Building C', 'https://example.com/media/ac1.jpg', 'Olivia Johnson', 'resolved', '2025-01-15 14:00:00'),
('a3b4c5d6-e7f8-9012-a3b4-c5d6e7f89012', 'Gas Smell in Cafeteria', 'Strong smell of gas reported in the main cafeteria kitchen area. Kitchen staff evacuated.', @jhu_id, '2025-02-05', 5, 'Main Cafeteria, Kitchen Area', 'https://example.com/media/gas1.jpg', 'Daniel Brown', 'resolved', '2025-02-05 08:45:00'),
('b4c5d6e7-f8a9-0123-b4c5-d6e7f8a90123', 'Roof Leak in Auditorium', 'Water leaking through roof during rainstorm, damaging seating and flooring in main auditorium.', @columbia_id, '2025-01-28', 3, 'Main Auditorium', 'https://example.com/media/roof1.jpg', 'Emma Wilson', 'resolved', '2025-01-28 16:30:00'),
('c5d6e7f8-a9b0-1234-c5d6-e7f8a9b01234', 'Fallen Tree on Pathway', 'Large oak tree fell across main campus pathway following overnight storm. Blocking access to Science Building.', @cornell_id, '2025-02-10', 3, 'Main Campus Pathway, East Side', 'https://example.com/media/tree1.jpg', 'Noah Garcia', 'resolved', '2025-02-10 07:20:00'),

-- Older incidents from previous months (resolved)
('d6e7f8a9-b0c1-2345-d6e7-f8a9b0c12345', 'Student Protest Disruption', 'Large student protest blocking access to Administration Building.', @jhu_id, '2024-11-12', 3, 'Administration Building, Main Entrance', 'https://example.com/media/protest1.jpg', 'Isabella Thomas', 'resolved', '2024-11-12 13:00:00'),
('e7f8a9b0-c1d2-3456-e7f8-a9b0c1d23456', 'Lab Equipment Theft', 'Several microscopes and laptops reported missing from Biology Lab 3.', @columbia_id, '2024-10-05', 4, 'Biology Building, Lab 3', 'https://example.com/media/theft1.jpg', 'Ethan Anderson', 'resolved', '2024-10-05 09:10:00'),
('f8a9b0c1-d2e3-4567-f8a9-b0c1d2e34567', 'Sewage Backup in Dorm', 'Sewage system backed up in Dormitory B basement, affecting laundry facilities.', @harvard_id, '2024-12-08', 4, 'Dormitory B, Basement', 'https://example.com/media/sewage1.jpg', 'Mia Johnson', 'resolved', '2024-12-08 20:40:00'),
('a9b0c1d2-e3f4-5678-a9b0-c1d2e3f45678', 'Classroom Projector Failure', 'Main projector in Lecture Hall 101 failed during important presentation.', @upenn_id, '2024-10-22', 1, 'Lecture Hall 101, Building A', 'https://example.com/media/projector1.jpg', 'Liam Davis', 'resolved', '2024-10-22 15:30:00'),
('b0c1d2e3-f4a5-6789-b0c1-d2e3f4a56789', 'Ice on Walkways', 'Dangerous ice accumulation on main campus walkways causing multiple slip incidents.', @cornell_id, '2024-12-15', 3, 'Main Campus Walkways', 'https://example.com/media/ice1.jpg', 'Ava Robinson', 'resolved', '2024-12-15 07:50:00'),

-- More recent incidents with various severities
('c1d2e3f4-a5b6-7890-c1d2-e3f4a5b67890', 'Mold in Student Housing', 'Black mold found in multiple rooms of Student Housing Building C.', @harvard_id, '2025-03-01', 4, 'Student Housing Building C, Rooms 201-205', 'https://example.com/media/mold1.jpg', 'Lucas Martin', 'verified', '2025-03-01 11:10:00'),
('d2e3f4a5-b6c7-8901-d2e3-f4a5b6c78901', 'Burst Pipe in Faculty Building', 'Water pipe burst on second floor of Faculty Building, causing water damage to multiple offices.', @upenn_id, '2025-02-15', 3, 'Faculty Building, Second Floor', 'https://example.com/media/pipe1.jpg', 'Chloe Wilson', 'verified', '2025-02-15 14:25:00'),
('e3f4a5b6-c7d8-9012-e3f4-a5b6c7d89012', 'Fire in Chemistry Lab', 'Small fire occurred during experiment in Chemistry Lab 2. Extinguished with fire extinguisher but smoke damage present.', @cornell_id, '2025-03-16', 5, 'Chemistry Building, Lab 2', 'https://example.com/media/fire1.jpg', 'Alexander Lee', 'pending', '2025-03-16 15:35:00'),
('f4a5b6c7-d8e9-0123-f4a5-b6c7d8e90123', 'Accessibility Ramp Damage', 'Main accessibility ramp to Library damaged and unusable.', @upenn_id, '2025-02-24', 3, 'Library, Main Entrance', 'https://example.com/media/ramp1.jpg', 'Grace Thompson', 'resolved', '2025-02-24 09:40:00'),
('a5b6c7d8-e9f0-1234-a5b6-c7d8e9f01234', 'Parking Structure Gate Malfunction', 'Main gate to Faculty Parking Structure stuck in closed position. No access for vehicles.', @jhu_id, '2025-03-09', 2, 'Faculty Parking Structure, Main Entrance', 'https://example.com/media/gate1.jpg', 'Benjamin Rodriguez', 'verified', '2025-03-09 08:15:00');

-- Now let's insert sample evidence for some of the incidents
INSERT INTO incident_evidences (id, incident_id, evidence_url, description, uploaded_at) VALUES
-- Evidence for water leak
('e1e1e1e1-1111-1111-1111-e1e1e1e1e1e1', 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 'https://example.com/evidence/leak_ceiling.jpg', 'Photo of water coming through ceiling', '2025-03-15 14:40:00'),
('e2e2e2e2-2222-2222-2222-e2e2e2e2e2e2', 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 'https://example.com/evidence/leak_damage.jpg', 'Photo of damaged books', '2025-03-15 14:45:00'),
('e3e3e3e3-3333-3333-3333-e3e3e3e3e3e3', 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 'https://example.com/evidence/leak_report.pdf', 'Initial assessment report from maintenance', '2025-03-16 09:30:00'),

-- Evidence for broken window
('e4e4e4e4-4444-4444-4444-e4e4e4e4e4e4', 'b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901', 'https://example.com/evidence/window_broken.jpg', 'Photo of shattered window', '2025-03-10 09:20:00'),
('e5e5e5e5-5555-5555-5555-e5e5e5e5e5e5', 'b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901', 'https://example.com/evidence/window_glass.jpg', 'Photo of glass on floor', '2025-03-10 09:25:00'),

-- Evidence for power outage
('e6e6e6e6-6666-6666-6666-e6e6e6e6e6e6', 'c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012', 'https://example.com/evidence/power_panel.jpg', 'Photo of electrical panel', '2025-03-18 16:50:00'),
('e7e7e7e7-7777-7777-7777-e7e7e7e7e7e7', 'c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012', 'https://example.com/evidence/power_affected_lab.jpg', 'Photo of affected laboratory equipment', '2025-03-18 16:55:00'),
('e8e8e8e8-8888-8888-8888-e8e8e8e8e8e8', 'c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012', 'https://example.com/evidence/power_electrician.pdf', 'Initial assessment from electrician', '2025-03-19 10:15:00'),

-- Evidence for chemical spill
('e9e9e9e9-9999-9999-9999-e9e9e9e9e9e9', 'e5f6a7b8-c9d0-1234-e5f6-a7b8c9d01234', 'https://example.com/evidence/chemical_spill.jpg', 'Photo of spill area (taken from safe distance)', '2025-03-20 11:25:00'),
('e0e0e0e0-0000-0000-0000-e0e0e0e0e0e0', 'e5f6a7b8-c9d0-1234-e5f6-a7b8c9d01234', 'https://example.com/evidence/chemical_report.pdf', 'Chemical safety incident report', '2025-03-20 13:40:00'),

-- Evidence for network outage
('a1a1a1a1-aaaa-aaaa-aaaa-a1a1a1a1a1a1', 'e1f2a3b4-c5d6-7890-e1f2-a3b4c5d67890', 'https://example.com/evidence/network_status.png', 'Screenshot of network monitoring system', '2025-01-20 19:30:00'),
('b1b1b1b1-bbbb-bbbb-bbbb-b1b1b1b1b1b1', 'e1f2a3b4-c5d6-7890-e1f2-a3b4c5d67890', 'https://example.com/evidence/network_equipment.jpg', 'Photo of damaged network equipment', '2025-01-20 20:15:00'),
('c1c1c1c1-cccc-cccc-cccc-c1c1c1c1c1c1', 'e1f2a3b4-c5d6-7890-e1f2-a3b4c5d67890', 'https://example.com/evidence/network_resolution.pdf', 'Report on resolution of the issue', '2025-01-21 14:30:00'),

-- Evidence for suspicious person
('d1d1d1d1-dddd-dddd-dddd-d1d1d1d1d1d1', 'c9d0e1f2-a3b4-5678-c9d0-e1f2a3b45678', 'https://example.com/evidence/security_footage.mp4', 'Security camera footage (timestamp 22:15-22:35)', '2025-03-08 23:00:00'),
('f1f1f1f1-ffff-ffff-ffff-f1f1f1f1f1f1', 'c9d0e1f2-a3b4-5678-c9d0-e1f2a3b45678', 'https://example.com/evidence/security_door.jpg', 'Photo of tampered door lock', '2025-03-08 23:10:00'),
('a2a2a2a2-aaaa-aaaa-aaaa-a2a2a2a2a2a2', 'c9d0e1f2-a3b4-5678-c9d0-e1f2a3b45678', 'https://example.com/evidence/security_report.pdf', 'Campus security incident report', '2025-03-09 08:45:00'),

-- Evidence for fire in chemistry lab
('b2b2b2b2-bbbb-bbbb-bbbb-b2b2b2b2b2b2', 'e3f4a5b6-c7d8-9012-e3f4-a5b6c7d89012', 'https://example.com/evidence/fire_damage.jpg', 'Photo of burn marks on lab bench', '2025-03-16 15:45:00'),
('c2c2c2c2-cccc-cccc-cccc-c2c2c2c2c2c2', 'e3f4a5b6-c7d8-9012-e3f4-a5b6c7d89012', 'https://example.com/evidence/fire_extinguisher.jpg', 'Photo of used fire extinguisher', '2025-03-16 15:50:00'),
('d2d2d2d2-dddd-dddd-dddd-d2d2d2d2d2d2', 'e3f4a5b6-c7d8-9012-e3f4-a5b6c7d89012', 'https://example.com/evidence/fire_report.pdf', 'Lab safety incident report', '2025-03-16 18:20:00'),
('f2f2f2f2-ffff-ffff-ffff-f2f2f2f2f2f2', 'e3f4a5b6-c7d8-9012-e3f4-a5b6c7d89012', 'https://example.com/evidence/fire_procedure.pdf', 'Documentation of emergency procedures followed', '2025-03-17 09:15:00');