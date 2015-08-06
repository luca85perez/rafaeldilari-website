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
        ?>

        <div class="page-content__row ">
          <h2><?php echo $subtitulo; ?></h2>

          <div class="page-content__text">
            <?php the_content(); ?>

            <?php
            $disponivel = get_post_meta($post->ID, 'disponivel_para_trabalhos', true);
            ?>
            <div class="info-contato">
              <?php if ($disponivel) : ?>
              <h4 class="info-contato__title" data-sr>Estou disponível para novos trabalhos</h4>
              <?php else :
              $disponivel_data = get_post_meta($post->ID, 'disponivel_a_partir_de', true);
              ?>
              <h4 class="info-contato__title" data-sr>Estarei disponível a partir de <?php echo $disponivel_data; ?></h4>
              <?php endif; ?>
            </div>
          </div>

          <div class="page-content__text">


            <div class="info-contato">
              <ul class="info-contato__links" data-sr>
                <li>
                  <a title="Facebook" target="_blank" href="//www.facebook.com/rafael.dilari">
                    <svg>
                      <use xlink:href="#icon-facebook" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a title="Google+" target="_blank" href="//plus.google.com/109095193727132422013/posts">
                    <svg>
                      <use xlink:href="#icon-google" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a title="Enviar um e-mail" href="mailto:contato@rafaeldilari.com.br">
                    <svg>
                      <use xlink:href="#icon-email" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a title="Google Maps" target="_blank" href="//www.google.com/maps/place/Curitiba+-+PR,+Brasil/@-25.4992789,-49.2148237,11z/data=!4m2!3m1!1s0x94dce35351cdb3dd:0x6d2f6ba5bacbe809">
                    <svg>
                      <use xlink:href="#icon-pin" />
                    </svg>
                    <span>Curitiba, Paraná</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- /page-content__row -->

        <div class="page-content__row ">
          <div class="form-contato  js-form">
            <?php echo do_shortcode('[contact-form-7 id="172" title="Form Contato"]'); ?>
          </div>
        </div>

        <?php
          endwhile;
          wp_reset_postdata();
        endif;
        ?>

      </div>



    </article>
    <!-- /page-content -->
  </section>
  <!-- /intro-effect-fadeout -->


</main>

<?php get_footer(); ?>
