(function(){

	var login_box = {
		show: function(){
			$(".login-b").click(function(){
				$('.login_frame').css({
					transform: 'scale(1)',
					opacity: '1'
				});
				$('#masker').css({
					display: 'block'
				});
			});
		},
		close: function(){
			$(".close").click(function(){
				$('.login_frame').css({
					transform: 'scale(0)',
					opacity: '0'
				});
				$('.signup_frame').css({
					transform: 'scale(0)',
					opacity: '0'
				});
				$('#masker').css({
					display: 'none'
				});
			});
		},
		toSignup: function(){
			$('.signup-link').click(function(){
				$('.login_frame').css({
					opacity: '0',
					transform: 'translateX(-100%)'
				});
				$('.signup_frame').css({
					marginLeft: '-200px',
					opacity: '1',
					transform: 'scale(1)'
				})
			});
		},
		loginPost: function(){
			var data = {
		        username: $(".usern").val(),
		        password: $(".pwd").val()
	        };
	        var login = function(){
		        $.post("/isignin",{
		          username: $(".usern").val(),
		          password: $(".pwd").val()
		        })
		        .done(function(data){
		          if (data.err) {
		            $('.alert').html(data.err);
		          }
		          if(data.success) {
		            window.location.href = '/news';
		          }
		          console.log(data);
		        })
		        .fail(function(err){
		          $('.alert').html(data.err);
		        });
	        }
	        $(".login-btn").click(function(){
	        	console.log('login')
	        	login();
	        });
	        
		    $(".pwd").keydown(function(e){
		        if (e.keyCode == 13) {
		          login();
		        }
		    });
	    },
		init: function(){
			this.show();
			this.close();
			this.toSignup();
			this.loginPost();
		}
	};
	var more_active = (function(){
		return function(){
			// if ($(this).width() <= 1024) {
			// 	$('.to_more').appendTo('.m_list ul');
			// }

			// if ($(this).width() <= 920) {
			// 	$('.t_s .time').css({
			// 		display: 'none'
			// 	});
			// }
			if ($(this).width() < 840) {
				$('.weather').css({
					"border": "none"
				});
				$('.weather').appendTo('.m_list ul');
			}
			if ($(this).width() <= 785) {
				$('.movic').css({
					"border": "none"
				});
				$('.movic').appendTo('.m_list ul');
			}
			if ($(this).width() <= 738)  {
				$('.entertain').css({
					"border": "none"
				});
				$('.entertain').appendTo('.m_list ul');
			}
			if ($(this).width() <= 690) {
				$('.police').css({
					"border": "none"
				});
				$('.police').appendTo('.m_list ul');
			}

			$(window).resize(function(){
				// if ($(this).width() <= 920) {
				// 	$('.time').css({
				// 		display: 'none'
				// 	});
				// }else{
				// 	$('.time').css({
				// 		display: 'block'
				// 	});
				// }
				if ($(this).width() < 840) {
					$('.weather').css({
						"border": "none"
					});
					$('.weather').appendTo('.m_list ul');
				}
				if ($(this).width() <= 785) {
					$('.movic').css({
						"border": "none"
					});
					$('.movic').appendTo('.m_list ul');
				}
				if ($(this).width() <= 738) {
					$('.entertain').css({
						"border": "none"
					});
					$('.entertain').appendTo('.m_list ul');
				}
				if ($(this).width() <= 690) {
					$('.police').css({
						"border": "none"
					});
					$('.police').appendTo('.m_list ul');
				}
				if ($(this).width() > 690 && $(this).width() <738) {
					$('.police').css({
						'borderRight': '1px solid #ccc'
					});
					$('.sport').after($('.police'));
				}
				if ($(this).width() > 738 && $(this).width() <785) {
					$('.entertain').css({
						'borderRight': '1px solid #ccc'
					});
					$('.sport').after($('.entertain'));
				}
				if ($(this).width() > 785 && $(this).width() <840) {
					$('.movic').css({
						'borderRight': '1px solid #ccc'
					});
					$('.sport').after($('.movic'));
				}
				if ($(this).width() > 840) {
					$('.to_more').css({
						'borderRight': '1px solid #ccc'
					});
					$('.sport').after($('.to_more'));
				}
			});

			$('.more_li').click(function(){
				$('.more_container').toggle('slow');
			});
		}
	})();
	more_active();
	login_box.init();
	$('.ui.dropdown').dropdown();


	// $(".slider").YuxiSlider({
	// 		width:600, //容器宽度
	// 		height:300, //容器高度
	// 		control:$('.control'), //绑定控制按钮
	// 		during:4000, //间隔4秒自动滑动
	// 		speed:800, //移动速度0.8秒
	// 		mousewheel:true, //是否开启鼠标滚轮控制
	// 		direkey:true //是否开启左右箭头方向控制
	// 	});

})()