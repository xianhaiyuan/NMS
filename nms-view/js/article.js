!function(){
	var converter = new showdown.Converter(),
    text      = '#hello, markdown!',
    html      = converter.makeHtml(text);
}()