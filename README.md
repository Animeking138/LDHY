# LDHY — Linux Distros Heck Yeah

A searchable catalog of Linux distributions and related operating-system projects. Browse by family, review basic metadata, and follow official project or download links.

**Website:** [LDHY](https://animeking138.github.io/LDHY/)

## Overview

LDHY helps users explore a broad range of operating systems through a categorized catalog. Entries include an estimated difficulty level and, where information is available, details such as the developer, release history, upstream base, package manager, maintenance status, official website, and project or download page.

The catalog includes traditional Linux distributions as well as Android and custom Android ROM projects.

## Note

Android is a Linux Distro we are not ignoring that😂

## Features

- **Browse by family:** explore distributions grouped into families such as Debian-based, Arch-based, RPM-based, Gentoo-based, Slackware-based, source-based, and other categories, alongside Android and other independent distributions.
- **Search and filter:** search catalog entries and narrow results by difficulty or family.
- **Individual detail pages:** open an entry to view its available project information and links.
- **DistroWatch waiting-list entries:** eligible projects are integrated into the existing family categories. Projects without a reliably established base are placed under Others; their waiting-list status and Unknown difficulty remain documented. The separate “not yet ready” category is excluded.
- **Android ROM details:** all Android catalog cards use the shared JSON-driven detail page, including a reminder to verify support for the exact device model and codename. The old `android/` URLs remain available for compatibility.
- **Extended archive:** open `distributions.html` to search the full catalog and sort entries by available release-date or difficulty information.
- **Responsive dark interface:** use the catalog on desktop and mobile, with an AMOLED-friendly black theme.
- **Automatic empty-section handling:** categories with no visible entries are hidden from the page without removing their underlying section or filter option.

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | Main catalog, family sections, search, and filters |
| `distros.json` | Catalog data and metadata |
| `distro.html` | Shared JSON-driven detail-page template |
| `detail.html` | Linux history event detail page |
| `android/` | Legacy Android detail URLs retained for compatibility |
| `distributions.html` | Extended catalog archive |
| `.github/workflows/` | GitHub Actions workflows, including catalog validation |
| `tools/catalog-validator/` | Rust-based catalog validation tool |
| `server.py` | Local development server on `127.0.0.1:8000` |

## Data quality and safety

Catalog information can be incomplete, outdated, or awaiting verification. Difficulty labels are approximate guidance, not objective measures of how easy an operating system is to use.

Before downloading or installing anything, check the project's official documentation for current maintenance status, supported hardware, system requirements, and installation instructions. This is especially important for Android ROMs: builds are device-specific, and support for one model or codename does not imply support for another. Treat unofficial builds separately from official project releases.

LDHY is an informational catalog. It does not develop, distribute, endorse, or install the operating systems listed.

### Metadata conventions

A blank metadata field means the value has not been independently verified or does not apply. DistroWatch waiting-list entries intentionally leave base, package manager, creator, and release fields blank and use the Others family with an “Unknown” difficulty until reliable project information is reviewed; it is not an invitation to infer a value from a broad family label. `Not yet verified` means the project's current maintenance state has not been confirmed. Check official project documentation before relying on any catalog entry. Entries with `source` and `verified` fields include an official page used for the check and the date it was reviewed. These fields document provenance; they do not imply that every metadata field has been independently confirmed.

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
