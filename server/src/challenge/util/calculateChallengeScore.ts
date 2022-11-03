import { Challenge } from "../schemas/challenge.schema";

export default function calculateChallengeScore(challenge: Challenge) {
  const solvedUserCount = challenge.solvedUserList.length;
  const { maximumScore, minimumScore, maximumSolvedUserCount } =
    challenge.grading;
  const solveProgress = Math.min(
    1,
    solvedUserCount / maximumSolvedUserCount || 1
  );
  return Math.round(
    minimumScore + (maximumScore - minimumScore) * (1 - solveProgress) ** 2
  );
}
