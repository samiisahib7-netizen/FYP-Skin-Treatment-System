FINAL YEAR PROJECT
Skin Treatment Appointment System











GOVT. GRADUATE COLLEGE, CIVIL LINES,
SHEIKHUPURA

Supervisor: Muhammad Saleem

Submitted By:
Muhammad Salman
Mahrukh	2022-KS-166 | 2022-089337
2021-KS-670 | 2022-089273

Session: 2022-2026

Project ID: 22-KS-BSIT-36
Bachelor of Science in Information Technology



FINAL YEAR PROJECT REPORT
Skin Treatment




A project Presented to
Faculty of Computing and Information Technology (FCIT)
University of the Punjab
Lahore



In partial fulfillment of the requirement for the degree of
Bachelor of Science in Information Technology
Session (2022-2026)



Submitted By:
Muhammad Salman
Mahrukh                          	2022-KS-166 | 2022-089337
2021-KS-670 | 2022-089273
	
	
DECLARATION
The work reported in this project was carried out by us under the supervision of our project supervisor, Sir Muhammad Kamran at Government Graduate College, Civil Lines, Sheikhupura. 
We affirm that this project, along with its contents, is the result of our independent research efforts. No portion of this work has been directly copied from any previously written or published material, except for referenced sources, standard mathematical or scientific models, equations, formulas, protocols, etc. Furthermore, we confirm that this work has not been presented for the attainment of any other academic degree or diploma. 
The university may take appropriate action if the provided information is found to be inaccurate at any stage.


Student Name	Registration No.	Signature
Muhammad Salman
Mahrukh	2022-KS-166 | 2022-089337
2021-KS-670 | 2022-089273	



 
STATAEMENT OF SUBMISSION
This is to certify that the following students have worked on their final year project, titled Skin Treatment, at Government Graduate College, Civil Lines, Sheikhupura, as part of the partial requirements for the degree of Bachelor of Sciences in Information Technology.

Serial No.	Registration No.	Roll No.	Student Name
1	2022-KS-166	089337	Muhammad Salman
2	2021-KS-670	089273	Mahrukh





Head of Department
Muhammad Ali Waqas
Associate Professor of Computer Science
Govt. Graduate College,
Civil Lines, Sheikhupura	Supervisor 
Muhammad Kamran
Lecturer in Computer Science
Govt. Graduate College,
Civil Lines, Sheikhupura





Project Coordinator
Hasan Raza 
Lecturer in Computer Science
Govt. Graduate College,
Civil Lines, Sheikhupura


