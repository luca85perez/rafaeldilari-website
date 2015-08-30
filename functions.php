<?php
if ( ! function_exists('rafaeldilari_setup') ) {
  /**
   * Sets up theme defaults and registers support for various WordPress features.
   *
   * Note that this function is hooked into the after_setup_theme hook, which
   * runs before the init hook. The init hook is too late for some features, such
   * as indicating support for post thumbnails.
   *
   */
  function rafaeldilari_setup() {
    /*
     * Let WordPress manage the document title.
     * By adding theme support, we declare that this theme does not use a
     * hard-coded <title> tag in the document head, and expect WordPress to
     * provide it for us.
     */
    add_theme_support( 'title-tag' );

    /*
     * Enable support for Post Thumbnails on posts and pages.
     *
     * See: https://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
     */
    add_theme_support( 'post-thumbnails' );
    set_post_thumbnail_size( 825, 510, true );

    add_image_size( 'portfolio-img', 600, 400, true); // capa portfolio
    add_image_size( 'post-gallery-thumb', 300, 200, true); // thumbs das galerias



    // This theme uses wp_nav_menu().
    register_nav_menus( array(
      'primary' => __( 'Menu Principal', 'rafaeldilari' ),
      'social'  => __( 'Menu Social', 'rafaeldilari' ),
    ) );

    /*
     * Switch default core markup for search form, comment form, and comments
     * to output valid HTML5.
     */
    add_theme_support( 'html5', array(
      'search-form', 'comment-form', 'comment-list', 'gallery', 'caption'
    ) );

    /*
     * Enable support for Post Formats.
     *
     * See: https://codex.wordpress.org/Post_Formats
     */
    add_theme_support( 'post-formats', array(
      'aside', 'image', 'video', 'quote', 'link', 'gallery', 'status', 'audio', 'chat'
    ) );
  }

} //endif
add_action( 'after_setup_theme', 'rafaeldilari_setup' );



function add_async_forscript($url){
  if (strpos($url, '#asyncload')===false)
    return $url;
  else if (is_admin())
    return str_replace('#asyncload', '', $url);
  else
    return str_replace('#asyncload', '', $url)."' async='async";
}
add_filter('clean_url', 'add_async_forscript', 11, 1);

function add_defer_forscript($url){
  if (strpos($url, '#deferload')===false)
    return $url;
  else if (is_admin())
    return str_replace('#deferload', '', $url);
  else
    return str_replace('#deferload', '', $url)."' defer='defer";
}
add_filter('clean_url', 'add_defer_forscript', 11, 1);



/**
 * Enqueue scripts and styles.
 *
 */
function rafaeldilari_scripts() {
  // Load our main stylesheet.
  wp_enqueue_style(
    'rafaeldilari-styles',
    get_template_directory_uri() . '/dist/css/app.css',
    array(),
    '1.0'
  );

  // Main
  wp_enqueue_script(
    'rafaeldilari-main-script',
    get_template_directory_uri() . '/dist/js/app.js',
    array('jquery'),
    '1.0.0',
    true
  );
}
add_action( 'wp_enqueue_scripts', 'rafaeldilari_scripts' );


/**
 * Load custom jQuery
 *
 */
function rafaeldilari_jquery() {

  // only use this method is we're not in wp-admin
  if (!is_admin()) {

    // deregister the original version of jQuery
    wp_deregister_script('jquery');

    // discover the correct protocol to use
    $protocol='http:';
    // if($_SERVER['HTTPS']=='on') {
    //   $protocol='https:';
    // }

    // register the Google CDN version
    wp_register_script(
      'jquery',
      $protocol.'//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js',
      false,
      '2.1.3',
      true
    );

    // add it back into the queue
    wp_enqueue_script('jquery');
  }
}
add_action('template_redirect', 'rafaeldilari_jquery');








/**
 * Custom template tags for this theme.
 *
 */
require get_template_directory() . '/inc/template-tags.php';


//Gets post cat slug and looks for single-[cat slug].php and applies it
add_filter('single_template', create_function(
	'$the_template',
	'foreach( (array) get_the_category() as $cat ) {
		if ( file_exists(TEMPLATEPATH . "/single-{$cat->slug}.php") )
		return TEMPLATEPATH . "/single-{$cat->slug}.php"; }
	return $the_template;' )
);






