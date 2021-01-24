package com.mycompany.app;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.*;

import static java.lang.System.exit;


public class App {
    private static final AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
    private static final String S3_BUCKET = "<FMI>";

    public static void main(String[] args) {
        setStaticWebsiteConfiguration();
        System.out.println("Done");
        exit(0);
    }

    private static void setStaticWebsiteConfiguration() {
        BucketWebsiteConfiguration websiteConfig = new BucketWebsiteConfiguration();
        websiteConfig.setErrorDocument("error.html");
        websiteConfig.setIndexDocumentSuffix("index.html");
        SetBucketWebsiteConfigurationRequest request = new SetBucketWebsiteConfigurationRequest(S3_BUCKET,websiteConfig);
        s3Client.setBucketWebsiteConfiguration(request);

    }
}