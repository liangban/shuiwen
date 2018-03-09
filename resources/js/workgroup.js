layui.use(['laydate', 'layer', 'api', 'form', 'element'], function () {
    var api = layui.api,
        $ = layui.jquery;
    // api.getTree();


    var element = layui.element;
    var form = layui.form;
    var laydate = layui.laydate;
    var layer = layui.layer;
    var num;

    function addZero(i) {
        return i > 10 ? i : '0' + i;
    }

    // loading
    $(document).ajaxStart(function () {
        layer.load(2);
    });
    $(document).ajaxSuccess(function () {
        layer.closeAll('loading');
    });
    // 查询用户
    var userName, phoneNumber, userProperty, companyName;
    form.on('submit(usermanage)', function (data) {
        // console.log(data)
        var user = data.field.user;
        console.log(user)
        api.usermanage(user, function (data) {
            if (data.status == true) {
                if (data.data != null) {
                    console.log(data)
                    var html = ''
                    $.each(data.data, function (i, v) {
                        if (v.userType == 0) {
                            v.userType = '系统用户';
                        }
                        else if (v.userType == 1) {
                            v.userType = '注册用户';
                        } else {
                            v.userType = '管理员用户'
                        }
                        userID = v.userID
                        userName = v.userName;
                        phoneNumber = v.phoneNumber;
                        userProperty = v.userProperty;
                        companyName = v.companyName;
                        html += '<ul class="row layui-nav">' +
                            '<li class="col-1" infoid="' + v.userID + '">' + v.userID + '</li>' +
                            '<li class="col-2" data-userName="' + userName + '">' + v.userName + '</li>' +
                            '<li class="col-2" data-phoneNumber="' + phoneNumber + '">' + v.loginName + '</li>' +
                            '<li class="col-2" data-userProperty="' + userProperty + '">' + v.userType + '</li>' +
                            '<li class="col-2" data-companyName="' + companyName + '">' + v.registerTime + '</li>' +
                            '<li class="col-3 compile layui-nav-item"><button class="active">编辑</button> <button class="btn_remove">删除</button> <a href="#">更多</a>' +

                            '<dl class="layui-nav-child childs">' +
                            '<dd class="nav_group"><a href="javascript:void(0);">工作组</a></dd>' +
                            '<dd class="nav_role"><a href="javascript:void(0);">编辑角色</a></dd>' +
                            '<dd class="nav_code"><a href="javascript:void(0);">重置密码</a></dd>' +
                            '</dl>' +
                            '</li>' +
                            // '<span class="layui-nav-bar" style="left: 184px; top: 55px; width: 0px; opacity: 0;"></span>'+
                            '</ul>'
                        // console.log(html);
                    })
                    $('.choose_data .data_content').html(html);
                    element.init();
                    // form.render;
                }
                else {
                    layer.msg(data.msg)
                }
            }
            else {
                if (data.data == null) {
                    layer.msg(data.msg)

                }
                else {
                    layer.msg(data.data[0].msg);

                }
            }
        })
    })
    // 添加工作组
    form.on('submit(addgroup)', function (data) {
        // console.log(data)
        var workGroupName = data.field.workGroupName;
        var workGroupType = data.field.workGroupType;
        var pWorkGroupID = data.field.pWorkGroupID;
        console.log(workGroupName, workGroupType, pWorkGroupID)
        api.addgroup(workGroupName, workGroupType, pWorkGroupID, function (data) {
            if (data.status == true) {
                $('.layer').hide()
                layer.msg(data.msg)
            }
            else {
                if (data.data == null) {
                    layer.msg(data.msg)
                    layer.closeAll('loading');
                }
                else {
                    layer.msg(data.data[0].msg);
                    layer.closeAll('loading');
                }
            }
        })
    })

    // 编辑角色
    var num;
    $(document).on('click', '.data_content .active', function () {
        num = $(this).parents('ul.row').find('li[infoid]').attr('infoid');
        console.log(userProperty)
        userName = $(this).parents('.row').find('li:nth-child(2)').attr('data-userName');
        phoneNumber = $(this).parents('.row').find('li:nth-child(3)').attr('data-phoneNumber');
        userProperty = $(this).parents('.row').find('li:nth-child(4)').attr('data-userProperty');
        companyName = $(this).parents('.row').find('li:nth-child(5)').attr('data-companyName');
        console.log(userName, phoneNumber, userProperty, companyName)
        if (userProperty == 0) {
            // userProperty='个人';
            $('.add_role label:nth-child(4)').hide()
        }
        else if (userProperty == 1) {
            // userProperty='企业';
            $('.add_role label:nth-child(4)').show()
        }
        $('.layer').fadeIn();
        $('.layer .add_catalog').hide();
        $('.layer .add_role').show()
        $('input[name="userName"]').attr('value', userName)
        $('input[name="phoneNumber"]').attr('value', phoneNumber)
        $.each($('select[name="userProperty"] option'), function () {
            if ($(this).val() == userProperty) {
                console.log($(this))
                $(this).attr('selected', 'true');
            }
        })
        $('input[name="companyName"]').attr('value', companyName)
        form.render();
    })
    $('.add_catalog h3 b').on('click', function () {
        $('.layer').fadeOut();
    })
    form.on('select(user_nature)', function (data) {
        // console.log(data.value)
        if (data.value == 0) {
            $('.add_role label:nth-child(4)').hide()
        }
        else if (data.value == 1) {
            $('.add_role label:nth-child(4)').show()
        }
    })
    form.on('submit(editoruser)', function (data) {
        num = userID;
        var user = $('.catalog input[name="user"]').val()
        console.log(user)
        var userName = data.field.userName;
        var loginName = data.field.loginName;
        var phoneNumber = data.field.phoneNumber;
        var userProperty = data.field.userProperty;
        var companyName = data.field.companyName;
        console.log(userName, loginName, phoneNumber, userProperty, companyName)
        api.compileuser(num, userName, loginName, phoneNumber, userProperty, companyName, function (data) {
            console.log(data)
            if (data.status == true) {
                $('.layer').hide()
                layer.msg(data.msg)
                localStorage.setItem('user1', user);
                api.usermanage(user, function (data) {
                    if (data.status == true) {
                        if (data.data != null) {
                            console.log(data)
                            var html = ''
                            $.each(data.data, function (i, v) {
                                if (v.userType == 0) {
                                    v.userType = '系统用户';
                                }
                                else if (v.userType == 1) {
                                    v.userType = '注册用户';
                                } else {
                                    v.userType = '管理员用户'
                                }
                                userID = v.userID
                                userName = v.userName;
                                phoneNumber = v.phoneNumber;
                                userProperty = v.userProperty;
                                companyName = v.companyName;
                                html += '<ul class="row layui-nav">' +
                                    '<li class="col-1" infoid="' + v.userID + '">' + v.userID + '</li>' +
                                    '<li class="col-2" data-userName="' + userName + '">' + v.userName + '</li>' +
                                    '<li class="col-2" data-phoneNumber="' + phoneNumber + '">' + v.loginName + '</li>' +
                                    '<li class="col-2" data-userProperty="' + userProperty + '">' + v.userType + '</li>' +
                                    '<li class="col-2" data-companyName="' + companyName + '">' + v.registerTime + '</li>' +
                                    '<li class="col-3 compile layui-nav-item"><button class="active">编辑</button> <button class="btn_remove">删除</button> <a href="#">更多</a>' +

                                    '<dl class="layui-nav-child childs">' +
                                    '<dd class="nav_group"><a href="javascript:void(0);">工作组</a></dd>' +
                                    '<dd class="nav_role"><a href="javascript:void(0);">编辑角色</a></dd>' +
                                    '<dd class="nav_code"><a href="javascript:void(0);">重置密码</a></dd>' +
                                    '</dl>' +
                                    '</li>' +
                                    // '<span class="layui-nav-bar" style="left: 184px; top: 55px; width: 0px; opacity: 0;"></span>'+
                                    '</ul>'
                                // console.log(html);
                            })
                            $('.choose_data .data_content').html(html);
                            element.init();
                            // form.render;
                        }
                        else {
                            layer.msg(data.msg)
                        }
                    }
                    else {
                        if (data.data == null) {
                            layer.msg(data.msg)

                        }
                        else {
                            layer.msg(data.data[0].msg);

                        }
                    }
                })
            }
            else {
                if (data.data == null) {
                    layer.msg(data.msg)
                    layer.closeAll('loading');
                }
                else {
                    layer.msg(data.data[0].msg);
                    layer.closeAll('loading');
                }
            }
        })
    })
    // 重置密码
    form.on('submit(xg_code)', function (data) {
        num=userID;
        var password = data.field.password;
        var confirmPassword = data.field.confirmPassword;
        console.log(num, password, confirmPassword)
        api.resetpassword(num, password, confirmPassword, function (data) {
            console.log(data);
            if (data.status == true) {
                $('.layer').hide()
                layer.msg(data.msg)
                $('.password button[type="reset"]').click();
            }
            else {
                if (data.data == null) {
                    layer.msg(data.msg)
                    layer.closeAll('loading');
                }
                else {
                    layer.msg(data.data[0].msg);
                    layer.closeAll('loading');
                }
            }
        })
    });
    // 删除用户
    $(document).on('click', '.btn_remove', function () {
        num = $(this).parents('ul.row').find('li[infoid]').attr('infoid');
        console.log(num)
        var _this = $(this);
        api.removeuser(num, function (data) {
            console.log(num)
            console.log(data);
            if (data.status == true) {
                $('.layer').hide()
                console.log($(this))
                _this.parents('ul.row').remove();
                layer.msg(data.msg)
            }
            else {
                if (data.data == null) {
                    layer.msg(data.msg)
                    layer.closeAll('loading');
                }
                else {
                    layer.msg(data.data[0].msg);
                    layer.closeAll('loading');
                }
            }
        })
    })

    var num;
    var arr = new Array();
    api.getworks(function (data) {
        // console.log(data)
        if (data.status == true) {
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
                    enable: true,
                    showRemoveBtn: true,
                    showRenameBtn: false,
                },
                callback: {
                    onRemove: onRemove,
                    onCheck: zTreeOnCheck,
                    beforeRemove: false,
                }

            };


            function onRemove(i, v, data) {
                var number = data.id;
                // console.log(1)
                console.log(number)
                $.ajax({
                    url: url + 'admin/workgroup/' + number,
                    dataType: 'json',
                    type: 'delete',
                    success: function (data) {
                        console.log(data)
                        if (data.status == true) {
                            $('li[infoid=' + number + ']').remove();
                            layer.msg(data.msg)
                        }
                        else {
                            if (data.data == null) {
                                layer.msg(data.msg)
                                layer.closeAll('loading');
                            }
                            else {
                                layer.msg(data.data[0].msg);
                                layer.closeAll('loading');
                            }
                        }
                    },
                })

            }

            function zTreeOnCheck(event, treeId, treeNode) {
                // x+=treeNode.id+",";
                num = treeNode.id
                arr.push(treeNode.id)
                var brr = new Array();
                if ($('.layer').is(":visible") == false) {
                    $('.layer').fadeIn()
                    $('.layer .add_catalog').hide();
                    $('.layer .get_user').show();
                }
                $.each(arr, function (i, v) {
//                            console.log(v)
                    var items = v;
                    if ($.inArray(items, brr) == -1) {
                        brr.push(items);
                    }
                })
                console.log(brr)
                $('.get_user form input').val(brr)
                api.groupauthority(num, function (data) {
                    console.log(data)
                    if (data.status == true) {
                        $.each(data.data, function (i, v) {
                            var node_name = v.authorityName;
                            $.each($('.get_user .ztree li'), function (a, b) {
                                // console.log($(this).find('.node_name').text())
                                if ($(this).find('.node_name').text() == node_name) {
                                    // console.log($(this))
                                    // $(this).find(".chk").removeClass("checkbox_false_full").addClass("checkbox_true_full")
                                    $(this).find(".chk").click()
                                }
                            })
                            arr.push("" + v.roleID + "");
                        });
                    }
                    else {
                        if (data.data == null) {
                            // layer.msg(data.msg)
                            // layer.closeAll('loading');
                        }
                        else {
                            // layer.msg(data.data[0].msg);
                            // layer.closeAll('loading');
                        }
                    }

                })
            };
            $(document).ready(function () {
                $.fn.zTree.init($("#works"), setting, zNodes);
                // console.log(setting)
            });
            var newCount = 1;

            function addHoverDom(treeId, treeNode) {
                var sObj = $("#" + treeNode.tId + "_span");
                // console.log(sObj)
                sObj.parents('li.level0').attr('infoid', treeNode.id);
                if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
                var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
                    "' title='add node' onfocus='this.blur(); infoid='" + treeNode.id + "''></span>";
                sObj.after(addStr);
                var btn = $("#addBtn_" + treeNode.tId);
                if (btn) btn.bind("click", function () {
                    var zTree = $.fn.zTree.getZTreeObj("works");
                    $('.layer').fadeIn();
                    $('.layer .add_catalog').hide();
                    $('.layer .workgroup').show();
                    $.each($('select[name="pWorkGroupID"] option'), function () {
                        if ($(this).val() == treeNode.id) {
                            console.log($(this))
                            $(this).attr('selected', 'true');
                        }
                    })
                    form.render()
                    return false;
                });

            };

            function removeHoverDom(treeId, treeNode) {
                $("#addBtn_" + treeNode.tId).unbind().remove();
            };
            var option = ''
            $.each(data.data, function (i, v) {
                // if (v.pid == '-1') {
                // console.log($(this))
                option += '<option value="' + v.id + '">' + v.name + '</option>'
                // }
            })
            $('.layui-input-block .parent_catalog').append(option);
            form.render();
        }
    });
    form.on('submit(xiugai_authority)', function (data) {
        var authorities = data.field.add_authority;
        api.eidtworkgroup(num, authorities, function (data) {
            console.log(data);
            if (data.status == true) {
                layer.msg(data.msg)
                window.location.reload();
            }
            else {
                layer.msg(data.msg)
            }
        })
    })
});