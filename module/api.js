var url = 'http://www.tomylee.top/';
layui.define(['jquery', 'form'], function(exports) {
	var $ = layui.jquery;
	var form = layui.form;
	var obj = {
		//获取树状图
		getTree: function() {
			var json = {};
			$.ajax({
				url: url + 'resource/tree',
                xhrFields: {withCredentials: true},
				type: 'get',
				data: json,
				dataType: "json",
				success: function(data) {
					if(data.status == true) {
						var zNodes = data.data;
						var setting = {
							
							check: {
								enable: true
							},
							data: {
								simpleData: {
									enable: true
								}
							},
							edit: {
								enable: false
							}
						};
						$(document).ready(function() {
							$.fn.zTree.init($("#tree"), setting, zNodes);
						});
						var newCount = 1;
						var treeObj = $.fn.zTree.getZTreeObj("tree");
						var sNodes = treeObj.getSelectedNodes();
						if(sNodes.length > 0) {
							var node = sNodes[0].getIndex();
						}

						function addHoverDom(treeId, treeNode) {
							var sObj = $("#" + treeNode.tId + "_span");
							if(treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
							var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
								"' title='add node' onfocus='this.blur();'></span>";
							sObj.after(addStr);
							var btn = $("#addBtn_" + treeNode.tId);
							if(btn) btn.bind("click", function() {
								var zTree = $.fn.zTree.getZTreeObj("tree");
								$('.layer').show();
								zTree.addNodes(treeNode, {
									id: (100 + newCount),
									pid: treeNode.id,
									name: "new node" + (newCount++)
								});
								return false;
							});
						};

						function removeHoverDom(treeId, treeNode) {
							$("#addBtn_" + treeNode.tId).unbind().remove();
						};

					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
			var json1 = {}
			$.ajax({
				url: url + 'resource/tree',
                xhrFields: {withCredentials: true},
				type: 'get',
				data: json1,
				dataType: 'json',
				success: function(data) {
					var html = '';
					$.each(data.data, function(i, v) {
						if(v.pid == '-1') {
							html += '<option value=' + v.id + ' pid=' + v.pid + '>' + v.name + '&nbsp;' + v.id + ' </option>'
						}
					})
					$('.parent_catalog').html(html)
					form.render();
				}
			})
		},
		addTree: function(pResourceID, resourceType, resourceID, resourceName, info, callback) {
			var json = {
				"resourceID": resourceID,
				"resourceName": resourceName,
				"resourceType": resourceType,
				"pResourceID": pResourceID,
				"info": info
			}
			// console.log(resourceID, resourceName, resourceType, pResourceID, info);

			$.ajax({
				url: url + 'admin/resource',
                xhrFields: {withCredentials: true},
				type: 'post',
				data: json,
				dataType: "json",
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})

		},
		//获取资源名称
		getResource: function() {
			var json = {};
			$.ajax({
				type: "get",
				url: url + "resource",
                xhrFields: {withCredentials: true},
				dataType: "json",
				success: function(data) {
					if(data.status == true) {
						var html = '';
						$.each(data.data, function(i, v) {
							html += ' <option value="' + v.resourceID + '">' + v.resourceName + '</option>'
						})
						$('.resoce').append(html)
						$('.resoce1').append(html)
						form.render();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			});
		},
		//获取流域
		getBasins: function(bs, callback) {
			var json = {
				'BSCD': bs
			}
			$.ajax({
				type: 'get',
                xhrFields: {withCredentials: true},
				url: url + "basins",
				dataType: "json",
				data: json,
				success: callback
			})
		},
		//获取测站
		getStations: function(resourceID, BSCD, callback) {
			var json = {
				'resourceID': resourceID,
				'BSCD': BSCD,
			};
			$.ajax({
				type: 'get',
                xhrFields: {withCredentials: true},
				url: url + "stations",
				dataType: "json",
				data: json,
				success: callback
			})
		},
		//查询数据
		resourceData: function(resourceID, stationCode, callback) {
			var json = {
				'resourceID': resourceID,
				'stationCode': stationCode,
			};
			$.ajax({
				type: 'get',
                xhrFields: {withCredentials: true},
				url: url + "admin/resourcedata",
				dataType: "json",
				data: json,
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
		},
		//新增
		detil: function(resourceID, stationCode, startDate, endDate, callback) {
			var json = {
				'resourceID': resourceID,
				'stationCode': stationCode,
				'startDate': startDate,
				'endDate': endDate,
			};
			$.ajax({
				type: 'post',
                xhrFields: {withCredentials: true},
				url: url + "admin/resourcedata",
				dataType: "json",
				data: json,
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
		},
		//删除数据
		deleteData: function(resourcedataid, callback) {
			$.ajax({
				type: 'delete',
				url: url + "admin/resourcedata/" + resourcedataid,
                xhrFields: {withCredentials: true},
				dataType: "json",
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
		},
		//查询配置
		issueConf: function(resourceID, code, tag, startDate, endDate, callback) {
			var json = {
				'resourceID': resourceID,
				'code': code,
				'tag': tag,
				'startDate': startDate,
				'endDate': endDate,
			}
			$.ajax({
				type: 'get',
                xhrFields: {withCredentials: true},
				url: url + "admin/issueconf",
				dataType: "json",
				data: json,
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
		},
		//新增配置
		issueConfs: function(resourceID, code, tag, startDate, endDate, issueMethods, issueSchema, authGrade, callback) {
			var json = {
				'resourceID': resourceID,
				'code': code,
				'tag': tag,
				'startDate': startDate,
				'endDate': endDate,
				'issueSchema': issueSchema,
				'issueMethods': issueMethods,
				'authGrade': authGrade,
			}
			layer.msg("");
			$.ajax({
				type: 'post',
				url: url + "admin/issueconf",
				dataType: "json",
				data: json,
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
		},
		//删除配置
		removeData: function(num, callback) {
			$.ajax({
				type: 'delete',
				url: url + "admin/issueconf/" + num,
                xhrFields: {withCredentials: true},
				dataType: "json",
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
		},
		//修改配置
		issueReConfs: function(num, startDate, endDate, issueSchema, authGrade, callback) {
			var json = {
				'startDate': startDate,
				'endDate': endDate,
				'issueSchema': issueSchema,
				'authGrade': authGrade,
			}
			$.ajax({
				type: 'put',
                xhrFields: {withCredentials: true},
				url: url + "admin/issueconf/" + num,
				dataType: "json",
				data: json,
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
		},
		//		查询配置
		issueData: function(resourceID, stationCode, startDate, endDate, callback) {
			var json = {
				'startDate': startDate,
				'endDate': endDate,
				'resourceID': resourceID,
				'stationCode': stationCode,
			}
			$.ajax({
				type: 'get',
				url: url + "admin/issuedata",
                xhrFields: {withCredentials: true},
				dataType: "json",
				data: json,
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
		},
		//查看申请
		appliCation: function(startDate, endDate, callback) {
			var json = {
				'startDate': startDate,
				'endDate': endDate,
			}
			$.ajax({
				type: 'get',
				url: url + "admin/application",
                xhrFields: {withCredentials: true},
				dataType: "json",
				data: json,
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
		},
		//查询审核
		approveRecord: function(startDate, endDate, callback) {
			var json = {
				'startDate': startDate,
				'endDate': endDate,
			}
			$.ajax({
				type: 'get',
				url: url + "admin/approveRecord",
                xhrFields: {withCredentials: true},
				dataType: "json",
				data: json,
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
		},
		//审核
		applicationID: function(applicationID, ok, description, callback) {
			var json = {
				'ok': ok,
				'description': description,
			}
			$.ajax({
				type: 'put',
				url: url + "admin/application/" + applicationID,
                xhrFields: {withCredentials: true},
				dataType: "json",
				data: json,
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
		},
		//	角色管理
		roleTree: function() {
			var json = {}
			$.ajax({
				url: url + 'admin/role/tree',
				type: 'get',
                xhrFields: {withCredentials: true},
				data: json,
				dataType: "json",
				success: function(data) {
					console.log(data)
					if(data.status == true) {
						var zNodes = data.data;
						var setting = {
							view: {
								addHoverDom: addHoverDom,
								removeHoverDom: removeHoverDom,
								selectedMulti: false
							},
							check: {
								enable: true
							},
							data: {
								simpleData: {
									enable: true
								}
							},
							edit: {
								enable: true
							},
							callback: {
								onRemove: onRemove
							}

						};

						function onRemove(i, v, data) {
							var number = data.id;
							console.log(number)
							$.ajax({
								url: url + 'admin/role/' + number,
								dataType: 'json',
								type: 'delete',
                                xhrFields: {withCredentials: true},
								success: function(data) {
									if(data.status == true) {
										$('li[infoid=' + number + ']').remove();
										layer.msg(data.msg)
									} else {
										layer.msg(data.msg)
									}
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) {
									layer.msg('网络错误')
								}
							})

						}
						$(document).ready(function() {
							$.fn.zTree.init($("#tree"), setting, zNodes);
						});
						var newCount = 1;

						function addHoverDom(treeId, treeNode) {
							var sObj = $("#" + treeNode.tId + "_span");
							sObj.parents('li.level0').attr('infoid', treeNode.id);
							if(treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
							var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
								"' title='add node' onfocus='this.blur(); infoid='" + treeNode.id + "''></span>";
							sObj.after(addStr);
							var btn = $("#addBtn_" + treeNode.tId);
							if(btn) btn.bind("click", function() {
								var zTree = $.fn.zTree.getZTreeObj("tree");
								$('.layer').show();
								return false;
							});
						};

						function removeHoverDom(treeId, treeNode) {
							$("#addBtn_" + treeNode.tId).unbind().remove();
						};
						var option = ''
						$.each(data.data, function(i, v) {
							if(v.pid == '-1') {
								// console.log($(this))
								option += '<option value="' + v.pid + '">' + v.name + '</option>'
							}
						})
						$('.layui-input-block .parent_catalog').append(option);
						form.render();
					}
				}
			})
		},
		//添加角色
		addrole: function(roleName, roleType, pRoleID, callback) {
			var json = {
				"roleName": roleName,
				"roleType": roleType,
				"pRoleID": pRoleID
			}
			$.ajax({
				url: url + 'admin/role',
				type: "post",
                xhrFields: {withCredentials: true},
				dataTYpe: 'json',
				data: json,
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
		},
		// 获取工作组
		getworks: function() {
			var json = {}
			$.ajax({
				utl: url + 'admin/workgroup/tree',
                xhrFields: {withCredentials: true},
				type: 'get',
				data: json,
				dataType: 'json',
				success: function(data) {
					console.log(data)
					if(data.status == true) {
						var zNodes = data.data;
						var setting = {
							view: {
								addHoverDom: addHoverDom,
								removeHoverDom: removeHoverDom,
								selectedMulti: false
							},
							check: {
								enable: true
							},
							data: {
								simpleData: {
									enable: true
								}
							},
							edit: {
								enable: true
							},
							callback: {
								onRemove: onRemove
							}

						};

						function onRemove(i, v, data) {
							var number = data.id;
							console.log(number)
							$.ajax({
								url: url + 'admin/role/' + number,
								dataType: 'json',
								type: 'delete',
                                xhrFields: {withCredentials: true},
								success: function(data) {
									if(data.status == true) {
										$('li[infoid=' + number + ']').remove();

										layer.msg(data.msg)
									} else {
										layer.msg(data.msg)
									}
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) {
									layer.msg('网络错误')
								}
							})

						}
						$(document).ready(function() {
							$.fn.zTree.init($("#tree"), setting, zNodes);
						});
						var newCount = 1;

						function addHoverDom(treeId, treeNode) {
							var sObj = $("#" + treeNode.tId + "_span");
							// console.log(sObj)
							sObj.parents('li.level0').attr('infoid', treeNode.id);
							if(treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
							var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
								"' title='add node' onfocus='this.blur(); infoid='" + treeNode.id + "''></span>";
							sObj.after(addStr);
							var btn = $("#addBtn_" + treeNode.tId);
							if(btn) btn.bind("click", function() {
								var zTree = $.fn.zTree.getZTreeObj("tree");
								$('.layer').show();
								// zTree.addNodes(treeNode, {
								//     id: (100 + newCount),
								//     pid: treeNode.id,
								//     name: "new node" + (newCount++)
								// });
								return false;
							});
						};

						function removeHoverDom(treeId, treeNode) {
							$("#addBtn_" + treeNode.tId).unbind().remove();
						};
						var option = ''
						$.each(data.data, function(i, v) {
							if(v.pid == '-1') {
								// console.log($(this))
								option += '<option value="' + v.pid + '">' + v.name + '</option>'
							}
						})
						$('.layui-input-block .parent_catalog').append(option);
						form.render();
					}
				},
			})
		},
		//	查看日志
		getlog: function(startTime, endTime, loginName, callback) {
			var json = {
				"startTime": startTime,
				"endTime": endTime,
				"loginName": loginName
			}
			$.ajax({
				url: url + 'admin/log',
                xhrFields: {withCredentials: true},
				type: "get",
				dataType: 'json',
				data: json,
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
		},
		//测站下载查询
		downloadrecord: function(stationCode, resourceID, startDate, endDate, callback) {
			var json = {
				'stationCode': stationCode,
				'resourceID': resourceID,
				'startDate': startDate,
				'endDate': endDate
			}
			$.ajax({
				url: url + 'admin/downloadrecord',
                xhrFields: {withCredentials: true},
				type: "get",
				dataType: 'json',
				data: json,
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
		},
		//用户下载查看
		perrecord: function(loginName, startDate, endDate, callback) {
			var json = {
				'loginName': loginName,
				'startDate': startDate,
				'endDate': endDate
			}
			$.ajax({
				url: url + 'admin/user/downloadrecord',
                xhrFields: {withCredentials: true},
				type: "get",
				dataType: 'json',
				data: json,
				success: callback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('网络错误')
				}
			})
		},
        //获取资源名称
        getResource:function(){
            var json={};
            $.ajax({
                type:"get",
                url:url+"resource",
                dataType: "json",
                xhrFields: {withCredentials: true},
                success:function(data){
                    if(data.status==true){
                        var html='';
                        $.each(data.data,function(i,v){
                            html+=' <option value="'+v.resourceID+'">'+v.resourceName+'</option>'
                        })
                        $('.resoce').append(html)
                        $('.resoce1').append(html)
                        form.render();
                    }
                }
            });
        },
        //获取流域
        getBasins:function(bs,callback){
            var json={
                'BSCD':bs
            }
            $.ajax({
                type:'get',
                xhrFields: {withCredentials: true},
                url:url+"basins",
                dataType: "json",
                data:json,
                success:callback
            })
        },
        //获取测站
        getStations:function(resourceID,BSCD,callback){
            var json={
                'resourceID':resourceID,
                'BSCD':BSCD,
            };
            $.ajax({
                type:'get',
                url:url+"stations",
                xhrFields: {withCredentials: true},
                dataType: "json",
                data:json,
                success:callback
            })
        },
        //查询数据
        resourceData:function(resourceID,stationCode,callback){
            var json={
                'resourceID':resourceID,
                'stationCode':stationCode,
            };
            $.ajax({
                type:'get',
                url:url+"admin/resourcedata",
                xhrFields: {withCredentials: true},
                dataType: "json",
                data:json,
                success:callback
            })
        },
        //新增
        detil:function(resourceID,stationCode,startDate,endDate,callback){
            var json={
                'resourceID':resourceID,
                'stationCode':stationCode,
                'startDate':startDate,
                'endDate':endDate,
            };
            $.ajax({
                type:'post',
                url:url+"admin/resourcedata",
                dataType: "json",
                xhrFields: {withCredentials: true},
                data:json,
                success:callback
            })
        },
        //删除数据
        deleteData:function(resourcedataid,callback){
            $.ajax({
                type:'delete',
                url:url+"admin/resourcedata/"+resourcedataid,
                xhrFields: {withCredentials: true},
                dataType: "json",
                success:callback
            })
        },
        //查询配置
        issueConf:function(resourceID,code,tag,startDate,endDate,callback){
            var json={
                'resourceID':resourceID,
                'code':code,
                'tag':tag,
                'startDate':startDate,
                'endDate':endDate,
            }
            $.ajax({
                type:'get',
                url:url+"admin/issueconf",
                xhrFields: {withCredentials: true},
                dataType: "json",
                data:json,
                success:callback
            })
        },
        //新增配置
        issueConfs:function(resourceID,code,tag,startDate,endDate,issueMethods,issueSchema,authGrade,callback){
            var json={
                'resourceID':resourceID,
                'code':code,
                'tag':tag,
                'startDate':startDate,
                'endDate':endDate,
                'issueSchema':issueSchema,
                'issueMethods':issueMethods,
                'authGrade':authGrade,
            }
            $.ajax({
                type:'post',
                url:url+"admin/issueconf",
                xhrFields: {withCredentials: true},
                dataType: "json",
                data:json,
                success:callback
            })
        },
        //添加配置
        addTree: function (pResourceID,resourceType,resourceID,resourceName,info,callback) {
            var json = {
                "resourceID": resourceID,
                "resourceName": resourceName,
                "resourceType": resourceType,
                "pResourceID": pResourceID,
                "info": info
            }
            // console.log(resourceID, resourceName, resourceType, pResourceID, info);
            $.ajax({
                url: url + 'admin/resource',
                xhrFields: {withCredentials: true},
                type: 'post',
                data: json,
                dataType: "json",
                success: callback,
            })
        },
        //删除配置
        removeData:function(num,callback) {
            $.ajax({
                type: 'delete',
                url: url + "admin/issueconf/" + num,
                xhrFields: {withCredentials: true},
                dataType: "json",
                success: callback
            })
        },
        //	角色管理
        roleTree:function(callback){
            var json={}
            $.ajax({
                url:url+'admin/role/tree',
                xhrFields: {withCredentials: true},
                type: 'get',
                data: json,
                dataType: "json",
                success: callback,
            })
        },
        //添加角色
        addrole:function(roleName,roleType,pRoleID,callback){
            var json={
                "roleName":roleName,
                "roleType":roleType,
                "pRoleID":pRoleID
            }
            $.ajax({
                url:url+'admin/role',
                xhrFields: {withCredentials: true},
                type:"post",
                dataType:'json',
                data:json,
                success:callback,
            })
        },
        // 查看角色权限
        getworkauthority:function(num,callback){
            var json={}
            $.ajax({
                url:url+'admin/role/'+num+'/authority',
                xhrFields: {withCredentials: true},
                type:'get',
                dataType:'json',
                data:json,
                success:callback,
            })
        },
        //查询工作组权限
        groupauthority:function(num,callback){
            var json={};
            $.ajax({
                url:url+'admin/workgroup/'+num+'/authority',
                xhrFields: {withCredentials: true},
                type:'get',
                dataType:'json',
                data:json,
                success:callback,
            })
        },
        // 获取工作组
        getworks:function(callback){
            var json={}
            $.ajax({
                url:url+'admin/workgroup/tree',
                xhrFields: {withCredentials: true},
                type:'get',
                data:json,
                dataType:'json',
                success:callback

            })
        },
        // 添加工作组
        addgroup:function(workGroupName,workGroupType,pWorkGroupID,callback){
            var json={
                "workGroupName":workGroupName,
                "workGroupType":workGroupType,
                "pWorkGroupID":pWorkGroupID
            }
            $.ajax({
                url:url+'admin/workgroup',
                xhrFields: {withCredentials: true},
                type:"post",
                dataType:"json",
                data:json,
                success:callback,

            })
        },
        //查询用户
        usermanage:function(user,callback){
            var json={
                "user":user
            }
            $.ajax({
                type:"get",
                url:url+"admin/user/info",
                xhrFields: {withCredentials: true},
                dataType:'json',
                data:json,
                success:callback,
            })
        },
        //编辑用户
        compileuser:function(num,userName,loginName,phoneNumber,userProperty,companyName,callback){
            console.log(num)
            var json={
                "userName":userName,
                "loginName":loginName,
                "phoneNumber":phoneNumber,
                "userProperty":userProperty,
                "companyName":companyName
            }
            $.ajax({
                url:url+'admin/user/'+num+'/info',
                xhrFields: {withCredentials: true},
                type:"PUT",
                data:json,
                dataType:'json',
                success:callback,
            })
        },
        // 重置密码
        resetpassword:function(num,password,confirmPassword,callback){
            var json={
                "password":password,
                "confirmPassword":confirmPassword
            }
            $.ajax({
                url:url+'admin/user/'+num+'/password',
                xhrFields: {withCredentials: true},
                type:'put',
                data:json,
                dataType:'json',
                success:callback
            })
        },
        // 删除用户
        removeuser:function(num,callback){
            var json={}
            $.ajax({
                type:'delete',
                url:url+'admin/user/'+num,
                xhrFields: {withCredentials: true},
                data:json,
                dataType:'json',
                success:callback,
            })
        },
        //获取工作树
        getgrouptree:function(callback){
            var json={}
            $.ajax({
                url:url+'admin/workgroup/tree',
                xhrFields: {withCredentials: true},
                type:'get',
                data:json,
                dataType:'json',
                success:callback,
            })
        },
        // 获得用户工作组
        getworkgroup:function(num,callback){
            var json={};
            $.ajax({
                type:'get',
                url:url+"admin/user/"+num+"/workgroup",
                xhrFields: {withCredentials: true},
                dataType:"json",
                data:json,
                success:callback,
            })
        },
        // 修改用户工作组
        amendgroup:function(num,workGroups,callback){
            var json={
                "workGroups":workGroups,
            }
            $.ajax({
                type:"put",
                url:url+"admin/user/"+num+"/workgroup",
                xhrFields: {withCredentials: true},
                data:json,
                dataType:'json',
                success:callback,
            })
        },
        //获取用户角色树
        getroletree:function(callback){
            var json={}
            $.ajax({
                url:url+'admin/role/tree',
                xhrFields: {withCredentials: true},
                type: 'get',
                data: json,
                dataType: "json",
                success: callback,
            })
        },
        // 获得用户角色
        getrol:function(num,callback){
            var json={};
            $.ajax({
                url:url+'admin/user/'+num+'/role',
                xhrFields: {withCredentials: true},
                type:"get",
                data:json,
                dataType:"json",
                success:callback,
            })
        },
        // 修改用户角色
        amenduser:function(num,roles,callback){
            var json={
                "roles":roles
            }
            $.ajax({
                type:'put',
                url:url+"admin/user/"+num+"/role",
                xhrFields: {withCredentials: true},
                data:json,
                dataType:"json",
                success:callback,
            })
        },
        //	查看日志
        getlog:function(startTime,endTime,loginName,callback){
            var json = {
                "startTime":startTime,
                "endTime":endTime,
                "loginName":loginName
            }
            $.ajax({
                url:url+'admin/log',
                xhrFields: {withCredentials: true},
                type:"get",
                dataType:'json',
                data:json,
                success:callback,
            })
        },
        // 权限机构
        // 查看权限树
        getauthtree:function(callback){
            var json={}
            $.ajax({
                url:url+'admin/authority/tree',
                xhrFields: {withCredentials: true},
                type:"get",
                dataType:'json',
                data:json,
                success:callback,
            })
        },
        // 添加权限
        addauthority:function(authorityName,authorityType,pAuthorityID,callback){
            var json={
                "authorityName":authorityName,
                "authorityType":authorityType,
                "pAuthorityID":pAuthorityID
            }
            $.ajax({
                type:'post',
                url:url+'admin/authority',
                xhrFields: {withCredentials: true},
                data:json,
                dataType:'json',
                success:callback,
            })
        },
        // 删除权限
        removeauthority:function(num,callback){
            var json={}
            $.ajax({
                type:'delete',
                url:url+'admin/authority/'+num,
                xhrFields: {withCredentials: true},
                data:json,
                dataType:'json',
                success:callback,
            })
        },
        // 机构管理
        //	查看机构树
        getorganizationtree:function(callback){
            var json={}
            $.ajax({
                url:url+'admin/organization/tree',
                xhrFields: {withCredentials: true},
                type:'get',
                data:json,
                dataType:'json',
                success:callback,
            })
        },
        addorganization:function(organizationName,organizationType,pOrganizationID,callback){
            var json={
                "organizationName":organizationName,
                "organizationType":organizationType,
                "pOrganizationID":pOrganizationID,
            }
            $.ajax({
                type:'post',
                url:url+'admin/organization',
                xhrFields: {withCredentials: true},
                data:json,
                dataType:'json',
                success:callback,
            })
        },
        //注销机构
        removeorganization:function(num,callback){
            var json={}
            $.ajax({
                type:'delete',
                url:url+'admin/organization/'+num,
                xhrFields: {withCredentials: true},
                data:json,
                dataType:'json',
                success:callback,
            })
        },
        //修改机构信息
        amendorganization:function(num,organizationName,callback){
            var json={
                "organizationName":organizationName
            }
            $.ajax({
                type:'put',
                url:url+'admin/organization/'+num+'/info',
                xhrFields: {withCredentials: true},
                data:json,
                dataType:'json',
                success:callback,
            })
        },

	};
	exports('api', obj);
});