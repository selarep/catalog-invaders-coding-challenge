import { parseFile } from "./parse-file";
import { createCodificationTable, decodeNumber } from "./decodification";
import { EncodedRankingRow } from "./interfaces/encoded-ranking";
import { Ranking, RankingRow } from "./interfaces/ranking";
import { writeRankingToFile } from "./write-to-file";

(async () => {
  const encodedRanking = await parseFile("input.csv");
  console.log(encodedRanking);

  const ranking: Ranking = encodedRanking
    .map(decodeRankingRow)
    .sort(sortRankingByScore);

  console.log(ranking);

  writeRankingToFile(ranking, "output.csv");
})();

export function decodeRankingRow(row: EncodedRankingRow): RankingRow {
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
