package com.mycompany.app;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.*;

import java.io.*;

import static java.lang.System.exit;


public class App {
    private static final AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
    private static final String S3_BUCKET = "<FMI>";
    private static final String BUCKET_POLICY_PATH = "../../website_security_policy.json";

    public static void main(String[] args) {
        String policyText = readBucketPolicyFile();
        setBucketPolicy(policyText);
        System.out.println("Done");
        exit(0);
    }

    private static String readBucketPolicyFile() {
        String definition = "";
        try{
            BufferedReader reader = new BufferedReader(new FileReader(BUCKET_POLICY_PATH));
            while(reader.ready()) {
                definition += reader.readLine();
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return definition;
    }

    private static void setBucketPolicy(String policyText) {
        SetBucketPolicyRequest request = new SetBucketPolicyRequest(S3_BUCKET, policyText);
        s3Client.setBucketPolicy(request);

    }
}