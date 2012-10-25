function dreamDialog(options){
	options = options || {};
	this.width = options.width || '300px';
	this.height = options.height || 'auto';
	this.skin = options.skin || 'css/dreamDialog.css';
	this.title = options.title || '标题';
	this.yesBtn = options.yesBtn || function(){};
	this.createCallBack = options.createCallBack || function(){};//生成对话窗口的回答函数
	this.content = options.content || '';
	this.lock = options.lock;
	this.lcokColor = options.lcokColor = '#000';
	this.lockOpacity = options.lockOpacity || .3;
	
	this.dialogContainer = null;
	this.dialogTitleContainer = null;
	this.dialogBody = null;
	
	this.dialogBtnBody = null;
	this.dialogOkBtn = null;
	this.dialogCancleBtn = null;
	this.dialogTitle = null;
	this.dialogClose = null;
	this.lcokDiv = null;
	
	this.initi();
};
dreamDialog.prototype = {
	initi: function(){
		this.lock&&this.createLock();
		this.create();
	},
	createSkin: function(){
		if(dream('#dreamDialogSkin').size()>1) return;
			var link = dream.create('link');
			dream('head').append(link);
			dream(link).attr('rel', 'stylesheet').attr('href',this.skin).attr('id','dreamDialogSkin');
	},
	create: function(){
		var that = this;
		this.createSkin();
		
		this.dialogContainer = dream.create('div');
		this.dialogTitleContainer = dream.create('div');
		this.dialogBody = dream.create('div');
		this.dialogBtnBody = dream.create('div');
		
		this.dialogOkBtn = dream.create('span');
		this.dialogCancleBtn = dream.create('span');
		this.dialogTitle = dream.create('span');
		this.dialogClose = dream.create('span');
		
		dream(document.body).append(this.dialogContainer);
		dream(this.dialogContainer).append(this.dialogTitleContainer).append(this.dialogBody).append(this.dialogBtnBody);
		dream(this.dialogBtnBody).append(this.dialogOkBtn).append(this.dialogCancleBtn);
		dream(this.dialogTitleContainer).append(this.dialogTitle).append(this.dialogClose);
		
		dream(this.dialogContainer).addClass('dialogContainer').css({width:this.width,height:this.height});
		dream(this.dialogTitleContainer).addClass('dialogTitleContainer');
		dream(this.dialogBody).addClass('dialogBody');
		
		if(typeof this.content == 'string'){
			dream(this.dialogBody).html(this.content);
			}else{
				var cloneContent = this.content[0].cloneNode(true); 
				dream(this.dialogBody).append(cloneContent);
				dream(cloneContent).css({display:'block'});
				this.content.remove();
			}
		
		dream(this.dialogBtnBody).addClass('dialogBtnBody');
		dream(this.dialogOkBtn).addClass('dialogOkBtn').html('确定')
		.addEvent('click',function(){that.yesBtn()});
		dream(this.dialogCancleBtn).addClass('dialogCancleBtn').html('取消')
		.addEvent('click',function(){that.cancle()});
		
		dream(this.dialogTitle).addClass('dialogTitle').html(this.title);
		
		dream(this.dialogClose).addClass('dialogClose')
		.addEvent('click',function(){that.cancle();})
		.addEvent('mousemove',function(e){dream.stopPropagation(e);});
		
		dream.each([this.dialogOkBtn,this.dialogCancleBtn,this.dialogClose],function(){
			dream(this).addEvent('mouseover',function(){dream(this).addClass('hover')})
					   .addEvent('mouseout',function(){dream(this).removeClass('hover')});
			});
		
		this.setCenter();
		this.drag();
		this.createCallBack();
	},
	setCenter: function(){
		var scrollPosition = dream.getScrollPosition(),
			viewSize = dream.getBrowserView(),
			ie6 = dream.browser.ie6;
		dream(this.dialogContainer).css({
			position:ie6?'absolute':'fixed',
			zIndex:9999,
			left:(ie6?scrollPosition.left:0)+(viewSize.width-this.dialogContainer.offsetWidth)/2+'px',
			top:(ie6?scrollPosition.top:0)+(viewSize.height-this.dialogContainer.offsetHeight)/2+'px'
			});
	},
	drag: function(){
		var mouseOffset = {},
		    scrollPosition = {},
			that = this,
			offsetSize = {width:this.dialogContainer.offsetWidth,height:this.dialogContainer.offsetHeight},
			limit = {},
			viewSize = {},
			ie6 = dream.browser.ie6;
		function mouseDown(e){
			
			viewSize = dream.getBrowserView();
			mouseOffset = {
					x: e.offsetX || e.layerX,
					y: e.offsetY || e.layerY
				};
			scrollPosition = dream.getScrollPosition();
			dream(document).addEvent('mousemove',mouseMove).addEvent('mouseup',mouseUp);
			limit = {
				  x1 : ie6?scrollPosition.left:0,
				  x2 : (ie6?scrollPosition.left:0)+viewSize.width-offsetSize.width,
				  y1 : ie6?scrollPosition.top:0,
				  y2 : (ie6?scrollPosition.top:0)+viewSize.height-offsetSize.height
				}
	    };
		function mouseMove(e){
			var coordinate = {
					x: e.clientX || e.offsetX,
					y: e.clientY || e.offsetY
					},
				left = (ie6?scrollPosition.left:0)+coordinate.x-mouseOffset.x,
				top = (ie6?scrollPosition.top:0)+coordinate.y-mouseOffset.y;
			if (document.selection && document.selection.empty) {
				document.selection.empty();  //IE
			} else if (window.getSelection) {
				window.getSelection().removeAllRanges(); //火狐
			}
			left = left<limit.x1 ? limit.x1 :left;
			left = left>limit.x2 ? limit.x2 : left;
			
			top = top<limit.y1 ? limit.y1 : top;
			top = top>limit.y2 ? limit.y2 : top;
			
			dream(that.dialogContainer).css({
				left: left+'px',
				top: top+'px'
			});
	   };
	   function mouseUp(){
		   dream(document).removeEvent('mousemove',mouseMove).removeEvent('mouseup',mouseUp);
	   };
		
	   dream(this.dialogTitleContainer).addEvent('mousedown',mouseDown);
	},
	cancle: function(){
		dream(this.dialogContainer).css({display:'none'});
		this.lockDiv&&dream(this.lockDiv).css('display','none');
	},
	open: function(){
		dream(this.dialogContainer).css({display:'block'});
		this.lockDiv&&dream(this.lockDiv).css('display','block');
	},	
	createLock: function(){
		this.lockDiv = dream.create('div');
		var pageHegiht = dream.getPageSize().height + 'px';
		dream(document.body).append(this.lockDiv);
		
		dream(this.lockDiv).css({
			position:'absolute',
			zIndex:9998,
			width:'100%',
			height:pageHegiht,
			background:this.lcokColor,
			opacity:this.lockOpacity,
			left:0,
			top:0
			});
		
		if(dream.browser.ie6){
			var iframe = '<iframe frameborder="no" src="_blank" style="filter:alpha(opacity=0);width: 100%; height: '+pageHegiht+'"></iframe>';
			dream(this.lockDiv).html(iframe);				
		}
	}
};