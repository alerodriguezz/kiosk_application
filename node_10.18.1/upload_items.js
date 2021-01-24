(async () => {
	
	var 
		FS_PROMISE = require("fs").promises, //as we have v10
		AWS_SDK = require("aws-sdk"),
		S3_API = new AWS_SDK.S3({
			apiVersion: "2006-03-01",
			region: "us-west-2"
		}),
		BUCKET_NAME_STR = "<FMI>", //SWAP THIS OUT FOE YOUR BUCKET NAME
		//e.g rh-2020-02-25-s3site
		params = {},
		promise_arr = [],
		FILES_ARR = [ // lexical order of all know website files
			"backdrop_camera.jpg",
			"config.js",
			"core.css",
			"flex_search.js",
			"index.html",
			"jquery.js",
			"kiosk.png",
			"main.css",
			"main.js",
			"products.js",
			"report.html",
			"reset.css",
			"search.css",
			"search.js"
		],
		CONTENT_TYPE_PARALLEL_ARR = [ // not self discovering for some reason, hence needed
			"image/jpg",
			"application/javascript",
			"text/css",
			"application/javascript",
			"text/html",
			"application/javascript",
			"image/png",
			"text/css",
			"application/javascript",
			"application/javascript",
			"text/html",
			"text/css",
			"text/css",
			"application/javascript"
		],
		WEBSITE_FOLDER_PATH_STR = "/home/ec2-user/environment/resources/website/";
	
	params.Bucket = BUCKET_NAME_STR;

	for(var i_int = 0; i_int < FILES_ARR.length; i_int += 1){
		params.Key = FILES_ARR[i_int];
		params.ContentType = CONTENT_TYPE_PARALLEL_ARR[i_int];
		params.CacheControl = "max-age=0";
		params.Body = await FS_PROMISE.readFile(WEBSITE_FOLDER_PATH_STR + FILES_ARR[i_int]); 
		promise_arr.push(S3_API.putObject(params).promise());
	}

	try{
		await Promise.all(promise_arr);
		//returns and array of 7 Etags
		console.log("Done");
	}catch(e){
			console.error("Problem", e);
	}

})();