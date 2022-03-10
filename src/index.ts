import * as fs from "fs";
import * as readLine from "readline";
import {
  CodificationDictionary,
  CodificationTable,
} from "./interfaces/codification-table";
import {
  EncodedRanking,
  EncodedRankingRow,
} from "./interfaces/encoded-ranking";
import { Ranking, RankingRow } from "./interfaces/ranking";

(async () => {
  const encodedRanking = await parseFile("input.csv");
  console.log(encodedRanking);

  const ranking: Ranking = encodedRanking
    .map(decodeRankingRow)
    .sort(sortRankingByScore);

  console.log(ranking);

  writeRankingToFile(ranking, "output.csv");
})();

async function parseFile(path: string): Promise<EncodedRanking> {
  const result: EncodedRankingRow[] = [];

  const lineReader = readLine.createInterface({
    input: fs.createReadStream(path),
    crlfDelay: Infinity,
  });

  for await (const line of lineReader) {
    result.push(parseLine(line));
  }

  return result;
}

function parseLine(line: string): EncodedRankingRow {
  const splitedLine = line.split(",");
  return {
    username: splitedLine[0],
    codification: splitedLine[1],
    encodedScore: splitedLine[2],
  };
}

function createCodificationTable(codification: string): CodificationTable {
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

function decodeNumber(
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

function decodeRankingRow(row: EncodedRankingRow): RankingRow {
  const codificationTable = createCodificationTable(row.codification);
  const score = decodeNumber(codificationTable, row.encodedScore);
  return {
    username: row.username,
    score,
  };
}

function sortRankingByScore(a: RankingRow, b: RankingRow) {
  if (a.score > b.score) {
    return -1;
  }

  if (a.score < b.score) {
    return 1;
  }

  return 0;
}

async function writeRankingToFile(ranking: Ranking, path: string) {
  fs.writeFileSync(path, "");
  ranking.forEach((row, idx) => {
    let line = `${row.username},${row.score}`;
    if (idx < ranking.length - 1) {
      line += "\r\n";
    }
    fs.appendFileSync(path, line);
  });
}
