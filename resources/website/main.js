/*
	Add code licence et
*/
var MAIN = (function(){
	function doGetAjax(type_str, product_id_str){
		if(window,G_API_GW_URL_STR === null){
			showProblem("I have no GET API to call for " + type_str);
			return;
		}
		showWorking();
		// var product_id_str = $("select").val();
		
		//use AJAX to get error handlng
		$.get(window.G_API_GW_URL_STR + "/" + type_str + "?product_id=" + product_id_str, successGetHandler);
	}
	function doPostAjax(){
		if(window,G_API_GW_URL_STR === null){
			showProblem("I have no POST API to call!");
			return;
		}
		//have to be logge din 
		var token_str_or_null = localStorage.getItem("bearer_str");

		if(token_str_or_null === null){
			return showProblem("You need to be logged in to create a report");
		}
		
		showWorking();
		//construct bearer token  in the headerTODO
		//use $.ajax to get error handling too
		$.ajax({
			url: window.G_API_GW_URL_STR + "/" + "create_report",
			method: "POST",
			data: {},
			headers: {
				"Authorization": "Bearer " + token_str_or_null
			},
			error: handleReportCreationError,
			success: handleReportCreationSuccess
		});
	}	
	function handleReportCreationSuccess(response){
		console.info(response); 
			//shoudl have message str (ok)
		if(response.message_str){
			showProblem(response.message_str);
		}else{
			showProblem(JSON.parse(response).message_str);
		}
	}
	function handleReportCreationError(response){
		console.error(response);
		showProblem("Something went wrong");
	}
	function handleKeypress(kpe){
		console.log(kpe.which);
		if(kpe.which === 13){
			showProblem("Choose either get reviews or get average rating");
			return false;
		}
	}
	function hideProblem(){
		$("[data-role='problem_message']")
				.attr("data-showing", "not_showing")
				.text("");
	}
	function requestReport(){
		console.log("attempting a report creation");
		doPostAjax();
	}
	function getAverageRating(){
		//if reulst card for this item is showong already
		//return;

		var product_id_str = $(this).attr("data-product_id");
		console.log("AJAX GET average rating for " + product_id_str);
		doGetAjax("get_av_star_rating", product_id_str);
	}
	function getReviews(){
		var product_id_str = $(this).attr("data-product_id");
		console.log("AJAX GET reviews for " + product_id_str);
		doGetAjax("get_reviews", product_id_str);
	}
	function setUpHandlers(){
		$(document).on("keypress", "[data-role='product_name']", handleKeypress);
		$(document).on("click", "[data-action='request_report']", requestReport);
		$(document).on("click", "[data-action='get_reviews']", getReviews);
		$(document).on("click", "[data-action='get_average_rating']", getAverageRating);
	}
	function showProblem(problem_str){
		console.warn(problem_str);
		$("[data-role='problem_message']")
				.attr("data-showing", "showing")
				.text(problem_str);
		setTimeout(function(){
			hideProblem();
		}, 2.2 * 1000);
	}
	function showWorking(){
		$("[data-role='problem_message']")
				.text("")
				.attr("data-showing", "not_showing");
	}
	function successGetHandler(response){
		//clear any existing reviews and rating section


		if(response.average_star_review_float){
			showUIForRatings(response.product_id_str, response.average_star_review_float);
		} else if(response.product_id_str && response.reviews_arr) {
			showUIForReviews(response.product_id_str, response.reviews_arr);
		} else if (response.body) { //FOR JAVA that forced a body key
				var jsonResponse = JSON.parse(response.body);
				if(jsonResponse.reviews_arr) {
					showUIForReviewsJava(jsonResponse.product_id_str, jsonResponse.reviews_arr);
				} else {
					showUIForRatingsJava(jsonResponse.product_id_str, jsonResponse.average_star_review_float);
				}
		} 
	}

	function showUIForReviews(product_id_str, reviews_arr){
		var $row = $("[data-role='result_card'][data-product_id='" + product_id_str + "']");
		var html_str = '';
		html_str += '<div data-role="reviews_wrapper">'
		html_str += 	'<p>This product has <span>' + reviews_arr.length.toString() + '</span> reviews</p>';
		html_str += 	'<ol>';
		for(var i_int = 0; i_int < reviews_arr.length; i_int += 1){
			html_str += 	'<li>';
			html_str += 		 '<span data-role="review_headline">';
			html_str +=				reviews_arr[i_int].review_headline_str;
			html_str += 		'</span>';
			html_str += 		'<span>';
			html_str += 			reviews_arr[i_int].review_body_str;
			html_str += 		'</span>';
			html_str += 	'</li>';
		}
		html_str += 	'</ol>';
		html_str += '</div>';
		$row.append(html_str);
	}

	function showUIForReviewsJava(product_id_str, reviews_arr){
		
		var $row = $("[data-role='result_card'][data-product_id='" + product_id_str + "']");

		try {
			
			var html_str = '';
			html_str += '<div data-role="reviews_wrapper">'
			html_str += 	'<p>This product has <span>' + reviews_arr.length.toString() + '</span> reviews</p>';
			html_str += 	'<ol>';
			for(var i_int = 0; i_int < reviews_arr.length; i_int += 1){
				html_str += 	'<li>';
				html_str += 		 '<span data-role="review_headline">';
				html_str +=	JSON.parse(JSON.parse(reviews_arr[i_int])).review_headline_str;
				html_str += 		'</span>';
				html_str += 		'<span>';
				html_str += JSON.parse(JSON.parse(reviews_arr[i_int])).review_body_str;
				html_str += 		'</span>';
				html_str += 	'</li>';
			}
			html_str += 	'</ol>';
			html_str += '</div>';
			$row.append(html_str);
		} catch(err) {		
			console.log("Error displaying reviews")
		}
	
	}

	function showUIForReviews(product_id_str, reviews_arr){
		var $row = $("[data-role='result_card'][data-product_id='" + product_id_str + "']");
		var html_str = '';
		html_str += '<div data-role="reviews_wrapper">'
		html_str += 	'<p>This product has <span>' + reviews_arr.length.toString() + '</span> reviews</p>';
		html_str += 	'<ol>';
		for(var i_int = 0; i_int < reviews_arr.length; i_int += 1){
			html_str += 	'<li>';
			html_str += 		 '<span data-role="review_headline">';
			html_str +=				reviews_arr[i_int].review_headline_str;
			html_str += 		'</span>';
			html_str += 		'<span>';
			html_str += 			reviews_arr[i_int].review_body_str;
			html_str += 		'</span>';
			html_str += 	'</li>';
		}
		html_str += 	'</ol>';
		html_str += '</div>';
		$row.append(html_str);
	}

	function showUIForRatings(product_id_str, average_star_review_float){
		var $row = $("[data-role='result_card'][data-product_id='" + product_id_str + "']");

		var html_str = '';
		html_str += '<div data-role="rating_wrapper">'
		html_str += 	'<p>This product has an average rating of <span>' + average_star_review_float.toString() +'</span></p>';
		html_str += '</div>';
		$row.append(html_str);
	}
	function showUIForRatingsJava(product_id_str, average_star_review_float){
		console.warn("once I get a sample payload from Morgan I can fix this");
		showUIForRatings(product_id_str, average_star_review_float);

		// var $row = $("[data-role='result_card'][data-product_id='" + product_id_str + "']");

		// var html_str = '';
		// html_str += '<div data-role="rating_wrapper">'
		// html_str += 	'<p>This product has an average rating of <span>' + average_star_review_float.toString() +'</span></p>';
		// html_str += '</div>';
		// $row.append(html_str);
	}

	function successPostHandler(response){
		alert(response);
	}
	function showHostedUILink(){
		$("[data-role='request_report_wrapper'] > a")
			.attr("href", G_COGNITO_HOSTED_URL_STR || "javascript:void(0);");

	}
	(function init(){
		showHostedUILink();
		setUpHandlers();
	})();
})();