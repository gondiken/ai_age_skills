// Animated SVG robot mascot — friendly face for kids
export default function Mascot({ size = 120, talking = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Antenna */}
      <line x1="60" y1="8" x2="60" y2="22" stroke="#FACC15" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="y1" values="8;4;8" dur="2s" repeatCount="indefinite" />
      </line>
      <circle cx="60" cy="6" r="5" fill="#FACC15">
        <animate attributeName="cy" values="6;2;6" dur="2s" repeatCount="indefinite" />
        <animate attributeName="fill" values="#FACC15;#FB923C;#FACC15" dur="1.5s" repeatCount="indefinite" />
      </circle>

      {/* Head */}
      <rect x="25" y="22" width="70" height="55" rx="18" fill="#60A5FA" />
      <rect x="30" y="27" width="60" height="45" rx="14" fill="#93C5FD" />

      {/* Eyes */}
      <ellipse cx="44" cy="46" rx="9" ry={talking ? 9 : 10} fill="white" />
      <ellipse cx="76" cy="46" rx="9" ry={talking ? 9 : 10} fill="white" />
      <circle cx="46" cy="45" r="5" fill="#1E1B4B">
        <animate attributeName="cx" values="46;48;46;44;46" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="78" cy="45" r="5" fill="#1E1B4B">
        <animate attributeName="cx" values="78;80;78;76;78" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Eye sparkle */}
      <circle cx="43" cy="42" r="2" fill="white" opacity="0.8" />
      <circle cx="75" cy="42" r="2" fill="white" opacity="0.8" />

      {/* Mouth */}
      {talking ? (
        <ellipse cx="60" cy="60" rx="8" ry="5" fill="#1E1B4B">
          <animate attributeName="ry" values="5;3;6;4;5" dur="0.6s" repeatCount="indefinite" />
        </ellipse>
      ) : (
        <path d="M50 58 Q60 66 70 58" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}

      {/* Cheeks */}
      <circle cx="34" cy="55" r="5" fill="#FF6B9D" opacity="0.4" />
      <circle cx="86" cy="55" r="5" fill="#FF6B9D" opacity="0.4" />

      {/* Body */}
      <rect x="35" y="80" width="50" height="30" rx="10" fill="#60A5FA" />
      <rect x="40" y="85" width="40" height="20" rx="7" fill="#93C5FD" />

      {/* Heart on body */}
      <path d="M55 92 Q55 88 58 88 Q60 88 60 91 Q60 88 62 88 Q65 88 65 92 Q65 96 60 100 Q55 96 55 92Z" fill="#FF6B9D">
        <animate attributeName="opacity" values="1;0.6;1" dur="1.5s" repeatCount="indefinite" />
      </path>

      {/* Arms */}
      <rect x="15" y="84" width="18" height="8" rx="4" fill="#60A5FA">
        <animateTransform attributeName="transform" type="rotate" values="-5 25 88;5 25 88;-5 25 88" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="87" y="84" width="18" height="8" rx="4" fill="#60A5FA">
        <animateTransform attributeName="transform" type="rotate" values="5 95 88;-5 95 88;5 95 88" dur="3s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}
