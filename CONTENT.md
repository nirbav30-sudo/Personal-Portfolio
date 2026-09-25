# Content inventory (Phase 0)

Verbatim copy of everything the live site renders, taken from the unbundled pages on 2026-09-24. I have not edited, summarised or improved anything. Typos and odd characters are kept as they appear (see "Oddities" at the end).

---

## Shared across all pages

### Nav
- Logo: `/public/img/nav-logo.gif` (animated), aria-label "Nirbav"
- Links: Home · Services · About · Projects · Milestones · Certifications · Contact

### Contact block (the same on every page)
- Eyebrow: GET IN TOUCH
- Heading: Let's build / something.
- Paragraph: Have an idea, a project, or just want to say hi? I'm always open to new collaborations and conversations.
- EMAIL: nirbavsankar831@gmail.com → `mailto:nirbavsankar831@gmail.com`
- PHONE / WHATSAPP: [redacted] → `[redacted]`
- LOCATION: Dubai, UAE
- Background image: `/public/img/certifications-bg.jpg`

### Footer
- Wordmark: NIRBAV
- Links: Instagram → `https://instagram.com/tfw_nirbav_` · LinkedIn → `https://www.linkedin.com/in/nirbav-sankar-9b287b400/` · WhatsApp → `[redacted]` · Email → `mailto:nirbavsankar831@gmail.com`
- © 2026 Nirbav Sankar. All rights reserved.
- Dubai, UAE

### Page `<title>`
- Empty on all five pages. The outer shell said "Bundled Page".

---

## index.html (Home)

### Hero
- NIRBAV
- TEEN FOUNDER
- Button: Let's Talk ↗ → `#contact`
- Stat: **20+** Projects completed
- Stat: **2+** Years in innovation
- I'm a teen founder / building the future
- Turning Ideas / Into Reality
- Button: See my work ↗ → `projects.html`
- Background video: `/public/media/hero-bg.mp4`

### About (`#about`)
- Eyebrow: ABOUT ME
- Heading: Who I am
- Portrait: `/public/img/nirbav-portrait.jpg` (alt "Nirbav Sankar"), caption NIRBAV / FOUNDER
- Paragraph:
  > I'm fourteen, chronically over-committed, and fairly sure sleep is a scheduling problem rather than a biological one. I split my time between Model UN committee rooms, physics rabbit holes — right now a fusion-accelerated spacecraft concept for interstellar travel — and building in public: co-founding Aspire.AI, working as a NASA Citizen Scientist on light transit data, and leading design for F1 in Schools. The rest goes to writing on Medium about AI, drafting a fantasy series, learning why my microcontrollers keep breaking, and FIDE-rated chess.
- LANGUAGES: English · Hindi · Tamil · Arabic

### Ongoing experiments
- Eyebrow: ONGOING EXPERIMENTS
- Heading: Things I'm building right now
- Paragraph: Live prototypes, half-broken, being iterated on in public. Click through to try one.
- Card, badge LIVE:
  - **MUN Tool**
  - A real-time platform for running MUN conferences online: motions, amendments, roll call, blocs, resolutions, chair logs, speakers lists, and Soddy AI for procedural questions.
  - Open app.muntool.nirbav.com ↗ → `https://app.muntool.nirbav.com`

---

## projects.html

- Eyebrow: PORTFOLIO
- Heading: Let's see my work

1. **Beyond the Bite** (image `/public/img/beyond-the-bite.jpg`)
   - Brand identity and creative direction for a food-focused podcast, from logo concept through to omnichannel content design across every platform it launched on.
   - Footer: Creative Designer ↗ (not a link)
2. **CBSE Helper** (image `/public/img/cbse-helper.png`)
   - A free tool that photographs a handwritten answer and builds the marking scheme from the question first, awarding each step separately so students see exactly where marks were lost, not just a number.
   - View Project ↗ → `https://cbse-helper-v11.vercel.app/`
3. **More coming soon** (image `/public/img/more-coming-soon.jpg`)
   - New projects are in the works, check back soon for the next one.

---

## services.html

- Eyebrow: WHAT I DO
- Heading: Services
- Background video: `/public/media/services-bg.mp4`
- Six service tiles, each opening a detail panel. The panel copy is below, verbatim from the page script.

### Web Development
I've had the opportunity to build websites for innovative organizations such as Aspire.ai, CBSE Helper, and several regional companies across different industries. Every project has been designed with one goal in mind: creating websites that don't just look great, but also deliver measurable results through performance, usability, and a strong online presence.

My expertise covers the entire web development process—from UI/UX design, responsive layouts, and modern frontend development to backend integration, performance optimization, SEO best practices, and scalable architecture. Whether it's a landing page, portfolio, business website, or a custom web application, I focus on building fast, intuitive, and conversion-driven experiences that work seamlessly across all devices.

A website is often the first impression of a brand, and I believe it should leave a lasting one. By combining clean design, reliable development, and attention to detail, I create websites that help businesses establish credibility, engage their audience, and grow with confidence.

### App Prototyping
Through hackathons, personal projects, and client work, I've built and prototyped applications from scratch under tight deadlines—turning ideas into functional, interactive products in just hours or days. These experiences have taught me how to rapidly validate concepts, prioritize the right features, and create products that solve real problems rather than just looking good.

