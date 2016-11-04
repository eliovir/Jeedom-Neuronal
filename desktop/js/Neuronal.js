$('#tab_parametre a').click(function(e) {
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
$('body').on('click','.CommandeAttr[data-l1key=add]', function () {
		addElement({},'{{Element}}',$(this).closest(".form-group").find(".NeuroneEntree"));
});
$('body').on('click','.CommandeAttr[data-l1key=remove]', function () {
	$(this).closest(".CommandeGroup").remove();
});
$("#table_cmd_Entree").sortable({axis: "y", cursor: "move", items: ".cmd", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});
$("#table_cmd_Sortie").sortable({axis: "y", cursor: "move", items: ".cmd", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});
function saveEqLogic(_eqLogic) {
	var state_order = '';
    	if (!isset(_eqLogic.configuration)) {
    	    _eqLogic.configuration = {};
	}	
	if (typeof( _eqLogic.cmd) !== 'undefined') {
		for(var index in  _eqLogic.cmd) { 
			var Commandes= new Array();
			$('.cmd[data-cmd_id=' + init(_eqLogic.cmd[index].id)+ '] .ConditionGroup').each(function( index ) {
				Commandes.push($(this).getValues('.expressionAttr')[0])
			});
			_eqLogic.cmd[index].configuration.Commandes=Commandes;
		}
	}
   	return _eqLogic;
}
function addCmdToTable(_cmd) {
	if (!isset(_cmd)) {
 		var _cmd = {};
	}
	if (!isset(_cmd.configuration)) {
		_cmd.configuration = {};
	}
	var div=$(".NeuroneEntree");
	if(_cmd.name!="Entree")
		div=$(".NeuroneSortie");
	div.setValues(_cmd, '.cmdAttr');
	$.each( _cmd.configuration.Commandes,function(key, value){
		addElement(value,'{{Element}}',div);
	})
}
function addElement(_Commande, _name, _el) {
	if (!isset(_Commande)) {
		_Commande = {};
	}
	if (!isset(_Commande.options)) {
		_Commande.options = {};
	}
    	var div = $('<div class="form-group CommandeGroup">')
  		.append($('<label class="col-lg-1 control-label">')
			.text(_name))
   		.append($('<div class="col-lg-1">')
    			.append($('<a class="btn btn-warning btn-sm listCmdCommande" >')
				.append($('<i class="fa fa-list-alt">'))))
		.append($('<div class="col-lg-3">')
			.append($('<input class="expressionAttr form-control input-sm cmdCommande" data-l1key="cmd" />')))
 		.append($('<div class="col-lg-1">')
  			.append($('<i class="fa fa-minus-circle pull-left cursor CommandeAttr" data-action="remove">')));
        _el.append(div);
        _el.find('.ActionCommande:last').setValues(_Commande, '.expressionAttr');
}
