package com.tycorp.cuprtier.request;

import com.tycorp.cuprtier.core.AppConfig;
import com.tycorp.cuprtier.report.Report;
import com.tycorp.cuprtier.report.ReportRepository;
import com.tycorp.cuprtier.user.UploadQuota;
import com.tycorp.cuprtier.user.User;
import com.tycorp.cuprtier.user.UserRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {AppConfig.class})
@AutoConfigureMockMvc
public class RequestControllerTest {
   @Autowired
   private MockMvc mockMvc;
   @Autowired
   private RequestController requestController;

   @MockBean
   private RequestRepository requestRepository;
   @MockBean
   private ReportRepository reportRepository;

   @MockBean
   private UserRepository userRepository;

   @Test
   public void shouldReturnCreatedWhenSubmitRequestWithCorrectPayload() throws Exception {
      Request request = new Request();
      request.setId("0abf81ea-c5f9-40c1-beda-39f9bd7186af");

      Report report = new Report();
      report.setId("53a08151-6820-47df-9272-7ac8d7012460");

      User user = new User();
      user.setId("55171a20-010a-4096-8ea2-2a15a896c7b4");
      user.setEmail("yuetcheukchan@gmail.com");

      UploadQuota quota = new UploadQuota();
      quota.setFull(false);
      user.setUploadQuota(quota);

      Mockito.when(userRepository.findByEmail("yuetcheukchan@gmail.com")).thenReturn(Optional.of(user));

      Mockito.when(requestRepository.save(Mockito.any())).thenReturn(request);
      Mockito.when(reportRepository.save(Mockito.any())).thenReturn(report);

      mockMvc.perform(post("/requests")
                      .contentType(MediaType.APPLICATION_JSON)
                      .content("{\n" +
                              "    \"data\": {\n" +
                              "        \"request\":{\n" +
                              "            \"incomeSituation\": \"test2\",\n" +
                              "            \"skillSet\": \"\",\n" +
                              "            \"physique\": \"\",\n" +
                              "            \"bonus\": \"test2\"\n" +
                              "        },\n" +
                              "        \"email\": \"yuetcheukchan@gmail.com\"\n" +
                              "    }\n" +
                              "}"))
              .andExpect(status().isCreated());
   }

   @Test
   public void shouldReturnBadRequestWhenSubmitRequestWithNonExistingEmail() throws Exception {
      Request request = new Request();
      request.setId("0abf81ea-c5f9-40c1-beda-39f9bd7186af");

      Report report = new Report();
      report.setId("53a08151-6820-47df-9272-7ac8d7012460");

      User user = new User();
      user.setId("55171a20-010a-4096-8ea2-2a15a896c7b4");
      user.setEmail("yuetcheukchan@gmail.com");

      UploadQuota quota = new UploadQuota();
      quota.setFull(false);
      user.setUploadQuota(quota);

      Mockito.when(userRepository.findByEmail("wrong_yuetcheukchan@gmail.com")).thenReturn(Optional.of(user));

      Mockito.when(requestRepository.save(Mockito.any())).thenReturn(request);
      Mockito.when(reportRepository.save(Mockito.any())).thenReturn(report);

      mockMvc.perform(post("/requests")
                      .contentType(MediaType.APPLICATION_JSON)
                      .content("{\n" +
                              "    \"data\": {\n" +
                              "        \"request\":{\n" +
                              "            \"incomeSituation\": \"test2\",\n" +
                              "            \"skillSet\": \"\",\n" +
                              "            \"physique\": \"\",\n" +
                              "            \"bonus\": \"test2\"\n" +
                              "        },\n" +
                              "        \"email\": \"yuetcheukchan@gmail.com\"\n" +
                              "    }\n" +
                              "}"))
              .andExpect(status().isBadRequest());
   }

   @Test
   public void shouldReturnConflictWhenSubmitRequestWithUploadQuotaBeingFull() throws Exception {
      Request request = new Request();
      request.setId("0abf81ea-c5f9-40c1-beda-39f9bd7186af");

      Report report = new Report();
      report.setId("53a08151-6820-47df-9272-7ac8d7012460");

      User user = new User();
      user.setId("55171a20-010a-4096-8ea2-2a15a896c7b4");
      user.setEmail("yuetcheukchan@gmail.com");

      UploadQuota quota = new UploadQuota();
      quota.setFull(true);
      user.setUploadQuota(quota);

      Mockito.when(userRepository.findByEmail("yuetcheukchan@gmail.com")).thenReturn(Optional.of(user));

      Mockito.when(requestRepository.save(Mockito.any())).thenReturn(request);
      Mockito.when(reportRepository.save(Mockito.any())).thenReturn(report);

      mockMvc.perform(post("/requests")
                      .contentType(MediaType.APPLICATION_JSON)
                      .content("{\n" +
                              "    \"data\": {\n" +
                              "        \"request\":{\n" +
                              "            \"incomeSituation\": \"test2\",\n" +
                              "            \"skillSet\": \"\",\n" +
                              "            \"physique\": \"\",\n" +
                              "            \"bonus\": \"test2\"\n" +
                              "        },\n" +
                              "        \"email\": \"yuetcheukchan@gmail.com\"\n" +
                              "    }\n" +
                              "}"))
              .andExpect(status().isConflict());
   }


}
