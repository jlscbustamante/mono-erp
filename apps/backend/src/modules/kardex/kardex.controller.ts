import { Get } from "../../utils/decorators/endpoint.middleware";
import { KardexService } from "./kardex.service";

export class KardexController {
  constructor(private readonly kardexService: KardexService){}

  @Get('/kardex')
  async kardex(){
    return this.kardexService.kardex()
  }
}