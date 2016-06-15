<?php
/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../../../core/php/core.inc.php';

class Neuronal extends eqLogic {
	public function CreateApprentissageTable() {
		$Table=array();
		if ($this->getConfiguration('ApprentissageTable')!="")
			$Table=json_decode($this->getConfiguration('ApprentissageTable'), true);
		else
			log::add('Neuronal','debug','Creation de la table de calibration pour le neurone :'.$this->getHumanName());
		foreach ($this->getCmd() as $cmdNeurone) {
	        	 $loop=1;
		         while($cmdNeurone->getConfiguration($loop)!="") {
		         	$ES_Neurone=$cmdNeurone->getConfiguration($loop);
				log::add('Neuronal','debug','Ajout d\'une ligne a la table de calibration pour le neurone :'.$ES_Neurone['name']);
				$cmd = cmd::byId(str_replace('#', '', $ES_Neurone['name']));
				if(is_object($cmd)){
					log::add('Neuronal','debug','Ajout d\'une valeur a la table de calibration pour le neurone :'.$ES_Neurone['name']);
					$Table[$cmd->getName()][count($Table)]=$cmd->execCmd();
				}
	        		 $loop++;
			}
		}
		$this->setConfiguration('ApprentissageTable',json_encode($Table));
		$this->save();
		log::add('Neuronal','debug','Mise a jours de la table de calibration pour le neurone :'.$this->getHumanName());
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
	public static function cron() {
		foreach(eqLogic::byType('Neuronal') as $Equipement){		
			if($Equipement->getIsEnable())
				$Equipement->createListener();
		}
	}
	public function createListener(){
		//if($this->getConfiguration('calibration')){
			$listener = listener::byClassAndFunction('Neuronal', 'CreateApprentissageTable');
			if (!is_object($listener)) {
				
				log::add('Neuronal','debug','Creation d\'un écouteur d\'evenement :'.$this->getHumanName());
				$listener = new listener();
				$listener->setClass('Neuronal');
				$listener->setFunction('CreateApprentissageTable');
				foreach ($this->getCmd() as $cmdNeurone) {
					$loop=1;
                  			while($cmdNeurone->getConfiguration($loop)!="") {
						$ES_Neurone=json_decode($cmdNeurone->getConfiguration($loop));
						$listener->addEvent($ES_Neurone['name'], 'cmd');
						log::add('Neuronal','debug','Ajout de '.$ES_Neurone['name'].' de l\'écouteur d\'evenement :'.$this->getHumanName());
                				$loop++;
					}
				}
				$listener->save();
			}
			//$listener->run();
			log::add('Neuronal','debug','Lancement de l\'écouteur d\'evenement :'.$this->getHumanName());
	//	}
	}
	public function postSave() {
		self::AddCommande($this,'Entree','Entree');
		self::AddCommande($this,'Sortie','Sortie');
		$this->CreateApprentissageTable();
		$this->createListener();
	}
	public static function AddCommande($eqLogic,$Name,$_logicalId) {
		$Commande = $eqLogic->getCmd(null,$_logicalId);
		if (!is_object($Commande))
		{
			$Commande = new NeuronalCmd();
			$Commande->setId(null);
			$Commande->setName($Name);
			$Commande->setLogicalId($_logicalId);
			$Commande->setEqLogic_id($eqLogic->getId());
			$Commande->setType('info');
			$Commande->setSubType('other');
		}
		$Commande->save();
	}

}
class NeuronalCmd extends cmd {
	public function execute($_options = array())	{
		$layers=$this->getConfiguration('ApprentissageTable');
		$ann = fann_create_standard_array (count($layers) , $layers );
	}
}
