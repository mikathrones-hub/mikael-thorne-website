import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import { supabase, supabaseConfigured } from "./lib/supabase";
import "./styles.css";

const demoBooks = [
  { title: "The Eclipse and the Son", status: "IN DEVELOPMENT", blurb: "A detective horror story about Elias Thorne, a case that refuses to stay buried, and the darkness waiting behind the evidence." },
  { title: "Inside Again", status: "IN DEVELOPMENT", blurb: "A supernatural horror story set in Kanazawa, where an impossible closet begins appearing in the places people live — and even in the images of those places." }
];

const demoStories = [
  { title: "The Clockwork Gravedigger", category: "Gothic", excerpt: "A forgotten cemetery keeps time in a way no living clock should.", slug: "the-clockwork-gravedigger" },
  { title: "The Taxidermist of Blackwood", category: "Macabre", excerpt: "Some collections are not meant to be admired.", slug: "the-taxidermist-of-blackwood" },
  { title: "The Bleeding Fresco", category: "Supernatural", excerpt: "Every restoration reveals another part of the room — and something watching from inside the wall.", slug: "the-bleeding-fresco" }
];

function Layout({ children }) {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          <span className="brand-name">Mikael Thorne</span>
          <span className="brand-line">Horror · Mystery · The Unseen</span>
        </Link>
        <nav>
          <Link to="/books">Books</Link>
          <Link to="/stories">Stories</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/about">About</Link>
          {session ? (
            <>
              <Link className="nav-admin" to="/admin">Archive Desk</Link>
              <button className="nav-button" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <Link className="nav-admin" to="/login">Archive Desk</Link>
          )}
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <span>© {new Date().getFullYear()} Mikael Thorne</span>
        <span>Stories from the places where the light doesn't reach.</span>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <>
      <section className="hero">
        <div className="eyebrow">AUTHOR · HORROR · MYSTERY</div>
        <h1>Stories from the places<br /><em>where the light doesn't reach.</em></h1>
        <p className="hero-copy">Horror, mystery, and stories about the things that hide inside ordinary places.</p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/stories">Enter the archive</Link>
          <Link className="button" to="/books">View the books</Link>
        </div>
      </section>
      <section className="section split">
        <div>
          <div className="eyebrow">CURRENT WORK</div>
          <h2>Stories in the dark.</h2>
        </div>
        <p className="section-lead">The website will become a living archive for finished stories, works in progress, journal entries, and the worlds behind the books.</p>
      </section>
      <section className="cards">
        {demoBooks.map(book => <BookCard key={book.title} book={book} />)}
      </section>
    </>
  );
}

function BookCard({ book }) {
  return (
    <article className="card book-card">
      <div className="status">{book.status}</div>
      <h3>{book.title}</h3>
      <p>{book.blurb}</p>
      <span className="card-link">Read about the project →</span>
    </article>
  );
}

function Books() {
  return <Page title="Books & Projects" intro="The novels, stories, and long-form projects currently living in the archive.">
    <div className="cards">{demoBooks.map(book => <BookCard key={book.title} book={book} />)}</div>
  </Page>;
}

function Stories() {
  return <Page title="Stories" intro="A public library of short fiction. New stories will appear here as they are released.">
    <div className="story-list">
      {demoStories.map(story => (
        <Link className="story-row" to={`/stories/${story.slug}`} key={story.slug}>
          <span className="story-category">{story.category}</span>
          <div><h3>{story.title}</h3><p>{story.excerpt}</p></div>
          <span className="arrow">→</span>
        </Link>
      ))}
    </div>
  </Page>;
}

function Story({ slug }) {
  const story = demoStories.find(s => s.slug === slug);
  if (!story) return <Page title="Story not found"><p>The archive could not find that story.</p></Page>;
  return <Page title={story.title} intro={`${story.category} · A short story`}>
    <article className="story-reader">
      <p>This is a temporary reader view. Your real stories will be loaded from Supabase once the Archive Desk is connected.</p>
      <p>The finished reader will support rich story text, publication dates, categories, cover art, and moderated reader comments.</p>
      <div className="reader-divider">✦</div>
      <p>For now, this space is intentionally quiet.</p>
    </article>
  </Page>;
}

