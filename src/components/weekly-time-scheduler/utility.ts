export function hasIntersection(spans: [number, number][]) {
  for(var i = 0; i < spans.length; i++) {
    const spanA = spans[i];
    for(var k = i + 1; k < spans.length; k++) {
      const spanB = spans[k];

      // check if spanA contains either point of spanB
      // eg. [5, 10] and [7, 15], 7 is between 5 and 10
      // or  [11, 20] and [7, 15], 15 is between 11 and 20

      if(spanA[0] <= spanB[0] && spanB[0] <= spanA[1]) return true;
      if(spanA[0] <= spanB[1] && spanB[1] <= spanA[1]) return true;

      // check if spanB contains either point of spanA
      if(spanB[0] <= spanA[0] && spanA[0] <= spanB[1]) return true;
      if(spanB[0] <= spanA[1] && spanA[1] <= spanB[1]) return true;

    }
  }

  return false;
}