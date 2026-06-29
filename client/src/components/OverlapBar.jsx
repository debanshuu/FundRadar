function OverlapBar({ overlapPercent, fundAName, fundBName }) {
  const isHigh = overlapPercent >= 40

  return (
    <div className="overlap-bar-wrapper">
      <div className="overlap-bar-labels">
        <span>{fundAName}</span>
        <span>{fundBName}</span>
      </div>
      <div className="overlap-bar-track">
        <div className="overlap-bar-fill" style={{ width: `${Math.min(overlapPercent, 100)}%` }} />
      </div>
      <p className="overlap-percent">{overlapPercent}% overlap in top holdings</p>

      {isHigh && (
        <p className="overlap-warning">
          High overlap detected — consider diversifying if your goal is broader exposure.
        </p>
      )}
    </div>
  )
}

export default OverlapBar