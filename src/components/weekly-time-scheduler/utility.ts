import lodashIntersection from 'lodash.intersection';
export function hasIntersection(spans: [number, number][]) {
  const { n } = intersection(spans);
  if(n) return true;
  const i = lodashIntersection.apply(null, spans);
  if(i.length) return true;
  return false;
}

// https://stackoverflow.com/a/51662556
function intersection(spans: [number, number][]) {
	var arrayLength = spans.length;
  var intersections = 0;
  var intersectionsum = 0;
  var min, max = 0;
  var tmp;
  var intervals = [];
  for (var i = 0; i < arrayLength-1; i++) {
  	if(spans[i][0] > spans[i][1]) {
    	tmp = spans[i][1];
      spans[i][1] = spans[i][0];
      spans[i][0] = tmp;
    }
    for (var j = i+1; j < arrayLength; j++) {
    	if(spans[j][0] > spans[j][1]) {
        tmp = spans[j][1];
        spans[j][1] = spans[j][0];
        spans[j][0] = tmp;
      }
    
    	min = 0;
      max = 0;
    	if(spans[i][1] <=  spans[j][0] || spans[i][0] >= spans[j][1]){
      	// no intersection
        continue;
      }
        intersections +=1;
      	if(spans[i][0] >= spans[j][0]) {
        	min = spans[i][0]; 
        } else {
        	min = spans[j][0];
        }
        
        if(spans[i][1] >= spans[j][1]) {
        	max = spans[j][1]; 
        } else {
        	max = spans[i][1];
        }
        intervals.push([min,max]);
        intersectionsum += max-min;
      
    }
	}
  return {'n' : intersections, 'sum' : intersectionsum, 'intervals' : intervals};
}