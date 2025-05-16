
export const getCompanies = async (): Promise<{ id: string; title: string }[]> => {
//   return baseUrl('api/view/recipe/catalog-sales/companies', {
//     method: 'GET',
//     useV2: true,
//   })

return [
    { id: 'PIZZARAUL', title: 'Pizza Raúl' },
    { id: 'STEAKHOUSE', title: 'Steakhouse' }
  ]
}

export const getCategories = async (): Promise<{ id: number; category: string }[]> => {
//   return baseUrl('api/view/recipe/catalog-sales/categories', {
//     method: 'GET',
//     useV2: true,
//   })

return [
    { id: 1, category: 'Promociones' },
    { id: 2, category: 'Clásicas' },
    { id: 3, category: 'Especiales' }
  ]
}
