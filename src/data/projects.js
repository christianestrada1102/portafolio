import settArbImg from '../assets/SettArb.webp';
import astroImg from '../assets/Astro.webp';
import safeZoneImg from '../assets/safezone2.webp';
import havenImg from '../assets/haven-lat.webp';
import innovathonImg from '../assets/innovathon.png';
import lavanderiaImg from '../assets/lavanderia.png';
import cotiestimaImg from '../assets/cotistima.png';

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
    name: 'CotiEstima',
    url: 'https://cotiestima.xyz',
    github: null,
    videoSrc: cotiestimaVideo,
    image: cotiestimaImg,
    descriptionKey: 'projects.desc.cotiestima',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Claude AI', 'Stripe'],
    badgeKey: 'projects.badge.cotiestima',
    status: 'done',
  },
  {
    num: '02',
    name: 'INNOVATHON 2026',
    url: 'https://innovathon.innovacuu.xyz',
    github: null,
    videoSrc: innovathonVideo,
    image: innovathonImg,
    descriptionKey: 'projects.desc.innovathon',
    stack: ['Next.js 15', 'GSAP', 'Lenis', 'Supabase'],
    badgeKey: 'projects.badge.innovathon',
    status: 'done',
  },
  {
    num: '03',
    name: 'HAVEN',
    url: 'https://haven-lat.codebynas.dev',
    github: 'https://github.com/christianestrada1102/Hack_Latam',
    videoSrc: havenVideo,
    image: havenImg,
    descriptionKey: 'projects.desc.haven',
    stack: ['FastAPI', 'React', 'Claude AI', 'Mistral', 'Railway'],
    badgeKey: 'projects.badge.haven',
    status: 'done',
  },
  {
    num: '04',
    name: 'Plataforma de Gestión',
    url: null,
    github: null,
    videoSrc: laundryVideo,
    image: lavanderiaImg,
    descriptionKey: 'projects.desc.fullstack',
    stack: ['React 18', 'Vite', 'DaisyUI', 'GSAP'],
    badgeKey: 'projects.badge.fullstack',
    status: 'private',
  },
  {
    num: '05',
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
    num: '06',
    name: 'SettArb',
    url: 'https://settarb.codebynas.dev',
    github: 'https://github.com/christianestrada1102/EthMexico',
    videoSrc: settarbVideo,
    image: settArbImg,
    descriptionKey: 'projects.desc.settarb',
    stack: ['Solidity', 'Next.js', 'Web3'],
    badgeKey: 'projects.badge.settarb',
    status: 'done',
  },
  {
    num: '07',
    name: 'SafeZone',
    url: null,
    github: 'https://github.com/christianestrada1102/SafeZone.git',
    videoSrc: safezoneVideo,
    image: safeZoneImg,
    descriptionKey: 'projects.desc.safezone',
    stack: ['React Native', 'Django', 'PostgreSQL'],
    badgeKey: 'projects.badge.safezone',
    status: 'wip',
  },
];
