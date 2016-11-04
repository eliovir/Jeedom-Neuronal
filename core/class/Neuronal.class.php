<?php
/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../../../core/php/core.inc.php';

class Neuronal extends eqLogic {
	public static function dependancy_info() {
		$return = array();
		$return['log'] = 'Neuronal_update';
		$return['progress_file'] = '/tmp/compilation_Neuronal_in_progress';
		$return['state'] = 'nok';
		if (exec('grep -q "extension=fann.so" /etc/php5/apache2/php.ini') ==1)
			$return['state'] = 'ok';
		if (exec('dpkg -s libfann-dev | grep -c "Status: install"') ==1)
			$return['state'] = 'ok';
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
	public static function deamon_info() {
		$return = array();
		$return['log'] = 'Neuronal';
		$return['launchable'] = 'ok';
		$return['state'] = 'nok';
		foreach(eqLogic::byType('Neuronal') as $Neuronal){
			$listener = listener::byClassAndFunction('Neuronal', 'ListenerEvent', array('eqLogic_id' => intval($Neuronal->getId())));
			if (!is_object($listener))
				return $return;
		}
		$return['state'] = 'ok';
		return $return;
	}
	public static function deamon_start($_debug = false) {
		log::remove('Neuronal');
		self::deamon_stop();
		$deamon_info = self::deamon_info();
		if ($deamon_info['launchable'] != 'ok') 
			return;
		if ($deamon_info['state'] == 'ok') 
			return;
		foreach(eqLogic::byType('Neuronal') as $Neuronal)
			$Neuronal->save();
	}
	public static function deamon_stop() {
		foreach(eqLogic::byType('Neuronal') as $Neuronal){
			$listener = listener::byClassAndFunction('Neuronal', 'ListenerEvent', array('eqLogic_id' => intval($Neuronal->getId())));
			if (is_object($listener))
				$listener->remove();
		}
	}
	public static function ListenerEvent($_options) {
		log::add('Neuronal', 'debug', 'Objet mis à jour => ' . json_encode($_options));
		$ResauNeurones=eqLogic::byId($_options['eqLogic_id']);
		if (is_object($ResauNeurones)) {
	      		log::add('Neuronal','debug','Evenement sur une entree de Neurone');
			foreach($this->getCmd(null,"Sortie")->getConfiguration('ListeCommandes') as $CmdSortie){
				if($_options['event_id'] == str_replace('#', '', $CmdSortie['cmd'])){
					$eqLogic->CreateApprentissageTable();
					return;
				}
			}
	      		$ResauNeurones->ExecNeurone($_options['event_id'],$_options['value']);
		}
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
	public function postSave() {
			self::AddCommande($this,'Entree','Entree');
			self::AddCommande($this,'Sortie','Sortie');
	      		$this->createListener();
		}
	public function preRemove() {
		$listener = listener::byClassAndFunction('Neuronal', 'ListenerEvent', array('eqLogic_id' => intval($this->getId())));
		if (is_object($listener)) 
			$listener->remove();
	}
	public function createListener(){
		$listener = listener::byClassAndFunction('Neuronal', 'ListenerEvent', array('eqLogic_id' => intval($this->getId())));
		if (!is_object($listener)) {
			log::add('Neuronal','debug','Creation d\'un écouteur d\'evenement :'.$this->getHumanName());
			$listener = new listener();
			$listener->setClass('Neuronal');
			$listener->setFunction('ListenerEvent');
			$listener->setOption(array('eqLogic_id' => intval($this->getId())));
		}
		$listener->emptyEvent();
		foreach ($this->getCmd() as $cmdEsNeurone) {
			foreach ($cmdEsNeurone->getConfiguration('ListeCommandes') as $cmdNeurone) {
				$cmd=cmd::byId(str_replace('#','',$cmdNeurone['cmd']));
				if(is_object($cmd)){
					$listener->addEvent($cmd->getId());
					log::add('Neuronal','debug','Ajout de '.$cmd->getHumanName().' de l\'écouteur d\'evenement :'.$this->getHumanName());
				}
			}
		}
		$listener->save();
		log::add('Neuronal','debug','Lancement de l\'écouteur d\'evenement :'.$this->getHumanName());
	}
	public function ExecNeurone($idCmdEvent,$ValueCmdEvent) {	
      		log::add('Neuronal','debug','Execution du resau de neurone');
		$layers=$this->getConfiguration('ApprentissageTable');
		log::add('Neuronal','debug','Table d\'Apprentissage :'.json_encode($layers));
		$NbEntree=count($this->getCmd(null,"Entree")->getConfiguration('ListeCommandes'));
		$NbSorite=count($this->getCmd(null,"Sortie")->getConfiguration('ListeCommandes'));
		$Entree=array();
		foreach ($this->getCmd(null,"Entree") as $cmdNeurone) {
			foreach($cmdNeurone->getConfiguration('ListeCommandes') as $Commande){
				$cmd = cmd::byId(str_replace('#', '', $Commande['cmd']));
				if(is_object($cmd)){
					log::add('Neuronal','debug','Ajout d\'une valeur a la table de calibration pour le neurone :'.$this->getHumanName().$cmd->getHumanName());
					$Entree[]=$cmd->execCmd();
				}
			}
		}
		log::add('Neuronal','debug','Entree Evenement Neuronal:'.json_encode($Entree));
		if ( ($ann = fann_create($NbEntree, $NbEntree*$NbSorite,$NbSorite)) == FALSE ) {
			log::add('Neuronal','debug','Resultat de l\'execution du neurone :'.json_encode($output));
		 	return;
		}
		if ( fann_train($ann, $layers, 100000, 0.00001) == FALSE ) {
			log::add('Neuronal','debug','Resultat de l\'execution du neurone :'.json_encode($output));
		 	return;
		}
		if ( ($output = fann_run($ann, $Entree)) == FALSE ) {
			log::add('Neuronal','debug','Resultat de l\'execution du neurone :'.json_encode($output));
		 	return;
		}
		log::add('Neuronal','debug','Resultat de l\'execution du neurone :'.json_encode($output));
	}
	public function CreateApprentissageTable() {
		log::add('Neuronal','debug','Mise a jours de la table de calibration pour le neurone :'.$this->getHumanName());
		$Table=array();
		if ($this->getConfiguration('ApprentissageTable')!="")
			$Table=json_decode($this->getConfiguration('ApprentissageTable'), true);
		foreach ($this->getCmd() as $cmdNeurone) {
			foreach($cmdNeurone->getConfiguration('ListeCommandes') as $Commande){
				$cmd = cmd::byId(str_replace('#', '', $Commande['cmd']));
				if(is_object($cmd)){
					log::add('Neuronal','debug','Ajout d\'une valeur a la table de calibration pour le neurone :'.$this->getHumanName().$cmd->getHumanName());
					$Table[$cmd->getName()][count($Table[$cmd->getName()])]=$cmd->execCmd();
				}
			}
		}
		$this->setConfiguration('ApprentissageTable',json_encode($Table));
		$this->save();
		log::add('Neuronal','debug','Mise a jours de la table de calibration pour le neurone :'.$this->getHumanName());
	}
}
class NeuronalCmd extends cmd {
	public function execute($_options = array())	{
	}
}
