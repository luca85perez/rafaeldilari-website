<?php
/**
 * Template Single Portfolio
 *
 * Exibe conteúdo dos posts da categoria portfolio
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
        if ( have_posts() ) :
        	while ( have_posts() ) :
        		the_post();

            $category = get_the_category();
            $i = 0;
            $categoryName = $category[$i]->cat_name;

            if ($categoryName == 'Portfólio') {
              $i++;
              $categoryName = $category[$i]->cat_name;
            }

            $query = '';

            switch ($categoryName) {
              case 'Ator':
                $query = 'ator';
                break;
              case 'Contador de Histórias':
                $query = 'historias';
                break;
              case 'Roteirista':
                $query = 'roteirista';
                break;
              case 'Palhaço':
                $query = 'palhaco';
                break;
            }

            $portfolioLink = get_permalink(59);
            $portfolioLink .= '?filter=';
            $portfolioLink .= $query;

            // $categoryLink = get_category_link($category[$i]->term_id);
        ?>

        <div class="page-post">
          <h2>
            <a href="<?php echo esc_url($portfolioLink); ?>"><?php echo esc_html( $categoryName ); ?></a>
          </h2>
          <div class="page-excerpt">
            <?php the_excerpt(); ?>
          </div>
      		<?php the_content(); ?>
        </div>

        <?php
          endwhile;
          wp_reset_postdata();
        endif;
        ?>

        <div class="mais-posts">
          <div class="mais-posts__btn  mais-posts__btn--previous">
            <?php
              previous_post_link(
                '%link',
                '<div class="mais-posts__icon"><svg><use xlink:href="#icon-next" /></svg></div><div class="mais-posts__text">%title</div>',
                TRUE
              );
            ?>
          </div>

          <div class="mais-posts__btn  mais-posts__btn--next">
            <?php
              next_post_link(
                '%link',
                '<div class="mais-posts__text">%title</div><div class="mais-posts__icon"><svg><use xlink:href="#icon-next" /></svg></div>',
                TRUE
              );
            ?>
          </div>
        </div>

        <div class="separator">
          <div class="separator__icon">
            <svg>
              <use xlink:href="#icon-dilari" />
            </svg>
          </div>
        </div>

        <div class="comentarios">
          <?php echo do_shortcode('[fbcomments]'); ?>
        </div>
      </div>

    </article>
    <!-- /page-content -->
  </section>
  <!-- /intro-effect-fadeout -->


</main>

<div class="float-btn  float-btn--previous  js-float-btn">
  <?php
    previous_post_link(
      '%link',
      '<div class="float-btn__icon"><svg><use xlink:href="#icon-next" /></svg></div>',
      TRUE
    );
  ?>
</div>

<div class="float-btn  float-btn--next  js-float-btn">
  <?php
    next_post_link(
      '%link',
      '<div class="float-btn__icon"><svg><use xlink:href="#icon-next" /></svg></div>',
      TRUE
    );
  ?>
</div>

<?php get_footer(); ?>
