INSERT INTO colleges (id, name, description, location, website, ranking)
VALUES 
(UUID(), 'University of Pennsylvania', 'Private Ivy League university in Philadelphia', 'Philadelphia, PA', 'www.upenn.edu', 4.70),
(UUID(), 'Harvard University', 'Private Ivy League university in Cambridge', 'Cambridge, MA', 'www.harvard.edu', 4.95),
(UUID(), 'Columbia University', 'Private Ivy League university in New York', 'New York, NY', 'www.columbia.edu', 4.80),
(UUID(), 'Johns Hopkins University', 'Private research university known for medicine', 'Baltimore, MD', 'www.jhu.edu', 4.65),
(UUID(), 'Cornell University', 'Private Ivy League university in Ithaca', 'Ithaca, NY', 'www.cornell.edu', 4.50),
(UUID(), 'Stanford University', 'Private research university in Stanford, California', 'Stanford, CA', 'www.stanford.edu', 4.85),
(UUID(), 'Massachusetts Institute of Technology', 'Private research university focusing on science and technology', 'Cambridge, MA', 'www.mit.edu', 4.90),
(UUID(), 'Yale University', 'Private Ivy League research university', 'New Haven, CT', 'www.yale.edu', 4.75),
(UUID(), 'University of Chicago', 'Private research university in Chicago', 'Chicago, IL', 'www.uchicago.edu', 4.60),
(UUID(), 'California Institute of Technology', 'Private research university focusing on science and engineering', 'Pasadena, CA', 'www.caltech.edu', 4.88),
(UUID(), 'Duke University', 'Private research university located in Durham', 'Durham, NC', 'www.duke.edu', 4.55),
(UUID(), 'Princeton University', 'Private Ivy League research university', 'Princeton, NJ', 'www.princeton.edu', 4.82),
(UUID(), 'University of Michigan', 'Public research university in Ann Arbor', 'Ann Arbor, MI', 'www.umich.edu', 4.40),
(UUID(), 'UC Berkeley', 'Public research university in Berkeley', 'Berkeley, CA', 'www.berkeley.edu', 4.65),
(UUID(), 'Brown University', 'Private Ivy League research university', 'Providence, RI', 'www.brown.edu', 4.45);

-- Get all college IDs
SET @upenn_id = (SELECT id FROM colleges WHERE name = 'University of Pennsylvania' LIMIT 1);
SET @harvard_id = (SELECT id FROM colleges WHERE name = 'Harvard University' LIMIT 1);
SET @columbia_id = (SELECT id FROM colleges WHERE name = 'Columbia University' LIMIT 1);
SET @jhu_id = (SELECT id FROM colleges WHERE name = 'Johns Hopkins University' LIMIT 1);
SET @cornell_id = (SELECT id FROM colleges WHERE name = 'Cornell University' LIMIT 1);
SET @stanford_id = (SELECT id FROM colleges WHERE name = 'Stanford University' LIMIT 1);
SET @mit_id = (SELECT id FROM colleges WHERE name = 'Massachusetts Institute of Technology' LIMIT 1);
SET @yale_id = (SELECT id FROM colleges WHERE name = 'Yale University' LIMIT 1);
SET @chicago_id = (SELECT id FROM colleges WHERE name = 'University of Chicago' LIMIT 1);
SET @caltech_id = (SELECT id FROM colleges WHERE name = 'California Institute of Technology' LIMIT 1);
SET @duke_id = (SELECT id FROM colleges WHERE name = 'Duke University' LIMIT 1);
SET @princeton_id = (SELECT id FROM colleges WHERE name = 'Princeton University' LIMIT 1);
SET @umich_id = (SELECT id FROM colleges WHERE name = 'University of Michigan' LIMIT 1);
SET @berkeley_id = (SELECT id FROM colleges WHERE name = 'UC Berkeley' LIMIT 1);
SET @brown_id = (SELECT id FROM colleges WHERE name = 'Brown University' LIMIT 1);

-- Insert interviews
INSERT INTO interviews (id, college_id, title, interviewee_name, interviewee_title, content, media_type, media_url, final_assessment, published_at)
VALUES
-- UPenn interviews
(UUID(), @upenn_id, 'Wharton Business School Experience', 'Sarah Johnson', 'MBA Student', 'Sarah discusses her experience at the Wharton School of Business, including the competitive admissions process and the collaborative study environment.', 'video', 'https://example.com/videos/sarah-johnson-interview', 4.5, '2024-08-15 14:30:00'),
(UUID(), @upenn_id, 'Engineering Program Insights', 'Michael Chen', 'Engineering Professor', 'Professor Chen provides an overview of the engineering programs at UPenn, highlighting research opportunities and industry connections.', 'audio', 'https://example.com/audio/prof-chen-interview', 4.2, '2024-07-10 09:15:00'),

-- Harvard interviews
(UUID(), @harvard_id, 'Law School Faculty Perspective', 'Elizabeth Warren', 'Law Professor', 'Professor Warren shares insights about Harvard Law School curriculum and career opportunities for graduates.', 'text', NULL, 4.8, '2024-09-20 11:00:00'),
(UUID(), @harvard_id, 'Undergraduate Research Opportunities', 'James Wilson', 'Academic Dean', 'Dean Wilson explains the variety of undergraduate research opportunities available at Harvard across all disciplines.', 'video', 'https://example.com/videos/dean-wilson-interview', 4.5, '2024-06-05 13:45:00'),

