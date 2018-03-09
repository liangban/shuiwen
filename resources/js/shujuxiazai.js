layui.use(['api', 'jquery', 'form', 'layer', 'laydate'], function() {
	$ = layui.jquery;
	var api = layui.api;
	form = layui.form;
	api.getResource();
	layer = layui.layer;
	laydate = layui.laydate;
	  $(document).ajaxStart(function(){
            layer.load(2);
        });
        $(document).ajaxSuccess(function(){
             layer.closeAll('loading');
        });
	//获取一级流域
	var bs = -1;
	api.getBasins(bs, function(data) {
		if(data.status == true) {
			var html = '';
			html += '<option value="" >一级流域</option>'
			$.each(data.data, function(i, v) {
				html += '<option value="' + v.bscd + '">' + v.bsnm + '</option>'
			})
			$('.one ').html(html)
			$('.one1 ').html(html)
			form.render();
		}
	})
	form.on('select(province)', function(data) {
		var bs1 = data.value;
		api.getBasins(bs1, function(data) {
			if(data.status == true) {
				if(data.data != null) {
					var html = '';
					html += '<option value="" >请选择</option>'
					$.each(data.data, function(i, v) {
						html += '<option value="' + v.bscd + '">' + v.bsnm + '</option>'
					})
					$('.two ').html(html)
					$('.three ').html('<option value="">三级流域</option>')
				} else {
					layer.msg(data.msg);
					$('.two ').html('<option value="">三级流域</option>')

				}
				form.render();
			}
		})

	})
	form.on('select(city)', function(data) {
		var bs2 = data.value;
		api.getBasins(bs2, function(data) {
			if(data.status == true) {
				if(data.data != null) {
					var html = '';
					html += '<option value="" >请选择</option>'
					$.each(data.data, function(i, v) {
						html += '<option value="' + v.bscd + '">' + v.bsnm + '</option>'
					})
					$('.three ').html(html)

				} else {
					$('.three ').html('<option value="">三级流域</option>')
					layer.msg(data.msg)

				}
				form.render();
			}
		})

	})
	form.on('select(province1)', function(data) {
		var bs1 = data.value;
		api.getBasins(bs1, function(data) {
			if(data.status == true) {
				if(data.data != null) {
					var html = '';
					html += '<option value="" >请选择</option>'
					$.each(data.data, function(i, v) {
						html += '<option value="' + v.bscd + '">' + v.bsnm + '</option>'
					})
					$('.two1 ').html(html)
					$('.three1 ').html('<option value="">三级流域</option>')
				} else {
					layer.msg(data.msg);
					$('.two1 ').html('<option value="">三级流域</option>')
				}
				form.render();
			}
		})
	})
	form.on('select(city1)', function(data) {
		var bs2 = data.value;
		api.getBasins(bs2, function(data) {
			if(data.status == true) {
				if(data.data != null) {
					var html = '';
					html += '<option value="" >请选择</option>'
					$.each(data.data, function(i, v) {
						html += '<option value="' + v.bscd + '">' + v.bsnm + '</option>'
					})
					$('.three1 ').html(html)

				} else {
					$('.three1 ').html('<option value="">三级流域</option>')
					layer.msg(data.msg)

				}
				form.render();
			}
		})
	})
	//获取测站
	form.on('select(reso)', function(data) {
		var resourceID = data.value;
		form.on('select(area)', function(data) {
			var bss = data.value;
			api.getStations(resourceID, bss, function(data) {
				if(data.status == true) {
					if(data.data != null) {
						$('.form .layui-btn').removeClass('layui-btn-disabled');
						$('.form .layui-btn').removeAttr('disabled');
						var html = '';
						html += '<option value="" >请选择</option>'
						$.each(data.data, function(i, v) {
							html += '<option value="' + v.stcd + '">' + v.stnm + '</option>'
						})
						$('.cz').html(html)
					}
					form.render();
				} else {
					layer.msg(data.msg)
					$('.cz ').html('<option value="">测站</option>')
					$('.form .layui-btn').addClass('layui-btn-disabled');
					$('.form .layui-btn').attr('disabled');
					$('.data_content').html('暂无数据');
					form.render();
					return false;
				}
			})
		})
	})
	form.on('select(area)', function(data) {
		var bss = data.value;
		form.on('select(reso)', function(data) {
			var resourceID = data.value;
			api.getStations(resourceID, bss, function(data) {
				if(data.status == true) {
					if(data.data != null) {
						$('.form .layui-btn').removeClass('layui-btn-disabled');
						$('.form .layui-btn').removeAttr('disabled');
						var html = '';
						html += '<option value="" >请选择</option>'
						$.each(data.data, function(i, v) {
							html += '<option value="' + v.stcd + '">' + v.stnm + '</option>'
						})
						$('.cz').html(html)
						form.render();
					}

				} else {
					layer.msg(data.msg)
					$('.form .layui-btn').addClass('layui-btn-disabled');
					$('.form .layui-btn').attr('disabled');
					$('.data_content').html('暂无数据');
					$('.cz ').html('<option value="">测站</option>')
					form.render();
					return false;
				}

			})
		})
	})
	//查询
	form.on('submit(formDemo)', function(data) {
		var resourceID = data.field.resourceID;
		var stationCode = data.field.stationCode;
		var startDate=$('#start').val();
		var endDate=$('#end').val();
		api.downloadrecord(stationCode,resourceID ,startDate,endDate, function(datas) {
			
			if(datas.status == true) {
				var html = ''

				$.each(datas.data, function(i, v) {
					html += '<ul class="row">' +
						'                <li class="col-1">' + v.downloadOrder.downloadOrderID + '</li>' +
						'                <li class="col-2">' +  v.downloadOrder.downloadFileName + '</li>' +
						'                <li class="col-2">' +  v.downloadUserName + '</li>' +
						'                <li class="col-1">' +  v.downloadOrder.startTime + '</li>' +
						'                <li class="col-1">' + v.downloadOrder.endTime + '</li>' +
						'                <li class="col-3">' +  v.downloadOrder.fileUrl + '</li>' +
						
						'                <li class="col-1"><button class="remove" data-resourceDataID='+ v.downloadOrderID + ' data-v='+JSON.stringify(v)+'>查看</button></li>' +
						'            </ul>';
						
				})
				
				$('.data_name3').html(html);

			} else {
				if(datas.data==null){
                        	layer.msg(datas.msg)
                        	 layer.closeAll('loading');
                        }
                        else{
                        	layer.msg(datas.data[0].msg)
                        	 layer.closeAll('loading');
                        }

			}
		})
		return false;
	})

	function add(i) {
		return i > 10 ? i : '0' + i
	}
	//时间渲染
	laydate.render({
		elem: '#date',
		type: 'date',
		range: true,
		done: function(value, date, endDate) {
			console.log(date)
			$('#start').val(date.year + '-' + add(date.month)+ '-' + add(date.date))
			$('#end').val(endDate.year + '-' + add(endDate.month)+ '-' + add(endDate.date))
		}
	});
	$(function() {
		$('.form1 .add').on('click', function() {
			$('.layer').fadeIn();
		})
		$('.add_catalog a').on('click', function() {
			$('.layer').fadeOut();
		})
	})
	form.on('select(reso1)', function(data) {
		var resourceID = data.value;
		form.on('select(area1)', function(data) {
			var bss = data.value;
			api.getStations(resourceID, bss, function(data) {
				if(data.status == true) {
					if(data.data != null) {
						var html = '';
						html += '<option value="" >请选择</option>'
						$.each(data.data, function(i, v) {
							html += '<option value="' + v.stcd + '">' + v.stnm + '</option>'
						})
						$('.cz1').html(html)

					}
					form.render();

				} else {
					layer.msg(data.msg)
					$('.cz1 ').html('<option value="">测站</option>')
					form.render();
					return false;

				}

			})
		})
	})
	form.on('select(area1)', function(data) {
		var bss = data.value;
		form.on('select(reso1)', function(data) {
			var resourceID = data.value;
			api.getStations(resourceID, bss, function(data) {
				if(data.status == true) {
					if(data.data != null) {
						var html = '';
						html += '<option value="" >请选择</option>'
						$.each(data.data, function(i, v) {
							html += '<option value="' + v.stcd + '">' + v.stnm + '</option>'
						})
						$('.cz1').html(html)
						form.render();
					}

				} else {
					layer.msg(data.msg)
					$('.data_content').html('暂无数据');
					$('.cz ').html('<option value="">测站</option>')

					form.render();
					return false;

				}

			})
		})
	})
	$(document).on('click','.remove',function(){
		var v=JSON.parse($(this).attr('data-v'))
						var html1=''
		layer.open({
					type:1,
					title:'详情',
					shadeClose:true,
					area:['1101px','600px'],
					content:$('.data_name1'),
					isOutAnim:true,
				})
		$.each(v.downloadOrderItems,function(i, v) {
					html1 += '<ul class="row">' +
						'                <li class="col-1">' + i + '</li>' +
						'                <li class="col-3">' + v.itemName + '</li>' +
						'                <li class="col-2">' + v.startDate + '</li>' +
						'                <li class="col-2">' + v.endDate + '</li>' +
						'                <li class="col-2">' + v.resourceName + '</li>' +
						'                <li class="col-2">' + v.stationName + '</li>' +
						'            </ul>';
					})
						$('.data_name2').html(html1);
	})
});