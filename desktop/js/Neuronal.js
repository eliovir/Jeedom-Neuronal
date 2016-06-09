$('.eqLogicAttr[data-l1key=configuration][data-l2key=ES_Neurone]').on('change',function(){
	alert($(this).val());
/*	JSON.parse($(this).val()).forEach(function(element, index){
		alert("a[" + index + "] = " + element);
		//addToTable(table,_cmd);
	})
	$(this).remove();*/
})
$('body').on( 'click','.bt_selectCmdExpression', function() {
	var TypeCmd="action";
	if($(this).closest('table').attr('id')=="table_cmd_Entree") 
		TypeCmd="info";
	var tr =$('<tr>');
	var _this=this;
	$(this).value()
	jeedom.cmd.getSelectModal({cmd: {type: TypeCmd},eqLogic: {eqType_name : ''}}, function (result) {
		$(_this).closest('td').find('.eqLogicAttr[data-l1key=configuration][data-l2key=ES_Neurone]').val(result.human);
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
}
function addToTable(table,_cmd) {
    var Name="";
	var NbCmd=table.find('tr').length+1;
	if(table.attr('id')=="table_cmd_Entree") 
		Name="Entree_"+NbCmd;
	else
		Name="Sortie_"+NbCmd;
	var tr =$('<tr>');
  	tr.append($('<td>')
  		.append($('<input class="eqLogicAttr form-control input-sm " data-l1key="configuration" data-l2key="ES_Neurone" data-l3key="'+Name+'_Cmd" style="width:85%;display: inline-block;margin: 5px;">'))
  		.append($('<a style="display : inline-block;margin:5px;" class="btn btn-default btn-xs cursor bt_selectCmdExpression" title="Rechercher une commande">')
			.append($('<i class="fa fa-list-alt">'))));
  //	tr.append($('<td>')
  //		.append($('<input class="eqLogicAttr form-control input-sm " data-l1key="configuration" data-l2key="ES_Neurone" data-l3key="'+Name+'_Tolerance">')));
  	tr.append($('<td>')
  		.append($('<a style="display : inline-block;margin:5px;" class="btn btn-success btn-xs cursor bt_add" title="Ajouter une commande">')
			.append($('<i class="fa fa-plus-circle">')))
  		.append($('<a style="display : inline-block;margin:5px;" class="btn btn-danger btn-xs cursor bt_del" title="Supprimer une commande">')
			.append($('<i class="fa fa-minus-circle">'))));

	table.append(tr);
	table.find('tbody tr:last').setValues(_cmd, '.eqLogicAttr');
}