-- Columbia interviews
(UUID(), @columbia_id, 'Journalism School Overview', 'Rachel Martinez', 'Department Chair', 'Chair Martinez discusses Columbia''s prestigious journalism program and its connections to media outlets in NYC.', 'text', NULL, 4.3, '2024-05-12 10:30:00'),
(UUID(), @columbia_id, 'Student Life in NYC', 'Daniel Kim', 'Student Body President', 'Daniel shares his experience navigating student life at Columbia in the heart of New York City.', 'video', 'https://example.com/videos/daniel-kim-interview', 4.0, '2024-08-02 15:00:00'),

-- Johns Hopkins interviews
(UUID(), @jhu_id, 'Medical Research Program', 'Dr. Lisa Patel', 'Medical Researcher', 'Dr. Patel outlines the cutting-edge medical research programs at Johns Hopkins and career paths for graduates.', 'audio', 'https://example.com/audio/dr-patel-interview', 4.7, '2024-07-25 12:00:00'),
(UUID(), @jhu_id, 'Public Health Program Overview', 'Thomas Greene', 'Associate Dean', 'Associate Dean Greene discusses the public health programs at JHU and their global impact.', 'text', NULL, 4.6, '2024-09-10 09:00:00'),

-- Cornell interviews
(UUID(), @cornell_id, 'Agriculture College Experience', 'Emma Thompson', 'Graduate Student', 'Emma shares her experience in Cornell''s agriculture program and the hands-on learning opportunities provided.', 'video', 'https://example.com/videos/emma-thompson-interview', 4.2, '2024-06-18 14:00:00'),
(UUID(), @cornell_id, 'Hotel Administration Program', 'Robert Sanchez', 'Program Director', 'Director Sanchez provides an overview of Cornell''s renowned Hotel Administration program and industry placements.', 'text', NULL, 4.4, '2024-08-30 11:30:00'),

-- Stanford interviews
(UUID(), @stanford_id, 'Computer Science and AI Research', 'Dr. Alan Turing', 'CS Department Chair', 'Dr. Turing discusses Stanford''s leadership in computer science research and AI development programs.', 'video', 'https://example.com/videos/turing-interview', 4.9, '2024-09-05 10:00:00'),
(UUID(), @stanford_id, 'Athletic Programs and Student Athletes', 'Jennifer Davis', 'Athletic Director', 'Director Davis talks about balancing academic excellence with competitive athletics at Stanford.', 'audio', 'https://example.com/audio/davis-sports-interview', 4.3, '2024-07-15 13:00:00'),

-- MIT interviews
(UUID(), @mit_id, 'Robotics Lab Innovations', 'Dr. Robert Chen', 'Robotics Lab Director', 'Dr. Chen showcases MIT''s latest innovations in robotics and opportunities for student involvement.', 'video', 'https://example.com/videos/mit-robotics-interview', 4.8, '2024-08-10 15:30:00'),
(UUID(), @mit_id, 'Media Lab Projects', 'Sophia Alvarez', 'Media Lab Researcher', 'Researcher Alvarez presents creative projects from MIT''s Media Lab and interdisciplinary opportunities.', 'text', NULL, 4.6, '2024-06-25 11:15:00'),

-- Yale interviews
(UUID(), @yale_id, 'Drama School Production', 'William Thompson', 'Drama School Dean', 'Dean Thompson discusses Yale''s prestigious drama program and recent student productions.', 'audio', 'https://example.com/audio/yale-drama-interview', 4.5, '2024-05-20 14:45:00'),
(UUID(), @yale_id, 'Political Science Department', 'Dr. Maria Garcia', 'Political Science Professor', 'Dr. Garcia provides insights into Yale''s political science curriculum and research opportunities.', 'text', NULL, 4.4, '2024-09-15 10:30:00'),

-- Additional interviews for other colleges
(UUID(), @chicago_id, 'Economics Program Overview', 'Dr. Paul Krugman', 'Economics Professor', 'Dr. Krugman explains Chicago''s approach to economics education and research methodologies.', 'text', NULL, 4.7, '2024-06-08 09:45:00'),
(UUID(), @caltech_id, 'Physics Research Opportunities', 'Dr. Stephen Miller', 'Physics Department Chair', 'Chair Miller outlines Caltech''s physics research initiatives and student involvement opportunities.', 'video', 'https://example.com/videos/caltech-physics-interview', 4.9, '2024-07-05 13:30:00'),
(UUID(), @duke_id, 'Business School Innovations', 'Catherine Woods', 'MBA Program Director', 'Director Woods discusses Duke''s innovative business programs and entrepreneurship opportunities.', 'audio', 'https://example.com/audio/duke-business-interview', 4.5, '2024-08-25 11:00:00'),
(UUID(), @princeton_id, 'Engineering Ethics Course', 'Dr. James Wilson', 'Ethics Professor', 'Professor Wilson discusses Princeton''s focus on engineering ethics and responsible innovation.', 'text', NULL, 4.3, '2024-09-12 14:15:00'),
(UUID(), @umich_id, 'Public Policy Program', 'Samantha Johnson', 'Public Policy Director', 'Director Johnson outlines Michigan''s public policy program and career paths for graduates.', 'video', 'https://example.com/videos/umich-policy-interview', 4.2, '2024-05-28 10:15:00'),
(UUID(), @berkeley_id, 'Environmental Science Research', 'Dr. Laura Chen', 'Environmental Science Chair', 'Dr. Chen discusses Berkeley''s leadership in environmental science and sustainability research.', 'audio', 'https://example.com/audio/berkeley-environment-interview', 4.6, '2024-07-18 09:30:00'),
(UUID(), @brown_id, 'Liberal Arts Education', 'Dr. Robert Williams', 'Liberal Arts Dean', 'Dean Williams explains Brown''s approach to liberal arts education and the open curriculum.', 'text', NULL, 4.4, '2024-06-30 13:15:00');

