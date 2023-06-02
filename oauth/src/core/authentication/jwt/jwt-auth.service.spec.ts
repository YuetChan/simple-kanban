import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";

import { createMock, DeepMocked } from "@golevelup/ts-jest";

import { RegisterService } from "../../../registration/register.service";
import { JwtAuthService, LoginType } from "./jwt-auth.service";

describe("JwtAuthService", () => {
    let module: TestingModule;

    let jwtAuthService: JwtAuthService;
    let registerService: DeepMocked<RegisterService>;
    let jwtService: DeepMocked<JwtService>

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [
                JwtAuthService,
                {
                    provide: RegisterService,
                    useValue: createMock<RegisterService>(),
                },
                {
                    provide: JwtService,
                    useValue: createMock<JwtService>(),
                }
            ],
        }).compile();

        jwtAuthService = module.get<JwtAuthService>(JwtAuthService);
        registerService = module.get(RegisterService);
        jwtService = module.get(JwtService)
    });

    it("should be defined", () => {
        expect(jwtAuthService).toBeDefined();
    });

    describe("getJwt", () => {
        it("should return jwt for registered user", async () => {
            registerService.register.mockResolvedValueOnce({
                id: "dummy-id",
                email: "yuetchany@gmail.com", 
                name: "yuetchany",
                role: "user"
            });

            jwtService.sign = jest.fn((
                payload
            ) => {
                let p = payload as {
                    provider: string,

                    id: string,
                    email: string,
                    name: string
                }

                if(p.provider === "google" 
                    && p.id === "dummy-id" 
                    && p.email === "yuetchany@gmail.com" 
                    && p.name === "yuetchany") {
                    return "signed"
                }

                return "unsigned"
            });

            expect(await jwtAuthService.getJwt({
                provider: "google", 
                email: "yuetchany@gmail.com", 
                name: "yuetchany"
            }, LoginType.GOOGLE)).toBe("signed");
        });

        it("should return jwt for unregistered user", async () => {
            registerService.register.mockResolvedValueOnce({
                id: "dummy-id",
                email: "yuetchany@gmail.com", 
                name: "yuetchany",
                role: "user"
            });

            jwtService.sign = jest.fn((
                payload
            ) => {
                let p = payload as {
                    provider: string,

                    id: string,
                    email: string,
                    name: string
                }

                if(p.provider === "google" 
                    && p.id === "dummy-id" 
                    && p.email === "yuetchany@gmail.com" 
                    && p.name === "yuetchany") {
                    return "signed"
                }

                return "unsigned"
            });

            expect(await jwtAuthService.getJwt({
                provider: "google", 
                email: "yuetchany@gmail.com", 
                name: "yuetchany"
            }, LoginType.GOOGLE)).toBe("signed");
        });
    });
});
