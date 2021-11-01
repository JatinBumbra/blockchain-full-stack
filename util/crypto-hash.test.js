const cryptoHash = require('./crypto-hash');

describe('cryptoHash', () => {
  it('generates a SHA256 hash', () => {
    expect(cryptoHash('jaybee')).toEqual(
      'db34f14dc3cac664236411888097899c469eda56b7eb44ced80ec958470414e8'
    );
  });

  it('generates the same hash for same input arguments in any order', () => {
    expect(cryptoHash('one', 'two', 'three')).toEqual(
      cryptoHash('three', 'one', 'two')
    );
  });

  it('produces a unique hash when the properties have changed on an input', () => {
    const obj = {};
    const originalHash = cryptoHash(obj);

    obj.a = 'a';

    expect(cryptoHash(obj)).not.toEqual(originalHash);
  });
});
