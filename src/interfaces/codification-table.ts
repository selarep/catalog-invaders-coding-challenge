export interface CodificationDictionary {
  [key: string]: number;
}

export interface CodificationTable {
  base: number;
  dictionary: CodificationDictionary;
}
