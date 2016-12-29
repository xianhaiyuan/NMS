!function(){
	var converter = new showdown.Converter();
    $('.ui.dropdown').dropdown();

    $('.content textarea').on('input propertychange',function(){
    	$('.pre-view').html(converter.makeHtml($(this).val()));
    });
    $('.btn').click(function(event) {
    	var tit = $('#title');
    	var cate = $('#categories');
    	var pic = $('#news-pic');
    	var publish = $('#publish_house');
    	var content = $('.content textarea');
    	if (tit.val().length < 0) {
    		alert('请填写新闻标题！');
    		return false;
    	}
    	if (pic.val() === "") {
    		alert('请上传新闻图片！');
    		return false;
    	}
    	if (publish.val().length < 0) {
    		alert('请上填写出版社！');
    		return false;
    	}
    	if (content.val().length < 0) {
    		alert('请上填写新闻内容！');
    		return false;
    	}
		$('form').submit();
        alert('提交成功，请等待审核')
    });
}()