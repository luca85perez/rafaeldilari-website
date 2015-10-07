<?php
/**
 * Template Page-Portfolio
 *
 * Apenas para o Portfolio
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
        <div class="page-content__row">

          <div class="masonry__header">
            <h2 class="masonry__title  js-grid-title">Todos</h2>

            <div class="masonry__filter">
              <button class="js-filter" data-filter="all">Todos</button>
              <button class="js-filter" data-filter="[data-category='Ator']">Ator</button>
              <button class="js-filter" data-filter="[data-category='Contador de Histórias']">Contador de Histórias</button>
              <button class="js-filter" data-filter="[data-category='Roteirista']">Roteirista</button>
              <button class="js-filter" data-filter="[data-category='Palhaço']">Palhaço</button>
            </div>
          </div>

          <div class="masonry__grid  js-grid">
            <?php
            // Args
            $args = array(
              'cat' => '2',
              'order' => 'DESC',
              'posts_per_page' => -1 // sem limite
            );

            // The Query
            $portfolioItems = new WP_Query($args);

            // The Loop
            while ( $portfolioItems->have_posts() ) :
              $portfolioItems->the_post();
              $id = get_the_ID();
              $category = get_the_category();
              $i = 0;
              $category = $category[$i]->cat_name;

              if ($category == 'Portfólio') {
                $i++;
                $category = get_the_category();
                $category = $category[$i]->cat_name;
              }

              // Retorna a Imagem Destacada
              $img = rafaeldilari_featured_to_bg_portfolio($id);
            ?>

            <div class="masonry__item  js-grid-item"  data-category="<?php echo $category; ?>">
              <a href="<?php echo get_permalink(); ?>">
                <div class="masonry__item__container">
                  <div class="masonry__item__image">
                    <img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="<?php echo $img; ?>" alt="">
                  </div>

                  <div class="masonry__item__content">
                    <h2><?php the_title(); ?></h2>
                    <svg>
                      <use xlink:href="#icon-plus" />
                    </svg>
                  </div>
                </div>
              </a>
            </div>
            <?php
            endwhile;
            wp_reset_postdata();
            ?>
          </div>

        </div>
        <!-- /page-content__row -->
      </div>

      <div class="full-quote">
      <?php
      // Args
      $args = array(
        'p' => '464',
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

      <section class="page-action  portfolio">
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