-- Now let's get all interview IDs for adding questions
SET @upenn_interview1_id = (SELECT id FROM interviews WHERE college_id = @upenn_id AND interviewee_name = 'Sarah Johnson' LIMIT 1);
SET @upenn_interview2_id = (SELECT id FROM interviews WHERE college_id = @upenn_id AND interviewee_name = 'Michael Chen' LIMIT 1);
SET @harvard_interview1_id = (SELECT id FROM interviews WHERE college_id = @harvard_id AND interviewee_name = 'Elizabeth Warren' LIMIT 1);
SET @harvard_interview2_id = (SELECT id FROM interviews WHERE college_id = @harvard_id AND interviewee_name = 'James Wilson' LIMIT 1);
SET @columbia_interview1_id = (SELECT id FROM interviews WHERE college_id = @columbia_id AND interviewee_name = 'Rachel Martinez' LIMIT 1);
SET @columbia_interview2_id = (SELECT id FROM interviews WHERE college_id = @columbia_id AND interviewee_name = 'Daniel Kim' LIMIT 1);
SET @jhu_interview1_id = (SELECT id FROM interviews WHERE college_id = @jhu_id AND interviewee_name = 'Dr. Lisa Patel' LIMIT 1);
SET @jhu_interview2_id = (SELECT id FROM interviews WHERE college_id = @jhu_id AND interviewee_name = 'Thomas Greene' LIMIT 1);
SET @cornell_interview1_id = (SELECT id FROM interviews WHERE college_id = @cornell_id AND interviewee_name = 'Emma Thompson' LIMIT 1);
SET @cornell_interview2_id = (SELECT id FROM interviews WHERE college_id = @cornell_id AND interviewee_name = 'Robert Sanchez' LIMIT 1);
SET @stanford_interview1_id = (SELECT id FROM interviews WHERE college_id = @stanford_id AND interviewee_name = 'Dr. Alan Turing' LIMIT 1);
SET @stanford_interview2_id = (SELECT id FROM interviews WHERE college_id = @stanford_id AND interviewee_name = 'Jennifer Davis' LIMIT 1);
SET @mit_interview1_id = (SELECT id FROM interviews WHERE college_id = @mit_id AND interviewee_name = 'Dr. Robert Chen' LIMIT 1);
SET @mit_interview2_id = (SELECT id FROM interviews WHERE college_id = @mit_id AND interviewee_name = 'Sophia Alvarez' LIMIT 1);
SET @yale_interview1_id = (SELECT id FROM interviews WHERE college_id = @yale_id AND interviewee_name = 'William Thompson' LIMIT 1);
SET @yale_interview2_id = (SELECT id FROM interviews WHERE college_id = @yale_id AND interviewee_name = 'Dr. Maria Garcia' LIMIT 1);
SET @chicago_interview_id = (SELECT id FROM interviews WHERE college_id = @chicago_id AND interviewee_name = 'Dr. Paul Krugman' LIMIT 1);
SET @caltech_interview_id = (SELECT id FROM interviews WHERE college_id = @caltech_id AND interviewee_name = 'Dr. Stephen Miller' LIMIT 1);
SET @duke_interview_id = (SELECT id FROM interviews WHERE college_id = @duke_id AND interviewee_name = 'Catherine Woods' LIMIT 1);
SET @princeton_interview_id = (SELECT id FROM interviews WHERE college_id = @princeton_id AND interviewee_name = 'Dr. James Wilson' LIMIT 1);
SET @umich_interview_id = (SELECT id FROM interviews WHERE college_id = @umich_id AND interviewee_name = 'Samantha Johnson' LIMIT 1);
SET @berkeley_interview_id = (SELECT id FROM interviews WHERE college_id = @berkeley_id AND interviewee_name = 'Dr. Laura Chen' LIMIT 1);
SET @brown_interview_id = (SELECT id FROM interviews WHERE college_id = @brown_id AND interviewee_name = 'Dr. Robert Williams' LIMIT 1);

-- Insert interview questions
INSERT INTO interview_questions (id, interview_id, question, answer, position)
VALUES
-- UPenn - Sarah Johnson interview questions
(UUID(), @upenn_interview1_id, 'What was your admissions process like for Wharton?', 'The admissions process was rigorous. I had to submit my academic records, GMAT scores, essays about my career goals, and participated in a team-based discussion and personal interview. Wharton places a strong emphasis on both individual achievement and collaborative skills.', 1),
(UUID(), @upenn_interview1_id, 'How would you describe the learning environment at Wharton?', 'The learning environment is both competitive and collaborative. Students are high-achievers, but there''s a strong emphasis on teamwork. The case-based learning approach means we often work in study groups to solve complex business problems, which mirrors real-world business environments.', 2),
(UUID(), @upenn_interview1_id, 'What opportunities for networking have you found at Wharton?', 'The networking opportunities are exceptional. We have regular events with industry leaders, alumni networking sessions, and club-sponsored conferences. Philadelphia''s proximity to New York also means many firms regularly visit campus for recruitment.', 3),
(UUID(), @upenn_interview1_id, 'How has Wharton prepared you for your career goals?', 'Wharton has provided me with both theoretical knowledge and practical skills. The experiential learning opportunities, like consulting projects with real companies, have been invaluable. The career services team also provides extensive support for internship and job placement.', 4),

