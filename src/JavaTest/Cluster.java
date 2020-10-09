package JavaTest;

import java.util.Vector;

public class Cluster {
	Vector<Node> node_vector = new Vector<Node>();
	Vector<Edge> edge_vector = new Vector<Edge>();
	Vector<News> news_vector = new Vector<News>();
	
	public Cluster(Vector<Node> node_vector, Vector<Edge> edge_vector, Vector<News> news_vector){
		this.node_vector = node_vector;
		this.edge_vector = edge_vector;
		this.news_vector = news_vector;
	}
	
	public void setNode(Vector<Node> node_vector){
		this.node_vector = node_vector;
	}
	public void setNews(Vector<News> news_vector){
		this.news_vector = news_vector;
	}
	public void setEdge(Vector<Edge> edge_vector){
		this.edge_vector = edge_vector;
	}
	
	public Vector<Node> getNode(){
		return this.node_vector;
	}
	public Vector<News> getNews(){
		return this.news_vector;
	}
	public Vector<Edge> getEdge(){
		return this.edge_vector;
	}
}
