import { createApp } from "../../utils/decorators/endpoint.middleware";
import { kardexRepository } from "../repositories";
import { KardexController } from "./kardex.controller";
import { KardexService } from "./kardex.service";



const service=new KardexService(kardexRepository)
const controller=new KardexController(service)

createApp(KardexController,controller)