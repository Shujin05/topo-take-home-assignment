export const aggregateData = (data: any[], groupByKey: string) => {
  const aggregated: Record<string, { sum: number, count: number }> = {};

  data.forEach((item) => {
    const key = item[groupByKey];
    const amount = parseFloat(item.amount);

    if (!isNaN(amount)) {
      if (aggregated[key]) {
        aggregated[key].sum += amount;
        aggregated[key].count += 1;
      } else {
        aggregated[key] = { sum: amount, count: 1 };
      }
    } else {
      aggregated[key] = { sum: NaN, count: 0 };
    }
  });

  return Object.keys(aggregated).map((key) => {
    const { sum, count } = aggregated[key];
    const average = count > 0 ? sum / count : NaN;
    return {
      [groupByKey]: key,
      sum: sum,
      average: average,
    };
  });
};

export const prepareBoxplotData = (data: any[], xKey: string, yKey: string) => {
  const groupedByX: Record<string, number[]> = {};

  data.forEach(item => {
    const xValue = item[xKey];
    const yValue = parseFloat(item[yKey]);

    if (!isNaN(yValue)) {
      if (!groupedByX[xValue]) {
        groupedByX[xValue] = [];
      }
      groupedByX[xValue].push(yValue);
    }
  });

  const boxplotData = Object.keys(groupedByX).map((key) => {
    const values = groupedByX[key];
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
  const groupedByZ: Record<string, any[]> = {};

  data.forEach(item => {
    const xValue = item[xKey];
    const zValue = item[zKey];
    const yValue = parseFloat(item[yKey]);

    if (!isNaN(yValue)) {
      if (!groupedByZ[zValue]) {
        groupedByZ[zValue] = [];
      }
      groupedByZ[zValue].push({ x: xValue, y: yValue });
    }
  });

  const result = Object.keys(groupedByZ).map(zValue => {
    const seriesData = groupedByZ[zValue].map(({ x, y }) => ({ x, y }));

    return {
      label: zValue,
      data: seriesData,
      fill: false,
    };
  });

  const multilineData: any[] = [];
  const xValues = [...new Set(data.map(item => item[xKey]))];

  xValues.forEach(xValue => {
    const chartItem = { [xKey]: xValue };

    result.forEach(series => {
      const dataPoint = series.data.find(item => item.x === xValue);
      chartItem[series.label] = dataPoint ? dataPoint.y : null;
    });

    multilineData.push(chartItem);
  });

  return multilineData;
};
