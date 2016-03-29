requirejs.config({
  paths: {
    jquery: 'http://code.jquery.com/jquery-2.2.1.min',
    d3: 'http://d3js.org/d3.v3.min'
  }
})

define(['jquery', 'd3'], (jquery, d3) => {
  function range(first, max, step){
    var xs = [first], i = first;
    while(i < max) { 
      i += step;
      xs.push(i)
    }
    return xs;
  };

  const svg = d3.select("div#chartId")
    .append("div")
    .classed("svg-container", true) //container class to make it responsive
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 600 400")
    .classed("svg-content-responsive", true);
  
  function draw_timeline(spans) {
    const timelineStepMs = 100;
    const timelineMargin = 5
    
    const minTime = d3.min(spans, (x, i) => x.unix_timestamp);
    const maxTime = d3.max(spans, (x, i) => x.unix_timestamp + x.duration_ms);
    const marks = range(minTime, maxTime, timelineStepMs);
    const xScale = d3.scale.log().domain([minTime, maxTime]).range([30, 600])
    
    const lines = svg.selectAll('line').data(marks);
    const newLines = lines.enter();

    newLines.append('line')
        .attr('class', 'timeline-mark')
        .attr('x1', (d, i) => xScale(d))
        .attr('x2', (d, i) => xScale(d))
        .attr('y1', 10)
        .attr('y2', 290);

    newLines.append('text')
      .attr('class', 'time-label')
      .attr('x', (d,i) => xScale(d))
      .attr('y', (d,i) => 10)
      .text((d, i) => d - minTime + 'ms');

    newLines.append('text')
      .attr('class', 'time-label')
      .attr('x', (d,i) => xScale(d))
      .attr('y', (d,i) => 290)
      .text((d, i) => d - minTime + 'ms');
  }  


  function draw_traces(trace_data) {
    const spans = trace_data.spans

    d3.select('#trace-description').text(trace_data.description);
    
    draw_timeline(spans);
    const rects = svg.selectAll('rect').data(spans);

    const newRects = rects.enter();

    const minTime = d3.min(spans, (x, i) => x.unix_timestamp);
    const maxTime = d3.max(spans, (x, i) => x.unix_timestamp + x.duration_ms);

    const minId = d3.min(spans, (x, i) => x.id);
    const maxId = d3.max(spans, (x, i) => x.id);

    const minDuration = d3.min(spans, (x, i) => x.duration_ms);
    const maxDuration = d3.max(spans, (x, i) => x.duration_ms);

    const xScale = d3.scale.log().domain([minTime, maxTime]).range([30, 300]);
    const widthScale = d3.scale.log().domain([minDuration, maxDuration]).range([1, 300]);

    const yScale = d3.scale.linear().domain([0, maxId]).range([10, 100]);
    
    newRects
      .append('rect')
      .attr("class", d => "rect")
      .attr('x', (d, i) => xScale(d.unix_timestamp))
      .attr('y', (d, i) => yScale(d.id))
      .attr('height', (d, i) => 40)
      .attr('width', (d, i) => widthScale(d.duration_ms))

    
    newRects
      .append('text')
      .attr('class', 'trace-description')
      .attr('x', (d, i) => xScale(d.unix_timestamp) + 10)
      .attr('y', (d, i) => yScale(d.id) + 35)
      .text((d, i) => d.description);
  }



  d3.json('http://private-909e2-dapper.apiary-mock.com/traces/1', (trace) => {
    draw_traces(trace[0])
  })

  return {
    draw_traces: draw_traces
  }
})
