import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.TimeUnit;
import java.io.*;
import java.net.*;
import java.util.*;
import caenrfid.*;

public class script4320p01 {
	private static final String SCRIPT_NAME   = "script4320p01";
	private static final int    MAX_RF_OUTPUT = 1400;


	static String avpValue(String avp, String attribute) {
		String[] pair;

		pair = avp.split("=");
		if ((pair != null) && (pair.length == 2)) {
			if (pair[0].equals(attribute)) {
				return (pair[1]);
			}
		}
		return null;
	}

	public static void main(String[] args) {
 		CAENRFIDR4320P r4320p     = new CAENRFIDR4320P();
 		CAENRFIDReader rfidReader = new CAENRFIDReader();
 		CAENRFIDLogicalSource ls0;
		int            power;
		String         powerPercentage = " ";
		String         profile         = " ";
		String         customCode      = " ";
		String         serialNo       = " ";

		try {
			// Get profile settings from web interface
			profile         = r4320p.readConfig(CAENRFIDR4320PConfig.PROFILE);
			powerPercentage = r4320p.readConfig(CAENRFIDR4320PConfig.RFPOWER);
			customCode      = r4320p.readConfig(CAENRFIDR4320PConfig.CUSTOM_CODE);
			serialNo        = r4320p.readConfig(CAENRFIDR4320PConfig.CUSTOM_ARGS);
			System.out.println("Web Settings");
			System.out.println("profile : " + profile);
			System.out.println("power   : " + powerPercentage);
			System.out.println("code    : " + customCode);
			System.out.println("args    : " + serialNo);

		}
		catch (CAENRFIDException ex) {
			System.out.println("got exception");
		}

		Mapping mapping = new Mapping();

        try {
			// connect to the uhf reader object
			rfidReader.Connect();
			// and set the desired output power.
			power = (2 * MAX_RF_OUTPUT)/1000;
			rfidReader.SetPower(power);
			// and, finally, do an inventory.
			ls0 = rfidReader.GetSource("Source_0");
			ls0.AddReadPoint("Ant1");
			ls0.AddReadPoint("Ant2");
			while (true) {
				CAENRFIDTag[] tags = ls0.InventoryTag();
				// boolean quit=false;

				if (tags != null) {

					long startTime = System.nanoTime();
					// convert each tag's epc code into an hexadecimal string representation
					for (int j = 0; j < tags.length; j++) {
						if (tags[j].GetId() != null) {
							String epcCode  = "";
							String antenna = "";
							if (tags[j].GetReadPoint()!= null) {
								antenna =  tags[j].GetReadPoint();

							}
							for (int i=0; i < tags[j].GetId().length; i++) {
								epcCode = epcCode + String.format("%02x", tags[j].GetId()[i] & 0xFF);
							}

								String jsonInputString = "{\"package_id\":\"" + epcCode + "\", \"antenna_id\":\"" + serialNo + antenna+"\"}";
								System.out.println(jsonInputString);
								r4320p.beep(CAENRFIDR4320PTone.FA, 100);
								if(antenna.equals("Ant0")){
										mapping.unconfirmedSend(epcCode,jsonInputString);
								}else{
									if(antenna.equals("Ant1")){
										mapping.confirmedSend(epcCode,jsonInputString);
									}else{
										mapping.removedSend(epcCode,jsonInputString);
									}
								}

						}

						long endTime = System.nanoTime();
						long timeElapsed = endTime - startTime;
						System.out.println("Execution time in milliseconds : " + timeElapsed / 1000000);
					}
				}
			}
		}
		catch(CAENRFIDException ex) {
			System.out.println("rfid error\n");
			return;
		}
	}
}


class Sender extends Thread {
    private static final String DOMAIN_URL = "http://rfidinventory.herokuapp.com/packaging/move-package";
    private String jsonInputString =  "";
    public Sender(String jsonInputString){
		this.jsonInputString = jsonInputString;
	}

	@Override
	public void run(){
        System.out.println("sending data to: " + DOMAIN_URL);
        try{
			URL url = new URL (DOMAIN_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(5000);
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setRequestMethod("PUT");

            OutputStream os = conn.getOutputStream();
            os.write(this.jsonInputString.getBytes("UTF-8"));
            os.close();

            // read the response
            InputStream in = new BufferedInputStream(conn.getInputStream());

            in.close();
            conn.disconnect();
		}catch(Exception e){
			e.printStackTrace();
		}
    }
}

class Mapping{
    HashMap <String,String> unconfirmedTags = new HashMap();
    HashMap <String,String> confirmedTags = new HashMap();
    HashMap <String,String> removedTags = new HashMap();


    public void unconfirmedSend(String key, String jsonInputString){
        if(!(unconfirmedTags.containsKey(key)||confirmedTags.containsKey(key))){
            if(removedTags.containsKey(key)){
                unconfirmedTags.put(key, key);
                removedTags.remove(key);
                Sender s = new Sender(jsonInputString);
				Thread t = new Thread(s);
				t.start();
            }else{
                unconfirmedTags.put(key, key);
                Sender s = new Sender(jsonInputString);
				Thread t = new Thread(s);
				t.start();
            }
        }
    }

    public void confirmedSend(String key, String jsonInputString){
        if(unconfirmedTags.containsKey(key)){
            confirmedTags.put(key, key);
            unconfirmedTags.remove(key);
            Sender s = new Sender(jsonInputString);
			Thread t = new Thread(s);
			t.start();
        }
    }

    public void removedSend(String key, String jsonInputString){
        if(confirmedTags.containsKey(key)){
            removedTags.put(key, key);
            confirmedTags.remove(key);
            Sender s = new Sender(jsonInputString);
			Thread t = new Thread(s);
			t.start();
        }
    }
}
