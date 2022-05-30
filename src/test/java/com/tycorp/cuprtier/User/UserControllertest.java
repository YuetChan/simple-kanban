package com.tycorp.cuprtier.User;

import com.tycorp.cuprtier.core.AppConfig;
import com.tycorp.cuprtier.user.User;
import com.tycorp.cuprtier.user.UserController;
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
public class UserControllertest {
   @Autowired
   private MockMvc mockMvc;
   @Autowired
   private UserController userController;

   @MockBean
   private UserRepository userRepository;

   @Test
   public void shouldReturnCreatedWhenCreateUserWithNonExistingEmail() throws Exception {
      Mockito.when(userRepository.findByEmail("yuetcheukchan@gmail.com")).thenReturn(Optional.empty());

      User newUser = new User();
      newUser.setId("55171a20-010a-4096-8ea2-2a15a896c7b4");

      Mockito.when(userRepository.save(Mockito.any())).thenReturn(newUser);

      mockMvc.perform(post("/users/")
                      .contentType(MediaType.APPLICATION_JSON)
                      .content("{\n" +
                              "    \"data\": {\n" +
                              "        \"user\": {\n" +
                              "            \"email\": \"yuetcheukchan@gmail.com\",\n" +
                              "            \"uploadQuota\": {\n" +
                              "                \"lastUpdatedAt\": \"0\",\n" +
                              "                \"full\": false\n" +
                              "            }\n" +
                              "        }\n" +
                              "    }\n" +
                              "}"))
              .andExpect(status().isCreated());
   }

   @Test
   public void shouldReturnConflictWhenCreateUserWithExistingEmail() throws Exception {
      User existingUser = new User();
      existingUser.setId("55171a20-010a-4096-8ea2-2a15a896c7b4");
      Mockito.when(userRepository.findByEmail("yuetcheukchan@gmail.com")).thenReturn(Optional.of(existingUser));

      mockMvc.perform(post("/users/")
                      .contentType(MediaType.APPLICATION_JSON)
                      .content("{\n" +
                              "    \"data\": {\n" +
                              "        \"user\": {\n" +
                              "            \"email\": \"yuetcheukchan@gmail.com\",\n" +
                              "            \"uploadQuota\": {\n" +
                              "                \"lastUpdatedAt\": \"0\",\n" +
                              "                \"full\": false\n" +
                              "            }\n" +
                              "        }\n" +
                              "    }\n" +
                              "}"))
              .andExpect(status().isConflict());
   }
}
