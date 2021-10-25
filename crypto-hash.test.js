const cryptoHash = require('./crypto-hash');

describe('cryptoHash', () => {
  it('generates a SHA256 hash', () => {
    expect(cryptoHash('jaybee')).toEqual(
      'bd01064dfdaa5504f81b4d4128964d4f6f28f793a53dcc1ab00210608ff095d4'
    );
  });

  it('generates the same hash for same input arguments in any order', () => {
    expect(cryptoHash('one', 'two', 'three')).toEqual(
      cryptoHash('three', 'one', 'two')
    );
  });
});
