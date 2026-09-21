import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {
  SiReact,
  SiNodedotjs,
  SiHtml5,
  SiCss3,
  SiFlutter,
  SiVite,
  SiJavascript,
  SiTypescript,
  SiGit,
  SiNextdotjs,
  SiTailwindcss,
  SiSupabase,
  SiFirebase,
  SiGithub,
} from 'react-icons/si';
import LogoLoop from '../components/LogoLoop';
import { useLanguage } from '../context/LanguageContext';
import { revealHeaders } from '../utils/sectionReveal';

gsap.registerPlugin(ScrollTrigger);

function CSharpIcon({ className }) {
  return (
    <svg className={className} viewBox="0 -1.43 255.58 290.11" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <mask id="csharp-cutout">
          <rect x="0" y="-1.43" width="255.58" height="290.11" fill="white"/>
          <path fill="black" d="M201.9 116.3v13.47h13.47v-13.48h6.73v13.48h13.48v6.73H222.1v13.48h13.48v6.74H222.1v13.47h-6.73V156.7h-13.48v13.48h-6.73V156.7h-13.48v-6.73h13.47V136.5h-13.47v-6.74h13.47v-13.48zm13.47 20.2h-13.48v13.48h13.48z"/>
          <path fill="black" d="M128.46 48.63a94.96 94.96 0 0 1 82.26 47.45l-.16-.27-41.35 23.8A47.28 47.28 0 0 0 129 96.33h-.54a47.3 47.3 0 0 0-47.3 47.3 47.08 47.08 0 0 0 6.23 23.47 47.28 47.28 0 0 0 82.29-.27l-.2.35 41.29 23.91a94.97 94.97 0 0 1-81.25 47.54h-1.06a94.96 94.96 0 0 1-95-95 95 95 0 0 1 95-95z"/>
        </mask>
      </defs>
      <g mask="url(#csharp-cutout)">
        <path fill="currentColor" d="M255.57 84.45c0-4.83-1.04-9.1-3.13-12.76a24.4 24.4 0 0 0-9.24-9C209.17 43.05 175.1 23.5 141.1 3.86c-9.17-5.3-18.06-5.1-27.16.27-13.54 7.98-81.35 46.83-101.55 58.53C4.06 67.5.02 74.87 0 84.44v118.37c0 4.72 1 8.9 2.99 12.51 2.05 3.72 5.17 6.82 9.38 9.26 20.21 11.7 88.02 50.55 101.56 58.53 9.11 5.38 18 5.57 27.17.27 34.02-19.64 68.08-39.2 102.1-58.81a24.33 24.33 0 0 0 9.4-9.25c1.99-3.61 2.98-7.8 2.98-12.52l-.01-118.35"/>
        <path fill="currentColor" opacity="0.55" d="M128.18 143.24 2.98 215.33c2.06 3.7 5.18 6.8 9.4 9.25 20.2 11.7 88.01 50.55 101.55 58.53 9.11 5.38 18 5.57 27.17.27 34.02-19.64 68.08-39.2 102.1-58.81a24.33 24.33 0 0 0 9.4-9.25z"/>
        <path fill="currentColor" opacity="0.7" d="M255.57 84.45c0-4.83-1.04-9.1-3.13-12.76l-124.26 71.55 124.41 72.07c2-3.6 2.99-7.79 3-12.51 0 0 0-78.9-.02-118.35"/>
      </g>
    </svg>
  );
}

