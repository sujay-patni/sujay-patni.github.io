import { personal } from "@/data/personal";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { publications } from "@/data/publications";
import { education } from "@/data/education";

export default function HiddenA11yContent() {
  return (
    <article className="sr-only" aria-label="Portfolio content for screen readers">
      <h1>{personal.name} — {personal.title}</h1>
      <p>{personal.tagline}</p>
      <p>Location: {personal.location}</p>
      <p>Email: {personal.email}</p>

      <section aria-labelledby="a11y-exp">
        <h2 id="a11y-exp">Experience</h2>
        {experience.map((job, i) => (
          <div key={i}>
            <h3>{job.role} at {job.company}</h3>
            <p>{job.team} · {job.period} · {job.location}</p>
            <ul>{job.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
          </div>
        ))}
      </section>

      <section aria-labelledby="a11y-proj">
        <h2 id="a11y-proj">Projects</h2>
        {projects.map((p, i) => (
          <div key={i}>
            <h3>{p.name}</h3>
            <p>{p.period}</p>
            <p>{p.description}</p>
            {p.publication && <p>{p.publication}</p>}
          </div>
        ))}
      </section>

      <section aria-labelledby="a11y-skills">
        <h2 id="a11y-skills">Skills</h2>
        {skills.map((cat) => (
          <div key={cat.category}>
            <h3>{cat.category}</h3>
            <ul>{cat.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        ))}
      </section>

      <section aria-labelledby="a11y-pubs">
        <h2 id="a11y-pubs">Publications</h2>
        {publications.map((pub, i) => (
          <div key={i}>
            <h3>{pub.title}</h3>
            <p>{pub.venue} — {pub.date}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="a11y-edu">
        <h2 id="a11y-edu">Education</h2>
        {education.map((edu, i) => (
          <div key={i}>
            <h3>{edu.institution}</h3>
            <p>{edu.degree} · {edu.score} · {edu.period}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