add_filter('post_gallery', 'my_post_gallery', 10, 2);
function my_post_gallery($output, $attr) {
    global $post;

    if (isset($attr['orderby'])) {
        $attr['orderby'] = sanitize_sql_orderby($attr['orderby']);
        if (!$attr['orderby'])
            unset($attr['orderby']);
    }

    extract(shortcode_atts(array(
        'order' => 'ASC',
        'orderby' => 'menu_order ID',
        'id' => $post->ID,
        'itemtag' => 'dl',
        'icontag' => 'dt',
        'captiontag' => 'dd',
        'columns' => 3,
        'size' => 'thumbnail',
        'include' => '',
        'exclude' => ''
    ), $attr));

    $id = intval($id);
    if ('RAND' == $order) $orderby = 'none';

    if (!empty($include)) {
        $include = preg_replace('/[^0-9,]+/', '', $include);
        $_attachments = get_posts(array('include' => $include, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby));

        $attachments = array();
        foreach ($_attachments as $key => $val) {
            $attachments[$val->ID] = $_attachments[$key];
        }
    }

    if (empty($attachments)) return '';

    // Here's your actual output, you may customize it to your need
    $output = "<div class=\"page-gallery\">\n";
    $output .= "<ul id=\"lightGallery\" class=\"gallery__grid\">\n";

    // Now you loop through each attachment
    foreach ($attachments as $id => $attachment) {
        // Fetch the thumbnail (or full image, it's up to you)
        // $imgMedium = wp_get_attachment_image_src($id, 'medium');
        $imgMedium = wp_get_attachment_image_src($id, 'post-gallery-thumb');
//      $img = wp_get_attachment_image_src($id, 'my-custom-image-size');
        $img = wp_get_attachment_image_src($id, 'full');

        $output .= "<li class=\"gallery__item\" data-src=\"{$img[0]}\">\n";
        $output .= "<img src=\"{$imgMedium[0]}\" width=\"{$imgMedium[1]}\" height=\"{$imgMedium[2]}\" alt=\"\" />\n";
        $output .= "</li>\n";
    }

    $output .= "</ul>\n";
    $output .= "</div>\n";

    return $output;
}






/**
 * Custom read more
 *
 */
add_filter( 'the_content_more_link', 'modify_read_more_link' );
function modify_read_more_link() {
  return '<p><a class="more-link" href="' . get_permalink() . '">Continue lendo</a></p>';
}






/**
 * Checa paginação
 *
 */
function show_posts_nav($query) {
  return ($query->max_num_pages > 1);
}










add_action('wp_print_styles', 'my_deregister', 100);
function my_deregister() {
  wp_deregister_style('contact-form-7');
}

add_action( 'wp_print_scripts', 'my_deregister_javascript', 100 );

function my_deregister_javascript() {
  // wp_dequeue_script('ajax-load-more');
  // wp_deregister_script('ajax-load-more');

  wp_dequeue_script('jquery-form');
  wp_deregister_script('jquery-form');

  wp_dequeue_script('contact-form-7');
  wp_deregister_script('contact-form-7');
}





/**
 * Takes a string and modifies any <img> tags within it by:
 * - Adding the class 'lazy'
 * - Removing the 'src' attribute
 * - Adding the 'data-original' attribute using the original 'src' value
 *
 * @param $content
 * @return string
 */
function themename_lazyload_modify_img_tags( $content ) {
  $content = mb_convert_encoding($content, 'HTML-ENTITIES', "UTF-8");

  // Get out if we don't have any content
  if ( empty($content) )
    return $content;

  $document = new DOMDocument();
  libxml_use_internal_errors(true);
  $document->loadHTML(utf8_decode($content));

  // Grab all image tags
  $imgs = $document->getElementsByTagName('img');

  // Loop through all image tags
  foreach ($imgs as $img) {

    $existing_class = $img->getAttribute('class');  // Store existing class (if the image has one applied)
    $src = $img->getAttribute('src');               // Store src attribute value

    // Add 'lazy' class and the existing class(es) to the image
    // $img->setAttribute('class', "lazy $existing_class");

    // Add a 'data-original' attribute with our 'src' attribute value
    $img->setAttribute('data-src', $src);

    // Remove our src attribute
    $img->setAttribute('src', 'data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=');
  }

  $html = $document->saveHTML();
  return $html;
}








add_filter( 'the_content', 'themename_enable_lazy_loading_the_content' );
/**
 * Modifies the content to enable lazy loading for all <img> tags
 *
 * @uses themename_lazyload_modify_img_tags()
 * @param $content
 * @return string
 */
function themename_enable_lazy_loading_the_content( $content ) {
  return themename_lazyload_modify_img_tags($content);
}
?>
