function Database() {
  const inMemoryDb = new Map<string, unknown>();
  const countByValue = new Map<unknown, number>();
  let transactions: { db: typeof inMemoryDb, counts: typeof countByValue }[] = [];

  let inMemoryDbActive = inMemoryDb;
  let countByValueActive = countByValue;

  const setCountByValue = (value: unknown, incDec: 'increment' | 'decrement'): void => {
    const cntOld = countByValueActive.get(value) || 0;
    const countToAdjustBy = incDec === 'decrement' ? -1 : 1;

    countByValueActive.set(value, cntOld + countToAdjustBy);
  }

  const getCountByValue = (value: unknown): number => {
    return countByValueActive.get(value) || 0;
  }

  const get = (key: string): unknown => {
    return inMemoryDbActive.get(key);
  };

  const set = (key: string, value: unknown): void => {
    if (key === undefined || value === undefined) {
      throw '`key` and `value` are required for creating a record';
    }

    const valueOld = get(key);

    // I am going with the assumption that the value we are setting can be any
    // valid primitive value or object. If valueOld is undefined, that means
    // there isn't a key in the Map
    if (valueOld !== undefined) { // there is a record!!!
      // if the old record and new don't match, we will update
      if (valueOld !== value) {
        setCountByValue(valueOld, 'decrement');
        setCountByValue(value, 'increment');
      }
    } else { // there isn't a record!!!
      setCountByValue(value, 'increment');
    }

    inMemoryDbActive.set(key, value);
  }

  const del = (key: string): void => {
    const valueOld = get(key);
    setCountByValue(valueOld, 'decrement');

    inMemoryDbActive.delete(key);
  };

  const rollback = (): boolean => {
    if (transactions.length > 1) {
      transactions.pop();
      const transaction = transactions[transactions.length - 1];

      inMemoryDbActive = transaction.db;
      countByValueActive = transaction.counts;

      return true;
    }

    return false;
  }

  const begin = (): void => {
    // treating the original set of data as a transaction we can rollback to
    if (transactions.length < 1) {
      transactions.push({
        db: inMemoryDb,
        counts: countByValue,
      });
    }

    const countByValueCopy: typeof countByValue = new Map(countByValueActive);
    const inMemoryDbCopy: typeof inMemoryDb = new Map(inMemoryDbActive);

    // pushing the currrently active db and count so we can stack the rollbacks
    transactions.push({
      db: inMemoryDbCopy,
      counts: countByValueCopy,
    });

    inMemoryDbActive = inMemoryDbCopy;
    countByValueActive = countByValueCopy;
  };

  const commit = (): void => {
    const transaction = transactions[transactions.length - 1];

    inMemoryDbActive = transaction.db;
    countByValueActive = transaction.counts;

    transactions = [];
  };

  return {
    count: getCountByValue,
    // delete is a reserved word in JavaScript, hense this mapping
    delete: del,
    get,
    set,
    rollback,
    begin,
    commit,
  }
}

export default Database;
