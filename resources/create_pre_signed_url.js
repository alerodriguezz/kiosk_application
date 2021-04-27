var 
	AWS_SDK = require("aws-sdk"),
	S3_API = new AWS_SDK.S3({
		apiVersion: "2006-03-01",
		region: "us-west-2"
	});

exports.handler = function(event, context, callback){
  var 
      g_bucket_name_str = "",
      key_name_str = "report.html",
      message_str = "",
      presigned_url_str = "";

	async function getPresignedUrl(){
		var 
			params = {
				Bucket: g_bucket_name_str,
				Key: key_name_str, 
				Expires: 60 * 2 //2 mins
			};
		presigned_url_str = await S3_API.getSignedUrlPromise("getObject", params);
		return presigned_url_str;
  	}
      
   async function getBucketName(){
		var 
			buckets_arr = (await S3_API.listBuckets().promise()).Buckets;
		for(var i_int = 0; i_int < buckets_arr.length; i_int += 1){
			if(buckets_arr[i_int].Name.indexOf("s3bucket") !== -1){
				g_bucket_name_str = buckets_arr[i_int].Name;
				break;
			}
		}
	}

  	(async function init(){
  		await getBucketName();
 		presigned_url_str = await getPresignedUrl();
 		message_str = "Here is your presigned url for your report: " + presigned_url_str;
 		//send to SNSN
		callback(null, {
			message_str: message_str
		});
  	})();
};
