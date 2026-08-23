// Fotos procesadas por carpeta: pN.jpg (web) + pN-8bit.png (versión pixel).
// Se generan con el script pixelize (dither Bayer + paleta morada).
const imgs = import.meta.glob('../assets/hacks/*/p*.{jpg,png}', {
  eager: true,
  import: 'default',
});

const photosFor = (folder, captions = [], positions = []) => {
  const out = [];
  for (let i = 1; ; i++) {
    const src = imgs[`../assets/hacks/${folder}/p${i}.jpg`];
    if (!src) break;
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
      'El primer hackathon. Recién había conocido lo que era Cursor — no había pasado ni una semana de eso. Tenía un portfolio que define la palabra "VibeCoded", pero aun así me aventé a un hackathon de AWS. ¿Qué m*** es eso? dije. Investigando descubrí que era tecnología de cómputo en la nube, y nos lanzamos a ver qué salía, yo y Kikin.',
      'Llegamos y dieron un workshop. No entendimos nada. Luego explicaron el reto: "optimiza de mejor manera las peticiones a la empresa Softii utilizando la tecnología de AWS". Cinco millones de registros. Empezamos investigando por dónde podíamos — chat, Google, ¿qué es una Lambda? — estrés y confusión.',
      'Las cosas se calmaron cuando descubrimos que Cursor lo podía hacer. Empezamos a promptear como nunca, literalmente diciéndole "¡HAZLO! ¡RÁPIDO!" y trabajando en equipo en sintonía logramos que corriera los 5 millones de registros en 20 segundos. Nos relajamos por fin y fuimos a hacer networking con los otros builders.',
      'Volvimos y quisimos hacer otra prueba de cómo íbamos. No había nada. Alguien había entrado y cambiado el código. Buscamos solucionarlo, nos enojamos, nos frustramos, lo intentamos hasta el último minuto con ayuda de otros amigos. No conseguimos un código que funcionara igual — era funcional, pero lento. Entregamos así.',
      'Terminó el hackathon y no me podía quedar con ese mal sabor de boca. Llegué a mi casa y el hackathon siguió hasta las 2am. Logré que los 5 millones de registros se hicieran en 6.7 segundos. Fue una experiencia buena, conocimos nuevas personas, la pasamos bien — y fue el primer encuentro con el ecosistema tecnológico.',
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
      'De parte de Innova nos invitaron al cierre de la Tech Week — una noche de networking, música en vivo y conversaciones con builders de toda la ciudad. No sabía exactamente qué esperar, pero fue la primera entrada real al ecosistema tecnológico de Chihuahua como tal.',
      'Tuve la oportunidad de hablar con gente que llevaba años construyendo cosas aquí — proyectos, startups, comunidades. Me di cuenta de que todo esto ya estaba pasando y yo simplemente no lo conocía. Nuevos amigos, contactos, y una pregunta que no me pude quitar de la cabeza: ¿cómo ayudo a que más personas sepan que esto existe?',
    ],
  },
  {
    id: 'nasa-2025',
    event: 'NASA Space Apps',
    eventItalic: 'Challenge',
    date: 'OCT 2025',
    location: 'Chihuahua, MX',
    team: 'TBD',
    duration: '48 horas',
    photos: photosFor('nasa'),
    story: [
      'Párrafo 1 aquí — voy a escribirlo después.',
      'Párrafo 2 aquí.',
    ],
  },
  {
    id: 'viaje-mty-2025',
    event: 'El viaje a',
    eventItalic: 'Monterrey',
    date: 'NOV 2025',
    location: 'Monterrey, MX',
    team: '5 personas',
    duration: '1 semana',
    travel: true,
    // Un solo viaje, dos eventos: se narra como capítulos.
    intro: [
      'Un solo viaje, dos eventos. Agarré maleta y me fui a Monterrey para una semana que juntó Tech Week y el hackathon de Ethereum más grande de Latinoamérica — todo de corrido, sin tiempo de procesar una cosa antes de que empezara la siguiente.',
    ],
    chapters: [
      {
        title: 'Tech Week',
        titleItalic: 'MTY',
        photos: photosFor('twmty'),
        story: [
          'Párrafo placeholder — cómo empezó el viaje y qué pasó en Tech Week.',
        ],
      },
      {
        title: 'ETH',
        titleItalic: 'Mexico',
        photos: photosFor('ethereum'),
        story: [
          'El hackathon más grande de Ethereum en Latinoamérica. Mucho café, poca dormida, y un equipo que se acababa de conocer pero que terminó funcionando como si llevara años junto.',
          'El ambiente fue otra cosa: builders de todos lados, charlas de gente del ecosistema, todos quemados pero felices, y esa sensación rara de estar exactamente donde tenías que estar.',
          'Salí cansado, con frío, sin batería en el celular, pero con la cabeza llena de ideas que todavía hoy estoy procesando.',
        ],
      },
    ],
  },
  {
    id: 'mit-icatech-2025',
    event: 'MIT',
    eventItalic: 'ICATECH',
    date: '2025',
    location: 'México',
    team: 'TBD',
    duration: '48 horas',
    photos: photosFor('mit-icatech'),
    story: [
      'Párrafo placeholder.',
    ],
  },
  {
    id: 'hack-latam-2026',
    event: 'hack@',
    eventItalic: 'latam',
    date: '2026',
    location: 'LATAM',
    team: 'TBD',
    duration: '48 horas',
    photos: photosFor('hack@latam'),
    story: [
      'Párrafo placeholder.',
    ],
  },
  {
    id: 'aim',
    event: 'AIM',
    eventItalic: '',
    date: 'TBD',
    location: 'TBD',
    team: 'TBD',
    duration: 'TBD',
    photos: photosFor('aim'),
    story: [
      'Párrafo placeholder.',
    ],
  },
];
