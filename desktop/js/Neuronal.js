$('#tab_parametre a').click(function(e) {
    e.preventDefault();
    $(this).tab('show');
});
$('body').on( 'click','.bt_selectCmdExpression', function() {
	var TypeCmd=$(this).closest(".CommandeGroup").attr('data-TypeCmd');
	var Commande=$(this).closest(".CommandeGroup").find(".expressionAttr[data-l1key=cmd]");
	jeedom.cmd.getSelectModal({cmd: {type: TypeCmd},eqLogic: {eqType_name : ''}}, function (result) {
		Commande.val(result.human);
	});
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
			_eqLogic.cmd[index].configuration.Commandes=new Object();
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
	var div=null;
	if(_cmd.name=="Entree"){
		div=$(".NeuroneEntree");
		div.addClass("cmd").attr('data-cmd_id',init(_cmd.id)).attr('data-TypeCmd','info');
	}else{
		div=$(".NeuroneSortie");
		div.addClass("cmd").attr('data-cmd_id',init(_cmd.id)).attr('data-TypeCmd','action');
	}
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
    			.append($('<a class="btn btn-warning btn-sm bt_selectCmdExpression" >')
				.append($('<i class="fa fa-list-alt">'))))
		.append($('<div class="col-lg-3">')
			.append($('<input class="expressionAttr form-control input-sm" data-l1key="cmd" />')))
 		.append($('<div class="col-lg-1">')
  			.append($('<i class="fa fa-minus-circle pull-left cursor CommandeAttr" data-action="remove">')));
        _el.append(div);
        _el.find('.CommandeGroup:last').setValues(_Commande, '.expressionAttr');
}
