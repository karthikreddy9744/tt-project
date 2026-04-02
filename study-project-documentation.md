Minor Project Proposal

**Study Group & Peer Learning Platform**

*Empowering Students Through Collaborative Learning*

Submitted in Partial Fulfillment of the Requirements for the

**Bachelor of Technology (B.Tech) -- 4th Year Minor Project**

Project Version: 1.0

February 2026

**1. Abstract**

The Study Group & Peer Learning Platform is a minimal web-based application that enables students to collaborate academically through shared study groups, file repositories, and peer-driven doubt resolution. The platform targets a common gap in student workflows: the absence of a single, purpose-built space where peers can organize themselves by subject, share study materials, and resolve academic doubts collectively.

The system is built using a clean, modern technology stack comprising Vite + React on the frontend, Spring Boot on the backend, and PostgreSQL as the sole database. All third-party services integrated into the project are genuinely free with no credit card requirement: Supabase provides managed PostgreSQL hosting, Vercel hosts the frontend, Render hosts the backend API, and Jitsi Meet provides open-source video conferencing for study sessions. No paid or freemium services are used at any layer.

The platform focuses on three essential features: study group management, file and note sharing with peer review, and a discussion and doubt resolution forum. This minimal scope ensures the project is achievable within a standard academic semester, maintainable by a small team, and straightforward to evaluate. The implementation roadmap spans sixteen weeks across four phases, concluding with a deployed, production-ready application.

**2. Problem Statement**

Students engaged in peer learning rely on a fragmented set of general-purpose tools: messaging applications for communication, cloud drives for file sharing, and email for coordination. None of these tools are designed for academic collaboration, which leads to several recurring problems:

- Study materials shared in chat applications get buried over time and are difficult to retrieve when needed.

- Students independently create notes, summaries, and practice questions that their peers have already produced, wasting time and effort.

- There is no structured space to post academic doubts, receive peer answers, and build a subject-specific knowledge base.

- Forming and coordinating study groups is informal and inefficient, with no central place to manage membership, roles, or shared resources.

These problems are especially pronounced for students in large courses, distance learners, and first-year students who have not yet formed peer networks. A lightweight, dedicated platform with subject-organized groups, centralized resource sharing, and a peer Q&A forum directly addresses these gaps without the overhead of a full-scale learning management system.

**3. Objectives**

- Develop a web-based platform that allows students to create and join subject-specific study groups with role-based access control.

- Implement a centralized file and note-sharing module within each study group, with peer voting for quality assessment.

- Build a discussion forum where students post academic doubts, receive peer answers, and mark questions as resolved.

- Integrate study session scheduling with an embedded Jitsi Meet video link.

- Use exclusively free and open-source technologies and services throughout the entire project, with no paid or credit-card-required dependencies.

- Deploy the application using free hosting services and achieve a stable, accessible production build by the end of the project timeline.

**4. Proposed System**

The proposed system is a focused web application organized around study groups. A student registers with an email address, creates a profile with their institution and enrolled courses, and either creates or joins study groups. Each study group is a private, organized workspace with its own file repository, discussion board, and session scheduler.

Three user roles exist within each group: administrator, moderator, and member. Administrators manage group settings and membership; moderators can remove posts and manage content; members upload files, post questions, and participate in sessions. All authentication is handled via JWT tokens managed by Spring Security.

File uploads are stored directly on the server's filesystem using Spring Boot's MultipartFile API, with file type validation and a 20 MB size limit per file. No third-party file storage service is required. The discussion module accepts text and image-based questions, supports threaded replies with upvoting, and allows authors to mark a reply as Solved. Study sessions are created with a date, time, topic, and auto-generated Jitsi Meet link.

**5. Key Features**

**5.1 Study Group Management**

Students create or join study groups organized by subject or course, with public or invite-only access modes. Each group has a dashboard showing recent files, open discussions, and upcoming sessions. Group administrators manage membership and assign roles.

**5.2 File & Note Sharing with Peer Review**

Each study group maintains a shared file repository supporting PDF, DOCX, PPTX, and image uploads. Files are tagged by topic and date. Members upvote or downvote uploaded files, providing a lightweight quality signal. Files are stored on the application server---no third-party storage service is required.

**5.3 Discussion & Doubt Resolution**

A subject-specific Q&A forum allows students to post academic questions with text or images. Peers provide answers in threaded replies, which are ranked by community upvotes. The question author can mark a reply as Solved, creating a curated, searchable archive of resolved doubts for each study group.

**6. Technology Stack**

All technologies and services used in this project are free and open-source. No paid tier, freemium service, or credit-card-required dependency is included at any layer.

|                 |                                 |                                                                  |
|-----------------|---------------------------------|------------------------------------------------------------------|
| **Layer**       | **Technology / Service**        | **Role & Cost Status**                                           |
| Frontend        | Vite + React.js                 | Build tool and UI framework --- free, open-source                |
| Frontend        | Tailwind CSS                    | Utility-first styling --- free, open-source                      |
| Frontend        | Axios                           | HTTP client for REST API calls --- free, open-source             |
| Frontend        | React Router v6                 | Client-side navigation --- free, open-source                     |
| Backend         | Java 25 + Spring Boot 3.x       | Application framework --- free, open-source                      |
| Backend         | Spring Security + JWT           | Authentication and authorization --- free, open-source           |
| Backend         | Spring Data JPA + Hibernate     | ORM and database access layer --- free, open-source              |
| Database        | PostgreSQL 16                   | Primary relational database --- free, open-source                |
| DB Hosting      | Supabase (free tier)            | Managed PostgreSQL --- 500 MB free, no credit card required      |
| File Storage    | Server filesystem (Spring Boot) | Local file storage via MultipartFile --- completely free         |
| Video           | Jitsi Meet                      | Open-source video conferencing --- fully free, no account needed |
| Frontend Host   | Vercel (free tier)              | Static site hosting --- free, no credit card required            |
| Backend Host    | Render (free tier)              | Web service hosting --- 750 hrs/month free                       |
| Version Control | GitHub                          | Source code repository --- free unlimited public/private repos   |