const TECH_LOGOS = [
  { node: <SiJavascript />, title: 'JavaScript', ariaLabel: 'JavaScript' },
  { node: <SiTypescript />, title: 'TypeScript', ariaLabel: 'TypeScript' },
  { node: <SiHtml5 />,      title: 'HTML5',      ariaLabel: 'HTML5' },
  { node: <SiCss3 />,       title: 'CSS3',       ariaLabel: 'CSS3' },
  { node: <SiReact />,      title: 'React',      ariaLabel: 'React' },
  { node: <SiNextdotjs />,  title: 'Next.js',    ariaLabel: 'Next.js' },
  { node: <SiVite />,       title: 'Vite',       ariaLabel: 'Vite' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS', ariaLabel: 'Tailwind CSS' },
  { node: <SiNodedotjs />,  title: 'Node.js',    ariaLabel: 'Node.js' },
  { node: <SiFlutter />,    title: 'Flutter',    ariaLabel: 'Flutter' },
  { node: <CSharpIcon className="w-[1em] h-[1em]" />, title: 'C#', ariaLabel: 'C#' },
  { node: <SiSupabase />,   title: 'Supabase',   ariaLabel: 'Supabase' },
  { node: <SiFirebase />,   title: 'Firebase',   ariaLabel: 'Firebase' },
  { node: <SiGit />,        title: 'Git',        ariaLabel: 'Git' },
];

function CloudinaryIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 256 168" preserveAspectRatio="xMidYMid" aria-hidden="true">
      <path fill="currentColor" d="M75.06 75.202a.7.7 0 0 1 .498.208l23.56 23.581a.7.7 0 0 1-.488 1.188h-6.022c-.39 0-.71.31-.721.7v53.015a12.724 12.724 0 0 0 3.71 8.949l3.52 3.52a.7.7 0 0 1-.487 1.187H70.85c-7.027 0-12.723-5.696-12.723-12.723v-53.948a.7.7 0 0 0-.7-.7h-5.938a.7.7 0 0 1-.509-1.188l23.581-23.58a.7.7 0 0 1 .499-.21Zm52.103 13.656a.7.7 0 0 1 .498.209l23.581 23.496a.7.7 0 0 1-.509 1.188h-6.022c-.39.011-.7.33-.7.72v39.423a12.724 12.724 0 0 0 3.69 8.949l3.541 3.52a.7.7 0 0 1-.509 1.187h-27.716c-7.027 0-12.724-5.696-12.724-12.723v-40.313c0-.39-.31-.71-.7-.721h-6a.7.7 0 0 1-.488-1.188l23.56-23.538a.7.7 0 0 1 .498-.209Zm52.114 13.51c.183 0 .36.075.487.207l23.581 23.56a.7.7 0 0 1-.487 1.209h-6.044a.7.7 0 0 0-.7.7v25.85a12.724 12.724 0 0 0 3.711 8.949l3.52 3.52a.7.7 0 0 1-.487 1.187h-27.801c-7.027 0-12.724-5.696-12.724-12.723v-26.784a.7.7 0 0 0-.7-.7h-5.937a.7.7 0 0 1-.488-1.208l23.58-23.56a.679.679 0 0 1 .489-.207ZM126.686-.002c37.04.27 69.71 24.323 80.964 59.614C235.16 63.202 255.8 86.54 256 114.28c0 22.895-14.319 41.921-37.438 49.842l-.86.289-1.06.339v-17.092c14.695-6.192 23.326-18.428 23.326-33.378-.075-21.097-16.782-38.323-37.78-39.126l-.709-.02h-6.361l-1.527-6.066c-7.494-30.93-35.08-52.79-66.905-53.015-26.187-.125-50.1 14.755-61.576 38.23l-2.36 4.861-4.454.467c-20.112 2.151-36.627 16.862-41.08 36.593-4.39 19.449 3.898 39.527 20.646 50.231l.734.46v18.025h-.106l-1.59-.721C11.744 152.636-2.99 126.08.51 98.616 4.012 71.153 24.938 49.142 52.19 44.258 66.912 16.851 95.575-.177 126.686-.002Z"/>
    </svg>
  );
}

function FigmaIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 54 80" fill="none" aria-hidden="true">
      <path d="M13.3333 80.0002C20.6933 80.0002 26.6667 74.0268 26.6667 66.6668V53.3335H13.3333C5.97333 53.3335 0 59.3068 0 66.6668C0 74.0268 5.97333 80.0002 13.3333 80.0002Z" fill="currentColor" opacity=".7"/>
      <path d="M0 39.9998C0 32.6398 5.97333 26.6665 13.3333 26.6665H26.6667V53.3332H13.3333C5.97333 53.3332 0 47.3598 0 39.9998Z" fill="currentColor" opacity=".85"/>
      <path d="M0 13.3333C0 5.97333 5.97333 0 13.3333 0H26.6667V26.6667H13.3333C5.97333 26.6667 0 20.6933 0 13.3333Z" fill="currentColor"/>
      <path d="M26.6667 0H40.0001C47.3601 0 53.3334 5.97333 53.3334 13.3333C53.3334 20.6933 47.3601 26.6667 40.0001 26.6667H26.6667V0Z" fill="currentColor" opacity=".9"/>
      <path d="M53.3334 39.9998C53.3334 47.3598 47.3601 53.3332 40.0001 53.3332C32.6401 53.3332 26.6667 47.3598 26.6667 39.9998C26.6667 32.6398 32.6401 26.6665 40.0001 26.6665C47.3601 26.6665 53.3334 32.6398 53.3334 39.9998Z" fill="currentColor" opacity=".6"/>
    </svg>
  );
}

