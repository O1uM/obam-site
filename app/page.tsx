export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans">
      
      {/* Header */}
      <header className="max-w-3xl mx-auto px-8 py-12">
        <nav className="flex justify-between items-center">
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">obam.ai</span>
          <div className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <a href="#about" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">About</a>
            <a href="#projects" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Projects</a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-8 py-20">
        <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Hi, I'm Olu! 👋
        </h1>
        <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
          [I am a full bodied hobbyist who loves to build fun projects and learn new things. This is my personal website where I share my projects and thoughts. Feel free to explore and reach out if you want to connect!
        </p>
      </section>

      {/* About */}
      <section id="about" className="max-w-3xl mx-auto px-8 py-16 border-t border-zinc-100 dark:border-zinc-800">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">About me</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
          I am a Global Citizen, Electrical Engineer, Data Scientist, traveller. <br></br> 
          I love life and plan to live if fully. I am passionate about learning and building things that can make a positive impact on the world. I am always curious and eager to explore new ideas and technologies. I believe in the power of collaboration and community, and I enjoy connecting with like-minded people who share my interests and values
        </p>
      </section>

      {/* Projects */}
      <section id="projects" className="max-w-3xl mx-auto px-8 py-16 border-t border-zinc-100 dark:border-zinc-800">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-8">Projects</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          
          {/* Project card */}
          <a href="/family-tree" className="group block p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:underline">Family Tree</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">An interactive visualization of my family history.</p>
          </a>

          {/* Placeholder card for future projects */}
          <div className="p-6 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-400 dark:text-zinc-600">More coming soon</h3>
            <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-600">New projects on the way.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-8 py-12 border-t border-zinc-100 dark:border-zinc-800">
        <p className="text-sm text-zinc-400 dark:text-zinc-600">© 2026 [Your Name]</p>
      </footer>

    </div>
  );
}