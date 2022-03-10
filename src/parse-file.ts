import * as readLine from "readline";
import * as fs from "fs";
import {
  EncodedRanking,
  EncodedRankingRow,
} from "./interfaces/encoded-ranking";

export async function parseFile(path: string): Promise<EncodedRanking> {
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

export function parseLine(line: string): EncodedRankingRow {
  const splitedLine = line.split(",");
  return {
    username: splitedLine[0],
    codification: splitedLine[1],
    encodedScore: splitedLine[2],
  };
}
