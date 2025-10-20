import { prepareBoxplotData, transformDataToMultiline, aggregateData } from "../chartUtils";

describe('aggregateData', () => {
  it('should correctly aggregate data by the specified key', () => {
    const data = [
      { category: 'A', amount: '10' },
      { category: 'B', amount: '20' },
      { category: 'A', amount: '30' },
      { category: 'B', amount: '40' },
    ];

    const result = aggregateData(data, 'category');
    
    expect(result).toEqual([
      { category: 'A', sum: 40, average: 20 },
      { category: 'B', sum: 60, average: 30 },
    ]);
  });

  it('should handle invalid amounts (NaN values)', () => {
    const data = [
      { category: 'A', amount: '10' },
      { category: 'B', amount: 'invalid' },
      { category: 'A', amount: '20' },
    ];

    const result = aggregateData(data, 'category');
    
    expect(result).toEqual([
      { category: 'A', sum: 30, average: 15 },
      { category: 'B', sum: NaN, average: NaN },
    ]);
  });
});

describe('prepareBoxplotData', () => {
  it('should group data by xKey and calculate boxplot data', () => {
    const data = [
      { category: 'A', value: '10' },
      { category: 'A', value: '15' },
      { category: 'A', value: '20' },
      { category: 'B', value: '30' },
      { category: 'B', value: '35' },
      { category: 'B', value: '40' },
    ];

    const result = prepareBoxplotData(data, 'category', 'value');
    
    expect(result).toEqual([
      {
        category: 'A',
        min: 10,
        q1: 12.5,
        median: 15,
        q3: 17.5,
        max: 20,
      },
      {
        category: 'B',
        min: 30,
        q1: 32.5,
        median: 35,
        q3: 37.5,
        max: 40,
      },
    ]);
  });

  it('should handle empty or invalid data gracefully', () => {
    const data = [{ category: 'A', value: 'invalid' }];
    const result = prepareBoxplotData(data, 'category', 'value');
    
    expect(result).toEqual([
    ]);
  });
});

describe('transformDataToMultiline', () => {
  it('should transform data into a multiline format', () => {
    const data = [
      { month: 'January', value: '10', type: 'A' },
      { month: 'February', value: '20', type: 'A' },
      { month: 'January', value: '30', type: 'B' },
      { month: 'February', value: '40', type: 'B' },
    ];

    const result = transformDataToMultiline(data, 'month', 'value', 'type');
    
    expect(result).toEqual([
      { month: 'January', A: 10, B: 30 },
      { month: 'February', A: 20, B: 40 },
    ]);
  });

  it('should handle missing or null values gracefully', () => {
    const data = [
      { month: 'January', value: '10', type: 'A' },
      { month: 'February', value: '20', type: 'A' },
      { month: 'January', value: 'invalid', type: 'B' },
      { month: 'February', value: '40', type: 'B' },
    ];

    const result = transformDataToMultiline(data, 'month', 'value', 'type');
    
    expect(result).toEqual([
      { month: 'January', A: 10, B: null },
      { month: 'February', A: 20, B: 40 },
    ]);
  });
});
