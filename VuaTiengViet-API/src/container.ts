import {
    GameService,
    JwtService,
    PrismaService,
    SocketGameService
} from "@/services";
import { asClass, createContainer, InjectionMode } from "awilix";
import "dotenv/config";
import Application from "./app";
const container = createContainer({
    injectionMode: InjectionMode.CLASSIC
});

// Register the services
container.register({
    // Register the Services
    Application: asClass(Application).singleton(),
    PrismaService: asClass(PrismaService).singleton(),
    // RedisService: asClass(RedisService).singleton(),
    JwtService: asClass(JwtService).singleton(),
    GameService: asClass(GameService).scoped(),
    SocketGameService: asClass(SocketGameService).singleton()
});
export default container

