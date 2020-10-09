function openFile(record, JSON, col, back){
	d3.select("body").selectAll("svg").remove();
	d3.select("body").selectAll("table").remove();
	d3.select("body").selectAll("button").remove();
	d3.select("body").selectAll("input").remove();
	d3.select("body").selectAll("br").remove();
	d3.select("body").selectAll("p").remove();

	var t = document.createTextNode(record["name"]);
	var title = document.createElement("p");
	title.setAttribute("id", "title");
	title.appendChild(t);
	title.onclick = function() {
		openFile(record, JSON, col, back);	
	}

	var par = document.createElement("p");
	par.setAttribute("id", "paragraph_cluster");
	par.appendChild(document.createTextNode("periodo: " + record["start"] + " - " + record ["end"]));
	par.appendChild(document.createElement("br"));
	par.appendChild(document.createTextNode("top_publisher: " + record["top_publisher"]));
	par.appendChild(document.createElement("br"));
	par.appendChild(document.createTextNode("worst_publisher: " + record["worst_publisher"]));
	par.appendChild(document.createElement("br"));
	par.appendChild(document.createTextNode("news from facebook: " + record["facebookCount"]));
	par.appendChild(document.createElement("br"));
	par.appendChild(document.createTextNode("news from twitter: " + record["twitterCount"]));
	par.appendChild(document.createElement("br"));
	par.appendChild(document.createTextNode("news from site: " + record["siteCount"]));
	
	var image = document.createElement("img");
	image.setAttribute("id", "back_img");
	image.setAttribute("width", "30");
	image.setAttribute("height", "30");
	image.src="back.jpg";
	image.onclick = function(){
		console.log(document.getElementsByName("circle_form")[0].id.value);
		circle_form.submit();
	};
	
	document.body.appendChild(image);
	document.body.appendChild(title);
	document.body.appendChild(par);

	var graphtitle = document.createElement("p");
	graphtitle.setAttribute("id", "titlegraph");
	var ti = document.createTextNode("Keywords graph");
	graphtitle.appendChild(ti);
	document.body.appendChild(graphtitle);
	
	var channelTitle = document.createElement("p");
	channelTitle.setAttribute("id", "titleChannel");
	var tc = document.createTextNode("Author Pie");
	channelTitle.appendChild(tc);
	document.body.appendChild(channelTitle);
	
	var authorTitle = document.createElement("p");
	authorTitle.setAttribute("id", "titleAuthor");
	var ta = document.createTextNode("Channel Pie");
	authorTitle.appendChild(ta);
	document.body.appendChild(authorTitle);

	var body = d3.select("body");
	var svg = body.select("svg");
	svg.remove();
	
	body.style("background-color", "white");
		
	var columns;
	var doc = [];
	
	var clickNode = false;
	var wordSelected = "";
	
	var margin = 40;
	
	var width = window.innerWidth - margin;
	var height = window.innerHeight - margin;
	

	if(width < 850)
		width = 850;
	if(height < 600)
		height = 600;
	
	/*
	if (width < height){
		var temp = width;
		width = height;
		height = temp;
	}
	*/
	if(width < height)
		height = width * 3 / 4;
	
	/*
	var zoom = d3.zoom()
		.scaleExtent([0.4,2])
		.on("zoom", zoomed);
	*/
	
	//////////////////////////////////////////////////creazione svg//////////////////////////////////////////////////////
	var svg = body.append("svg")
		.attr("width", width)
		.attr("height", height);

	var graphHeight = height - 155;
	
	var svgGraph = svg.append("svg")
		.attr("y", 155)
		.attr("width", width/2)
		.attr("height", graphHeight);
		//.call(zoom);
		//.on("dblclick.zoom", function(d){d3.event.stopPropagation();});
	
	var graphBorder = svgGraph.append("rect")
	  .attr("x", 0)
	  .attr("y", 0)
	  .attr("height", graphHeight)
	  .attr("width", width/2)
	  .style("stroke", "black")
	  .style("fill", "none")
	  .style("stroke-width", 2)
	  .style("pointer-events", "visible")
	  .style("cursor","default");
		
	var gGraph = svgGraph.append("g");

	var svgPie = svg.append("svg")
		.attr("width", width/2)
		.attr("height", height)
		.attr("x", width/2);
	
	var svgAuthorPie = svgPie.append("svg")
		.attr("width", width/2)
		.attr("height", height/2)
		.attr("x",0)
		.attr("y", 0);
	
	/*var pieBorder = svgPie.append("rect")
	  	.attr("x", 0)
	  	.attr("y", 0)
	  	.attr("height", height)
	  	.attr("width", width/2)
	  	.style("stroke", "black")
	  	.style("fill", "none")
	  	.style("stroke-width", 2);
	*/
	
	var svgAuthorPieBorder = svgAuthorPie.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("height", height/2)
		.attr("width", width/2)
		.style("stroke", "black")
		.style("fill", "none")
		.style("stroke-width", 2);

	var svgChannelPie = svgPie.append("svg")
		.attr("width", width/2)
		.attr("height", height/2)
		.attr("x", 0)
		.attr("y", height/2);

	var svgChannelPieBorder = svgChannelPie.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("height", height/2)
		.attr("width", width/2)
		.style("stroke", "black")
		.style("fill", "none")
		.style("stroke-width", 2);
	
	authorTitle.style.marginTop = height/2 + "px";
	authorTitle.style.marginLeft = width/2 + "px";
	
	channelTitle.style.marginTop = "0px";
	channelTitle.style.marginLeft = width/2 + "px";
	
	var outerRadius = (height/2 - 20) /2;
	var innerRadius = outerRadius / 1.3;

	var gAuthorPie = svgAuthorPie.append("g")
		.attr("id", "gAuthor")
		.attr("transform", "translate(" + (outerRadius+10) + "," + height/4 +")");
	
	var gChannelPie = svgChannelPie.append("g")
		.attr("id","gChannel")
		.attr("transform", "translate(" + (outerRadius+10) + "," + height/4 +")");
	
	//////////////////////////////////////////fine creazione svg/////////////////////////////////////////////////////
	
	var color25 = d3.scaleOrdinal(d3.schemeCategory20);
	var color10 = d3.scaleOrdinal(d3.schemeCategory10);

	///////////////////////////////////////impostazione dati per torte/////////////////////////////////////////////////////////
	var authorSet = [{"name":"corrieredellasera", "value": 0, "color": color25(0)},
	                 {"name":"larepubblica", "value": 0, "color": color25(1)},
	                 {"name":"ilsole24ore", "value": 0, "color": color25(2)},
	                 {"name":"lagazzettadellosport", "value": 0, "color": color25(3)},
	                 {"name":"lastampa", "value": 0, "color": color25(4)},
	                 {"name":"ilmessaggero", "value": 0, "color": color25(5)},
	                 {"name":"ilrestodelcarlino", "value": 0, "color": color25(6)},
	                 {"name":"corrieredellosport", "value": 0, "color": color25(7)},
	                 {"name":"ilgiornale", "value": 0, "color": color25(8)},
	                 {"name":"avvenire", "value": 0, "color": color25(9)},
	                 {"name":"lanazione", "value": 0, "color": color25(10)},
	                 {"name":"tuttosport", "value": 0, "color": color25(11)},
	                 {"name":"libero", "value": 0, "color": color25(12)},
	                 {"name":"italiaoggi", "value": 0, "color": color25(13)},
	                 {"name":"ilgazzettino", "value": 0, "color": color25(14)},
	                 {"name":"ilfattoquotidiano", "value": 0, "color": color25(15)},
	                 {"name":"ilsecoloxix", "value": 0, "color": color25(16)},
	                 {"name":"iltirreno", "value": 0, "color": color25(17)},
	                 {"name":"ilmattino", "value": 0, "color": color25(18)},
	                 {"name":"ilgiorno", "value": 0, "color": color25(19)},
	                 {"name":"ansa", "value": 0, "color": color25(20)},
	];
	var controlAuthorSet = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
	var channelSet = [
	                  {"name":"twitter", "value": 0, "color": color10(0)},
	                  {"name":"facebook", "value": 0, "color": color10(1)},
	                  {"name":"sito", "value": 0, "color": color10(2)}
	];
	var controlChannelSet = [true,true,true];
	
	var newAuthorSet, newChannelSet, authorPath, channelPath, pie, arc;
	
	////////////////////////////////fine impostazione dati per torte/////////////////////////////////////////////////
	
	///////////////////zoom/////////////////////
	function zoomed() {
		gGraph.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ") scale(" + d3.event.transform.k + ")");
	}
	
	columns = col.columns;
	console.log(columns);
	// ho dovuto metterlo qui perchè l'apertura innestata di 2 file causa problemi
	//var columns = [];
	//d3.json("toLoadFiles/columns.json", function(error, file_col){
	//	if(error) throw error
		
	//	columns = file_col.columns;
	//});
	
	//var columns = "{\"columns\": [\"id\", \"date\", \"author\", \"channel\", \"text\"]}";

	
	/////////////////////////////////////////apertura file//////////////////////////////////////////////////////////
	//d3.json("toLoadFiles/" + filename+".json", function (error, file){
	//	if(error) throw error

	file = JSON;	
		//////////////////////////////////////creazione grafo///////////////////////////////////////////////////////7
		var simulation = d3.forceSimulation()
    		.force("link", d3.forceLink().id(function(d) { return d.id; }).distance (80))
    		.force("charge", d3.forceManyBody())
    		.force("center", d3.forceCenter( width/4  , height/2  ))
    		.on("end", function(){controlMovement = true; console.log(controlMovement)});
  
		//creazione dei link
		var link = gGraph.selectAll(".link")
			.data(file.links)
			.enter()
			.append("line")
			.attr("class", "link");
		//fine creazione link

		var timer;
		
		//creazione dei nodi
		var node = gGraph.selectAll(".node")		
			.data(file.nodes)
			.enter()
			.append("g")
			.attr("class", "node-graph")
			.style("font-family", "Times")
			.style("font-size", "18px")
			.on("dblclick", dblClickNode)			//doppio click seleziona una parola
			.on("mouseenter", mouseenter)			//mouse enter evidenzia nodi e link collegati
			.on("mouseleave", mouseleave)			//mouse leave toglie evidenziazione
			.call(d3.drag()
						.on("start", dragstarted)	//drag start fissa la posizione e colora di rosso
						.on("drag", dragged)		//drag sposta nodo in una posizione
						.on("end", dragended));
		
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			node.on("click", dblClickNode);
		} else {
			node.on("dblClick", dblClickNode);
		}
		
		//procedura per impostare la dimensione dei nodi
		var min = 999;
		var max = 0;

		for(var i = 0; i<file.nodes.length; i++){
			if(file.nodes[i].value>max)
				max = file.nodes[i].value;
			if(file.nodes[i].value<min)
				min = file.nodes[i].value;
		}
		var range = max - min;
		var slice = range/5;
  
		node.append("circle")
			.attr("r", function(d){
				for(var j=0; j<5; j++){
					if(min+slice*j < d.value &&d.value < min+slice*(j+1))
						return 5*(j+1);
				}
				return 10;
			});

		node.append("text")
			.text(function(d){return d.id});
		//fine creazione nodi
	 
		//attivazione "forza" su nodi e link
		simulation
			.nodes(file.nodes)
			.on("tick", ticked);

		simulation.force("link")
			.links(file.links);
		///////////////////////////////////fine creazione grafo////////////////////////////////////////////////////////////

		doc = file.documents;
		
		for(var i=0; i<doc.length; i++){
			for(var j=0; j<authorSet.length; j++)
				if(authorSet[j].name == doc[i].author)
					authorSet[j].value++;
			for(var k=0; k<channelSet.length; k++){
				if(channelSet[k].name == doc[i].channel)
					channelSet[k].value++;
			}
		}
		console.log(authorSet,channelSet);
		for(var i = 0; i<authorSet.length; i++){
			if (authorSet[i].value == 0){
				authorSet.splice(i, 1);
				i--;
			}
		}
		for(var i = 0; i<channelSet.length; i++){
			if (channelSet[i].value == 0){
				channelSet.splice(i, 1);
				i--;
			}
		}
		console.log(authorSet, channelSet);
		//visto che è il primo giro lo imposto manualmente, gli altri useranno prepareforPie(doc)
		//prepareForPie(doc);
		
		/////////////////////////////////////inizio creazione torte///////////////////////////////////////////////////////7
		//impostazioni per torte e archi
		pie = d3.pie()
			.value(function(d){return d.value;})
			.padAngle(.02);

		arc = d3.arc()
			.outerRadius(outerRadius)
			.innerRadius(innerRadius);
		//fine impostazioni per torte e archi
		
		//testo all'interno della torta author
		var authorText = gAuthorPie
			.append("text")
			.attr("text-anchor", "middle")
			.html("Move the cursor over an arc");
		
		//creazione archi per torta author
        authorPath = gAuthorPie.selectAll("path")
        	.data(pie(authorSet))
        	.enter()
        	.append("path")
        	.attr("class", "path-author")
        	.attr("d", arc)
        	.attr("fill", function(d) {
        		return d.data.color; 
        	})
        	.each(function(d) {this._current = d; })
        	
        //mouse over mostra i dati dell'arco selezionato
        authorPath.on("mouseover", function(d) {
        	//console.log(d);
        	var sum = 0;
        	for(i=0; i<authorSet.length; i++){
        		sum += authorSet[i].value;
        	}
        	//l'istruzione seguente mi serve per avere 2 decimali
        	var percent = Math.round((d.data.value / sum * 100) * Math.pow(10, 2))/Math.pow(10,2);
        	authorText.style("font-size", "20px").html(d.data.name + "," + percent +"%");
        });
        
        //mouse out toglie i dati dell'arco selezionato
        authorPath.on('mouseout', function() {
            authorText.style("font-size", "16px").html("Move the cursor over an arc");
         });
        
        //creazione legenda torta author
    	var legendAuthor = gAuthorPie.selectAll(".legend")
        	.data(authorSet)
        	.enter()
        	.append("g")
        	.attr("class", "legend")
        	.attr("transform", function(d, i) {
        		var y = authorSet.length / 2;
        		return "translate(" + (outerRadius + 20) + "," +  (-y*14 + i*14) + ")";
        	});

    	//creazione rettangoli legenda author
    	legendAuthor.append("rect")
    		.attr("width", 12)
    		.attr("height", 12)
    		.attr("class","legendrect")
    		.style("fill", function (d){return d.color;})
    		.style("stroke", "black")                                   
    		.on("click", function(label, i) {                     
    			var rect = d3.select(this);                          
    			var enabled = true; 
    			if(controlAuthorSet[i] ){
    				controlAuthorSet[i] = false;
    				rect.style("opacity", 0.2);
    			}else{
    				controlAuthorSet[i] = true;
    				rect.style("opacity", 1);
    			}

    			analyzeDocuments();
    			
    			updatePie();
    		});
        
    	//aggiunta testo rettangoli legenda author
    	legendAuthor.append("text")
    		.attr("x", 14 + 4)
    		.attr("y", 14 - 4)
    		.text(function(d) { return d.name; });
    	
    	//testo all'interno della torta channel
		var channelText = gChannelPie
			.append("text")
			.attr("text-anchor", "middle")
			.html("Move the cursor over an arc");
 
		//creazione archi per torta channel
        channelPath = gChannelPie.selectAll("path")
        	.data(pie(channelSet))
        	.enter()
        	.append("path")
        	.attr("d", arc)
        	.attr("fill", function(d) { 
        		return d.data.color; 
        	})
        	.each(function(d) { this._current = d; });

        //mouse over mostra i dati dell'arco selezionato
        channelPath.on("mouseover", function(d) {
        	var sum = 0;
        	for(i=0; i<channelSet.length; i++){
        		sum += channelSet[i].value;
        	}
        	//l'istruzione seguente mi serve per avere 2 decimali
        	var percent = Math.round((d.data.value / sum * 100) * Math.pow(10, 2))/Math.pow(10,2);
        	channelText.style("font-size", "22px").html(d.data.name + "," + percent + "%");
        });
        
        //mouse out mostra i dati dell'arco selezionato
        channelPath.on('mouseout', function() {
            channelText.style("font-size", "16px").html("Move the cursor over an arc");
        });

        //creazione rettangoli legenda channel
        var legendChannel = gChannelPie.selectAll(".legend")
        	.data(channelSet)
        	.enter()
        	.append("g")
        	.attr("class", "legend")
        	.attr("transform", function(d, i) {
        		var y = channelSet.length / 2;
        		return "translate(" + (outerRadius + 20) + "," + (-y*17 + i*17) + ")";
        	});

        //aggiunta testo rettangoli legenda channel
        legendChannel.append("rect")
        	.attr("width", 14)
        	.attr("height", 14) 
        	.attr("class","legendrect")
        	.style("fill", function(d) {return d.color;})
        	.style("stroke", "black")
        	.on("click", function(label, i) {
    			var rect = d3.select(this);                          
        		if(controlChannelSet[i] ){
    				controlChannelSet[i] = false;
    				rect.style("opacity", 0.2);
    				
    			} else {
    				controlChannelSet[i] = true;
    				rect.style("opacity", 1);
    			}

    			analyzeDocuments();
    			
    			updatePie();
        	});
    
        //aggiunta testo rettangoli legenda author
        legendChannel.append("text")
        	.attr("x", 14 + 4)
        	.attr("y", 14)
        	.text(function(d) { return d.name; });
		////////////////////////////////////fine creazione torte/////////////////////////////////////////////////////////////
		
        var mybr = document.createElement("br");
        document.body.appendChild(mybr);
        
		var button = document.createElement("input");
		button.type = "button";
		button.value = "reset all selections";
		button.onclick = reLoad;
		document.body.appendChild(button);
		
		//creazione tabella
		var documentTable = createTable(doc); 

		//seleziono solo i documenti che contengono quella parola
		function dblClickNode(d){

			d3.select(this).classed("fixed", d.fixed = false);
			
			if(wordSelected != d.id){
				var temp = document.getElementsByClassName("node-graph");
				for(var i = 0; i<temp.length; i++){
					if(temp[i].className.baseVal != "node-graph fixed")
						temp[i].style.fill = "#ccc";
				}
				d3.select(this).style("fill", "blue");
				clickNode = true;
				wordSelected = d.id;
			}else{
				d3.select(this).style("fill", "#ccc");
				clickNode = false;
				wordSelected = "";
			}
			
			//console.log("entrato nel doppio click del nodo", d)
			
			analyzeDocuments();
		}
		
		//funzione che gestisce la posizione dei nodi e dei link
		function ticked() {
			link
				.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });

				node.attr("transform", function(d) {
					//controllo per non far uscire i nodi dall'area
					var posx, posy;
					
					if(d.x<=0)
						posx = 0;
					else if(d.x>=width/2)
						posx = width/2;
					else
						posx = d.x;
					
					if(d.y<=0)
						posy = 0;
					else if(d.y >= graphHeight)
						posy = graphHeight;
					else
						posy = d.y;
					
					return "translate(" + posx + "," + posy + ")";
				});
		}
		
		/////////////////////////inizio gestione dei movimenti dei nodi////////////////////////////////////////////////////////
		function dragstarted(d) {
			if(d.fx == null){
				d3.select(this).classed("fixed", d.fixed = true);
				d3.select(this).style("fill", "red");
			} else {
				d.fx = null;
				d.fy = null;
				d3.select(this).classed("fixed", d.fixed = false);
				d3.select(this).style("fill", "#ccc");
			}
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		}

		function dragged(d) {
			if(d.fx!=null){
				d3.select(this).classed("fixed", d.fixed = true);
				d3.select(this).style("fill","red");
			}
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		}

		function dragended(d) {
			if (!d3.event.active) simulation.alphaTarget(0);
		} 
		////////////////////////////////////fine gestione movimento dei nodi/////////////////////////////////////////////////////
		
		/////////////////////////////////////inizio gestione evidenziazione nodi e link//////////////////////////////////////////
		var connections = {};
		for (var i=0; i<file.nodes.length; i++){
			connections[i + "," + i] = 1;
		}
		file.links.forEach(function(d){
			connections[d.source.index + "," + d.target.index] = 1;
		});

		// quando il puntatore passa sopra ad un nodo, queste 3 funzioni evidenziano i nodi collegati ed i collegamenti tra essi
		function mouseenter(d){
			node.style("opacity", function (o) {
				return hasConnection(d, o) || hasConnection(o, d) ? 1 : 0.15;
			});
			
			link.style("opacity", function (l) {
				return l.source.index === d.index || l.target.index === d.index ? 1 : 0.15;
			});
		}
		
		function hasConnection(sour, targ){
			return connections[sour.index + "," + targ.index];
		}
		
		function mouseleave(){
			node.style("opacity", 1);
			link.style("opacity", 1);
		}
		///////////////////////////////////fine gestione evidenziazione nodi////////////////////////////////////////////////////
		
	//	});
	///////////////////////////////////////fine apertura file///////////////////////////////////////////////////////////////////

	//funzione che avvia le modifiche a tutti gli elementi presenti nella pagina
	function analyzeDocuments(){
		console.log("entrato in analyze documents");
		var documents = filterDocuments();
		documents = prepareForPie(documents);
		updatePie();
		createTable(documents);
	}
	
	//vengono selezionati solo i documenti che contengono la parola selezionata 
	//(la parola viene selezionata con il doppio click del mouse su un nodo)
	function filterDocuments(){
		console.log("entrato in filter documents")
		var newDocuments = [];
		var j = 0;
		
		for(var i=0; i<doc.length; i++){
			if(clickNode){
				if(contains(wordSelected, doc[i])){
					newDocuments[j]=doc[i];
					j++;
				}
			} else {
				newDocuments[j] = doc[i];
				j++;
			}
		}
		return newDocuments;
	}
	
	//pulisce i vettori authorSet e channelSet in modo che i loro valori vengano resettati a 0,
	//conta quanti documenti sono presenti per ogni categoria di autore e ogni categoria di canale
	//a meno che un certo canale o un certo autore non sia stato deselezionato
	//i canali e gli autori vengono deselezionati cliccando sui rettangoli della legenda
	function prepareForPie(documents){
		console.log("entrato in prepareForPie")
		var newDocuments = [];
		var l = 0;
		//pulizia authorSet e channelSet
		for(var i = 0; i<authorSet.length; i++)
			authorSet[i].value = 0;
		for(var i = 0; i<channelSet.length; i++)
			channelSet[i].value = 0;
		
		//riempimento vettori
		for(var i=0; i<documents.length; i++){
			var ok = true;
			for(var j=0; j<authorSet.length; j++){
				if(authorSet[j].name == (documents[i].author)){
					if(!controlAuthorSet[j]){
						ok = false;
						break;
					}
					break;
				}	
			}
			for(var k=0; k<channelSet.length; k++){
				if(channelSet[k].name == (documents[i].channel)){
					if(!controlChannelSet[k]){
						ok = false;
						break;
					}
					break;
				}
			}
			if(ok){
				authorSet[j].value++;
				channelSet[k].value++;
				newDocuments[l] = documents[i];
				l++;
			}
		}//fine riempimento vettori
		
		//new documents contiene i documenti appartenenti ad autori E a canali NON deselezionati 
		return newDocuments;
	}
	
	//funzione che controlla se una parola è contenuta in un documento
	function contains(word, document){
		var num = word.length - 1;
		word = word.substring(0, num);
		if(title)
			var title = document.title.toLowerCase();
		var text = document.text.toLowerCase();
		//console.log( word, title, text);
		//console.log(title.indexOf(word) !== -1 , text.indexOf(word) !== -1)
		if(title)
			return(title.indexOf(word) !== -1 || text.indexOf(word) !== -1);
		else
			return(text.indexOf(word) !== -1);
		
	}
	
	//gestione della modifica agli archi di entrambe le torte
    function updatePie(){
    	authorPath = authorPath.data(pie(authorSet));
		
		authorPath.transition()                                
			.duration(750)                                     
			.attrTween("d", function(d) {                        
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t)); 
				};
			});
		
    	channelPath = channelPath.data(pie(channelSet));
		
		channelPath.transition()                                
			.duration(750)                                     
			.attrTween("d", function(d) {                        
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t)); 
				};
			});
    }
	
	//resetta tutti i valori impostati
	function reLoad(){
		//reset nodo selezionato (e quindi parola selezionata)
		var temp = document.getElementsByClassName("node-graph");
		for(var i = 0; i<temp.length; i++){
			if(temp[i].className.baseVal != "node-graph fixed")
				temp[i].style.fill = "#ccc";
		}
		clickNode = false;
		wordSelected = "";
		
		//reset deselezionamenti della legenda
		controlAuthorSet = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
		controlChannelSet = [true,true,true];
		var rectangle = document.getElementsByClassName("legendrect");
		for(var i=0;i<rectangle.length; i++){
			rectangle[i].style.opacity = 1;
		}
		
		//vengono reimpostati tutti i documenti nella tabella e nelle torte
		var documents = prepareForPie(doc);
		updatePie();
		createTable(documents);
	}
	
	/////////////////////////////////////////crea la tabella/////////////////////////////////////////////////////
	var ascending = null;
	function createTable(documents){
		d3.select("body").selectAll("table").remove();
		
		var table = body.append("table").attr("class","table")
		.attr("border", 1).attr("width", width);
		var thead = table.append("thead");
		
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.attr("class", "th")
			.attr("width", function(d){
				if ("date" == d)
					return 90;
			})
			.style("cursor", "pointer")
			.text(function(d){return d;});
		
		var headerCell = document.getElementsByClassName("th");
		for(var j=0; j<headerCell.length; j++){
			headerCell[j].addEventListener("click", sortDocument, false);
		}
		
		function sortDocument(d){
			var property = d.target.__data__;
			
			(!ascending) ? ascending = true : ascending = false;
		  
			documents.sort( function( a, b ){
				var c = a[property].toString(), d = b[property].toString()

				if ( c == d ) return 0;
					return Boolean(ascending) ? d < c ? 1 : -1 : d > c ? 1 : -1
			});
			createTable(documents);
		}

		var tbody = table.append("tbody");
		
		var rows = tbody.selectAll("tr")
			.data(documents)
			.enter()
			.append("tr");
		
		var cells = rows.selectAll("td")
			.data(function(row){
				return columns.map(function(column){
					return {column: column, value:row[column]};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family:Garamond")
			.html(function(d){return d.value;});

		return table;
	} 
	//////////////////////////////////////fine creazione tabella/////////////////////////////////////////////
}