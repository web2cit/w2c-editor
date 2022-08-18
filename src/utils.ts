import { TargetResult, Score } from "./types";

export function camelToKebabCase(input: string): string {
  const output = input.replaceAll(/([^A-Z])([A-Z])/g, "$1-$2").toLowerCase();
  return output;
}

// export function getPreferredResult(results: TargetResult[]): TargetResult {

// }

export function isResultApplicable(result: TargetResult): boolean | undefined {
  let applicable;
  const output = result.output;
  if (output !== undefined && output !== null) {
    applicable = output.fields.every((field) => field.template!.applicable);
  }
  return applicable;
}

export function getResultScore(result: TargetResult): Score | undefined {
  let score;
  const output = result.output;
  if (output !== undefined && output !== null) {
    const scores: number[] = [];
    output.fields.forEach((field) => {
      const score = field.test!.score
      if (score !== null) {
        scores.push(score);
      }
    })
    score = (
      scores.length ?
      scores.reduce((sum, score) => sum + score, 0) / scores.length :
      null
    );
  }
  return score;
}