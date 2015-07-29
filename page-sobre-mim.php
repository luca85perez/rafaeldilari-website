<?php
/**
 * Template Page-Sobre
 *
 * Apenas para o Sobre Mim
 *
 */
?>
<?php get_header(); ?>

<!-- Main content -->
<main class="main-content">



  <section class="intro-effect-fadeout">
    <header class="page-header">
      <div class="page-header__bg">
        <?php
        // Retorna a Imagem Destacada
        $pageBg = rafaeldilari_featured_to_bg($post->ID);
        ?>
        <img src="<?php echo $pageBg; ?>" alt="">
      </div>
      <!-- /page-header__bg -->

      <div class="page-header__title">
        <?php
        // Campo personalizado "subtitulo"
        $subtitulo = get_post_meta($post->ID, 'subtitulo', true);
        ?>
        <h1><?php the_title(); ?></h1>
        <p><?php echo $subtitulo; ?></p>
      </div>
      <!-- /page-header__title -->

      <button class="page-header__icon  js-trigger-fadeout">
        <svg>
          <use xlink:href="#icon-mouse-down" />
        </svg>
      </button>
      <!-- /page-header__icon -->
    </header>
    <!-- /page-header -->


    <article class="page-content">
      <div class="page-content__section">
      <?php
      // Args
      $args = array(
        'cat' => '11',
        'order'   => 'ASC',
      );

      // The Query
      $querySobre = new WP_Query($args);
      $count = 0;

      // The Loop
      while ( $querySobre->have_posts() ) :
        $querySobre->the_post();

        $right = (($count % 2) == 0) ? '' : 'right';
      ?>

        <div class="page-content__row  <?php echo $right; ?>">
          <h2><?php the_title(); ?></h2>

          <div class="page-content__text">
            <?php the_content(); ?>
          </div>

          <figure class="page-content__img" data-sr>
            <?php
            // Retorna a Imagem Destacada
            $pageBg = rafaeldilari_featured_to_bg($post->ID);
            ?>
            <div>
              <img src="<?php echo $pageBg; ?>" alt="">
            </div>
          </figure>
        </div>
        <!-- /page-content__row -->

        <?php if($count != 3) : ?>
        <div class="separator">
          <div class="separator__icon">
            <svg>
              <use xlink:href="#icon-dilari" />
            </svg>
          </div>
        </div>
        <?php endif; ?>

        <?php $count++; ?>

      <?php
      endwhile;
      wp_reset_postdata();
      ?>
      </div>

      <div class="full-quote">
      <?php
      // Args
      $args = array(
        'p' => '78',
      );

      // The Query
      $queryQuote = new WP_Query($args);

      // The Loop
      while ( $queryQuote->have_posts() ) :
        $queryQuote->the_post();
      ?>
        <div class="full-quote__container">
          <blockquote class="full-quote__text">
            <?php the_content(); ?>
            <cite class="full-quote__author"><?php the_title(); ?></cite>
          </blockquote>
        </div>
      <?php
      endwhile;
      wp_reset_postdata();
      ?>
      </div>

      <section class="page-action  sobre">
        <div class="page-action__container">
          <div class="page-action__icon">
            <svg>
              <use xlink:href="#icon-coffee" >
            </svg>
          </div>
          <h2 class="page-action__title">Quer discutir o projeto ou combinar um café?</h2>
          <a class="btn  btn--ghost" href="<?php echo get_permalink(9); ?>">Entre em contato</a>
        </div>
      </section>
    </article>
    <!-- /page-content -->
  </section>
  <!-- /intro-effect-fadeout -->


</main>

<?php get_footer(); ?>
