package com.system.Model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Entry Model
 * Represents a late entry record in the Late Comer Management System.
 * Maps to the Entries table in SeaTable.
 */
public class Entry {
    
    @JsonProperty("_id")
    private String id;
    
    private String name;
    private String rollNo;
    private String dept;
    private String year;
    private String className;
    private String transport;
    private String reason;
    private String time;
    private String recordedBy;

    // Default constructor
    public Entry() {
    }

    // Constructor with fields
    public Entry(String name, String rollNo, String dept, String year, 
                 String className, String transport, String reason, 
                 String time, String recordedBy) {
        this.name = name;
        this.rollNo = rollNo;
        this.dept = dept;
        this.year = year;
        this.className = className;
        this.transport = transport;
        this.reason = reason;
        this.time = time;
        this.recordedBy = recordedBy;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRollNo() {
        return rollNo;
    }

    public void setRollNo(String rollNo) {
        this.rollNo = rollNo;
    }

    public String getDept() {
        return dept;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getTransport() {
        return transport;
    }

    public void setTransport(String transport) {
        this.transport = transport;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getRecordedBy() {
        return recordedBy;
    }

    public void setRecordedBy(String recordedBy) {
        this.recordedBy = recordedBy;
    }

    @Override
    public String toString() {
        return "Entry{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", rollNo='" + rollNo + '\'' +
                ", dept='" + dept + '\'' +
                ", year='" + year + '\'' +
                ", className='" + className + '\'' +
                ", transport='" + transport + '\'' +
                ", reason='" + reason + '\'' +
                ", time='" + time + '\'' +
                ", recordedBy='" + recordedBy + '\'' +
                '}';
    }
}
