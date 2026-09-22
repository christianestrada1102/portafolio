import settArbImg from '../assets/SettArb.webp';
import astroImg from '../assets/Astro.webp';
import safeZoneImg from '../assets/safezone2.webp';
import havenImg from '../assets/haven-lat.webp';
import innovathonImg from '../assets/innovathon.png';
import lavanderiaImg from '../assets/lavanderia.png';
import cotiestimaImg from '../assets/cotistima.png';

const poisedVideo = null; // video too large for git — host on Cloudinary to enable
import cotiestimaVideo from '../assets/Videos/cotiestima-demo.mp4';
import innovathonVideo from '../assets/Videos/innovathon-demo.mp4';
import havenVideo from '../assets/Videos/haven-demo.mp4';
import laundryVideo from '../assets/Videos/laundry-demo.mp4';
import yuyinVideo from '../assets/Videos/yuyin-demo.mp4';
import settarbVideo from '../assets/Videos/settarb-demo.mp4';
import safezoneVideo from '../assets/Videos/safezone-demo.mp4';

export const PROJECTS = [
  {
    num: '01',
    name: 'Poised',
    url: 'https://poised.codebynas.dev/',
    github: 'https://github.com/christianestrada1102/The-Realtime_Hack',
    videoSrc: poisedVideo,
    image: null,
    descriptionKey: 'projects.desc.poised',
    stack: ['Next.js', 'TypeScript', 'Portal SDK', 'Claude Haiku', 'Whisper', 'ElevenLabs', 'Neon', 'Drizzle'],
    badgeKey: 'projects.badge.poised',
    status: 'done',
  },
  {
    num: '02',
    name: 'CotiEstima',
    url: 'https://cotiestima.xyz',
    github: null,
    videoSrc: cotiestimaVideo,
    image: cotiestimaImg,
    descriptionKey: 'projects.desc.cotiestima',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Prisma', 'Claude AI', 'Stripe', 'Make.com'],
    badgeKey: 'projects.badge.cotiestima',
    status: 'done',
  },
  {
    num: '03',
    name: 'INNOVATHON 2026',
    url: 'https://innovathon.innovacuu.xyz',
    github: null,
    videoSrc: innovathonVideo,
    image: innovathonImg,
    descriptionKey: 'projects.desc.innovathon',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'GSAP', 'Three.js', 'Supabase', 'Lenis'],
    badgeKey: 'projects.badge.innovathon',
    status: 'done',
  },
  {
    num: '04',
    name: 'HAVEN',
    url: 'https://haven-lat.codebynas.dev',
    github: 'https://github.com/christianestrada1102/Hack_Latam',
    videoSrc: havenVideo,
    image: havenImg,
    descriptionKey: 'projects.desc.haven',
    stack: ['FastAPI', 'Next.js', 'PostgreSQL', 'pgvector', 'Mistral AI', 'Claude AI', 'Whisper', 'VirusTotal', 'Railway'],
    badgeKey: 'projects.badge.haven',
    status: 'done',
  },
  {
    num: '05',
    name: 'Plataforma de Gestión',
    url: null,
    github: null,
    videoSrc: laundryVideo,
    image: lavanderiaImg,
    descriptionKey: 'projects.desc.fullstack',
    stack: ['React 18', 'Vite', 'Tailwind', 'DaisyUI', 'GSAP', 'React Router', 'Cloudinary'],
    badgeKey: 'projects.badge.fullstack',
    status: 'private',
  },
  {
    num: '06',
    name: 'Yuyin',
    url: 'https://github.com/christianestrada1102/SpaceYuyin',
    github: 'https://github.com/christianestrada1102/SpaceYuyin',
    videoSrc: yuyinVideo,
    image: astroImg,
    descriptionKey: 'projects.desc.astro',
    stack: ['Unity', 'C#'],
    badgeKey: 'projects.badge.astro',
    status: 'done',
  },
  {
    num: '07',
    name: 'SettArb',
    url: 'https://settarb.codebynas.dev',
    github: 'https://github.com/christianestrada1102/EthMexico',
    videoSrc: settarbVideo,
    image: settArbImg,
    descriptionKey: 'projects.desc.settarb',
    stack: ['Solidity', 'Hardhat', 'Next.js', 'TypeScript', 'ethers.js', 'Arbitrum'],
    badgeKey: 'projects.badge.settarb',
    status: 'done',
  },
  {
    num: '08',
    name: 'SafeZone',
    url: 'https://safezone.codebynas.dev',
    github: 'https://github.com/christianestrada1102/SafeZone.git',
    videoSrc: safezoneVideo,
    image: safeZoneImg,
    descriptionKey: 'projects.desc.safezone',
    stack: ['React Native', 'Expo', 'Django', 'PostgreSQL', 'Google Maps API', 'GSAP'],
    badgeKey: 'projects.badge.safezone',
    status: 'done',
  },
];
