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
$('body').on('click','.CommandeAttr[data-action=add]', function () {
	addElement({},'{{Element}}',$(this).closest(".form-horizontal").find(".Neurone"));
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
	if (typeof( _eqLogic.configuration.entrees) !== 'undefined') 
		_eqLogic.configuration.entrees=new Object();
	var CommandesEntree= new Array();
	$('#tab_entree_neurone .CommandeGroup').each(function( index ) {
		CommandesEntree.push($(this).getValues('.expressionAttr')[0])
	});
	_eqLogic.configuration.entrees=CommandesEntree;
	if (typeof( _eqLogic.configuration.sotries) !== 'undefined') 
		_eqLogic.configuration.sotries=new Object();
	var CommandesSortie= new Array();
	$('#tab_sortie_neurone .CommandeGroup').each(function( index ) {
		CommandesSortie.push($(this).getValues('.expressionAttr')[0])
	});
	_eqLogic.configuration.sotries=CommandesSortie;
   	return _eqLogic;
}
function printEqLogic(_eqLogic) {
	$('.CommandeGroup').remove();
	if (typeof(_eqLogic.configuration.entrees) !== 'undefined') {
		for(var index in _eqLogic.configuration.entrees) { 
			if( (typeof _eqLogic.configuration.entrees[index] === "object") && (_eqLogic.configuration.entrees[index] !== null) )
				addElement(_eqLogic.configuration.entrees[index],  '{{Commande}}',$('#tab_entree_neurone').find('.Neurone'));
		}
	}	
	if (typeof(_eqLogic.configuration.sotries) !== 'undefined') {
		for(var index in _eqLogic.configuration.sotries) { 
			if( (typeof _eqLogic.configuration.sotries[index] === "object") && (_eqLogic.configuration.sotries[index] !== null) )
				addElement(_eqLogic.configuration.sotries[index],  '{{Commande}}',$('#tab_sortie_neurone').find('.Neurone'));
		}
	}
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
