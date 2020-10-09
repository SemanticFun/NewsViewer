package JavaTest;

public class Node {
	String source;
	float value;
	
	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public float getValue() {
		return value;
	}

	public void setValue(float value) {
		this.value = value;
	}

	public Node(String source, float value){
		this.source = source;
		this.value = value;
	}
}
