/**
 * LATE COMER MANAGEMENT SYSTEM - DATABASE SCHEMA BLUEPRINT
 * * Note: SeaTable uses a web interface for table creation. 
 * This SQL-styled schema serves as the technical reference for 
 * field names and data types required by the Java Backend.
 */

-- 1. Table: Users
-- Purpose: Authentication and Role-Based Access Control (RBAC)
CREATE TABLE Users (
    username VARCHAR(50) PRIMARY KEY, -- SeaTable Type: Text
    password VARCHAR(255) NOT NULL,   -- SeaTable Type: Text
    role VARCHAR(20) DEFAULT 'STAFF'  -- SeaTable Type: Single Select (Options: ADMIN, STAFF)
);

-- Initial Admin Seed Data for SeaTable
-- Username: admin | Password: password123 | Role: ADMIN

-- 2. Table: Entries
-- Purpose: Logging and tracking student tardiness records
CREATE TABLE Entries (
    _id AUTO_INCREMENT,               -- SeaTable Type: Auto-number (Default field)
    name VARCHAR(100) NOT NULL,       -- SeaTable Type: Text
    roll_no VARCHAR(20) NOT NULL,     -- SeaTable Type: Text
    dept VARCHAR(50),                 -- SeaTable Type: Single Select
    year VARCHAR(20),                 -- SeaTable Type: Single Select
    class VARCHAR(10),                -- SeaTable Type: Text (Section e.g., 'A')
    transport VARCHAR(50),            -- SeaTable Type: Single Select
    reason TEXT,                      -- SeaTable Type: Long Text
    time DATETIME,                    -- SeaTable Type: Date (Format: YYYY-MM-DD HH:mm)
    recorded_by VARCHAR(50)           -- SeaTable Type: Text (References Users.username)
);

/**
 * SEATABLE SETUP INSTRUCTIONS:
 * ----------------------------
 * 1. Create a Base named "Late Comer Management System".
 * 2. Create Table 1: "Users"
 * - Rename default columns to match the names above.
 * 3. Create Table 2: "Entries"
 * - Rename default columns to match the names above.
 * - Ensure 'dept', 'year', and 'transport' are 'Single Select' types 
 * to match the Frontend dropdown options.
 * 4. Generate the API Token (Read/Write) from the Base settings.
 */