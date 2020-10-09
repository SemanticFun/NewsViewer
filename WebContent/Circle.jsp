<%@ 
   page	import="JavaTest.DB"
		import="JavaTest.Cluster"
		import="JavaTest.Node"
		import="JavaTest.Edge"
		import="JavaTest.News"
		import="JavaTest.Record"
		import="java.io.*"
		import="java.util.*"
		language="java"
		errorPage="error.jsp"
		contentType="text/html; charset=UTF-8"
		pageEncoding="UTF-8"
%>

<!DOCTYPE html>
	<%
		String start_form = request.getParameter("date_start");
		String end_form = request.getParameter("date_end");
		String id_form = request.getParameter("id");
		System.out.println(start_form + " " + end_form);
	%>
	
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<script type="text/javascript" src="d3.v4.js"></script>
		<script type="text/javascript" src="circle_script.js"></script>
		<link rel="stylesheet" type="text/css" href="style.css">
		
		<title> News Viewer </title>
	</head>
	
	<body bgcolor="#ffffff">

		<form action = "index.jsp" name="index_form" method=POST>
			<input type="hidden" name="date_start" value="<%= start_form %>">
			<input type="hidden" name="date_end" value="<%= end_form %>">
		</form>

		<%
			int id = 0;
			try {
				id = Integer.parseInt(id_form);
			} catch (Exception e) {
				System.out.println(e);
				%>
				<script>
					location.href="index.jsp";
				</script>
				<%
			}
		 %>

		<form action="Cluster.jsp" name="cluster_form" method=POST>
			<input type="hidden" name="date_start" value="<%= start_form %>">
			<input type="hidden" name="date_end" value="<%= end_form %>">
			<input type="hidden" name="id_cl">
			<input type="hidden" name="id_back" value=<%= id %>>
		</form>
		<%
			Vector<Record> vettore = DB.loadList(id);
			Record record_temp = DB.loadRecord(id);
	
			String JSON = "{ \"name\": \"clusters\", \"string\": \"cluster\", \"children\": [ ";
			for (int r = 0; r < vettore.size(); r++){
				JSON += "{ \"name\": \"" + vettore.elementAt(r).id_cluster + "\", " + 
						"\"string\": \"" + vettore.elementAt(r).name + "\", " + 
						"\"size\": " + vettore.elementAt(r).size + ", " + 
						"\"top_publisher\": \"" + vettore.elementAt(r).top_publisher + "\", " + 
						"\"worst_publisher\": \"" + vettore.elementAt(r).worst_publisher + "\", " + 
						"\"facebookCount\": " + vettore.elementAt(r).facebookCount + ", " + 
						"\"twitterCount\": " + vettore.elementAt(r).twitterCount + ", " + 
						"\"siteCount\": " + vettore.elementAt(r).siteCount + ", " + 
						"\"start\": \"" + vettore.elementAt(r).start + "\", " + 
						"\"end\": \"" + vettore.elementAt(r).end + "\"}";			
				if (r != vettore.size() - 1)
					JSON+= ", ";
			}
			JSON += "] }";
		%>

		<script>
			createCirclePacking(<%= record_temp.toJSON()%>, <%=JSON%>);
		</script>

	</body>
	
</html>