<footer class="site-footer" role="contentinfo">
  <div class="site-footer__container">


    <div class="site-footer__col" data-hidden>
      <small class="site-footer__copy">&copy;
        <?php echo date('Y'); ?> Rafael Di Lari
      </small>
    </div>

    <?php if ( has_nav_menu( 'social' ) ) : ?>
    <nav class="site-footer__col" role="navigation">
      <h2 class="helper-title">Mídias Sociais</h2>
      <ul class="social-menu">
        <li class="menu-item">
        <a title="Facebook" target="_blank" href="http://www.facebook.com">
          <svg>
            <use xlink:href="#icon-facebook" />
          </svg>
        </a>
        </li>
        <li class="menu-item">
        <a title="Google+" target="_blank" href="http://www.google.com">
          <svg>
            <use xlink:href="#icon-google" />
          </svg>
        </a>
        </li>
        <li class="menu-item">
        <a title="Enviar um e-mail" href="mailto:contato@rafaeldilari.com.br">
          <svg>
            <use xlink:href="#icon-email" />
          </svg>
        </a>
        </li>
      </ul>
    </nav>
    <?php endif; ?>

    <div class="site-footer__col" data-show>
      <small class="site-footer__copy">&copy;<?php echo date('Y'); ?> Rafael Di Lari</small>
    </div>

    <div class="site-footer__col">
      <small class="site-footer__dev">Design por
        <a href="//www.behance.net/lucas_pereira" target="_blank" title="Lucas Pereira">Lucas Pereira</a>
      </small>
    </div>
  </div>
</footer>


<script> var sitePath = '<?php echo get_template_directory_uri(); ?>'; </script>
<script src="//dev.rafaeldilari.com.br:35729/livereload.js"></script>

<?php wp_footer(); ?>
</body>
</html>