-- UPenn - Michael Chen interview questions
(UUID(), @upenn_interview2_id, 'Can you describe the engineering program''s strengths at UPenn?', 'UPenn''s engineering program excels in combining technical rigor with interdisciplinary opportunities. Our students can easily collaborate with Wharton for business perspectives or the medical school for bioengineering applications. This creates engineers who understand both the technical and broader contexts of their work.', 1),
(UUID(), @upenn_interview2_id, 'What research opportunities are available to engineering students?', 'We have numerous research labs across all engineering disciplines. Undergraduate students can participate through formal programs like the Research Experience for Undergraduates or through direct mentorship with faculty. Many of our students co-author publications before graduation.', 2),
(UUID(), @upenn_interview2_id, 'How does UPenn''s engineering program connect with industry?', 'We maintain strong connections with industry through our Industrial Research Partners program. Companies fund research, provide internships, participate in career fairs, and offer feedback on our curriculum to ensure it remains relevant to industry needs.', 3),
(UUID(), @upenn_interview2_id, 'What are some emerging areas of focus for UPenn engineering?', 'We''re particularly expanding in robotics, AI, sustainable engineering, and biomedical applications. Our new robotics laboratory opened last year, and we''ve recently launched an initiative on engineering for climate resilience.', 4),

-- Harvard - Elizabeth Warren interview questions
(UUID(), @harvard_interview1_id, 'What makes Harvard Law School unique compared to other top law schools?', 'Harvard Law combines scale with excellence in a way few institutions can match. With over 80 full-time faculty members, we offer unparalleled breadth of expertise across all legal domains. Our students benefit from both specialized knowledge and a comprehensive legal education.', 1),
(UUID(), @harvard_interview1_id, 'How would you describe the teaching methodology at Harvard Law?', 'We employ a modified Socratic method that encourages critical thinking and careful analysis. Classes involve vigorous discussion, with students expected to defend their positions and consider multiple perspectives. This approach develops both legal reasoning and communication skills essential for practice.', 2),
(UUID(), @harvard_interview1_id, 'What career paths do Harvard Law graduates typically pursue?', 'Our graduates follow diverse paths. While many join prestigious law firms, a significant number go into public service, government, academia, or business. The Harvard Law degree opens doors across sectors, and our career services office supports students in exploring all these avenues.', 3),
(UUID(), @harvard_interview1_id, 'How does Harvard Law adapt to changing legal landscapes?', 'We continually evolve our curriculum to address emerging legal challenges. Recent additions include courses on technology law, climate regulation, and global governance. We also incorporate practical skills training to ensure graduates are practice-ready in today''s legal environment.', 4),

-- Harvard - James Wilson interview questions
(UUID(), @harvard_interview2_id, 'What types of undergraduate research opportunities does Harvard offer?', 'Harvard provides extensive research opportunities across all disciplines. Students can engage through formal programs like PRISE (Program for Research in Science and Engineering), BLISS (Behavioral Laboratory in the Social Sciences), or through independent study with faculty mentors. Funding is available through numerous grants and fellowships.', 1),
(UUID(), @harvard_interview2_id, 'How early can undergraduates get involved in research?', 'Students can begin as early as their first year. We encourage early involvement through First-Year Seminars with research components and the Freshman Seminar Program. Many departments also offer research-focused introductory courses that can lead to deeper involvement.', 2),
(UUID(), @harvard_interview2_id, 'What support does Harvard provide for undergraduate researchers?', 'Beyond funding, we provide methodological training, ethical research guidance, and presentation opportunities. The Office of Undergraduate Research and Fellowships offers workshops, individual advising, and connects students with appropriate research mentors.', 3),
(UUID(), @harvard_interview2_id, 'How does undergraduate research enhance the Harvard experience?', 'Research transforms education from passive learning to active discovery. Students develop critical thinking, problem-solving skills, and often find their academic passions through research. Many tell us these experiences were the most formative part of their Harvard education.', 4),

-- Columbia - Rachel Martinez interview questions
(UUID(), @columbia_interview1_id, 'How does Columbia''s journalism program leverage its New York City location?', 'Our New York location provides unparalleled access to media organizations, from legacy outlets like The New York Times to digital startups. Students regularly interact with working journalists, often learning from Pulitzer Prize winners who serve as adjunct faculty. The city itself is also a rich source of stories across every beat imaginable.', 1),
(UUID(), @columbia_interview1_id, 'What technological skills do students develop in the program?', 'We integrate digital journalism throughout our curriculum. Students learn data journalism, visualization techniques, audio and video production, and social media strategy. Our newly renovated media lab provides cutting-edge equipment for multimedia storytelling.', 2),
(UUID(), @columbia_interview1_id, 'How does Columbia prepare students for the changing media landscape?', 'We balance foundational journalistic principles with innovation. Students study business models, audience engagement, and emerging platforms while mastering core reporting and writing skills. Our faculty includes pioneers in digital journalism who are shaping the field''s future.', 3),
(UUID(), @columbia_interview1_id, 'What internship opportunities are available to journalism students?', 'Our students secure internships at top media organizations nationally and globally. The career services office maintains relationships with hundreds of outlets, and our alumni network—one of journalism''s most influential—actively recruits Columbia students. Many internships lead directly to job offers.', 4),

