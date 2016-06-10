$('body').on( 'change','.eqLogicAttr[data-l1key=configuration][data-l2key=ApprentissageTable]', function() {
	if($(this).val() !=""){
		$('#table_Calibration').append($('<tbody>'));
		var loop=0;
		var Calibration=JSON.parse($(this).val());
		$.each(Calibration,function(){
			$('#table_Calibration tbody').append($('<tr>').append($('<td>').text(Calibration.loop)));
			loop++;
		})
	}
}); $('body').on( 'click','.bt_selectCmdExpression', function() {
	var TypeCmd="action";
	if($(this).closest('table').attr('id')=="table_cmd_Entree") 
		TypeCmd="info";
	var tr =$('<tr>');
	var _this=this;
	jeedom.cmd.getSelectModal({cmd: {type: TypeCmd},eqLogic: {eqType_name : ''}}, function (result) {
		$(_this).closest('td').find('.cmdAttr[data-l1key=configuration][data-l3key=name]').val(result.human);
	});
});  
$('body').on('click','.bt_add',function(){
	addToTable($(this).closest('table'));
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
	
	Table.parent().addClass("cmd").data("cmd_id",init(_cmd.id));
	Table.parent().append($('<input type="hidden" class="cmdAttr form-control input-sm" data-l1key="id" value="' + init(_cmd.id) + '">'))
	Table.parent().append($('<input type="hidden" class="cmdAttr form-control input-sm" data-l1key="name" value="' + init(_cmd.name) + '">'));
	Table.parent().append($('<input type="hidden" class="cmdAttr form-control input-sm" data-l1key="logicalId" value="' + init(_cmd.logicalId) + '">'));
	Table.parent().append($('<input type="hidden" class="cmdAttr" data-l1key="type" value="action" />'));
	Table.parent().append($('<input type="hidden" class="cmdAttr" data-l1key="subType" value="other" />'));
	$('#table_Calibration').append($('<thead>').append($('<tr>')));
	$.each( _cmd.configuration,function(){
		addToTable(Table);
	})
	Table.setValues(_cmd, '.cmdAttr');
	$('#table_Calibration').setValues(_cmd, '.cmdCalibration');
}
function addToTable(_Table) {
	var Nb=_Table.find('tbody tr').length + 1;
	$('#table_Calibration thead tr').append($('<th class="cmdCalibration" data-l1key="configuration" data-l2key="'+Nb+'" data-l3key="name">'));
	var tr =$('<tr>');
  	tr.append($('<td>')
		.append($('<input class="cmdAttr form-control input-sm " data-l1key="configuration" data-l2key="'+Nb+'" data-l3key="name" style="width:85%;display: inline-block;margin: 5px;">'))
		.append($('<a style="display : inline-block;margin:5px;" class="btn btn-default btn-xs cursor bt_selectCmdExpression" title="Rechercher une commande">')
			.append($('<i class="fa fa-list-alt">'))));
//	tr.append($('<td>')
//		.append($('<input class="cmdAttr form-control input-sm " data-l1key="configuration" data-l1key="configuration" data-l2key="'+Nb+'" data-l3key="tolerance">')));
	tr.append($('<td>')
		.append($('<a style="display : inline-block;margin:5px;" class="btn btn-success btn-xs cursor bt_add" title="Ajouter une commande">')
			.append($('<i class="fa fa-plus-circle">')))
		.append($('<a style="display : inline-block;margin:5px;" class="btn btn-danger btn-xs cursor bt_del" title="Supprimer une commande">')
			.append($('<i class="fa fa-minus-circle">'))));
	_Table.find('tbody').append(tr);
}
