import * as fs from "fs";
import { Ranking } from "./interfaces/ranking";

export async function writeRankingToFile(ranking: Ranking, path: string) {
  fs.writeFileSync(path, "");
  ranking.forEach((row, idx) => {
    let line = `${row.username},${row.score}`;
    if (idx < ranking.length - 1) {
      line += "\r\n";
    }
    fs.appendFileSync(path, line);
  });
}
