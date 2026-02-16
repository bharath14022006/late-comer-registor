package com.system.Controller;

import com.system.Model.Entry;
import com.system.Service.SeaTableService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * EntryController
 * Handles entry management endpoints.
 * - GET /api/entries - Get all late entry records
 * - POST /api/entries - Create a new late entry record
 */
@RestController
@RequestMapping("/api/entries")
public class EntryController {

    private final SeaTableService seaTableService;

    public EntryController(SeaTableService seaTableService) {
        this.seaTableService = seaTableService;
    }

    /**
     * GET /api/entries
     * Retrieves all late entry records.
     * @return List of Entry objects
     */
    @GetMapping
    public ResponseEntity<List<Entry>> getAllEntries() {
        List<Entry> entries = seaTableService.getAllEntries();
        return ResponseEntity.ok(entries);
    }

    /**
     * POST /api/entries
     * Creates a new late entry record.
     * @param entryData Map containing entry data from request body
     * @return Success or error response
     */
    @PostMapping
    public ResponseEntity<?> createEntry(@RequestBody Map<String, String> entryData) {
        // Validate required fields
        if (entryData.get("name") == null || entryData.get("name").isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Name is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        if (entryData.get("roll_no") == null || entryData.get("roll_no").isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Roll number is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Create Entry object from request data
        Entry entry = new Entry();
        entry.setName(entryData.get("name"));
        entry.setRollNo(entryData.get("roll_no"));
        entry.setDept(entryData.get("dept"));
        entry.setYear(entryData.get("year"));
        entry.setClassName(entryData.get("class"));
        entry.setTransport(entryData.get("transport"));
        entry.setReason(entryData.get("reason"));
        entry.setRecordedBy(entryData.get("recorded_by"));

        boolean success = seaTableService.createEntry(entry);

        if (success) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Entry recorded successfully");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to save entry to SeaTable");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
