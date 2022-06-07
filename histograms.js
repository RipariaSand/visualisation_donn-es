const largeur = window.innerWidth;
const hauteur = window.innerHeight;


let canevas = d3.select("body")
    .append("svg")
    .attr("width", 800)
    .attr("height", 500) 

canevas.append("text")
    .attr("x", 570)             
    .attr("y", 50)
    .attr("text-anchor", "middle")  
    .style("font-size", "25px")
    .style("font-family", "Arial") 
    .style("text-anchor", "middle")  
    .text("Number of records lost per sector");

d3.csv("/data/DataBreaches(2004-2021).csv",function(d){
    return {
        entity : d.Entity,
        year : d.Year,
        records : d.Records,
        org_type : d.Organization_type,
        method : d.Method
            }
    }).then(donnees =>{
            

    // HISTOGRAMME :
    // création du sous-ensemble de org_type :
    
    const main_org_types = d3.rollups(donnees, v => d3.sum(v,d => d.records), d => d.org_type)
        .filter(d => d[1]>3e08)
        .sort((a, b) => b[1] - a[1]);   
    
    //création des échelles :
    const y1 = d3.scaleLinear()
       .domain([0, d3.max(main_org_types, d => d[1])])
       .range([0,300]);
    const x1 = d3.scaleBand()
       .domain(main_org_types.map(d => d[0]))
       .rangeRound([20,700])
       .padding(0.1);    
   
    //création de l'axe :
    canevas.append("g")
       .attr("transform","translate(50, 350)")
       .call(d3.axisBottom(x1))
           .selectAll("text")
           .style("font-size","10px")
           .style("fill","#ffd747")
           .style("text-anchor", "end")
           .attr("dx", "-.8em")
           .attr("dy", ".15em")
           .attr("transform", "rotate(-65)");
   
    //création de l'histogramme :    
    var rects = canevas.selectAll("rect")
       .data(main_org_types)

    rects
     .data(main_org_types)
     .enter()
     .append("rect")
     .transition()
     .duration(1000)
       .attr("y", d => 350 - y1(d[1]))
       .attr("x", d => 50 + x1(d[0]))
       .attr("width", x1.bandwidth())
       .attr("height", d => y1(d[1]))
       .style('fill','#ffd747')
       .style('stroke', "black")

    
    canevas.selectAll("text.rect")
        .data(main_org_types)
     .enter().append("text")
        .style("fill","#ffd747")
        .attr("y", d => 340 - y1(d[1]))
        .attr("x", d => 53 + x1(d[0]))
        .text(d => Math.round(d[1]/1e06) + " mio");

   // Selection des rectangles :
   rects
    .on('mouseover', function (event, d) {
       d3.select(this).transition()
           .duration('50')
           .attr('opacity', '.85');     
   })
    .on('mouseout', function (event, d) {
       d3.select(this).transition()
           .duration('50')
           .attr('opacity', '1');
   });

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



// UPDATE HISTOGRAM : 

function update(data, date) {
    
    // filtre par dates :

    if (date == undefined){
        filtered = data
    } else {
        filtered = date_filter(data, date)
    }    

    //création des échelles :
    const y1 = d3.scaleLinear()
        .domain([0, d3.max(filtered, d => d[1])])
        .range([0,300]);
    const x1 = d3.scaleBand()
        .domain(filtered.map(d => d[0]))
        .rangeRound([20,700])
        .padding(0.1);    
    
    //création de l'axe :
    canevas.append("g")
        .attr("transform","translate(0, 350)")
        .call(d3.axisBottom(x1))
            .selectAll("text")
            .style("font-size","10px")
            .style("fill","#ffd747")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
    
    //création de l'histogramme :    
    var u = canevas.selectAll("rect")
        .data(filtered)

    u
      .data(filtered)
      .enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
        .attr("y", d => 350 - y1(d[1]))
        .attr("x", d => x1(d[0]))
        .attr("width", x1.bandwidth())
        .attr("height", d => y1(d[1]))
        .style('fill','#ffd747')
        .style('stroke', "black")
  
    }

  
function date_filter(data, date){

    const filter_data = data
        .filter(d => d.year == date);
    const filtered = d3.rollups(filter_data, v => d3.sum(v,d => d.records), d => d.org_type)
        .filter(d => d[1] > d3.max(filter_data, d => d.records)/10)
        .sort((a, b) => b[1] - a[1]);
    return filtered;
    }

});
