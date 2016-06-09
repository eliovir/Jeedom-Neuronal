$('body').on( 'click','.bt_selectCmdExpression', function() {
	var TypeCmd="action";
	if($(this).closest('table').attr('id')=="table_cmd_Entree") 
		TypeCmd="info";
	var tr =$('<tr>');
	var _this=this;
	$(this).value()
	jeedom.cmd.getSelectModal({cmd: {type: TypeCmd},eqLogic: {eqType_name : ''}}, function (result) {
		$(_this).closest('td').find('.cmdAttr[data-l1key=configuration][data-l2key=id][data-l3key=name]').val(result.human);
	});
});  
$('body').on('click','.bt_add',function(){
	addToTable($(this).closest('table'),'');
});
$('body').on('click','.bt_del',function(){
	$(this).closest('tr').remove();
});
$("#table_cmd_Entree").sortable({axis: "y", cursor: "move", items: ".cmd", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});
$("#table_cmd_Sortie").sortable({axis: "y", cursor: "move", items: ".cmd", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});
function addCmdToTable(_cmd) {

	if (!isset(_cmd)) {
        var _cmd = {};
    }
    if (!isset(_cmd.configuration)) {
        _cmd.configuration = {};
    }
    var Table=$("#table_cmd_Entree");
    if(_cmd.name!="Entree")
    	Table=$("#table_cmd_Sortie");
    	$.each( _cmd.configuration,function(){
    		var tr =$('<tr>');
  		tr.append($('<td>')
	  		.append($('<input class="cmdAttr form-control input-sm " data-l1key="configuration" data-l2key="id" data-l3key="name" style="width:85%;display: inline-block;margin: 5px;">'))
	  		.append($('<a style="display : inline-block;margin:5px;" class="btn btn-default btn-xs cursor bt_selectCmdExpression" title="Rechercher une commande">')
				.append($('<i class="fa fa-list-alt">'))));
		  //	tr.append($('<td>')
		  //		.append($('<input class="cmdAttr form-control input-sm " data-l1key="configuration" data-l1key="configuration" data-l2key="id" data-l3key="tolerance">')));
		  	tr.append($('<td>')
		  		.append($('<a style="display : inline-block;margin:5px;" class="btn btn-success btn-xs cursor bt_add" title="Ajouter une commande">')
					.append($('<i class="fa fa-plus-circle">')))
		  		.append($('<a style="display : inline-block;margin:5px;" class="btn btn-danger btn-xs cursor bt_del" title="Supprimer une commande">')
					.append($('<i class="fa fa-minus-circle">'))));
		
			Table.append(tr);
    	})
    	Table.setValues(_cmd, '.cmdAttr');
}
