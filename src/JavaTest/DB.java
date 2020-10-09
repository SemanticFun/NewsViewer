package JavaTest;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Vector;

public class DB {
	String host;
	String user;
	String pass;
	String dbName;
	String port;
	String connectionUrl;
	Statement cmd;
	ResultSet rs;
	String query;
	Connection con;
	
	public DB(String dbName){
		/*		inizializzazione con config.json
		
		// Recupero di dati di configurazione al DB attraverso l'apposito file Json
		String filePath = "./config.json";
		FileReader reader;
		
		//String current = new File("").getAbsolutePath();
		//System.out.println(current);
		//Lettura file
		try {
			//reader = new FileReader(current + "/config.json");
			reader = new FileReader(filePath);
			String fileContents = "";

			int j;

			while ((j = reader.read()) != -1) {
				char ch = (char) j;

				fileContents = fileContents + ch;
			}

			//Parsing del file Json
			JSONObject jsonObject = new JSONObject(fileContents);
			JSONObject database = new JSONObject(jsonObject.get(dbName).toString());
			
			this.host = database.get("host").toString();
			this.port = database.get("port").toString();
			this.user = database.get("user").toString();
			this.pass = database.getString("pass").toString();
			this.dbName = database.getString("dbname").toString();

		} catch (IOException | JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		this.connectionUrl = "jdbc:mysql://" + this.host + ":" + this.port + "/"+ this.dbName +"?autoReconnect=true&useSSL=false";
		*/
	
		//inizializzazione senza file config.json sul pc di federico
		
		this.user = "user";
		this.pass = "password";
		if (dbName.equals("somer"))
			this.connectionUrl = "jdbc:mysql://localhost:3306/somer?autoReconnect=true&useSSL=false";
		else if (dbName.equals("clusters"))
			this.connectionUrl = "jdbc:mysql://localhost:3306/clusters?autoReconnect=true&useSSL=false";
		else
			System.out.println("error");
		
		
		//inizializzazione senza file config.json su somer
		/*
		this.user = "user";
		this.pass = "password";
		if (dbName.equals("somer"))
			this.connectionUrl = "jdbc:mysql://localhost:3306/somer?autoReconnect=true&useSSL=false";
		else if (dbName.equals("clusters"))
			this.connectionUrl = "jdbc:mysql://localhost:3306/clusters?autoReconnect=true&useSSL=false";
		else
			System.out.println("error");
		*/
	}
		
	public void connect() throws ClassNotFoundException, SQLException{
		Class.forName("com.mysql.jdbc.Driver");
		this.con =  DriverManager.getConnection(this.connectionUrl,this.user,this.pass);
		this.cmd = con.createStatement();
	}
	
	public void close() throws SQLException{
		this.rs.close();
		this.cmd.close();
		this.con.close();
	}

	public static Record loadRecord (int id) throws ClassNotFoundException, SQLException{
		Record temp = null;
		
		DB clusters = new DB("clusters");
		clusters.connect();
		
		clusters.query = "select * from clusters.cluster where id_cluster = " + id + ""; 
		clusters.rs = clusters.cmd.executeQuery(clusters.query);
		while (clusters.rs.next())
			temp = new Record(
				clusters.rs.getInt("id_cluster"), 
				clusters.rs.getString("Name"), 
				clusters.rs.getDate("Start"), 
				clusters.rs.getDate("End"), 
				clusters.rs.getString("Days"), 
				clusters.rs.getString("Type"), 
				clusters.rs.getString("TopPublisher"), 
				clusters.rs.getString("WorstPublisher"), 
				clusters.rs.getShort("FacebookCount"), 
				clusters.rs.getShort("TwitterCount"), 
				clusters.rs.getShort("SiteCount"));
		return temp;
	}
	
	public static Vector<Record> loadList(int id) throws ClassNotFoundException, SQLException{
		Vector<Record> vect = new Vector<Record>();
		
		DB clusters = new DB("clusters");
		clusters.connect();
		
		clusters.query = "Select * from clusters.cluster where id_container = " + id + "";
		
		clusters.rs = clusters.cmd.executeQuery(clusters.query);
	
		while (clusters.rs.next())
			vect.add(new Record(
				clusters.rs.getInt("id_cluster"), 
				clusters.rs.getString("Name"), 
				clusters.rs.getDate("Start"), 
				clusters.rs.getDate("End"), 
				clusters.rs.getString("Days"), 
				clusters.rs.getString("Type"), 
				clusters.rs.getString("TopPublisher"), 
				clusters.rs.getString("WorstPublisher"), 
				clusters.rs.getShort("FacebookCount"), 
				clusters.rs.getShort("TwitterCount"), 
				clusters.rs.getShort("SiteCount")));
		
		System.out.println(vect);
		clusters.close();
		
		return vect;
	}
	
	public static Vector<Record> loadList(String start, String end, int id) throws ClassNotFoundException, SQLException{
		Vector<Record> vect = new Vector<Record>();
		
		DB clusters = new DB("clusters");
		clusters.connect();
		
		clusters.query = "Select c.* "
					   + "from clusters.cluster c join clusters.cluster c1 on c.id_cluster = c1.id_container "
					   + "where c.id_container = " + id + " and "
					   		 + "c.start >= '" + start + "' and "
					   		 + "c.end <= '" + end + "' "
					   + "group by c.id_cluster, c.Name, c.Start, c.End, c.Days, c.Type "
					   + "order by c.Start, -c.End";
		
		clusters.rs = clusters.cmd.executeQuery(clusters.query);
	
		while (clusters.rs.next())
			vect.add(new Record(
				clusters.rs.getInt("id_cluster"), 
				clusters.rs.getString("Name"), 
				clusters.rs.getDate("Start"), 
				clusters.rs.getDate("End"), 
				clusters.rs.getString("Days"), 
				clusters.rs.getString("Type"), 
				clusters.rs.getString("TopPublisher"), 
				clusters.rs.getString("WorstPublisher"), 
				clusters.rs.getShort("FacebookCount"), 
				clusters.rs.getShort("TwitterCount"), 
				clusters.rs.getShort("SiteCount")));
		
		System.out.println(vect);

		clusters.close();
		
		return vect;
	}
	