-- Columbia - Daniel Kim interview questions
(UUID(), @columbia_interview2_id, 'How would you describe the student community at Columbia?', 'Columbia''s student community is incredibly diverse and intellectually engaged. You''ll find students from every state and over 100 countries, bringing different perspectives to campus discussions. Despite being in a busy city, there''s a strong campus community centered around residence halls, student organizations, and traditions like the Core Curriculum.', 1),
(UUID(), @columbia_interview2_id, 'What is it like balancing academics with city life?', 'It''s both challenging and rewarding. Columbia''s academics are rigorous, but the city offers incredible opportunities for internships, cultural experiences, and entertainment. Most students develop time management skills quickly! The campus itself provides a peaceful oasis within the city when you need to focus.', 2),
(UUID(), @columbia_interview2_id, 'What resources does Columbia provide to help students navigate NYC?', 'Columbia offers comprehensive resources including discounted MetroCards, a shuttle service to various parts of the city, guides to safe and affordable neighborhoods, and programs that help students take advantage of cultural offerings through discounted tickets and organized outings.', 3),
(UUID(), @columbia_interview2_id, 'What are some popular student activities at Columbia?', 'Student clubs are extremely popular, with over 500 organizations ranging from cultural groups to academic teams like debate and Model UN. Athletics are also important, both varsity teams and intramurals. Many students participate in community service through Columbia Community Outreach, and cultural events on campus draw large crowds.', 4),

-- JHU - Dr. Lisa Patel interview questions
(UUID(), @jhu_interview1_id, 'What makes Johns Hopkins stand out in medical research?', 'Hopkins has a legacy of transformative medical discoveries dating back to our founding. Our research is distinguished by close integration between the medical school, hospital, and research institutes. This allows for a seamless transition from laboratory findings to clinical applications. We also benefit from substantial research funding—we''ve led NIH funding for decades.', 1),
(UUID(), @jhu_interview1_id, 'How are students involved in research?', 'Student involvement in research is integral to our educational model. Medical students can dedicate a full year to research through our Scholarly Concentration program. Graduate students join established labs but are encouraged to develop independent projects. Even undergraduates have meaningful research opportunities through programs like the Provost''s Undergraduate Research Award.', 2),
(UUID(), @jhu_interview1_id, 'What are some of the current research priorities at Hopkins?', 'We''re currently focusing on precision medicine, neuroscience, cancer immunotherapy, and infectious disease. Our COVID-19 research has been particularly impactful. We''re also expanding work on health disparities and community-based participatory research to address equity issues in healthcare.', 3),
(UUID(), @jhu_interview1_id, 'How does Hopkins support the commercialization of research?', 'We''ve strengthened our technology transfer infrastructure significantly. FastForward, our innovation hub, provides mentoring, funding, and physical space for startups based on Hopkins research. We also partner with venture capitalists and industry through various mechanisms to bring discoveries to market.', 4),

-- JHU - Thomas Greene interview questions
(UUID(), @jhu_interview2_id, 'How does Johns Hopkins approach public health education?', 'Our approach is distinctly multidisciplinary. While students specialize in areas like epidemiology or health policy, all receive training across the core public health disciplines. We emphasize both quantitative skills and social determinants of health. What truly distinguishes us is our global perspective—our faculty and students work in over 130 countries.', 1),
(UUID(), @jhu_interview2_id, 'What fieldwork opportunities are available to public health students?', 'Fieldwork is central to our educational philosophy. Master''s students complete a practicum with organizations ranging from local health departments to WHO or UNICEF. Doctoral students often conduct field research in Baltimore or international settings. We maintain partnerships with health agencies worldwide to facilitate these experiences.', 2),
(UUID(), @jhu_interview2_id, 'How does the Bloomberg School engage with the Baltimore community?', 'Baltimore serves as both classroom and partner. Through our SOURCE center, students and faculty collaborate with community organizations on health initiatives. Our Urban Health Institute addresses local health disparities through research, education, and service programs. These local engagements inform our global work and vice versa.', 3),
(UUID(), @jhu_interview2_id, 'What career paths do public health graduates typically pursue?', 'Our graduates enter diverse careers including government agencies like CDC and NIH, international organizations, NGOs, healthcare systems, pharmaceutical companies, and consulting firms. An increasing number launch social enterprises. Our career services team works individually with students to align opportunities with their specific interests.', 4),

-- Cornell - Emma Thompson interview questions
(UUID(), @cornell_interview1_id, 'What hands-on learning opportunities are available in Cornell''s agriculture program?', 'Cornell''s agriculture program offers extensive hands-on experiences. Students manage plots at our research farms, conduct experiments in our greenhouses, and operate state-of-the-art equipment. Our Dilmun Hill Student Farm is entirely student-run, providing experience in sustainable farming practices from planting to marketing.', 1),
(UUID(), @cornell_interview1_id, 'How does Cornell incorporate new agricultural technologies into the curriculum?', 'We''re at the forefront of agricultural technology integration. Students work with precision agriculture tools, including drones for crop monitoring, automated irrigation systems, and data analytics for farm management. Our Digital Agriculture program allows students to develop and test new technological applications for farming.', 2),
(UUID(), @cornell_interview1_id, 'What research opportunities are available to agriculture students?', 'Research opportunities are abundant. Many students join faculty research through work-study or summer programs. The Cornell Undergraduate Research Board provides funding for independent projects. I personally conducted research on drought-resistant crop varieties, which evolved into my graduate studies.', 3),
(UUID(), @cornell_interview1_id, 'How does Cornell address sustainability in agricultural education?', 'Sustainability is integrated across our curriculum. We study both ecological and economic sustainability, recognizing that farms must be profitable to survive. Our courses cover organic farming, agroecology, renewable energy on farms, and climate-smart agriculture. The student-led Sustainable Agriculture Club also organizes workshops and field trips.', 4),

