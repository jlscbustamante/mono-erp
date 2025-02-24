import { StockRepository } from "./stock.repository.ts";
import { TemplateRepository } from "./template.repository.ts";

export const templateRepository = new TemplateRepository();
export const stockRepository = new StockRepository();
