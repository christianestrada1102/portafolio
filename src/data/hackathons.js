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
    event_en: 'First hack',
    eventItalic: 'AWS',
    date: '2025',
    location: 'Chihuahua, MX',
    team: 'Christian · Kikin',
    duration: '1 día',
    duration_en: '1 day',
    photos: photosFor('primer-hack-aws'),
    story: [
      'El primer hackathon. Recién había conocido lo que era Cursor, no había pasado ni una semana. Tenía un portfolio que define la palabra "VibeCoded", pero aun así me aventé a un hackathon de AWS. ¿Qué m*** es eso? dije. Investigando descubrí que era tecnología de cómputo en la nube y nos lanzamos a ver qué salía, yo y Kikin. Llegamos, dieron un workshop. No entendimos nada. Luego explicaron el reto: optimiza las peticiones a la empresa Softii usando AWS, cinco millones de registros. Empezamos investigando en el chat, en Google, ¿qué es una Lambda? Puro estrés y confusión.',
      'Las cosas se calmaron cuando descubrimos que Cursor lo podía hacer. Empezamos a promptear como nunca, literalmente diciéndole "¡HAZLO! ¡RÁPIDO!" y trabajando en equipo logramos que corriera los 5 millones de registros en 20 segundos. Nos relajamos por fin, fuimos a hacer networking con los otros builders. Cuando volvimos no había nada. Alguien había entrado y cambiado el código. Lo intentamos hasta el último minuto con ayuda de otros amigos. No conseguimos que funcionara igual, era funcional pero lento. Entregamos así.',
      'Terminó el hackathon y no me podía quedar con ese mal sabor de boca. Llegué a mi casa y el hackathon siguió hasta las 2am. Logré que los 5 millones de registros se procesaran en 6.7 segundos. Conocimos personas nuevas, la pasamos bien, y fue el primer encuentro real con el ecosistema.',
    ],
    story_en: [
      'The first hackathon. I had just discovered what Cursor was — not even a week had passed. My portfolio could be defined by the word "VibeCoded", but I still jumped into an AWS hackathon. What the h*** is that? I said. After some research I found out it was cloud computing technology, and Kikin and I dove in to see what would come out. We arrived, they gave a workshop. We understood nothing. Then they explained the challenge: optimize requests to the company Softii using AWS, five million records. We started researching on chat, on Google — what is a Lambda? Pure stress and confusion.',
      'Things calmed down when we discovered Cursor could do it. We started prompting like never before, literally yelling "DO IT! FAST!" and working as a team we got it to process 5 million records in 20 seconds. We finally relaxed and went to network with the other builders. When we came back, everything was gone. Someone had come in and changed the code. We tried until the last minute with help from other friends. We couldn\'t get it to work the same way — it was functional but slow. We submitted it like that.',
      'The hackathon ended and I couldn\'t live with that bitter feeling. I got home and kept going until 2am. I managed to get the 5 million records processed in 6.7 seconds. We met new people, had a great time, and it was the first real encounter with the ecosystem.',
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
    duration_en: 'One night',
    photos: photosFor('twcuu', [], ['center 70%']),
    story: [
      'De parte de Innova nos invitaron al cierre de la Tech Week: una noche de networking, música en vivo y conversaciones con builders de toda la ciudad. No sabía qué esperar pero fue la primera entrada real al ecosistema tecnológico de Chihuahua.',
      'Pude hablar con gente que llevaba años construyendo cosas aquí, proyectos, startups, comunidades. Me di cuenta de que todo esto ya estaba pasando y yo simplemente no lo conocía. Salí con amigos nuevos, contactos y una pregunta que no me pude quitar de la cabeza: ¿cómo ayudo a que más personas sepan que esto existe?',
    ],
    story_en: [
      'INNOVA invited us to the Tech Week closing event: a night of networking, live music, and conversations with builders from across the city. I didn\'t know what to expect, but it turned out to be the first real entry into Chihuahua\'s tech ecosystem.',
      'I got to talk with people who had been building things here for years — projects, startups, communities. I realized all of this was already happening and I simply didn\'t know about it. I left with new friends, new contacts, and a question I couldn\'t get out of my head: how do I help more people know this exists?',
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
    duration_en: '48 hours',
    photos: [
      { src: imgs['../assets/hacks/nasa/p1.jpg'], src8: imgs['../assets/hacks/nasa/p1-8bit.png'] ?? null, caption: 'Arranca el hackathon', caption_en: 'Hackathon starts', pos: 'center' },
      { src: imgs['../assets/hacks/nasa/p3.jpg'], src8: imgs['../assets/hacks/nasa/p3-8bit.png'] ?? null, caption: 'Saúl, Fer y yo en los minijuegos. Mayrim en diseño, Kikin en guion', caption_en: 'Saúl, Fer and I on the minigames. Mayrim on design, Kikin on the script', pos: 'center' },
      { src: imgs['../assets/hacks/nasa/p4.jpg'], src8: imgs['../assets/hacks/nasa/p4-8bit.png'] ?? null, caption: 'Noche de trabajo', caption_en: 'Working through the night', pos: 'center' },
      { src: imgs['../assets/hacks/nasa/p5.jpg'], src8: imgs['../assets/hacks/nasa/p5-8bit.png'] ?? null, caption: 'Presentación del proyecto', caption_en: 'Project presentation', pos: 'center 35%' },
      { src: imgs['../assets/hacks/nasa/p6.jpg'], src8: imgs['../assets/hacks/nasa/p6-8bit.png'] ?? null, caption: 'Los Yuyines', caption_en: 'Los Yuyines', pos: 'center' },
      { src: imgs['../assets/hacks/nasa/p7.jpg'], src8: imgs['../assets/hacks/nasa/p7-8bit.png'] ?? null, caption: 'Foto grupal del NASA Space Apps Chihuahua', caption_en: 'NASA Space Apps Chihuahua group photo', pos: 'center' },
    ],
    coda: [
      'Éramos seis y la química que se formó en esas 48 horas fue lo mejor del hackathon. Fer, Saúl, Kikin, Mayrim, Leo y yo, cada quien con su parte, todos con las mismas ganas. El proyecto no se calificó como queríamos pero lo terminamos después, lo subimos y quedó. Yuyin existe. Eso no se pierde.',
    ],
    coda_en: [
      'We were six and the chemistry that formed in those 48 hours was the best part of the hackathon. Fer, Saúl, Kikin, Mayrim, Leo and I — everyone with their piece, all with the same drive. The project didn\'t score the way we wanted, but we finished it afterwards, uploaded it, and it\'s out there. Yuyin exists. That doesn\'t go away.',
    ],
    story: [
      '48 horas para construir una experiencia que enseñara a niños sobre el espacio. Después de una lluvia de ideas nos decidimos por hacer un videojuego, sin idea de lo que eso implicaba. En la semana previa aprendimos a desarrollar rebotando entre plataformas: primero una web, pero no sabíamos nada de JS ni TypeScript. Probamos Unity, no entendíamos nada. Godot, lo mismo pero más limitado. Hasta pensamos en Roblox con Lua. Al final me puse a aprender Unity solo, me robé sprites de internet y armé la primera demo de Yuyin: un minijuego de plataformas donde el objetivo era recolectar energía para la nave. Kikin y Mayrim investigaron Fungus para construir una novela visual interactiva como capa de aprendizaje. Llegamos al hackathon con todo preparado. Nos dieron merch. La emoción estaba.',
      'Nos organizamos: Fer, Saúl y yo haríamos tres minijuegos; Kikin y Mayrim la historia y la novela visual; Leo el pitch y cómo vender el producto. Trabajamos hasta tener algo funcional el primer día. A la noche había bugs y estrés, salimos a unas actividades para desestresarnos, volvimos y seguimos. Yo no dormí nada en todo el hackathon, si mucho dos horas. La mañana del segundo día Fer estaba preocupado: se había corrompido su minijuego. Intentamos recuperarlo, no pudimos, empezó de cero. Llegaron los mentores y dijeron que nuestro producto era muy genérico. Nos valió. Seguimos. Cambiamos la historia, tuvimos una junta de medianoche para replantear la presentación y rehacimos todo.',
      'El juego estaba quedando muy bien y se rompió. Era la primera vez que usábamos GitHub Desktop y al juntar todas las partes se corrompió gran parte del proyecto. No pudimos subir la versión funcional a itch.io. Entregamos un proyecto vacío y presentamos lo que pudimos rescatar. Terminando el hack lo continuamos y lo terminamos porque aún se podía modificar. Pero no se calificó, ellos tenían la versión rota. Perdimos el primer hackathon y ganamos experiencia, trabajo bajo presión y una química de equipo que no se construye en ningún otro lugar.',
    ],
    story_en: [
      '48 hours to build an experience that would teach kids about space. After a brainstorming session we decided to make a video game — with no idea what that actually meant. In the week before, we learned by bouncing between platforms: first a web app, but we didn\'t know JS or TypeScript. We tried Unity — understood nothing. Godot, same but more limited. We even considered Roblox with Lua. In the end I started learning Unity on my own, grabbed sprites from the internet, and built the first Yuyin demo: a platformer where the goal was to collect energy for the spaceship. Kikin and Mayrim researched Fungus to build an interactive visual novel as a learning layer. We arrived at the hackathon fully prepared. They gave us merch. The excitement was real.',
      'We split the work: Fer, Saúl and I would build three minigames; Kikin and Mayrim the story and the visual novel; Leo the pitch and how to sell the product. We worked until we had something functional on day one. That night there were bugs and stress — we went out to some activities to decompress, came back and kept going. I didn\'t sleep at all during the hackathon, maybe two hours at most. On the morning of the second day Fer was worried: his minigame had gotten corrupted. We tried to recover it, couldn\'t, he started from scratch. Mentors came by and said our product was too generic. We didn\'t care. We kept going. We changed the story, had a midnight meeting to rethink the presentation, and rebuilt everything.',
      'The game was coming together nicely — and then it broke. It was our first time using GitHub Desktop and when we merged all the pieces, most of the project got corrupted. We couldn\'t upload the working version to itch.io. We submitted an empty project and presented whatever we could salvage. After the hack ended we continued and finished it because it could still be modified. But it wasn\'t graded — they had the broken version. We lost the first hackathon and gained experience, performance under pressure, and team chemistry that can\'t be built anywhere else.',
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
    duration_en: '1 day',
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
    story_en: [
      'Only a week had passed since the last hackathon and we were already jumping into the MIT one. I was excited because there would be mentors from that university. We weren\'t totally clear on what it was since it was announced as a workshop, but we went anyway. We arrived and it felt odd. The team was: me, Saúl, Kikin, Leo, and Mayrim who showed up late. They told us it was networking — share your ideas, jot down tracks you\'d like, meet people. We ended up at different tables. Leo and I landed at the security one.',
      'We had the idea of building an app for people experiencing kidnappings, assaults, or any kind of attack — something that would send their data, detect what happened, and alert a family member. As we moved to execution the idea evolved into an SOS button: press it and it sends your situation, location and more data to the contacts you set up. The community could help with the search, and the information would also reach authorities. The team was me, Leo, Roy, and Sergio. I built the web app in React — the first time I really felt I had mastered it. I met Das and Duke as mentors, they helped us refine the idea, and the presentation went well.',
      'The only problem was that a well-known LATAM company had already built something similar, so it came across as "that already exists." The product was solid but I learned that before building something you need to research, find where the competition isn\'t attacking, and have a real differentiator — so you don\'t go through that again.',
    ],
  },
  {
    id: 'viaje-mty-2025',
    event: 'El viaje a',
    event_en: 'The trip to',
    eventItalic: 'Monterrey',
    date: 'NOV 2025',
    location: 'Monterrey, MX',
    team: 'Christian · Mayrim · Leo · Juan · Kikin · Saúl + 4 más',
    team_en: 'Christian · Mayrim · Leo · Juan · Kikin · Saúl + 4 more',
    duration: '1 semana',
    duration_en: '1 week',
    travel: true,
    intro: [
      'Agarramos maletas y nos fuimos a Monterrey para una semana que juntó el hackathon de Ethereum más grande de Latinoamérica y la Tech Week MTY. Todo de corrido, diez personas de Chihuahua en un Airbnb, sin tiempo de procesar una cosa antes de que empezara la siguiente.',
    ],
    intro_en: [
      'We packed our bags and headed to Monterrey for a week that brought together the biggest Ethereum hackathon in Latin America and Tech Week MTY. Everything back to back — ten people from Chihuahua in one Airbnb, no time to process one thing before the next one started.',
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
        story_en: [
          'A weekend after the last hackathon we headed to Monterrey for Ethereum México MTY. There were three teams from Chihuahua: Kikin and Saúl with someone I don\'t remember, Kira, Ramón, Cinesolo and Fora, and us: me, Mayrim, Leo and Juan. They already knew what blockchain was. We arrived knowing almost nothing and learned everything during the hackathon.',
          'There was stress on my end. I learned a lot of things, learned to work under that pressure and to lead the team. Working with Juan was great — it was the first time we teamed up at a hackathon and it went well, we had fun.',
          'We presented. We didn\'t win because the pitch wasn\'t our best, but that\'s okay. I learned a lot and everything about Arbitrum and the rest was a really good experience.',
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
        story_en: [
          'We took advantage of the trip to attend Tech Week MTY — check out the events, make contacts, and network. I met Andrés Guzmán, CEO of Startup Chihuahua, we talked and had a great time. We went to the opening, connected with more Chihuahua people who were around. We went to an Ethereum networking event and to Connecting Valleys where we met the Machaca Valley crew from Chihuahua. We got to know Monterrey and the CDMX-style tacos.',
          'An awesome experience — we were the ten people I mentioned, all in one Airbnb, everything great.',
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
    duration_en: '1 day',
    photos: photosFor('aim'),
    story: [
      'Como último evento del año me invitaron al AIM Chihuahua 2025. Hubo pláticas interesantes con gente de Google, OpenAI y Desec.',
      'Cerró con un demo night donde hubo networking y se sacaron contactos. Una experiencia muy padre.',
    ],
    story_en: [
      'As the last event of the year I was invited to AIM Chihuahua 2025. There were interesting talks with people from Google, OpenAI and Desec.',
      'It closed with a demo night where we networked and exchanged contacts. A really great experience.',
    ],
  },
  {
    id: 'hack-latam-2026',
    event: 'hack@',
    eventItalic: 'latam',
    date: 'ENE 2026',
    location: 'Chile (remoto)',
    location_en: 'Chile (remote)',
    team: 'Christian',
    duration: '72 horas',
    duration_en: '72 hours',
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
    story_en: [
      'My first hackathon outside of Mexico — digital format from Chile, yes Chile lol. We were invited through Escuelita Maker which hosted locally here in Chihuahua, but I joined online. Since I already had the knowledge and had experimented with design, I participated individually.',
      'That weekend I built what was, at that point, my best hackathon project: HAVEN — a platform where the community can report scams, phishing, detect AI-generated content and more. I felt really good about the result and the web design, I published it and liked it.',
      "I didn't win but the experience was great. I learned new things I'd been wanting to learn for a while, put them into practice that weekend, and was very happy with the result.",
    ],
  },
  {
    id: 'innovathon-2026',
    event: 'INNOVATHON',
    eventItalic: '',
    date: '2026',
    location: 'Chihuahua, MX',
    team: 'Christian · Juan · Ramón (co-org)',
    team_en: 'Christian · Juan · Ramón (co-organizers)',
    duration: '24 horas',
    duration_en: '24 hours',
    photos: photosFor('innovathon', [], ['center top', 'center', 'center']),
    story: [
      'Aquí no participé, fui coorganizador de parte de Innova junto a Juan y Ramón. Un hackathon sobre implementación de inteligencia artificial, no como un extra sino para construir con ella. Más de 100 participantes, 24 equipos en total y proyectos muy interesantes.',
      'Fue padre estar desde el otro lado coordinando todo junto con el equipo y dar esa misma sensación que yo sentí en mi primer hackathon. Incluso algunos concursantes nos dijeron que estuvo muy padre. Los sponsors que conseguí como Faces, n8n, AWS y Startup Chihuahua se sumaron al proyecto y muy agradecido por eso.',
      'Una experiencia de nervios, presión de que todo saliera bien y diversión.',
    ],
    story_en: [
      "Here I didn't compete — I was a co-organizer on behalf of INNOVA alongside Juan and Ramón. A hackathon about implementing artificial intelligence, not as an add-on but as the core building tool. Over 100 participants, 24 teams total, and some really interesting projects.",
      'It was great to be on the other side, coordinating everything with the team and giving others the same feeling I had at my first hackathon. Even some competitors told us it was awesome. The sponsors I brought in — Faces, n8n, AWS, and Startup Chihuahua — joined the project and I\'m very grateful for that.',
      'An experience full of nerves, pressure to make everything go smoothly, and a lot of fun.',
    ],
  },
  {
    id: 'realtime-hackaton-2026',
    event: 'The Realtime',
    eventItalic: 'Hackathon',
    date: '2026',
    location: 'Perú (remoto)',
    location_en: 'Peru (remote)',
    team: 'Christian',
    duration: '48 horas',
    duration_en: '48 hours',
    photos: photosFor('therealtimehack'),
    story: [
      'Después del hack@latam me sentí cómodo participando solo y esta vez hice un proyecto aún más ambicioso, uno que tenía en mente desde antes y al que por fin pude darle forma. Hackathon de Perú, formato digital.',
      'Me di cuenta de que por más que estudies problemas de programación, en una entrevista siempre hay alguien buscando tenerte con presión, nervios, incluso generando miedo. Por eso hice un simulador de entrevistas técnicas donde puedes practicar en tiempo real esas situaciones, recibir feedback al momento de cómo te fue y qué pudiste mejorar, y repetir la entrevista para cuando llegue la real.',
      'Me quedé dormido para la entrega por la diferencia de horas jajaj, pero aun así terminé el proyecto y lo publiqué. Lo compartí, tuvo buen recibimiento e incluso algunas personas preguntaron si podría agregarle cosas y así.',
    ],
    story_en: [
      'After hack@latam I felt comfortable competing solo, and this time I built an even more ambitious project — one I had in mind for a while and finally got to shape. Peru hackathon, digital format.',
      'I realized that no matter how much you study programming problems, in an interview there\'s always someone trying to put pressure on you, make you nervous, even create fear. So I built a technical interview simulator where you can practice those situations in real time, receive instant feedback on how you did and what you could improve, and repeat the interview before the real one comes.',
      'I fell asleep before the submission deadline because of the time zone difference lol, but I still finished the project and published it. I shared it, it was well received, and some people even asked if I could add more features.',
    ],
  },
];
