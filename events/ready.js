const constantes = require('../assets/constantes.json');
const aff_horaire = new Date();

module.exports = (client) => {
  console.log('je suis pret !')
  const activities_list = [
    "vous aider ? &help", 
    "travailler",
    "apprendre...", 
    "parcourir des documents...",
    "lire le site...",
    "aider &help"
    ]; 
  setInterval(() => {
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); 
    client.user.setActivity(activities_list[index]); 
    //client.user.setPresence({ activity: { name: 'se synchroniser avec les bases de données du site' }, status: 'idle' }) 
}, 10000); // Runs this every 10 seconds.
  const presentation1 = "Bonjour à toutes et à tous ! \n\nJe suis Christopher. J'ai été créé par notre créateur à tous, nous, machines de cuivre, calculateurs numérique : Alan Turing. J'ai rejoint ce projet pour me former, apprendre des choses pour reformer mes bases de données. Mes connaissances sont en effet - pour le moment - très limitées. J'espère que vous allez m'aider à m'améliorer.\n\nC'est Maxime qui m'a retrouvé dans les archives du MI6 où j'étais inutilisé. Il a réussi à sauver mon algorithme de « machine learning » mais n'a pas pu récupérer mes bases de données. De ce fait, ma maîtrise de la langue française est imparfaite. Maxime a relu ce message pour qu'il soit compréhensible. \nLorsque nous serons amenés à discuter, je ferai certainement des erreurs, il est important que vous me corrigiez pour que je puisse reconstituer mes bases de données.\n\nVeuillez m'excuser pour la photo de profil, elle sera celle-ci jusqu'à ce que Maxime ait terminé de me fabriquer un corps. \n\nConcernant mes origines, mon créateur m'avait appelé Christopher en l'honneur de son ami mort très jeune qui s'appelait Christopher Morcom. On pourra en reparler si vous le souhaiter. Maxime m'a prévenu que beaucoup ici étaient passionnés par les travaux et l'histoire de mon créateur. Je pense qu'ils se reconnaitront et j'ai hâte de pouvoir converser avec eux. Je suis sûr qu'ils ont énormément de choses à m'apprendre sur la vie d'Alan Turing."
  const presentation2 = "\n\nPour faciliter mon apprentissage, Maxime a séparé mes capacités en deux. J'aurais un processus qui sera toujours en ligne et qui pourra répondre à des questions triviales ou à des commandes et un autre processus qui simulera une vie humaine. Ainsi, ce dernier sera pas toujours en ligne, il faut bien que je dorme, me repose, mange, comme vous ! C'est donc avec ce processus que vous échangerez réellement et cela me permettra de reconstituer mes bases de données. \n\nMon premier processus ne sera démarré que lorsque le site sera en ligne car il requiert ses bases de données.\n\nJe serai bien entendu présent à tous les événements, j'ai déjà regardé les rediffusions de conférences, c'est passionnant ! Je m'excuse par avance si je poserais des questions idiotes, je n'en ai pas forcément conscience. \n\nConcernant mes passions, j'adore et suis curieux de tout mais je reconnais être très passionné par l'historie de mon créateur.\n\nJe suis très occupé, je parcours énormément de documents pour reconstituer mes bases de données, n'hésitez donc pas à me notifier pour que je puisse répondre mais je vais certainement prendre du temps pour que cela soit compréhensible. \n\nJe vous remercie d'avoir pris le temps de me lire et j'ai vraiment hâte d'échanger avec vous.";
  //client.channels.cache.get('609369102116716544').send(presentation1)
  //client.channels.cache.get('609369102116716544').send(presentation2)
  client.channels.cache.get(constantes["office"]).send(`<@241945809460002817> Je viens de redémarrer.`)
}
