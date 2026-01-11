# DrapeAI Frontend Challenge

A modern React application featuring 3D animations and smooth scroll interactions. This project demonstrates an interactive product showcase with a Three.js 3D model, GSAP animations, and a seamless scrolling experience.

## Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Three.js** - 3D rendering
- **GSAP** - Animation library (ScrollTrigger, SplitText)
- **Lenis** - Smooth scroll
- **CSS Modules** - Scoped styling

## How to Run

```bash
npm install
npm run dev
```

## Technical Notes

### Architecture Decisions

- **Component-based structure**: Organized components in separate folders with CSS Modules for better maintainability and code reusability
- **Custom hooks**: Created `useThreeScene`, `useScrollAnimations`, and `useLenis` to encapsulate complex logic and keep components clean
- **CSS Modules**: Used for scoped styling to avoid CSS conflicts and improve code organization

### Trade-offs

- Used querySelector with refs instead of pure React state for GSAP animations to maintain compatibility with GSAP's DOM manipulation
- Kept the original GSAP ScrollTrigger logic structure while adapting it to React hooks pattern
- Used class selectors in animations (via refs) which works well with CSS Modules but requires careful element selection

### With More Time

- **TypeScript**: Add TypeScript for better type safety and developer experience
- **Performance optimization**: Implement React.memo and useMemo where needed, optimize Three.js render loop
- **Testing**: Add unit tests with Jest/React Testing Library and integration tests
- **Error handling**: Add error boundaries and loading states for the 3D model
- **Accessibility**: Improve ARIA labels and keyboard navigation
- **Mobile optimization**: Further optimize the 3D model rendering and animations for mobile devices
- **Code splitting**: Implement lazy loading for components to reduce initial bundle size
- **Animation performance**: Fine-tune GSAP animations and add will-change properties strategically
