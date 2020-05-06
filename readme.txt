=== Plugin Name ===
Contributors: gubbigubbi 	
Tags: gutenberg, mailchimp, mailchimp signup, mailchimp form
Requires at least: 4.9.6
Tested up to: 5.4
Stable tag: 0.7
Requires PHP: 5.6
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Easily and instantly preview your mailchimp feed live within the new editor experience. Adjust settings as neededm such as the number of columns and the spacing. More features to come!

== Description ==

## Tumbili: Mailchimp Signup for Gutenberg
Easily and instantly preview your mailchimp feed live within the new editor (Gutenberg) experience. Adjust settings as neededm such as the number of columns and the spacing. More features to come. 

###Want to see a feature?
###### Feel free to tweet and say 👋 at me [@RhysClay](https://twitter.com/rhysclay/)

== Installation ==

Firstly make sure that you have the Gutenberg plugin installed.

1. Install the tumbili plugin either via the WordPress plugin directory, or by uploading the files to your web server (in the /wp-content/plugins/ directory).
1. Activate the tumbili plugin through the 'Plugins' screen in WordPress
1. Get your Mailchimp API key and List ID: To do this login to mailchimp and [follow these steps] (https://medium.com/@arcomito/grabbing-your-mailchimp-api-key-and-list-id-for-mailchimp-integration-22ef4b20792f)
1. Add the tumbili block to your editor, paste the API key/List ID into the block settings.
1. Your mailchimp signup form will now show in the editor, adjust the settings to see how it will look before publishing.

== Frequently Asked Questions ==

= How about X feature? =

We will continue adding features as requested. If you have a killer idea for a feature submit a support request and we will see what we can do.
Note: we plan to release a premium version of the plugin which will likely receive new features first - this helps offset the cost of our development time.

= The feed looks funny in IE10 (Or other old browser)

This plugin is laid out using Flexbox, we do not have plans to support older browsers as we believe they are holding back the web. However we can (if requested) release some code which you can add to your site's custom css in order to support certain browsers.

== Screenshots ==

1. Adding the tumbili block to the editor and adjusting the settings.
2. Your signup form as it appears on the front end.

== Changelog ==

= 0.7 =
* Added extra controls for label color and submit text
* Fixed bug with form reset

= 0.6 =
* Added custom field support!

= 0.5 =
* Fixed client issue with multiple forms using vanilla js

= 0.4 =
* WP 5.0 support

= 0.3 =
* Update to allow for multiple forms in one page

= 0.2 =
* Update to sanitize form data

= 0.1 =
* First release.