PROOFREADING CERTIFICATE
This is to certify that Muhammad Salman (Roll#089337)  and Mahrukh(Roll#089273) have prepared documentation for their final year project (FYP) titled Skin Treatment at the Department of Computer Science, Government Graduate College, Civil Lines, Sheikhupura, in partial fulfillment of the requirements for the degree of Bachelor of Sciences in Information Technology.








Project Supervior
Muhammad Kamran
Lecturer in Computer Science
Govt. Graduate College,
Civil Lines, Sheikhupura








Acknowledgement
We would like to express our sincere thanks to Sir Muhammad Kamran Lecturer at Government Graduate College, Civil Lines, Sheikhupura, for his valuable guidance, encouragement and support during the preparation of our project documentation.
We are also thankful to our friends and families for their quiet support and motivation, which helped us stay focused throughout this phase of our work.

Date: January 27, 2026

 
PROJECT INFORMATION

Project Title	Skin Treatment Appointment System
Objective	To build a Digital Skin Treatment System for Appointments, repots and E-commerce. 
Undertaken by	Muhammad Salman and Mahrukh
Supervised by	Sir Muhammad Kamran
Starting Date	06/10/25
Completion Date 	26/07/26 (Expected)
Tools Used	Visual Studio Code
Technologies	React.JS, Node.JS, Express.JS, MongoDB

 
PREFACE
This is a final year project (FYP) report written by students of Bachelor of Science in Information Technology at the University of the Punjab. We are Muhammad Salman and Mahrukh studying in BSIT (Hons) at Government Graduate College, Civil Lines, Sheikhupura.
To enable you to understand the idea of our project and the implementation process in detail and systematically, this report is divided into topics; each topic with a specific focus. We hope this approach allows you to read and understand our project report easily. Lastly, if you have any comments, you are welcome to contact us at:

Member:
Member:	Muhammad Salman
Mahrukh	salmansahib750@gmail.com
mahrukhjutt884@gmail.com


























Abstract

The Skin Treatment Appointment Website is a digital healthcare platform designed to help patients and dermatologists manage skin care services online. The main purpose of this system is to replace the traditional manual appointment and record management process with an efficient digital solution. The website allows patients to register, manage profiles, book appointments, make online payments, receive prescriptions, and access medical reports. Doctors can manage appointments, generate prescriptions, and upload reports through a separate doctor panel. The system also includes an admin panel for managing users, doctors, appointments, products, and analytics. An integrated e-commerce module allows users to purchase skin care medicines and products online. The system also provides email notifications, report management, and rating and review features to improve user experience and communication.































Skin Treatment
Executive Summary
The Skin Treatment Appointment Website is a digital healthcare platform designed to simplify skin care services through an online system. The website allows patients to register, manage profiles, book appointments, receive prescriptions, access reports, and purchase skin care products online. Doctors can manage appointments and patient records through a separate doctor panel, while the admin manages users, products, appointments, and analytics. The system also includes features such as email notifications, payment integration, report management, and rating and review functionality. The project aims to reduce paperwork, save time, and provide a secure and user-friendly healthcare solution.











FYDP Overview
FYDP Title: Skin Treatment
Sr. No 	Roll No 	Name 	Signature 
1 	089337	Muhammad Salman 	 
2	089273	Mahrukh	
Table 1 Project Proposal Summary
FYDP Goals
Online Appointment and Prescription Management.
Secure Patient Record.
E-Commerce System. 
Email Notification and Analytics Dashboard.
FYDP Objectives
To digitalize Appointment Booking and Prescription Management.
To provide secure patient record.
To reduce manual paperwork and improve healthcare efficiency.
To provide Online payment and skin care product purchasing facilities.
To improve communication through mail notification and system alerts.
FYDP Success Criteria
Accurate Appointment Booking and Prescription Management are achieved.
Email Notification and Payment System work properly.
E-commerce System for skin care products functions efficiently.
Analytics Dashboard and Admin Management improve system performance and monitoring.
Assumptions
Users have internet access and a device to use the website.
Users know basic website and online payment usage.
Doctor and Patient will enter correct information in the system.
The website will be properly configured and accessible before use.
Users will have valid email accounts for notification and authentication.
Risks & Obstacles
Data may be lost due to Server or Database failure.
Incorrect data enter by users may affect Appointments and Analytics. 
User Resistance to Change.
Network issues may delay Booking, Payments, and System Updates.
Limited Storage Capacity.
Organization Address: FCIT, University of the Punjab, Lahore, Pakistan
Target End Users:  Admin, Doctors, Patients.
Suggested Project Supervisor: Muhammad Saleem
Approved by: 
Date:  October 21, 2025






 
Table of Contents
Abstract	8
Skin Treatment	10
Executive Summary	10
Chapter No 1	20
Project Proposal	20
1.1.	Introduction	21
1.2.	Background	21
1.3.	Problem Statement	21
1.4.	Stakeholders & Interests	21
1.5.	Objectives	22
1.6.	Scope	22
1.7.	Assumptions	23
1.8.	Risks	23
1.9.	Success Criteria	23
1.10.	Tools, Libraries & Technologies	24
1.11.	Work Division	24
1.12.	Conclusion	25
Chapter No 2	25
Literature Review	25
2.1	Literature Survey	26
2.2	Related Work	26
2.3	Gap Analysis	26
2.4	Summary	27
Chapter No 3	28
Software Requirements Specification	28
3.1	Requirements Analysis	29
3.2	User Classes & Characteristics	29
3.3	Requirements Identifying Techniques	29
3.4	Functional Requirements	30
Functional Requirement 1	30
Functional Requirement 2	30
Functional Requirement 3	31
Functional Requirement 4	31
Functional Requirement 5	32
Functional Requirement 6	32
Functional Requirement 7	32
Functional Requirement 8	33
Functional Requirement 9	33
Functional Requirement 10	34
Functional Requirement 11	34
Functional Requirement 12	34
Functional Requirement 13	35
Functional Requirement 14	35
Functional Requirement 15	35
3.5	Non-Functional Requirements	36
Reliability	36
Usability	36
Performance	36
Security	36
3.6	External Interface Requirements	36
1.	User Interface Requirements	37
2.	Software Interfaces	37
3.	Hardware Interfaces	37
4.	Communication Interfaces	37
3.7	Use Case Analysis	37
Use Case #1 – Login	37
Use Case #2 – Manage Patients	38
Use Case #3 – Manage Appointments	39
Use Case #4 – Mange Products	39
Use Case #5 – Manage Orders	40
Use Case #6 – Upload Reports	40
Use Case #7 – Logout	41
Admin Use Case Diagram	42
Use Case #8 – Login	42
Use Case #9 – Manage Appointments	43
Use Case #10 – Generates Prescription	43
Use Case #10 – View Patient History	44
Use Case #11 – Logout	44
Doctor Use Case Diagram	45
Use Case #12 – Login	46
Use Case #13 – Manage Profile	46
Use Case #14 – Book Appointment	47
Use Case #15 – Make Payments	47
Use Case #16 – View Prescription	48
Use Case #17 – Purchase Products	48
Use Case #18 – Rating and Review	49
Use Case #19 – Logout	50
Use Case #20 – Login	51
Use Case #21 – View Assigned Orders	52
Use Case #22 – Update Delivery Status	52
Use Case #23 – Logout	53
3.8	Storyboard	54
3.9	Summary	55
Chapter No 4	56
Software Design Specification	56
4.1	System Design	57
Product Perspective:	57
Design constraints	57
4.2	Design Considerations	58
Assumptions	58
Dependencies	58
Limitations	58
Risks	58
4.3	Requirements Traceability Matrix	58
4.4	Design Models	60
1.	Design Class Diagram	60
2.	Interaction Diagram (Either sequence or collaboration)	61
	63
	64
2.	State Diagram	65
4.5	Architectural Design	68
1.	UML Component Diagram	68
4.6	Data Design	69
Database Design Overview:	69
1.	Data Dictionary	69
4.7	User Interface Design	71
1.	Screen Images	71
2.	Screen objects and action	74
4.8	Design Decisions	75
4.9	Summary	75
Chapter 5 Implementation	75
4.1	Implementation	76
4.2	Algorithm	76
4.3	External APIs/SDKs	79
4.4	Code Repository	80
4.5	Summary	80
Chapter  6	81
Testing and Evaluation	81
6.1.	Introduction	82
6.2.	Unit Testing (UT)	82
6.3.	Functional Testing (FT)	82
6.4.	Integration Testing (IT)	82
6.5.	Performance Testing (PT)	82
5.1.	Summary	83
Chapter 7	84
System Conversion	84
7.1.	Introduction	85
7.2.	Conversion Method	85
7.3.	Deployment	85
7.4.	Post Deployment Testing	86
7.5.	Challenges	87
7.6.	Summary	87
Chapter 7 Conclusion	88
8.1.	Introduction	89
8.2.	Evaluation	89
8.3.	Traceability Matrix	89
8.4.	Conclusion	90
8.5.	Future Work	91
References	92
References	93
1.	World Wide Web	93


 
List of Tables
Table 1 Project Proposal Summary	10
Table 2 Stakeholders & Interest table	17
Table 3 Success Criteria table	19
Table 4 Tools, Libraries & Technologies table	19
Table 5 Work Division table	20
Table 6 Gap Analysis table	22
Table 7 User Classes & Characteristics table	25
Table 8 Functional Requirement 1	26
Table 9 Functional Requirement 2	26
Table 10 Functional Requirement 3	27
Table 11 Functional Requirement 4	27
Table 12 Functional Requirement 5	27
Table 13 Functional Requirement 6	28
Table 14 Functional Requirement 7	28
Table 16 Use Case 1	31
Table 17 Use Case 2	31
Table 18 Use Case 3	32
Table 19 Use Case 4	32
Table 20 Use Case 5	33
Table 21 Use Case 6	34
Table 22 Use Case 7	34
Table 24 Requirement Traceability Matrix table	41
Table 25 Data Collection table	49

 
Table of Figures
Figure 1 Use Case Diagram of Admin	35
Figure 2 Use Case Diagram of User	36
Figure 3 storyboard picture	37
Figure 4 Design Class Diagram	42
Figure 5 Sequence Diagram # 1	42
Figure 6  Sequence Diagram # 2	43
Figure 7 Sequence Diagram # 3	43
Figure 8 State Diagram # 1	44
Figure 9 State Diagram # 2	45
Figure 11 UML Component Diagram	45
Figure 12 Page # 1	50
Figure 13 Page # 2	50
Figure 14 Page # 3	51
Figure 15 Page # 4	51
 
Chapter No 1
Project Proposal
 
1.1.	Introduction
This chapter provides an overview of the Skin Treatment Appointment System. It explains the background of the project and the issues in traditional manual healthcare systems such as appointment delays, paper-based records, and poor communication between Doctors and Patients. It also highlights the need for a digital Skin Care Management System. The chapter describes the main Objectives, Problem Statement, and Scope of the project. It explains how the system helps Patients, Doctors, and Admins by providing Online Appointments, Prescriptions, Reports, E-Commerce Services, and Notifications. It also identifies the stakeholders involved in the system and their roles in making the platform efficient and user-friendly.
1.2.	Background
In many healthcare systems, Appointment Booking, Patient Records, and Prescription Management are still handled manually, which is time-consuming. With the help of modern web technologies, these processes can be made more efficient, fast, and secure. The Skin Treatment Appointment System provides an easy and digital way for Patients to Book Appointments, Consult Doctors, Access Prescriptions, and Manage Medical Reports. It also includes an E-Commerce System for purchasing Skin Care Products and Medicines. This platform improves communication between Patients, Doctors, and Admin through Notifications and Email Services, making the overall healthcare process more organized and efficient.
1.3.	Problem Statement
In traditional Skin Care and healthcare systems, manual appointment booking, patient record management, and report handling take too much time. There is also a lack of proper communication between Patients, Doctors, and Administrators, which affects the efficiency of the system. Additionally, manual processes may lead to delays in treatment, incorrect data entry, and difficulty in tracking patient history and reports. All these issues can be solved by developing a digital Skin Treatment Appointment System that provides automated Appointment Management, Secure Patient Records, Online Prescriptions, Notifications, and better communication between all Stakeholders.
1.4.	Stakeholders & Interests
Table 2 Stakeholders & Interest table
Stakeholders 	Description 	Interest 
Admin	The admin manages the entire system including Doctors, Patients, Products, Appointments, and overall platform activities. Admin can monitor system Analytics, manage user accounts, and handle email notifications.	Interested in maintaining overall system control, monitoring system performance, managing healthcare operations, and ensuring smooth and efficient platform functionality.
Doctors	Doctors are responsible for handling Patient Appointments, Generating Prescriptions, Reviewing Patient Reports, and providing treatment guidance through the system.	Interested in efficient Appointment Management, easy access to Patient Records, and quick Prescription Generation to improve healthcare delivery.
Patients	Patients can Register Manage Profiles, Book Appointments, and View Prescriptions, Access Medical Reports, and purchase skin care products through the E-Commerce system.	Interested in easy Appointment Booking, Quick Access to medical services, Secure Record Management, and convenient Online Skin Care product purchasing.
Rider	Rider delivered skin care products and medicines to patient and update delivery status in the system.	Interested in efficient order management accurate delivery information and smooth delivery tracking. 

1.5.	Objectives
	To digitalize Appointment Booking in the system.
	To provide secure Patient Record and Report Management in an efficient way.
	To enable Online Prescription Generation for better healthcare support.
	To facilitate communication between Patients, Doctors, and Admin through Email Notifications.
	To prevent data loss by maintaining secure and centralized Database storage.
	To provide timely alerts and Notifications Regarding Appointments, Reports, and System Activities.
1.6.	Scope
In-scope 
	User Registration and secure Login System for Patients, Doctors, and Admin.
	Online Appointment Booking with doctor selection.
	Appointment Management, and handling by Admin and Doctors.
	Medical Report upload, storage, and viewing functionality for Patients and Doctors.
Out-of-scope 
	AI-based skin disease detection or skincare recommendation system.
	Live Video Consultation or Online Chat with Doctors.
	Medical diagnosis or AI-based treatment suggestions.
1.7.	Assumptions
It is assumed that users will have access to a computer or mobile device to use the Skin Treatment Appointment Website. Users are expected to have basic knowledge of using web applications and online systems. It is also assumed that a stable internet connection will be available for booking appointments, payments, and accessing reports. The system will be properly deployed and configured before use, and users will enter correct and valid information while using the platform. These assumptions ensure smooth and efficient functioning of the system.
1.8.	Risks
There is a risk of data loss or corruption due to server or database failure. Incorrect data entry may affect appointments, prescriptions, and Patient Records. Some users may resist adopting the digital system instead of traditional methods. Network or internet issues can delay Appointments, Payments, and System updates. Limited storage or system overload may also affect performance and data handling.
1.9.	Success Criteria
Table 3 Success Criteria table
Success Criteria	Description
User Registration	Patient can Register, Login, and access the system securely.
Appointment Booking System	Patients can Book Appointments and Doctors/Admin can manage them efficiently.
Prescription and Report Management	Doctors can Generate Prescriptions and Upload Reports, and Patients can access them easily.
E-Commerce Functionality	Patient can browse, Order skin care products, and complete Payments successfully.
Email Notification 	Patients, Doctors, and Admin receive timely notifications for appointments, reports, and updates.
Data Accuracy and Management	System stores, updates, and retrieves Patient, Doctor, and product data accurately and securely.
Performance and Analytics	Admin can view System Performance, Appointments, and through Analytics Dashboard.
System Responsiveness  	Website works smoothly and responds quickly on different devices and browsers.

1.10.	Tools, Libraries & Technologies
Table 4 Tools, Libraries & Technologies table



Tools, Libraries, And Technologies	Tools	Version	Rationale
	Vs code 	Latest	Use to main code editor 
	Libraries	Version	Rationale
	React.JS, CSS, Node.JS	Latest	UI design, backend
	Technology	Version	Rationale
	MongoDB	Latest 	Database for storing skincare data

1.11.	Work Division
Table 5 Work Division table
Sr. No 	Roll No 	Name 	Role Assignment & Work Division 
1. 	089337	Muhammad Salman 	Documentation, Frontend & Backend
2.	089273	Mahrukh 	Documentation, Frontend & Backend
1.12.	Conclusion
The Skin Treatment Appointment Website replaces manual healthcare processes with a digital system. It provides online appointment booking, prescription management, report handling, and e-commerce services. The system improves communication, and makes healthcare services faster, secure, and more efficient for patients, doctors, and admin.
Chapter No 2
Literature Review
 
2.1	Literature Survey
Literature survey shows that traditional healthcare and appointment systems are time-consuming and may lead to errors in Patient records, Appointment management, and Prescription handling. Digital healthcare systems help Patients, Doctors, and Admin manage medical services more efficiently. Modern studies recommend secure web-based healthcare platforms with features such as Appointment Booking, Report Management, Prescription Generation, Email Notifications, Analytics Dashboard, Payment Integration, and E-Commerce functionality. These systems improve communication between Patients, Doctors, and Admin while providing faster, secure, and user-friendly healthcare services.
2.2	Related Work
Many healthcare systems already exist for appointment booking and patient management, but most are limited in functionality or have complex interfaces. The proposed Skin Treatment Appointment System provides a user-friendly platform for Patients, Doctors, and Admin with features such as Appointment Booking, Prescription Management, Report Handling, Email Notifications, Payment Integration, Analytics Dashboard, and E-Commerce in a single system.
2.3	Gap Analysis
Table 6 Gap Analysis table
Existing System	Limitations	Our Solution
Online Appointment System	Limited features and lack of integrated healthcare management.	Develop a complete Skin Treatment Appointment System with Appointment Booking, Prescription Management, Report Handling, and Email Notifications.
Hospital Management Systems	Complex setup, costly, and difficult for small clinics and users.	Build a user-friendly and affordable web-based healthcare platform for Patients, Doctors, and Admin.
E-Commerce Medical Platforms	Focus only on product selling without healthcare management features.	Create an integrated system combining Skin Care Treatment Services and E-Commerce for medicines and skin care products.
2.4	Summary
Many healthcare and appointment systems already exist, but most focus only on appointments or patient records. Some systems are costly, complex, and difficult to use. The proposed Skin Treatment Appointment System solves these issues by providing a simple, user-friendly, and efficient platform for Patients, Doctors, and Admin. The system combines Appointment Booking, Prescription Management, Report Handling, Payment Integration, Email Notifications, Analytics Dashboard, and E-Commerce features in a single web-based solution.











Chapter No 3
Software Requirements Specification
 
3.1	Requirements Analysis
The SRS describes the complete requirements of the Skin Treatment Appointment System. It includes the functional and non-functional requirements of the website. This section provides detailed information about user needs, system features, and healthcare management functionalities. The SRS document gives a comprehensive description of the system including Appointment Booking, Prescription Management, Report Handling, Payment Integration, Email Notifications, Analytics Dashboard, and E-Commerce functionalities for Patients, Doctors, and Admin.
3.2	User Classes & Characteristics
Table 7 User Classes & Characteristics table
User Class	User Characteristics
Admin         
                         	Admin has full control of the system. Admin can manage doctors, patients, riders, appointments, products, orders, payments, and system analytics. Admin can also grant or revoke user access and handle overall system monitoring.
Doctors	Doctors can manage patient appointments and generate prescriptions.
Patients	Patients can book appointments, view prescriptions and reports, receive notifications, make payments, and purchase skin care products from the e-commerce store.
Rider 	Rider is responsible for delivering ordered products to patients. Rider can view assigned orders, update delivery status, and manage delivery tracking in the system.
3.3	Requirements Identifying Techniques
We have applied following techniques to identifying the requirements of the Skin Treatment Appointment System.
Observation Technique
	The primary technique used is observation.
	We observed that patients usually book appointments manually and face delays, while doctors maintain patient records and prescriptions in paper-based systems, which can lead to errors and data loss.
	Therefore, we decided to develop a digital system to overcome these challenges. It will manage appointments, patient records, prescriptions, reports, and communication in one platform.
Questionnaire Technique
	Meetings were conducted with Doctors, Patients, and Admin, and questionnaires were designed to collect detailed requirements.
	Their responses helped in understanding system needs such as Appointment Booking, Prescription Management, Report Handling, Payment Integration, E-Commerce Store, and Notification System.
Use Case Modeling
	Use case diagrams were prepared to identify interactions between Patients, Doctors, Admin, and Riders.
	This technique helped visualize how each actor will use the system and what functionalities are required for each role.
User Interaction Analysis
	Storyboards and use case analysis were used to understand user interaction with the system.
	This ensured that the system design meets user expectations and provides a smooth experience for Patients, Doctors, Admin, and Riders. 
3.4	Functional Requirements 
This section describes the functional requirements of the system expressed in the natural language style. This section is typically organized by feature as a system feature name and specific functional requirements associated with this feature. So, for each module and it’s feature the functional requirements are itemized below:
Functional Requirement 1
Table 8 Functional Requirement 1
Identifier	FR-1
Title	User Registration
Requirement	The system shall allow Patients, Doctors, Admin and Riders to register securely.
Source	Observation
Rationale	To ensure only authorized users access the system.
Business Rule	Valid data required no duplicate accounts secure password policy.
Dependencies	None 
Priority	High
Functional Requirement 2
Table 9Functional Requirement 2
Identifier	FR-2
Title	User Login
Requirement	The user should be able to log in securely using their email and password.
Source	Observation 
Rationale	To verify user identity and provide secure access.
Business Rule	Only registered users can log in with correct credentials.
Dependencies	Registration 
Priority	High

Functional Requirement 3
Table 10Functional Requirement 3
Identifier	FR-3
Title	Patient Profile Management
Requirement	Patient can create and update their profile.
Source	Questionnaire 
Rationale	To maintain accurate patient medical history.
Business Rule	Only patient can edit their own profile.
Dependencies	Login
Priority	High

Functional Requirement 4
Table 11Functional Requirement 4
Identifier	FR-4
Title	 Doctor management
Requirement	Admin can add, update and remove Doctor accounts.
Source	Observation 
Rationale	To manage available Doctors in the system.
Business Rule	Only Admin has permission.
Dependencies	Admin Login
Priority	High


Functional Requirement 5
Table 12Functional Requirement 5
Identifier	FR-5
Title	 Appointment Booking
Requirement	The patient should be able to book an appointment with a dermatologist through the website.
Source	Questionnaire 
Rationale	To provide online appointments.
Business Rule	No overlapping time slots allowed.
Dependencies	Login, Doctor availability
Priority	High
Functional Requirement 6 
Table 13Functional Requirement 6
Identifier	FR-6
Title	 Appointment Management
Requirement	The Admin should be able to view, confirm, or cancel patient appointments.
Source	Observation  
Rationale	To help admin manage their daily schedule and avoid overlapping appointments.
Business Rule	Only admin can update or cancel appointments.
Dependencies	Appointment booking
Priority	High

Functional Requirement 7 
Table 14Functional Requirement 7
Identifier	FR-7
Title	 Prescription Generation
Requirement	Doctors can generate digital prescription.
Source	Questionnaire 
Rationale	To replace manual prescription system.
Business Rule	Only Doctors can generate prescriptions.
Dependencies	Appointment Confirmation
Priority	High


Functional Requirement 8
Table 15Functional Requirement 8
Identifier	FR-8
Title	 Reports Management
Requirement	The Doctors should be able to upload medical reports or prescriptions for patients.
Source	Observation 
Rationale	To store and share patient reports securely through the system.
Business Rule	Only authorized users can access reports.
Dependencies	Login 
Priority	High
Functional Requirement 9
Table 16Functional Requirement 9
Identifier	FR-9
Title	E-Commerce System
Requirement	Patients can buy skin care products online.
Source	Questionnaire 
Rationale	To provide product purchasing facility.
Business Rule	Order confirm after successful payment.
Dependencies	Login 
Priority	Medium

Functional Requirement 10
Table 17Functional Requirement 10
Identifier	FR-10
Title	Payment Integration 
Requirement	System allows secure online payment.
Source	Observation  
Rationale	To support digital transaction.
Business Rule	Payment required for confirmation.
Dependencies	Appointments/Orders
Priority	High 
Functional Requirement 11
Table 18Functional Requirement 11
Identifier	FR-11
Title	Rider Management
Requirement	Riders view and update delivery status of order. 
Source	Questionnaire 
Rationale	To manage product delivery.
Business Rule	Only assign rider can update status.
Dependencies	Order Confirmation
Priority	Medium 

Functional Requirement 12
Table 19Functional Requirement 12
Identifier	FR-12
Title	Notification System
Requirement	System sends email/system notification. 
Source	Observation 
Rationale	To keep user update.
Business Rule	Notification triggered automatically.
Dependencies	System events
Priority	High 
Functional Requirement 13
Table 20Functional Requirement 13
Identifier	FR-13
Title	Rating and Review
Requirement	Patient can rate and review Doctors 
Source	Questionnaire 
Rationale	To improve service quality.
Business Rule	Only completed appointment can be rated.
Dependencies	Appointment completion
Priority	Medium 
Functional Requirement 14
Table 21Functional Requirement 14
Identifier	FR-14
Title	Admin dashboard
Requirement	Admin manages users, orders, riders, and system data. 
Source	Observation 
Rationale	To provide full system control.
Business Rule	Only Admin has full access.
Dependencies	Admin Login
Priority	High 

Functional Requirement 15
Table 22Functional Requirement 15
Identifier	FR-15
Title	Logout
Requirement	The user should be able to log out securely from the system
Source	Business Requirement
Rationale	To ensure that no one else can access the account after use.
Business Rule	User must be Login in the website
Dependencies	FR-1
Priority	High

3.5	Non-Functional Requirements 
These are constraints on the services or functions offered by the system. They include timing constraints, constraints on the development process, and constraints imposed by standards. Non-functional requirements often apply to the system as a whole rather than individual system features or services. Following are non-functional requirements:
Reliability
	The system should be available and functional most of the time.
	All patient, appointment, and order data should be stored securely in the database.
	The system should recover quickly in case of server or application failure.
Usability
	Dashboards should be simple and user-friendly for Patients, Doctors, Admin, and Riders.
	Users should easily book appointments and place orders with minimum steps.
	The system should use simple and clear interface language.
Performance
	Dashboard pages should load within a few seconds.
	Appointment booking and payment processing should be completed quickly.
	The system should support multiple active users at the same time efficiently.
Security
	All users should have secure login and encrypted passwords.
	The system should provide role-based access control for Patients, Doctors, Admin, and Riders.
	Unauthorized users should not be able to access private data or system features.
3.6	External Interface Requirements 
The system shall provide a simple, clear, and user-friendly interface for Patients, Doctors, Admin, and Riders.
1.	User Interface Requirements
Screens
	Signup/Login screens for Patients, Doctors, Admin, and Riders.
	Patient Dashboard for appointments, reports, prescriptions, orders, and notifications.
	Doctor Dashboard for appointment management, prescriptions, and reports.
	Admin Dashboard for managing users, products, orders, payments, and analytics.
	Rider Dashboard for viewing assigned deliveries and updating delivery status.
	E-Commerce Store Page for browsing and purchasing skin care products.
Design Elements
	Navigation Bar with links to Dashboard, Appointments, Store, Reports, and Logout.
	Card-based layout for Doctors, Products, and Appointments.
	Notification system for appointments, orders, and delivery updates.
	Reports and Prescriptions downloadable in PDF format.
2.	Software Interfaces
i.	Frontend: React.js, HTML, CSS 
ii.	Backend: Node.js with Express.js 
iii.	Database: MongoDB 
3.	Hardware Interfaces
i.	Works on any computer, laptop, tablet, or smartphone.
ii.	Needs a good internet connection for smooth use.
iii.	No special hardware is needed just a browser like Chrome or Firefox.
4.	Communication Interfaces
	Internet connection is required for login, appointments, payments, and notifications.
	The system supports communication through email notifications and system alerts.
	RESTful APIs provide secure communication between frontend and backend.
3.7	Use Case Analysis
Use Case #1 – Login
Table 23 Use Case 1
Attribute	Description
Use Case ID	UC-1
Use Case Name	Login
Actors	 Admin
Description	Allows users to log in securely to access their dashboards.
Preconditions	User must have registered credentials.
Postconditions	User is authenticated and redirected to their dashboard.
Priority	High
Main Flow	User opens the login page
Enters email or username and password
Clicks the Login button
System validates credentials
System redirects user to their respective dashboard
Displays Login Successful
Alternate Flow	User clicks Forgot Password then System sends password reset email.
User clicks Remember Me then Session stored securely.
Exceptions	Incorrect username or password, Server error.

Use Case #2 – Manage Patients
Table 24Use Case 2
Attribute	Description
Use Case ID	UC-2
Use Case Name	Manage Patients
Actors	Admin
Description	Allows admin to add, update, view, and remove patient records.
Preconditions	Admin must be logged into the system.
Postconditions	Patient information is updated successfully in database.
Priority	High
Main Flow	Admin opens dashboard 
Selects Patients Module 
Adds/Updates/Deletes patient
 System saves changes
Alternate Flow	Admin searches patient by ID or name.
Exceptions	Invalid patient data, Database error.

Use Case #3 – Manage Appointments
Table 25Use Case 3
Attribute	Description
Use Case ID	UC-3
Use Case Name	Manage Appointments
Actors	Admin
Description	Allows the admin to approve, cancel, or reschedule patient appointments.
Preconditions	Admin must be logged in.
Postconditions	Appointment status updated and patient notified.
Priority	High
Main Flow	Admin logs in and opens Manage Appointments
System displays all pending appointments
Admin selects an appointment
Approves, cancels, or reschedules it
System updates status and sends notification to patient
Alternate Flow	Filter appointments by date/status
Bulk approval or cancellation
Exceptions	Appointment conflict detected Notification system offline.

Use Case #4 – Mange Products
Table 26 Use Case 4
Attribute	Description
Use Case ID	UC-4
Use Case Name	Manage Products
Actors	Admin
Description	Allows admin to manage skincare products in e-commerce system.
Preconditions	Admin must be authenticated.
Postconditions	Product details are stored or updated successfully.
Priority	High
Main Flow	Admin opens Products
 Module  Adds/Edits/Deletes product 
 System updates database
Alternate Flow	Admin updates stock quantity or product price.
Exceptions	Invalid product information, Server error.

Use Case #5 – Manage Orders
Table 27 Use Case 5
Attribute	Description
Use Case ID	UC-5
Use Case Name	Manage Orders
Actors	Admin
Description	Allows admin to monitor and manage customer orders.
Preconditions	Admin must login successfully.
Postconditions	Order status is updated and saved in database.
Priority	High
Main Flow	Admin opens Orders Module
 Views orders 
Updates delivery/order status 
System saves changes
Alternate Flow	Admin filters orders by status or date.
Exceptions	Order not found, Database failure.

Use Case #6 – Upload Reports
Table 28 Use Case 6
Attribute	Description
Use Case ID	UC-6
Use Case Name	Upload Reports
Actors	Admin
Description	Enables the admin to upload and manage patient reports securely.
Preconditions	Patient record must exist in the system.
Postconditions	Report stored in database and available for patient to view.
Priority	High
Main Flow	Admin opens a patient record
Clicks Upload Report
Selects file and enters title
Clicks Upload
System validates file and saves it
System notifies patient about the new report
Alternate Flow	Multiple files uploaded together
Report marked as private
Exceptions	File too large or unsupported, Server timeout.


Use Case #7 – Logout
Table 29 Use Case 7
Attribute	Description
Use Case ID	UC-7
Use Case Name	Logout
Actors	 Admin
Description	Allows both users to securely end their session.
Preconditions	User must be logged in.
Postconditions	Session ended and redirected to login page.
Priority	High
Main Flow	User clicks Logout.
System terminates session.
Clears cache and tokens.
Redirects to login page.
Displays confirmation message.
Alternate Flow	Auto logout after 15 minutes inactivity.
Exceptions	Session timeout or server failure.
Admin Use Case Diagram
Figure 1 Use Case Diagram of Admin
 
Use Case #8 – Login 
Table 30 Use Case 8
Attribute	Description
Use Case ID	UC-8
Use Case Name	Login 
Actors	Doctor 
Description	Allows doctor to log in securely and access dashboard.
Preconditions	Doctor must have registered credentials.
Postconditions	Doctor is authenticated and redirected to dashboard.
Priority	High
Main Flow	Doctor opens login page 
Enters email/password
Clicks Login 
System validates credentials 
Dashboard opens
Alternate Flow	Doctor clicks Forgot Password 
Reset email sent
Exceptions	Invalid credentials, Server error.
Use Case #9 – Manage Appointments 
Table 31 Use Case 9
Attribute	Description
Use Case ID	UC-9
Use Case Name	Manage Appointments
Actors	Doctor
Description	Allows doctor to approve, reject, or manage appointments.
Preconditions	Doctor must be logged in.
Postconditions	Appointment status updated successfully.
Priority	High
Main Flow	Doctor opens appointments module 
Views requests 
Approves/Rejects appointment 
System updates status
Alternate Flow	Doctor reschedules appointment.
Exceptions	Appointment not found, Database error.
Use Case #10 – Generates Prescription
Table 32 Use Case 5
Attribute	Description
Use Case ID	UC-5
Use Case Name	Generate Prescription
Actors	Doctor
Description	Allows doctor to create and send prescriptions to patients.
Preconditions	Patient appointment must exist.
Postconditions	Prescription saved successfully in database.
Priority	High
Main Flow	Doctor selects patient 
Enters medicines and instructions 
Clicks Save 
System stores prescription
Alternate Flow	Doctor edits prescription before saving.
Exceptions	Invalid prescription details, Server issue.
Use Case #10 – View Patient History
Table 33 Use Case10
Attribute	Description
Use Case ID	UC-10
Use Case Name	View Patient History
Actors	Doctor 
Description	Allows doctor to view patient medical history and reports.
Preconditions	Doctor must be authenticated.
Postconditions	Patient history displayed successfully.
Priority	Medium
Main Flow	Doctor searches patient 
Opens history page 
System displays reports and prescriptions
Alternate Flow	Doctor filters records by date.
Exceptions	Patient record not found.
Use Case #11 – Logout 
Table 34 Use Case 11
Attribute	Description
Use Case ID	UC-11
Use Case Name	Logout 
Actors	Doctor 
Description	Allows doctor to securely logout from system.
Preconditions	Doctor must be logged in.
Postconditions	Session ends and login page displayed.
Priority	Medium
Main Flow	Doctor clicks Logout 
System clears session
Redirects to login page
Alternate Flow	Auto logout after inactivity.
Exceptions	Session expiration error.
Doctor Use Case Diagram
Figure 2 Use Case Diagram of Doctor

 


Use Case #12 – Login
Table 35 Use Case 12
Attribute	Description
Use Case ID	UC-12
Use Case Name	Login 
Actors	Patient
Description	Allows patient to log in securely to access dashboard.
Preconditions	Patient must have registered credentials.
Postconditions	Patient is authenticated and redirected to dashboard.
Priority	High
Main Flow	Patient opens login page
Enters email/password 
Clicks Login
System validates credentials
Dashboard opens.
Alternate Flow	Patient clicks Forgot Password 
Reset email sent.
Exceptions	Invalid credentials, Server error.
Use Case #13 – Manage Profile
Table 36 Use Case 13
Attribute	Description
Use Case ID	UC-13
Use Case Name	Manage Profile
Actors	Patient
Description	Allows patient to update personal and medical information.
Preconditions	Patient must be logged in.
Postconditions	Profile information updated successfully.
Priority	Medium
Main Flow	Patient opens profile 
Updates details 
Saves changes 
System updates database
Alternate Flow	Patient uploads profile image.
Exceptions	Invalid data, Database error.
Use Case #14 – Book Appointment 
Table 37 Use Case 14
Attribute	Description
Use Case ID	UC-5
Use Case Name	Book Appointment
Actors	Patient
Description	Allows patient to book appointment with doctor.
Preconditions	Patient must be logged in.
Postconditions	Appointment request stored successfully.
Priority	High
Main Flow	Patient selects doctor 
Chooses date/time 
Clicks Book Appointment 
System saves booking
Alternate Flow	Patient reschedules appointment.
Exceptions	Slot unavailable, Network issue.
Use Case #15 – Make Payments
Table 38 Use Case 15
Attribute	Description
Use Case ID	UC-15
Use Case Name	Make Payments
Actors	Patient
Description	Allows patient to pay appointment or order charges online.
Preconditions	Patient must have pending payment.
Postconditions	Payment completed and receipt generated.
Priority	High
Main Flow	Patient selects payment method 
Enters payment details 
Confirms payment  
System processes transaction
Alternate Flow	Patient retries failed payment.
Exceptions	Payment failed Server error.
Use Case #16 – View Prescription
Table 39 Use Case 16
Attribute	Description
Use Case ID	UC-16
Use Case Name	View Prescription
Actors	Patient
Description	Allows patient to view doctor prescriptions.
Preconditions	Prescription must exist in system.
Postconditions	Prescription displayed successfully.
Priority	Medium
Main Flow	Patient opens prescriptions page 
Selects prescription 
System displays details.
Alternate Flow	Patient downloads prescription PDF.
Exceptions	Prescription not found.
Use Case #17 – Purchase Products
Table 40 Use Case 17
Attribute	Description
Use Case ID	UC-17
Use Case Name	Purchase Products
Actors	Patient
Description	Allows patient to purchase skincare products online.
Preconditions	Patient must be logged in.
Postconditions	Order placed successfully.
Priority	High 
Main Flow	Patient browses products 
Adds items to cart 
Places order 
System confirms order
Alternate Flow	Patient removes product from cart.
Exceptions	Product out of stock, Payment failed.
Use Case #18 – Rating and Review
Table 41 Use Case 18
Attribute	Description
Use Case ID	UC-18
Use Case Name	Rating and Review
Actors	Patient
Description	Allows patient to give ratings and reviews to doctors/products.
Preconditions	Patient must complete appointment or purchase.
Postconditions	Review stored successfully.
Priority	Medium
Main Flow	Patient selects doctor/product 
Gives rating and review 
System stores feedback
Alternate Flow	Patient edits review later.
Exceptions	Invalid review submission.



Use Case #19 – Logout 
Table 42 Use Case 19
Attribute	Description
Use Case ID	UC-19
Use Case Name	Logout 
Actors	Patient 
Description	Allows patient to securely logout from the system.
Preconditions	Patient must be logged in.
Postconditions	Session ends and login page displayed.
Priority	Medium
Main Flow	Patient clicks Logout 
System clears session 
Redirects to login page
Alternate Flow	Auto logout after inactivity.
Exceptions	Session expiration error.
Patient Use Case Diagram
Figure 3 Use Case Diagram of patient
 


Use Case #20 – Login
Table 43 Use Case 20
Attribute	Description
Use Case ID	UC-20
Use Case Name	Login 
Actors	Rider 
Description	Allows rider to log in securely and access rider dashboard.
Preconditions	Rider must have registered credentials.
Postconditions	Rider is authenticated and redirected to dashboard.
Priority	High
Main Flow	Rider opens login page
 Enters email and password
 Clicks Login 
System validates credentials 
Rider dashboard opens.
Alternate Flow	Rider clicks Forgot Password
 System sends reset email.
Exceptions	Invalid credentials, Server error.

Use Case #21 – View Assigned Orders
Table 44 Use Case 21
Attribute	Description
Use Case ID	UC-21
Use Case Name	View Assigned Orders
Actors	Rider
Description	Allows rider to view assigned delivery orders.
Preconditions	Rider must be logged in.
Postconditions	Assigned orders are displayed successfully.
Priority	High
Main Flow	Rider opens dashboard 
Selects Orders 
System displays assigned deliveries.
Alternate Flow	Rider filters orders by status.
Exceptions	. No assigned orders, Database error.


Use Case #22 – Update Delivery Status 
Table 45 Use Case 22
Attribute	Description
Use Case ID	UC-22
Use Case Name	Update Delivery Status
Actors	Rider 
Description	Allows rider to update order delivery status.
Preconditions	Rider must be logged in and assigned an order.
Postconditions	Delivery status is updated in database.
Priority	High
Main Flow	Rider selects order
 Updates status (Picked/On Way/Delivered)
 System saves status.
Alternate Flow	Rider updates estimated delivery time.
Exceptions	Invalid status update, Network issue.


Use Case #23 – Logout
Table 46 Use Case 5
Attribute	Description
Use Case ID	UC-23
Use Case Name	Logout 
Actors	Rider 
Description	Allows rider to securely logout from the system.
Preconditions	Rider must be logged in.
Postconditions	Rider session ends and login page is displayed.
Priority	Medium
Main Flow	Rider clicks Logout button 
System clears session 
Redirects to login page.
Alternate Flow	System auto logout after inactivity.
Exceptions	Session expiration error.

Rider Use Case Diagram
Figure 4 Use Case Diagram of Rider
 























3.8	Storyboard
Figure 5 storyboard picture
Storyboarding 1
 
 Storyboarding 2
 
Storyboarding 3
 
3.9	Summary
This project SRS explains the main requirements of the Skin Treatment Appointment & E-Commerce System. It defines the functionalities of Admin, Doctor, Patient, and Rider. The system supports appointment booking, medical reports, product ordering, notifications, and delivery management. Use cases and diagrams help in clear system development and improve system efficiency and user experience..



 
Chapter No 4
Software Design Specification

 
4.1	System Design
Product Perspective:

Perspective Type	Description
Platform 	The system works on web and mobile devices for Admin, Doctor, Patient, and Rider.
Database 	 Uses MongoDB database for storing user data, appointments, medical reports, orders, and notifications.
Authentication 	Secure login system with role-based access control for Admin, Doctor, Patient, and Rider.
Notification	Sends appointment alerts, delivery updates, and system notifications to users.
Features 	Supports appointment booking, medical reports, prescriptions, e-commerce orders, and delivery tracking.
Integration 	Integrates with email services, push notifications, and payment through stripe.
Dependencies 	Depends on internet connection for login, synchronization, notifications, and online services.
User interaction 	Provides dashboards, signup/login pages, appointment booking, reports, and order tracking interfaces.

Design constraints

Constraints  Type	Description
Technology Constraint	The system will be developed using React, Node.js, Express.js, and MongoDB.
Platform Constraint	The application must work on web and mobile devices.
Database Constraint	MongoDB will be used for storing appointments, users, reports, and orders.
Security Constraint	Only authorized users can access the system through secure login and role-based access control.
Internet  Constraint	Internet connection is required for login, appointments, notifications, and synchronization.
UI Constraint	The interface should be simple, responsive, and user-friendly for all actors.
Integration Constraint	The system must support email notifications and payment gateway integration.
Device  Constraint	Users must have a mobile phone, tablet, or computer to access the system.
Storage Constraint	The device and server must have enough storage for medical reports and order data.


4.2	Design Considerations
Assumptions
	Users have basic knowledge of using the application.
	Internet connection is available for login and appointments.
	Users will provide correct and valid information.
	The system will work on both mobile and web devices.

Dependencies
	The system depends on MongoDB database for data storage.
	Payment gateway is required for online product orders.
	Internet connection is required for synchronization and updates.

Limitations
	Weak internet may slow appointment updates and notifications.
	Users cannot access some online features without internet.
	Limited device storage may affect report uploads.
Risks
	Data may be lost due to server or device failure.
	Unauthorized access may affect system security.
	Wrong user input may create incorrect reports or appointments.
4.3	Requirements Traceability Matrix
Table 30 Requirement Traceability Matrix table
Requirement ID	Requirement Description	Design Specification
FR-1	The system shall allow users to register securely before accessing the application.	 Sign-Up UI & Authentication Controller
FR-2	The system shall allow users to login securely before accessing the application.	Login UI & Authentication Controller
FR-3	The system shall allow patients to manage their profiles (update/view personal details).	Patient Profile UI & User Management Module
FR-4	The system shall allow admin to manage patients, orders etc.	Admin Dashboard & Doctor Management Module
FR-5	The system shall allow patients to book appointments with doctors.	Appointment Booking Module & Patient UI
FR-6	The system shall allow doctors/admin to manage appointments (approve/reject/schedule).	Appointment Management Module & Doctor/Admin Dashboard
FR-7	The system shall allow doctors to generate prescriptions for patients.	Prescription Module & Doctor Dashboard
FR-8	The system shall allow admin to manage and view system reports.	Report Management Module & Admin Dashboard
FR-9	The system shall allow users to access e-commerce system for skincare products.	E-Commerce Module & Product Catalog UI
FR-10	The system shall allow users to make payments securely for orders.	Payment Gateway Integration Module
FR-11	The system shall allow admin to manage riders and delivery assignments.	Rider Management Module &  Admin Dashboard
FR-12	The system shall send notifications for appointments, orders, and updates.	Notification System (Email/Push Service)
FR-13	The system shall allow users to give ratings and reviews.	Rating & Review Module & Database Layer
FR-14	The system shall provide an admin dashboard for system control and monitoring.	Admin Dashboard UI & Control Module
FR-15	The system shall allow users to securely logout from the system.	Authentication Controller & Session Management
4.4	Design Models
This section explains the different diagrams and models used to show how the Skin Care System is designed. These models help developers understand how the system works internally, how different parts interact, and how data flows from one component to another.

1.	Design Class Diagram
Figure 6 Design Class Diagram
 












2.	Interaction Diagram (Either sequence or collaboration)
Sequence Diagram 
1.	Admin Login 
Figure 7 Admin Sequence Diagram 
 

2.	Doctor Login
Figure 8  Doctor Login Sequence Diagram 
 






3.	Patient Login
Figure 9 patient Login Sequence Diagram 
 

4.	Appointment Booking System
Figure 10 Appointment booking system sequence diagram
 





5.	Prescription Generation
Figure 11prescription generation sequence diagram
 

6.	E-Commerce Order placement 
Figure 12 E-Commerce order placement sequence diagram 
 






1.	Rider Delivery Process
Figure 13 Rider delivery process sequence diagram
 




























2.	State Diagram
1.	Patient State Diagram
Figure 14 Patient State Diagram 
 





2.	Doctor State Diagram
Figure 15 Doctor State Diagram 
 









3.	Admin State Diagram
Figure 16 Admin state diagram
 









4.	Rider State Diagram
Figure 17 Rider state diagram
 
4.5	Architectural Design
The system uses a multi-tier design which means the work is divided into different parts. Each part has its own job. This makes the system easier to manage, faster to update, and better at handling changes.

1.	UML Component Diagram
Figure 18 UML Component Diagram
 
4.6	Data Design
In our system, we use MongoDB as the main database to store all application data such as users, doctors, patients, appointments, orders, payments, and reports.
Database Design Overview:
Our system uses MongoDB as the primary database to store and manage all application data. The database is designed using a collection-based structure, where each module of the system is stored in separate collections for better organization, scalability, and performance.
	MongoDB is used as the main database for all online data storage.
	Data is organized into collections such as Users, Doctors, Patients, Appointments, Prescriptions, Orders, Payments, Riders, Reports, and Notifications.
	Each collection stores related information and is linked using unique IDs (e.g., userId, doctorId, patientId).
	The system follows role-based access control (Admin, Doctor, Patient, Rider).
	Backend APIs handle all database operations (create, read, update, delete).
	Optional local storage can be used for offline support and later synchronization with MongoDB.
	The design ensures data consistency, security, scalability, and easy maintenance.
1.	Data Dictionary
Table 31 Data Collection table
Terminology 	Description 
Class: Admin	Admin that manages the whole system (Doctors, Patients, Riders, Reports, Users).
Attribute: adminId	Unique ID of admin (String / UUID).
Attribute: email	Admin login email.
Attribute: password	Encrypted password for authentication.
Method: login()	Admin logs into the system securely.
Method: logout()	Admin logs out from system.
Method: manageRiders()	Add/update/delete rider accounts.
Method: viewReports()	View system reports (appointments, users, sales).
Method: manageAppointments()	Monitor all appointment activities.
Method: sendNotification()	Send announcements/alerts to users.
Class: Patient	User who books appointments and uses services.
Attribute: patientId	Unique ID of patient.
Attribute: name	Full name of patient.
Method: login()	Patient login
Method: updateProfile()	Update personal/medical information.
Method: bookAppointment()	Book appointment with doctor.
Method: viewReports()	View medical reports and prescriptions.
Method: makePayment()	Pay for services/products.
Method: giveReview()	Submit rating and review.
Class: Doctor	Medical professional who manages patients and prescriptions.
Attribute: doctorId	Unique doctor ID.
Attribute: specialization	Field of doctor (skin, general, etc.).
Attribute: availability	Doctor available time slots.
Method: login()	Doctor login.
Method: viewAppointments()	View scheduled appointments.
Method: generatePrescription()	Create digital prescription for patient.
Method: uploadReport()	Upload medical report.
Method: viewPatientHistory()	Check patient history.
Class: Rider	Delivery user who handles order delivery.
Attribute: riderId	Unique rider ID.
Attribute: status	Availability status.
Method: login()	Rider login
Method: viewDeliveries()	View assigned orders.
Method: updateDeliveryStatus()	Update order status (picked/delivered).
Class: Appointment	Handles booking and management of appointments.
Attribute: appointmentId	Unique appointment ID.
Attribute: dateTime	Appointment schedule time.
Attribute: status	Pending/Approved/Rejected.
Method: createAppointment()	Book new appointment.
Method: updateAppointment()	Modify appointment details.
Method: cancelAppointment()	Cancel appointment.
Class: Payment	Handles online payment processing.
Attribute: paymentId	Unique payment ID.
Attribute: amount	Payment amount.
Attribute: status	Paid/Unpaid/Failed.
Class: Notification	Handles system alerts and messages.
Attribute: notificationId	Unique notification ID.
Class: Product (E-Commerce)	Handles skincare products system.
Attribute: productId	Unique product ID.
Attribute: name	Product name.
Attribute: price	Product price.
Class: Review	Stores user ratings and feedback.
Attribute: reviewId	Unique review ID.
Attribute: rating	Star rating (1–5).
Attribute: comment	User feedback text.
Method: submitReview()	Submit review.
Method: viewReviews()	View all reviews.

4.7	User Interface Design
1.	Screen Images
1.	Page # 1
Figure 19 Page # 1
 




2.	Page # 2
Figure 20 Page # 2
 

3.	Page # 3
Figure 21 Page # 3
 
4.	Page # 4
Figure 22 Page # 4
 
2.	Screen objects and action
Login / Register Page
Objects: Email, password fields, login/register button, forgot password link
Actions: User logs in, registers, or resets password
Dashboard Page
Objects: Menu, appointment list, reports section, profile info
Actions: User views appointments, reports, and profile
Appointment Page
Objects: Date picker, time slots, confirm button
Actions: Patient books appointment, admin manages appointments
Report Page
Objects: Upload button, report list, download button
Actions: Admin uploads reports, patient views/downloads reports

Profile Page
Objects: Profile fields, save button
Actions: User updates personal information
Logout
Objects: Logout button
Actions: User logs out safely

4.8	Design Decisions
1.	MERN stack is used for modern web development.
2.	MongoDB is used to store data safely.
3.	Separate roles are created for admin and patients.
4.	Passwords are encrypted for security.
5.	Simple design is used for easy understanding.
4.9	Summary
This System Design Specification explains the overall design of the system using React, Node.js, Express.js, and MongoDB (MERN stack). It covers main modules like users, appointments, prescriptions, e-commerce, payments, and notifications. The system uses modular and client-server architecture. All design decisions, constraints, assumptions, and risks are defined to ensure easy development, scalability, and maintenance.

 
Chapter 5 Implementation
 
4.1	Implementation
 The implementation details of the Skin Treatment Appointment System are discussed below. 

4.2	Algorithm
This section explains the algorithms and logic used in the major modules of the Skin Treatment Appointment system. The system is developed using React.js for frontend and Node.js with Express.js for backend services, while MongoDB is used for database management. The system uses authentication algorithms for secure login and role-based access control for Admin, Doctor, Patient, and Rider. Appointment booking logic is used to manage doctor schedules and patient bookings efficiently. Prescription generation algorithms store and retrieve medical records securely. The e-commerce module uses product and order management logic, while the rider module handles delivery assignment and status updates. Payment integration algorithms ensure secure online transactions. Notification logic is used to send alerts and updates to users in real time.
1)	Login and Role Verification Algorithm
            Pseudocode
