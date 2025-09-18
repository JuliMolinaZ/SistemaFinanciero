// ⚡ OPTIMIZACIÓN DE PERFORMANCE Y ANIMACIONES
// ===========================================

import React, { memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Box, useTheme } from '@mui/material';
import { designTheme } from './theme';

// 🎯 COMPONENTE MEMOIZADO PARA PERFORMANCE
export const MemoizedComponent = memo(({ children, ...props }) => {
  return <Box {...props}>{children}</Box>;
});

// 🎨 ANIMACIONES OPTIMIZADAS PARA GPU
export const OptimizedMotion = {
  // Animación de entrada optimizada
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier optimizado
      willChange: 'transform, opacity' // Hint para GPU
    }
  },

  // Animación de escala optimizada
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { 
      duration: 0.3, 
      ease: 'easeOut',
      willChange: 'transform, opacity'
    }
  },

  // Animación de slide optimizada
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { 
      duration: 0.3, 
      ease: 'easeOut',
      willChange: 'transform, opacity'
    }
  },

  // Hover optimizado
  hover: {
    whileHover: { 
      scale: 1.02,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    whileTap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  }
};

// 🎭 COMPONENTE CON ANIMACIONES OPTIMIZADAS
export const PerformanceMotion = memo(({ 
  children, 
  animation = 'fadeInUp',
  delay = 0,
  className,
  ...props 
}) => {
  const animationProps = useMemo(() => OptimizedMotion[animation], [animation]);

  return (
    <motion.div
      {...animationProps}
      style={{
        willChange: 'transform, opacity', // Optimización GPU
        backfaceVisibility: 'hidden', // Previene flickering
        perspective: 1000, // Optimiza transformaciones 3D
        ...props.style
      }}
      className={className}
      transition={{
        ...animationProps.transition,
        delay
      }}
    >
      {children}
    </motion.div>
  );
});

// 🔄 HOOK PARA ANIMACIONES DE SPRING OPTIMIZADAS
export const useOptimizedSpring = (value, config = {}) => {
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, {
    damping: 25,
    stiffness: 300,
    mass: 0.8,
    ...config
  });

  return { motionValue, springValue };
};

// 📊 COMPONENTE DE GRÁFICO OPTIMIZADO
export const OptimizedChart = memo(({ data, type = 'line', ...props }) => {
  const chartRef = useRef(null);
  const { motionValue, springValue } = useOptimizedSpring(0);

  // Memoizar datos procesados
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map((item, index) => ({
      ...item,
      id: item.id || index,
      // Optimizar cálculos pesados
      normalized: item.value / Math.max(...data.map(d => d.value))
    }));
  }, [data]);

  // Usar useCallback para evitar re-renders innecesarios
  const handleDataUpdate = useCallback((newData) => {
    if (chartRef.current) {
      motionValue.set(newData.length);
    }
  }, [motionValue]);

  useEffect(() => {
    handleDataUpdate(processedData);
  }, [processedData, handleDataUpdate]);

  return (
    <Box
      ref={chartRef}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        willChange: 'transform', // Optimización GPU
        ...props.sx
      }}
      {...props}
    >
      <motion.div
        style={{
          opacity: springValue,
          transform: useTransform(springValue, [0, 1], [0.9, 1])
        }}
      >
        {/* Renderizado del gráfico optimizado */}
        {processedData.map((item, index) => (
          <PerformanceMotion
            key={item.id}
            animation="fadeInUp"
            delay={index * 0.05}
          >
            <Box
              sx={{
                height: `${item.normalized * 100}%`,
                background: designTheme.gradients.primary,
                borderRadius: designTheme.borderRadius.sm,
                transition: 'height 0.3s ease'
              }}
            />
          </PerformanceMotion>
        ))}
      </motion.div>
    </Box>
  );
});

// 🎯 VIRTUALIZACIÓN PARA LISTAS LARGAS
export const VirtualizedList = memo(({ 
  items, 
  itemHeight = 60, 
  containerHeight = 400,
  renderItem,
  className,
  ...props 
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = useRef(null);

  // Calcular elementos visibles
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight
    }));
  }, [items, itemHeight, containerHeight, scrollTop]);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <Box
      ref={containerRef}
      className={className}
      sx={{
        height: containerHeight,
        overflowY: 'auto',
        willChange: 'scroll-position', // Optimización GPU
        ...props.sx
      }}
      onScroll={handleScroll}
      {...props}
    >
      <Box sx={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item) => (
          <Box
            key={item.id || item.index}
            sx={{
              position: 'absolute',
              top: item.top,
              left: 0,
              right: 0,
              height: itemHeight,
              willChange: 'transform' // Optimización GPU
            }}
          >
            {renderItem(item, item.index)}
          </Box>
        ))}
      </Box>
    </Box>
  );
});

