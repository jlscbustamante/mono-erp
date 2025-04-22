import { recipeRepository } from "../repository/recipe.repository.ts";
import { CreateBaseRecipeDto, CreateFinalRecipeDto, CreateFlavorWithIngredientsDto } from "../interfaces/recipe.dto.ts";

export const recipeService = {
  async createFinalRecipe(data: CreateFinalRecipeDto) {
    await recipeRepository.insertFinalRecipe(data);
  },

  async createBaseRecipe(data: CreateBaseRecipeDto) {
    await recipeRepository.insertBaseRecipe(data)
  },
  
  async createFlavorWithIngredients(data: CreateFlavorWithIngredientsDto) {
    await recipeRepository.insertFlavorWithIngredients(data)
  },
  
  async getBaseRecipesBySize(sizeId: number) {
    return await recipeRepository.getBaseRecipesBySize(sizeId)
  },
  
  async getActiveFlavors() {
    return await recipeRepository.getActiveFlavors()
  },
  async getActiveFinalRecipes() {
    return await recipeRepository.getActiveFinalRecipesGrouped()
  }
};
