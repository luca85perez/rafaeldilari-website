<?php
/**
 * Template Header
 *
 * head completo
 *
 */
?><!doctype html>
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

  <!-- Facebook Metadata /-->
  <meta property="fb:page_id" content="" />
  <meta property="og:image" content="" />
  <meta property="og:description" content=""/>
  <meta property="og:title" content=""/>

  <!-- Google+ Metadata /-->
  <meta itemprop="name" content="">
  <meta itemprop="description" content="">
  <meta itemprop="image" content="">

  <link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

  <link rel="dns-prefetch" href="https://connect.facebook.net">

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
