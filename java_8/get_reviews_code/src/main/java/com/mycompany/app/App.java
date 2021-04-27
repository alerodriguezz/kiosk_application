package com.mycompany.app;

import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.JSONInput;
import com.amazonaws.services.s3.model.JSONOutput;
import com.amazonaws.services.s3.model.CompressionType;
import com.amazonaws.services.s3.model.ExpressionType;
import com.amazonaws.services.s3.model.InputSerialization;
import com.amazonaws.services.s3.model.OutputSerialization;
import com.amazonaws.services.s3.model.SelectObjectContentRequest;
import com.amazonaws.services.s3.model.SelectObjectContentResult;
import com.google.gson.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.sql.SQLOutput;
import java.util.*;
import java.io.InputStream;
import java.util.concurrent.atomic.AtomicBoolean;
import java.io.IOException;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;


public class App implements RequestHandler<Map<String,String>, APIGatewayProxyResponseEvent> {
    private static final String S3_BUCKET = "aws-tc-largeobjects";
    private static final String S3_FILE = "DEV-AWS-MO-Building_2.0/my_json_lines.jsonl";
    private static final String QUERY_PARAM_NAME = "product_id";

    @Override
    public APIGatewayProxyResponseEvent handleRequest(Map<String,String> event, Context context) {
        String data = readData(event);
        LambdaLogger logger = context.getLogger();
        return generateResponse(data, event.get(QUERY_PARAM_NAME));
    }

    protected static String readData(Map<String,String> event) {
        String productId = event.get(QUERY_PARAM_NAME);
        SelectObjectContentRequest request = generateJSONRequest(productId);
        return queryS3(request);
    }

    private static String queryS3(SelectObjectContentRequest request) {
        AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
        Gson gson = new Gson();
        final AtomicBoolean isResultComplete = new AtomicBoolean(false);
        // Call S3 Select
        SelectObjectContentResult result = s3Client.selectObjectContent(request);
        JsonArray array = new JsonArray();

        try {

            InputStream resultInputStream = result.getPayload().getRecordsInputStream();

            BufferedReader streamReader = new BufferedReader(new InputStreamReader(resultInputStream, "UTF-8"));

            String inputStr;

            while (true) {
                if (!((inputStr = streamReader.readLine()) != null)) break;
                inputStr = inputStr.replace("review_headline","review_headline_str");
                inputStr = inputStr.replace("review_body","review_body_str");
                String dataJson = gson.toJson(inputStr);
                array.add(dataJson);
            }

        } catch (IOException e) {
            // Implement more robust error handling
            // as necessary
            System.out.println(e.getMessage());
        }

        return array.toString();
    }

    private static SelectObjectContentRequest generateJSONRequest(String productId) {
        SelectObjectContentRequest request = new SelectObjectContentRequest();
        request.setBucketName(S3_BUCKET);
        request.setKey(S3_FILE);
        request.setExpression("select s.review_headline, s.review_body from s3object[*] s where s.product_id = '" + productId + "'");
        request.setExpressionType(ExpressionType.SQL);

        InputSerialization inputSerialization = new InputSerialization();
        inputSerialization.setJson(new JSONInput().withType("Lines"));
        inputSerialization.setCompressionType(CompressionType.NONE);
        request.setInputSerialization(inputSerialization);

        OutputSerialization outputSerialization = new OutputSerialization();
        outputSerialization.setJson(new JSONOutput());
        request.setOutputSerialization(outputSerialization);

        return request;
    }

    private static APIGatewayProxyResponseEvent generateResponse(String data, String productId) {
        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
        response.setStatusCode(200);
        response.setBody("{\"product_id_str\": \"" + productId + "\"" + ",\"reviews_arr\": " + data + "}");
        return response;
    }
}