Table 37 login and role verification Algorithm

Algorithm 1: Login and Role Verification
Input: Email, Password, Role
Output: User Dashboard

	User enters email and password
	System checks entered data in MongoDB database
	IF email and password are correct THEN
	Get user role
	IF role = Admin THEN
	Open Admin Dashboard
	ELSE IF role = Doctor THEN
	Open Doctor Dashboard
	ELSE IF role = Patient THEN
	Open Patient Dashboard
	ELSE IF role = Rider THEN
	Open Rider Dashboard
	END IF
	ELSE
	Display “Invalid Credentials”
	END IF
          Time complexity: O(1)
        The login system performs direct database verification for secure authentication. 
2)	Appointment Booking Algorithm
            Pseudocode
Table 38 Appointment Booking Algorithm

Algorithm 1: Appointment Booking
Input: ID, Date, Time
Output: Appointment Confirmation
	Patient selects doctor
	Patient chooses appointment date and time
	System checks doctor availability
	IF slot is available THEN
	Create appointment record
	Save appointment in database
	Send notification to doctor and patient
	Display “Appointment Booked Successfully”
	ELSE
	Display “Slot Not Available”
	END IF
       Time Complexity: O(n)
       The system checks available appointment slots before booking.
3)	Prescription Generation Algorithm
            Pseudocode