// 🖼️ IMAGEN LAZY LOADING OPTIMIZADA
export const LazyImage = memo(({ 
  src, 
  alt, 
  placeholder = '/placeholder.jpg',
  className,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const imgRef = useRef(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <Box
      ref={imgRef}
      className={className}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: designTheme.borderRadius.lg,
        backgroundColor: designTheme.colors.semantic.neutral[100],
        ...props.sx
      }}
      {...props}
    >
      {/* Placeholder */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(90deg, 
            ${designTheme.colors.semantic.neutral[200]} 25%, 
            ${designTheme.colors.semantic.neutral[100]} 50%, 
            ${designTheme.colors.semantic.neutral[200]} 75%)`,
          backgroundSize: '200% 100%',
          animation: isLoaded ? 'none' : 'shimmer 1.5s infinite'
        }}
      />
      
      {/* Imagen real */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            willChange: 'opacity' // Optimización GPU
          }}
        />
      )}
    </Box>
  );
});

// 🎨 COMPONENTE DE GRADIENTE ANIMADO OPTIMIZADO
export const AnimatedGradient = memo(({ 
  colors = [designTheme.colors.semantic.primary[400], designTheme.colors.semantic.primary[600]],
  duration = 3,
  className,
  ...props 
}) => {
  const gradientRef = useRef(null);

  useEffect(() => {
    const gradient = gradientRef.current;
    if (!gradient) return;

    // Crear animación CSS optimizada
    const keyframes = `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;

    // Agregar keyframes al documento si no existen
    if (!document.querySelector('#gradient-animation')) {
      const style = document.createElement('style');
      style.id = 'gradient-animation';
      style.textContent = keyframes;
      document.head.appendChild(style);
    }

    gradient.style.background = `linear-gradient(-45deg, ${colors.join(', ')})`;
    gradient.style.backgroundSize = '400% 400%';
    gradient.style.animation = `gradientShift ${duration}s ease infinite`;

    return () => {
      gradient.style.animation = 'none';
    };
  }, [colors, duration]);

  return (
    <Box
      ref={gradientRef}
      className={className}
      sx={{
        willChange: 'background-position', // Optimización GPU
        ...props.sx
      }}
      {...props}
    />
  );
});

// 🔧 HOOK PARA DEBOUNCE OPTIMIZADO
export const useOptimizedDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 🎯 COMPONENTE DE PAGINACIÓN OPTIMIZADA
export const OptimizedPagination = memo(({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className,
  ...props 
}) => {
  const debouncedPage = useOptimizedDebounce(currentPage, 100);

  const handlePageChange = useCallback((newPage) => {
    if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  }, [currentPage, totalPages, onPageChange]);

  const visiblePages = useMemo(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: designTheme.spacing.sm,
        ...props.sx
      }}
      {...props}
    >
      {visiblePages.map((page, index) => (
        <motion.button
          key={index}
          onClick={() => typeof page === 'number' && handlePageChange(page)}
          disabled={page === '...' || page === currentPage}
          whileHover={{ scale: page !== '...' ? 1.1 : 1 }}
          whileTap={{ scale: page !== '...' ? 0.9 : 1 }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: designTheme.borderRadius.md,
            border: page === currentPage 
              ? `2px solid ${designTheme.colors.semantic.primary[400]}`
              : `1px solid ${designTheme.colors.semantic.neutral[300]}`,
            background: page === currentPage 
              ? designTheme.colors.semantic.primary[400]
              : 'rgba(255, 255, 255, 0.9)',
            color: page === currentPage 
              ? designTheme.colors.semantic.primary[900]
              : designTheme.colors.semantic.neutral[700],
            cursor: page === '...' ? 'default' : 'pointer',
            fontWeight: page === currentPage ? 600 : 400,
            fontSize: designTheme.typography.body2.fontSize,
            transition: 'all 0.2s ease',
            willChange: 'transform' // Optimización GPU
          }}
        >
          {page}
        </motion.button>
      ))}
    </Box>
  );
});

// CSS para animaciones optimizadas
const optimizedStyles = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  .optimized-motion {
    will-change: transform, opacity;
    backface-visibility: hidden;
    perspective: 1000px;
  }
`;

// Inyectar estilos optimizados
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = optimizedStyles;
  document.head.appendChild(styleSheet);
}

export default {
  MemoizedComponent,
  OptimizedMotion,
  PerformanceMotion,
  useOptimizedSpring,
  OptimizedChart,
  VirtualizedList,
  LazyImage,
  AnimatedGradient,
  useOptimizedDebounce,
  OptimizedPagination
};
