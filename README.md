# LDHY — Linux Distros Heck Yeah

A searchable catalog of Linux distributions and related operating-system projects. Browse by family, compare basic metadata, and follow official project or download links.

**Website:** [LDHY](https://animeking138.github.io/LDHY/)

## Overview

LDHY helps users explore a broad range of operating systems through a categorized catalog. Entries include an estimated difficulty level and, where information is available, details such as the developer, release history, upstream base, package manager, maintenance status, official website, and project or download page.

The catalog includes traditional Linux distributions as well as Android and custom Android ROM projects.

## Note

Android is a Linux Distro we are not ignoring that😂

## Features

- **Browse by family:** explore distributions grouped into families such as Debian-based, Arch-based, RPM-based, Gentoo-based, Slackware-based, source-based, and other categories, alongside Android.
- **Search and filter:** search catalog entries and narrow results by difficulty or family.
- **Individual detail pages:** open an entry to view its available project information and links.
- **Android ROM details:** all Android catalog cards use the shared JSON-driven detail page, including a reminder to verify support for the exact device model and codename. The old `android/` URLs remain available for compatibility.
- **Extended archive:** browse the larger catalog, search every metadata field, filter by distribution family and difficulty, and sort by newest release year, oldest release year, difficulty, or name.
- **Side-by-side comparison:** open the comparison page directly from the homepage, select up to three distributions in the archive, and compare their available metadata, official links, and maintenance details in one responsive table. Selections stay in the browser using local storage.
- **Responsive dark interface:** use the catalog on desktop and mobile, with an AMOLED-friendly black theme.
- **Automatic empty-section handling:** categories with no visible entries are hidden from the page without removing their underlying section or filter option.

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | Main catalog, family sections, search, and filters |
| `distros.json` | Catalog data and metadata |
| `distro.html` | Shared detail-page template for entries that use it |
| `compare.html` | Side-by-side comparison view for selected catalog entries |
| `android/` | Legacy Android detail URLs retained for compatibility |
| `distributions.html` | Extended catalog archive |
| `.github/workflows/` | GitHub Actions workflows, including catalog validation |
| `tools/catalog-validator/` | Rust-based catalog validation tool |

## Data quality and safety

Catalog information can be incomplete, outdated, or awaiting verification. Difficulty labels are approximate guidance, not objective measures of how easy an operating system is to use.

Before downloading or installing anything, check the project's official documentation for current maintenance status, supported hardware, system requirements, and installation instructions. This is especially important for Android ROMs: builds are device-specific, and support for one model or codename does not imply support for another. Treat unofficial builds separately from official project releases.

LDHY is an informational catalog. It does not develop, distribute, endorse, or install the operating systems listed.

### Metadata conventions

A blank metadata field means the value has not been independently verified or does not apply; it is not an invitation to infer a value from a broad family label. `Not yet verified` means the project's current maintenance state has not been confirmed. Check official project documentation before relying on any catalog entry. Entries with `source` and `verified` fields include an official page used for the check and the date it was reviewed. These fields document provenance; they do not imply that every metadata field has been independently confirmed.

## Security and deployment

The four main pages use local CSS and JavaScript assets and apply a restrictive Content Security Policy through HTML metadata without `unsafe-inline`. The Rust catalog validator checks that each page retains its required CSP directives, references its expected local CSS/JS files, contains no inline script/style blocks or style attributes, and does not reference missing local assets. It also checks the supporting referrer, MIME-sniffing, and browser-permission policies. Catalog checks also reject duplicate names, ambiguous detail slugs, duplicate verification-source URLs, malformed or unsupported required metadata, and text fields with unsafe whitespace/control characters. Optional metadata may remain blank when information is unavailable; the validator reports completeness counts without inventing values.

These metadata policies are defense-in-depth, not a replacement for HTTP response headers. GitHub Pages does not provide a repository-level custom response-header configuration file; headers such as `Strict-Transport-Security`, `X-Frame-Options`, and a response-header CSP require a hosting layer or proxy that supports them. The `frame-ancestors` CSP directive is not supported in a meta policy.

GitHub Actions dependencies should be reviewed and updated regularly. The repository uses GitHub Actions for automated catalog validation; successful CI checks do not replace a security review of third-party workflow actions or catalog destinations.

## Contributing

Corrections, additions, and suggestions are welcome. When proposing a new entry or changing existing metadata, provide:

- The project's name and official website.
- A reliable official project, source, or download link.
- Its family/category and relevant metadata.
- Sources for claims about release history, maintenance, or device support.
- Confirmation that the project is not already listed.

You can contribute by opening an issue or submitting a pull request.

## Built with

HTML, CSS, JavaScript, JSON, and Rust (catalog validation).
