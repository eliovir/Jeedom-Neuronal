$('#tab_parametre a').click(function(e) {
	alert('re');
    e.preventDefault();
    $(this).tab('show');
});
$('body').on('change','.cmdAttr[data-l1key=configuration][data-l3key=name]', function() {
	var Parametre=$(this).val();
	var specialChars = " !@#$^&%*()+=-[]\/{}|:<>?,.";
	for (var i = 0; i < specialChars.length; i++) {
		Parametre = Parametre .replace(new RegExp("\\" + specialChars[i], 'gi'), '');
	}
	if (Parametre!=""){
			if ($('#table_Calibration thead td[data-id='+Parametre+']').length==0)
			$('#table_Calibration thead tr').append($('<td>').attr('data-id',Parametre).text($(this).val()));
		else
			$('#table_Calibration thead td[data-id='+Parametre+']').text($(this).val());
		if ($('#table_Calibration tbody tr').length==0)
			$('#table_Calibration tbody').append($('<tr>').attr('id',createGuid()));
		$.each($('#table_Calibration tbody tr'),function(){
			var id=$(this).closest('tr').attr('id');
			addCalibrationToTable(Parametre, id,0);
		});
	}
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
			var id=createGuid();
			tr.attr('id',id);
			tr.find('.eqLogicAttr').attr('data-l4key',id);
			$('#table_Calibration tbody').append(tr);
		break;
		default:
			addToTable($(this).closest('table'),'');
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
		if (Table.find('tbody').length==0)
			Table.append($('<tbody>'));
	Table.find('tbody').addClass("cmd").attr("data-cmd_id",init(_cmd.id));
	Table.find('tbody').append($('<input type="hidden" class="cmdAttr" data-l1key="id">'));
	Table.find('tbody').append($('<input type="hidden" class="cmdAttr" data-l1key="name">'));
	Table.find('tbody').append($('<input type="hidden" class="cmdAttr" data-l1key="logicalId">'));
	Table.find('tbody').append($('<input type="hidden" class="cmdAttr" data-l1key="type">'));
	Table.find('tbody').append($('<input type="hidden" class="cmdAttr" data-l1key="subType">'));
	$.each( _cmd.configuration,function(key, value){
		if(key)
			addToTable(Table,key);
		else
			addToTable(Table,'');
	})
	Table.setValues(_cmd, '.cmdAttr');
}
function createGuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
function addToTable(_Table, id) {
	if (id=='')
		id=createGuid();
	var tr =$('<tr>');
  	tr.append($('<td>')
		.append($('<input class="cmdAttr form-control input-sm " data-l1key="configuration" data-l2key="'+id+'" data-l3key="name" style="width:85%;display: inline-block;margin: 5px;">'))
		.append($('<a style="display : inline-block;margin:5px;" class="btn btn-default btn-xs cursor bt_selectCmdExpression" title="Rechercher une commande">')
			.append($('<i class="fa fa-list-alt">'))));
//	tr.append($('<td>')
//		.append($('<input class="cmdAttr form-control input-sm " data-l1key="configuration" data-l2key="'+id+'" data-l3key="tolerance">')));
	tr.append($('<td>')
		.append($('<a style="display : inline-block;margin:5px;" class="btn btn-success btn-xs cursor bt_add" title="Ajouter une commande">')
			.append($('<i class="fa fa-plus-circle">')))
		.append($('<a style="display : inline-block;margin:5px;" class="btn btn-danger btn-xs cursor bt_del" title="Supprimer une commande">')
			.append($('<i class="fa fa-minus-circle">'))));
	_Table.find('tbody').append(tr);
}
function addCalibrationToTable(Parametre, key,value) {
	var tr=$('#table_Calibration tbody').find('#'+key);
	if(tr.length<=0){
		$('#table_Calibration tbody').append($('#table_Calibration thead tr').clone().attr('id',key));
		tr=$('#table_Calibration tbody').find('#'+key);
		tr.find('td').first().html('')
			.append($('<a style="display : inline-block;margin:5px;" class="btn btn-success btn-xs cursor bt_add" title="Ajouter une commande">')
				.append($('<i class="fa fa-plus-circle">')))
			.append($('<a style="display : inline-block;margin:5px;" class="btn btn-danger btn-xs cursor bt_del" title="Supprimer une commande">')
				.append($('<i class="fa fa-minus-circle">')));
	}
	if(tr.find('td').length<=0)
		tr.append($('<td>')			
			.append($('<a style="display : inline-block;margin:5px;" class="btn btn-success btn-xs cursor bt_add" title="Ajouter une commande">')
				.append($('<i class="fa fa-plus-circle">')))
			.append($('<a style="display : inline-block;margin:5px;" class="btn btn-danger btn-xs cursor bt_del" title="Supprimer une commande">')
				.append($('<i class="fa fa-minus-circle">'))));
	if(tr.find('td[data-id='+Parametre+']').length<=0)
		tr.append($('<td>').attr('data-id',Parametre));
	if($('.eqLogicAttr[data-l1key=configuration][data-l2key=ApprentissageTable][data-l3key='+Parametre+'][data-l4key='+key+']').length<=0)
		tr.find('td[data-id='+Parametre+']').html($('<input class="eqLogicAttr form-control" data-l1key="configuration" data-l2key="ApprentissageTable" data-l3key="'+Parametre+'" data-l4key="'+key+'"/>').val(value));
}
function printEqLogic(data){
	$('#table_Calibration thead tr').html($('<td>').text('Parametre'));
	$('#table_Calibration tbody').html('');
	var id=createGuid();
	$.each(data.configuration.ApprentissageTable,function(Parametre, Ligne){	
		if(Parametre && Parametre!=''){
			if ($('#table_Calibration thead td[data-id='+Parametre+']').length==0)
				$('#table_Calibration thead tr').append($('<td>').attr('data-id',Parametre));
			if(typeof Ligne === 'object'){
				if(Ligne){
					$.each(Ligne,function(key, value){
						if(key,value)
							addCalibrationToTable(Parametre, key,value);
					});
				}
			}
			else
				addCalibrationToTable(Parametre, id,Ligne) 
		}
	});
}