-- Cornell - Robert Sanchez interview questions
(UUID(), @cornell_interview2_id, 'What makes Cornell''s Hotel Administration program unique?', 'Cornell''s Hotel School pioneered hospitality education and maintains a distinctive approach. We combine rigorous business education with specialized hospitality knowledge and hands-on experience. Our students operate a full-service hotel on campus, the Statler Hotel, gaining practical experience across departments while completing their studies.', 1),
(UUID(), @cornell_interview2_id, 'How does the program connect students with industry?', 'Industry connection is our strength. We host the largest hospitality career fair in the world, with over 100 companies recruiting on campus. Our faculty includes industry executives teaching specialized courses. Students participate in industry conferences, and our extensive alumni network—over 15,000 graduates—actively mentors and recruits students.', 2),
(UUID(), @cornell_interview2_id, 'What international experiences are available to Hotel School students?', 'Global perspective is essential in hospitality. Students can study at our campuses in Hong Kong and Singapore or participate in exchange programs with top hospitality schools worldwide. Our required courses incorporate international case studies, and many students complete internships abroad at leading global hotel chains.', 3),
(UUID(), @cornell_interview2_id, 'How has the program evolved to address changes in the hospitality industry?', 'We continuously adapt to industry trends. Recent curriculum additions include courses on alternative accommodations addressing the sharing economy, data analytics for hospitality, sustainable tourism development, and experience design. We''ve also expanded beyond traditional hotels to include restaurants, events, senior living, and other hospitality sectors.', 4),

-- Additional interview questions for other schools
-- Stanford - Dr. Alan Turing interview questions
(UUID(), @stanford_interview1_id, 'What distinguishes Stanford''s computer science program?', 'Stanford''s CS program combines theoretical depth with practical application in a uniquely entrepreneurial environment. Our proximity to Silicon Valley creates a dynamic ecosystem where research quickly translates to impact. We emphasize both foundational principles and emerging technologies, with particularly strong programs in AI, human-computer interaction, and systems.', 1),
(UUID(), @stanford_interview1_id, 'How are undergraduate students involved in AI research?', 'Undergraduates play substantive roles in our AI labs. Through programs like CURIS (Computer Science Undergraduate Research Internship), students work on cutting-edge projects alongside graduate students and faculty. Many undergraduate theses have led to published papers at top conferences like NeurIPS and ICML.', 2),
(UUID(), @stanford_interview1_id, 'What ethical considerations are integrated into Stanford''s CS curriculum?', 'Ethics is now woven throughout our curriculum rather than isolated in a single course. Our "CS+Ethics" initiative ensures students consider the societal implications of technology they develop. We also offer specialized courses on privacy, fairness in machine learning, and responsible innovation taught by both CS faculty and philosophers.', 3);

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
(UUID(), 'Water Leak in Library', 'Water leaking from ceiling on the 3rd floor near the reference section. Several books have been damaged.', @upenn_id, '2025-03-15', 3, 'Main Library, 3rd Floor', 'https://example.com/media/leak1.jpg', 'John Smith', 'pending', '2025-03-15 14:30:00'),
(UUID(), 'Broken Window in Dorm', 'Window shattered in Room 302, possibly due to strong winds. Glass shards on the floor pose a safety risk.', @harvard_id, '2025-03-10', 2, 'Dormitory A, Room 302', 'https://example.com/media/window1.jpg', 'Maria Garcia', 'pending', '2025-03-10 09:15:00'),
(UUID(), 'Power Outage in Science Building', 'Complete power failure in the Science Building. All experiments and equipment affected.', @columbia_id, '2025-03-18', 4, 'Science Building', 'https://example.com/media/power1.jpg', 'Robert Johnson', 'pending', '2025-03-18 16:45:00'),
(UUID(), 'Graffiti on Admin Building', 'Offensive graffiti on the north wall of the Administration Building.', @jhu_id, '2025-03-12', 2, 'Administration Building, North Wall', 'https://example.com/media/graffiti1.jpg', 'Jennifer Lee', 'pending', '2025-03-12 08:30:00'),
(UUID(), 'Chemical Spill in Lab', 'Small acid spill in Chemistry Lab 4. Area has been evacuated but requires professional cleanup.', @cornell_id, '2025-03-20', 3, 'Chemistry Building, Lab 4', 'https://example.com/media/spill1.jpg', 'David Wilson', 'pending', '2025-03-20 11:20:00'),

(UUID(), 'HVAC Failure in Computer Lab', 'The air conditioning system has failed in the main computer lab. Temperature exceeds 85°F, endangering equipment.', @upenn_id, '2025-02-25', 3, 'Computer Science Building, Lab 101', 'https://example.com/media/hvac1.jpg', 'Sarah Thompson', 'verified', '2025-02-25 13:40:00'),
(UUID(), 'Elevator Malfunction', 'Main elevator in the Business School building stuck between floors with no occupants inside.', @jhu_id, '2025-02-18', 3, 'Business School, Main Elevator', 'https://example.com/media/elevator1.jpg', 'Michael Brown', 'verified', '2025-02-18 15:10:00'),
(UUID(), 'Flooding in Basement', 'Severe flooding in the basement of the Engineering building after heavy rain. Water level approximately 4 inches.', @cornell_id, '2025-03-05', 4, 'Engineering Building, Basement', 'https://example.com/media/flood1.jpg', 'Emily Davis', 'verified', '2025-03-05 18:20:00'),
(UUID(), 'Suspicious Person Reported', 'Unidentified individual attempting to access secure areas in the Medical Sciences building.', @columbia_id, '2025-03-08', 5, 'Medical Sciences Building, East Wing', 'https://example.com/media/security1.jpg', 'James Wilson', 'verified', '2025-03-08 22:30:00'),
(UUID(), 'Fire Alarm Malfunction', 'Fire alarm system in Liberal Arts building continuously triggering false alarms.', @harvard_id, '2025-02-27', 3, 'Liberal Arts Building', 'https://example.com/media/alarm1.jpg', 'Sophia Martinez', 'verified', '2025-02-27 10:50:00'),

