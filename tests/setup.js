// Jest setup file for DOM testing
require('@testing-library/jest-dom');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock performance API
global.performance = {
  ...global.performance,
  now: jest.fn(() => Date.now()),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
  mark: jest.fn(),
  measure: jest.fn(),
  memory: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 4000000
  }
};

// Mock PerformanceObserver
global.PerformanceObserver = class PerformanceObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Mock navigator.connection
Object.defineProperty(navigator, 'connection', {
  writable: true,
  value: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
    saveData: false
  }
});

// Mock navigator.sendBeacon
Object.defineProperty(navigator, 'sendBeacon', {
  writable: true,
  value: jest.fn(() => true)
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock gtag for analytics
global.gtag = jest.fn();

// Mock fetch
global.fetch = jest.fn();

// Mock window.scrollTo and scroll
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn()
});
Object.defineProperty(window, 'scroll', {
  writable: true,
  value: jest.fn()
});

// Mock PromiseRejectionEvent
global.PromiseRejectionEvent = class PromiseRejectionEvent extends Event {
  constructor(type, eventInitDict) {
    super(type, eventInitDict);
    this.reason = eventInitDict?.reason;
  }
};

// Setup DOM
document.body.innerHTML = '';

// Add common test utilities
global.createMockElement = (tag, attributes = {}) => {
  const element = document.createElement(tag);
  Object.keys(attributes).forEach(key => {
    if (key === 'textContent') {
      element.textContent = attributes[key];
    } else if (key === 'innerHTML') {
      element.innerHTML = attributes[key];
    } else {
      element.setAttribute(key, attributes[key]);
    }
  });
  return element;
};

global.createMockEvent = (type, properties = {}) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.keys(properties).forEach(key => {
    event[key] = properties[key];
  });
  return event;
};

// Clean up after each test
afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});