function ObsidianIcon({ className }) {
  return (
    <svg className={className} preserveAspectRatio="xMidYMid" viewBox="0 0 256 332" aria-hidden="true">
      <path fillOpacity=".6" fill="currentColor" d="M209.056 308.305c-2.043 14.93-16.738 26.638-31.432 22.552-20.823-5.658-44.946-14.616-66.634-16.266l-33.317-2.515a22.002 22.002 0 0 1-14.144-6.522L6.167 246.778a21.766 21.766 0 0 1-4.244-24.124s35.36-77.478 36.775-81.485c1.257-4.008 6.13-39.211 8.958-58.07a22.002 22.002 0 0 1 7.072-12.965L122.462 9.47a22.002 22.002 0 0 1 31.903 2.672l57.048 71.978a23.18 23.18 0 0 1 4.872 14.38c0 13.594 1.179 41.646 8.8 59.72a236.756 236.756 0 0 0 27.974 45.732 11.001 11.001 0 0 1 .786 12.258c-4.95 8.408-14.851 24.595-28.76 45.26a111.738 111.738 0 0 0-16.108 46.834h.079Z"/>
      <path fill="currentColor" d="M209.606 305.79c-2.043 15.009-16.737 26.717-31.432 22.71-20.744-5.737-44.79-14.695-66.555-16.345L78.38 309.64a21.923 21.923 0 0 1-14.144-6.6L6.874 244.106a21.923 21.923 0 0 1-4.243-24.36s35.438-77.792 36.774-81.878c1.336-4.007 6.13-39.289 8.958-58.305a22.002 22.002 0 0 1 7.072-13.044L123.17 5.621a22.002 22.002 0 0 1 31.902 2.75l56.97 72.292a23.338 23.338 0 0 1 4.871 14.38c0 13.673 1.18 41.804 8.723 59.955a238.092 238.092 0 0 0 27.974 45.969 11.001 11.001 0 0 1 .864 12.336c-5.03 8.487-14.851 24.674-28.838 45.497a112.603 112.603 0 0 0-16.03 46.99Z"/>
    </svg>
  );
}

function PostmanIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 256 256" preserveAspectRatio="xMidYMid" aria-hidden="true">
      <path d="M254.953 144.253c8.959-70.131-40.569-134.248-110.572-143.206C74.378-7.912 10.005 41.616 1.047 111.619c-8.959 70.003 40.569 134.248 110.572 143.334 70.131 8.959 134.248-40.569 143.334-110.7Z" fill="currentColor" opacity=".15"/>
      <path d="m174.2 82.184-54.007 54.007-15.229-15.23c53.11-53.11 58.358-48.503 69.236-38.777Z" fill="currentColor"/><path d="M120.193 137.47c-.384 0-.64-.128-.895-.384l-15.358-15.229a1.237 1.237 0 0 1 0-1.792c54.007-54.006 59.638-48.887 71.028-38.649.255.256.383.512.383.896s-.128.64-.383.896l-54.007 53.878c-.128.256-.512.384-.768.384Z" fill="currentColor"/><path d="m135.679 151.676-14.718-14.718 54.007-54.006c14.46 14.59-7.167 38.265-39.29 68.724Z" fill="currentColor"/><path d="M202.739 52.238c-8.191-7.935-21.373-7.679-29.307.64-7.935 8.318-7.679 21.372.64 29.306A20.678 20.678 0 0 0 199.155 85l-14.59-14.59 18.174-18.172Z" fill="currentColor"/><path d="m203.122 52.622-.255-.256-18.301 18.044 14.461 14.462c1.408-.896 2.816-1.92 3.967-3.072a20.51 20.51 0 0 0 .128-29.178Z" fill="currentColor"/><path d="M176.375 84.488a7.879 7.879 0 0 0-11.134 0l-48.247 48.247 8.063 8.063 51.062-44.792c3.328-2.816 3.584-7.807.768-11.134-.256-.128-.384-.256-.512-.384Z" fill="currentColor"/><path d="M80.009 187.637c-.512.256-.768.768-.64 1.28l2.175 9.214c.512 1.28-.256 2.816-1.663 3.2-1.024.384-2.176 0-2.816-.768l-14.077-13.95 45.943-45.943 15.87.256 10.75 10.75c-2.56 2.175-18.045 17.149-55.542 35.961Z" fill="currentColor"/><path d="m52.11 197.62 11.006-11.007 16.38 16.381-26.107-1.791c-1.151-.128-1.92-1.152-1.791-2.304 0-.512.128-1.024.512-1.28Z" fill="currentColor"/>
    </svg>
  );
}

