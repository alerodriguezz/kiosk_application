package com.mycompany.app;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

import java.io.*;

import static java.lang.System.exit;


public class App {
    private static final AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
    private static final String S3_BUCKET = "<FMI>";
    private static final String[] FILES_TO_UPLOAD = new String[] { "backdrop_camera.jpg",
			"callback.html",
			"config.js",
			"core.css",
			"flex_search.js",
			"index.html",
			"jquery.js",
			"kiosk.png",
			"kiosk_bottom.png",
			"kiosk_left.png",
			"kiosk_right.png",
			"kiosk_top.png",
			"main.css",
			"main.js",
			"products.js",
			"report.html",
			"reset.css",
			"search.css",
			"search.js"
    };

    public static void main(String[] args) {
        uploadItems();
        System.out.println("Done");
        exit(0);
    }

    private static void uploadItems() {
        for(String file: FILES_TO_UPLOAD) {
            s3Client.putObject(S3_BUCKET, file, new File("../../resources/website/"+file));
        }
    }
}