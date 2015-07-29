<?php

// Retorna a URL da Imagem Destacada
function rafaeldilari_featured_to_bg ( $id ) {
  $output = wp_get_attachment_image_src( get_post_thumbnail_id($id), 'full' );
  return $output[0];
};







?>