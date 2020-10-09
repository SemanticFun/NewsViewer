<%@ 
   page	import="JavaTest.DB"
		import="JavaTest.Cluster"
		import="JavaTest.Node"
		import="JavaTest.Edge"
		import="JavaTest.News"
		import="JavaTest.Record"
		import="java.io.*"
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
		String id_cl_form = request.getParameter("id_cl");
		String id_back_form = request.getParameter("id_back");

		System.out.println(start_form + " " + end_form);
	%>
<html>
	<head> 
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<script type="text/javascript" src="d3.v4.js"></script>
		<script type="text/javascript" src="cluster_script.js"></script>
		<link rel="stylesheet" type="text/css" href="style.css">
		
		<title> News Viewer </title>
	</head>
	
	<body bgcolor="#ffffff">
	
	<%
		Vector<Record> vettore;
		Record temp = null;
		String JSON = "";
		String columns = "{\"columns\": [\"date\", \"author\", \"channel\", \"title\", \"text\"]}";
		
		int id_cl = 0, id_back=0;
		try {
			id_cl = Integer.parseInt(id_cl_form);
			id_back = Integer.parseInt(id_back_form);
		} catch (Exception e) {
			System.out.println(e);
			%>
			<script>
				location.href="index.jsp";
			</script>
			<%
		}

		Cluster cluster = DB.loadNewsFromCluster(id_cl);
		temp = DB.loadRecord(id_cl);
		//initialize JSON string
		
		JSON = "{ \"documents\": [ ";
		
		//print news
		for (int d = 0; d < cluster.getNews().size(); d++){
			JSON += "{\"date\": \"" + cluster.getNews().elementAt(d).getDate() + "\", " +
					"\"author\": \"" + cluster.getNews().elementAt(d).getAuthor() + "\", " +
					"\"channel\": \"" + cluster.getNews().elementAt(d).getChannel() + "\", " +
					"\"title\": \"" + cluster.getNews().elementAt(d).getTitle().replace('"', ' ') + "\", " +
					"\"text\": \"" + cluster.getNews().elementAt(d).getPost().replace('"', ' ') + "\" }";
			if (d != cluster.getNews().size() - 1)
				JSON+= ", ";
		}
		JSON += "], \"nodes\": [";
		
	 	//print nodes
	 	for (int n = 0; n < cluster.getNode().size(); n++){
			JSON += "{ \"id\": \"" + cluster.getNode().elementAt(n).getSource() + "\", " + 
	 				"\"value\": " + cluster.getNode().elementAt(n).getValue() + " }";
			if (n != cluster.getNode().size() - 1)
				JSON+= ", ";
		}
		JSON += "], \"links\": [";
	 	
	 	//print edges
	 	for (int e = 0; e < cluster.getEdge().size(); e++){
			JSON += "{ \"source\": \"" + cluster.getEdge().elementAt(e).getSource() + "\", " + 
	 				"\"target\": \"" + cluster.getEdge().elementAt(e).getTarget() + "\" }";
			if (e != cluster.getEdge().size() - 1)
				JSON+= ", ";
		}
		JSON += "] }";
		
		String temp_string = temp.toJSON();
	%>
	
	<script>
		openFile(<%=temp_string%>, <%=JSON%>, <%=columns%>);
	</script>
	
	<!-- questo form serve per tornare al circle packing -->
	<form method="POST" action="Circle.jsp" name="circle_form">
		<input type="hidden" name="id" value=<%=id_back%>>;
		<input type="hidden" name="date_start" value="<%= start_form %>">
		<input type="hidden" name="date_end" value="<%= end_form %>">
	</form>

	</body>
</html>