function Journal() {
  return <Page title="Journal" intro="Notes from the desk — writing updates, project news, process, and occasional fragments from the archive.">
    <div className="empty-state">The journal is waiting for its first entry.</div>
  </Page>;
}

function About() {
  return <Page title="About Mikael Thorne" intro="An author writing at the intersection of horror, mystery, and the uncanny.">
    <div className="prose">
      <p>This site is the home of Mikael Thorne's fiction: a growing archive of stories, books, notes, and strange little things that refuse to stay forgotten.</p>
      <p>The archive is being built to let readers discover the work while keeping the writing itself at the center.</p>
    </div>
  </Page>;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();
    setMessage("");
    if (!supabase) return setMessage("Supabase is not configured yet.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMessage(error.message);
    navigate("/admin");
  }

  return <Page title="Archive Desk" intro="Private access for the author and site administration.">
    <form className="login-form" onSubmit={login}>
      <label>Email<input value={email} onChange={e => setEmail(e.target.value)} type="email" required /></label>
      <label>Password<input value={password} onChange={e => setPassword(e.target.value)} type="password" required /></label>
      {message && <div className="form-message">{message}</div>}
      <button className="button button-primary" type="submit">Enter the archive</button>
    </form>
  </Page>;
}

function Admin() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("Loading…");

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!supabase) return setStatus("Supabase is not configured.");
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return setStatus("You must sign in.");
      if (!mounted) return;
      setUser(currentUser);
      const { data } = await supabase.from("profiles").select("*").eq("id", currentUser.id).single();
      setProfile(data);
      setStatus(data?.is_admin ? "Admin access confirmed." : "Your account is not marked as an administrator.");
    })();
    return () => { mounted = false; };
  }, []);

  if (!user) return <Page title="Archive Desk"><div className="empty-state">{status}<br /><Link to="/login">Return to login →</Link></div></Page>;

  return <Page title="Archive Desk" intro="Your private control room for the Mikael Thorne archive.">
    <div className="admin-grid">
      <div className="admin-card"><span className="eyebrow">STORIES</span><h3>Write & publish</h3><p>Create drafts, edit stories, publish them, and manage categories.</p><span className="status">COMING NEXT</span></div>
      <div className="admin-card"><span className="eyebrow">BOOKS</span><h3>Projects</h3><p>Manage book pages, statuses, descriptions, and featured projects.</p><span className="status">COMING NEXT</span></div>
      <div className="admin-card"><span className="eyebrow">COMMENTS</span><h3>Reader's Notes</h3><p>Review pending comments and approve or reject them before they appear publicly.</p><span className="status">COMING NEXT</span></div>
      <div className="admin-card"><span className="eyebrow">SITE</span><h3>Settings</h3><p>Change the homepage introduction, tagline, and other site details without touching code.</p><span className="status">COMING NEXT</span></div>
    </div>
    <div className="admin-confirmation">{status}{profile?.is_admin ? " You have administrator permissions." : ""}</div>
  </Page>;
}

function Page({ title, intro, children }) {
  return <section className="page">
    <div className="page-heading">
      <div className="eyebrow">THE ARCHIVE</div>
      <h1>{title}</h1>
      {intro && <p>{intro}</p>}
    </div>
    {children}
  </section>;
}

function App() {
  return <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books" element={<Books />} />
      <Route path="/stories" element={<Stories />} />
      <Route path="/stories/:slug" element={<StoryRoute />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Page title="404"><p>The archive has no record of this place.</p></Page>} />
    </Routes>
  </Layout>;
}

function StoryRoute() {
  const { pathname } = window.location;
  return <Story slug={pathname.split("/").pop()} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>
);
