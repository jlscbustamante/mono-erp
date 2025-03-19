export interface SummaryItem {
  title: string;
  total: number;
}
export interface SummaryBox {
  initial: number;
  final: number;
  list: SummaryItem[];
}
