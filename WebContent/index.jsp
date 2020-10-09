<%@
   page import="JavaTest.DB"
		import="JavaTest.Cluster"
		import="JavaTest.Node"
		import="JavaTest.Edge"
		import="JavaTest.News"
		import="JavaTest.Record"
		import="JavaTest.TimeTrack"
		import="java.io.*"
		import="java.text.SimpleDateFormat"
		import="java.util.*"
		errorPage="error.jsp"
		language="java"
		contentType="text/html; charset=UTF-8"
		pageEncoding="UTF-8"
%>

<!DOCTYPE html>
<%
	String start_form = request.getParameter("date_start");
	String end_form = request.getParameter("date_end");
	//System.out.println(start_form + " " + end_form);
%>

<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<script type="text/javascript" src="d3.v4.js"></script>
		<script type="text/javascript" src="index_script.js"></script>
		
		<style>
			table{
				border-collapse:collapse;
			}
			th{
				padding: 5px;
				text-align: center;
				border-bottom: 1px solid black;
			}
			td{
				padding: 5px;
				text-align: center;
				border-bottom: 1px solid black;
			}
			.colorable:hover{
				background-color: #dbdbdb;
				cursor:pointer;
			}
			.invisible{
				display:none;
			}
		</style>
		<title>News Viewer</title>
	</head>
	<body bgcolor="#ffffff">
		<div align="center">
			<h1>NewsViewer</h1>
		</div>
	
		<p align="center">
		Welcome to NewsViewer.<br>
		Il servizio raccoglie le notizie pubblicate quotidianamente sui principali canali di comunicazione dai principali giornali italiani.<br>
		Attraverso questo sistema è possibile visionare le notizie raggruppate in base al topic.<br>
		Per cominciare occorre scegliere il periodo di cui si vogliono visionare le news.<br>
		</p>

		<div align="center">
			<form action = "index.jsp" method = POST>
				<input type = "date" name = "date_start">
				<input type = "date" name = "date_end">
				<input type = "submit" value = "invia date">
			</form>
		</div>
				
		<form action = "Circle.jsp" name = "form_id" method = POST>
			<input type = "hidden" name = "id"></input>
			<input type = "hidden" name = "date_start" value = "<%= start_form %>">
			<input type = "hidden" name = "date_end" value = "<%= end_form %>">
		</form>
		
		<%
		Vector<Record> vettore = new Vector<Record>();

		if(start_form!=null && end_form != null){
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			Date start = formatter.parse(start_form);
			Date end = formatter.parse(end_form);
			vettore = DB.loadList(start_form, end_form, 0);
			%>
			<br><br>
			<div align="center">
				<table>
					<tr class="first-row">
						<th class="invisible">id_cluster</th>
						<th>nome</th>
						<th class="invisible">inizio</th>
						<th class="invisible">fine</th>
						<th class="invisible">n. giorni</th>
						<th>top publisher</th>
						<th>worst publisher</th>
						<th>news da facebook</th>
						<th>news da twitter</th>
						<th>news da siti web</th>
					</tr>
			<%
				for (Record r : vettore){
			%>
					<tr class=colorable>
						<td class="invisible"><%=r.id_cluster %></td>
						<td><%=r.name %></td>
						<td class="invisible"><%=r.start %></td>
						<td class="invisible"><%=r.end %></td>
						<td class="invisible"><%=r.periodicity %></td>
						<td><%=r.top_publisher %></td>
						<td><%=r.worst_publisher %></td>
						<td><%=r.facebookCount%></td>
						<td><%=r.twitterCount%></td>
						<td><%=r.siteCount%></td>
					</tr>
			<%
				}
			%>
				</table>
			</div>
	<%
		}
		
		Vector<TimeTrack> vect = new Vector<TimeTrack>();
		vect = DB.loadTimeTrack(start_form, end_form);
	
		String JSONtrack = "[";
		for (int d = 0; d < vect.size(); d++){
			JSONtrack += 
				"{ \"date\": \"" + vect.elementAt(d).date + 
				"\", \"facebook\": " + vect.elementAt(d).facebook + 
				", \"twitter\": " + vect.elementAt(d).twitter + 
				", \"site\": " + vect.elementAt(d).site + 
				", \"corrieredellasera\": " + vect.elementAt(d).corrieredellasera + 
				", \"larepubblica\": " + vect.elementAt(d).larepubblica + 
				", \"ilsole24ore\": " + vect.elementAt(d).ilsole24ore + 
				", \"lagazzettadellosport\": " + vect.elementAt(d).lagazzettadellosport + 
				", \"lastampa\": " + vect.elementAt(d).lastampa + 
				", \"ilmessaggero\": " + vect.elementAt(d).ilmessaggero + 
				", \"ilrestodelcarlino\": " + vect.elementAt(d).ilrestodelcarlino + 
				", \"corrieredellosport\": " + vect.elementAt(d).corrieredellosport + 
				", \"ilgiornale\": " + vect.elementAt(d).ilgiornale + 
				", \"avvenire\": " + vect.elementAt(d).avvenire + 
				", \"lanazione\": " + vect.elementAt(d).lanazione + 
				", \"tuttosport\": " + vect.elementAt(d).tuttosport + 
				", \"libero\": " + vect.elementAt(d).libero + 
				", \"italiaoggi\": " + vect.elementAt(d).italiaoggi + 
				", \"ilgazzettino\": " + vect.elementAt(d).ilgazzettino + 
				", \"ilfattoquotidiano\": " + vect.elementAt(d).ilfattoquotidiano + 
				", \"ilsecoloxix\": " + vect.elementAt(d).ilsecoloxix + 
				", \"iltirreno\": " + vect.elementAt(d).iltirreno + 
				", \"ilmattino\": " + vect.elementAt(d).ilmattino + 
				", \"ilgiorno\": " + vect.elementAt(d).ilgiorno + 
				", \"ansa\": " + vect.elementAt(d).ansa +
				" }";
			if (d!= vect.size()-1)
				JSONtrack +=", ";
		}	
		JSONtrack += "]";
	%>
					
		<script>
			if (<%= JSONtrack %> != "")
				summaryGraph(<%=JSONtrack%>);
			
			var rows = document.getElementsByTagName("tr");
			for(var r=1; r<rows.length; r++){
				var row = rows[r];
				var id = row.getElementsByTagName("td")[0].innerHTML;
				row.onclick = function(myrow){
					return function(){
						document.getElementsByName("form_id")[0].id.value = myrow.getElementsByTagName("td")[0].innerHTML;
						form_id.submit();
					};
				}(row);
			}
		</script>
	</body>
</html>