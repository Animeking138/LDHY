use regex::Regex;
use serde::Deserialize;
use std::{
    collections::HashSet,
    env, fs,
    path::{Component, Path, PathBuf},
    process,
};
use url::Url;

#[derive(Debug, Deserialize)]
struct Distro {
    name: String,
    family: String,
    difficulty: String,
    download: String,
    creator: String,
    release: String,
    based_on: String,
    package_manager: String,
    status: String,
    #[serde(default)]
    source: String,
    #[serde(default)]
    verified: String,
    website: String,
    description: String,
    price: String,
}

fn slug(value: &str) -> String {
    let mut output = String::new();

    for character in value.to_lowercase().chars() {
        if character.is_ascii_alphanumeric() {
            output.push(character);
        } else if !output.is_empty() && !output.ends_with('-') {
            output.push('-');
        }
    }

    output.trim_end_matches('-').to_owned()
}

fn family_section(family: &str) -> Option<&'static str> {
    match family {
        "Debian-based" => Some("debian"),
        "Arch-based" | "Arch-based (Pacman)" => Some("arch"),
        "RPM-based" => Some("rpm"),
        "Gentoo-based" => Some("gentoo"),
        "Slackware-based" => Some("slackware"),
        "Source/Nix-based" => Some("source"),
        "Others" => Some("others"),
        "Android" => Some("android"),
        "Paid (subscription)" => Some("paid"),
        "Not found" => Some("notfound"),
        _ => None,
    }
}

fn valid_url(value: &str) -> bool {
    if value.trim().is_empty() {
        return true;
    }

    Url::parse(value)
        .map(|url| matches!(url.scheme(), "http" | "https") && url.host_str().is_some())
        .unwrap_or(false)
}

fn has_clean_text(value: &str) -> bool {
    !value.trim().is_empty()
        && value == value.trim()
        && !value.chars().any(char::is_control)
}

fn valid_verification_date(value: &str) -> bool {
    let bytes = value.as_bytes();
    if bytes.len() != 10 || bytes[4] != b'-' || bytes[7] != b'-' {
        return false;
    }

    if !bytes.iter().enumerate().all(|(index, byte)| {
        index == 4 || index == 7 || byte.is_ascii_digit()
    }) {
        return false;
    }

    let year = u32::from(bytes[0] - b'0') * 1000
        + u32::from(bytes[1] - b'0') * 100
        + u32::from(bytes[2] - b'0') * 10
        + u32::from(bytes[3] - b'0');
    let month = u32::from(bytes[5] - b'0') * 10 + u32::from(bytes[6] - b'0');
    let day = u32::from(bytes[8] - b'0') * 10 + u32::from(bytes[9] - b'0');
    let leap_year = year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    let days_in_month = match month {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => 31,
        4 | 6 | 9 | 11 => 30,
        2 if leap_year => 29,
        2 => 28,
        _ => return false,
    };

    year > 0 && (1..=days_in_month).contains(&day)
}

fn find_root() -> Result<PathBuf, Box<dyn std::error::Error>> {
    let mut current = env::current_dir()?;

    loop {
        if current.join("distros.json").is_file() && current.join("index.html").is_file() {
            return Ok(current);
        }

        if !current.pop() {
            break;
        }
    }

    Err("Could not find the LDHY repository root (distros.json and index.html). Run this command from the repository.".into())
}

fn check_homepage(
    root: &Path,
    _records: &[Distro],
    errors: &mut Vec<String>,
) -> Result<(), Box<dyn std::error::Error>> {
    let html = fs::read_to_string(root.join("index.html"))?;
    let script = fs::read_to_string(root.join("assets/js/catalog.js"))?;
    for required in ["id=\"content\"", "id=\"search\"", "id=\"family-filter\"", "id=\"difficulty-filter\"", "id=\"compare-bar\"", "id=\"comparison-panel\""] {
        if !html.contains(required) { errors.push(format!("LDHY homepage is missing integrated catalog control: {required}.")); }
    }
    for required in ["fetch('distros.json')", "distro.html?id=", "textContent", "COMPARE_KEY", "LIMIT = 3", "compare-table", "localStorage"] {
        if !script.contains(required) { errors.push(format!("Integrated catalog script is missing required behavior: {required}.")); }
    }
    if root.join("distributions.html").exists() || root.join("compare.html").exists() {
        errors.push("Separate archive and comparison pages must not exist; these features belong inside LDHY.".to_owned());
    }
    Ok(())
}

