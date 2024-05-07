<?php

/**
* expo/templates/@@templatename@@/setter.php
*
* Die Datei enthält die custom-doSettings-Funktion
* 
* @author ah <harald.angerer@schule.suedtirol.it>
* @version 20180726
* @package expo
*/

/**
*
* Klasse für Custom-Form-Presets
* 
* @package event
*/

class Setter {

	/**
	 * Configuration Object
	 */
	protected $conf;

	/**
	 * Viewer instanz
	 */
	protected $v = null;

	/**
	 * Die doSettings-Funktion
	 *
	 * @param EViewer $viewer oder anderer Viewer
	 * @return Boolean
	 */
	public function doSettings($viewer)
	{
		// set conf
		$this->conf = $viewer->conf;

		// store viewer
		$this->v = $viewer;

		// some settings ...

	}

}