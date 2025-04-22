import { catalogRepository } from "../repository/catalog.repository.ts";
import type {
  CreateProductDto,
  CreateFlavorDto,
  CreateSizeDto,
  SyncProductWithSizesAndFlavorsDto,
} from "../interfaces/catalog.dto.ts";

export const catalogService = {
  async addProduct(data: CreateProductDto) {
    // (Opcional: validar si ya existe por company_id + menuprod_id)
    await catalogRepository.insertProduct(data);
  },

  async addFlavor(data: CreateFlavorDto) {
    await catalogRepository.insertFlavor(data);
  },

  async addSize(data: CreateSizeDto) {
    await catalogRepository.insertSize(data);
  },

  getProductsFromDB() {
    return catalogRepository.getActiveProducts();
  },

  getFlavorsFromDB(){
    return catalogRepository.getActiveFlavors();
  },

  getSizesFromDB(){
    return catalogRepository.getActiveSizes();
  },

  addManyProducts: (data: CreateProductDto[]) => {
    catalogRepository.insertManyProducts(data)
  },

  addManyFlavors: (data: CreateFlavorDto[]) => {
    catalogRepository.insertManyFlavors(data)
  },
  
  addManySizes: (data: CreateSizeDto[]) => {
    catalogRepository.insertManySizes(data)
  },
  
  async addmanyProductsWithSizesAndFlavors(data: SyncProductWithSizesAndFlavorsDto[]) {
   return await catalogRepository.insertManyProductsWithSizesAndFlavors(data)
  },

  async addProductWithSizesAndFlavors(data: SyncProductWithSizesAndFlavorsDto) {
    return await catalogRepository.insertProductWithSizesAndFlavors(data)
  } 
};
