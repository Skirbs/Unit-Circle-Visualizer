export default function Header({onToggleBackground}) {
  return (
    <header className="sticky inset-x-0 top-0 z-50 flex justify-end px-16 py-3 bg-neutral-800 drop-shadow-md">
      <p className="absolute inset-x-0 text-lg font-bold text-center pointer-events-none lg:text-xl 2xl:text-2xl">Unit Circle Visualizer</p>
      <button
        onClick={onToggleBackground}
        className="cursor-pointer relative hover:opacity-90 after:opacity-0 after:pointer-events-none hover:after:opacity-100 after:transition-all transition-all active:opacity-80 after:content-['Toggle_Background'] after:absolute after:-bottom-10 after:left-1/2 after:-translate-x-1/2 after:bg-neutral-700 after:p-2 after:text-xs after:rounded-lg after:whitespace-nowrap">
        <span className="flex items-center justify-center material-symbols-outlined text-neutral-200">wallpaper</span>
      </button>
    </header>
  );
}
