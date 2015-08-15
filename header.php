<?php
/**
 * Template Header
 *
 * head completo
 *
 */
?><!doctype html>
<!--
 _                         __     __ __                         _
| |_   _  ___ __ _ ___    / /    / / \ \    _ __   ___ _ __ ___(_)_ __ __ _
| | | | |/ __/ _` / __|  | |    / /   | |  | '_ \ / _ \ '__/ _ \ | '__/ _` |
| | |_| | (_| (_| \__ \ < <    / /     > > | |_) |  __/ | |  __/ | | | (_| |
|_|\__,_|\___\__,_|___/  | |  /_/     | |  | .__/ \___|_|  \___|_|_|  \__,_|
                          \_\        /_/   |_|
-->
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="pt-br"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="pt-br"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="pt-br"> <![endif]-->
<!--[if IE 9]>    <html class="no-js ie9" lang="pt-br"> <![endif]-->
<!--[if gt IE 9]><!--> <html class="no-js" lang="pt-br" itemscope itemtype="http://schema.org/Product"> <!--<![endif]-->
<head>
  <meta charset="utf-8">

  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <meta name="description" content="" />
  <meta name="keywords" content="" />

  <link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
  <link rel="dns-prefetch" href="https://connect.facebook.net">

  <link rel="apple-touch-icon" sizes="57x57" href="<?php echo get_template_directory_uri(); ?>/dist/img/favicons/apple-touch-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="<?php echo get_template_directory_uri(); ?>/dist/img/favicons/apple-touch-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="72x72" href="<?php echo get_template_directory_uri(); ?>/dist/img/favicons/apple-touch-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="76x76" href="<?php echo get_template_directory_uri(); ?>/dist/img/favicons/apple-touch-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="114x114" href="<?php echo get_template_directory_uri(); ?>/dist/img/favicons/apple-touch-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="<?php echo get_template_directory_uri(); ?>/dist/img/favicons/apple-touch-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="144x144" href="<?php echo get_template_directory_uri(); ?>/dist/img/favicons/apple-touch-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="<?php echo get_template_directory_uri(); ?>/dist/img/favicons/apple-touch-icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_template_directory_uri(); ?>/dist/img/favicons/apple-touch-icon-180x180.png">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/dist/img/favicons/favicon-32x32.png" sizes="32x32">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/dist/img/favicons/favicon-194x194.png" sizes="194x194">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/dist/img/favicons/favicon-96x96.png" sizes="96x96">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/dist/img/favicons/android-chrome-192x192.png" sizes="192x192">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/dist/img/favicons/favicon-16x16.png" sizes="16x16">
  <meta name="msapplication-TileColor" content="#000000">
  <meta name="msapplication-TileImage" content="<?php echo get_template_directory_uri(); ?>/dist/img/favicons/mstile-144x144.png">
  <meta name="theme-color" content="#000000">

  <!-- Font loader -->
  <script type="text/javascript">
  !function(){"use strict";function b(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,c)}function c(a){return window.localStorage&&localStorage.font_css_cache&&localStorage.font_css_cache_file===a}function d(){if(window.localStorage&&window.XMLHttpRequest)if(c(a))e(localStorage.font_css_cache);else{var d=new XMLHttpRequest;d.open("GET",a,!0),d.onreadystatechange=function(){4===d.readyState&&(e(d.responseText),localStorage.font_css_cache=d.responseText,localStorage.font_css_cache_file=a)},d.send()}else{var b=document.createElement("link");b.href=a,b.rel="stylesheet",b.type="text/css",document.getElementsByTagName("head")[0].appendChild(b),document.cookie="font_css_cache"}}function e(a){var b=document.createElement("style");b.setAttribute("type","text/css"),b.styleSheet?b.styleSheet.cssText=a:b.innerHTML=a,document.getElementsByTagName("head")[0].appendChild(b)}var a="<?php echo get_template_directory_uri() . '/dist/css/web-fonts.css'; ?>";window.localStorage&&localStorage.font_css_cache||document.cookie.indexOf("font_css_cache")>-1?d():b(window,"load",d)}();
  </script>


  <?php wp_head(); ?>
</head>






<body <?php body_class(); ?>>

<div style="display:none">
  <?php get_template_part("inc/icons", "lib.svg"); ?>
</div>


<header id="topo" class="header-top">
  <div class="header-top__container">
    <h1 class="helper-title"><?php bloginfo( 'name' ); ?></h1>
    <a class="header-top__logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
      <svg>
        <use xlink:href="#logo-rafaeldilari" />
      </svg>
    </a>
    <a class="header-top__menu-btn  js-open-menu" href="#menu">
      <svg>
        <use xlink:href="#icon-menu" />
      </svg>
      <span class="header-top__menu-label">Menu</span>
    </a>
  </div>
</header>


<?php if ( has_nav_menu( 'primary' ) ) : ?>
  <nav class="site-nav  js-site-nav" role="navigation">
    <h2 class="helper-title">Navegação</h2>
    <a class="header-top__menu-btn js-close-menu" href="#menu">
      <svg>
        <use xlink:href="#icon-error" />
      </svg>
    </a>
    <?php
      // Primary navigation menu.
      wp_nav_menu( array(
        'menu_class'     => 'nav-menu',
        'theme_location' => 'primary',
      ));
    ?>
  </nav>
<?php endif; ?>
