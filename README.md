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
- **Android ROM pages:** each of the 42 listed custom Android ROM projects has its own detail page, including a reminder to verify support for the exact device model and codename.
- **Extended archive:** browse the larger catalog and sort entries by available release-date or difficulty information.
- **Responsive dark interface:** use the catalog on desktop and mobile, with an AMOLED-friendly black theme.
- **Automatic empty-section handling:** categories with no visible entries are hidden from the page without removing their underlying section or filter option.

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | Main catalog, family sections, search, and filters |
| `distros.json` | Catalog data and metadata |
| `distro.html` | Shared detail-page template for entries that use it |
| `android/` | Standalone detail pages for the custom Android ROM entries |
| `distributions.html` | Extended catalog archive |
| `.github/workflows/` | GitHub Actions workflows, including catalog validation |
| `tools/catalog-validator/` | Rust-based catalog validation tool |

## Data quality and safety

Catalog information can be incomplete, outdated, or awaiting verification. Difficulty labels are approximate guidance, not objective measures of how easy an operating system is to use.

Before downloading or installing anything, check the project's official documentation for current maintenance status, supported hardware, system requirements, and installation instructions. This is especially important for Android ROMs: builds are device-specific, and support for one model or codename does not imply support for another. Treat unofficial builds separately from official project releases.

LDHY is an informational catalog. It does not develop, distribute, endorse, or install the operating systems listed.

### Metadata conventions

A blank metadata field means the value has not been independently verified or does not apply; it is not an invitation to infer a value from a broad family label. `Not yet verified` means the project's current maintenance state has not been confirmed. Check official project documentation before relying on any catalog entry.

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
