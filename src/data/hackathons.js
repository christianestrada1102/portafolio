import ethPix from '../assets/hacks/et.png';
import ethReal from '../assets/hacks/ethereum.jpeg';

export const hackathons = [
  {
    id: 'nasa-2025',
    event: 'NASA Space Apps',
    eventItalic: 'Challenge',
    date: 'OCT 2025',
    location: 'Chihuahua, MX',
    team: 'TBD',
    duration: '48 horas',
    photos: [
      { src: null, caption: 'el equipo, día 1' },
      { src: null, caption: 'durante el evento' },
      { src: null, caption: 'demo final' },
    ],
    story: [
      'Párrafo 1 aquí — voy a escribirlo después.',
      'Párrafo 2 aquí.',
    ],
  },
  {
    id: 'eth-mty-2025',
    event: 'ETH Mexico',
    eventItalic: 'MTY',
    date: 'NOV 2025',
    location: 'Monterrey, MX',
    team: '5 personas',
    duration: '48 horas',
    photos: [
      { src8: ethPix, src: ethReal, caption: 'el equipo — hover para revelar' },
    ],
    story: [
      'El hackathon más grande de Ethereum en Latinoamérica. Mucho café, poca dormida, y un equipo que se acababa de conocer pero que terminó funcionando como si llevara años junto.',
      'El ambiente fue otra cosa: builders de todos lados, charlas de gente del ecosistema, todos quemados pero felices, y esa sensación rara de estar exactamente donde tenías que estar.',
      'Salí cansado, con frío, sin batería en el celular, pero con la cabeza llena de ideas que todavía hoy estoy procesando.',
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
    photos: [
      { src: null, caption: '' },
      { src: null, caption: '' },
    ],
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
    photos: [
      { src: null, caption: '' },
    ],
    story: [
      'Párrafo placeholder.',
    ],
  },
];