function NotionIcon({ className }) {
  return (
    <svg className={className} preserveAspectRatio="xMidYMid" viewBox="0 0 256 268" aria-hidden="true">
      <path fill="currentColor" d="M16.092 11.538 164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188Z" opacity=".1"/>
      <path fill="currentColor" d="M164.09.608 16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608ZM69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095l-1.819.125Zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921ZM212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.044-4.68 1.55-11.439 8.826-11.965l38.426-2.585 52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404l35.84-2.087Z"/>
    </svg>
  );
}

function VisualStudioIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M17 16.47V7.39l-6 4.54M2.22 9.19a.86.86 0 0 1-.02-1.15l1.2-1.11c.2-.18.69-.26 1.05 0l3.42 2.61l7.93-7.25c.32-.32.87-.45 1.5-.12l4 1.91c.36.21.7.54.7 1.15v13.5c0 .4-.29.83-.6 1l-4.4 2.1c-.32.13-.92.01-1.13-.2l-8.02-7.3l-3.4 2.6c-.38.26-.85.19-1.05 0l-1.2-1.1c-.32-.33-.28-.87.05-1.2l3-2.7"/>
    </svg>
  );
}

function VSCodeIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M21.95 4.903a1 1 0 0 0-.06-.166a1.2 1.2 0 0 0-.31-.425a1.2 1.2 0 0 0-.29-.197l-4.118-1.994a1.27 1.27 0 0 0-.75-.103a1.26 1.26 0 0 0-.672.347L9.106 9.75L5.228 6.553l-.337-.281a.8.8 0 0 0-.413-.19q-.033-.006-.066-.007q-.029-.004-.059-.003q-.046 0-.09.003a.3.3 0 0 0-.079.013a.7.7 0 0 0-.156.046l-1.515.629a.87.87 0 0 0-.372.306a.85.85 0 0 0-.141.463v8.936c0 .163.05.325.14.463c.091.134.222.24.373.306l1.515.638a.85.85 0 0 0 .45.056a.85.85 0 0 0 .413-.19l.337-.294l3.878-3.198l6.644 7.386q.034.033.072.066q.004.005.01.006a1.25 1.25 0 0 0 1.34.172l4.119-1.994a1 1 0 0 0 .153-.088c.097-.065.187-.147.262-.231q.057-.07.103-.144c.125-.2.191-.431.191-.669V5.247q0-.175-.05-.344M4.5 14.874V9.126l2.584 2.876zm7.334-2.873L17 7.742v8.518z"/>
    </svg>
  );
}

function ClaudeIcon({ className }) {
  return (
    <svg className={className} preserveAspectRatio="xMidYMid" viewBox="0 0 256 257" aria-hidden="true">
      <path fill="currentColor" d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z"/>
    </svg>
  );
}

function OpenAIIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 611 611" fill="none" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M252.794 108.802C289.191 99.0484 326.265 110.305 351.148 135.135C385.113 126.072 422.85 134.862 449.492 161.505C476.136 188.149 484.925 225.888 475.862 259.85V259.854C500.696 284.735 511.95 321.81 502.198 358.207C492.447 394.602 464.161 421.084 430.215 430.217C421.083 464.162 394.603 492.448 358.206 502.199C321.812 511.951 284.734 500.693 259.852 475.864C225.887 484.927 188.15 476.137 161.507 449.495C134.864 422.851 126.073 385.111 135.136 351.149C110.304 326.266 99.0496 289.192 108.801 252.795C118.552 216.4 146.84 189.918 180.784 180.785C189.917 146.841 216.396 118.553 252.794 108.802ZM374.292 407.145C374.292 411.271 372.092 415.086 368.517 417.148L283.723 466.102C302.487 480.585 327.555 486.459 352.217 479.852C386.997 470.532 410.068 439.312 410.555 405.006V317.717C410.555 315.08 409.125 312.621 406.843 311.303L374.292 292.509V407.145ZM251.868 415.897C248.296 417.959 243.893 417.959 240.317 415.897L155.526 366.942C152.366 390.436 159.811 415.08 177.866 433.136H177.863C203.325 458.594 241.896 462.962 271.85 446.232L347.449 402.586C349.735 401.268 351.148 398.8 351.148 396.163V358.579L251.868 415.897ZM368.602 220.628C366.319 219.309 363.474 219.318 361.191 220.637L328.641 239.431L427.921 296.749C431.496 298.811 433.697 302.627 433.697 306.752V404.661C455.622 395.654 473.244 376.881 479.851 352.218C489.169 317.442 473.668 281.85 444.201 264.274L368.602 220.628ZM177.303 206.34C155.377 215.348 137.756 234.122 131.148 258.783C121.832 293.561 137.331 329.153 166.799 346.727L242.398 390.373C244.68 391.692 247.525 391.684 249.807 390.366L282.357 371.572L183.078 314.253C179.504 312.189 177.303 308.375 177.303 304.251V206.34ZM259.849 279.145V331.858L305.5 358.213L351.15 331.858V279.145L305.5 252.789L259.849 279.145ZM327.276 144.9C308.512 130.418 283.445 124.543 258.782 131.15C224.002 140.471 200.931 171.691 200.445 205.995V293.286C200.445 295.923 201.875 298.381 204.158 299.7L236.707 318.493V203.856C236.707 199.731 238.909 195.916 242.483 193.853L327.276 144.9ZM433.137 177.867C407.675 152.407 369.103 148.038 339.149 164.769L263.55 208.415C261.265 209.734 259.852 212.202 259.852 214.838V252.423L359.132 195.105C362.703 193.041 367.108 193.041 370.682 195.105L455.473 244.06C458.635 220.567 451.189 195.922 433.135 177.867H433.137Z" fill="currentColor"/>
    </svg>
  );
}

function OpenRouterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="currentColor" stroke="currentColor" aria-hidden="true">
      <g>
        <path d="M3 248.945C18 248.945 76 236 106 219C136 202 136 202 198 158C276.497 102.293 332 120.945 423 120.945" strokeWidth="90" fill="none"/>
        <path d="M511 121.5L357.25 210.268L357.25 32.7324L511 121.5Z"/>
        <path d="M0 249C15 249 73 261.945 103 278.945C133 295.945 133 295.945 195 339.945C273.497 395.652 329 377 420 377" strokeWidth="90" fill="none"/>
        <path d="M508 376.445L354.25 287.678L354.25 465.213L508 376.445Z"/>
      </g>
    </svg>
  );
}

function CursorIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d="M117.9 30.289L66.664.713a5.32 5.32 0 0 0-5.323 0L10.09 30.29a4.48 4.48 0 0 0-2.234 3.872v59.663c0 1.6.853 3.077 2.24 3.878l51.24 29.586a5.33 5.33 0 0 0 5.324 0l51.246-29.586a4.48 4.48 0 0 0 2.24-3.878V34.166a4.48 4.48 0 0 0-2.24-3.872zm-3.216 6.272l-49.47 85.681c-.337.576-1.217.341-1.217-.325V65.81a3.15 3.15 0 0 0-1.573-2.72l-48.59-28.055c-.571-.331-.336-1.216.33-1.216h98.94c1.409 0 2.284 1.525 1.58 2.741"/>
    </svg>
  );
}

