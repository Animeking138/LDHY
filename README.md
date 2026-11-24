# LDHY — Linux Distros Heck Yeah

Finding a Linux distribution shouldn't feel like doing homework.

**LDHY** is a place to explore Linux distributions, compare their backgrounds, and discover projects you might not have heard of. The goal is simple: make the search for your next operating system feel a little less overwhelming — and a lot more fun.

**Take a look:** https://animeking138.github.io/LDHY/

## What can you do here?

### Explore the catalog

There are hundreds of entries to browse, from familiar names like Ubuntu and Linux Mint to smaller independent projects and Android-based systems.

The catalog is organized into groups, including Debian-based, Arch-based, RPM-based, Gentoo-based, Slackware-based, Source/Nix-based, Others, Paid & Commercial, and Android.

You can:
- Search for a project by name.
- Filter the catalog by family or difficulty.
- Open a project's detail page to see the information LDHY has available.
- Browse everything in the searchable archive and sort it by release year or difficulty.

Difficulty labels range from Beginner to Master, with an Unknown / unverified option when the information isn't clear. They're meant to help set expectations, not to judge anyone's experience or promise that a system will be easy.

### Find a distro that fits

Not sure where to start? The **Discover Your Distro** quiz walks you through nine questions, one at a time.

It takes things like your experience with Linux, what you use your computer for, your hardware, desktop preferences, update habits, and interest in building software from source into account. At the end, it suggests a handful of catalog entries and explains why they might suit your answers.

The recommendations depend on the information available in the catalog. If LDHY doesn't have enough reliable information to make a useful suggestion, it won't pretend otherwise.

### Browse Android projects, too

The catalog also includes Android-based operating systems and custom ROM projects. You can explore their entries, but LDHY does not currently check whether a ROM supports a particular phone model or codename. Always confirm device compatibility with the project's own documentation before doing anything with a ROM.

## A quick note about the information

LDHY is a discovery catalog, not the developer or distributor of the projects listed here. Project details, release status, and hardware support can change. Some entries have incomplete or unverified information, and a difficulty label is only an estimate.

Before installing anything, visit the project's official page and read its current documentation. For Android ROMs in particular, make sure the exact device model and codename are supported.

## A few details about the site

- Dark, AMOLED-friendly design with green accents.
- Built to work on both desktop and mobile screens.
- Search and filters to make a large catalog easier to navigate.
- Shared catalog data powers the homepage, archive, and detail pages.
- Keyboard focus and reduced-motion support are included.

## Project structure

| File or folder | What it's for |
| --- | --- |
| `index.html` | Main catalog and starting point |
| `quiz.html` | Discover Your Distro quiz |
| `distros.json` | Shared distribution catalog |
| `distro.html` | Individual project detail pages |
| `distributions.html` | Searchable, sortable archive |
| `detail.html` | Linux history event page |
| `android/` | Android-related pages |
| `tools/catalog-validator/` | Rust catalog validation tool |
| `.github/workflows/` | GitHub Actions workflows |

## Want to help?

Found an outdated detail, a missing project, or something that could be clearer? Contributions and corrections are welcome.

When suggesting a catalog change, include the project's official website or repository and sources for details such as release history, maintenance, or supported devices. It's also worth checking that the project isn't already listed.

---

Made with HTML, CSS, JavaScript, JSON, and a little Rust — for people who love exploring operating systems.
