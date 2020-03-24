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


// Append a group area, then set its margins
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from forcepoints.csv
d3.csv("/assets/data/data.csv").then(filterdata => {

    let xLinearScale=d3
            .scaleLinear()
            .domain([
            d3.min(filterdata.map(d => parseInt(d["poverty"]))) * 0.8,
            d3.max(filterdata.map(d => parseInt(d["poverty"]))) * 1.2
            ])
            .range([0, width])

    let yLinearScale=d3
            .scaleLinear()
            .domain([
            d3.min(filterdata.map(d => parseInt(d["noHealthInsurance"]))) * 0.8,
            d3.max(filterdata.map(d => parseInt(d["noHealthInsurance"]))) * 1.2
            ])
            .range([height, 0])

        let bottomAxis = d3.axisBottom(xLinearScale);
        let leftAxis = d3.axisLeft(yLinearScale);

        xAxis = chartGroup
        .append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)    
        .call(bottomAxis)

        chartGroup.append("g")
        .call(leftAxis)

    let circlesGroup = chartGroup
        .selectAll("circle")
        .data(filterdata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.noHealthInsurance))
        .attr("r", 10)
        .attr("fill", "blue")
        .attr("opacity", ".5")

        chartGroup
        .selectAll("text.state-name")
        .data(filterdata)
        .enter()
        .append("text")
        .classed('state-name', true)    
        .attr("x",d=> xLinearScale(d.poverty)-6)
        .attr("y",d=> yLinearScale(d.noHealthInsurance)+2)
        .text(d => d.abbr)
        .attr("fill", "red")
        .attr("font-size", "8px")


// let textGroup =  chartGroup
//         .selectAll("text")
//         .data(filterdata)
//         .enter()
//         .append("text")
//         .attr("x",(d,i) =>  xLinearScale(d.poverty))
//         .attr("y",d => yLinearScale(d.noHealthInsurance))
//         .text(d => d.abbr)
//         .attr("fill", "red")
//         .attr("font-size", "8px")

        chartGroup
        .append("text")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .attr("x", 0)
        .attr("y", 20)    
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)")

        chartGroup
        .append("text")
        .attr("transform", `translate(${margin.left}, ${height/2})`)
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "2em")
        .attr("value", "noHealthInsurance")
        .classed("active", true)
        .text("Lacks Health Care")
  


})