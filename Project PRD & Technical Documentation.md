# **Product Requirement Document (PRD)**

## **Project: Late Comer Management System (Enterprise Edition)**

### **1\. Project Overview**

The Late Comer Management System is a robust web application designed for campus security. It utilizes a Java-based middleware to provide secure, authenticated access to a SeaTable cloud database, allowing for real-time tracking and reporting of student tardiness.

### **2\. Technical Architecture**

#### **2.1 Front-End**

* **Framework:** Vanilla JavaScript (ES6+).  
* Styling: Tailwind CSS (via CDN) for responsive UI.  
* Design Pattern: Single Page Application (SPA) architecture using state-driven rendering.  
* Connectivity: Communicates with the Java Backend via RESTful API calls using the fetch API.

#### **2.2 Back-End (Middleware)**

* Language: Java 17+.  
* Framework: Spring Boot.  
* Purpose: \* Security: To hide the SeaTable API Token from the client-side.  
  * Data Validation: Sanitizing student inputs before storage.  
  * Auth: Handling session management and credential verification.  
* Connectivity: Acts as a bridge, performing server-to-server requests to SeaTable Cloud API.

#### **2.3 Database (SeaTable Cloud)**

* Storage: SeaTable Base (Cloud Hosting).  
* Tables:  
  * Users: Admin credentials (username, password, role).  
  * Entries: Late records (name, roll\_no, dept, year, class, transport, reason, time, recorded\_by).

### **3\. Core Features**

| Feature | Technical Implementation |
| :---- | :---- |
| Secure Login | Frontend sends credentials to Java /api/auth; Java verifies against SeaTable. |
| Late Entry Log | Form submission via POST to Java /api/entries. |
| Data Persistence | Java backend pushes validated JSON objects to SeaTable rows. |
| Real-time View | GET request to Java /api/entries returns sorted record history. |
| Report Export | Browser-side PDF generation of the filtered log table. |

### **4\. Project File Tree Structure**

LateComerProject/  
├── backend/ (Java Spring Boot)  
│   ├── src/main/java/com/system/  
│   │   ├── Controller/        \# REST Endpoints (AuthController, EntryController)  
│   │   ├── Service/           \# SeaTable API Logic (SeaTableService)  
│   │   ├── Model/             \# Data Objects (User, Entry)  
│   │   └── LateComerApp.java  \# Main Application Entry  
│   └── src/main/resources/  
│       └── application.properties \# API Tokens & SeaTable Config  
├── frontend/ (Web Portal)  
│   ├── index.html             \# UI Structure & Tailwind Styling  
│   └── app.js                 \# Frontend Logic & Backend API Calls  
└── database/  
    └── schema.sql             \# Reference for SeaTable Table Headers

### **5\. Connectivity Workflow**

1. Request: User clicks "Submit Entry".  
2. Frontend: fetch('http://localhost:8080/api/entries', { method: 'POST', body: data }).  
3. Backend (Java): Receives request, adds server-side timestamp, attaches the Secret API Token to the header.  
4. Database (SeaTable): Receives authorized request from Java and stores the row.  
5. Response: Java confirms success to Frontend; Frontend updates the UI list.

### **6\. Roadmap**

1. Phase 1: Setup SeaTable Tables and Java Spring Boot skeleton.  
2. Phase 2: Implement Java-to-SeaTable API integration.  
3. Phase 3: Build Responsive Frontend and connect to Java API.  
4. Phase 4: Deploy Backend to cloud and test real-time synchronization.