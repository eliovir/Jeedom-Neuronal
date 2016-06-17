//initTableSorter();
/*$('body').on( 'change','.eqLogicAttr[data-l1key=configuration][data-l2key=ApprentissageTable]', function() {
	if($(this).val() !=""){
		$('#table_Calibration thead tr').html('');
		var Calibration=JSON.parse($(this).val());
		$.each(Calibration,function(Parametre, Ligne){
			$('#table_Calibration thead tr').append($('<th>').text(Parametre));
			$.each(Ligne,function(key, value){
				var ParameterInput=$('<td>').append($('<input class="eqLogicAttr" data-l1key="configuration" data-l2key="ApprentissageTable" data-l3key="'+Parametre+'" data-l4key="'+key+'"/>').val(key));
				if($('#table_Calibration #'+key).length>0)
					$('#table_Calibration #'+key).append(ParameterInput);
				else
					$('#table_Calibration tbody').append($('<tr id="'+key+'">').append(ParameterInput));

			});
		});
		$('#table_Calibration thead tr').append($('<th>').text("Parametre"));
		$.each($('#table_Calibration tbody tr'),function(){
			$(this).append($('<td>')
				.append($('<a style="display : inline-block;margin:5px;" class="btn btn-success btn-xs cursor bt_add" title="Ajouter une commande">')
					.append($('<i class="fa fa-plus-circle">')))
				.append($('<a style="display : inline-block;margin:5px;" class="btn btn-danger btn-xs cursor bt_del" title="Supprimer une commande">')
					.append($('<i class="fa fa-minus-circle">'))));
		});
		$('#table_Calibration').trigger('update');
		$(this).remove();
	}
});*/
$('body').on( 'change','.cmdAttr[data-l1key=configuration][data-l3key=name]', function() {
	var key=$(this).attr('data-l2key')
	var Parametre=$(this).val();
	if ($('#table_Calibration thead tr #'+key).length==0)
		$('#table_Calibration thead tr').attr('id',key).append($('<th>').text(Parametre));
	$.each($('#table_Calibration tbody tr'),function(){
		var id =$('#table_Calibration tbody tr').length
		var ParameterInput=$('<td>').append($('<input class="eqLogicAttr" data-l1key="configuration" data-l2key="ApprentissageTable" data-l3key="'+Parametre+'" data-l4key="'+id+'"/>'));
		if($('#table_Calibration tbody #'+id).length>0)
			$('#table_Calibration tbody #'+id).append(ParameterInput);
		else
			$('#table_Calibration tbody').append($('<tr id="'+id+'">').append(ParameterInput));
	});
});
$('body').on( 'click','.bt_selectCmdExpression', function() {
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
	switch($(this).closest('table').attr('id')){
		case 'table_Calibration':
			var tr=$('#table_Calibration tbody tr:last').clone();
			var id=$('#table_Calibration tbody tr').length+1;
			tr.attr('id',id);
			tr.find('.eqLogicAttr').attr('data-l4key',id);
			$('#table_Calibration tbody').append(tr);
		break;
		default:
			addToTable($(this).closest('table'));
		break;
	}
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
	Table.addClass("cmd").attr("data-cmd_id",init(_cmd.id));
	$.each( _cmd.configuration,function(){
		addToTable(Table);
	})
	Table.setValues(_cmd, '.cmdAttr');
}
function addToTable(_Table) {
	var Nb=_Table.find('tbody tr').length + 1;
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
