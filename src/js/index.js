//js dependencies
import * as d3 from 'd3';

//css dependencies
import '../css/index.css';


const width = 360,
    height = 360,
    radius = Math.min(width, height) / 2,
    innerRadius = Math.min(width, height) / 4;

const color = d3.scaleOrdinal(["#59914F", "#000201", "#CDE1DB", "#FED25A", "#3B4272", "#008487"]);

const fooData = [10,2,3,4,7,6];

let svg = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

let arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(innerRadius);

let pie = d3.pie()
    .sort(null)
    .value(function(d) { return d; });

let path = svg.selectAll('path')
    .data(pie(fooData))
    .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) {
            return color(i);
        });

