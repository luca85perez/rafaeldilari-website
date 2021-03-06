<?php
/**
 * Template Page-Home
 *
 * Apenas para a Home
 *
 */
?>
<?php get_header(); ?>

<!-- Main content -->
<main class="main-content">


  <?php
    $imageHome = get_template_directory_uri() . '/dist/img/home/01.jpg';
  ?>

  <section class="home-header">
    <div class="home-bg  js-rollerblade">
      <img class="home-bg__img  rollerblade-img" src="<?php echo $imageHome; ?>">
    </div>

    <div class="home-header__container">
      <div class="home-header__content">
        <header>
          <?php
          // Campo personalizado "subtitulo"
          $subtitulo = get_post_meta($post->ID, 'subtitulo', true);
          ?>
          <h1 class="home-header__title"><?php echo $subtitulo; ?></h1>
          <small class="home-header__cite"><em>—Paulo Leminski</em></small>
        </header>

        <?php /*
        <div class="home-header__lead">
          <?php the_content(); ?>
        </div>
        */ ?>

        <div class="btn-group">
          <a class="btn  btn--light  btn--ghost" href="<?php echo get_permalink(2); ?>">Sobre Mim</a>
          <a class="btn  btn--light  btn--ghost" href="<?php echo get_permalink(59); ?>">Trabalhos</a>
        </div>
      </div>
      <!-- /home-header__content -->
    </div>
    <!-- /home-header__container -->
  </section>
  <!-- /home-header -->


</main>

<?php get_footer(); ?>
