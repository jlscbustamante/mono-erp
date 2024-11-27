export interface ItemEfis {
  /**
   * @description Codigo de la tienda(efisis)
   */
  tien_cod: string

  fecha: string

  /**
   * @description Numero de despacho(erp)
   */
  numero: number

  /**
   * @description idk, preguntar sergio
   */
  item: number

  /**
   * @description Codigo del item(efisis)
   */
  codigo: number

  /**
   * @description Codigo de la unidad(efisis)(exm:UND)
   */
  unid_cod: string

  /**
   * @description factor de la medida(idk)
   */
  factor: number

  peso: number

  /**
   * @description Costo
   */
  costo: number

  importe: number
}
