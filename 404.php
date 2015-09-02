<?php
/**
 * Template 404
 *
 *
 */
?>
<?php get_header(); ?>

<!-- Main content -->
<main class="main-content">


  <?php
    $imageHome = get_template_directory_uri() . '/dist/img/home/03.jpg';
  ?>

  <section class="home-header">
    <div class="home-bg  js-rollerblade">
      <img class="home-bg__img  rollerblade-img" src="<?php echo $imageHome; ?>">
    </div>

    <div class="home-header__container">
      <div class="home-header__content">
        <header>
          <h1 class="home-header__title">Oooops!</h1>
        </header>

        <div class="home-header__lead">
          Esta não é a página que você está procurando certo? Tente um dos botões a seguir.
        </div>

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
