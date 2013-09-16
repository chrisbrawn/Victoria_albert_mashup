var url = "http://www.vam.ac.uk/api/json/museumobject/";
var index=0;
var jsize=0;
var int=null;
var textWordnik=null;


//render the text and images to screen initially
//this is called once per search.
function renderResults(jsonp_data) {
	jsize=jsonp_data.records.length;
	clearInterval(int);
index=0;

$('#motionTex').animate({
	top:"5em",
	opacity:0.0
},1);

$('#gImage.img').hide();
if (jsonp_data.meta.result_count>0){
var imgID=jsonp_data.records[0].fields.primary_image_id;
var tempURL="http://media.vam.ac.uk/media/thira/collection_images/";
var subID=imgID.substring(0,6);
tempURL=tempURL+subID+'/'+imgID+'.jpg';
var tempImg=$('<img>',{
	src:tempURL,
		class:'download'
}).load();
$('.download').fadeOut("slow",function(){
	$(tempImg).hide();
	$(this).replaceWith(tempImg);
	$('.download').fadeIn("slow");
});

var winH=$(window).height();
winH=(winH/4);

int=setInterval(function(){(getNext(jsonp_data))},10000);
$('#motionTex').empty();
	$('#motionTex').append('<p>'+textWordnik+'<p>').show();
$('#motionTex').animate({
	top:winH+'px',
	opacity:.8
},10000);
}
}


//connect to V&A museum with query and return JSON object to 
//callback function
function executeApiQuery(search_parameters) {
	options = {
	  type: 'GET',
	  dataType: 'jsonp',
	  data: search_parameters,
	  success: function(data){ 
		  renderResults(data);
	  },
	  failure: function(data){}
	};
	$('#submit').hide();
	$.ajax('http://www.vam.ac.uk/api/json/museumobject/', options);
}

   $('#inputBox').keypress(function(e) {
        if(e.which == 13) {
            jQuery(this).blur();
            jQuery('#search').focus().click();
        }
    });


//get the next available image from the V&A JSON obj
//if at end of list, start again
function getNext(data){
	if (index<jsize){
	index+=1;
}
else{
	index=0;
}
var imgID=data.records[index].fields.primary_image_id;
var tempURL="http://media.vam.ac.uk/media/thira/collection_images/";
var subID=imgID.substring(0,6);
tempURL=tempURL+subID+'/'+imgID+'.jpg';
var tempImg=$('<img>',{
	src:tempURL,
		class:'download'
}).load();
$('.download').fadeOut("slow",function(){
	$(tempImg).hide();
	$(this).replaceWith(tempImg);
	$('.download').fadeIn("slow");
});
}

//get text from wordnik JSON object
function wordnikResults(data){
//var len=data.examples.length;
	if(!jQuery.isEmptyObject(data)){
textWordnik=data.examples[0].text;
}
else(textWordnik="");
}

//on click/enter get search value and create JSON options for both
//V&A museum and wordnik dictionary. execute both AJAX calls
$("#search").click(function(){
	searchVal=$('#inputBox').val();
	
	search_parameters = {
	  q: searchVal,
	  images: 1,
	}
	executeApiQuery(search_parameters);
	
	options = {
	  type: 'GET',
	  dataType: 'jsonp',
	  data: search_parameters,
	  success: function(data){ 
		  wordnikResults(data);
	  },
	  failure: function(data){}
	};
	var wordnikStr="http://api.wordnik.com/v4/word.json/"+searchVal+"/examples?api_key=a51c9fa1c0f83123216a10df5610cc45ca4134d2c31f91072";
	$.ajax(wordnikStr,options);
	
})