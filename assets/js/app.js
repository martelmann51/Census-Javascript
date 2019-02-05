// @TODO: YOUR CODE HERE!
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

    // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;
  
  var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Read CSV
  d3.csv("/assets/data/data.csv")
    .then(function(censusData) {

      // create date parser
      //var dateParser = d3.timeParse("%d-%b");

      // parse data
      censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
        data.obesity = +data.obesity
      });

      // create scales
      var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(censusData, d => d.poverty))
        .range([0, width]);

      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.healthcare)])
        .range([height, 0]);

      // create axes
      var xAxis = d3.axisBottom(xLinearScale);
      var yAxis = d3.axisLeft(yLinearScale);

      // append axes
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

      chartGroup.append("g")
        .call(yAxis);

      // line generator
      //var line = d3.scatter()
        //.x(d => xLinearScale(d.poverty))
        //.y(d => yLinearScale(d.healthcare));

      // append line
      //chartGroup.append("path")
        //.data([censusData])
        //.attr("d", line)
        //.attr("fill", "none")
        //.attr("stroke", "red");

      // append circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "12")
        .attr("fill", "lightblue")
        .attr("stroke-width", "0.5")
        .attr("stroke", "blue")
        .attr("opacity", ".5")
    
      var circlesLabel = chartGroup.selectAll(".fill-text")
        .data(censusData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty)-8.5)
        .attr('y', d => yLinearScale(d.healthcare)+3)
        .attr('font-size', '10px')
        .attr('font-family', 'sans-serif' )
        .attr('fill', 'black')
        .classed('fill-text', true)
  
          // Create group for  2 x- axis labels
      var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

      var povertyrateLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty Rate (%)");

      var healthcarelabel = labelsGroup.append("text")
        .attr ("transform", "rotate(-90)")        
        .attr("y", -650)
        .attr("x", 250)
        .style("text-anchor", "middle")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lack of Healthcare (%)");
      


      // Date formatter to display dates nicely
      var dateFormatter = d3.timeFormat("%d-%b");

      // Step 1: Initialize Tooltip
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`<strong>${d.abbr}<strong><hr>${d.healthcare}
          poverty rate(%)`);
        });

      // Step 2: Create the tooltip in chartGroup.
      chartGroup.call(toolTip);

      // Step 3: Create "mouseover" event listener to display tooltip
      circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
      // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });
    });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
