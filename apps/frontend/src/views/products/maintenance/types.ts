export interface IBrand {
  id: number
  brand: string
  code: string
  status: 1 | 0 | '1' | '0'
}

export interface ICategory {
  id: number
  category: string
  status: 1 | 0 | '1' | '0'
}

export interface IPresentation {
  id: number
  presentation: string
  status: 1 | 0 | '1' | '0'
}

export interface IMeasure {
  id: number
  measure: string
  code: string
  status: 1 | 0 | '1' | '0'
}

export interface Equivalence {
  id: number
  presentation_from: number
  measure_to: number
  value_from: number
  value_factor: number
  status: 0 | 1
  presentation: {
    id: number
    presentation: string
  }
  measure: {
    id: number
    measure: string
  }
}
