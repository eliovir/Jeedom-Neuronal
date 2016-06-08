<?php
/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../../../core/php/core.inc.php';

class Neuronal extends eqLogic {
	public static function CreateApprentissageTable() {
		$Table=json_decode($this->getConfiguration('ApprentissageTable'));
		$ES_Neurone=json_decode($this->getConfiguration('ES_Neurone'));
		foreach ($ES_Neurone as $ES) {
			$cmd = cmd::byId(str_replace('#', '', $ES));
			if(is_object($cmd)){
				$Table[count($Table)][$cmd->getName()]=$cmd->execCmd();
			}
		}
		return $Table;
	}
	public static function dependancy_info() {
		$return = array();
		$return['log'] = 'Neuronal_update';
		$return['progress_file'] = '/tmp/compilation_Neuronal_in_progress';
		if (exec('dpkg -s libfann-dev | grep -c "Status: install"') ==1)
				$return['state'] = 'ok';
		else
			$return['state'] = 'nok';
		return $return;
	}
	public static function dependancy_install() {
		if (file_exists('/tmp/compilation_Neuronal_in_progress')) {
			return;
		}
		log::remove('Neuronal_update');
		$cmd = 'sudo /bin/bash ' . dirname(__FILE__) . '/../../ressources/install.sh';
		$cmd .= ' >> ' . log::getPathToLog('Neuronal_update') . ' 2>&1 &';
		exec($cmd);
	}

}
class NeuronalCmd extends cmd {
	public function execute($_options = array())	{
		$layers=$this->getConfiguration('ApprentissageTable');
		$ann = fann_create_standard_array (count($layers) , $layers );
	}
}