(UUID(), 'Network Outage in Dorms', 'Complete internet service disruption in all dormitories. Affecting approximately 500 students.', @upenn_id, '2025-01-20', 4, 'All Dormitories', 'https://example.com/media/network1.jpg', 'William Taylor', 'resolved', '2025-01-20 19:15:00'),
(UUID(), 'Broken AC in Lecture Hall', 'Air conditioning unit broken in main lecture hall causing excessive heat during classes.', @harvard_id, '2025-01-15', 2, 'Main Lecture Hall, Building C', 'https://example.com/media/ac1.jpg', 'Olivia Johnson', 'resolved', '2025-01-15 14:00:00'),
(UUID(), 'Gas Smell in Cafeteria', 'Strong smell of gas reported in the main cafeteria kitchen area. Kitchen staff evacuated.', @jhu_id, '2025-02-05', 5, 'Main Cafeteria, Kitchen Area', 'https://example.com/media/gas1.jpg', 'Daniel Brown', 'resolved', '2025-02-05 08:45:00'),
(UUID(), 'Roof Leak in Auditorium', 'Water leaking through roof during rainstorm, damaging seating and flooring in main auditorium.', @columbia_id, '2025-01-28', 3, 'Main Auditorium', 'https://example.com/media/roof1.jpg', 'Emma Wilson', 'resolved', '2025-01-28 16:30:00'),
(UUID(), 'Fallen Tree on Pathway', 'Large oak tree fell across main campus pathway following overnight storm. Blocking access to Science Building.', @cornell_id, '2025-02-10', 3, 'Main Campus Pathway, East Side', 'https://example.com/media/tree1.jpg', 'Noah Garcia', 'resolved', '2025-02-10 07:20:00'),

-- Older incidents from previous months (resolved)
(UUID(), 'Student Protest Disruption', 'Large student protest blocking access to Administration Building.', @jhu_id, '2024-11-12', 3, 'Administration Building, Main Entrance', 'https://example.com/media/protest1.jpg', 'Isabella Thomas', 'resolved', '2024-11-12 13:00:00'),
(UUID(), 'Lab Equipment Theft', 'Several microscopes and laptops reported missing from Biology Lab 3.', @columbia_id, '2024-10-05', 4, 'Biology Building, Lab 3', 'https://example.com/media/theft1.jpg', 'Ethan Anderson', 'resolved', '2024-10-05 09:10:00'),
(UUID(), 'Sewage Backup in Dorm', 'Sewage system backed up in Dormitory B basement, affecting laundry facilities.', @harvard_id, '2024-12-08', 4, 'Dormitory B, Basement', 'https://example.com/media/sewage1.jpg', 'Mia Johnson', 'resolved', '2024-12-08 20:40:00'),
(UUID(), 'Classroom Projector Failure', 'Main projector in Lecture Hall 101 failed during important presentation.', @upenn_id, '2024-10-22', 1, 'Lecture Hall 101, Building A', 'https://example.com/media/projector1.jpg', 'Liam Davis', 'resolved', '2024-10-22 15:30:00'),
(UUID(), 'Ice on Walkways', 'Dangerous ice accumulation on main campus walkways causing multiple slip incidents.', @cornell_id, '2024-12-15', 3, 'Main Campus Walkways', 'https://example.com/media/ice1.jpg', 'Ava Robinson', 'resolved', '2024-12-15 07:50:00'),

(UUID(), 'Mold in Student Housing', 'Black mold found in multiple rooms of Student Housing Building C.', @harvard_id, '2025-03-01', 4, 'Student Housing Building C, Rooms 201-205', 'https://example.com/media/mold1.jpg', 'Lucas Martin', 'verified', '2025-03-01 11:10:00'),
(UUID(), 'Burst Pipe in Faculty Building', 'Water pipe burst on second floor of Faculty Building, causing water damage to multiple offices.', @upenn_id, '2025-02-15', 3, 'Faculty Building, Second Floor', 'https://example.com/media/pipe1.jpg', 'Chloe Wilson', 'verified', '2025-02-15 14:25:00'),
(UUID(), 'Fire in Chemistry Lab', 'Small fire occurred during experiment in Chemistry Lab 2. Extinguished with fire extinguisher but smoke damage present.', @cornell_id, '2025-03-16', 5, 'Chemistry Building, Lab 2', 'https://example.com/media/fire1.jpg', 'Alexander Lee', 'pending', '2025-03-16 15:35:00'),
(UUID(), 'Accessibility Ramp Damage', 'Main accessibility ramp to Library damaged and unusable.', @upenn_id, '2025-02-24', 3, 'Library, Main Entrance', 'https://example.com/media/ramp1.jpg', 'Grace Thompson', 'resolved', '2025-02-24 09:40:00'),
(UUID(), 'Parking Structure Gate Malfunction', 'Main gate to Faculty Parking Structure stuck in closed position. No access for vehicles.', @jhu_id, '2025-03-09', 2, 'Faculty Parking Structure, Main Entrance', 'https://example.com/media/gate1.jpg', 'Benjamin Rodriguez', 'verified', '2025-03-09 08:15:00');

