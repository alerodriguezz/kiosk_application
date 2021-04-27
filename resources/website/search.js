var SEARCH = (function(){

	var
		_g_index = {},
		starter_text_str = "Start typing your search phrase...",
		expose = {
			doSearch: doSearch
		};

	function buildSearchBox(){
		var
			html_str = '';
		html_str += '<img data-role="kiosk_top" src="./kiosk_top.png" />';
		html_str += '<img data-role="kiosk_bottom" src="./kiosk_bottom.png" />';
		html_str += '<img data-role="kiosk_left" src="./kiosk_left.png" />';
		html_str += '<img data-role="kiosk_right" src="./kiosk_right.png" />';
		$(html_str).appendTo("[data-role='screen_backdrop']");
		html_str = '';
		html_str += '<div data-role="search_box" contenteditable>Start typing your search phrase...</div>';
		$(html_str).insertBefore("[data-role='results_outer_wrapper']");
	}

	function createIndex(){
		for(var i_int = 0; i_int < PRODUCTS_OBJ_ARR.length; i_int += 1){
			// console.log("adding this", PRODUCTS_OBJ_ARR[i_int].product_id_str, PRODUCTS_OBJ_ARR[i_int].product_title_str);
			_g_index.add(PRODUCTS_OBJ_ARR[i_int].product_id_str, PRODUCTS_OBJ_ARR[i_int].product_title_str);
		}
		console.info("Index built, good to go");
	}

	function highlight(str, phrase_str){
		var 
			replace_str = '<span class="highlight">' + phrase_str + '</span>',
			reg = new RegExp(phrase_str, "gi");
		return str.replace(reg, replace_str);
	}

	function _returnCardHTML(product_id_str, product_title_str, phrase_str){
		var
			html_str = '';
		html_str += '<section data-role="result_card" data-product_id="' + product_id_str + '">';
		html_str += 	'<span data-action="get_average_rating" data-product_id="' + product_id_str + '">rating</span>';
		html_str += 	'<span data-action="get_reviews" data-product_id="' + product_id_str + '">reviews</span>';
		html_str += 	'<h2>';
		html_str += 		product_id_str;
		html_str += 	'</h2>';
		html_str += 	'<p>';
		html_str += 		highlight(product_title_str, phrase_str);
		html_str += 	'</p>';
		html_str += '</section>';
		return html_str;
	}
	function doSearch(phrase_str){
		console.info("Doing a phrase search on " + phrase_str);
		_g_index.search(phrase_str, function(response){
			processResults(response, phrase_str);
		});
	}
	function handleFocus(fe){
		if($(this).text().trim() === starter_text_str){
			$(this).text(" ");
		}
	}
	function handleBlur(fe){
		if($(this).text().trim() === ""){
			$(this).text(starter_text_str);
		}
	}
	function handleKeyUp(kue){
		var
			$this = $(this);
		//ignore enter
		doSearch($this.text().trim());
		// console.log("You are searching for", kue.which, $this.text().trim());
	}
	function setUpHandlers(){
		$(document).on("keyup", "[data-role='search_box']", handleKeyUp);
		$(document).on("focus", "[data-role='search_box']", handleFocus);
		$(document).on("blur", "[data-role='search_box']", handleBlur);
	}
	function processResults(results_arr, phrase_str){
		var 
			html_str = '';
		
		if(results_arr.length === 0){
			html_str += '<h1>';
			html_str += 	'<i class="material-icons">camera_enhance</i>';
			html_str += '</h1>';
			html_str += '<section data-role="results_wrapper"></section>';
			$("[data-role='results_outer_wrapper']")
				.html(html_str);
			return;
		}

		html_str += '<h1>Found ' + results_arr.length + ' results</h1>';
		html_str += '<section data-role="results_wrapper">';
		for(var i_int = 0; i_int < PRODUCTS_OBJ_ARR.length; i_int += 1){
			for(var j_int = 0; j_int < results_arr.length; j_int += 1){
				if(results_arr[j_int] === PRODUCTS_OBJ_ARR[i_int].product_id_str){
					html_str += _returnCardHTML(PRODUCTS_OBJ_ARR[i_int].product_id_str, PRODUCTS_OBJ_ARR[i_int].product_title_str, phrase_str);
				}
			}
		}
		html_str += '</section>';
		$("[data-role='results_outer_wrapper']")
				.html(html_str);
	}

	function setUpIndex(){
		_g_index = new FlexSearch({
			encode: "balance",
			tokenize: "forward",
			threshold: 0,
			async: false,
			worker: false,
			cache: false
		});
	};

	(function inti(){
		console.log("creating index");
		setUpHandlers();
		buildSearchBox();
		setUpIndex();
		createIndex();
	})();

	return expose;

})();;