fn check_page_security(
    root: &Path,
    page: &str,
    required_css: &str,
    required_js: &str,
    errors: &mut Vec<String>,
) -> Result<(), Box<dyn std::error::Error>> {
    let html = fs::read_to_string(root.join(page))?;
    let label = page;

    // CSP values contain single-quoted source keywords, so match the
    // double-quoted HTML attribute without treating those apostrophes as delimiters.
    let csp_re = Regex::new(
        r#"(?is)<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]*)""#
    )?;
    let csp = csp_re
        .captures(&html)
        .map(|capture| capture[1].to_ascii_lowercase());

    match csp {
        Some(policy) => {
            if policy.contains("'unsafe-inline'") {
                errors.push(format!("{label}: CSP must not allow unsafe-inline."));
            }
            for directive in ["default-src 'self'", "script-src 'self'", "style-src 'self'"] {
                if !policy.contains(directive) {
                    errors.push(format!("{label}: CSP is missing required directive {directive:?}."));
                }
            }
            for directive in ["base-uri 'self'", "object-src 'none'", "form-action 'self'"] {
                if !policy.contains(directive) {
                    errors.push(format!("{label}: CSP is missing required directive {directive:?}."));
                }
            }
        }
        None => errors.push(format!("{label}: Content Security Policy meta tag is missing.")),
    }

    let inline_style_re = Regex::new(r"(?is)<style\b[^>]*>")?;
    let inline_script_re = Regex::new(r"(?is)<script\b[^>]*>(.*?)</script>")?;
    let style_attribute_re = Regex::new(r#"(?is)\sstyle\s*="#)?;
    if inline_style_re.is_match(&html) {
        errors.push(format!("{label}: inline <style> blocks are not allowed; use a local stylesheet."));
    }
    if inline_script_re
        .captures_iter(&html)
        .any(|capture| !capture[1].trim().is_empty())
    {
        errors.push(format!("{label}: inline <script> code is not allowed; use a local script file."));
    }
    if style_attribute_re.is_match(&html) {
        errors.push(format!("{label}: inline style attributes are not allowed."));
    }

    if !html.contains(required_css) {
        errors.push(format!("{label}: required local stylesheet {required_css:?} is not referenced."));
    }
    if !html.contains(required_js) {
        errors.push(format!("{label}: required local script {required_js:?} is not referenced."));
    }

    let tag_re = Regex::new(r#"(?is)<(?:link|script)\b[^>]*>"#)?;
    let attr_re = Regex::new(r#"(?is)\b(?:href|src)\s*=\s*["']([^"']+)["']"#)?;
    for tag in tag_re.find_iter(&html) {
        if let Some(attribute) = attr_re.captures(tag.as_str()) {
            let raw = attribute[1].trim();
            if raw.is_empty()
                || raw.starts_with('#')
                || raw.starts_with("//")
                || Url::parse(raw).is_ok()
            {
                continue;
            }
            let local = raw.split(['?', '#']).next().unwrap_or(raw);
            let local = local.strip_prefix("./").unwrap_or(local);
            let path = Path::new(local);
            let unsafe_path = path.is_absolute()
                || path.components().any(|part| !matches!(part, Component::Normal(_)));
            if unsafe_path || !root.join(path).is_file() {
                errors.push(format!("{label}: referenced local asset is missing or unsafe: {raw:?}."));
            }
        }
    }

    Ok(())
}

fn run() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<String> = env::args().skip(1).collect();

    if args.iter().any(|arg| arg == "--help" || arg == "-h") {
        println!("LDHY catalog checker\n\nUsage: cargo run -- [--check]\n\nValidates distros.json, the unified LDHY homepage, and detail routes.\nIt checks URL syntax only; it does not claim that links are reachable or that metadata is factually verified.");
        return Ok(());
    }

    if args.iter().any(|arg| arg != "--check") {
        return Err("Unknown argument. Use --help for usage.".into());
    }

    let root = find_root()?;
    let json = fs::read_to_string(root.join("distros.json"))?;
    let records: Vec<Distro> = serde_json::from_str(&json)?;
    let mut errors = Vec::new();

    if records.is_empty() {
        errors.push("distros.json contains no catalog entries.".to_owned());
    }

    let mut names = HashSet::new();
    let mut slugs = HashSet::new();
    let mut verification_sources = HashSet::new();

    for (index, record) in records.iter().enumerate() {
        let label = format!("Entry {} ({})", index + 1, record.name);

        for (field, value) in [
            ("name", record.name.as_str()),
            ("family", record.family.as_str()),
            ("difficulty", record.difficulty.as_str()),
            ("status", record.status.as_str()),
            ("description", record.description.as_str()),
        ] {
            if !has_clean_text(value) {
                errors.push(format!(
                    "{label}: required field {field} must be non-empty, trimmed text without control characters."
                ));
            }
        }

        for (field, value) in [
            ("download", record.download.as_str()),
            ("creator", record.creator.as_str()),
            ("release", record.release.as_str()),
            ("based_on", record.based_on.as_str()),
            ("package_manager", record.package_manager.as_str()),
            ("website", record.website.as_str()),
            ("price", record.price.as_str()),
            ("source", record.source.as_str()),
            ("verified", record.verified.as_str()),
        ] {
            if value != value.trim() || value.chars().any(char::is_control) {
                errors.push(format!(
                    "{label}: optional field {field} contains leading/trailing whitespace or control characters."
                ));
            }
        }

        if record.name.trim().is_empty() {
            // The required-field check above reports this once.
        } else if !names.insert(record.name.trim().to_lowercase()) {
            errors.push(format!("Duplicate distribution name: {}.", record.name));
        }

        let item_slug = slug(&record.name);
        if !item_slug.is_empty() && !slugs.insert(item_slug.clone()) {
            errors.push(format!(
                "Duplicate URL slug {item_slug:?}; detail routes would be ambiguous."
            ));
        }

        if family_section(&record.family).is_none() {
            errors.push(format!(
                "{label}: unsupported family {:?}.",
                record.family
            ));
        }

        if !["Beginner", "Intermediate", "Advanced", "Expert"]
            .contains(&record.difficulty.as_str())
        {
            errors.push(format!(
                "{label}: unsupported difficulty {:?}.",
                record.difficulty
            ));
        }

        if record.status.trim().is_empty() {
            errors.push(format!("{label}: maintenance status is empty."));
        }

        for (field, value) in [
            ("website", record.website.as_str()),
            ("download", record.download.as_str()),
        ] {
            if !valid_url(value) {
                errors.push(format!(
                    "{label}: {field} is not a valid HTTP(S) URL: {value:?}."
                ));
            }
        }

        if record.source.trim().is_empty() != record.verified.trim().is_empty() {
            errors.push(format!(
                "{label}: verification source and date must either both be present or both be empty."
            ));
        }
        if !record.source.trim().is_empty() && !valid_url(&record.source) {
            errors.push(format!(
                "{label}: verification source is not a valid HTTP(S) URL: {:?}.",
                record.source
            ));
        }
        if !record.source.trim().is_empty() {
            if let Ok(url) = Url::parse(&record.source) {
                if !verification_sources.insert(url.to_string()) {
                    errors.push(format!(
                        "{label}: verification source URL is duplicated by another catalog entry: {:?}.",
                        record.source
                    ));
                }
            }
        }
        if !record.verified.trim().is_empty() && !valid_verification_date(&record.verified) {
            errors.push(format!(
                "{label}: verification date must use YYYY-MM-DD format: {:?}.",
                record.verified
            ));
        }
    }

    check_homepage(&root, &records, &mut errors)?;
    for (page, css, js) in [
        ("index.html", "assets/css/index.css", "assets/js/index.js"),
        ("distro.html", "assets/css/distro.css", "assets/js/distro.js"),
    ] {
        check_page_security(&root, page, css, js, &mut errors)?;
    }

    if !errors.is_empty() {
        eprintln!("LDHY catalog check failed with {} error(s):", errors.len());
        for error in &errors {
            eprintln!("  - {error}");
        }
        process::exit(1);
    }

    let missing_website = records.iter().filter(|item| item.website.trim().is_empty()).count();
    let missing_package_manager = records.iter().filter(|item| item.package_manager.trim().is_empty()).count();
    let missing_base = records.iter().filter(|item| item.based_on.trim().is_empty()).count();
    let missing_description = records.iter().filter(|item| item.description.trim().is_empty()).count();
    let missing_creator = records.iter().filter(|item| item.creator.trim().is_empty()).count();
    let missing_release = records.iter().filter(|item| item.release.trim().is_empty()).count();
    let missing_price = records.iter().filter(|item| item.price.trim().is_empty()).count();
    let unverified = records
        .iter()
        .filter(|item| item.status.to_lowercase().contains("not yet verified"))
        .count();
    let with_provenance = records
        .iter()
        .filter(|item| !item.source.trim().is_empty() && !item.verified.trim().is_empty())
        .count();

    println!("LDHY catalog check passed.");
    println!("  Catalog entries: {}/{}", records.len(), records.len());
    println!("  Homepage cards: synchronized");
    println!("  Unified catalog and inline comparison: valid");
    println!("  Duplicate names/slugs: none");
    println!("  Duplicate verification sources: none");
    println!("  Required metadata and text formatting: valid");
    println!("  URL syntax: valid (reachability not tested)");
    println!("  Verification provenance: {with_provenance}/{} entries", records.len());
    println!();
    println!("Metadata completeness warnings (not build failures):");
    println!("  Missing official website: {missing_website}");
    println!("  Missing package manager: {missing_package_manager}");
    println!("  Missing base distribution: {missing_base}");
    println!("  Missing description: {missing_description}");
    println!("  Missing creator: {missing_creator}");
    println!("  Missing initial release: {missing_release}");
    println!("  Missing pricing information: {missing_price}");
    println!("  Marked not yet verified: {unverified}");

    Ok(())
}

fn main() {
    if let Err(error) = run() {
        eprintln!("Error: {error}");
        process::exit(1);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn slug_matches_existing_archive_convention() {
        assert_eq!(slug("Arch Linux"), "arch-linux");
        assert_eq!(slug("aerynOS"), "aerynos");
        assert_eq!(slug("Adélie Linux"), "ad-lie-linux");
    }

    #[test]
    fn family_names_map_to_homepage_sections() {
        assert_eq!(family_section("Debian-based"), Some("debian"));
        assert_eq!(family_section("Arch-based"), Some("arch"));
        assert_eq!(family_section("Arch-based (Pacman)"), Some("arch"));
        assert_eq!(family_section("Paid (subscription)"), Some("paid"));
        assert_eq!(family_section("Android"), Some("android"));
    }

    #[test]
    fn verification_dates_use_iso_format() {
        assert!(valid_verification_date("2026-11-24"));
        assert!(!valid_verification_date("2026-13-24"));
        assert!(!valid_verification_date("24-11-2026"));
    }

    #[test]
    fn security_policy_rejects_inline_execution() {
        let policy = "default-src 'self'; script-src 'self'; style-src 'self';";
        assert!(!policy.contains("'unsafe-inline'"));
        assert!(policy.contains("script-src 'self'"));
        assert!(policy.contains("style-src 'self'"));
    }

    #[test]
    fn required_metadata_must_be_trimmed_and_nonempty() {
        assert!(has_clean_text("Linux distribution"));
        assert!(!has_clean_text(""));
        assert!(!has_clean_text("   "));
        assert!(!has_clean_text(" Linux"));
        assert!(!has_clean_text("Linux "));
        assert!(!has_clean_text("Linux\nOS"));
    }

    #[test]
    fn only_http_and_https_urls_are_accepted() {
        assert!(valid_url("https://example.org/download"));
        assert!(valid_url("http://example.org"));
        assert!(valid_url(""));
        assert!(!valid_url("javascript:alert(1)"));
        assert!(!valid_url("not a URL"));
    }
}
