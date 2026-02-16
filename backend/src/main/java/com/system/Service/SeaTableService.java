package com.system.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.system.Model.Entry;
import com.system.Model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * SeaTableService
 * Handles all communication with the SeaTable Cloud API.
 * Responsible for:
 * - User authentication
 * - Fetching late entry records
 * - Creating new late entry records
 */
@Service
public class SeaTableService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${seatable.base.url}")
    private String seaTableBaseUrl;

    @Value("${seatable.api.token}")
    private String seaTableApiToken;

    // Table names in SeaTable
    private static final String USERS_TABLE = "Users";
    private static final String ENTRIES_TABLE = "Entries";

    public SeaTableService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Authenticates a user against the SeaTable Users table.
     * @param username The username
     * @param password The password
     * @return User object if authenticated, null otherwise
     */
    public User authenticate(String username, String password) {
        try {
            // Build the URL to query the Users table
            String url = seaTableBaseUrl + "/dtable-db/" + USERS_TABLE + "/?token=" + seaTableApiToken;

            // Create request body for filtering
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("filter", "username = \"" + username + "\" and password = \"" + password + "\"");
            requestBody.put("limit", 1);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode rows = rootNode.path("rows");

                if (rows.isArray() && rows.size() > 0) {
                    JsonNode userRow = rows.get(0);
                    User user = new User();
                    user.setUsername(userRow.path("username").asText());
                    user.setPassword(password); // Set the password (for session)
                    user.setRole(userRow.path("role").asText("STAFF"));
                    return user;
                }
            }
        } catch (Exception e) {
            System.err.println("Authentication error: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Fetches all late entry records from SeaTable.
     * @return List of Entry objects
     */
    public List<Entry> getAllEntries() {
        List<Entry> entries = new ArrayList<>();
        try {
            String url = seaTableBaseUrl + "/dtable-db/" + ENTRIES_TABLE + "/?token=" + seaTableApiToken;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> request = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, request, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode rows = rootNode.path("rows");

                if (rows.isArray()) {
                    for (JsonNode row : rows) {
                        Entry entry = new Entry();
                        entry.setId(row.path("_id").asText());
                        entry.setName(row.path("name").asText());
                        entry.setRollNo(row.path("roll_no").asText());
                        entry.setDept(row.path("dept").asText());
                        entry.setYear(row.path("year").asText());
                        entry.setClassName(row.path("class").asText());
                        entry.setTransport(row.path("transport").asText());
                        entry.setReason(row.path("reason").asText());
                        entry.setTime(row.path("time").asText());
                        entry.setRecordedBy(row.path("recorded_by").asText());
                        entries.add(entry);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching entries: " + e.getMessage());
            e.printStackTrace();
        }
        return entries;
    }

    /**
     * Creates a new late entry record in SeaTable.
     * @param entry The Entry object to create
     * @return true if successful, false otherwise
     */
    public boolean createEntry(Entry entry) {
        try {
            String url = seaTableBaseUrl + "/dtable-db/" + ENTRIES_TABLE + "/?token=" + seaTableApiToken;

            // Set the time on the server side
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            entry.setTime(LocalDateTime.now().format(formatter));

            // Create the row data
            Map<String, Object> rowData = new HashMap<>();
            rowData.put("name", entry.getName());
            rowData.put("roll_no", entry.getRollNo());
            rowData.put("dept", entry.getDept());
            rowData.put("year", entry.getYear());
            rowData.put("class", entry.getClassName());
            rowData.put("transport", entry.getTransport());
            rowData.put("reason", entry.getReason());
            rowData.put("time", entry.getTime());
            rowData.put("recorded_by", entry.getRecordedBy());

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("row", rowData);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            System.err.println("Error creating entry: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