Table 39 Prescription Generation Algorithm

Algorithm 1: Prescription Generation
Input: Patient Details, Medicines, Instructions
Output: Digital Prescription
	Doctor opens patient record
	Doctor enters medicines and treatment instructions
	System validates entered data
	Prescription saved in database
	Generate digital prescription
	Patient can view/download prescription
Time Complexity: O(1)
The prescription system stores medical records securely.

4)	Product Ordering Algorithm
            Pseudocode
Table 40 Product Ordering Algorithm

Algorithm 1: Product Ordering
Input: Product ID, Quantity, Payment Method
Output: Order Confirmation
	Patient selects skincare products
	Add products to cart
	System calculates total amount
	Patient confirms order and payment
	System stores order details
	Generate order confirmation
	Assign order for delivery
Time Complexity: O(n)
The ordering system processes cart items and stores order information.

5)	Payment Processing Algorithm
            Pseudocode
Table 41 Payment Processing Algorithm

Algorithm 1: Payment Processing
Input: Payment Details
Output: Payment Status
	User selects payment method
	System verifies payment information
	Connect payment gateway
	IF payment successful THEN
	Update payment status
	Generate receipt
	ELSE
	Display “Payment Failed”
	END IF
Time Complexity: O(1)
The payment system securely processes online transactions.
6)	Rider delivery Management Algorithm
            Pseudocode
