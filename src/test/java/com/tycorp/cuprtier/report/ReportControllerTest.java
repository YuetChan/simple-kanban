package com.tycorp.cuprtier.report;

import com.tycorp.cuprtier.core.AppConfig;
import com.tycorp.cuprtier.request.Request;
import com.tycorp.cuprtier.user.UploadQuota;
import com.tycorp.cuprtier.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {AppConfig.class})
@AutoConfigureMockMvc
public class ReportControllerTest {
   @Autowired
   private MockMvc mockMvc;
   @Autowired
   private ReportController reportController;

   @MockBean
   private ReportRepository reportRepository;

   @Test
   public void shouldReturnNoContentWhenUpdateReportByIdWithCorrectId() throws Exception {
      Mockito.when(reportRepository.findById("53a08151-6820-47df-9272-7ac8d7012460")).thenReturn(Optional.of(new Report()));
      Mockito.when(reportRepository.save(Mockito.any())).thenReturn(new Report());

      mockMvc.perform(patch("/reports/" + "53a08151-6820-47df-9272-7ac8d7012460")
                      .contentType(MediaType.APPLICATION_JSON)
                      .content("{\n" +
                              "    \"data\": {\n" +
                              "        \"report\": {\n" +
                              "            \"analysis\": {\n" +
                              "                \"entrepreneurship\": \"\",\n" +
                              "                \"physique\": \"\",\n" +
                              "                \"nonUtilCraftmanship\": \"\",\n" +
                              "                \"utilCraftmanship\": \"\",\n" +
                              "                \"bonus\": \"\"\n" +
                              "            },\n" +
                              "            \"score\": {\n" +
                              "                \"entrepreneurship\": 2,\n" +
                              "                \"physique\": 4,\n" +
                              "                \"nonUtilCraftmanship\": 1,\n" +
                              "                \"utilCraftmanship\": 2,\n" +
                              "                \"bonus\": 1\n" +
                              "            }\n" +
                              "        }\n" +
                              "    }\n" +
                              "}"))
              .andExpect(status().isNoContent());
   }

   @Test
   public void shouldReturnNoContentWhenUpdateReportByIdWithInCorrectId() throws Exception {
      Mockito.when(reportRepository.findById("wrong_53a08151-6820-47df-9272-7ac8d7012460")).thenReturn(Optional.empty());

      mockMvc.perform(patch("/reports/" + "wrong_53a08151-6820-47df-9272-7ac8d7012460")
                      .contentType(MediaType.APPLICATION_JSON)
                      .content("{\n" +
                              "    \"data\": {\n" +
                              "        \"report\": {\n" +
                              "            \"analysis\": {\n" +
                              "                \"entrepreneurship\": \"\",\n" +
                              "                \"physique\": \"\",\n" +
                              "                \"nonUtilCraftmanship\": \"\",\n" +
                              "                \"utilCraftmanship\": \"\",\n" +
                              "                \"bonus\": \"\"\n" +
                              "            },\n" +
                              "            \"score\": {\n" +
                              "                \"entrepreneurship\": 2,\n" +
                              "                \"physique\": 4,\n" +
                              "                \"nonUtilCraftmanship\": 1,\n" +
                              "                \"utilCraftmanship\": 2,\n" +
                              "                \"bonus\": 1\n" +
                              "            }\n" +
                              "        }\n" +
                              "    }\n" +
                              "}"))
              .andExpect(status().isNotFound());
   }
}
