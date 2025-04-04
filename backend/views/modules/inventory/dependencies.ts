import { ResetDispatch } from "#app/modules/inventory/case/reset_dispatch.ts";
import { TemplateService } from "#app/modules/inventory/case/template.service.ts";
import { DispatchOrderById } from "./case/dispatch_order.ts";
import { DividerDispatchService } from "./case/divider-dispatch.service.ts";

export const dividerDispatchService = new DividerDispatchService();
export const templateService = new TemplateService();

export const dispatch_order_by_id_uc = new DispatchOrderById();
export const reset_dispatch_uc = new ResetDispatch();
