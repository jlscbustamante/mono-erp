import { NextFunction, Request, Response } from 'express'
/*import { Account } from '../entities/Account'
import { Category } from '../entities/Category'
import { CategoryType } from '../entities/CategoryType'
import { AccountRepository } from '../repositories/account.repository'
*/

//const categoryService = new CategoryService(categoryRepository)

export class CategoryController {
  async getFilteredCategory(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.body //as Filters3<Category>

      // const requests = await categoryService.getFilteredTypeNt(queries)
      /*
      const { data: requests } = await categoryRepository.filter3({
        select: {
          categoryType: {
            name: true,
          },
          account: {
            account: true,
          },
        },
        filters: queries,
        relations: {
          categoryType: true,
          account: true,
        },
      })

      */
      const result = await db.entityManager.query(
        'select id, email, name from users where id=?',
        [id],
      )

      response.json(requests)
    } catch (err) {
      next(err)
    }
  }
}
