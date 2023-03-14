import IllegalArgumentError from './IllegalArgumentError';

export default class RandomGen {
  /** Values that may be returned by {@link nextNum()} */
  private randomNums: number[];
  /** Probability of the occurence of {@link randomNums} */
  private probabilities: number[];

  constructor(randomNums: number[], probabilities: number[]) {
    if (randomNums.length === 0) {
      throw new IllegalArgumentError('No numbers provided');
    }

    if (randomNums.length !== probabilities.length) {
      throw new IllegalArgumentError('Array length mismatch');
    }

    const totalProbabilitySum = probabilities.reduce((acc, val) => acc + Math.abs(val), 0);
    /*
     * According to [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON#testing_equality),
     * it's fine to use `Number.EPSILON` for smaller numbers.
     */
    if (Math.abs(1 - totalProbabilitySum) >= probabilities.length * Number.EPSILON) {
      throw new IllegalArgumentError('Probability sum is not 1');
    }

    this.randomNums = randomNums;
    this.probabilities = probabilities;
  }

  nextNum(): number {
    let numberIndex = -1;
    let probabilitySum = 0;
    const randomNumber = Math.random();

    do {
      numberIndex += 1;
      probabilitySum += this.probabilities[numberIndex];
    } while (numberIndex < this.randomNums.length - 1 && probabilitySum <= randomNumber);

    return this.randomNums[numberIndex];
  }
}
