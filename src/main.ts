import RandomGen from './RandomGen';

const count = 10;
const randomGen = new RandomGen([3, 5, 9], [0.1, 0.79, 0.11]);

console.log('Here are your %d numbers:', count);

for (let i = 0; i < count; i += 1) {
  console.log(randomGen.nextNum());
}
