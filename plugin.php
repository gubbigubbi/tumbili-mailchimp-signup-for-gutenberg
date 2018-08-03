<?php
/**
 * Plugin Name: Tumbili: Mailchimp Feed for Gutenberg
 * Plugin URI: https://github.com/gubbigubbi/tumbili-mailchimp
 * Description: Easily add a mailchimp signup form to your editor.
 * Author: gubbigubbi
 * Author URI: https://github.com/gubbigubbi/
 * Version: 0.1
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
