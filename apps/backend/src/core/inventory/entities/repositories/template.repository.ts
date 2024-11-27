import { Item } from '../item'
import { Template } from '../template'
import { TemplateItem } from '../template_item'

export interface TemplateRepository {
  getDynamicTemplate(warehouseCode: string): Promise<Template>
  getDynamicStockTemplate(
    warehouseCode: string,
  ): Promise<{ template: Item[]; isWarehouse: boolean }>

  getTemplates(): Promise<{ store: TemplateItem[]; warehouse: TemplateItem[] }>
  getTemplate(isWarehouse: boolean): Promise<TemplateItem[]>
  getItemsTemplate(isWarehouse: boolean): Promise<Item[]>
}
