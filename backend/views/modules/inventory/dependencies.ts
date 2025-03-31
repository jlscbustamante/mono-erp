import { DispatchOrderById } from "./case/dispatch_order.ts";
import { TemplateService } from "#app/modules/inventory/case/template.service.ts";
import { DividerDispatchService } from "./case/divider-dispatch.service.ts";

export const dividerDispatchService = new DividerDispatchService();
export const templateService = new TemplateService();

export const dispatch_order_by_id_uc = new DispatchOrderById();
