import Database from '../database.js';

describe('Database', () => {
  it ('should throw error when no params sent to set', () => {
    const db = Database();

    const triggerSetError = () => {
      // @ts-expect-error I'm expecting it to error
      db.set();
    }

    expect(triggerSetError).toThrow()
  });

  it('should set and get', () => {
    const db = Database();
    const key = 'test';
    const value = 'bar';

    db.set(key, value);
    expect(db.get(key)).toEqual(value);

    db.set(key, `${value}-1`);
    expect(db.get(key)).toEqual(`${value}-1`);

    expect(db.get('nothere')).not.toBeDefined();
  });

  it('should set and update count value', () => {
    const db = Database();
    const key = 'test';
    const valueFirst = 'same';
    const valueSecond = 'different';

    db.set(key, valueFirst);
    expect(db.count(valueFirst)).toEqual(1);

    db.set(key, valueSecond);
    expect(db.count(valueFirst)).toEqual(0);
    expect(db.count(valueSecond)).toEqual(1);

    // purpusefully testing the first expect again to confirm
    // setting the key to the first value keeps proper count
    db.set(key, valueFirst);
    expect(db.count(valueFirst)).toEqual(1);
    expect(db.count(valueSecond)).toEqual(0);
  });


  it('should set, delete, and update count value', () => {
    const db = Database();
    const key = 'test';
    const value = 'same';

    db.set(key, value);
    db.set(`${key}-1`, value);
    db.set(`${key}-2`, value);
    expect(db.count(value)).toEqual(3);

    db.delete(key);
    expect(db.count(value)).toEqual(2);
  });

  it('should return false when there are no transitions to rollback to', () => {
    const db = Database();

    expect(db.rollback()).toEqual(false);
  });

  describe('examples', () => {
    it('should cover example #1', () => {
      const db = Database();

      expect(db.get('a')).toBeUndefined();

      db.set('a', 'foo');
      db.set('b', 'foo');

      expect(db.count('foo')).toEqual(2);
      expect(db.count('bar')).toEqual(0);

      db.delete('a');

      expect(db.count('foo')).toEqual(1);

      db.set('b', 'baz');

      expect(db.count('foo')).toEqual(0);
      expect(db.get('b')).toEqual('baz');
      expect(db.get('B')).toBeUndefined();
    });

    it('should cover example #2', () => {
      const db = Database();

      expect(db.get('a')).toBeUndefined();

      db.set('a', 'foo');
      db.set('a', 'foo');

      expect(db.count('foo')).toEqual(1);
      expect(db.get('a')).toEqual('foo');

      db.delete('a');

      expect(db.get('a')).toBeUndefined();
      expect(db.count('foo')).toEqual(0);
    });

    it('should cover example #3', () => {
      const db = Database();

      // start: first begin
      db.begin();

      db.set('a', 'foo');

      expect(db.get('a')).toEqual('foo');

      // start: second begin
      db.begin();

      db.set('a', 'bar');

      expect(db.get('a')).toEqual('bar');

      db.set('a', 'baz');

      db.rollback();
      // end: second begin

      expect(db.get('a')).toEqual('foo');

      db.rollback();
      // end: first begin

      expect(db.get('a')).toBeUndefined();
    });

    it('should cover example #4', () => {
      const db = Database();

      // >> SET a foo
      db.set('a', 'foo');

      // >> SET b baz
      db.set('b', 'baz');

      // start: first begin
      // >> BEGIN
      db.begin();

      // >> GET a
      expect(db.get('a')).toEqual('foo');

      // >> SET a bar
      db.set('a', 'bar');

      // >> COUNT bar
      expect(db.count('bar')).toEqual(1);

      // start: second begin
      // >> BEGIN
      db.begin();

      // >> COUNT bar
      expect(db.count('bar')).toEqual(1);

      // >> DELETE a
      db.delete('a');

      // >> GET a
      expect(db.get('a')).toBeUndefined();

      // >> COUNT bar
      expect(db.count('bar')).toEqual(0);

      // end: second begin
      // >> ROLLBACK
      db.rollback();

      // >> GET a
      expect(db.get('a')).toEqual('bar');

      // >> COUNT bar
      expect(db.count('bar')).toEqual(1);

      db.commit();

      // >> GET a
      expect(db.get('a')).toEqual('bar');

      // >> GET b
      expect(db.get('b')).toEqual('baz');
    });
  });
});
