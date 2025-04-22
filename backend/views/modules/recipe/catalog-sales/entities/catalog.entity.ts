export interface InvProduct {
    id: number;
    company_id: string;
    product: string;
    menuprod_id: number;
    status: number;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface InvProductFlavor {
    id: number;
    company_id: string;
    flavor: string;
    menuflav_id: number;
    status: number;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface InvProductSize {
    id: number;
    company_id: string;
    size: string;
    is_ref: number; // 1 o 0
    factor: number;
    menusize_id: number;
    status: number;
    created_at: Date;
    updated_at: Date;
  }
  