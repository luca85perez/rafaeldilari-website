<?php
/**
 * Template Category
 *
 * Exibe a listagem dos posts com paginação
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
      // cat 7 é blog
      $do_not_duplicate = '';
      $args = array(
        'cat' => '7',
        'order'   => 'DESC',
      );

      // The Query
      $query = new WP_Query($args);

      // The Loop
      while ( $query->have_posts() ) :
        $query->the_post();
        $do_not_duplicate .= $post->ID . ',';

        $category = get_the_category();
        $i = 0;
        $categoryName = $category[$i]->cat_name;

        if ($categoryName == 'Blog') {
          $i++;
          $categoryName = $category[$i]->cat_name;
        }

        $categoryLink = get_category_link($category[$i]->term_id);
      ?>

        <div class="post-grid">
          <div class="post-meta">
            <small>&bull; <?php the_time('j'); ?> de <?php the_time('F'); ?> de <?php the_time('Y'); ?> na categoria <a href="<?php echo esc_url($categoryLink); ?>"><?php echo esc_html( $categoryName ); ?></a></small>
          </div>
          <h1 class="post-grid__title"><?php the_title(); ?></h1>
          <h2 class="post-grid__excerpt"><?php the_excerpt(); ?></h2>
          <?php the_content( __('Continue lendo') ); ?>
        </div>

        <hr>

      <?php
      endwhile;
      // wp_reset_postdata();
      ?>

      <?php
      if ( show_posts_nav($query) ) {
        echo do_shortcode( '[ajax_load_more post_type="post" post_format="standard" category="blog" exclude="' . $do_not_duplicate . '" transition="fade"  button_label="Mais" max_pages="0" scroll_distance="150"]');
      }
      ?>
      </div>
    </article>
    <!-- /page-content -->
  </section>
  <!-- /intro-effect-fadeout -->


</main>

<?php get_footer(); ?>
