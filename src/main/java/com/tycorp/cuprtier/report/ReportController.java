package com.tycorp.cuprtier.report;

import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.tycorp.cuprtier.core.util.GsonHelper;

import com.tycorp.cuprtier.request.Request;
import com.tycorp.cuprtier.request.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/reports")
public class ReportController {
   private ResponseEntity NOT_FOUND_RES = new ResponseEntity(HttpStatus.NOT_FOUND);

   @Autowired
   private ReportRepository reportRepository;
   @Autowired
   private RequestRepository requestRepository;
   
   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> getReportById(@PathVariable(value = "id") String id) {
      Optional<Report> reportMaybe = reportRepository.findById(id);
      if(reportMaybe.isPresent()) {
         Report report = reportMaybe.get();

         JsonObject dataJson = new JsonObject();
         dataJson.add(
                 "report",
                 GsonHelper.getExposeSensitiveGson().toJsonTree(report, Report.class));

         JsonObject resJson = new JsonObject();
         resJson.add("data", dataJson);

         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }else {
         return NOT_FOUND_RES;
      }
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "/censored", produces = "application/json")
   public ResponseEntity<String> getCensoredReportByRequestId(@RequestParam(value = "requestId") String requestId) {
      Optional<Request> requestMaybe = requestRepository.findById(requestId);
      if(requestMaybe.isPresent()) {
         Request request = requestMaybe.get();
         Report report = request.getReport();

         report.calculateFinalScore();
         report.censorReport();

         JsonObject dataJson = new JsonObject();
         dataJson.add(
                 "report",
                 GsonHelper.getExposeSensitiveGson().toJsonTree(report, Report.class));

         JsonObject resJson = new JsonObject();
         resJson.add("data", dataJson);

         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }else {
         return NOT_FOUND_RES;
      }
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> getAllReports(@RequestParam(value = "sortBy") String sortBy,
                                               @RequestParam(value = "page", defaultValue = "0") int start,
                                               @RequestParam(value = "pageSize", defaultValue = "40") int size) {
      var sortby = sortBy.equals("asc") ? Sort.by("updatedAt").ascending() : Sort.by("updatedAt").descending();

      Page<Report> page = reportRepository.findAll(PageRequest.of(start, size, sortby));
      List<Report> reports = page.getContent();

      Type reportListType = new TypeToken<ArrayList<Report>>() {}.getType();

      JsonObject dataJson = new JsonObject();
      dataJson.add(
              "reports",
              GsonHelper.getExposeSensitiveGson().toJsonTree(reports, reportListType));
      dataJson.addProperty("totalPage", page.getTotalPages());

      JsonObject resJson = new JsonObject();
      resJson.add("data", dataJson);

      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @PatchMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> updateReportById(@PathVariable(name = "id") String id,
                                                  @RequestBody String reqJsonStr) {
      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);
      JsonObject reportJson = dataJson.get("report").getAsJsonObject();

      Optional<Report> reportMaybe = reportRepository.findById(id);
      if(reportMaybe.isPresent()) {
         Report newReport = GsonHelper.getExposeSensitiveGson().fromJson(reportJson, Report.class);
         Report oldReport = reportMaybe.get();

         oldReport.setAnalysis(newReport.getAnalysis());
         oldReport.setScore(newReport.getScore());

         oldReport.setUpdatedAt(System.currentTimeMillis());

         oldReport = reportRepository.save(oldReport);

         return new ResponseEntity(HttpStatus.NO_CONTENT);
      }else {
         return NOT_FOUND_RES;
      }
   }
}
