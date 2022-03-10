import {
  CodificationTable,
  CodificationDictionary,
} from "./interfaces/codification-table";
import { EncodedRankingRow } from "./interfaces/encoded-ranking";
import { RankingRow } from "./interfaces/ranking";

export function createCodificationTable(
  codification: string
): CodificationTable {
  const base = codification.length;
  const dictionary: CodificationDictionary = {};
  for (let i = 0; i < base; i++) {
    dictionary[codification[i]] = i;
  }
  return {
    base,
    dictionary,
  };
}

export function decodeNumber(
  codificationTable: CodificationTable,
  encodedNumber: string
) {
  let result = 0;
  const { base, dictionary } = codificationTable;

  for (let i = 0; i < encodedNumber.length; i++) {
    const currentSymbol = encodedNumber[encodedNumber.length - 1 - i];
    const decodedNumber = dictionary[currentSymbol];
    const value = decodedNumber * Math.pow(base, i);
    result += value;
  }

  return result;
}
