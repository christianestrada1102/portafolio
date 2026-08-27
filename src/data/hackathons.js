// Fotos procesadas por carpeta: pN.jpg (web) + pN-8bit.png (versión pixel).
// Se generan con el script pixelize (dither Bayer + paleta morada).
const imgs = import.meta.glob('../assets/hacks/*/p*.{jpg,png}', {
  eager: true,
  import: 'default',
});

const photosFor = (folder, captions = [], positions = [], skip = []) => {
  const out = [];
  for (let i = 1; ; i++) {
    const src = imgs[`../assets/hacks/${folder}/p${i}.jpg`];
    if (!src) break;
    if (skip.includes(i)) continue;
    out.push({
      src,
      src8: imgs[`../assets/hacks/${folder}/p${i}-8bit.png`] ?? null,
      caption: captions[i - 1] ?? '',
      pos: positions[i - 1] ?? 'center',
    });
  }
  return out;
};

export const hackathons = [
  {
    id: 'primer-hack-aws',
    event: 'Primer hack',
    eventItalic: 'AWS',
    date: '2025',
    location: 'Chihuahua, MX',
    team: 'Christian · Kikin',
    duration: '1 día',
    photos: photosFor('primer-hack-aws'),
    story: [
      'El primer hackathon. Recién había conocido lo que era Cursor, no había pasado ni una semana. Tenía un portfolio que define la palabra "VibeCoded", pero aun así me aventé a un hackathon de AWS. ¿Qué m*** es eso? dije. Investigando descubrí que era tecnología de cómputo en la nube y nos lanzamos a ver qué salía, yo y Kikin. Llegamos, dieron un workshop. No entendimos nada. Luego explicaron el reto: optimiza las peticiones a la empresa Softii usando AWS, cinco millones de registros. Empezamos investigando en el chat, en Google, ¿qué es una Lambda? Puro estrés y confusión.',
      'Las cosas se calmaron cuando descubrimos que Cursor lo podía hacer. Empezamos a promptear como nunca, literalmente diciéndole "¡HAZLO! ¡RÁPIDO!" y trabajando en equipo logramos que corriera los 5 millones de registros en 20 segundos. Nos relajamos por fin, fuimos a hacer networking con los otros builders. Cuando volvimos no había nada. Alguien había entrado y cambiado el código. Lo intentamos hasta el último minuto con ayuda de otros amigos. No conseguimos que funcionara igual, era funcional pero lento. Entregamos así.',
      'Terminó el hackathon y no me podía quedar con ese mal sabor de boca. Llegué a mi casa y el hackathon siguió hasta las 2am. Logré que los 5 millones de registros se procesaran en 6.7 segundos. Conocimos personas nuevas, la pasamos bien, y fue el primer encuentro real con el ecosistema.',
    ],
  },
  {
    id: 'twcuu',
    event: 'Tech Week',
    eventItalic: 'Chihuahua',
    date: '2025',
    location: 'Chihuahua, MX',
    team: 'Christian',
    duration: 'Una noche',
    photos: photosFor('twcuu', [], ['center 70%']),
    story: [
      'De parte de Innova nos invitaron al cierre de la Tech Week: una noche de networking, música en vivo y conversaciones con builders de toda la ciudad. No sabía qué esperar pero fue la primera entrada real al ecosistema tecnológico de Chihuahua.',
      'Pude hablar con gente que llevaba años construyendo cosas aquí, proyectos, startups, comunidades. Me di cuenta de que todo esto ya estaba pasando y yo simplemente no lo conocía. Salí con amigos nuevos, contactos y una pregunta que no me pude quitar de la cabeza: ¿cómo ayudo a que más personas sepan que esto existe?',
    ],
  },
  {
    id: 'nasa-2025',
    event: 'NASA Space Apps',
    eventItalic: 'Challenge',
    date: 'OCT 2025',
    location: 'Chihuahua, MX',
    team: 'Christian · Kikin · Fer · Saúl · Mayrim · Leo',
    duration: '48 horas',
    photos: [
      // p1: panorámica de apertura — arranca el hackathon
      { src: imgs['../assets/hacks/nasa/p1.jpg'], src8: imgs['../assets/hacks/nasa/p1-8bit.png'] ?? null, caption: 'Arranca el hackathon', pos: 'center' },
      // p3: el equipo trabajando — Saúl, Fer y yo en los minijuegos; Mayrim en diseño; Kikin en guion
      { src: imgs['../assets/hacks/nasa/p3.jpg'], src8: imgs['../assets/hacks/nasa/p3-8bit.png'] ?? null, caption: 'Saúl, Fer y yo en los minijuegos. Mayrim en diseño, Kikin en guion', pos: 'center' },
      // p4: noche de trabajo
      { src: imgs['../assets/hacks/nasa/p4.jpg'], src8: imgs['../assets/hacks/nasa/p4-8bit.png'] ?? null, caption: 'Noche de trabajo', pos: 'center' },
      // p5: presentación del proyecto — wide emocional después del texto principal
      { src: imgs['../assets/hacks/nasa/p5.jpg'], src8: imgs['../assets/hacks/nasa/p5-8bit.png'] ?? null, caption: 'Presentación del proyecto', pos: 'center 35%' },
      // p6 + p7: equipo y foto grupal — cierre visual del coda
      { src: imgs['../assets/hacks/nasa/p6.jpg'], src8: imgs['../assets/hacks/nasa/p6-8bit.png'] ?? null, caption: 'Los Yuyines', pos: 'center' },
      { src: imgs['../assets/hacks/nasa/p7.jpg'], src8: imgs['../assets/hacks/nasa/p7-8bit.png'] ?? null, caption: 'Foto grupal del NASA Space Apps Chihuahua', pos: 'center' },
    ],
    coda: [
      'Éramos seis y la química que se formó en esas 48 horas fue lo mejor del hackathon. Fer, Saúl, Kikin, Mayrim, Leo y yo, cada quien con su parte, todos con las mismas ganas. El proyecto no se calificó como queríamos pero lo terminamos después, lo subimos y quedó. Yuyin existe. Eso no se pierde.',
    ],
    story: [
      '48 horas para construir una experiencia que enseñara a niños sobre el espacio. Después de una lluvia de ideas nos decidimos por hacer un videojuego, sin idea de lo que eso implicaba. En la semana previa aprendimos a desarrollar rebotando entre plataformas: primero una web, pero no sabíamos nada de JS ni TypeScript. Probamos Unity, no entendíamos nada. Godot, lo mismo pero más limitado. Hasta pensamos en Roblox con Lua. Al final me puse a aprender Unity solo, me robé sprites de internet y armé la primera demo de Yuyin: un minijuego de plataformas donde el objetivo era recolectar energía para la nave. Kikin y Mayrim investigaron Fungus para construir una novela visual interactiva como capa de aprendizaje. Llegamos al hackathon con todo preparado. Nos dieron merch. La emoción estaba.',
      'Nos organizamos: Fer, Saúl y yo haríamos tres minijuegos; Kikin y Mayrim la historia y la novela visual; Leo el pitch y cómo vender el producto. Trabajamos hasta tener algo funcional el primer día. A la noche había bugs y estrés, salimos a unas actividades para desestresarnos, volvimos y seguimos. Yo no dormí nada en todo el hackathon, si mucho dos horas. La mañana del segundo día Fer estaba preocupado: se había corrompido su minijuego. Intentamos recuperarlo, no pudimos, empezó de cero. Llegaron los mentores y dijeron que nuestro producto era muy genérico. Nos valió. Seguimos. Cambiamos la historia, tuvimos una junta de medianoche para replantear la presentación y rehacimos todo.',
      'El juego estaba quedando muy bien y se rompió. Era la primera vez que usábamos GitHub Desktop y al juntar todas las partes se corrompió gran parte del proyecto. No pudimos subir la versión funcional a itch.io. Entregamos un proyecto vacío y presentamos lo que pudimos rescatar. Terminando el hack lo continuamos y lo terminamos porque aún se podía modificar. Pero no se calificó, ellos tenían la versión rota. Perdimos el primer hackathon y ganamos experiencia, trabajo bajo presión y una química de equipo que no se construye en ningún otro lugar.',
    ],
  },
  {
    id: 'mit-icatech-2025',
    event: 'MIT',
    eventItalic: 'ICATECH',
    date: 'OCT 2025',
    location: 'Chihuahua, MX',
    team: 'Christian · Leo · Roy · Sergio',
    duration: '1 día',
    photos: [
      { src: imgs['../assets/hacks/mit-icatech/p4.jpg'], src8: imgs['../assets/hacks/mit-icatech/p4-8bit.png'] ?? null, caption: '', pos: 'center' },
      { src: imgs['../assets/hacks/mit-icatech/p2.jpg'], src8: imgs['../assets/hacks/mit-icatech/p2-8bit.png'] ?? null, caption: '', pos: 'center' },
      { src: imgs['../assets/hacks/mit-icatech/p3.jpg'], src8: imgs['../assets/hacks/mit-icatech/p3-8bit.png'] ?? null, caption: '', pos: 'center' },
      { src: imgs['../assets/hacks/mit-icatech/p1.jpg'], src8: imgs['../assets/hacks/mit-icatech/p1-8bit.png'] ?? null, caption: '', pos: 'center' },
    ],
    story: [
      'Tan solo pasó una semana del hackathon anterior y ya nos metíamos al del MIT. Iba emocionado porque habría mentores de esa universidad. No teníamos del todo claro qué era porque lo anunciaban como workshop, pero fuimos igual. Llegamos y estuvo raro. Éramos el equipo: yo, Saúl, Kikin, Leo y Mayrim que llegó tarde. Nos dijeron que era networking, que platicáramos nuestras ideas, anotáramos tracks que les gustarían y conociéramos gente. Terminamos en mesas diferentes. Leo y yo quedamos en la de seguridad.',
      'Teníamos la idea de hacer una app para personas que sufren secuestros, agresiones o cualquier tipo de ataque que mandara sus datos, detectara qué pasó y alertara a un familiar. Al pasar a la ejecución la idea rebotó y se convirtió en un botón SOS que al presionarlo manda tu situación, ubicación y más datos a los familiares que configuras. La comunidad podría colaborar en la búsqueda y la información llegaría también a las autoridades. El equipo fue yo, Leo, Roy y Sergio. Yo desarrollé la web app con React, la primera vez que de verdad lo maticé. Conocí a Das y Duke como mentores, nos ayudaron a rebotar la idea y la presentación salió bien.',
      'El único problema fue que justo una empresa conocida en LATAM había implementado algo así y quedó como eso ya existe. El producto estuvo bien pero aprendí que antes de crear algo hay que investigar, aprovechar donde la competencia no está atacando y tener ese diferenciador real para no pasar por algo así de nuevo.',
    ],
  },
  {
    id: 'viaje-mty-2025',
    event: 'El viaje a',
    eventItalic: 'Monterrey',
    date: 'NOV 2025',
    location: 'Monterrey, MX',
    team: 'Christian · Mayrim · Leo · Juan · Kikin · Saúl + 4 más',
    duration: '1 semana',
    travel: true,
    intro: [
      'Agarramos maletas y nos fuimos a Monterrey para una semana que juntó el hackathon de Ethereum más grande de Latinoamérica y la Tech Week MTY. Todo de corrido, diez personas de Chihuahua en un Airbnb, sin tiempo de procesar una cosa antes de que empezara la siguiente.',
    ],
    chapters: [
      {
        title: 'ETH',
        titleItalic: 'Mexico',
        photos: [
          { src: imgs['../assets/hacks/ethereum/p4.jpg'], src8: imgs['../assets/hacks/ethereum/p4-8bit.png'] ?? null, caption: '', pos: 'center' },
          { src: imgs['../assets/hacks/ethereum/p1.jpg'], src8: imgs['../assets/hacks/ethereum/p1-8bit.png'] ?? null, caption: '', pos: 'center' },
          { src: imgs['../assets/hacks/ethereum/p3.jpg'], src8: imgs['../assets/hacks/ethereum/p3-8bit.png'] ?? null, caption: '', pos: 'center' },
          { src: imgs['../assets/hacks/ethereum/p2.jpg'], src8: imgs['../assets/hacks/ethereum/p2-8bit.png'] ?? null, caption: '', pos: 'center 35%' },
        ],
        story: [
          'Un fin de semana después del último hackathon nos fuimos a Monterrey al Ethereum México MTY. Éramos tres equipos de Chihuahua: Kikin y Saúl con alguien más que no recuerdo, Kira, Ramón, Cinesolo y Fora, y nosotros: yo, Mayrim, Leo y Juan. Ellos ya sabían lo que era la blockchain. Nosotros llegamos sin saber casi nada y lo aprendimos todo durante el hackathon.',
          'Hubo estrés de mi parte. Aprendí demasiadas cosas, aprendí a trabajar bajo esa presión y a llevar el liderazgo con el equipo. Trabajar con Juan fue muy padre, era la primera vez que lo hacíamos en un hackathon y nos fue bien, nos divertimos.',
          'Presentamos. No ganamos porque el pitch no fue lo mejor, pero no pasa nada. Aprendí mucho y todo lo de Arbitrum y demás fue una experiencia muy buena.',
        ],
      },
      {
        title: 'Tech Week',
        titleItalic: 'MTY',
        photos: [
          { src: imgs['../assets/hacks/twmty/p4.jpg'], src8: imgs['../assets/hacks/twmty/p4-8bit.png'] ?? null, caption: '', pos: 'center' },
          { src: imgs['../assets/hacks/twmty/p2.jpg'], src8: imgs['../assets/hacks/twmty/p2-8bit.png'] ?? null, caption: '', pos: 'center' },
          { src: imgs['../assets/hacks/twmty/p3.jpg'], src8: imgs['../assets/hacks/twmty/p3-8bit.png'] ?? null, caption: '', pos: 'center' },
          { src: imgs['../assets/hacks/twmty/p1.jpg'], src8: imgs['../assets/hacks/twmty/p1-8bit.png'] ?? null, caption: '', pos: 'center' },
        ],
        story: [
          'Aprovechamos el viaje para ir a la Tech Week MTY y ver sus eventos, hacer contactos y networkear. Conocí a Andrés Guzmán, CEO de Startup Chihuahua, platicamos y la pasamos muy bien. Fuimos a la apertura, nos juntamos con más gente de Chihuahua que andaba por allá. Fuimos a un evento de Ethereum para networking y al Connecting Valleys donde conocimos a los de Machaca Valley de Chihuahua. Conocimos Monterrey y los tacos de CDMX.',
          'Una experiencia muy padre porque éramos los diez que mencioné y estábamos en un Airbnb, todo muy bien.',
        ],
      },
    ],
  },
  {
    id: 'aim',
    event: 'AIM',
    eventItalic: 'Chihuahua',
    date: 'DIC 2025',
    location: 'Chihuahua, MX',
    team: 'Christian',
    duration: '1 día',
    photos: photosFor('aim'),
    story: [
      'Como último evento del año me invitaron al AIM Chihuahua 2025. Hubo pláticas interesantes con gente de Google, OpenAI y Desec.',
      'Cerró con un demo night donde hubo networking y se sacaron contactos. Una experiencia muy padre.',
    ],
  },
  {
    id: 'hack-latam-2026',
    event: 'hack@',
    eventItalic: 'latam',
    date: 'ENE 2026',
    location: 'Chile (remoto)',
    team: 'Christian',
    duration: '72 horas',
    photos: [
      { src: imgs['../assets/hacks/hack@latam/p4.jpg'], src8: imgs['../assets/hacks/hack@latam/p4-8bit.png'] ?? null, caption: '', pos: 'center' },
      { src: imgs['../assets/hacks/hack@latam/p2.jpg'], src8: imgs['../assets/hacks/hack@latam/p2-8bit.png'] ?? null, caption: '', pos: 'center' },
      { src: imgs['../assets/hacks/hack@latam/p3.jpg'], src8: imgs['../assets/hacks/hack@latam/p3-8bit.png'] ?? null, caption: '', pos: 'center' },
      { src: imgs['../assets/hacks/hack@latam/p5.jpg'], src8: imgs['../assets/hacks/hack@latam/p5-8bit.png'] ?? null, caption: '', pos: 'center' },
    ],
    story: [
      'Mi primer hackathon fuera de México, formato digital desde Chile, sí Chile jaja. Nos invitaron por parte de Escuelita Maker que fue sede aquí en Chihuahua pero lo tomé en línea. Como ya tenía el conocimiento y había probado cosas de diseño, participé de manera individual.',
      'En ese fin de semana creé lo que hasta esa fecha era mi mejor proyecto de hackathon: HAVEN, una plataforma donde la comunidad puede reportar estafas, phishing, detectar IA y demás. Me sentí muy bien con el resultado y el diseño de la web, la publiqué y me gustó.',
      'No gané pero la experiencia estuvo padre. Aprendí cosas nuevas que tenía tiempo queriendo aprender, las puse en ejecución ese fin de semana y quedé muy contento con el resultado.',
    ],
  },
  {
    id: 'innovathon-2026',
    event: 'INNOVATHON',
    eventItalic: '',
    date: '2026',
    location: 'Chihuahua, MX',
    team: 'Christian · Juan · Ramón (co-org)',
    duration: '24 horas',
    photos: photosFor('innovathon', [], ['center top', 'center', 'center']),
    story: [
      'Aquí no participé, fui coorganizador de parte de Innova junto a Juan y Ramón. Un hackathon sobre implementación de inteligencia artificial, no como un extra sino para construir con ella. Más de 100 participantes, 24 equipos en total y proyectos muy interesantes.',
      'Fue padre estar desde el otro lado coordinando todo junto con el equipo y dar esa misma sensación que yo sentí en mi primer hackathon. Incluso algunos concursantes nos dijeron que estuvo muy padre. Los sponsors que conseguí como Faces, n8n, AWS y Startup Chihuahua se sumaron al proyecto y muy agradecido por eso.',
      'Una experiencia de nervios, presión de que todo saliera bien y diversión.',
    ],
  },
  {
    id: 'realtime-hackaton-2026',
    event: 'The Realtime',
    eventItalic: 'Hackathon',
    date: '2026',
    location: 'Perú (remoto)',
    team: 'Christian',
    duration: '48 horas',
    photos: photosFor('therealtimehack'),
    story: [
      'Después del hack@latam me sentí cómodo participando solo y esta vez hice un proyecto aún más ambicioso, uno que tenía en mente desde antes y al que por fin pude darle forma. Hackathon de Perú, formato digital.',
      'Me di cuenta de que por más que estudies problemas de programación, en una entrevista siempre hay alguien buscando tenerte con presión, nervios, incluso generando miedo. Por eso hice un simulador de entrevistas técnicas donde puedes practicar en tiempo real esas situaciones, recibir feedback al momento de cómo te fue y qué pudiste mejorar, y repetir la entrevista para cuando llegue la real.',
      'Me quedé dormido para la entrega por la diferencia de horas jajaj, pero aun así terminé el proyecto y lo publiqué. Lo compartí, tuvo buen recibimiento e incluso algunas personas preguntaron si podría agregarle cosas y así.',
    ],
  },
];
