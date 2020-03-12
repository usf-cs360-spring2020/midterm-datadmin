let csv = 'Pauldatasouce.csv';
console.log("CSV:"+csv);

// configuration of svg/plot area
let config = {
  'svg': {},
  'margin': {},
  'plot': {}
};
config.svg.height = 450;
config.svg.width = config.svg.height * 1.618; // golden ratio
config.margin.top = 10;
config.margin.right = 10;
config.margin.bottom = 20;
config.margin.left = 100;
config.plot.x = config.margin.left;
config.plot.y = config.margin.top;
config.plot.width = config.svg.width - config.margin.left - config.margin.right;
config.plot.height = config.svg.height - config.margin.top - config.margin.bottom;

function translate(x, y) {
  return 'translate(' + x + ',' + y + ')';
}
var svg = d3.select("#BarPieChart").append('svg')
    .attr('width', config.svg.width+100)
    .attr('height', config.svg.height+100)
    .append("g")
    .attr("transform", translate(config.plot.x, config.plot.y));
console.log("svg: "+JSON.stringify(svg))

var x0  = d3.scaleBand().rangeRound([0, config.svg.width-10], .5);
var x1 = d3.scaleBand();
var y   = d3.scaleLinear().rangeRound([config.svg.height, 0]);
d3.csv(csv).then(drawChart);

function convert(input) {
  let output = {};

  output.PotentiallyLifeThreatening = +input['Potentially Life-Threatening'];
  output.NonLifeThreatening = +input['Non Life-threatening'];
  output.Alarm = +input['Alarm'];
  output.Fire = +input['Fire'];

  console.log("Convert: "+output)
  return output;
}

function isNeighbor(Counting, name){
  return Counting.keys === name;
}
function isCallType(Object, name){
  return
}
function Frequency(data){
  const Counting =[];
  var numbers;
  var neighbor;
  var type;
  console.log("length: "+data.length);
  for(var i = 0; i < data.length; i++){
    neighbor = data[i].Neighborhooods;
    type = data[i].CallTypeGroup;
    if(Counting.some(Counting => Counting.keys === neighbor) == false){
      numbers = new Object();
      numbers.keys = neighbor;
      numbers.values = [];
      var CallType = new Object();
        CallType.CallTypeName = type;
        CallType.Frequency = 1;
      numbers.values.push(CallType)
      // console.log("false neighbor: "+neighbor);
      // console.log("false numbers: "+JSON.stringify(numbers));
      Counting.push(numbers);
      console.log(1);
      // console.log("Counting false: "+Counting);
    }
    else{
      // console.log("Counting false: "+Counting.get(neighbor));
      var result = Counting.find( ({ keys }) => keys === neighbor);
      //console.log("Result: "+JSON.stringify(result));
      var resultList = result.values;
      // console.log("List: "+ JSON.stringify(resultList));
      // break;
      if(resultList.some(resultList => resultList.CallTypeName === type) == false){
        var CallType = new Object();
        CallType.CallTypeName = type;
        CallType.Frequency = 1;
        resultList.push(CallType);
        console.log(0);
      }
      else{
        var ValueObj = resultList.find(({CallTypeName}) => CallTypeName === type);
        ValueObj.Frequency = ValueObj.Frequency+1;
      }
    }
  }
  console.log("Array: "+JSON.stringify(Counting));
  return Counting;
}
function drawChart(data){


  var color = d3.scaleOrdinal(d3.schemeCategory10);

  const groupData = Frequency(data)

  var xAxis = d3.axisBottom().scale(x0)
                                // .tickFormat(groupData.map(d=>d.keys))
                                .tickValues(groupData.map(d=>d.keys));
   var yAxis = d3.axisLeft().scale(y);

   var NeighborhooodsName = groupData.map(function(d) { return d.keys; });
   var Call = groupData[0].values.map(function(d) { return d.CallTypeName; });
   x0.domain(NeighborhooodsName);
   x1.domain(Call).rangeRound([0, x0.bandwidth()]);
   y.domain([0, d3.max(groupData, function(key) { return d3.max(key.values, function(d) { return d.Frequency; }); })]);

   svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + config.svg.height + ")")
      .call(xAxis);
      svg.append("g")
          .attr("class", "y axis")
          .style('opacity','1')
          .call(yAxis)
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style('font-weight','bold')
                .text("Value");
    var slice = svg.selectAll(".slice")
      .data(groupData)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform",function(d) { return "translate(" + x0(d.keys) + ",0)"; });
      slice.selectAll("rect")
      .data(function(d) { return d.values; })
        .enter().append("rect")
            .attr("width", x1.bandwidth())
            .attr("x", function(d) { return x1(d.CallTypeName); })
             .style("fill", function(d) { return color(d.CallTypeName) })
             .attr("y", function(d) { return y(0); })
             .attr("height", function(d) { return config.svg.height - y(0); })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color(d.CallTypeName)).darker(2));
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", color(d.CallTypeName));
            });
      slice.selectAll("rect")
            .transition()
            .delay(function (d) {return Math.random()*1000;})
            .duration(1000)
            .attr("y", function(d) { return y(d.Frequency); })
            .attr("height", function(d) { return config.svg.height - y(d.Frequency); });

}
