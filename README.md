# LDHY — Linux Distros Heck Yeah

LDHY is a dark-themed catalog for discovering and exploring Linux distributions and Android-based operating systems. It brings a large collection of projects into one searchable, filterable website, with a short quiz to help visitors find Linux distributions worth exploring.

**Website:** https://animeking138.github.io/LDHY/

## What the website includes

### Distribution catalog

- Browse hundreds of catalog entries grouped into families: Debian-based, Arch-based, RPM-based, Gentoo-based, Slackware-based, Source/Nix-based, Maniac, Others, Paid & Commercial, and Android.
- Search by distribution name and filter by family or estimated difficulty.
- Difficulty labels include Beginner, Intermediate, Advanced, Expert, Master, and Unknown / unverified.
- Open a detail page for the available description, family, difficulty estimate, creator, initial release, base, package manager, maintenance status, verification date, pricing information, and project or download link. Empty fields are omitted.
- The Maniac family currently highlights Linux From Scratch, with a custom Master difficulty label and a prominent warning on its detail page.
- Paid and commercial projects are included alongside free distributions.

Catalog information varies by project. Some entries have incomplete or unverified metadata, so difficulty labels should be treated as guidance rather than guarantees.

### Discover Your Distro quiz

The homepage links to a one-question-at-a-time quiz. It asks nine questions about:

- What the visitor is switching from.
- Main computer use.
- Linux experience.
- Hardware.
- Preferred desktop style.
- Desired desktop control.
- Update preferences.
- Interest in compiling and source-building.
- Budget.

Before the questions, the quiz includes its playful “Are you a maniac?” challenge. Choosing “Absolutely.” skips the questionnaire and points to Linux From Scratch; “Nope.” continues to the regular quiz.

Recommendations are generated from the answers and the available catalog metadata. The results can show up to five matches, explain why an entry matched, and flag incomplete or unverified information. The quiz avoids making a recommendation when the available data is not sufficient.

**Scope note:** this is a Linux distribution finder, not an Android ROM compatibility checker. Android projects and custom ROMs can be browsed in the catalog, but the quiz does not match ROMs to a specific phone model or codename.

### Additional pages

- distributions.html is a searchable archive of the shared catalog. It can sort entries by release year or difficulty.
- distro.html is the shared detail-page template used by catalog entries.
- detail.html contains individual Linux history event content.

## Design

- Black, AMOLED-friendly interface with green accents.
- Responsive layout for desktop and mobile screens.
- Search and filter controls on the main catalog.
- Reduced-motion support and visible keyboard focus styles.
- Catalog and detail pages use the shared distros.json data source.

## Project structure

| Path | Purpose |
| --- | --- |
| index.html | Main catalog, search, filters, family sections, and quiz entry point |
| quiz.html | Discover Your Distro questionnaire and recommendations |
| distros.json | Shared catalog data and metadata |
| distro.html | Shared distribution detail page |
| distributions.html | Searchable and sortable catalog archive |
| detail.html | Linux history event detail page |
| android/ | Android-related pages retained in the repository |
| tools/catalog-validator/ | Rust catalog validation utility |
| .github/workflows/ | GitHub Actions workflows |
| server.py | Local development server |

## Run locally

The site is static and can be served locally from the repository root:

```bash
python server.py
```

Then open http://127.0.0.1:8000/ in a browser.

## Catalog accuracy and installation safety

LDHY is an informational discovery catalog. It does not develop, distribute, endorse, or install the listed operating systems.

Project status, release availability, supported hardware, and installation requirements can change. Before installing a distribution, consult its official documentation and download pages. For Android ROMs, confirm that the build explicitly supports the exact device model and codename; support for one device does not imply support for another. Back up important data and follow the project's own installation instructions.

A missing field means the information is not available in the catalog or does not apply. An Unknown / unverified label is not confirmation that a project is safe, maintained, or suitable for a particular device.

## Contributing

Corrections, additions, and suggestions are welcome. Please include the project's official website or source, the proposed catalog details, and reliable sources for claims about release history, maintenance, or device support. Check that the project is not already listed before proposing a new entry.

You can contribute by opening an issue or submitting a pull request.

## Built with

HTML, CSS, JavaScript, JSON, and Rust tooling for catalog validation.
