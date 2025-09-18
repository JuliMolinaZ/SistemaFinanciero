// 📊 STATCARD ENTERPRISE - ALTURA FIJA Y CONTRASTE WCAG AA
// =========================================================

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './StatCard.css';

// 🎯 TIPOS PROFESIONALES
const TrendIcon = ({ trend }) => {
  const iconStyle = { width: '16px', height: '16px' };
  
  switch (trend) {
    case 'up':
      return <TrendingUp style={iconStyle} aria-hidden="true" />;
    case 'down':
      return <TrendingDown style={iconStyle} aria-hidden="true" />;
    default:
      return <Minus style={iconStyle} aria-hidden="true" />;
  }
};

// 🏗️ COMPONENTE STATCARD PROFESIONAL
function StatCard({ 
  title, 
  icon: Icon, 
  value, 
  delta, 
  rightNote, 
  footerLabel, 
  ariaLabel 
}) {
  
  return (
    <section
      aria-label={ariaLabel ?? title}
      className="stat-card-enterprise"
    >
      {/* 📋 Header - Fila 1 */}
      <div className="stat-card-header">
        <h3 className="stat-card-title">
          {title}
        </h3>
        <span className="stat-card-icon-container">
          <Icon className="stat-card-icon" aria-hidden="true" />
        </span>
      </div>

      {/* 📊 Body - Fila 2 (flex-grow) */}
      <div className="stat-card-body">
        <div className="stat-card-value">
          {value}
        </div>
      </div>

      {/* 🔗 Footer - Fila 3 */}
      <div className="stat-card-footer">
        <div className={`stat-card-delta stat-card-delta--${delta?.trend || 'flat'}`}>
          {delta && (
            <>
              <TrendIcon trend={delta.trend} />
              <span className="stat-card-delta-text">
                {delta.pct}
              </span>
            </>
          )}
        </div>
        {rightNote && (
          <div className="stat-card-note">
            {rightNote}
          </div>
        )}
      </div>

      {/* 🏷️ Footer Label Opcional */}
      {footerLabel && (
        <div className="stat-card-footer-label">
          {footerLabel}
        </div>
      )}
    </section>
  );
}

export default StatCard;
