;(function($){

	$.extend({

		isArray: function(v) {

			return Object.prototype.toString.call(v) === '[object Array]';

		},

		isObject: function(v) {

			return Object.prototype.toString.call(v) === '[object Object]';

		}

	});


	var sliderEvent = function(val) {

		this.$ele = $(val);

		this.param = this.$ele.data('lzslider-param');

		this.status = this.$ele.data('lzslider-status');

		this.imgBox = this.$ele.data('lzslider-imgBox');

		this.img = this.$ele.data('lzslider-img');

	}

	sliderEvent.prototype.setEvent = function() {

		var event = this,

		param = this.param;

		if ($.isArray(param.event)) {

			$.each(param.event,function(index, val) {

				event[val] && event[val]();

			});

		} else {

			event[param.event] && event[param.event]();

		}
	}

	sliderEvent.prototype.wheel = function(){

		var me = this.$ele,

		status = this.status,

		param = this.param;

		me.off('mousewheel.lzslider DOMMouseScroll.lzslider').on('mousewheel.lzslider DOMMouseScroll.lzslider',function(e){

			if(status.flag && status.mouseH){

				e.preventDefault();

				var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
           			 (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1)); // firefox 

           		if(delta>0) status.cPoint-=param.num;
           		if(delta<0) status.cPoint+=param.num;

           		me.sliderExcute();

			}

		})

	}

	sliderEvent.prototype.keyboard = function(){

		var me = this.$ele,

		status = this.status,

		param = this.param;

		$(window).on('keydown',function(e){

			if(status.flag && status.mouseH){

				e.preventDefault();

				if(e.keyCode == 37 || e.keyCode ==38) status.cPoint-=param.num;

				if(e.keyCode ==39 || e.keyCode==40) status.cPoint+=param.num;

				me.sliderExcute();

			}

		})

	}

	sliderEvent.prototype.btn = function() {

		var me = this.$ele,

		param = this.param,

		status = this.status,

		imgBox = this.imgBox,

		img = this.img,

		imgLen = status.imgLen,

		btnW = 0,

		boxLen = (param.dir=='left' || param.dir=='right')?status.imgW:status.imgH;

		var pointBox = $("<ul class='" + param.btnCls[0] + "'></ul>");

		me.append(pointBox.get(0));

		pointInBox = $("<li class='" + param.btnCls[1] + "'></li>");

		pointBox.append(pointInBox.get(0));

		point = "<div class='" + param.btnCls[2] + "'></div>";

		for (i = 0; i<status.lastLen; pointInBox.append(point), i++);
			
		btnW = pointBox.find('div').eq(0).outerWidth(true) * imgLen;

		pointInBox.css('width', btnW).find('div').eq(0).addClass(param.btnCls[3]);

		pointBox.find('div').off('.lzslider').on('click.lzslider',function(event) {

			if (status.flag) {

				if (status.cPoint != $(this).index()) {

					status.cPoint = $(this).index();

					me.sliderExcute();
				}
			}
		});
	}

	sliderEvent.prototype.arrow = function() {

		var me = this.$ele,

		param = this.param,

		status = this.status,

		imgLen = status.imgLen;

		var arrowBox = $("<ul class='" + param.arrowCls[0] + "'></ul>");

		me.append(arrowBox.get(0));

		if (param.arrowStyle) {

			arrowP = "<li class='" + param.arrowCls[1] + "'>&lt;</li><li class='" + param.arrowCls[2] + "'>&gt;</li>";

		} else {

			arrowP = "<li class='" + param.arrowCls[1] + "'></li><li class='" + param.arrowCls[2] + "'></li>";

		}

		arrowBox.append(arrowP);

		arrowBox.find('li').eq(0).off('.lzslider').on('click.lzslider',function(e) {

			if (status.flag) {
				
				status.cPoint-=param.num;

				me.sliderExcute();
			}
		});

		arrowBox.find('li').eq(1).off('.lzslider').on('click.lzslider',function(e) {
			
			if (status.flag) {
				
				status.cPoint+=param.num;
				
				me.sliderExcute();
			}
		});
	} 

	sliderEvent.prototype.touch = function(){

		var startPoint={},endPoint={},

		me = this.$ele,

		param = this.param,

		status = this.status,

		imgLen = status.imgLen;

		me.on('touchstart', function(e) {

			e.preventDefault();

			e.stopPropagation();

			var touchStart = e.originalEvent.touches[0];
			
			startPoint.x = Math.floor(touchStart.clientX);

			startPoint.y = Math.floor(touchStart.clientY);

			timer = setTimeout(function(){

				startPoint = {};

				endPoint = {};

			},1000)

		});

		me.on('touchmove', function(e) {

			e.preventDefault();

			e.stopPropagation();

			var touchEnd = e.originalEvent.touches[0];

			endPoint.x = Math.floor(touchEnd.clientX);

			endPoint.y = Math.floor(touchEnd.clientY);

		});

		me.on('touchend', function(e) {
			
			e.preventDefault();

			e.stopPropagation();

			var dir = param.dir;

			if((dir ==='left' || dir==='right') && status.flag && startPoint.x){

				(startPoint.x-endPoint.x<-30) && (status.cPoint -=param.num);

				(startPoint.x-endPoint.x>30) && (status.cPoint +=param.num);

				me.sliderExcute();

			}else if((dir==='up' || dir ==='down') && status.flag && startPoint.y){

				startPoint.y-endPoint.y<-30 && (status.cPoint -=param.num);

				startPoint.y-endPoint.y>30 && (status.cPoint +=param.num);

				me.sliderExcute();

			}

			startPoint = {};

			endPoint = {};
		});

	}

	var sliderMethods = function(val){

		this.$ele = $(val);

		this.status = this.$ele.data('lzslider-status');

		this.param = this.$ele.data('lzslider-param');

		this.imgBox = this.$ele.data('lzslider-imgBox');

		this.img = this.$ele.data('lzslider-img');

	}

	sliderMethods.prototype.calBoxLen = function(){

		var me = this.$ele,

		param = this.param,

		status = this.status,

		img = this.img,

		temp = 0,

		k = 0;

		status.arrLen = [0];

		if(param.dir =='left' || param.dir =='right')

			$.each(img,function(index,val){

				temp+=$(val).outerWidth(true);

				status.arrLen.push(temp);

			});

		else

			$.each(img,function(index,val){

				temp+=$(val).outerHeight(true);

				status.arrLen.push(temp);

			});

		status.boxLen = (param.dir=='left' || param.dir=='right') ? parseFloat(me.css('width')) : parseFloat(me.css('height'));

		while(status.arrLen[k++]<=temp-status.boxLen) status.lastLen = k;

		return temp;

	}

	sliderMethods.prototype.autoPlay = function(){

		var me = this.$ele,

		status = this.status,

		param = this.param;

		if(status.flag){

			(param.dir =='left' || param.dir=='up')? (status.cPoint+=param.num) : (status.cPoint-=param.num);

			me.sliderExcute();

		}

	}

	sliderMethods.prototype.indexChange = function(){

		var status = this.status,

		param = this.param,

		imgLen = status.lastLen;

		(!param.cycle && status.cPoint>imgLen - 1) && (status.cPoint = imgLen - 1);

		(!param.cycle && status.cPoint<0) && (status.cPoint=0);

		(param.cycle && status.sPonit!=imgLen - 1 && status.cPoint>imgLen - 1) && (status.cPoint = imgLen - 1);

		(param.cycle && status.sPonit==imgLen - 1 && status.cPoint>imgLen - 1) && (status.cPoint = 0);

		(param.cycle && status.sPonit!=0 && status.cPoint<0) && (status.cPoint=0);

		(param.cycle && status.sPonit==0 && status.cPoint<0) && (status.cPoint=imgLen - 1);

	}

	sliderMethods.prototype.calMoveLen = function(){

		var status = this.status;

		return status.arrLen[status.cPoint];

	}

	sliderMethods.prototype.excute = function(){

		var status = this.status,

		param = this.param,

		imgBox = this.imgBox,

		len = this.calMoveLen(),

		pointBox = this.$ele.find('.'+param.btnCls[0]).find('div');

		if(pointBox) pointBox.removeClass(param.btnCls[3]).eq(status.cPoint).addClass(param.btnCls[3]);

		(param.dir == 'left' || param.dir == 'right') && imgBox.stop().animate({'marginLeft':-len},param.speed);

		(param.dir == 'up' || param.dir == 'down') && imgBox.stop().animate({'marginTop':-len},param.speed);

		status.sPonit = status.cPoint;
	}

	sliderMethods.prototype.onProgress = function(){

		var progress = this,

		status = this.status,

		param = this.param;

		progress.indexChange();

		progress.excute();

		if(status.cPoint == status.lastLen - 1 && param._onLast) param._onLast.call(this,param,status);

		param._onSwitch && param._onSwitch.call(this,param,status);

		status.flag = false;

		setTimeout(function(){

			status.flag = true;

		},param.speed);

	}

	var sliderInit = function(val,a,b,c,d){

		this.$ele = $(val);

		this.$ele.data('lzslider-param',this.initParam(a,b,c,d));

		this.$ele.data('lzslider-imgBox',this.$ele.children().first());

		this.$ele.data('lzslider-img',this.$ele.data('lzslider-imgBox').children());

		this.$ele.data('lzslider-status',{
			flag:true,
			mouseH:false,
			sPonit:0,
			cPoint:0,
			arrLen:[],
			boxLen:0,
			imgLen:this.$ele.data('lzslider-img').length,
			lastLen:0,
			timer:null
		})

	}

	sliderInit.prototype.layout = function(){

		var me = this.$ele,

		status = me.data('lzslider-status'),

		param = me.data('lzslider-param'),

		imgBox = me.data('lzslider-imgBox');

		len = me.get(0).sliderexcute.calBoxLen();

		me.css('position')=='static' && me.css('position','relative');

		(param.dir=='left' || param.dir =='right')? imgBox.css('width',len):imgBox.css('height',len);

	}

	sliderInit.prototype.initEvent = function(){

		var me = this.$ele,

		self = me.get(0),

		status = me.data('lzslider-status'),

		param = me.data('lzslider-param'),

		imgBox = me.data('lzslider-imgBox'),

		event = new sliderEvent(me);

		$(window).resize(function() {

			var len = self.sliderexcute.calBoxLen();
				
			(param.dir=='left' || param.dir =='right')? imgBox.css('width',len):imgBox.css('height',len);	

		});

		me.off('.lzslider');

		me.on('mouseenter.lzslider', function() {
			
			clearInterval(status.timer);

			status.timer = null;

			status.mouseH = true;

		}).on('mouseleave.lzslider', function() {
			
			param.auto && (status.timer = setInterval(self.sliderexcute.autoPlay.bind(self.sliderexcute),param.interval));

			status.mouseH = false;

		});

		event.setEvent();

		param.auto && (status.timer = setInterval(self.sliderexcute.autoPlay.bind(self.sliderexcute),param.interval));
	}

	sliderInit.prototype.initParam = function(a,b,c,d){

		var param = {

			dir:'left',

			speed:600,

			interval:3000,

			event:['arrow'],

			auto:true,

			cycle:true,

			num:1,

			btnCls: ['lz-sliderPoint-box','lz-sliderPoint','lz-sliderPoint-point','lz-sliderPoint-hover'],

			arrowCls:['lz-sliderBtn','lz-sliderBtn-left','lz-sliderBtn-right'],

			arrowStyle:true,

			_onSwitch:null,

			_onLast:null

		}

		if($.isObject(a)){

			param = $.extend({},param,a);

		}else{

			param.dir = a;

			param.interval = b;

			param.speed = c;

			param.auto = d;

			!isNaN(a) && (param.interval = a, param.speed = b);

			typeof a === 'function' && (param._onSwitch = a);

			typeof a ==='boolean' && (param.auto = a);

		}

		if(this.$ele.data('slider-param')){

			$.extend({},param,this.$ele.data('slider-param'));

		}

		param.dir = (param.dir == 'left' || param.dir == 'right' || param.dir == 'up' || param.dir == 'down') ? param.dir: 'left';

		param.speed = (param.speed == null) ? 600 : param.speed;

		param.interval = (param.interval == null) ? 3000 : param.interval;

		param.interval == 'fast' && (param.interval = 1500, param.speed = 300);

		param.interval == 'medium' && (param.interval = 3000, param.speed = 600);

		param.interval == 'slow' && (param.interval = 6000, param.speed = 1200); 

		(isNaN(param.interval) || isNaN(param.speed)) && (param.interval = 3000, param.speed = 600); 

		(param.interval < param.speed) && jQuery.error('参数设置错误 动画间隔小于动画速度');
		
		param.auto = (param.auto === false) ? false: true;

		param.cycle = (param.cycle === false) ? false: true;

		param.arrowStyle = (param.arrowStyle === false) ? false: true; 

		typeof param._onSwitch !=='function' && (param._onSwitch = null);

		typeof param._onLast !=='function'  && (param._onLast=null);

		return param;

	}

	var tool = function(val){

		this.$ele = $(val);

	}

	tool.prototype.destory = function(){

		var me = this.$ele;

		$.each(me,function(index,val){

			var self = $(val),

			status = self.data('lzslider-status'),

			param = self.data('lzslider-param');

			if(status.timer) clearInterval(status.timer);

			self.off('lzslider')

			if(btn=self.find(param.btnCls[0])) btn.remove();

			if(arrow=self.find(param.arrowCls[0])) arrow.remove();

			self.removeData('lzslider-status').removeData('lzslider-param');

		});

		return false;

	}

	tool.prototype.init = function(a,b,c,d){

		var me = this.$ele;

		this.destory();

		me.lzbanner(a,b,c,d);

	}

	tool.prototype.index = function(num){

		var me = this.$ele,

		self = this;

		if(num===undefined){

			return me.eq(0).data('lzslider-status').sPonit+1;

		}else{

			$.each(me,function(index,val){

				self.stop();

				var status = $(val).data('lzslider-status'),

				param = $(val).data('lzslider-param');

				if(status.flag){

					status.cPoint = num-1;

					$(val).sliderExcute();

				}

				param.auto && self.start();


			})

			return this;

		}

	}

	tool.prototype.next = function(){

		var self = this,

		me = this.$ele;

		$.each(me,function(index,val){

			self.stop();

			var status = $(val).data('lzslider-status'),

			param = $(val).data('lzslider-param');

			if(status.flag){

				status.cPoint+=param.num;

				$(val).sliderExcute();

			}

			param.auto && self.start();

		})

		return this;

	}

	tool.prototype.prev = function(){

		var self = this,

		me = this.$ele;

		$.each(me,function(index,val){

			self.stop();

			var status = $(val).data('lzslider-status'),

			param = $(val).data('lzslider-param');

			if(status.flag){

				status.cPoint-=param.num;

				$(val).sliderExcute();

			}

			param.auto && self.start();

		})

		return this;

	}

	tool.prototype.setInterval = function(num){

		var me = this.$ele,

		self = this;

		$.each(me,function(index,val){

			self.stop();

			var param = $(val).data('lzslider-param');

			num>param.speed && (param.interval = ~~num);

			param.auto && self.start();

		})

		return this;

	}

	tool.prototype.setSpeed = function(num){

		var me = this.$ele;

		$.each(me,function(index,val){

			var param = $(val).data('lzslider-param');

			num<param.interval && (param.speed=~~num);

		})

		return this;

	}

	tool.prototype.start = function(){

		var me = this.$ele;

		$.each(me,function(index,val){

			var status = $(val).data('lzslider-status'),

			param = $(val).data('lzslider-param');

			if(!status.timer){

				status.timer = setInterval(val.sliderexcute.autoPlay.bind(val.sliderexcute),param.interval);

			}

		})

		return this;

	}

	tool.prototype.stop = function(){

		var me = this.$ele;

		$.each(me,function(index,val){

			var status = $(val).data('lzslider-status');

			if(status.timer){

				clearInterval(status.timer);

				status.timer = null;

			}

		})

		return this;

	}

	tool.prototype.onCycle = function(){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzslider-param').cycle = true;

		})

		return this;

	}

	tool.prototype.offCycle = function(){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzslider-param').cycle = false;

		})

		return this;
	}

	tool.prototype.on = function(str,fn){

		var me = this.$ele;

		if(typeof fn ==='function'){

			$.each(me,function(index,val){

				str ==='switch' && ($(val).data('lzslider-param')._onSwitch = fn);

				str === 'last' && ($(val).data('lzslider-param')._onLast = fn);

			})

		}

	}

	$.fn.sliderExcute = function(){

		var me = $(this).get(0);

		me.sliderexcute.onProgress();

	}

	$.fn.sliderTool = function(){

		var me = $(this);

		return new tool(me);

	}


	$.fn.lzslider = function(a,b,c,d){

		var me = $(this);

		$.each(me,function(index,val){

			var newSlider = new sliderInit(val,a,b,c,d);

			val.sliderexcute = new sliderMethods(val);

			newSlider.layout();

			newSlider.initEvent();

		})

		return me.sliderTool();

	}

})(jQuery)