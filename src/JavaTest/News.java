package JavaTest;

import java.sql.Date;
import java.util.Vector;

public class News {
	int ID;
	String author;
	String channel;
	String title;
	String post;
	Vector<String> link = new Vector<String>();
	Date date;
	
	public News(int ID, String author, String channel, Date date, String title, String post, String link){
		this.ID = ID;
		this.author = author;
		this.channel = channel;
		this.title = title;
		this.post = post;
		this.date = date;
		this.link.add(link);
	}
	
	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getChannel() {
		return channel;
	}

	public void setChannel(String channel) {
		this.channel = channel;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getPost() {
		return post;
	}

	public void setPost(String post) {
		this.post = post;
	}

	public Vector<String> getLink() {
		return link;
	}

	public void setLink(Vector<String> link) {
		this.link = link;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public void addLink(String link){
		this.link.add(link);
	}
	
	public String toString(){
		String link = "";
		for (String el : this.link){
			link += "<br>" + "<a href=\"" + el + "\">" + el + "</a>";
		}
		return "<html>" + 
			this.author + "<br>" + 
			this.channel + "<br>" + 
			this.date + "<br>" + 
			this.title + "<br>" + 
			this.post + link +"</html>";
	}
}