Table 38 Appointment Booking Algorithm

Algorithm 1: Rider Delivery Management
Input: Order ID, Rider ID
Output: Delivery Status Update
	Admin assigns order to rider
	Rider views assigned orders
	Rider updates delivery status
	IF order delivered THEN
	System marks order as completed
	Send delivery notification to patient
	ELSE
	Keep order in pending state
	END IF
      Time Complexity: O(1)
       The rider system tracks and updates delivery information.
4.3	External APIs/SDKs
Table 5- 1 Details of APIs used in the project

Name of API and version	Description of API	Purpose of usage	List down the API endpoint/function/class in which it is used
Stripe API v1	Online payment processing API	Used for appointment and product payment transactions	/create-payment-intent, PaymentController
Cloudinary SDK	Cloud file and image storage service	Used to upload doctor, patient, and product images	uploadImage(), CloudinaryConfig
Nodemailer	Email sending library for Node.js	Used for password reset and notifications	sendEmail(), MailService
Firebse Cloud Messaging	Push notification service	Used for appointment and delivery notifications	sendNotification(), NotificationService
MongoDB Driver	Database connection library	Used for storing and managing system data	connectDB(), DatabaseConfig
Express.js	Backend framework for REST APIs	Used to create backend APIs and routes	app.use(), Router()
 
