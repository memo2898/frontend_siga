import './TemplateBuilderSkeleton.css';

export default function TemplateBuilderSkeleton() {
  return (
    <div className="template-builder-skeleton">
      {/* Header Skeleton */}
      <div className="template-builder-skeleton__header">
        <div className="skeleton-pulse skeleton-title" />
        <div className="skeleton-pulse skeleton-button" />
      </div>

      {/* Layout Skeleton */}
      <div className="template-builder-skeleton__layout">
        {/* Left Panel Skeleton */}
        <div className="template-builder-skeleton__left-panel">
          <div className="skeleton-pulse skeleton-tabs" />
          <div className="skeleton-pulse skeleton-item" />
          <div className="skeleton-pulse skeleton-item" />
          <div className="skeleton-pulse skeleton-item" />
          <div className="skeleton-pulse skeleton-item skeleton-item--short" />
        </div>

        {/* Canvas Skeleton */}
        <div className="template-builder-skeleton__canvas">
          <div className="skeleton-pulse skeleton-page-controls" />
          <div className="skeleton-pulse skeleton-canvas-area" />
        </div>

        {/* Right Panel Skeleton */}
        <div className="template-builder-skeleton__right-panel">
          <div className="skeleton-pulse skeleton-panel-title" />
          <div className="skeleton-pulse skeleton-input" />
          <div className="skeleton-pulse skeleton-input" />
          <div className="skeleton-pulse skeleton-input skeleton-input--short" />
        </div>
      </div>
    </div>
  );
}