	public static Vector<TimeTrack> loadTimeTrack(String start, String end) throws SQLException, ClassNotFoundException{
		Vector<TimeTrack> vect = new Vector<TimeTrack>();
		
		DB clusters = new DB("clusters");
		clusters.connect();
		if (start == null || end == null)
			clusters.query = "select * "
						   + "from clusters.timetrack";
		else
			clusters.query = "select * "
						   + "from clusters.timetrack "
						   + "where date(date) >= date('" + start +"') and "
						   		 + "date(date) <= date('" + end + "');";
		
		clusters.rs = clusters.cmd.executeQuery(clusters.query);
		
		while (clusters.rs.next())
			vect.add(new TimeTrack(
				clusters.rs.getDate("date"),
				clusters.rs.getShort("facebook"),
				clusters.rs.getShort("twitter"),
				clusters.rs.getShort("site"),
				clusters.rs.getShort("corrieredellasera"),
				clusters.rs.getShort("larepubblica"),
				clusters.rs.getShort("ilsole24ore"),
				clusters.rs.getShort("agazzettadellosport"),
				clusters.rs.getShort("lastampa"),
				clusters.rs.getShort("ilmessaggero"),
				clusters.rs.getShort("ilrestodelcarlino"),
				clusters.rs.getShort("corrieredellosport"),
				clusters.rs.getShort("ilgiornale"),
				clusters.rs.getShort("avvenire"),
				clusters.rs.getShort("lanazione"),
				clusters.rs.getShort("tuttosport"),
				clusters.rs.getShort("libero"),
				clusters.rs.getShort("italiaoggi"),
				clusters.rs.getShort("ilgazzettino"),
				clusters.rs.getShort("ilfattoquotidiano"),
				clusters.rs.getShort("ilsecoloxix"),
				clusters.rs.getShort("iltirreno"),
				clusters.rs.getShort("ilmattino"),
				clusters.rs.getShort("ilgiorno"),
				clusters.rs.getShort("ansa")));
		return vect;
	}

	
	public static Cluster loadNewsFromCluster(int id) throws SQLException, ClassNotFoundException {
		Vector<Integer>	id_news_vector = new Vector<Integer>();
		Vector<Node> node_vector = new Vector<Node>();
		Vector<Edge> edge_vector = new Vector<Edge>();
		Vector<News> news_vector = new Vector<News>();

		DB clusters = new DB("clusters");
		DB somer = new DB("somer");
				
		clusters.connect();
		clusters.query = "Select ID_news from clusters.news where ID_cluster = " + id;
		clusters.rs = clusters.cmd.executeQuery(clusters.query);
		
		while (clusters.rs.next()){
			id_news_vector.add(clusters.rs.getInt("ID_news"));
		}
		
		clusters.query = "Select Name, Value from clusters.node where ID_cluster = " + id;
		clusters.rs = clusters.cmd.executeQuery(clusters.query);
		
		while (clusters.rs.next()){
			node_vector.add(new Node(
					clusters.rs.getString("Name"),
					clusters.rs.getFloat("Value")));
		}
		
		clusters.query = "Select Source, Target from clusters.edge where ID_cluster = " + id;
		clusters.rs = clusters.cmd.executeQuery(clusters.query);
		
		while (clusters.rs.next()){
			edge_vector.add(new Edge(
					clusters.rs.getString("Source"), 
					clusters.rs.getString("Target")));
		}		
		clusters.close();
		
		String where = "p.id_post in " + id_news_vector.toString() + ";";
		where = where.replace('[', '(');
		where = where.replace(']', ')');
		
		somer.connect();
		somer.query = "select p.id_post, "
							+ "channel, "
							+ "a.name as author, "
							+ "CASE WHEN p.title = \"\" THEN p.text_descr ELSE p.title END as title, "
							+ "date(pubDate) as date, "
							+ "text_descr as post, "
							+ "l.url as link "
					+ "from somer.post p join somer.rssfeed r on p.id_rss=r.id_rss "
									  + "join somer.author a on a.id_author = r.id_author "
									  + "left join link l on l.id_post = p.id_post "
					+ "where " + where;
		somer.rs = somer.cmd.executeQuery(somer.query);

		int trovato;
		while (somer.rs.next()){
			trovato = 0;
			for (News n : news_vector){
				if (somer.rs.getInt("id_post") == n.ID){
					n.addLink(somer.rs.getString("link"));
					trovato = 1;
					break;
				}
			}
			if (trovato == 0)
				news_vector.add(new News(
						somer.rs.getInt("id_post"), 
						somer.rs.getString("author"), 
						somer.rs.getString("channel"), 
						somer.rs.getDate("date"), 
						somer.rs.getString("title"), 
						somer.rs.getString("post"), 
						somer.rs.getString("link")));
		}
		
		somer.close();
		
		return new Cluster(node_vector, edge_vector, news_vector);
	}
}
