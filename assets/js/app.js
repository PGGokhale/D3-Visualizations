// @TODO: YOUR CODE HERE!
const svgWidth = 960
const svgHeight = 500

let margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  }
  
let width = svgWidth - margin.left - margin.right
let height = svgHeight - margin.top - margin.bottom

let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

let chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
 

  // View selection - changing this triggers transition
let currentSelection = "poverty"
let currentSelectionY = "noHealthInsurance"


/**
 * Returns a updated scale based on the current selection.
 **/
function xScale(filterdata, currentSelection) {

      let xLinearScale=d3
            .scaleLinear()
            .domain([
            d3.min(filterdata.map(d => parseInt(d[currentSelection]))) * 0.8,
            d3.max(filterdata.map(d => parseInt(d[currentSelection]))) * 1.2
            ])
            .range([0, width])

    return xLinearScale
  }

  function yScale(filterdata, currentSelectionY) {

    let yLinearScale=d3
          .scaleLinear()
          .domain([
          d3.min(filterdata.map(d => parseInt(d[currentSelectionY]))) * 0.8,
          d3.max(filterdata.map(d => parseInt(d[currentSelectionY]))) * 1.2
          ])
          .range([height, 0])

  return yLinearScale
}
  
  /**
   * Returns and appends an updated x-axis and y-axis based on a scale.
   **/
  function renderAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale)
  
    xAxis
      .transition()
      .duration(1000)
      .call(bottomAxis)
  
    return xAxis
  }

  function renderYAxes(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale)
  
    yAxis
      .transition()
      .duration(1000)
      .call(leftAxis)
  
    return yAxis

  }
  
  /**
   * Returns and appends an updated circles group based on a new scale and the currect selection.
   **/
  function renderCircles(circlesGroup, newXScale, newYScale, currentSelection, currentSelectionY) {

    circlesGroup
      .transition()
      .duration(1000)
      .attr("cx", d => newXScale(parseInt(d[currentSelection])))
      .attr("cy", d => newYScale(parseInt(d[currentSelectionY])))
          
    return circlesGroup
  }
/**
   * Returns and appends an updated Text group based on a new scale and the currect selection.
   **/
  function renderText(textGroup, newXScale, newYScale, currentSelection, currentSelectionY)
  {
    textGroup
    .transition()
    .duration(1000)
    .attr("x", d => newXScale(parseInt(d[currentSelection])))
    .attr("y", d => newYScale(parseInt(d[currentSelectionY])))
    .text(function(d){return d["abbr"]})
    return textGroup
    
  }
  
  ;(function() {
    d3.csv("/assets/data/data.csv").then(filterdata => {
      console.log(filterdata)
       
  
      let xLinearScale = xScale(filterdata, currentSelection)     
      let yLinearScale = yScale(filterdata, currentSelectionY)
      let bottomAxis = d3.axisBottom(xLinearScale)      
      let leftAxis = d3.axisLeft(yLinearScale)
  
      xAxis = chartGroup
        .append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)

      yAxis = chartGroup
        .append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(0, 0)`)
        .call(leftAxis)
 
      let circlesGroup = chartGroup
        .selectAll("circle.stateCircle")
        .data(filterdata)
        .enter()
        .append("circle")
        .classed('stateCircle', true)
        .attr("cx", d => xLinearScale(d[currentSelection]))
        .attr("cy", d => yLinearScale(d[currentSelectionY]))
        .attr("r", 10)        
        .attr("fill", "blue")
        .attr("opacity", ".5")

      let textGroup =  chartGroup
        .selectAll("text.stateText")
        .data(filterdata)
        .enter()
        .append("text")
        .classed('stateText', true) 
        .attr("x",d => xLinearScale(d[currentSelection]))
        .attr("y",d => yLinearScale(d[currentSelectionY]))
        .text(d => d.abbr)
        .attr("fill", "red")
        .attr("font-size", "8px")
  
        /* Label group for X-axis*/
      let labelsGroup = chartGroup
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
         
         /* Label group for Y-axis*/
      let labelsGroup1 = chartGroup
      .append("g")
      .attr("transform", `translate(${margin.left}, ${height/2})`)
      
  
      labelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)")

      labelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 40)
        .classed("inactive", true)
        .attr("value", "age")
    
        .text("Age (Median)")
  
      labelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 60)
        .classed("inactive", true)
        .attr("value", "income")
    
        .text("Household Income (Median)")
  
        labelsGroup1
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left )
        .attr("x", 0 )
        .attr("dy", "1em")
        .classed("inactive", true)
        .attr("value", "obesity")
    
        .text("Obese (%)")

        labelsGroup1
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0  )
        .attr("dy", "2em")
        .classed("inactive", true)
        .attr("value", "smokes")
    
        .text("Smokes (%)")

        labelsGroup1
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0  )
        .attr("dy", "4em")
        .classed("active", true)
        .attr("value", "noHealthInsurance")    
        .text("Lacks Healthcare (%)")
  
      // Create an event listener to call the update functions when a label on X-axis is clicked
      labelsGroup.selectAll("text").on("click", function() {
        let value = d3.select(this).attr("value")
       
        labelsGroup.selectAll("text").classed("inactive",  true);       
        if (value !== currentSelection) {
            d3.select(this).attr('class', 'active')
          currentSelection = value
          xLinearScale = xScale(filterdata, currentSelection)
          yLinearScale = yScale(filterdata, currentSelectionY)                   
          xAxis = renderAxes(xLinearScale, xAxis)
          circlesGroup = renderCircles(
            circlesGroup, 
            xLinearScale, 
            yLinearScale, 
            currentSelection, 
            currentSelectionY
            
          )
          textGroup = renderText(
            textGroup, 
            xLinearScale, 
            yLinearScale, 
            currentSelection, 
            currentSelectionY
            
          )
        }
      }
      )
      // Create an event listener to call the update functions when a label on Y-axis is clicked
      labelsGroup1.selectAll("text").on("click", function() {
        labelsGroup1.selectAll("text").classed("inactive",  true);
        let value = d3.select(this).attr("value")
        if (value !== currentSelectionY) {
            d3.select(this).attr('class', 'active')
          currentSelectionY = value
          yLinearScale = yScale(filterdata, currentSelectionY)
          xLinearScale = xScale(filterdata, currentSelection)          
          yAxis = renderYAxes(yLinearScale, yAxis)
          circlesGroup = renderCircles(
            circlesGroup, 
            xLinearScale, 
            yLinearScale, 
            currentSelection, 
            currentSelectionY            
          )
          textGroup = renderText(
            textGroup, 
            xLinearScale, 
            yLinearScale, 
            currentSelection, 
            currentSelectionY            
          )
        }
      }
      )
    }
    )
  })()
  
