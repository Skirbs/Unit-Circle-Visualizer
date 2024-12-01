import githubImg from "../assets/Github.png";
export default function Footer() {
  return (
    <footer className="flex items-center w-full h-12 gap-2 px-2 py-2 mt-3 bg-neutral-800">
      <p>Made by: skirbs </p>
      <a className="h-full" href="https://github.com/Skirbs" target="_blank">
        <img className="h-full" src={githubImg} />
      </a>
    </footer>
  );
}
