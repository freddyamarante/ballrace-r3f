export default function Interface() {
  return (
    <div className="interface">
      {/* Time */}
      <div className="time">0.00</div>

      {/* Restart */}
      <div className="restart">RESTART</div>

      {/* Controls */}
      <div className="controls">
        <div className="raw">
          <div className="key"></div>
        </div>
        <div className="raw">
          <div className="key"></div>
          <div className="key"></div>
          <div className="key"></div>
        </div>
        <div className="raw">
          <div className="key large"></div>
        </div>
      </div>
    </div>
  )
}
