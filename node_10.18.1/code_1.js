var 
    AWS_SDK = require("aws-sdk"),
    FS = require("fs"),
    S3_API = new AWS_SDK.S3({
        region: "us-east-1",
        apiVersion: "2006-03-01"
    }),
    SOURCE_S3_BUCKET_STR = "aws-tc-largeobjects",
    SOURCE_KEY_STR = "DEV-AWS-MO-Building_2.0/my_json_lines.jsonl";

exports.handler = function(event, context, callback){
    var
        G_PRODUCT_ID_STR = event.product_id_str,
        SEARCH_EXPRESSION_STR = "SELECT s.review_headline, s.review_body FROM s3object[*] s WHERE s.product_id = '" + G_PRODUCT_ID_STR + "'",
        g_return_me = {
            "statusCode": 200
        },
        g_search_results_arr = [];

    (function init(){
        doSearch(function(err, chunk_str){
            if(err){
                return callback(err, null);
            }
            processStitchedChunks(chunk_str);
            g_return_me = constructBody();
            callback(null, g_return_me);
        });
    })();

    function constructBody(){
        var 
            body = {};
        body.product_id_str = event.product_id_str;
        body.reviews_arr = g_search_results_arr;
        return body;
    }

    function processStitchedChunks(stiched_chunk_str){
        var 
            line_arr = stiched_chunk_str.split("\n").filter(Boolean);
        for(var i_int = 0; i_int < line_arr.length; i_int += 1){
            var
                o = JSON.parse(line_arr[i_int]), 
                temp_obj = {
                    "review_headline_str":  o.review_headline,
                    "review_body_str": o.review_body
                };
            g_search_results_arr .push(temp_obj);
        }
        console.log(g_search_results_arr.length.toString() + " records found");
    }

    function doSearch(cb){
        var 
            params = {
                Bucket: SOURCE_S3_BUCKET_STR,
                Key: SOURCE_KEY_STR,
                Expression: SEARCH_EXPRESSION_STR,
                ExpressionType: "SQL",
                InputSerialization: {
                    JSON: {
                        Type: "LINES"
                    },
                },
                OutputSerialization: {
                    JSON: {

                    }
                }
            };
        // await/async support in beta for selectObjectContext and the api is not working correcty.
        // using a stadard cb approach
        S3_API.selectObjectContent(params, function(err, data){
            var chunk_str = "";
            if(err){
                console.log("err", err);
                return;
            }
            var event = data.Payload;
            event.on("data", function(event) {
                if(event.Records){
                    chunk_str += event.Records.Payload.toString();
                }
            });
            event.on("error", function(err){
                cb(err, null);
            });
            event.on("end", function(){ 
                cb(null, chunk_str);
            });
        });
    }
};