**7. System Architecture**

The platform follows a standard three-tier architecture. The Presentation Layer is a Vite-bundled React SPA that runs in the browser, communicating with the backend via Axios HTTP calls. React Router manages client-side navigation without full-page reloads.

The Application Layer is a Spring Boot REST API. Spring Security enforces JWT-based stateless authentication on all protected endpoints. File uploads are handled via the MultipartFile API and saved to a designated directory on the server. All business logic is encapsulated in a service layer that delegates data operations to JPA repositories.

The Data Layer is a single PostgreSQL database hosted on Supabase. JPA entities map directly to relational tables, and HikariCP manages the connection pool. No in-memory database (H2) is used at any stage---the same PostgreSQL instance is used for both development and production, eliminating environment inconsistencies.

**8. Database Overview**

The PostgreSQL schema is kept minimal, with seven tables aligned directly to the three core features of the platform.

|                |                                                                                                        |                                                  |
|----------------|--------------------------------------------------------------------------------------------------------|--------------------------------------------------|
| **Table**      | **Key Fields**                                                                                         | **Purpose**                                      |
| users          | id, email, password_hash, name, institution, role, created_at                                          | Stores registered user accounts and profiles     |
| study_groups   | id, name, subject, description, privacy, created_by, created_at                                        | Defines each study group and its access mode     |
| group_members  | id, group_id, user_id, role, joined_at                                                                 | Many-to-many: user--group membership with roles  |
| files          | id, file_name, file_path, file_type, file_size, uploaded_by, group_id, upvotes, downvotes, uploaded_at | Tracks uploaded files and their peer vote counts |
| discussions    | id, title, content, author_id, group_id, is_anonymous, is_solved, upvotes, created_at                  | Stores doubt/question posts within groups        |
| replies        | id, discussion_id, author_id, content, upvotes, is_accepted, created_at                                | Threaded answers to discussion posts             |
| study_sessions | id, title, group_id, organizer_id, start_time, end_time, jitsi_link, created_at                        | Scheduled group study sessions with video links  |

All foreign key relationships are enforced at the database level. Indexes are defined on frequently queried fields: email (users), group_id and uploaded_by (files), group_id and author_id (discussions).

**9. Implementation Plan**

The project is organized into four phases over sixteen weeks.

|                      |              |                                                                                                                                                                                                                  |
|----------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Phase**            | **Duration** | **Deliverables**                                                                                                                                                                                                 |
| Phase 1              
 Foundation            | Weeks 1--4   | Project setup (Vite + React, Spring Boot, PostgreSQL on Supabase); database schema and JPA entities; user registration and JWT authentication; basic React UI components and routing                             |
| Phase 2              
 Core Features         | Weeks 5--10  | Study group CRUD with role management; file upload, listing, download, and peer voting; discussion post and reply system with upvoting and solved-status; study session creation with Jitsi Meet link generation |
| Phase 3              
 Foundation & Polish   | Weeks 11--13 | Input validation and error handling; responsive UI refinement; search and filter for files and discussions                                  |
| Phase 4              
 Testing & Deployment  | Weeks 14--16 | JUnit and Mockito unit tests for service layer; Spring Boot integration tests with PostgreSQL test schema; frontend deployed to Vercel; backend deployed to Render; end-to-end user acceptance testing           |

**10. Expected Outcomes**

- A deployed, fully functional web application accessible from any modern browser, hosted at zero cost on Vercel and Render.

- Subject-specific study groups where students can manage membership, share files, resolve academic doubts, and schedule sessions.

- A PostgreSQL-backed persistent data store on Supabase, consistent across development and production environments.

- A secure authentication system with JWT-based session management and role-based access control.

- A codebase with adequate test coverage on critical service-layer logic, supported by documented API endpoints.

- A minimal, maintainable project that a team of three to four students can build, understand, and present confidently in a viva examination.

**11. Conclusion**

The Study Group & Peer Learning Platform is a deliberately minimal, academically focused web application built to address the fragmented collaboration tools that students currently rely on. By restricting scope to three essential features---study group management, file sharing with peer review, and doubt resolution---the project remains achievable within a standard academic semester while delivering genuine practical value.

The technology stack has been carefully selected to ensure that every component, from the database to the hosting infrastructure, is completely free with no paid tiers or credit card requirements. PostgreSQL on Supabase replaces any in-memory or paid database solution; server-side file storage eliminates reliance on third-party storage services; Jitsi Meet provides video functionality at zero cost. Vite replaces the heavier Create React App toolchain, resulting in faster development builds.

The result is a clean, well-scoped minor project that demonstrates full-stack development competence using industry-standard technologies, is straightforward to deploy and maintain, and serves a real student need without unnecessary complexity.
