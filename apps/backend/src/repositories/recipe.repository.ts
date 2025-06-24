import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { Recipe } from '../entities/Recipe'
//import { CategoryStatus, CategoryTypeId } from '../types/Recipe'

export interface RecipeRepository extends Repository<Recipe> {
  //filterNt(filters: EnvFilters<Recipe>): Promise<Recipe[]>
  //filter3: Filter3Method<Recipe>
  //forStore(): Promise<Recipe[]>
}

const recipeRepository = AppDataSource.getRepository(Recipe).extend({
  /*
  
  filter3: async function (_filters: IUserFilter3<Recipe>) {
    const { select, filters, order, relations } = _filters

    const whereBuilded = filters3Adapter(filters)
    let finalWhere: any
    if (whereBuilded.account_id) {
      finalWhere = [whereBuilded]
      const newWhere = Object.assign({}, whereBuilded)
      delete newWhere.account_id
      const secondOr = {
        ...newWhere,
        account: { ...filters3Adapter({ account: filters.account_id }) },
      }
      finalWhere.push(secondOr)
    }
    //console.log(finalWhere ? finalWhere : whereBuilded)

    const [products] = await this.findAndCount({
      select,
      where: finalWhere ? finalWhere : whereBuilded,
      order,
      relations,
    })

    return { data: products }
  },
  */
})

export default recipeRepository as unknown as RecipeRepository
