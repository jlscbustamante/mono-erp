import { TemplateService } from "#app/modules/inventory/case/template.service.ts";
import { DispatchOrder } from "./case/dispatch-order.ts";
import { DividerDispatchService } from "./case/divider-dispatch.service.ts";

export const dividerDispatchService = new DividerDispatchService();
export const templateService = new TemplateService();

export const dispatchOrderUC = new DispatchOrder();
