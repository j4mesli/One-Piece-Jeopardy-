import { Row } from "react-table";
import { LeaderboardEntry } from "../types/LeaderboardEntry";

const parseFormattedDate = (dateStr: string): Date => {
  if (dateStr === 'N/A') {
    return new Date(0); // Handle "N/A" as a special case
  }

  const monthMap: { [key: string]: number } = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
    'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
  };

  const match = dateStr.match(/(\w+), (\w+) (\d{1,2})\w+, (\d{4})/);
  if (match) {
    const [, , month, day, year] = match;
    return new Date(parseInt(year), monthMap[month], parseInt(day));
  }

  return new Date(0); // Fallback for unparseable dates
};

const compareDates = (rowA: Row<LeaderboardEntry>, rowB: Row<LeaderboardEntry>, columnId: string) => {
  const dateA = parseFormattedDate(rowA.values[columnId]);
  const dateB = parseFormattedDate(rowB.values[columnId]);

  return dateA.getTime() - dateB.getTime();
};

export default compareDates;