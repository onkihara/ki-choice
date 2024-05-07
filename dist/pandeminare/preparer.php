<?php

/**
* expo/templates/@@templatename@@/preparer.php
*
* Das Plugin enthält die custom-data-prepare-funktionen und wird
* falls vorhanden zur Vorbereitung der Daten beim Eintrag in die
* date-Tabelle aufgerufen.
* 
* @author ah <harald.angerer@schule.suedtirol.it>
* @version 20180726
* @package expo
*/

/**
*
* Klasse für Custom-Data preparing
* 
* @package event
*/

class Preparer {

	/**
	 * Configuration Object
	 */
	protected $conf;

	/**
	 * Die doSettings-Funktion
	 *
	 * @param EViewer $viewer oder anderer Viewer
	 * @return Boolean
	 */
	public function prepare($viewer, $data)
	{ 
		// set conf
		$this->conf = $viewer->conf;

		// some data preparing ...
	
		return $data;
	}

}