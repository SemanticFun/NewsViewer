package JavaTest;

import java.sql.Date;

public class Record {
	public int id_cluster;
	public String name;
	public Date start, end;
	public String periodicity;
	public String type;
	public String top_publisher;
	public String worst_publisher;
	public short facebookCount;
	public short twitterCount;
	public short siteCount;	public int size;

	public Record(){};
	
	public Record(int id_cluster, String name, Date start, Date end, String periodicity, String type,
			String top_publisher, String worst_publisher, short facebookCount, short twitterCount, short siteCount) {
		this.id_cluster = id_cluster;
		this.name = name;
		this.start = start;
		this.end = end;
		this.periodicity = periodicity;
		this.type = type;
		this.top_publisher = top_publisher;
		this.worst_publisher = worst_publisher;
		this.facebookCount = facebookCount;
		this.twitterCount = twitterCount;
		this.siteCount = siteCount;
		this.size = facebookCount + twitterCount + siteCount;
	}

	public int getId_cluster() {
		return id_cluster;
	}

	public String getName() {
		return name;
	}

	public Date getStart() {
		return start;
	}

	public Date getEnd() {
		return end;
	}

	public String getPeriodicity() {
		return periodicity;
	}

	public String getType() {
		return type;
	}

	public String getTop_publisher() {
		return top_publisher;
	}

	public String getWorst_publisher() {
		return worst_publisher;
	}

	public short getFacebookCount() {
		return facebookCount;
	}

	public short getTwitterCount() {
		return twitterCount;
	}

	public short getSiteCount() {
		return siteCount;
	}

	public int getSize() {
		return size;
	}

	public String toJSON(){
		String json;
		json = 	"{\"id_cluster\": " + this.id_cluster + ", " + 
				"\"name\": \"" + this.name + "\", " + 
				"\"start\": \"" + this.start + "\", " + 
				"\"end\": \"" + this.end + "\", " +
				"\"periodicity\": " + this.periodicity + ", " +
				"\"type\": \"" + this.type + "\", " +
				"\"top_publisher\": \"" + this.top_publisher + "\", " +
				"\"worst_publisher\": \"" + this.worst_publisher + "\", " +
				"\"facebookCount\": " + this.facebookCount + ", " +
				"\"twitterCount\": " + this.twitterCount + ", " +
				"\"siteCount\": " + this.siteCount + ", " +
				"\"size\": " + this .size + "}";
		return json;
	}
}
