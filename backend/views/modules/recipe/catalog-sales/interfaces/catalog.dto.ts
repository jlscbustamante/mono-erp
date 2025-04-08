export interface CreateProductDto {
    company_id: string;
    product: string;
    menuprod_id: number;
  }
  
  export interface CreateFlavorDto {
    company_id: string;
    flavor: string;
    menuflav_id: number;
  }
  
  export interface CreateSizeDto {
    company_id: string;
    size: string;
    factor?: number;
    is_ref?: boolean;
    menusize_id: number;
  }
  