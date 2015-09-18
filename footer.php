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
          <a title="Facebook" target="_blank" href="//www.facebook.com/rafael.dilari">
            <svg>
              <use xlink:href="#icon-facebook" />
            </svg>
          </a>
        </li>
        <li class="menu-item">
          <a title="Google+" target="_blank" href="//plus.google.com/109095193727132422013/posts">
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



<?php
$filter = isset($_GET['filter']) ? $_GET['filter'] : 'all';
switch ($filter) {
  case 'ator':
    $filter = "[data-category='Ator']";
    break;
  case 'palhaco':
    $filter = "[data-category='Palhaço']";
    break;
  case 'historias':
    $filter = "[data-category='Contador de Histórias']";
    break;
  case 'roteirista':
    $filter = "[data-category='Roteirista']";
    break;
  default:
    $filter = "all";
    break;
}
?>

<script>
  var sitePath = '<?php echo get_template_directory_uri(); ?>';
  var effectIntro = true;
  var masonryFilter = "<?php echo $filter; ?>";
</script>

<script>
function init() {
var imgDefer = document.getElementsByTagName('img');
for (var i=0; i<imgDefer.length; i++) {
if(imgDefer[i].getAttribute('data-src')) {
imgDefer[i].setAttribute('src',imgDefer[i].getAttribute('data-src'));
} } }
window.onload = init;
</script>

<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-67796115-1', 'auto');
ga('send', 'pageview');
</script>

<?php wp_footer(); ?>
</body>
</html>
