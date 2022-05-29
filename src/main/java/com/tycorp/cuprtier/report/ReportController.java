package com.tycorp.cuprtier.report;

import com.google.gson.JsonObject;
import com.tycorp.cuprtier.core.util.GsonHelper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(value = "/reports")
public class ReportController {
   private ResponseEntity NOT_FOUND_RES = new ResponseEntity(HttpStatus.NOT_FOUND);

   @Autowired
   private ReportRepository reportRepository;
   
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

         return new ResponseEntity(dataJson.toString(), HttpStatus.OK);
      }else {
         return NOT_FOUND_RES;
      }
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
