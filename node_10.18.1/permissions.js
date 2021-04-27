(async () => {
	
	var 
		FS = require("fs"),
		AWS_SDK = require("aws-sdk"),
		S3_API = new AWS_SDK.S3({
			apiVersion: "2006-03-01",
			region: "us-west-2"
		}),
		BUCKET_NAME_STR = "<FMI>", //SWAP THIS OUT FOE YOUR BUCKET NAME
		// e.g rh-2020-02-25-s3site
		POLICY_FILE_PATH_STR = "/home/ec2-user/environment/website_security_policy.json",
		params = {},
		policy_str = "",
		response = {};

	params.Bucket = BUCKET_NAME_STR;

	FS.readFile(POLICY_FILE_PATH_STR, async (err, buffer) => {
		if(err){
			return console.log("Error dealing with the policy file", err);
		}
		policy_str = buffer.toString();
		try{
			params.Policy = policy_str;
			response = await S3_API.putBucketPolicy(params).promise();
			if(response){ //will be {} is ok even for repeat calls
				console.log("Done");
			}else{
				console.log("Problem Occurred"); //response === null
			}
		}catch(e){
			console.error("Problem", e);
		}
	});
})();