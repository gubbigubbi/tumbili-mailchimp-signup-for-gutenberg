<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Constants
define( 'TUMBILI_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */
function tumbili_block_assets() {
	// Styles.
	wp_enqueue_style(
		'tumbili-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: filemtime — Gets file modification time.
	);
} // End function tumbili_block_assets().

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'tumbili_block_assets' );

/**
 * Enqueue assets for the frontend only
 */

 function tumbili_client_assets() {
	wp_enqueue_script( 'tumbili-js', plugins_url( 'dist/client.babel.js', dirname( __FILE__ ) ), array(), true );

	wp_localize_script( 'tumbili-js', 'tumbili', array(
		'ajax_url' => admin_url( 'admin-ajax.php' )
	));
}

add_action( 'wp_enqueue_scripts', 'tumbili_client_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function tumbili_editor_assets() {
	// Scripts.
	wp_enqueue_script(
		'tumbili-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Styles.
	wp_enqueue_style(
		'tumbili-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: filemtime — Gets file modification time.
	);
} // End function tumbili_editor_assets().

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'tumbili_editor_assets' );

/**
 * Server Side Rendering
 */
require_once( TUMBILI_PLUGIN_PATH . './server.php' );
