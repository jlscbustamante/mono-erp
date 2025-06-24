export interface IListaInsumo {
  item_id: number;
  item_name: string;
  category_id: number;
  category_name: string;
  product_id: number;
  product_name: string;
  recipe_req: number;
  recollect_id: number;
  collection_name: string;
}

export interface IItem {
  id: number;
  item_name: string;
  status: number;
}
