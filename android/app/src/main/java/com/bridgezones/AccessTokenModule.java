package com.bridgezones;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.google.auth.oauth2.GoogleCredentials;
import android.util.Log;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class AccessTokenModule extends ReactContextBaseJavaModule {

    private static final String FIREBASE_MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";

    public AccessTokenModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AccessToken";
    }

    @ReactMethod
    public void getAccessToken(Callback successCallback, Callback errorCallback) {
        try {
            String jsonString = "{\r\n" + //
                    "  \"type\": \"service_account\",\r\n" + //
                    "  \"project_id\": \"attendanceapp-83b7a\",\r\n" + //
                    "  \"private_key_id\": \"0187e7b02ed5385702afee06f5ef9836f05ed755\",\r\n" + //
                    "  \"private_key\": \"-----BEGIN PRIVATE KEY-----\\n" + //
                    "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFsyK/CKq6KuNA\\n" + //
                    "onmjyMC9gIjNQQ5d4+Zmn9fjFWS82J/wYG/lpkooVOg0w3tr7b6lHGTboflVGQRj\\n" + //
                    "zX87RC2R06M5meorpjrdpnanYWqwHv/Nh5FHU+1k6p9i8BP8b2ElN6xmcAxWICPV\\n" + //
                    "YOGDoWYDBaWsIaG0kb/Zwze1Q/6ZV2sxE6KGhTnR3Ka9G+IReo2orxV+pm6ib1Co\\n" + //
                    "IBtbQeNDvtyeLW/RsUgqAVttUJdYPC15iAObJDJXv1Binb7hJFLDfW/jd6XjKsjZ\\n" + //
                    "qqOSmKRUijGtD1M7ANz1x5YLbpgtaOpXSuXcWxRegx2YI4ZWeNXSsHrNavso19nU\\n" + //
                    "w2oDpwI/AgMBAAECggEADjsGkKeuc/e4Vr1OcjEPwDqrUWyR/MVcOIQS+MAs3/Pb\\n" + //
                    "3cqjSbpX8vuoB0kQh94bvF84QOyYBopMqMs9XrLzcMbCJHHlMdhYuzGxr5SxWeIX\\n" + //
                    "wBMDeXxO3zyNCOsgSF05qef0m4VybeFvkuFsk82fV5WL4MFyL8EG0hIqRWL4+M9g\\n" + //
                    "nFcDzS0YP2gK0HyJtzu0EIB1OILmHpKcrO5iREZgneurJpjEEcvd9FCjmT9PXsIz\\n" + //
                    "kx2IbJCd/fw7CYPqJk9jwP+O6QkIs5wpel9eJiZNGPu2rI0MyyNwUWq9Jpjs31CM\\n" + //
                    "X6eUIzDUBCCs/Kgxlcw8MZHZ3K77+k28G+78RbI+WQKBgQDyCMie57j/u/2eOOBW\\n" + //
                    "jDLFK/YebhW2tOVrVhqGLeSbbhhG9Fp9bzUZpqki4BjY51IcYNMxr0UZJAG1CkY6\\n" + //
                    "lhCX/Dej0tjxx7oLtTITJY8uwOppMqTzt7DZsYkRSqewvJc7/dlp7ThNaVoiFatl\\n" + //
                    "KCaxBlVbzjgim+G8/GnkZOARNQKBgQDRG3Z/BjyUk24D6yXATW12AvvWWqe8p/YD\\n" + //
                    "3XPi5T2roGj0du/QOFsBYq0WrylRmV3a2D3vS9tmVlykGIxIW/fjFra12/C8u7hx\\n" + //
                    "VbMcopXH4nDyiufwg/ZGAx7ZmQnVW1E50N3CKFMQUYSRgf4lQyXDtsmpXvHzK1mu\\n" + //
                    "cLSBiO8IIwKBgDtFPWP0mRA/SCdkBEQNhy1Ty6y+BqE8gWYcqtgrCu2pM1bE5hgL\\n" + //
                    "kLRcZNT+jfcoBqqeZ3mmU0SJ1cUw4+va7etaP4Hl02y6HWxajg20R/EKGx1x4oUw\\n" + //
                    "eaWF3WwXnSMhu+NcEc7n4b7LSuBH8DYQdBEr3OFjicmn5Mr0ATaGIXz1AoGBAM/H\\n" + //
                    "qzJDHzU/XcU1BlkUVt05z8ZKZHxYpWNnzHw779C3XzLzcA4FwaAZzgZJXRRBAfqw\\n" + //
                    "frJmPQdubzV7UwGfqSyUaE9C0e6n1XmAf67He2+X+UV4c0oRxkgBV8k+gX/o8kgx\\n" + //
                    "2/jOmuMPLVxsv/2EwGS+H5pVxrMrczybrzE7wNDjAoGATeCCgxU5XMg66MNHNGVL\\n" + //
                    "ht+cSTEUUqnuc2olMrCUYyHa2Ct/83OfV61HoF4xi0Ef+RtluP8Z9Rd1ILq9I5nq\\n" + //
                    "NjGAjrwTFKvnpXN5DsmLtbaTjl2/Zl/hh8kAvLomPQUpuYx2IOJFDftpnyduBK7g\\n" + //
                    "KH8sSGVdaByGDtXmKlnJytU=\\n" + //
                    "-----END PRIVATE KEY-----\\n" + //
                    "\",\r\n" + //
                    "  \"client_email\": \"firebase-adminsdk-svve1@attendanceapp-83b7a.iam.gserviceaccount.com\",\r\n" + //
                    "  \"client_id\": \"111982998908020188883\",\r\n" + //
                    "  \"auth_uri\": \"https://accounts.google.com/o/oauth2/auth\",\r\n" + //
                    "  \"token_uri\": \"https://oauth2.googleapis.com/token\",\r\n" + //
                    "  \"auth_provider_x509_cert_url\": \"https://www.googleapis.com/oauth2/v1/certs\",\r\n" + //
                    "  \"client_x509_cert_url\": \"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-svve1%40attendanceapp-83b7a.iam.gserviceaccount.com\",\r\n"
                    + //
                    "  \"universe_domain\": \"googleapis.com\"\r\n" + //
                    "}\r\n" + //
                    ""; // Your JSON string
            InputStream stream = new ByteArrayInputStream(jsonString.getBytes(StandardCharsets.UTF_8));
            GoogleCredentials googleCredentials = GoogleCredentials.fromStream(stream)
                    .createScoped(FIREBASE_MESSAGING_SCOPE);
            googleCredentials.refresh();
            String token = googleCredentials.getAccessToken().getTokenValue();
            successCallback.invoke(token);
        } catch (Exception e) {
            Log.e("AccessTokenModule", "getAccessToken: " + e.getLocalizedMessage());
            errorCallback.invoke(e.getLocalizedMessage());
        }
    }
}
