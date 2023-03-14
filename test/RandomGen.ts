import chai from 'chai';
import sinon from 'sinon';
import IllegalArgumentError from '../src/IllegalArgumentError';
import RandomGen from '../src/RandomGen';

const expect = chai.expect;

function createCounter() {
  const map: Map<number, number> = new Map();

  return {
    getCount(num: number): number {
      return map.get(num) ?? 0;
    },
    count(num: number): void {
      map.set(num, this.getCount(num) + 1);
    },
  };
}

function createPerfectlyUniformRandomFake(count: number) {
  const step = 1 / count;
  let current = 0;

  return () => {
    if (current >= count) {
      throw new Error('Maximum exceeded');
    }

    const number = current * step;
    current += 1;
    return number;
  };
}

describe('RandomGen', () => {
  describe('#constructor()', () => {
    it('throws error when no numbers are given', () => {
      expect(() => new RandomGen([], [])).to.throw(IllegalArgumentError, 'No numbers provided');
    });

    it('throws error when no array lengths mismatch', () => {
      expect(() => new RandomGen([1, 2, 3], [0.5, 0.5])).to.throw(IllegalArgumentError, 'Array length mismatch');
      expect(() => new RandomGen([1, 2], [0.5, 0.5, 0.5])).to.throw(IllegalArgumentError, 'Array length mismatch');
    });

    it('throws error when probability sum is not 1', () => {
      expect(() => new RandomGen([1, 2, 3], [0.5, 0.5, 0.5])).to.throw(
        IllegalArgumentError,
        'Probability sum is not 1',
      );
    });
  });

  describe('#nextNum()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('generates numbers with the given probability', () => {
      const sampleCount = 10000;
      const numbers = [-1, 0, 1, 2, 3];
      const probabilities = [0.01, 0.3, 0.58, 0.1, 0.01];
      const counter = createCounter();
      const random = createPerfectlyUniformRandomFake(sampleCount);
      const randomGen = new RandomGen(numbers, probabilities);

      sinon.replace(Math, 'random', random);

      for (let i = 0; i < sampleCount; i += 1) {
        counter.count(randomGen.nextNum());
      }

      for (let i = 0; i < numbers.length; i += 1) {
        expect(counter.getCount(numbers[i]), `count of ${numbers[i]}`).to.be.eq(probabilities[i] * sampleCount);
      }
    });
  });
});
