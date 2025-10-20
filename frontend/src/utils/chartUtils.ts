export const aggregateData = (data: any[], groupByKey: string) => {
  const aggregated = new Map<string, { sum: number, count: number }>();

  data.forEach((item) => {
    const key = item[groupByKey];
    const amount = parseFloat(item.amount);

    if (!isNaN(amount)) {
      if (aggregated.has(key)) {
        const current = aggregated.get(key)!;
        current.sum += amount;
        current.count += 1;
      } else {
        aggregated.set(key, { sum: amount, count: 1 });
      }
    } else {
      aggregated.set(key, { sum: NaN, count: 0 });
    }
  });

  return Array.from(aggregated.entries()).map(([key, { sum, count }]) => ({
    [groupByKey]: key,
    sum,
    average: count > 0 ? sum / count : NaN,
  }));
};

export const prepareBoxplotData = (data: any[], xKey: string, yKey: string) => {
  const groupedByX = new Map<string, number[]>();

  data.forEach(item => {
    const xValue = item[xKey];
    const yValue = parseFloat(item[yKey]);

    if (!isNaN(yValue)) {
      if (!groupedByX.has(xValue)) {
        groupedByX.set(xValue, []);
      }
      groupedByX.get(xValue)!.push(yValue);
    }
  });

  const boxplotData = Array.from(groupedByX.entries()).map(([key, values]) => {
    values.sort((a, b) => a - b);
    const q1 = quantile(values, 0.25);
    const median = quantile(values, 0.5);
    const q3 = quantile(values, 0.75);
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      category: key,
      min,
      q1,
      median,
      q3,
      max,
    };
  });
  return boxplotData;
};

const quantile = (values: number[], q: number) => {
  const pos = (values.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;

  if (values[base + 1] !== undefined) {
    return values[base] + rest * (values[base + 1] - values[base]);
  } else {
    return values[base];
  }
};

export const transformDataToMultiline = (data: any[], xKey: string, yKey: string, zKey: string) => {
  const groupedByZ = new Map<string, Map<any, number>>();

  data.forEach(item => {
    const xValue = item[xKey];
    const zValue = item[zKey];
    const yValue = parseFloat(item[yKey]);

    if (!isNaN(yValue)) {
      if (!groupedByZ.has(zValue)) {
        groupedByZ.set(zValue, new Map());
      }
      groupedByZ.get(zValue)!.set(xValue, yValue);
    }
  });

  const xValues = [...new Set(data.map(item => item[xKey]))];

  const multilineData = xValues.map(xValue => {
    const chartItem: Record<string, any> = { [xKey]: xValue };

    groupedByZ.forEach((zMap, zValue) => {
      const yValue = zMap.get(xValue) ?? null;
      chartItem[zValue] = yValue;
    });

    return chartItem;
  });

  return multilineData;
};