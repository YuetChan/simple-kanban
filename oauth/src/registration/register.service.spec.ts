import { DeepMocked } from "@golevelup/ts-jest";
import { Test, TestingModule } from "@nestjs/testing";

import { RegisterService } from "./register.service";

describe("RegistrationService", () => {
    let module: TestingModule;
    
    let registerService: DeepMocked<RegisterService>;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [ RegisterService ],
        }).compile();

        registerService = module.get(RegisterService);
    });

    it("should be defined", () => {
        expect(registerService).toBeDefined();
    });
});