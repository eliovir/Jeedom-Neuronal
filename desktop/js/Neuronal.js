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
$('body').on('click','.CommandeAction[data-action=add]', function () {
	addElement({},$(this).closest(".form-horizontal").find(".Neurone"));
});
$('body').on('click','.CommandeAction[data-action=remove]', function () {
	$(this).closest(".CommandeGroup").remove();
});
$('body').on('click','.CalibraionAction[data-action=add]', function () {
	addCalibration({},$('#table_Calibration'));
});
$('body').on('click','.CalibraionAction[data-action=remove]', function () {
	$(this).closest("tr").remove();
});
$("#table_cmd_Entree").sortable({axis: "y", cursor: "move", items: ".cmd", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});
$("#table_cmd_Sortie").sortable({axis: "y", cursor: "move", items: ".cmd", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});
function saveEqLogic(_eqLogic) {
	if (typeof( _eqLogic.configuration) !== 'undefined') 
		_eqLogic.configuration=new Object();
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
	if (typeof( _eqLogic.configuration.calibration) !== 'undefined') 
		_eqLogic.configuration.calibration=new Object();
	var CalibraionLigne= new Array();
	$('#table_Calibration .CalibraionLigne').each(function( index ) {
		CalibraionLigne.push($(this).getValues('.CalibraionAttr')[0])
	});
	_eqLogic.configuration.calibration=CalibraionLigne;
   	return _eqLogic;
}
function printEqLogic(_eqLogic) {
	$('.CommandeGroup').remove();
	if (typeof(_eqLogic.configuration.entrees) !== 'undefined') {
		for(var index in _eqLogic.configuration.entrees) { 
			if( (typeof _eqLogic.configuration.entrees[index] === "object") && (_eqLogic.configuration.entrees[index] !== null) )
				addElement(_eqLogic.configuration.entrees[index],$('#tab_entree_neurone').find('.Neurone'));
		}
	}	
	else
		addElement({},$('#tab_entree_neurone').find('.Neurone'));
	if (typeof(_eqLogic.configuration.sotries) !== 'undefined') {
		for(var index in _eqLogic.configuration.sotries) { 
			if( (typeof _eqLogic.configuration.sotries[index] === "object") && (_eqLogic.configuration.sotries[index] !== null) )
				addElement(_eqLogic.configuration.sotries[index],$('#tab_sortie_neurone').find('.Neurone'));
		}
	}
	else
		addElement({},$('#tab_sortie_neurone').find('.Neurone'));
	if (typeof(_eqLogic.configuration.calibration) !== 'undefined') {
		for(var index in _eqLogic.configuration.calibration) { 
			if( (typeof _eqLogic.configuration.calibration[index] === "object") && (_eqLogic.configuration.calibration[index] !== null) )
				addCalibration(_eqLogic.configuration.calibration[index],$('#table_Calibration'));
		}
	}
	else
		addCalibration({},$('#table_Calibration'));
}
function addElement(_Commande, _el) {
	$('#table_Calibration thead tr').append($('<td>').attr('data-param','').text(_Commande.cmd));
    	var div = $('<div class="form-group CommandeGroup">')
   		.append($('<div class="col-lg-1">')
    			.append($('<a class="btn btn-warning btn-sm bt_selectCmdExpression" >')
				.append($('<i class="fa fa-list-alt">'))))
		.append($('<div class="col-lg-3">')
			.append($('<input class="expressionAttr form-control input-sm" data-l1key="cmd" />')))
 		.append($('<div class="col-lg-1">')
  			.append($('<i class="fa fa-minus-circle pull-left cursor CommandeAction" data-action="remove">')));
        _el.append(div);
        _el.find('.CommandeGroup:last').setValues(_Commande, '.expressionAttr');
}
function addCalibration(_Table, _el){
	
	var tr=_el.find('thead tr').clone().insertAfter("tbody tr:last");
	tr.find('td').each(function(index){
		index.append($('<input class="CalibraionAttr" data-l1key="'+index.attr('data-param')+'"'));
	});
	tr.find('td:last').html($('<div class="col-lg-1">')
  		.append($('<i class="fa fa-minus-circle pull-left cursor CalibraionAction" data-action="add">')));
	tr.find('td:last').append($('<div class="col-lg-1">')
  		.append($('<i class="fa fa-minus-circle pull-left cursor CalibraionAction" data-action="remove">')));
        _el.append(tr);
        _el.find('tr:last').setValues(_Table, '.CalibraionAttr');

}
