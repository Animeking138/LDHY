# LDHY — Linux Distros Heck Yeah

A curated directory of Linux distributions. Metadata completeness and verification vary by entry; check each project's official documentation before making installation or support decisions.

## Website

🔗 **[https://animeking138.github.io/LDHY/](https://animeking138.github.io/LDHY/)**

## Features

- **126 Linux distributions** organized by base family (Debian, Arch, RPM, Gentoo, Slackware, Source/Nix, and Others)
- **Difficulty badges** — Beginner, Intermediate, Advanced, Expert
- **Official download links** where available, with DistroWatch fallback for others
- **Paid (subscription)** section with pricing for RHEL, SUSE, Ubuntu Pro, and Zorin OS Pro
- **Not found** section for distros without available links
- **AMOLED theme** with a true black page background (`#000000`)
- **Responsive design** — works on mobile and desktop
- JavaScript powers search, filtering, and detail pages; Google Fonts is an external font dependency. No analytics or tracking code is intentionally included.

## Security and deployment notes

- `index.html` includes a Content Security Policy meta element. The other response headers are configured by `server.py` for local/self-hosted serving; GitHub Pages does not run that Python server, so those headers are not automatically applied to the hosted site.
- External links should use HTTPS and `rel="noopener noreferrer"` when opened in a new tab.
- JavaScript is used by the catalog and detail pages; review future data-rendering changes and avoid inserting untrusted values with `innerHTML`.

## Contributing

If you know of any other distros or you have a distro, feel free to add it! Open a pull request or issue with the distro name, download link, and difficulty level.

## Vibecoded

This project was vibecoded.

## License

MIT


## Data quality

The main catalog currently contains 107 entries. Family labels have been cleaned of scraped count/HTML artifacts. Maintenance status is marked **Not yet verified** until it has been checked against each project's current official information. Release dates, difficulty labels, pricing and historical metadata should be treated as provisional unless a primary source is provided. The extended archive is a separate list and may not contain exactly the same entries as the main catalog.


## Recently added entries

Added 11 entries after checking for normalized-name collisions against the existing main catalog: Bazzite, Bedrock Linux, Bottlerocket, DietPi, Flatcar Container Linux, Mobian, Nobara Linux, Qubes OS, Ubuntu Touch, Vanilla OS and Whonix. Each new record links to its project's official site. Release dates are left blank where a reliable initial-release date was not established; difficulty labels are editorial estimates, not official project ratings.


## Lesser-known additions

Added eight entries after normalized-name duplicate checks: Exodia OS, AcreetionOS, aerynOS, Adélie Linux, Exherbo, NuTyX, OpenWrt and Dragora GNU/Linux-Libre. Descriptions and technical details were checked against project sources. aerynOS is explicitly labelled Alpha; Exodia OS is noted as having editions described by its project as under testing. Other maintenance statuses remain unverified rather than being guessed. Difficulty labels are editorial estimates.
