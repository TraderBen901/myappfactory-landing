// Liens courts des vidéos : myappfactory.site/v/<clé> → la vidéo sur Google Drive.
// Une ligne par vidéo, la même liste que la vidéothèque (Google Sheets « 00_Vidéothèque » dans Mon Drive).
// La vidéo visée doit être partagée en « Tous les utilisateurs disposant du lien », sinon le lien ne s'ouvre pas.
// Pour remplacer une vidéo par une nouvelle version, changer l'identifiant : le lien court reste le même.
const drive = (id) => `https://drive.google.com/file/d/${id}/view`;

export const videoLinks = {
  // Film de marque « La case sur-mesure » (60 s, voix Louis)
  'la-case-sur-mesure': drive('1s8vppQ_tq0hXjRsZ84yc7cY-hZgjomax'),
  'la-case-sur-mesure-4x5': drive('1PyMgFfW0EUJD7J_Gnmw_gz-Ly_LAb2Ve'),
  // Coupe courte 45 s (musique seule)
  'la-case-sur-mesure-45s': drive('1mq37BkcMkB6ny5iAqkU8IVo7LB9LI0Ei'),
  'la-case-sur-mesure-45s-4x5': drive('1h6WtK3bgY9aQFc9493krk9v5hUCKh__p'),
  // HaRold
  harold: drive('1T98oiTFNTyj1rvHt6CSfIp_M3nreqZa_'),
  'harold-presentation': drive('1S7VHEuj8IW5s_HctgcoNerGl-nnrCA7U'),
};
