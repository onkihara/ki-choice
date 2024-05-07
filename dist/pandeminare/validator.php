<?php

/**
* expo/templates/@@templatename@@/validator.php
*
* Die Datei enthält die custom-Validate-Funktion
* 
* @author ah <harald.angerer@schule.suedtirol.it>
* @version 20180726
* @package expo
*/

/**
*
* Klasse für Custom-Validierung
* 
* @package event
*/

class Validator {

	/**
	 * Configuration Object
	 */
	protected $conf;

	/**
	 * Die validate-Funktion
	 *
	 * @param EViewer $viewer oder anderer Viewer
	 * @return Boolean
	 */
	public function validate($viewer) {

		// setting conf
		$this->conf = $viewer->conf;

		// some validation ...

		// OK
		return true;
	}

}