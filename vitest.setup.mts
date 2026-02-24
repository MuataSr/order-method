import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

afterEach(() => {
  cleanup();
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

vi.mock('framer-motion', () => {
  const mockForwardRef = (tag: string) => 
    React.forwardRef((props: any, ref: any) => 
      React.createElement(tag, { ...props, ref }, props.children)
    );
  return {
    motion: {
      div: mockForwardRef('div'),
      span: mockForwardRef('span'),
      button: mockForwardRef('button'),
      section: mockForwardRef('section'),
      nav: mockForwardRef('nav'),
      ul: mockForwardRef('ul'),
      li: mockForwardRef('li'),
      h1: mockForwardRef('h1'),
      h2: mockForwardRef('h2'),
      h3: mockForwardRef('h3'),
      p: mockForwardRef('p'),
      a: mockForwardRef('a'),
      img: mockForwardRef('img'),
    },
    AnimatePresence: ({ children }: any) => children,
  };
});

const IntersectionObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

(HTMLCanvasElement.prototype as any).getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  strokeRect: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  restore: vi.fn(),
  save: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  font: '',
  textAlign: '',
  textBaseline: '',
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
}));

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

class MockPointerEvent extends Event {
  pointerId: number;
  clientX: number;
  clientY: number;
  constructor(type: string, props: Record<string, any> = {}) {
    super(type, props);
    this.pointerId = props.pointerId ?? 0;
    this.clientX = props.clientX ?? 0;
    this.clientY = props.clientY ?? 0;
  }
}

vi.stubGlobal('PointerEvent', MockPointerEvent);