const TOOLS = [
  { label: 'VS Code',       icon: <VSCodeIcon className="w-[1em] h-[1em]" /> },
  { label: 'Git',           icon: <SiGit /> },
  { label: 'GitHub',        icon: <SiGithub /> },
  { label: 'Figma',         icon: <FigmaIcon className="w-[1em] h-[1em]" /> },
  { label: 'Postman',       icon: <PostmanIcon className="w-[1em] h-[1em]" /> },
  { label: 'Notion',        icon: <NotionIcon className="w-[1em] h-[1em]" /> },
  { label: 'Claude',        icon: <ClaudeIcon className="w-[1em] h-[1em]" /> },
  { label: 'OpenRouter',    icon: <OpenRouterIcon className="w-[1em] h-[1em]" /> },
];

/** Divide un texto en spans .reveal-word para el reveal scroll-driven palabra por palabra */
function Words({ children }) {
  return String(children)
    .split(/(\s+)/)
    .map((part, i) =>
      /^\s+$/.test(part) || part === ''
        ? part
        : <span key={i} className="reveal-word">{part}</span>
    );
}

export default function About() {
  const containerRef = useRef(null);
  const bioRef       = useRef(null);
  const { t, lang }  = useLanguage();

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      revealHeaders(containerRef.current);

      gsap.utils.toArray('[data-reveal]', containerRef.current).forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ── Reveal word-by-word scroll-driven del bio (scrub) ──
  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !bioRef.current) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray('.reveal-word', bioRef.current);
      if (!words.length) return;
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.05,
          scrollTrigger: {
            trigger: bioRef.current,
            start: 'top 80%',
            end: 'bottom 55%',
            scrub: true,
          },
        }
      );
    }, bioRef);

    return () => ctx.revert();
  }, [lang]);

  return (
    <section id="about" ref={containerRef} className="pt-12 pb-10 md:pt-16 md:pb-12">
      <div className="max-w-6xl mx-auto px-6 md:px-6">

        {/* ── Header ── */}
        <div className="mb-10 md:mb-8">
          <p data-anim="eyebrow" className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 mb-3">
            {t('about.label')}
          </p>
          <h2 data-anim="title" className="text-3xl md:text-4xl font-semibold text-white">
            {t('about.heading')}{' '}
            <em className="not-italic accent-subtle">{t('about.heading.accent')}</em>
          </h2>
        </div>

        {/* ── Bio + Tools ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-10 mb-12 md:mb-12">

          {/* Bio */}
          <div ref={bioRef} data-reveal className="space-y-4 text-neutral-400 text-base leading-relaxed">
            <p>
              <Words>{t('about.bio.1.pre')}</Words>
              <span className="text-brand-500 font-medium"><Words>Christian Estrada</Words></span>
              {t('about.bio.1.post').split('INNOVA').map((part, i, arr) => (
                <span key={i}>
                  <Words>{part}</Words>
                  {i < arr.length - 1 && (
                    <a href="https://innovathon.innovacuu.xyz/" target="_blank" rel="noopener noreferrer" className="text-brand-500 font-medium hover:text-brand-400 transition-colors duration-200">INNOVA</a>
                  )}
                </span>
              ))}
            </p>
            <p>
              <Words>{t('about.bio.2.pre')}</Words>
              <span className="text-brand-500"><Words>{t('about.bio.2.expanding')}</Words></span>.
            </p>
            <p>
              <Words>{t('about.bio.3.pre')}</Words>
              <span className="text-brand-500"><Words>{t('about.bio.3.hackathons')}</Words></span>
              <Words>{t('about.bio.3.post')}</Words>
            </p>
          </div>

          {/* Tools */}
          <div data-reveal>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 mb-5">
              {t('about.tools.label')}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              {TOOLS.map(({ label, icon }, i) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-neutral-200 transition-colors duration-200 cursor-default text-base"
                >
                  <span className="text-[1.1em] opacity-75">{icon}</span>
                  <span className="font-mono text-xs">{label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tech icons ── */}
        <div data-reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 mb-8 md:mb-6">
            {t('about.stack.label')}
          </p>
          <div className="tech-row relative overflow-hidden text-neutral-400" style={{ height: '80px' }}>
            <LogoLoop
              logos={TECH_LOGOS}
              speed={70}
              direction="left"
              logoHeight={window.innerWidth < 768 ? 22 : 32}
              gap={window.innerWidth < 768 ? 28 : 48}
              hoverSpeed={12}
              scaleOnHover
              fadeOut
              ariaLabel={t('about.stack.label')}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
