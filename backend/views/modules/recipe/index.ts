import { Hono } from "hono";


export const recipeRouter = new Hono()
    .get("/finalRecipes/get", (c) => {
        //const finalRecipes = c.req.param("finalRecipes");

 // Dummy data
 const finalRecipes = [
    {
      id: 1,
      name: "Pizza de Pepperoni",
      baseRecipe: {
        id: 101,
        dishType: "Pizza",
        ingredients: [
          { name: "Masa", quantity: 0.2, unit: "kg" },
          { name: "Queso Mozzarella", quantity: 0.15, unit: "kg" },
          { name: "Salsa de Tomate", quantity: 0.1, unit: "l" },
        ],
        status: 1,
        created_at: "2024-03-30T12:00:00Z",
      },
      flavorRecipe: {
        id: 201,
        name: "Pepperoni",
        ingredients: [
          { name: "Pepperoni", quantity: 0.05, unit: "kg" },
          { name: "Orégano", quantity: 1, unit: "unidad" },
        ],
        status: 1,
        created_at: "2024-03-30T12:05:00Z",
      },
      supplies: [
        { name: "Caja", quantity: 1, unit: "unidad" },
        { name: "Servilletas", quantity: 3, unit: "unidad" },
        { name: "Salsa para mojar", quantity: 1, unit: "unidad" },
      ],
      status: 1,
      created_at: "2024-03-30T12:10:00Z",
    },
    {
      id: 2,
      name: "Pizza Hawaiana",
      baseRecipe: {
        id: 102,
        dishType: "Pizza",
        ingredients: [
          { name: "Masa", quantity: 0.2, unit: "kg" },
          { name: "Queso Mozzarella", quantity: 0.15, unit: "kg" },
          { name: "Salsa de Tomate", quantity: 0.1, unit: "l" },
        ],
        status: 1,
        created_at: "2024-03-30T12:15:00Z",
      },
      flavorRecipe: {
        id: 202,
        name: "Hawaiana",
        ingredients: [
          { name: "Jamón", quantity: 0.06, unit: "kg" },
          { name: "Piña", quantity: 0.05, unit: "kg" },
        ],
        status: 1,
        created_at: "2024-03-30T12:20:00Z",
      },
      supplies: [
        { name: "Caja", quantity: 1, unit: "unidad" },
        { name: "Servilletas", quantity: 3, unit: "unidad" },
      ],
      status: 1,
      created_at: "2024-03-30T12:25:00Z",
    },
  ];

  return c.json({ message: "Success", data: finalRecipes });

});
