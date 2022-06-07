

d3.csv("/data/DataBreaches(2004-2021).csv",function(d){
    return {
        entity : d.Entity,
        year : d.Year,
        records : d.Records,
        org_type : d.Organization_type,
        method : d.Method
            }
    }).then(donnees =>{
    
    let canevas = d3.select("body")
        .append("svg")
        .attr("width", 800)
        .attr("height", 500) 
    
    canevas.append("text")
        .attr("x", 250)             
        .attr("y", 50)
        .attr("text-anchor", "middle")  
        .style("font-size", "25px")
        .style("font-family", "Arial")  
        .style("text-anchor", "middle")  
        .text("Number of records lost per year");

    // TIME CHART :
    // Creation du sous-ensemble temporel :
    const sum_time = d3.rollups(donnees, v => d3.sum(v,d => d.records), d => d.year)
        .sort((a, b) => a[0] - b[0]);
    //console.log("here", sum_time)

    
    //création des échelles :
    const y = d3.scaleLinear()
        .domain([0, d3.max(sum_time, d => d[1])])
        .range([300,0]);
    const x = d3.scaleBand()
        .domain(sum_time.map(d => d[0]))
        .rangeRound([20,700])
        .padding(0.1);

    // création des axes :

    canevas.append("g")
        .attr("transform","translate(50, 400)")
        .call(d3.axisBottom(x))
            .selectAll("text")
            .style("fill","#ffd747");
        
    canevas.append("g")
        .attr('transform', 'translate(70, 100)')
        .call(d3.axisLeft(y)
            .tickFormat(d=>d/1e06 + " mio"))
            .selectAll("text")
            .style("fill","#ffd747");

    // création du chemin :

    canevas.append("path")
        .datum(sum_time)
        .attr("transform", "translate(67,100)")
        .attr("fill", "#ffd747")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", d3.area()
            .x(d => x(d[0]))
            .y1(d => y(d[1]))
            .y0(y(0))
      );
      
    //GENERAL :
    //création de la zone rectangulaire :
      
    canevas.append('rect')
        .attr('x',0)
        .attr('y',0)
        .attr('width', 800)
        .attr('height',500)
        .attr('rx', 20)
        .attr('fill','rgb(0,0,0)')
        .attr('opacity',0.3);

});