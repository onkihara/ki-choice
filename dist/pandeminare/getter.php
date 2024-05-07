<?php

/**
* expo/templates/@@templatename@@/getter.php
*
* Die Datei enthält die custom-Getter-Funktion
* 
* @author ah <harald.angerer@schule.suedtirol.it>
* @version 20190823
* @package expo
*/

/**
*
* Klasse für Custom-Getting-Data from POST or _FDBSTORE
* 
* @package event
*/

class Getter {

	/**
	 * Configuration Object
	 */
	protected $conf;

	/**
	 * Die Getter-Funktion
	 *
	 * @param EViewer $viewer oder anderer Viewer
	 * @return Array
	 */
	public function get($viewer) {

		// setting conf
		$this->conf = $viewer->conf;

		// overwrite fetching data here ...
		$data = $viewer->getf('Register,Mark','_');

		// OK
		return $data;
	}

}