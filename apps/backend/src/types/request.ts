export enum RequestType {
  Simple = 'S',
  Transfer = 'T',
  Liquidation = 'L',
  Supplier = 'U',
}

export enum RequestAccountFlow {
  In = 'I',
  Out = 'S',
}

export enum RequestCategoryType {
  Category = 'T',
  Cash = 'J',
}

export enum RequestStatus {
  Pending = 'P',
  Approved = 'A',
  Rejected = 'R',
  Closed = 'C',
  Registered = 'T',
}
