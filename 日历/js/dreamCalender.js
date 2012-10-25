	function dreamCalendar(options){
		this.container = null;
		this.input = dream('.dreamDatePicker');
		this.theme = options.theme;
		
		this.prevMonthBtn = null;
		this.yearSelector = null;
		this.monthSelector = null;
		this.nextMonthBtn = null;
		this.curInput = null;
		
		this.daysContainer = null;
		
		var d = new Date();
		this.curYear = options.curYear || d.getFullYear();
		this.curMonth = options.curMonth || d.getMonth()+1;
		this.curDay = options.curDay || d.getDate();
		
		this.init();
	};
	dreamCalendar.prototype = {
		init: function(){

			this.creatCss();
			this.dataPicker();
		},
		dataPicker: function(){
			this.createCanlendar();
			this.calenderEvent();
			var that = this;
			this.input.each(function(){
				dream(this).addEvent('click',function(){
					that.curInput = dream(this);
					var pos = dream(this).getElemPosition();
					that.container.css({display:'block',left:pos.left+'px',top:this.offsetHeight+pos.top+'px'});
				});
			});
		},
		creatCss: function(){
			if(dream('#dreamCanlenderSkin').size()>1) return;
				var link = dream.create('link');
				dream('head').append(link);
				dream(link).attr('rel', 'stylesheet').attr('href',this.theme).attr('id','dreamCanlenderSkin');		
		},
		createCanlendar: function(){
			this.container = dream.create('div');
			dream(document.body).append(this.container);
			this.container = dream(this.container).addClass('dreamCalendar');
			this.monthDaysContainer = null;
			
			this.drawTopTool();
			this.drawMonthDays(this.curYear,this.curMonth,this.curDay);
			this.drawBottomTool();
		},
		getMonthDays: function(year,month){
	        var f = new Date(year, month -1  ,1).getDay(), //求出当月的第一天是星期几
	        dates = new Date(year, month , 0).getDate(),//上个月的第零天就是今个月的最后一天
	        arr = new Array(42),
			i = 0;//用来装载日期的数组，日期以'xxxx-xx-xx'的形式表示
	        for( ; i < dates ; i ++ ,f ++){
	           // arr[f] = year +'-'+ month +'-'+ (i+1) ;
				arr[f] = i+1 ;
	        }
	        return arr;
		},
		drawTopTool: function(){
			var topHTML,
				yearSelectHTML = '<select class="yearSelector">',
				monthSelectHTML = '<select class="monthSelector">',
				yearI = 1900,
				monthI = 1;
				
			for( ; yearI <= 2049 ; yearI++ ){
				yearSelectHTML += '<option value="' + yearI + '">' + yearI + '</option>';
			}
			yearSelectHTML+='</select>';
			for( ; monthI <= 12 ; monthI++ ){
				monthSelectHTML += '<option value="' + monthI + '">' + monthI + '</option>';
			}
			monthSelectHTML+='</select>';
			
			topHTML = [
				'<div class="calenderTopTool">',
				'<div class="prevMonth">&lt;</div>',
				yearSelectHTML,
				monthSelectHTML,
				'<div class="nextMonth">&gt;</div>',
				'</div>',
				'<div class="daysContainer"></div>'
			].join('');
			this.container.html(topHTML);
			
			this.prevMonthBtn = this.container.find('.prevMonth').eq(0);
			this.yearSelector = this.container.find('.yearSelector').eq(0).val(this.curYear);
			this.monthSelector = this.container.find('.monthSelector').eq(0).val(this.curMonth);
			this.nextMonthBtn = this.container.find('.nextMonth').eq(0);
			this.daysContainer = this.container.find('.daysContainer').eq(0).addClass('daysContainer');
			
			
		},
		drawMonthDays: function(year,month,day){
			var days = this.getMonthDays(year,month) ,
				table = '<table><thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead><tbody><tr>',
				i = 0,
				d,
				that = this;
				
				for( ; i < 42 ; i++ ){
					d = days[i];
					table += '<td' + (((d==day&&day)||(month==this.curMonth&&d==this.curDay))?' class="select"':'') + '>' + (d?d:'&nbsp;') + '</td>' + ((6==i%7)?'</tr><tr>':'');
				}

				table += '</tbody><table>';
				table = table.replace('<tr></tbody>','</tbody>');
				this.daysContainer.html(table);
				this.daysContainer.find('td').addEvent('mouseover',function(){
					dream(this).addClass('hover');
				})
				.addEvent('mouseout',function(){
					dream(this).removeClass('hover');
				})
				.addEvent('click',function(){
					if(this.innerHTML == '&nbsp;') return;
					var strDate = that.yearSelector.val() + '-' + that.monthSelector.val() + '-' + this.innerHTML;
					that.curInput.val(strDate.replace(/\b(\w)\b/g, '0$1'));
					that.container.css({display:'none'});
				});
		},
		drawBottomTool: function(){
			var html = [
				'<div class="calenderBottomTool">',
				'<a href="javascript:;" class="todayBtn">今天</a>',
				'<a href="javascript:;" class="cancleBtn">取消</a>',
				'</div>'
			].join('');
			this.container.insertHTML(html);
			
			this.todayBtn = this.container.find('.todayBtn');
			this.cancleBtn = this.container.find('.cancleBtn');
		},
		nextMonth: function(){
			var month = parseInt(this.monthSelector.val())+1,
				year  = parseInt(this.yearSelector.val());
				if( month > 12 ){
					month = 1;
					year = year > 2048 ? 1900 : year+1;
				}
			this.monthSelector.val(month);
			this.yearSelector.val(year);
			this.drawMonthDays(year,month);
		},
		prevMonth: function(){
			var month = parseInt(this.monthSelector.val())-1,
				year  = parseInt(this.yearSelector.val());
				if( month < 1 ){
					month = 12;
					year = year < 1901 ? 2049 : year-1;
				}
			this.monthSelector.val(month);
			this.yearSelector.val(year);
			this.drawMonthDays(year,month);
		},
		calenderEvent: function(){
			var that = this;
			this.nextMonthBtn.addEvent('click',function(){
				that.nextMonth();
			});
			this.prevMonthBtn.addEvent('click',function(){
				that.prevMonth();
			});
			this.yearSelector.addEvent('change',function(){
				that.drawMonthDays(parseInt(dream(this).val()),parseInt(that.monthSelector.val()));
			});
			this.monthSelector.addEvent('change',function(){
				that.drawMonthDays(parseInt(that.yearSelector.val()),parseInt(dream(this).val()));
			});
			this.todayBtn.addEvent('click',function(){
				that.curInput.val((that.curYear+'-'+that.curMonth+'-'+that.curDay).replace(/\b(\w)\b/g, '0$1'));
				that.container.css({display:'none'});
			});
			this.cancleBtn.addEvent('click',function(){
				that.container.css({display:'none'});
			});			
		}
	};