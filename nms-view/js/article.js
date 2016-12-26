!function(){
	var converter = new showdown.Converter();
    $('.ui.dropdown').dropdown();

    $('.content textarea').on('input propertychange',function(){
    	$('.pre-view').html(converter.makeHtml($(this).val()));
    })
}()