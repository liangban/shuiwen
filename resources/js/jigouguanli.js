layui.use(['laydate','layer','api','form','element'], function(){
    var api = layui.api,
        $=layui.jquery;
    // api.getTree();
    var element = layui.element;
    var form=layui.form;
    var laydate = layui.laydate;
    var layer = layui.layer;
    var num;
    var arr=new Array();
    function  addZero(i) {
        return i>10?i:'0'+i;
    }
    // loading
    // $(document).ajaxStart(function(){
    //     setTimeout(function(){
    //         layer.load(2);
    //     },2000)
        
    // });
    // $(document).ajaxSuccess(function(){
    //     layer.closeAll('loading');
    // });
    api.getorganizationtree(function(data){
        // console.log(data)
        if(data.status == true) {
            var zNodes=data.data;
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
                    beforeRemove:false,
                }
                ,asyne:{
                    enable:true,
                    url:url+'admin/organization/tree',
                    autoParam:["id"], 
                    dataType:"json", 
                }
            };
            api.getrol(num,function(data){
                // console.log(data)
                if(data.status==true){
                    $.each(data.data,function(i,v){
                    $('.ztree li').eq(i).children(".chk").removeClass("checkbox_false_full").addClass("checkbox_true_full")//找出tID的值，然后找到对应的tree_id,
                    console.log(v.roleID)
                    arr.push(""+v.roleID+"");
                    // console.log(arr)
                });
                }
                
            })

         
            
            function zTreeOnCheck(event, treeId, treeNode) {
                
                arr.push(treeNode.id)
                var brr=new Array();
                $.each(arr,function(i,v){
//                            console.log(v)
                    var items=v;
                    num=v;
                    if($.inArray(items,brr)==-1) {
                        brr.push(items);
                    }
                })
                // console.log(brr)
                $('.get_user form input').val(brr)
            };
            // $('.groups form input').val(x);
            $(document).ready(function() {
                $.fn.zTree.init($("#organization"), setting, zNodes);
               
            });
         
            function onRemove(treeId, treeNode,index){
                console.log(index)
                $.ajax({
                    url:url+'admin/organization/'+index.id,
                    dataType:'json',
                     
                    type:'delete',
                    success:function(data){
                        console.log(data)
                        if(data.status==true){
                            layer.open({
                                title:'提示',
                                content: '确定删除？'
                                 ,btn: ['确定', '取消']
                                 ,yes: function(){
                                       $("#" + index.tId).remove();
                           
                                      layer.msg(data.msg)
                                     }
                                 ,no: function(){
                                      //按钮【按钮二】的回调
                                        $('.layui-layer-close').click();
                                      //return false 开启该代码可禁止点击该按钮关闭
                                     }
                      
                                   ,cancel: function(){ 
                        
                                     }
                                 });
                            
                        }
                        else {
                            layer.msg(data.msg)
                        }
                    },
                })

            }

            function onRename(event, treeId, treeNode){
            // var zTree = $.fn.zTree.getZTreeObj("organization");
                num=treeNode.id;
                // console.log(num)
                var organizationName=treeNode.name;
                api.amendorganization(num,organizationName,function(data){
                    if(data.status==true){
                        layer.msg(data.msg)
                    }
                    else {
                        layer.msg(data.msg)
                    }
                })
            }
            
            $(document).ready(function() {
                $.fn.zTree.init($("#organization"), setting, zNodes);
                // console.log(setting)
            });
            var newCount = 1;
            function addHoverDom(treeId, treeNode) {
                // console.log(treeId)
                // console.log(treeNode.id)
                var organizationName;
                var pOrganizationID
                var sObj = $("#" + treeNode.tId + "_span");
                // console.log(sObj)
                sObj.parents('li.level0').attr('infoid',treeNode.id);
                if(treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
                var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
                    "' title='add node' onfocus='this.blur(); infoid='"+treeNode.id+"'></span>";
                sObj.after(addStr);
                var btn = $("#addBtn_" + treeNode.tId);
                if(btn) btn.bind("click", function() {
                    var zTree = $.fn.zTree.getZTreeObj("organization");
                    $('.layer').show();
                    $('.parent_catalog').val(treeNode.id)
                    $.each($('.parent_catalog option'),function(){
                        if($(this).val()==treeNode.id){
                            console.log($(this))
                            $(this).attr('selected','true');
                        }
                    })
                    // console.log(treeNode.id)
                    form.on('submit(addorganization)',function(data){
                        organizationName=data.field.organizationName;
                        var organizationType=data.field.organizationType;
                        pOrganizationID=data.field.pOrganizationID;
                        // var pAuthorityID=100;
                        console.log(organizationName,organizationType,pOrganizationID)
                        api.addorganization(organizationName,organizationType,pOrganizationID,function(data){
                            if(data.status==true){
                                $('.layer').fadeOut();
                                // news();
                                layer.msg(data.msg)
                                // $.fn.zTree.init($("#organization"), setting, zNodes);
                                // console.log($('li[data-target="refresh"]').text())
                                // $('li[data-target="refresh"]').onclick;
                                window.location.reload();
                            }
                            else {
                                if(data.data==null){
                                    layer.msg(data.msg)
                                }
                                else{
                                    layer.msg(data.data[0].msg);
                                }
                            }
                        })
                    })
                     form.render();
                    // treeObj.expandNode(treeNode,true, false, false);// 将新获取的子节点展开  
                    // zTree.addNodes(treeNode, {
                    //     id: pOrganizationID,
                    //     pid: treeNode.id,
                    //     name: organizationName,
                    // });
                    return false;
                });
            };
            function news(){
                var zTree = $.fn.zTree.getZTreeObj("organization"),
                                type ='refresh',
                                silent = false,
                                nodes = zTree.getSelectedNodes();
                                // console.log(nodes);
                                zTree.reAsyncChildNodes(nodes[0], type, silent);
                                // refreshNode({type:"refresh", silent:false}, refreshNode)
            }
   


            function removeHoverDom(treeId, treeNode) {
                
                $("#addBtn_" + treeNode.tId).unbind().remove ();
            };
            var option=''
            $.each(data.data,function(i,v){
                // console.log(v);
                
                    option+='<option value="'+v.id+'">'+v.name+'</option>'
                
            })
            $('.layui-input-block .parent_catalog').append(option);
            form.render();
        }
    })


});