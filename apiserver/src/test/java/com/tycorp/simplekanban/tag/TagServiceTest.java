package com.tycorp.simplekanban.tag;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
public class TagServiceTest {
   @Spy
   @InjectMocks
   private TagService tagtService;


}