SET @water_leak_id = (SELECT id FROM incidents WHERE title = 'Water Leak in Library');
SET @broken_window_id = (SELECT id FROM incidents WHERE title = 'Broken Window in Dorm');
SET @power_outage_id = (SELECT id FROM incidents WHERE title = 'Power Outage in Science Building');
SET @chemical_spill_id = (SELECT id FROM incidents WHERE title = 'Chemical Spill in Lab');
SET @network_outage_id = (SELECT id FROM incidents WHERE title = 'Network Outage in Dorms');
SET @suspicious_person_id = (SELECT id FROM incidents WHERE title = 'Suspicious Person Reported');
SET @fire_in_chem_lab_id = (SELECT id FROM incidents WHERE title = 'Fire in Chemistry Lab');


-- Now let's insert sample evidence for some of the incidents
INSERT INTO incident_evidences (id, incident_id, evidence_url, description, uploaded_at) VALUES
-- Evidence for water leak
('e1e1e1e1-1111-1111-1111-e1e1e1e1e1e1', @water_leak_id, 'https://example.com/evidence/leak_ceiling.jpg', 'Photo of water coming through ceiling', '2025-03-15 14:40:00'),
('e2e2e2e2-2222-2222-2222-e2e2e2e2e2e2', @water_leak_id, 'https://example.com/evidence/leak_damage.jpg', 'Photo of damaged books', '2025-03-15 14:45:00'),
('e3e3e3e3-3333-3333-3333-e3e3e3e3e3e3', @water_leak_id, 'https://example.com/evidence/leak_report.pdf', 'Initial assessment report from maintenance', '2025-03-16 09:30:00'),

-- Evidence for broken window
('e4e4e4e4-4444-4444-4444-e4e4e4e4e4e4', @broken_window_id, 'https://example.com/evidence/window_broken.jpg', 'Photo of shattered window', '2025-03-10 09:20:00'),
('e5e5e5e5-5555-5555-5555-e5e5e5e5e5e5', @broken_window_id, 'https://example.com/evidence/window_glass.jpg', 'Photo of glass on floor', '2025-03-10 09:25:00'),

-- Evidence for power outage
('e6e6e6e6-6666-6666-6666-e6e6e6e6e6e6', @power_outage_id, 'https://example.com/evidence/power_panel.jpg', 'Photo of electrical panel', '2025-03-18 16:50:00'),
('e7e7e7e7-7777-7777-7777-e7e7e7e7e7e7', @power_outage_id, 'https://example.com/evidence/power_affected_lab.jpg', 'Photo of affected laboratory equipment', '2025-03-18 16:55:00'),
('e8e8e8e8-8888-8888-8888-e8e8e8e8e8e8', @power_outage_id, 'https://example.com/evidence/power_electrician.pdf', 'Initial assessment from electrician', '2025-03-19 10:15:00'),

-- Evidence for chemical spill
('e9e9e9e9-9999-9999-9999-e9e9e9e9e9e9', @chemical_spill_id, 'https://example.com/evidence/chemical_spill.jpg', 'Photo of spill area (taken from safe distance)', '2025-03-20 11:25:00'),
('e0e0e0e0-0000-0000-0000-e0e0e0e0e0e0', @chemical_spill_id, 'https://example.com/evidence/chemical_report.pdf', 'Chemical safety incident report', '2025-03-20 13:40:00'),

-- Evidence for network outage
('a1a1a1a1-aaaa-aaaa-aaaa-a1a1a1a1a1a1', @network_outage_id, 'https://example.com/evidence/network_status.png', 'Screenshot of network monitoring system', '2025-01-20 19:30:00'),
('b1b1b1b1-bbbb-bbbb-bbbb-b1b1b1b1b1b1', @network_outage_id, 'https://example.com/evidence/network_equipment.jpg', 'Photo of damaged network equipment', '2025-01-20 20:15:00'),
('c1c1c1c1-cccc-cccc-cccc-c1c1c1c1c1c1', @network_outage_id, 'https://example.com/evidence/network_resolution.pdf', 'Report on resolution of the issue', '2025-01-21 14:30:00'),

-- Evidence for suspicious person
('d1d1d1d1-dddd-dddd-dddd-d1d1d1d1d1d1', @suspicious_person_id, 'https://example.com/evidence/security_footage.mp4', 'Security camera footage (timestamp 22:15-22:35)', '2025-03-08 23:00:00'),
('f1f1f1f1-ffff-ffff-ffff-f1f1f1f1f1f1', @suspicious_person_id, 'https://example.com/evidence/security_door.jpg', 'Photo of tampered door lock', '2025-03-08 23:10:00'),
('a2a2a2a2-aaaa-aaaa-aaaa-a2a2a2a2a2a2', @suspicious_person_id, 'https://example.com/evidence/security_report.pdf', 'Campus security incident report', '2025-03-09 08:45:00'),

-- Evidence for fire in chemistry lab
('b2b2b2b2-bbbb-bbbb-bbbb-b2b2b2b2b2b2', @fire_in_chem_lab_id, 'https://example.com/evidence/fire_damage.jpg', 'Photo of burn marks on lab bench', '2025-03-16 15:45:00'),
('c2c2c2c2-cccc-cccc-cccc-c2c2c2c2c2c2', @fire_in_chem_lab_id, 'https://example.com/evidence/fire_extinguisher.jpg', 'Photo of used fire extinguisher', '2025-03-16 15:50:00'),
('d2d2d2d2-dddd-dddd-dddd-d2d2d2d2d2d2', @fire_in_chem_lab_id, 'https://example.com/evidence/fire_report.pdf', 'Lab safety incident report', '2025-03-16 18:20:00'),
('f2f2f2f2-ffff-ffff-ffff-f2f2f2f2f2f2', @fire_in_chem_lab_id, 'https://example.com/evidence/fire_procedure.pdf', 'Documentation of emergency procedures followed', '2025-03-17 09:15:00');