import { IProduct } from "../types";

export interface CreateProductDto{
    company_id: string,
    product: string,
    menuprod_id: number,
}

export interface UpdateProductDto extends IProduct{

}

export interface CreateProductSizeDto{
    company_id: string,
    size: string,
    menusize_id: number,
}

export interface CreateProductFlavorDto{
    company_id: string,
    flavor: string,
    menuflav_id: number,
}

export interface SyncProductWithSizesAndFlavorsDto{
 product: CreateProductDto,
 flavors?: CreateProductFlavorDto[], 
 sizes?: CreateProductSizeDto[]
}