My expertise spans mobile app UI/UX, wireframing, interactive prototyping, user flows, design systems, rapid MVP creation, and translating ideas into developer-ready designs. I focus on crafting intuitive experiences that are visually polished, easy to navigate, and built around how users actually interact with an app.

Whether you're pitching an idea, preparing for a hackathon, or planning your next startup, I can transform your vision into a high-quality prototype that clearly communicates your product, accelerates development, and lays the foundation for a successful launch.

### Robotics & IoT
From developing robotics projects to building connected IoT systems, I've worked on creating intelligent solutions that combine hardware and software to solve real-world challenges. Whether it's programming microcontrollers, integrating sensors, or designing automated systems, I enjoy turning ideas into working prototypes that interact seamlessly with the physical world.

My expertise includes Arduino and ESP32 development, sensor integration, automation systems, embedded programming, wireless communication (Wi-Fi & Bluetooth), rapid hardware prototyping, IoT dashboards, and end-to-end system integration. I prioritize reliability, scalability, and practical functionality, ensuring every project is built with both performance and usability in mind.

Technology becomes truly impactful when it bridges the gap between the digital and physical worlds. Whether you're building a smart device, an automation solution, or a robotics prototype, I can help transform your concept into a functional, innovative system ready for testing, demonstration, or deployment.

### Product Design
Every successful product starts with a clear understanding of the problem it aims to solve. I work with founders, startups, and innovators to transform ideas into well-defined products by combining strategic thinking, user-centered design, and rapid iteration. From the first sketch to a polished concept, my focus is on creating products that are both functional and desirable.

My expertise includes design thinking, product strategy, user research, wireframing, UI/UX design, prototyping, feature prioritization, design systems, and MVP planning. Every decision is driven by usability, scalability, and creating an experience users genuinely enjoy.

Whether you're validating a startup idea or refining an existing product, I help shape concepts into market-ready solutions that balance business goals with exceptional user experiences.

### AI & Automation
I build AI-powered solutions that eliminate repetitive tasks, improve productivity, and help businesses work smarter. From intelligent workflows to custom AI tools, I develop systems that automate processes, streamline operations, and allow teams to focus on what truly matters.

My expertise includes AI workflow design, prompt engineering, no-code and low-code automation, API integrations, chatbot development, workflow automation, data processing, and business process optimization. Every solution is designed to be reliable, scalable, and tailored to the specific needs of each client.

The best automation is the kind you never have to think about. My goal is to create intelligent systems that save time, reduce manual effort, and seamlessly integrate into your existing workflow.

### Patent Research
Innovation doesn't begin with building—it begins with understanding what's already been created. I conduct comprehensive patent research to help inventors, startups, and businesses evaluate originality, identify existing technologies, and make informed decisions before investing in development.

My expertise includes prior art searches, patent landscape analysis, technology trend research, novelty assessment, competitive intelligence, innovation mapping, and technical documentation review. I focus on delivering clear, actionable insights that reduce risk and strengthen the foundation of new ideas.

A well-researched idea has a far greater chance of becoming a successful innovation. Whether you're preparing for a patent application, validating a concept, or exploring a new market, I provide the research needed to move forward with confidence.

---

## milestones.html

- Eyebrow: RECOGNITION
- Heading: Awards & Honours
- Background image: `/public/img/milestones-bg.jpg`

**01** · CHAIR · DELEGATE · DIRECTOR · MANAGER
- **MUN Circuit**
- I'm a recurring presence across school and open MUN conferences, moving between the delegate's chair and the dais.
- Best Chair · Awarded
- Best Delegate · Awarded
- Best Research · Awarded

**02** · STUDENT-LED TEAM
- **Team Velora**
- A student-led group I help drive that competes across a range of competitions, from innovation challenges to STEM events. We finished among the top 6 of over 150 teams at the Curtin University Dubai STEM Competition.

---

## certifications.html

- Eyebrow: CREDENTIALS
- Heading: Certifications

**01** Litigation Law Simulation. Mayer Brown / Forage · 2025
**02** More coming soon. In progress

---

## Oddities found while copying (not fixed)
- The MUN Tool link shows a literal `↗` instead of the ↗ arrow.
- The MUN Tool link goes to `app.muntool.nirbav.com`, and so does `vercel.json`. DESIGN.md says `app.muntools.nirbav.com` (with an s). Which one is right?
- "Aspire.AI" in About, "Aspire.ai" in Services.
- The hero says "20+ Projects completed" and "2+ Years in innovation". The site shows only about 3 projects, so I can't count 20. The brief says never invent a number, so please confirm these.
- About says "I'm fourteen" and the hero says "TEEN FOUNDER".
- Most of the brief's content is not on the current site: engineering and building-services work, Fulminare, Jason, the SIH solver, CAFO, DataForge x Rime, lunitiAI, UAE Aiders, the Guinness World Record, debate, the named MUN conferences, DYIO, INSPIRE '26, Youth Builder Society, the exam fairness paper, The Dropout Myth, and Medium links. Phase 2 needs you to supply these facts and links.
