export default function SongSheetPreview() {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Live Demo
          </p>
          <h3 className="text-lg font-semibold text-white">Neon Skyline</h3>
        </div>
        <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs text-white/70">
          Key: A Major
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-white/60">
        <span>Transpose</span>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
            -
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
            +
          </span>
        </div>
      </div>
      <div className="mt-5 grid gap-3 font-mono text-[15px] text-white/80 sm:text-base">
        <div>
          <p className="text-lime-200">A</p>
          <p>We ride the signal through the night</p>
        </div>
        <div>
          <p className="text-cyan-200">E</p>
          <p>Hold the tempo, keep it tight</p>
        </div>
        <div>
          <p className="text-yellow-200">F#m</p>
          <p>Every chorus starts to rise</p>
        </div>
        <div>
          <p className="text-lime-200">D</p>
          <p>Neon skyline in our eyes</p>
        </div>
        <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            Chorus
          </p>
          <p className="mt-2 text-white/80">
            A&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;F#m&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;D
          </p>
          <p className="text-white/80">
            We are glowing, we are free
          </p>
        </div>
      </div>
    </div>
  );
}
