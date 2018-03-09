layui.use(['api', 'jquery', 'form', 'layer', 'laydate'], function() {
	$ = layui.jquery;
	var api = layui.api;
	form = layui.form;
	api.getResource();
	layer = layui.layer;
	laydate = layui.laydate;

	function add(i) {
		return i > 10 ? i : '0' + i
	}
	$(document).ajaxStart(function() {
		layer.load(2);
	});
	$(document).ajaxSuccess(function() {
		layer.closeAll('loading');
	});
	//时间渲染
	laydate.render({
		elem: '#date',
		type: 'month',
		done: function(value, date, endDate) {
			$('#start').val(date.year + '-' + add(date.month))
		}
	});
	laydate.render({
		elem: '#date1',
		type: 'month',
		range: true,
		done: function(value, date, endDate) {
			$('#start').val(date.year + '-' + add(date.month))
			$('#end').val(endDate.year + '-' + add(endDate.month))
		}
	});
	//开关监听
	form.on('switch(issueMethods)', function(data) {
		$('#date1').val('');
		$('#date').val('');
		if(data.elem.checked) {
			$('#dates').val('true')
			$('#date1').show();
			$('#date').hide();
		} else {
			$('#dates').val('false')
			$('#date1').hide();
			$('#date').show();
		}
		form.render()
	});
	//权限监听
	form.on('switch(authGrades)', function(data) {
		console.log(data.elem.checked)
		if(data.elem.checked) {
			$('#authGradess').val('false')
			$('.authGrade').parent('.layui-input-inline ').hide()

		} else {
			$('#authGradess').val('true')
			$('.authGrade').parent('.layui-input-inline ').show()
		}
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
						if(i == 0) {
							html += '<option value="' + v.bscd + '" >' + v.bsnm + '</option>'
						} else {
							html += '<option value="' + v.bscd + '">' + v.bsnm + '</option>'
						}
					})
					$('.two ').html(html)
					$('.three ').html('<option value="">三级流域</option>')
					$('.cz ').html('<option value="">测站</option>')
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
						if(i == 0) {
							html += '<option value="' + v.bscd + '" >' + v.bsnm + '</option>'
						} else {
							html += '<option value="' + v.bscd + '">' + v.bsnm + '</option>'
						}
					})
					$('.three ').html(html)

				} else {
					$('.three ').html('<option value="">三级流域</option>')
				}
				form.render();
			}
		})

	})

	//获取测站
	form.on('select(reso)', function(data) {
		var resourceID = data.value;
		console.log(1)
		$('.three ').html('<option value="">三级流域</option>')
		$('.cz ').html('<option value="">测站</option>');
		$('.data_content').html('暂无数据');
		$('.two ').html('<option value="">二级流域</option>')
		form.render()
		form.on('select(area)', function(data) {
			var bss = data.value;
			api.getStations(resourceID, bss, function(data) {
				if(data.status == true) {
					if(data.data != null) {
						var html = '';
						html += '<option value="" >请选择</option>'
						$.each(data.data, function(i, v) {
							if(i == 0) {
								html += '<option value="' + v.stcd + '" >' + v.stnm + '</option>'
							} else {
								html += '<option value="' + v.stcd + '">' + v.stnm + '</option>'
							}
						})
						$('.cz').html(html)
					}
					form.render();
				} else {
					layer.msg(data.msg)
					$('.cz ').html('<option value="">测站</option>')
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
				console.log(data)
				if(data.status == true) {
					if(data.data != null) {
						var html = '';
						html += '<option value="" >请选择</option>'
						$.each(data.data, function(i, v) {
							if(i == 0) {
								html += '<option value="' + v.stcd + '" >' + v.stnm + '</option>'
							} else {
								html += '<option value="' + v.stcd + '">' + v.stnm + '</option>'
							}
						})
						$('.cz').html(html)
						form.render();
					}

				} else {
					layer.msg(data.msg)
					$('.cz ').html('<option value="">测站</option>')
					form.render();
					return false;
				}

			})
		})
	})
	form.on('select(tag)', function(data) {
		$('#tag').val(data.value)
		if(data.value == 0) {
			$('.cz').parent('.layui-input-inline').show();
		} else {
			$('.cz').parent('.layui-input-inline').hide();
		}
	})
	//权限等级
	form.on('select(authGrade)', function(data) {
		if(data.value == 0) {
			$('#authGrade').val(data.value)
		} else if(data.value == 1) {
			$('#authGrade').val(data.value)
		} else if(data.value == 2) {
			$('#authGrade').val(data.value)
		}

	})
	//新增配置
	form.on('submit(formDemo)', function(data) {
		var resourceID = data.field.resourceID;
		var tag = $('#tag').val();
		var issueMethods = $('#dates').val();
		var issueSchemas = $('#authGradess').val();
		if(tag == 0) {
			var code = data.field.stationCode;
			if(issueMethods == 'false') {
				var startDate = $('#start').val();
				var endDate = '';
				if(issueSchemas == 'false') {
					var issueSchema = $('#authGradess').val();

					api.issueConfs(resourceID, code, tag, startDate, endDate, issueMethods, issueSchema, function(data) {
						console.log(data)
						if(data.status == true) {

						} else {
							if(data.data == null) {
								layer.msg(data.msg)
								layer.closeAll('loading');
							} else {
								layer.msg(data.data[0].msg)
								layer.closeAll('loading');
							}
						}
					})
				} else {
					var authGrade = $('#authGrade').val();
					var issueSchema = $('#authGradess').val();
					console.log(issueSchema)
					api.issueConfs(resourceID, code, tag, startDate, endDate, issueMethods, issueSchema, authGrade, function(data) {
						console.log(data)
						if(data.status == true) {
							if(data.data != null) {
								layer.msg(data.msg)
							} else {
								layer.msg(data.msg)
							}
						} else {
							if(data.data == null) {
								layer.msg(data.msg)
								layer.closeAll('loading');
							} else {
								layer.msg(data.data[0].msg)
								layer.closeAll('loading');
							}
						}
					})
				}
			} else {
				var startDate = $('#start').val();
				var endDate = $('#end').val();
				if(issueSchemas == 'false') {
					var issueSchema = $('#authGradess').val();
					api.issueConfs(resourceID, code, tag, startDate, endDate, issueMethods, issueSchema, function(data) {
						console.log(data)
						if(data.status == true) {
							if(data.data != null) {
								layer.msg(data.msg)
							} else {
								layer.msg(data.msg)
							}
						} else {
							if(data.data == null) {
								layer.msg(data.msg)
								layer.closeAll('loading');
							} else {
								layer.msg(data.data[0].msg)
								layer.closeAll('loading');
							}
						}
					})
				} else {
					var authGrade = $('#authGrade').val();
					var issueSchema = $('#authGradess').val();
					api.issueConfs(resourceID, code, tag, startDate, endDate, issueMethods, issueSchema, authGrade, function(data) {
						console.log(data)
						if(data.status == true) {
							if(data.data != null) {
								layer.msg(data.msg)
							} else {
								layer.msg(data.msg)
							}
						} else {
							if(data.data == null) {
								layer.msg(data.msg)
								layer.closeAll('loading');
							} else {
								layer.msg(data.data[0].msg)
								layer.closeAll('loading');
							}
						}
					})
				}
			}

		} else {
			console.log(tag)
			var code = data.field.area;
			if(issueMethods == 'false') {
				var startDate = $('#start').val();
				var endDate = '';
				if(issueSchemas == 'false') {
					var issueSchema = $('#authGradess').val();
					console.log(issueSchema)
					api.issueConfs(resourceID, code, tag, startDate, endDate, issueMethods, issueSchema, function(data) {
						console.log(data)
						if(data.status == true) {
							if(data.data != null) {
								layer.msg(data.msg)
							} else {
								layer.msg(data.msg)
							}
						} else {
							if(data.data == null) {
								layer.msg(data.msg)
								layer.closeAll('loading');
							} else {
								layer.msg(data.data[0].msg)
								layer.closeAll('loading');
							}
						}
					})
				} else {
					var authGrade = $('#authGrade').val();
					var issueSchema = $('#authGradess').val();
					console.log(issueSchema)
					api.issueConfs(resourceID, code, tag, startDate, endDate, issueMethods, issueSchema, authGrade, function(data) {
						console.log(data)
						if(data.status == true) {
							if(data.data != null) {
								layer.msg(data.msg)
							} else {
								layer.msg(data.msg)
							}
						} else {
							if(data.data == null) {
								layer.msg(data.msg)
								layer.closeAll('loading');
							} else {
								layer.msg(data.data[0].msg)
								layer.closeAll('loading');
							}
						}
					})
				}
			} else {
				var startDate = $('#start').val();
				var endDate = $('#end').val();
				if(issueSchemas == 'false') {
					var issueSchema = $('#authGradess').val();
					api.issueConfs(resourceID, code, tag, startDate, endDate, issueMethods, issueSchema, function(data) {
						console.log(data)
						if(data.status == true) {
							if(data.data != null) {
								layer.msg(data.msg)
							} else {
								layer.msg(data.msg)
							}
						} else {
							if(data.data == null) {
								layer.msg(data.msg)
								layer.closeAll('loading');
							} else {
								layer.msg(data.data[0].msg)
								layer.closeAll('loading');
							}
						}
					})
				} else {
					var authGrade = $('#authGrade').val();
					var issueSchema = $('#authGradess').val();
					api.issueConfs(resourceID, code, tag, startDate, endDate, issueMethods, issueSchema, authGrade, function(data) {
						console.log(data)
						if(data.status == true) {
							if(data.data != null) {
								layer.msg(data.msg)
							} else {
								layer.msg(data.msg)
							}
						} else {
							if(data.data == null) {
								layer.msg(data.msg)
								layer.closeAll('loading');
							} else {
								layer.msg(data.data[0].msg)
								layer.closeAll('loading');
							}
						}
					})
				}
			}
		}
		return false;
	})

});