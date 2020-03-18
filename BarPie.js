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
var svg = d3.select("#BarChart").append('svg')
    .attr('width', config.svg.width+100)
    .attr('height', config.svg.height+100)
    .append("g")
    .attr("transform", translate(config.plot.x, config.plot.y));
console.log("svg: "+JSON.stringify(svg))

var x0  = d3.scaleBand().rangeRound([0, config.svg.width-10], .5);
var x1 = d3.scaleBand();
var y   = d3.scaleLinear().rangeRound([config.svg.height, 0]);
d3.csv(csv).then(drawChart);


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
  var unit;
  console.log("length: "+data.length);
  for(var i = 0; i < data.length; i++){
    neighbor = data[i].Neighborhooods;
    unit = data[i].UnitType;
    if(data[i].CallTypeGroup !== ''){
      type = data[i].CallTypeGroup;
    }
    else{
      continue;
    }
    if(Counting.some(Counting => Counting.keys === neighbor) == false){
      numbers = new Object();
      numbers.keys = neighbor;
      numbers.values = [];
      var CallType = new Object();
      CallType.CallTypeName = type;
      CallType.Frequency = 1;
      CallType.UnitGroup = [];
      var UnitType = new Object();
      UnitType.UnitName = unit;
      UnitType.UFrequency = 1;
      CallType.UnitGroup.push(UnitType);
      numbers.values.push(CallType);
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
        CallType.UnitGroup = [];
        var UnitType = new Object();
        UnitType.UnitName = unit;
        UnitType.UFrequency = 1;
        CallType.UnitGroup.push(UnitType);
        resultList.push(CallType);
        console.log(0);
      }
      else{
        var ValueObj = resultList.find(({CallTypeName}) => CallTypeName === type);
        ValueObj.Frequency = ValueObj.Frequency+1;
        var ValueList = ValueObj.UnitGroup;
        if(ValueList.some(ValueList => ValueList.UnitName === unit) == false){
          var UnitType = new Object();
          UnitType.UnitName = unit;
          UnitType.UFrequency = 1;
          ValueList.push(UnitType);
        }else{
          var UnitObj = ValueList.find(({UnitName}) => UnitName === unit);
          UnitObj.UFrequency = UnitObj.UFrequency + 1;
        }
      }
    }
  }
   // console.log("Array: "+JSON.stringify(Counting));
  return Counting;
}
function drawChart(data){

  const groupData = Frequency(data)

  function drawPieChart(pD,UnitGroup){
    var data = pD;

    var UnitName = [];
      console.log("Pie data"+JSON.stringify(UnitName));
    // var data = pD;
    var radius = Math.min(config.svg.width, config.svg.height) / 2;
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var arc = d3.arc().outerRadius(radius - 10).innerRadius(0);
    var labelArc = d3.arc().outerRadius(radius - 40).innerRadius(radius - 40);

  var pie = d3.pie().sort(null).value(function(d) { return d; });

  var svg = d3.select("#BarPieChart").append("div").attr("id","PieChart").append("svg").attr("width", config.svg.width).attr("height", config.svg.height)
    .append("g").attr("transform", "translate(" + config.svg.width / 2 + "," +config.svg.height / 2 + ")");
  var piesvg = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");

    piesvg.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data); });
    // piesvg.append("text")
    //     .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
    //     .attr("dy", ".35em")
    //     .text(function(d) { return d.data; });
    console.log("UnitName: "+typeof(UnitName));
    const single = (currentValue) => currentValue;
    for(let user of UnitGroup){
      UnitName.push(user);
    }
      console.log("UnitName: "+JSON.stringify(UnitName));
    var legend = svg.selectAll(".legend")
          .data(UnitName.map(function(d) { return d; }))
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
          .style("opacity","100");

      legend.append("rect")
          .attr("x", config.svg.width*0.5-6)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", function(d) { return color(d); });

      legend.append("text")
          .attr("x", config.svg.width*0.5-10)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) {
            console.log("D: "+d)
            return d; });

      legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
  }

  function drawBarChart(FD){
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  // const groupData = Frequency(data)
  var xAxis = d3.axisBottom().scale(x0).tickValues(groupData.map(d=>d.keys));
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
             .attr("fill", function(d) { return color(d.CallTypeName) })
             .attr("y", function(d) { return y(0); })
             .attr("height", function(d) { return config.svg.height - y(0); })
            .on("mouseover",mouseover)
            .on("mouseout", function(d) {
                // d3.select("#PieChart").remove();
                var CallTypeColor = d3.select(this).style("fill", color(d.CallTypeName));
            });
      slice.selectAll("rect")
            .transition()
            .delay(function (d) {return Math.random()*1000;})
            .duration(1000)
            .attr("y", function(d) { return y(d.Frequency); })
            .attr("height", function(d) { return config.svg.height - y(d.Frequency); });

            function arcTween(a) {
           var i = d3.interpolate(this._current, a);
           this._current = i(0);
           return function(t) { return arc(i(t));};
         }
        function mouseover(d){
             d3.selectAll("#PieChart").remove();
                // utility function to be called on mouseover.
              console.log("MOUSEOVER: "+JSON.stringify(d.UnitGroup));
              var nD = d.UnitGroup;
              var data = [];
              var UnitGroup = [];
              for(let user of d.UnitGroup){
                data.push(user.UFrequency);
                UnitGroup.push(user.UnitName);
              }
              console.log("DATA: "+data);
              console.log("UNITGROUP: "+UnitGroup)
              drawPieChart(data,UnitGroup);
              // var Update = function(nD){
              //   piesvg.selectAll(".arc").data(pie(nD)).transition().duration(500)
              //       .attrTween("d", arcTween);
              // };
              var CallTypeColor = d3.select(this).style("fill", d3.rgb(color(d.CallTypeName)).darker(2));
              // return CallTypeColor;
               // // call update functions of pie-chart and legend.
               // pC.update(nD);
               // leg.update(nD);
               // d3.selectAll("#PieChart").remove();
           }


      var legend = svg.selectAll(".legend")
            .data(groupData[0].values.map(function(d) { return d.CallTypeName; }).reverse())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
            .style("opacity","0");

        legend.append("rect")
            .attr("x", config.svg.width*0.5)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d) { return color(d); });

        legend.append("text")
            .attr("x", config.svg.width*0.5-6)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {return d; });

        legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
        // return hG;
    }

    var BarChart = drawBarChart(groupData);
    var data = [100,100,50,60]
    // var PieChart = drawPieChart(data);
}
