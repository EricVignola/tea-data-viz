//js dependencies
import * as d3 from 'd3';

//css dependencies
import '../css/index.css';

//create constants for visualization
const width = 360,
    height = 360,
    radius = Math.min(width, height) / 2,
    innerRadius = Math.min(width, height) / 4;

const legendRectSize = 18,
    legendSpacing = 4;

const colors = d3.scaleOrdinal(["#59914F", "#000201", "#CDE1DB", "#FED25A", "#3B4272", "#008487"]);

let arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(innerRadius)
    .padAngle(0.05)
    .cornerRadius(10);

//appending area to body to create visualization on
let svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    //center the visualization in the svg element
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

let tooltip = d3.select('#chart')
  .append('div')
  .attr('class', 'tooltip');

tooltip.append('div')
  .attr('class', 'label');

tooltip.append('div')
  .attr('class', 'count');

tooltip.append('div')
  .attr('class', 'percent');

//fetch external json
d3.json('../src/assets/teaStats.json', function(err, unformattedData) {
    if(err) throw err;

    //format json into an array of objects for d3
    let data = Object.keys(unformattedData).reduce((data, key) => {
      data.push({
        label: key,
        count: unformattedData[key],
        enabled: true
      });
      return data;
    } ,[]);
  

    let pie = d3.pie()
      .sort(null)
      //telling the generator what value to use when generating start and
      //end angles for the arc generator
      .value(function(d) { return d.count; });
  
    console.log(colors);
    
    let path = svg.selectAll('path')
        .data(pie(data)) //transform data into path information for pie arcs
      .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) {
          return colors(d.data.label);
        })
        .each(function(d) {this._current = d});
    
    path.on('mouseover', function(d) {
      let total = d3.sum(data.map(function(d) {
        return d.enabled ? d.count : 0;
      }));
      let percent = Math.round(1000 * d.data.count / total) / 10;
      tooltip.select('.label').html(d.data.label);
      tooltip.select('.count').html(d.data.count);
      tooltip.select('.percent').html(percent + '%');
      tooltip.style('display', 'block');
    });

    path.on('mouseout', function(d){
      tooltip.style('display', 'none');
    });

    path.on('mousemove', function(d) {
      tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX + 10) + 'px');
    });
    
    let legend = svg.selectAll('.legend')
        .data(colors.domain())
      .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i){
          let height = legendRectSize + legendSpacing;
          let offset = height * colors.domain().length / 2;
          let horz = -2 * legendRectSize;
          let vert = i * height - offset;
          return 'translate(' + horz + ',' + vert + ')';
        });

        legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', colors)
          .style('stroke', colors)
          .on('click', function(label) {
            let rect = d3.select(this);
            let enabled = true;
            let totalEnabled = d3.sum(data.map(function(d){
              return d.enabled ? 1 : 0;
            }));

            if(rect.attr('class') === 'disabled'){
              rect.attr('class', '');
            } else {
              if(totalEnabled < 2) return;
              rect.attr('class', 'disabled');
              enabled = false;
            }

            pie.value(function(d) {
              if(d.label === label) d.enabled = enabled;
              return d.enabled ? d.count : 0;
            });

            path = path.data(pie(data));

            path.transition()
              .duration(750)
              .attrTween('d', function(d) {
                let interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                  return arc(interpolate(t));
                };
              });
          });
        
        legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function(d) { return d.toUpperCase(); });
});