4.4	Code Repository
 The Skin Treatment Appointment System uses github.com⁠ for version control and project collaboration. All frontend, backend, database, and documentation files are stored in the repository to manage updates and track changes efficiently.
Git Repository Link:
The repository for the group project can be accessed using the following link:
[https://github.com/your-project-repository-link]

Metrics of the Git Repository:
The following metrics are monitored for the Skin Treatment Appointment System to ensure proper version control and collaboration:
	Commits: Track code updates and team contributions.
	Branches: Manage separate features like appointments, payments, and rider modules.
	Pull Requests: Review and merge code changes securely.
	Issues: Track bugs, feature requests, and development tasks.
	Contributors: Monitor team member contributions and activities.
            
4.5	Summary
This chapter explained the implementation of the Skin Treatment Appointment System using React.js, Node.js, Express.js, and MongoDB. It discussed APIs, database integration, authentication, appointments, payments, rider management, and Git repository usage. These implementations help achieve the project objectives by providing a secure, efficient, and user-friendly healthcare and e-commerce system. 
Chapter  6
Testing and Evaluation
 
6.1.	Introduction

In order to ensure software verification and validation, software testing is conducted. Though it is preferred to specify automated test scripts, testcases referring to manual testing can also be presented. Test scripts must conform to the following best practices:
Keep Tests Independent: Ensure each test can run independently of others.
Use Meaningful Assertions: Make sure your assertions are clear and meaningful.
Handle Test Data: Use setup and teardown methods to manage test data.
Avoid Hardcoding: Use variables and configurations to avoid hardcoding values.
Make Tests Repeatable: Ensure that tests can be run multiple times without failure due to state persistence.

Follow the template (represented in Table-1) for documenting the testcases of each of these categories
6.2.	Unit Testing (UT)
It’s a level of software testing where individual units of a software/component are tested. The purpose is to validate that each unit of the software performs as designed.
6.3.	Functional Testing (FT)
In this functional testing, the functionality of each of the module/ stakeholders’ view is tested. This is to ensure that the system produced meets the specifications and requirements
6.4.	Integration Testing (IT)
After ensuring the individual test runs successfully, the interaction of the classes/ functions is tested to assess whether the feature is yielding the desired results.
6.5.	Performance Testing (PT)
In order to assess the performance of the feature, the performance test is conducted. It usually measures response time, stability (reliability under stress). Specify the tool used for conducting the performance testing. Specify the screen shots (2-4) representing the configuration as well as output of the performance testing conducted.

Table 1- Testcase

Testcase ID	Unique identifier of testcase (e.g. UT1 for Unit testcase1)
Requirement ID	Requirement ID of the requirement to be tested
Title	Feature name or requirement to be tested must be represented in brief
Description	Description of feature to be tested
Objective	Why this testcase is needed
Driver/precondition	Setup required before test execution
 


5.1.	Summary
Summary of the key points discussed in the chapter. It may also reiterate chapter’s importance in addressing the projects objectives
 
Chapter 7
System Conversion
 
7.1.	Introduction
The proposed Skin Treatment Appointment System replaces the traditional manual appointment and skincare management process with a digital healthcare and e-commerce system. The implementation process includes application setup, MongoDB database configuration, API integration, payment handling, appointment management, and testing to ensure smooth system operation.
7.2.	Conversion Method
For the Skin Treatment Appointment System, the Pilot Conversion Method is selected. In this method, the system is first implemented in a specific clinic or dermatology center before full deployment for all users. This approach helps in identifying errors, testing appointment booking, payment processing, prescription management, and collecting feedback from doctors, patients, and riders before complete implementation.
The Pilot Conversion Method is suitable for this project because it reduces risk, improves system reliability, and allows gradual improvements before full deployment.
7.3.	Deployment
The deployment process includes installing and configuring the frontend, backend, and database components of the Skin Treatment Appointment System.
Steps for Deployment
Install Node.js and required dependencies.
Install Visual Studio Code for development.
Setup frontend project using React.js and JavaScript.
	Configure backend server using Node.js and Express.js.
	Configure MongoDB database for storing system records.
	Connect frontend with backend REST APIs.
	Configure payment gateway and notification services.
	Start backend server on localhost/server.
	Run frontend application in browser.
	Verify successful system operation through testing.

Data Conversion
Data conversion is performed to transfer and synchronize patient, appointment, prescription, order, and payment records between the application and the MongoDB database system.
Steps of Data Conversion
	Extract patient, doctor, appointment, and order data from the system.
	Validate and clean incorrect or duplicate records.
	Convert data into compatible MongoDB database format.
	Synchronize updated records with the main database server.
	Verify successful data transfer and storage.	

Training
This section explains the user training and basic usage instructions for the Skin Treatment Appointment System.
      Use Case 1 – Appointment Booking (Patient)
     Steps:
	Login into the application.
	Open doctor listing section.
	Select required doctor and treatment type.
	Choose available date and time slot.
	Confirm appointment booking.
	System saves appointment and sends confirmation notification.
Use Case 2 – Prescription Viewing (Patient)
       Steps: 
	User opens prescription section
	System displays list of prescriptions.
	User selects a prescription.
	System shows full prescription details.
	User can download prescription in PDF format.
Use Case 3 – Order & Payment (Patient)
Steps:
	User selects skincare products.
	Adds items to cart.
	Proceeds to checkout.
	Completes payment using available methods.
	System confirms order and generates receipt.
7.4.	Post Deployment Testing
 After deployment, testing is conducted to ensure that the Skin Treatment Appointment System works correctly in the live environment. The successful execution of these tests confirms proper deployment and system stability.
Post Deployment Testing Steps
	Verify frontend and backend connectivity (React.js and Node.js).
	Test MongoDB database connection and data synchronization.
	Verify user authentication and role-based access control (Admin, Doctor, Patient, Rider).
	Check appointment booking and scheduling functionality.
	Test prescription generation and viewing process.
	Verify payment processing and transaction status.
	Test order placement and delivery tracking (rider module).
	Ensure notification system is working properly.
	Validate report generation and data retrieval.
7.5.	Challenges
Challenge	Solution
Internet connectivity problems	Used radius-based location verification for better accuracy
Different user role management	Implemented role-based access control (Admin, Doctor, Patient, Rider)
Payment integration errors	Handled through secure payment gateway error handling and retries
Database connection failures	Added error handling and automatic reconnection logic


7.6.	Summary

The Skin Treatment Appointment System was successfully deployed by setting up the React.js frontend, Node.js backend, and MongoDB database. The system was tested after deployment to ensure proper connectivity, authentication, appointment booking, payments, prescriptions, and order management. Overall, the deployment ensured that all modules work smoothly in a real environment. 
Chapter 7 Conclusion
 

8.1.	Introduction
The conclusion chapter summarizes the Skin Treatment Appointment System. It evaluates the achievement of project objectives, presents system outcomes, and discusses future improvements. This chapter highlights how the developed system successfully fulfills all requirements including appointments, prescriptions, payments, rider management, and e-commerce features.
8.2.	Evaluation

Objectives	Status
Develop a secure login system	Completed
Develop appointment booking system	Completed
Manage patient profiles	Completed
Generate prescriptions digitally	Completed
Implement e-commerce (product ordering)	Completed
Integrate payment system	Completed
Manage rider/delivery system	Completed
Provide notification system	Completed


8.3.	Traceability Matrix
Shows how each design, code and test configuration item traces back to a specific requirement in the Software Requirements Specification (SRS), ensuring that all requirements are accounted for in the final product. Use table to document requirements traceability, where requirement ID is a unique identifier assigned to the requirement, requirement description refers to brief description of the requirement discussed. Design specification entails list of the components/classes/algorithm where the requirement is addressed. Code represents the name of the file where this functionality is developed. Test ID represent the ID of the testcase documenting test data and procedure.
Make sure that the list is complete and consistent with requirements mentioned in SRS

Requirement
ID	Requirement
Description	Design Specification	Code	Test ID
R1	Recommend
Course to the user	Component
“Recommend”	Course.aspx	UTI


8.4.	Conclusion
The Skin Treatment Appointment System successfully fulfills all the objectives defined at the start of the project. It provides secure authentication, appointment booking, prescription management, e-commerce functionality, payment integration, rider management, and notification services. The system improves efficiency, reduces manual work, and enhances user experience for patients, doctors, admins, and riders.
 
8.5.	Future Work
In future enhancements of the Skin Treatment Appointment System, a laboratory test and diagnostic module can be added to improve patient care. This feature will allow patients to book lab tests directly through the system and view their test results online.
Additional future improvements include:
	Integration of AI-based skin disease detection using uploaded images.
	Adding a laboratory module for booking tests and viewing reports.
	Real-time chat system between patient and doctor.
	Advanced analytics dashboard for doctors to track patient history.
 
References  
References
1.	World Wide Web
•	Meta Platforms Inc., "React Documentation,". Available: https://react.dev/.  
•	System Design Specification (SDS) "YouTube lecture used to understand Software / System Design Specification". Available: https://www.youtube.com/watch?v=hOH7eD9NJgY . 
•	Class Diagram (UML), "YouTube tutorial used to learn UML Class Diagrams". Available: https://www.youtube.com/watch?v=6XrL5jXmTwM .  
•	Component Diagram, "YouTube tutorial used to understand Component Diagrams". Available: https://youtu.be/CW9Ts2qLfEI?si=QXdUxthCEo-fcigr . 
•	Sequence Diagram, "YouTube tutorial used to learn Sequence Diagrams using draw.io". Available: https://www.youtube.com/watch?v=rsTWufuP328 . 
•	OpenJS Foundation, "Node.js Documentation,". Available: https://nodejs.org/en/docs/.  
•	MongoDB Inc., "MongoDB Manual,". Available: https://www.mongodb.com/docs/manual/.  
•	The guide for using Mongoose with a database., "Mongoose Documentation," Available: https://mongoosejs.com/docs/.  
•	Auth0, "Introduction to JSON Web Tokens,". Available: https://jwt.io/introduction.  
•	Draw.io User Manual for UML Diagrams. Available: https://www.drawio.com/. 


